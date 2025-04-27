import { Carousel, theme } from 'antd'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGetMoviesByUpdateQuery, useLazyGetMovieByIdQuery } from '~/services/ophimApi'
import getRandomMovies from '~/utils/getRandomMovies'
import randomPage from '~/utils/randomPage'
import styles from './CarouselMovies.module.scss'
import { CarouselItem, CarouselSkeleton, ThumbnailItem } from './components'

const cx = classNames.bind(styles)

const CarouselMovies = ({ maxItems, autoPlaySpeed }) => {
	// Sử dụng useRef để lưu trang ngẫu nhiên
	const pageRef = useRef(randomPage())
	const { data, isLoading: isLoadingList } = useGetMoviesByUpdateQuery(pageRef.current)

	const [fetchMovieById, { isLoading: isLoadingDetails }] = useLazyGetMovieByIdQuery()

	const mainCarouselRef = useRef(null)
	const thumbCarouselRef = useRef(null)
	const prevMoviesRef = useRef([]) // Sử dụng ref để theo dõi movies trước đó

	const { token } = theme.useToken()
	const [movies, setMovies] = useState([])
	const [currentSlide, setCurrentSlide] = useState(0)

	// Tối ưu loading state với useMemo
	const isLoading = useMemo(
		() => isLoadingList || isLoadingDetails || movies.length === 0,
		[isLoadingList, isLoadingDetails, movies.length],
	)

	// Tối ưu việc chọn phim ngẫu nhiên
	const randomMovies = useMemo(() => getRandomMovies(data?.items || [], maxItems || 7), [data?.items, maxItems])

	// Fetch movie details với hiệu suất tốt hơn
	useEffect(() => {
		if (!randomMovies.length) return

		let isMounted = true
		const movieIds = new Set(randomMovies.map((movie) => movie._id))

		// Lọc những movie cần fetch
		const movieIdsToFetch = randomMovies.filter(
			(movie) => !prevMoviesRef.current.some((prevMovie) => prevMovie?.movie?._id === movie._id),
		)

		if (movieIdsToFetch.length === 0) {
			// Chỉ lọc movies đã fetch mà còn ở trong danh sách hiện tại
			const currentMovies = prevMoviesRef.current.filter((movie) => movieIds.has(movie?.movie?._id))

			if (currentMovies.length > 0) {
				setMovies(currentMovies)
			}
			return
		}

		// Fetch chỉ những movie chưa có
		Promise.all(movieIdsToFetch.map((movie) => fetchMovieById(movie._id).unwrap()))
			.then((fetchedMovies) => {
				if (isMounted) {
					// Kết hợp movies hiện tại với movies mới
					const currentMovies = prevMoviesRef.current.filter((movie) => movieIds.has(movie?.movie?._id))
					const newMoviesList = [...currentMovies, ...fetchedMovies]
					setMovies(newMoviesList)
					prevMoviesRef.current = newMoviesList
				}
			})
			.catch((err) => console.error('Error fetching movie details:', err))

		return () => {
			isMounted = false
		}
	}, [randomMovies, fetchMovieById])

	// Xử lý sự kiện khi slide chính thay đổi
	const handleMainBeforeChange = useCallback((oldIndex, newIndex) => {
		setCurrentSlide(newIndex)
		if (thumbCarouselRef.current) {
			thumbCarouselRef.current.goTo(newIndex)
		}
	}, [])

	// Xử lý click vào thumbnail với useCallback để tối ưu render
	const handleThumbnailClick = useCallback((index) => {
		setCurrentSlide(index)
		if (mainCarouselRef.current) {
			mainCarouselRef.current.goTo(index)
		}
	}, [])

	// Tạo memoized click handlers cho từng thumbnail
	const createThumbnailClickHandler = useCallback((index) => () => handleThumbnailClick(index), [handleThumbnailClick])

	// Đồng bộ slide với useEffect
	useEffect(() => {
		if (mainCarouselRef.current && thumbCarouselRef.current && movies.length > 0) {
			mainCarouselRef.current.goTo(currentSlide)
			thumbCarouselRef.current.goTo(currentSlide)
		}
	}, [currentSlide, movies.length])

	if (!token?.colorBgLayout) return null

	// Render skeleton loading state
	if (isLoading) {
		return <CarouselSkeleton />
	}

	return (
		<div className={cx('carousel-movies')}>
			{/* Main Carousel - Tối ưu performance */}
			<Carousel
				className={cx('carousel-main')}
				ref={mainCarouselRef}
				fade
				draggable
				lazyLoad='ondemand'
				dots={false}
				beforeChange={handleMainBeforeChange}
				autoplay={!!autoPlaySpeed}
				autoplaySpeed={autoPlaySpeed || 3000}>
				{movies?.map((item) => (
					<div key={item?.movie?._id}>
						<div className={cx('carousel-img-wrapper')}>
							<img
								className={cx('carousel-img')}
								src={item?.movie?.poster_url}
								alt={item?.movie?.name || 'movie poster'}
								loading='lazy'
							/>
						</div>
						<CarouselItem movie={item?.movie} />
					</div>
				))}
			</Carousel>

			{/* Paging Carousel - Tối ưu với ThumbnailItem */}
			<Carousel
				className={cx('carousel-paging')}
				variableWidth
				adaptiveHeight
				dots={false}
				draggable
				centerMode
				centerPadding='0'
				ref={thumbCarouselRef}
				slidesToShow={5}
				swipeToSlide
				initialSlide={currentSlide}>
				{movies?.map((item, index) => (
					<ThumbnailItem
						key={item?.movie?._id || index}
						isActive={index === currentSlide}
						posterUrl={item?.movie?.poster_url}
						movieName={item?.movie?.name}
						onClick={createThumbnailClickHandler(index)}
					/>
				))}
			</Carousel>
		</div>
	)
}

CarouselMovies.propTypes = {
	maxItems: PropTypes.number,
	autoPlaySpeed: PropTypes.number,
}

CarouselMovies.defaultProps = {
	maxItems: 7,
	autoPlaySpeed: 0, // 0 means no autoplay
}

export default memo(CarouselMovies)
