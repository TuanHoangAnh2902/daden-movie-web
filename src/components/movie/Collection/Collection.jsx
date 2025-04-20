import { Flex, Skeleton, Typography } from 'antd'
import classNames from 'classnames/bind'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { FaAngleLeft, FaAngleRight, FaChevronRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import cardNavId from '~/utils/cardNavId'
import MovieCardWithHover from '../MovieCardWithHover/MovieCardWithHover'
import styles from './Collection.module.scss'

const cx = classNames.bind(styles)

const Collection = ({ movieData, isLoading, direction = 'horizontal', reverseDirection = false }) => {
	const [isHovered, setIsHovered] = useState(false)
	const cardNav = useMemo(() => cardNavId(), [])

	const renderSlides = () => {
		if (!movieData || !Array.isArray(movieData.items)) return null
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
		1024: { slidesPerView: 6, spaceBetween: 18 },
		1530: { slidesPerView: 6, spaceBetween: 18 },
		1700: { slidesPerView: 8, spaceBetween: 18 },
	}

	const horizontalBreakpoints = {
		320: { slidesPerView: 3, spaceBetween: 18 }, // Mobile nhỏ
		480: { slidesPerView: 5, spaceBetween: 18 }, // Mobile lớn
		768: { slidesPerView: 6, spaceBetween: 18 }, // Tablet
		1024: { slidesPerView: 7, spaceBetween: 18 }, // Desktop
		1530: { slidesPerView: 3, spaceBetween: 20 }, // Màn lớn
		1700: { slidesPerView: 6, spaceBetween: 18 }, // Màn lớn
	}

	// Xác định đường dẫn điều hướng
	const navParam = `movies/${movieData?.params?.type_slug === 'danh-sach' ? '' : 'country'}`
	const typeList = movieData?.type_list || ''

	return (
		<div className={cx('collection')} data-aos='fade-up'>
			<Flex className={cx('collection-title')} align='center' gap={20}>
				{isLoading ? (
					<Skeleton.Input active style={{ width: '200px', height: '40px' }} className={cx('skeleton-title-header')} />
				) : (
					<>
						<Typography.Title className={cx('title')} level={2}>
							{movieData?.titlePage}
						</Typography.Title>
						<AnimatePresence mode='sync'>
							<Link to={`${navParam}?name=${typeList}&page=1`} state={{ param: typeList }}>
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
							</Link>
						</AnimatePresence>
					</>
				)}
			</Flex>
			<div className={cx('swiper-container')}>
				{!isLoading && (
					<div className={cx('swiper-button')}>
						<FaAngleLeft className={cx('custom-prev', `custom-prev-${cardNav}`)} />
						<FaAngleRight className={cx('custom-next', `custom-next-${cardNav}`)} />
					</div>
				)}
				<Swiper
					modules={[Navigation, Scrollbar, Autoplay]}
					autoplay={!isLoading ? { delay: 3000, reverseDirection: reverseDirection } : false}
					slidesPerView={8}
					spaceBetween={18}
					navigation={
						!isLoading
							? {
									prevEl: `.custom-prev-${cardNav}`,
									nextEl: `.custom-next-${cardNav}`,
							  }
							: false
					}
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
		params: PropTypes.shape({
			type_slug: PropTypes.string,
		}),
		type_list: PropTypes.string,
	}),
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	reverseDirection: PropTypes.bool,
	isLoading: PropTypes.bool,
}

export default Collection
