import { Button, Carousel, ConfigProvider, Flex, Skeleton, theme } from 'antd'
import classNames from 'classnames/bind'
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react'
import Typography from 'antd/es/typography/Typography'
import { FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import randomPage from '~/utils/randomPage'
import styles from './CarouselMovies.module.scss'
import getRandomMovies from '~/utils/getRandomMovies'
import { useGetMoviesByUpdateQuery, useLazyGetMovieByIdQuery } from '~/services/ophimApi'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'
import { buttonTheme } from '~/themes/buttonTheme'

const cx = classNames.bind(styles)

const CarouselMovies = () => {
	const page = useMemo(() => randomPage(), []) // Chỉ random page 1 lần duy nhất
	const { data, isLoading: isLoadingList } = useGetMoviesByUpdateQuery(page)

	const [fetchMovieById, { isLoading: isLoadingDetails }] = useLazyGetMovieByIdQuery()

	const mainCarouselRef = useRef(null)
	const thumbCarouselRef = useRef(null)
	const { token } = theme.useToken()
	const [movies, setMovies] = useState([])
	const [currentSlide, setCurrentSlide] = useState(0)

	const isLoading = isLoadingList || isLoadingDetails || movies.length === 0

	// Memoize danh sách phim để tránh re-fetch không cần thiết
	const ranDomMovies = useMemo(() => getRandomMovies(data?.items || [], 7), [data?.items])

	// Fetch movie details
	useEffect(() => {
		if (!ranDomMovies.length) return

		let isMounted = true // Avoid state updates if component unmounts

		Promise.all(ranDomMovies?.map((movie) => fetchMovieById(movie._id).unwrap()))
			.then((fetchedMovies) => {
				if (isMounted) setMovies(fetchedMovies)
			})
			.catch((err) => console.error('Error fetching movie details:', err))

		return () => {
			isMounted = false
		}
	}, [ranDomMovies, fetchMovieById])

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
		return (
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
		)
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
				// Không sử dụng asNavFor cho Ant Design Carousel
			>
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
						<div className={cx('carousel-content')}>
							<Typography.Title level={4} className={cx('carousel-title')}>
								{item?.movie?.name}
							</Typography.Title>
							<Flex gap={8} className={cx('imdb-info')}>
								<div className={cx('category-item')}>{item?.movie.episode_current}</div>
								<div className={cx('category-item')}>{`Tập: ${item?.movie.episode_total}`}</div>
								<div className={cx('category-item')}>{item?.movie.year}</div>
							</Flex>
							<Flex gap={8} className={cx('category')}>
								{item?.movie?.category?.slice(0, 3).map((category) => (
									<div className={cx('category-item')} key={category.id}>
										{category.name}
									</div>
								))}
							</Flex>
							<Typography.Paragraph ellipsis={{ rows: 3 }} className={cx('carousel-description')}>
								{removeTagsUsingDOM(item?.movie?.content)}
							</Typography.Paragraph>
							<ConfigProvider theme={{ components: { Button: buttonTheme } }}>
								<Link to={`movie/watch?id=${item?.movie?._id}&ep=${item?.movie?.type === 'single' ? 'full' : '1'}`}>
									<Button className={cx('play-btn')} shape='circle' icon={<FaPlay />} />
								</Link>
							</ConfigProvider>
						</div>
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
				initialSlide={currentSlide}
				// Không sử dụng asNavFor và focusOnSelect cho Ant Design Carousel
			>
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

export default memo(CarouselMovies)
