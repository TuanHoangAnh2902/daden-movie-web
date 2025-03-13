import { useEffect, useState, useRef, useMemo } from 'react'
import { Carousel, theme } from 'antd'
import styled from 'styled-components'
import { useGetMoviesListQuery, useLazyGetMovieByIdQuery } from '~/services/ophimApi'
import randomPage from '~/utils/randomPage'

const StyledCarousel = styled(Carousel)`
	& .slick-dots li {
		width: 60px;
		height: 45px;
		border-radius: 5px;
		& .carousel-paging-img {
			width: 100%;
			height: 100%;
			cursor: pointer;
			background-size: cover;
			background-position: center;
		}
	}
`
const StyledWrapperImg = styled.div`
	position: relative;
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: ${({ $colorBgLayout }) => `linear-gradient(to top, ${$colorBgLayout} 0.5%, transparent 16%)`};
		z-index: 100;
	}
	& .carousel-img {
		height: calc(100vh - 100px);
		width: 100%;
		object-fit: cover;
	}
`
const StyledPagingCarousel = styled(Carousel)`
	width: 460px;
	margin: 0 auto;
	transition: transform 0.5s;

	.slick-slider {
	}
	.slick-list {
		height: 60px;
		.slick-track {
		}
	}
	.slick-list .slick-track .slick-slide div div img {
		width: 70px;
		height: 40px;
		cursor: pointer;
		border-radius: 5px;
		object-fit: cover;
		transition: transform 0.5s, opacity 0.5s;
	}

	/* Slide ở trung tâm sẽ phóng to */
	.slick-slide.slick-center div div img {
		transform: scale(1.2);
		opacity: 1;
	}

	/* Các slide không phải trung tâm sẽ bị mờ */
	.slick-slide:not(.slick-center) div div img {
		opacity: 0.2;
	}
`

const CarouselMovies = () => {
	const page = useMemo(() => randomPage(), []) // Chỉ random page 1 lần duy nhất
	const { data } = useGetMoviesListQuery(page)
	const [fetchMovieById] = useLazyGetMovieByIdQuery()

	const mainCarouselRef = useRef(null)
	const thumbCarouselRef = useRef(null)
	const { token } = theme.useToken()
	const [movies, setMovies] = useState([])

	// Memoize danh sách phim để tránh re-fetch không cần thiết
	const movieIds = useMemo(() => data?.items?.map((item) => item._id) || [], [data])

	useEffect(() => {
		if (!movieIds.length) return

		Promise.all(movieIds.map((id) => fetchMovieById(id).unwrap()))
			.then(setMovies)
			.catch((err) => console.error('Error fetching movie details:', err))
	}, [movieIds, fetchMovieById])

	if (!token?.colorBgLayout) return null
	return (
		<>
			{/* Main Carousel */}
			<StyledCarousel
				ref={mainCarouselRef}
				asNavFor={thumbCarouselRef.current}
				fade
				draggable
				lazyLoad='ondemand'
				dots={false}>
				{movies.map((item) => (
					<StyledWrapperImg key={item?.movie?._id} $colorBgLayout={token.colorBgLayout}>
						<img className='carousel-img' src={item?.movie?.poster_url} alt='img' />
					</StyledWrapperImg>
				))}
			</StyledCarousel>

			{/* Paging Carousel */}
			<StyledPagingCarousel
				dots={false}
				draggable
				centerMode
				centerPadding='0'
				ref={thumbCarouselRef}
				asNavFor={mainCarouselRef.current}
				slidesToShow={5}
				swipeToSlide
				focusOnSelect>
				{movies.map((item, index) => (
					<div key={index} onClick={() => mainCarouselRef.current?.slickGoTo?.(index)}>
						<img src={item?.movie?.poster_url || 'fallback.jpg'} style={{}} alt='thumbnail' />
					</div>
				))}
			</StyledPagingCarousel>
		</>
	)
}

export default CarouselMovies
