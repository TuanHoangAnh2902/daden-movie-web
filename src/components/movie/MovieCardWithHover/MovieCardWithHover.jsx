import styles from './MovieCardWithHover.module.scss'

import { debounce } from '~/utils/debounce'
import { buttonTheme } from '~/themes/buttonTheme'
import Portal from '~/components/common/Portal/Portal'
import ImdbInfo from '~/components/common/ImdbInfo/ImdbInfo'
import useToggleFavorite from '~/hooks/useToggleFavorite'

import PropTypes from 'prop-types'
import { LuDot } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FaPlay } from 'react-icons/fa6'
import { Button, ConfigProvider, Flex } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartFilled, InfoCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { useRef, useState, useEffect, useCallback, memo } from 'react'

const cx = classNames.bind(styles)

const MovieCardWithHoverComponent = ({ imageUrl, movieData, direction }) => {
	const imageBaseUrl = `${imageUrl}/uploads/movies/`
	const { checkIsFavorite, isToggling, handleToggleFavorite, contextHolder } = useToggleFavorite()

	// Kiểm tra trạng thái yêu thích từ hook
	const isFav = checkIsFavorite(movieData?._id)

	const [hoveredCard, setHoveredCard] = useState(null)
	const [cardPosition, setCardPosition] = useState(null)
	const [imageLoading, setImageLoading] = useState(true)
	const [mainImageRetries, setMainImageRetries] = useState(0)
	const [detailImageRetries, setDetailImageRetries] = useState(0)

	const cardRef = useRef(null)
	const cardDetailRef = useRef(null)
	const timerRef = useRef(null)

	const handleImageLoad = useCallback(() => {
		setImageLoading(false)
	}, [])

	const retryLoadImage = useCallback((imageElement, url, setRetries, maxRetries = 3) => {
		setRetries((prev) => {
			if (prev < maxRetries) {
				const delay = Math.pow(2, prev) * 1000
				setTimeout(() => {
					if (imageElement) imageElement.src = url
				}, delay)
				return prev + 1
			}
			return prev
		})
	}, [])

	// Sử dụng debounce để tránh gọi hàm quá nhiều lần
	const debouncedSetHoveredCard = useCallback((id) => {
		const debouncedFunction = debounce((id) => {
			setHoveredCard(id)
		}, 150)
		debouncedFunction(id)
	}, [])

	// Tính toán vị trí card chi tiết
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

	// Xử lý mouse enter với độ trễ
	const handleMouseEnter = useCallback(() => {
		timerRef.current = setTimeout(() => {
			debouncedSetHoveredCard(movieData?._id)
			setCardPosition(calculateCardPosition())
		}, 300) // Giảm thời gian delay xuống để UX mượt hơn
	}, [movieData?._id, debouncedSetHoveredCard, calculateCardPosition])

	// Xử lý mouse leave
	const handleMouseLeave = useCallback(() => {
		clearTimeout(timerRef.current)
		debouncedSetHoveredCard(null)
	}, [debouncedSetHoveredCard])

	// Cập nhật vị trí card khi có hover
	useEffect(() => {
		if (hoveredCard) {
			setCardPosition(calculateCardPosition())
		}
	}, [hoveredCard, calculateCardPosition])

	// Hủy timers khi unmount
	useEffect(() => {
		return () => {
			clearTimeout(timerRef.current)
		}
	}, [])

	// Lấy thumbnail hoặc poster dựa vào hướng hiển thị
	const getImageUrl = useCallback(
		(isDetail = false) => {
			const baseUrl = imageBaseUrl
			if (isDetail) return baseUrl + movieData?.poster_url
			return baseUrl + (direction === 'horizontal' ? movieData?.poster_url : movieData?.thumb_url)
		},
		[imageBaseUrl, movieData?.poster_url, movieData?.thumb_url, direction],
	)

	return (
		<>
			{contextHolder}
			<div
				ref={cardRef}
				className={cx('movie-card', direction)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}>
				<motion.div className={cx('card')}>
					<div className={cx('card-img')}>
						<motion.img
							src={getImageUrl()}
							alt={movieData?.name || 'Movie'}
							loading='lazy'
							onError={(e) => {
								retryLoadImage(e.target, getImageUrl(), setMainImageRetries, 3)
								if (mainImageRetries >= 3) {
									e.target.onerror = null
									e.target.src = '/placeholder-image.jpg'
								}
							}}
							onLoad={handleImageLoad}
							data-loading={imageLoading}
							className={cx('card-img-element')}
						/>
					</div>
					<div className={cx('card-content')}>
						<p className={cx('card-content-title', direction === 'vertical' ? 'card-vertical' : 'card-horizontal')}>
							{movieData?.name || 'Unknown Title'}
						</p>
					</div>
				</motion.div>
			</div>

			<AnimatePresence>
				{hoveredCard === movieData?._id && cardPosition && (
					<Portal>
						<motion.div
							ref={cardDetailRef}
							key={movieData._id}
							initial={{ opacity: 0, scale: 0.1 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.1 }}
							onMouseEnter={() => debouncedSetHoveredCard(movieData?._id)}
							onMouseLeave={handleMouseLeave}
							className={cx('card-detail')}
							style={cardPosition}>
							<div className={cx('card-detail-img-wrapper')}>
								<motion.img
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									src={getImageUrl(true)}
									alt={movieData.name}
									loading='lazy'
									onError={(e) => {
										retryLoadImage(e.target, getImageUrl(true), setDetailImageRetries, 3)
										if (detailImageRetries >= 3) {
											e.target.onerror = null
											e.target.src = imageBaseUrl + movieData?.thumb_url
										}
									}}
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
