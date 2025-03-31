import { Button, Carousel, ConfigProvider, Flex, theme } from 'antd'
import classNames from 'classnames/bind'
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react'
import Typography from 'antd/es/typography/Typography'
import { FaPlay } from 'react-icons/fa'

import randomPage from '~/utils/randomPage'
import styles from './CarouselMovies.module.scss'
import getRandomMovies from '~/utils/getRandomMovies'
import { useGetMoviesByUpdateQuery, useLazyGetMovieByIdQuery } from '~/services/ophimApi'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'
import buttonTheme from '~/themes/buttonTheme'

const cx = classNames.bind(styles)

const CarouselMovies = () => {
	const page = useMemo(() => randomPage(), []) // Chỉ random page 1 lần duy nhất
	const { data } = useGetMoviesByUpdateQuery(page)

	const [fetchMovieById] = useLazyGetMovieByIdQuery()

	const mainCarouselRef = useRef(null)
	const thumbCarouselRef = useRef(null)
	const { token } = theme.useToken()
	const [movies, setMovies] = useState([])

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

	// Memoize click handler
	const handleThumbnailClick = useCallback((index) => {
		mainCarouselRef.current?.slickGoTo?.(index)
		thumbCarouselRef.current?.slickGoTo?.(index) // Đảm bảo đồng bộ
	}, [])

	if (!token?.colorBgLayout) return null

	return (
		<div className={cx('carousel-movies')}>
			{/* Main Carousel */}
			<Carousel
				className={cx('carousel-main')}
				ref={mainCarouselRef}
				asNavFor={thumbCarouselRef.current}
				fade
				draggable
				lazyLoad='ondemand'
				dots={false}
				// autoplay={{ dotDuration: 3000 }}
			>
				{movies?.map((item) => (
					<div key={item?.movie?._id}>
						<div className={cx('carousel-img-wrapper')}>
							<img className={cx('carousel-img')} src={item?.movie?.poster_url} alt='thumbnail' />
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
								{item?.movie?.category?.map((category) => (
									<div className={cx('category-item')} key={category.id}>
										{category.name}
									</div>
								))}
							</Flex>
							<Typography.Paragraph ellipsis={{ rows: 3 }} className={cx('carousel-description')}>
								{removeTagsUsingDOM(item?.movie?.content)}
							</Typography.Paragraph>
							<ConfigProvider theme={{ components: { Button: buttonTheme } }}>
								<Button className={cx('play-btn')} shape='circle' icon={<FaPlay />} />
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
				asNavFor={mainCarouselRef.current}
				slidesToShow={5}
				swipeToSlide
				focusOnSelect>
				{movies?.map((item, index) => (
					<div className={cx('carousel-item')} key={index} onClick={() => handleThumbnailClick(index)}>
						<img src={item?.movie?.poster_url || 'fallback.jpg'} alt='thumbnail' />
					</div>
				))}
			</Carousel>
		</div>
	)
}

export default memo(CarouselMovies)
