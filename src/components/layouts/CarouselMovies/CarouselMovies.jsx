import { Button, Carousel, ConfigProvider, Flex, Skeleton, theme } from 'antd'
import Typography from 'antd/es/typography/Typography'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useGetMoviesByUpdateQuery, useLazyGetMovieByIdQuery } from '~/services/ophimApi'
import { buttonTheme } from '~/themes/buttonTheme'
import getRandomMovies from '~/utils/getRandomMovies'
import randomPage from '~/utils/randomPage'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'
import styles from './CarouselMovies.module.scss'

const cx = classNames.bind(styles)

// Tách thành component riêng để giảm re-render không cần thiết
const CarouselSkeleton = memo(() => (
	<div className={cx('carousel-movies')}>
		<div className={cx('carousel-skeleton')}>
			<div className={cx('skeleton-img-wrapper')}>
				<Skeleton.Image className={cx('skeleton-img')} active />
			</div>
			<div className={cx('carousel-content')}>
				<Skeleton active paragraph={{ rows: 4 }} title={{ width: '60%' }} />
				<Skeleton.Button active size='large' shape='circle' style={{ width: 70, height: 70, marginTop: 20 }} />
			</div>
		</div>
		<Flex className={cx('carousel-paging-skeleton')} align='center' justify='center' gap={10}>
			{[...Array(5)].map((_, index) => (
				<Skeleton.Image className={cx('thumbnail-skeleton')} key={index} active />
			))}
		</Flex>
	</div>
))

// Tách thành component riêng để giảm re-render không cần thiết
const CarouselItem = memo(({ movie }) => (
	<div className={cx('carousel-content')}>
		<Typography.Title level={4} className={cx('carousel-title')}>
			{movie?.name}
		</Typography.Title>
		<Flex gap={8} className={cx('imdb-info')}>
			<div className={cx('category-item')}>{movie.episode_current}</div>
			<div className={cx('category-item')}>{`Tập: ${movie.episode_total}`}</div>
			<div className={cx('category-item')}>{movie.year}</div>
		</Flex>
		<Flex gap={8} className={cx('category')}>
			{movie?.category?.slice(0, 3).map((category) => (
				<div className={cx('category-item')} key={category.id}>
					{category.name}
				</div>
			))}
		</Flex>
		<Typography.Paragraph ellipsis={{ rows: 3 }} className={cx('carousel-description')}>
			{removeTagsUsingDOM(movie?.content)}
		</Typography.Paragraph>
		<ConfigProvider theme={{ components: { Button: buttonTheme } }}>
			<Link to={`movie/watch?id=${movie?._id}&ep=${movie?.type === 'single' ? 'full' : '1'}`}>
				<Button className={cx('play-btn')} shape='circle' icon={<FaPlay />} />
			</Link>
		</ConfigProvider>
	</div>
))

// Validation for movie object structure
CarouselItem.propTypes = {
	movie: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		content: PropTypes.string,
		type: PropTypes.string,
		episode_current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		episode_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		category: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				name: PropTypes.string,
			}),
		),
		poster_url: PropTypes.string,
	}).isRequired,
}

CarouselSkeleton.displayName = 'CarouselSkeleton'
CarouselItem.displayName = 'CarouselItem'

const CarouselMovies = ({ maxItems, autoPlaySpeed }) => {
	// Chỉ random page 1 lần duy nhất và lưu trong ref thay vì state để tránh re-render
	const pageRef = useRef(randomPage())
	const { data, isLoading: isLoadingList } = useGetMoviesByUpdateQuery(pageRef.current)

	const [fetchMovieById, { isLoading: isLoadingDetails }] = useLazyGetMovieByIdQuery()

	const mainCarouselRef = useRef(null)
	const thumbCarouselRef = useRef(null)
	const { token } = theme.useToken()
	const [movies, setMovies] = useState([])
	const [currentSlide, setCurrentSlide] = useState(0)

	// Chỉ tính toán lại loading state khi các dependency thay đổi
	const isLoading = useMemo(
		() => isLoadingList || isLoadingDetails || movies.length === 0,
		[isLoadingList, isLoadingDetails, movies.length],
	)

	// Memoize danh sách phim để tránh re-fetch không cần thiết
	const randomMovies = useMemo(() => getRandomMovies(data?.items || [], maxItems || 7), [data?.items, maxItems])

	// Fetch movie details với bộ nhớ đệm và kiểm soát tốt hơn
	useEffect(() => {
		if (!randomMovies.length) return

		let isMounted = true
		const movieIds = new Set(randomMovies.map((movie) => movie._id))

		// Kiểm tra xem đã có movie nào đang hiển thị không cần fetch lại
		const needToFetch = randomMovies.filter(
			(movie) => !movies.some((existingMovie) => existingMovie?.movie?._id === movie._id),
		)

		if (needToFetch.length === 0) return

		Promise.all(needToFetch.map((movie) => fetchMovieById(movie._id).unwrap()))
			.then((fetchedMovies) => {
				if (isMounted) {
					// Kết hợp movies đã có với movies mới fetch
					setMovies((prevMovies) => {
						const filteredPrevMovies = prevMovies.filter((m) => movieIds.has(m?.movie?._id))
						return [...filteredPrevMovies, ...fetchedMovies]
					})
				}
			})
			.catch((err) => console.error('Error fetching movie details:', err))

		return () => {
			isMounted = false
		}
	}, [randomMovies, fetchMovieById, movies])

	// Xử lý sự kiện khi slide chính thay đổi
	const handleMainBeforeChange = useCallback((oldIndex, newIndex) => {
		setCurrentSlide(newIndex)
		if (thumbCarouselRef.current) {
			thumbCarouselRef.current.goTo(newIndex)
		}
	}, [])

	// Xử lý click vào thumbnail
	const handleThumbnailClick = useCallback((index) => {
		setCurrentSlide(index)
		if (mainCarouselRef.current) {
			mainCarouselRef.current.goTo(index)
		}
	}, [])

	// Đồng bộ slide khi component mounted hoặc movies thay đổi
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
			{/* Main Carousel */}
			<Carousel
				className={cx('carousel-main')}
				ref={mainCarouselRef}
				fade
				draggable
				lazyLoad='ondemand'
				dots={false}
				beforeChange={handleMainBeforeChange}
				autoplay={autoPlaySpeed > 0}
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

			{/* Paging Carousel */}
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
					<div
						className={cx('carousel-item', { active: index === currentSlide })}
						key={index}
						onClick={() => handleThumbnailClick(index)}>
						<img
							src={item?.movie?.poster_url || 'fallback.jpg'}
							alt={`thumbnail-${item?.movie?.name}`}
							loading='lazy'
							style={{
								transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)',
								opacity: index === currentSlide ? 1 : 0.7,
								outline: index === currentSlide ? '1px solid #f1c40f' : 'none',
							}}
						/>
					</div>
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
