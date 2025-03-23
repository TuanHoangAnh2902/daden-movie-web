import 'swiper/css'
import 'swiper/css/navigation'
import styles from './Collection.module.scss'

import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { SwiperSlide, Swiper } from 'swiper/react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules'

import cardNavId from '~/utils/cardNavId'
import MovieCardWithHover from '../MovieCardWithHover/MovieCardWithHover'
import { Flex, Typography } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronRight } from 'react-icons/fa'

const cx = classNames.bind(styles)

const Collection = ({ movieData, direction = 'horizontal', reverseDirection = false }) => {
	const [isHovered, setIsHovered] = useState(false)
	const cardNav = useMemo(() => cardNavId(), [])

	console.log(window.innerWidth)

	const renderSlides = () => {
		if (!Array.isArray(movieData?.items)) return null
		return movieData.items.map((item, index) => (
			<SwiperSlide key={item._id} virtualIndex={index}>
				<MovieCardWithHover imageUrl={movieData?.APP_DOMAIN_CDN_IMAGE} movieData={item} direction={direction} />
			</SwiperSlide>
		))
	}

	const verticalBreakpoints = {
		320: { slidesPerView: 3, spaceBetween: 18 },
		480: { slidesPerView: 5, spaceBetween: 18 },
		768: { slidesPerView: 6, spaceBetween: 18 },
		1024: { slidesPerView: 7, spaceBetween: 18 },
		1440: { slidesPerView: 7, spaceBetween: 18 },
		1699: { slidesPerView: 8, spaceBetween: 18 },
	}

	const horizontalBreakpoints = {
		320: { slidesPerView: 1, spaceBetween: 18 }, // Mobile nhỏ
		480: { slidesPerView: 2, spaceBetween: 18 }, // Mobile lớn
		768: { slidesPerView: 3, spaceBetween: 18 }, // Tablet
		1024: { slidesPerView: 4, spaceBetween: 18 }, // Desktop
		1440: { slidesPerView: 5, spaceBetween: 18 }, // Màn lớn
		1699: { slidesPerView: 6, spaceBetween: 18 }, // Màn lớn
	}

	return (
		<div className={cx('collection')}>
			<Flex className={cx('collection-title')} align='center' gap={20}>
				<Typography.Title className={cx('title')} level={2}>
					{movieData?.titlePage}
				</Typography.Title>
				<AnimatePresence mode='sync'>
					<motion.div
						animate={{ width: isHovered ? 100 : 33 }}
						transition={{ duration: 0.2 }}
						className={cx('view-more')}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}>
						<AnimatePresence mode='sync'>
							{isHovered && (
								<motion.p
									initial={{ opacity: 0, x: -80 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -80 }}
									transition={{ duration: 0.2 }}>
									Xem thêm
								</motion.p>
							)}
						</AnimatePresence>
						<FaChevronRight className={cx('icon')} />
					</motion.div>
				</AnimatePresence>
			</Flex>
			<div className={cx('swiper-container')}>
				<div className={cx('swiper-button')}>
					<FaAngleLeft className={cx('custom-prev', `custom-prev-${cardNav}`)} />
					<FaAngleRight className={cx('custom-next', `custom-next-${cardNav}`)} />
				</div>
				<Swiper
					modules={[Navigation, Scrollbar, Autoplay]}
					autoplay={{ delay: 3000, reverseDirection: reverseDirection }}
					slidesPerView={8}
					spaceBetween={18}
					navigation={{ prevEl: `.custom-prev-${cardNav}`, nextEl: `.custom-next-${cardNav}` }}
					breakpoints={direction === 'horizontal' ? horizontalBreakpoints : verticalBreakpoints}>
					{renderSlides()}
				</Swiper>
			</div>
		</div>
	)
}
Collection.propTypes = {
	movieData: PropTypes.shape({
		titlePage: PropTypes.string,
		items: PropTypes.arrayOf(
			PropTypes.shape({
				_id: PropTypes.string.isRequired,
			}),
		),
		APP_DOMAIN_CDN_IMAGE: PropTypes.string,
	}),
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	reverseDirection: PropTypes.bool,
}

export default Collection
