import styles from './MovieCard.module.scss'
import buttonTheme from '~/themes/buttonTheme'

import PropTypes from 'prop-types'
import { LuDot } from 'react-icons/lu'
import { FaPlay } from 'react-icons/fa6'
import classNames from 'classnames/bind'
import { Button, ConfigProvider, Flex } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { HeartFilled, InfoCircleFilled } from '@ant-design/icons'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const cx = classNames.bind(styles)
function MovieCard({ imageUrl, movieData }) {
	const imageBaseUrl = `${imageUrl}/uploads/movies/`
	const [hoveredCard, setHoveredCard] = useState(null)
	const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })
	const cardRef = useRef(null)
	const [cardNav] = useState(() => Math.floor(Math.random() * 100))

	const cardDetail = useMemo(() => movieData?.items.find((m) => m._id === hoveredCard), [hoveredCard, movieData?.items])

	const handleMouseEnter = useCallback((id) => {
		setHoveredCard(id)
	}, [])

	const handleMouseLeave = useCallback(() => {
		setHoveredCard(null)
	}, [])

	useEffect(() => {
		// Nếu không có card nào được hover hoặc ref chưa được gán, không làm gì cả
		if (!hoveredCard || !cardRef.current) return

		// Lấy vị trí và kích thước của card hiện tại
		const rect = cardRef.current.getBoundingClientRect()
		const cardWidth = rect.width
		const windowWidth = window.innerWidth

		// Tính vị trí left dựa trên vị trí của card và vị trí scroll hiện tại
		let left = rect.left + window.scrollX

		// Nếu card vượt quá chiều rộng của cửa sổ, hiệu chỉnh lại vị trí left
		if (left + cardWidth > windowWidth) {
			left = windowWidth - cardWidth - 16
		}

		// Cập nhật vị trí của card detail, đảm bảo không nhỏ hơn 16px
		setCardPosition({
			top: rect.top + window.scrollY,
			left: Math.max(left, 16),
		})
	}, [hoveredCard])

	return (
		<div className={cx('movie-card')}>
			<Flex align='center' justify='space-between' className={cx('nav-container')}>
				<Button
					size='large'
					shape='circle'
					className={cx(`custom-prev-${cardNav}`, 'nav-btn-prev')}
					icon={<FaChevronLeft />}
				/>
				<Swiper
					modules={[Navigation, Scrollbar, Autoplay]}
					slidesPerView={4}
					grabCursor
					spaceBetween={18}
					navigation={{ prevEl: `.custom-prev-${cardNav}`, nextEl: `.custom-next-${cardNav}` }}
					className={cx('carousel')}>
					{Array.isArray(movieData?.items) &&
						movieData.items.map((item, index) => (
							<SwiperSlide key={item._id} virtualIndex={index}>
								<div
									className={cx('card-wrapper')}
									ref={hoveredCard === item._id ? cardRef : null}
									onMouseEnter={() => handleMouseEnter(item._id)}>
									<motion.div className={cx('card')} layoutId={hoveredCard}>
										<div className={cx('card-img')}>
											<motion.img key={hoveredCard} src={imageBaseUrl + item.poster_url} alt={item.name} />
										</div>
										<div className={cx('card-content')}>
											<p className={cx('card-content-title')}>{item.name}</p>
										</div>
									</motion.div>
								</div>
							</SwiperSlide>
						))}
				</Swiper>
				<Button
					size='large'
					shape='circle'
					className={cx(`custom-next-${cardNav}`, 'nav-btn-next')}
					icon={<FaChevronRight />}
				/>
			</Flex>

			<AnimatePresence mode='sync'>
				{hoveredCard && (
					<motion.div
						key={hoveredCard}
						initial={{ opacity: 0, scale: 1 }}
						animate={{ opacity: 1, scale: 1.1 }}
						exit={{ opacity: 0, scale: 1 }}
						layoutId={hoveredCard}
						onMouseLeave={handleMouseLeave}
						transition={{ duration: 0.3 }}
						className={cx('card-detail')}
						style={{ top: cardPosition.top - 50, left: cardPosition.left - 50 }}>
						<div className={cx('card-detail-img-wrapper')}>
							<motion.img
								key={hoveredCard}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								src={imageBaseUrl + cardDetail?.poster_url}
								alt={cardDetail?.name}
								className={cx('card-detail-img')}
							/>
						</div>
						<motion.div
							key={hoveredCard}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className={cx('card-detail-content')}>
							<h5 className={cx('name')}>{cardDetail?.name}</h5>
							<p className={cx('origin-name')}>{cardDetail?.origin_name}</p>
							<Flex gap={8} className={cx('card-detail-actions-btn')}>
								<ConfigProvider theme={buttonTheme}>
									<Button className={cx('play-btn')} icon={<FaPlay />}>
										Xem phim
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
								<div className={cx('imdb-info-item')}>{cardDetail?.year}</div>
								<div className={cx('imdb-info-item')}>{cardDetail?.lang}</div>
								<div className={cx('imdb-info-item')}>{cardDetail?.episode_current}</div>
								<div className={cx('imdb-info-item')}>{cardDetail?.time}</div>
							</Flex>

							<Flex className={cx('category-container')} gap={4}>
								{cardDetail?.category?.map((category) => (
									<Flex className={cx('category')} align='center' key={category.id}>
										<LuDot className={cx('dot')} /> <p className={cx('category-item')}>{category.name}</p>
									</Flex>
								))}
							</Flex>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

MovieCard.propTypes = {
	imageUrl: PropTypes.string.isRequired,
	movieData: PropTypes.object,
}

export default MovieCard
