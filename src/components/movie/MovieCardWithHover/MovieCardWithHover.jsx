import { useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, ConfigProvider, Flex } from 'antd'
import { FaPlay } from 'react-icons/fa6'
import { HeartFilled, InfoCircleFilled } from '@ant-design/icons'
import { LuDot } from 'react-icons/lu'
import Portal from '~/components/common/Portal/Portal'
import buttonTheme from '~/themes/buttonTheme'
import styles from './MovieCardWithHover.module.scss'

const cx = classNames.bind(styles)

function MovieCardWithHover({ imageUrl, movieData, direction }) {
	console.log('🚀 ~ MovieCardWithHover ~ movieData:', movieData)
	const [hoveredCard, setHoveredCard] = useState(null)
	const [cardPosition, setCardPosition] = useState(null)
	const [isHovered, setIsHovered] = useState(false)
	const cardRef = useRef(null)
	const cardDetailRef = useRef(null)
	const timerRef = useRef(null)
	const imageBaseUrl = `${imageUrl}/uploads/movies/`

	// Hàm kiểm tra chuột có trong card hoặc card detail không
	const checkMouseInside = useCallback((event) => {
		// Check original card
		const isInsideCard = cardRef.current
			? (() => {
					const rect = cardRef.current.getBoundingClientRect()
					return (
						event.clientX >= rect.left &&
						event.clientX <= rect.right &&
						event.clientY >= rect.top &&
						event.clientY <= rect.bottom
					)
			  })()
			: false

		// Check card detail if it exists
		const isInsideDetail = cardDetailRef.current
			? (() => {
					const rect = cardDetailRef.current.getBoundingClientRect()
					return (
						event.clientX >= rect.left &&
						event.clientX <= rect.right &&
						event.clientY >= rect.top &&
						event.clientY <= rect.bottom
					)
			  })()
			: false

		const isInside = isInsideCard || isInsideDetail
		setIsHovered(isInside)
		return isInside
	}, [])

	useEffect(() => {
		window.addEventListener('mousemove', checkMouseInside)
		return () => window.removeEventListener('mousemove', checkMouseInside)
	}, [checkMouseInside])

	const handleMouseEnterWithDelay = useCallback(() => {
		timerRef.current = setTimeout(() => {
			setHoveredCard(movieData._id)
		}, 500)
	}, [movieData._id])

	const handleMouseLeave = useCallback(() => {
		clearTimeout(timerRef.current)
		setHoveredCard(null)
		setIsHovered(false)
		setCardPosition(null)
	}, [])

	useEffect(() => {
		if (!hoveredCard || !cardRef.current) return
		const rect = cardRef.current.getBoundingClientRect()
		const cardWidth = 400 // Approximate width of hover card
		const windowWidth = window.innerWidth

		// Calculate base position
		const top = rect.top + window.scrollY - 50
		let left = rect.left + window.scrollX - 80

		// Adjust for right edge
		if (left + cardWidth > windowWidth - 16) {
			left = windowWidth - cardWidth - 32
		}

		// Adjust for left edge
		if (left < 16) {
			left = 16
		}

		setCardPosition({ top, left })
	}, [hoveredCard])

	return (
		<>
			<div ref={cardRef} className={cx('movie-card', direction)}>
				<motion.div className={cx('card')}>
					<div className={cx('card-img')}>
						<motion.img
							onMouseEnter={handleMouseEnterWithDelay}
							src={imageBaseUrl + (direction === 'horizontal' ? movieData?.poster_url : movieData?.thumb_url)}
							alt={movieData?.name || 'Movie'}
						/>
					</div>
					<div className={cx('card-content')}>
						<p className={cx('card-content-title')}>{movieData?.name || 'Unknown Title'}</p>
					</div>
				</motion.div>
			</div>

			<AnimatePresence>
				{hoveredCard && isHovered && (
					<Portal>
						<motion.div
							ref={cardDetailRef}
							key={movieData._id}
							initial={{ opacity: 0, scale: 0.1 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.1 }}
							onMouseLeave={handleMouseLeave}
							className={cx('card-detail')}
							style={cardPosition}>
							<div className={cx('card-detail-img-wrapper')}>
								<motion.img
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									src={imageBaseUrl + movieData.poster_url}
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
									<ConfigProvider theme={buttonTheme}>
										<Button className={cx('play-btn')} icon={<FaPlay />}>
											{movieData.episode_current === 'Trailer' ? 'Xem Trailer' : 'Xem phim'}
										</Button>
									</ConfigProvider>
									<Button className={cx('action-btn')} type='text' icon={<HeartFilled />}>
										Thích
									</Button>
									<Button className={cx('action-btn')} type='text' icon={<InfoCircleFilled />}>
										Chi tiết
									</Button>
								</Flex>
								<Flex className={cx('imdb-info')} gap={6}>
									<div className={cx('imdb-info-item')}>{movieData.year}</div>
									<div className={cx('imdb-info-item')}>{movieData.lang}</div>
									<div className={cx('imdb-info-item')}>{movieData.episode_current}</div>
									<div className={cx('imdb-info-item')}>{movieData.time}</div>
								</Flex>
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

MovieCardWithHover.propTypes = {
	imageUrl: PropTypes.string.isRequired,
	movieData: PropTypes.object.isRequired,
	direction: PropTypes.oneOf(['vertical', 'horizontal']),
}

export default MovieCardWithHover
