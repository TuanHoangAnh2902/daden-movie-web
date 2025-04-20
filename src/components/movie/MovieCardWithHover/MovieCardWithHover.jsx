import styles from './MovieCardWithHover.module.scss'

import { HeartFilled, InfoCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Flex } from 'antd'
import classNames from 'classnames/bind'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { LuDot } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import ImdbInfo from '~/components/common/ImdbInfo/ImdbInfo'
import Portal from '~/components/common/Portal/Portal'
import MovieCardSkeleton from '~/components/common/Skeleton/MovieCardSkeleton'
import useImageLoader from '~/hooks/useImageLoader'
import useToggleFavorite from '~/hooks/useToggleFavorite'
import { buttonTheme } from '~/themes/buttonTheme'
import { debounce } from '~/utils/debounce'

const cx = classNames.bind(styles)

// Placeholder trống để tránh lỗi không tìm thấy file
const PLACEHOLDER_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

// Tách CardDetails thành component riêng để tránh re-render không cần thiết
const CardDetails = memo(({ movieData, imageUrl, cardPosition, onMouseEnter, onMouseLeave }) => {
	const imageBaseUrl = movieData?.thumb_url?.includes('http') ? '' : `${imageUrl}/uploads/movies/`
	const detailImageUrl = `${imageBaseUrl}${movieData?.poster_url || ''}`

	// Sử dụng useImageLoader với tùy chọn để tải trực tiếp không dùng IntersectionObserver
	const { ref, imageSrc } = useImageLoader(detailImageUrl, PLACEHOLDER_IMAGE, {
		useIntersectionObserver: false, // Tải trực tiếp không dùng observer
	})

	const { checkIsFavorite, isToggling, handleToggleFavorite, contextHolder } = useToggleFavorite()
	const isFav = checkIsFavorite(movieData?._id)

	// Sử dụng ref gốc cho motion.div
	const cardRef = useRef(null)

	// Effect để gọi ref từ useImageLoader sau khi DOM được render
	useEffect(() => {
		if (cardRef.current) {
			ref(cardRef.current)
		}
	}, [ref])

	// useEffect debug loading
	useEffect(() => {
		// Nếu URL không hợp lệ, console.log để debug
		if (!detailImageUrl || detailImageUrl === `${imageBaseUrl}undefined`) {
			console.warn('Invalid detail image URL:', detailImageUrl)
		}
	}, [detailImageUrl, imageBaseUrl])

	return (
		<Portal>
			{contextHolder}
			<motion.div
				ref={cardRef}
				key={movieData._id}
				initial={{ opacity: 0, scale: 0.1 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.1 }}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				className={cx('card-detail')}
				style={cardPosition}>
				<div className={cx('card-detail-img-wrapper')}>
					<motion.img
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						src={imageSrc}
						alt={movieData.name}
						className={cx('card-detail-img')}
					/>
				</div>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className={cx('card-detail-content')}>
					<h5 className={cx('name')}>{movieData.name}</h5>
					<p className={cx('origin-name')}>{movieData.origin_name}</p>
					<Flex gap={8} className={cx('card-detail-actions-btn')}>
						<ConfigProvider theme={{ components: { Button: buttonTheme } }}>
							<Link to={`/movie/watch?id=${movieData?._id}&ep=${movieData?.type === 'single' ? 'full' : '1'}`}>
								<Button className={cx('play-btn')} icon={<FaPlay />}>
									{movieData.episode_current === 'Trailer' ? 'Xem Trailer' : 'Xem phim'}
								</Button>
							</Link>
						</ConfigProvider>
						<Button
							className={cx('action-btn', { 'like-modifier': isFav })}
							type='text'
							icon={isToggling ? <LoadingOutlined /> : <HeartFilled />}
							onClick={() => handleToggleFavorite(movieData)}
							disabled={isToggling}>
							{isFav ? 'Đã thích' : 'Thích'}
						</Button>
						<Link to={`/movie/detail?id=${movieData?._id}`}>
							<Button className={cx('action-btn')} type='text' icon={<InfoCircleFilled />}>
								Chi tiết
							</Button>
						</Link>
					</Flex>
					<ImdbInfo ImdbData={movieData} />
					<Flex className={cx('category-container')} gap={4}>
						{movieData.category?.map((category) => (
							<Flex className={cx('category')} align='center' key={category.id}>
								<LuDot className={cx('dot')} />
								<p className={cx('category-item')}>{category.name}</p>
							</Flex>
						))}
					</Flex>
				</motion.div>
			</motion.div>
		</Portal>
	)
})

CardDetails.displayName = 'CardDetails'

CardDetails.propTypes = {
	movieData: PropTypes.object.isRequired,
	imageUrl: PropTypes.string.isRequired,
	cardPosition: PropTypes.object,
	onMouseEnter: PropTypes.func.isRequired,
	onMouseLeave: PropTypes.func.isRequired,
}

// Component chính
const MovieCardWithHoverComponent = ({ imageUrl, movieData, direction }) => {
	// Chuẩn bị base url cho ảnh
	const imageBaseUrl = useMemo(
		() => (movieData?.thumb_url?.includes('http') ? '' : `${imageUrl}/uploads/movies/`),
		[imageUrl, movieData?.thumb_url],
	)

	// Tạo URL ảnh dựa vào hướng hiển thị - kiểm tra null và undefined
	const mainImageUrl = useMemo(() => {
		const imagePath =
			direction === 'horizontal'
				? movieData?.poster_url || movieData?.thumb_url
				: movieData?.thumb_url || movieData?.poster_url

		// Nếu không có đường dẫn ảnh hợp lệ, trả về placeholder
		if (!imagePath) {
			console.warn('Missing image path for movie:', movieData?.name)
			return PLACEHOLDER_IMAGE
		}

		return `${imageBaseUrl}${imagePath}`
	}, [direction, imageBaseUrl, movieData?.name, movieData?.poster_url, movieData?.thumb_url])

	const [hoveredCard, setHoveredCard] = useState(null)
	const [cardPosition, setCardPosition] = useState(null)

	const cardRef = useRef(null)
	const timerRef = useRef(null)

	// Debug biến mainImageUrl
	useEffect(() => {
		if (mainImageUrl === `${imageBaseUrl}undefined` || mainImageUrl === `${imageBaseUrl}null`) {
			console.warn('Invalid image URL generated for movie:', movieData?.name, mainImageUrl)
		}
	}, [mainImageUrl, imageBaseUrl, movieData?.name])

	// Sử dụng hook useImageLoader để tải và quản lý ảnh - với tùy chọn cập nhật
	const { ref, imageSrc, isLoading } = useImageLoader(mainImageUrl, PLACEHOLDER_IMAGE, {
		threshold: 0.01,
		rootMargin: '200px',
		// Tắt tính năng IntersectionObserver nếu đang gặp vấn đề
		useIntersectionObserver: false,
	})

	// Effect để gọi ref từ useImageLoader sau khi DOM được render
	// Điều này tránh cập nhật ref trong quá trình render gây lỗi
	useEffect(() => {
		if (cardRef.current) {
			ref(cardRef.current)
		}
	}, [ref, mainImageUrl])

	// Thêm state chung để giới hạn thời gian loading
	const [forceShowContent, setForceShowContent] = useState(false)

	// Tự động hiển thị nội dung nếu loading quá lâu
	useEffect(() => {
		if (isLoading) {
			const timer = setTimeout(() => {
				setForceShowContent(true)
				console.warn('Force showing content after timeout for:', movieData?.name)
			}, 3000) // 3 giây timeout

			return () => clearTimeout(timer)
		}
	}, [isLoading, movieData?.name])

	// Tính toán vị trí card chi tiết - được memoize để tránh tính toán lại
	const calculateCardPosition = useCallback(() => {
		if (!cardRef.current) return null

		const rect = cardRef.current.getBoundingClientRect()
		const cardWidth = 400
		const windowWidth = window.innerWidth

		const top = rect.top + window.scrollY - 50
		let left = rect.left + window.scrollX

		if (left + cardWidth > windowWidth - 16) {
			left = windowWidth - cardWidth - 40
		}

		if (left < 16) {
			left = 16
		}

		return { top, left }
	}, [])

	// Debounce việc set hoveredCard
	const debouncedSetHoveredCard = useMemo(
		() =>
			debounce((id) => {
				setHoveredCard(id)
			}, 150),
		[],
	)

	// Xử lý mouse enter với độ trễ
	const handleMouseEnter = useCallback(() => {
		clearTimeout(timerRef.current)
		timerRef.current = setTimeout(() => {
			debouncedSetHoveredCard(movieData?._id)
			setCardPosition(calculateCardPosition())
		}, 200)
	}, [movieData?._id, debouncedSetHoveredCard, calculateCardPosition])

	// Xử lý mouse leave
	const handleMouseLeave = useCallback(() => {
		clearTimeout(timerRef.current)
		debouncedSetHoveredCard(null)
	}, [debouncedSetHoveredCard])

	// Hủy timers khi unmount
	useEffect(() => {
		return () => {
			clearTimeout(timerRef.current)
		}
	}, [])

	// Hiển thị nội dung nếu đã load xong hoặc đã hết thời gian chờ
	const shouldShowContent = !isLoading || forceShowContent

	return (
		<>
			{!shouldShowContent ? (
				<MovieCardSkeleton direction={direction} />
			) : (
				<div
					data-aos='fade-up'
					ref={cardRef} // Gán ref trực tiếp, không dùng inline function trong render
					className={cx('movie-card', direction)}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}>
					<motion.div className={cx('card')}>
						<div className={cx('card-img')}>
							<motion.img
								src={imageSrc || PLACEHOLDER_IMAGE}
								alt={movieData?.name || 'Movie'}
								className={cx('card-img-element')}
								onError={(e) => {
									console.error('Image load error:', e)
									e.target.src = PLACEHOLDER_IMAGE
								}}
							/>
						</div>
						<div className={cx('card-content')}>
							<p className={cx('card-content-title', direction === 'vertical' ? 'card-vertical' : 'card-horizontal')}>
								{movieData?.name || 'Unknown Title'}
							</p>
						</div>
					</motion.div>
				</div>
			)}

			<AnimatePresence>
				{hoveredCard === movieData?._id && cardPosition && (
					<CardDetails
						movieData={movieData}
						imageUrl={imageUrl}
						cardPosition={cardPosition}
						onMouseEnter={() => debouncedSetHoveredCard(movieData?._id)}
						onMouseLeave={handleMouseLeave}
					/>
				)}
			</AnimatePresence>
		</>
	)
}

// PropTypes unchanged
MovieCardWithHoverComponent.propTypes = {
	imageUrl: PropTypes.string.isRequired,
	movieData: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		origin_name: PropTypes.string,
		poster_url: PropTypes.string,
		thumb_url: PropTypes.string,
		year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		type: PropTypes.string,
		lang: PropTypes.string,
		episode_current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		time: PropTypes.string,
		category: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				name: PropTypes.string,
			}),
		),
	}).isRequired,
	direction: PropTypes.oneOf(['vertical', 'horizontal']),
	isLoading: PropTypes.bool,
}

// Sử dụng memo với custom compare function để tránh re-render không cần thiết
const MovieCardWithHover = memo(MovieCardWithHoverComponent, (prevProps, nextProps) => {
	return (
		prevProps.imageUrl === nextProps.imageUrl &&
		prevProps.direction === nextProps.direction &&
		prevProps.movieData?._id === nextProps.movieData?._id
	)
})

MovieCardWithHover.displayName = 'MovieCardWithHover'

export default MovieCardWithHover
