import 'swiper/css'
import 'swiper/css/navigation'
import styles from './SwiperCarousel.module.scss'

import cardNavId from '~/utils/cardNavId'
import MovieCardWithHover from '~/components/movie/MovieCardWithHover/MovieCardWithHover'

import { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { Button, Flex } from 'antd'
import { SwiperSlide, Swiper } from 'swiper/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Autoplay, Scrollbar, Navigation } from 'swiper/modules'
console.log('width: ', window.innerWidth)

const cx = classNames.bind(styles)
function SwiperCarousel({ data }) {
	const cardNav = useMemo(() => cardNavId(), [])

	return (
		<Flex align='center' justify='space-between' className={cx('nav-container')}>
			<Button
				size='large'
				shape='circle'
				className={cx(`custom-prev-${cardNav}`, 'nav-btn-prev')}
				icon={<FaChevronLeft />}
			/>
			<Swiper
				modules={[Navigation, Scrollbar, Autoplay]}
				slidesPerView={3}
				spaceBetween={18}
				navigation={{
					prevEl: `.custom-prev-${cardNav}`,
					nextEl: `.custom-next-${cardNav}`,
				}}
				breakpoints={{
					320: { slidesPerView: 3, spaceBetween: 18 }, // Mobile nhỏ
					480: { slidesPerView: 5, spaceBetween: 18 }, // Mobile lớn
					768: { slidesPerView: 6, spaceBetween: 18 }, // Tablet
					1024: { slidesPerView: 7, spaceBetween: 18 }, // Desktop
					1530: { slidesPerView: 3, spaceBetween: 80 }, // Màn lớn
					1700: { slidesPerView: 5, spaceBetween: 18 }, // Màn lớn
				}}
				className={cx('carousel')}>
				{Array.isArray(data?.items) &&
					data.items?.map((item, index) => (
						<SwiperSlide key={item._id} virtualIndex={index}>
							<MovieCardWithHover imageUrl={data?.APP_DOMAIN_CDN_IMAGE} movieData={item} direction={'horizontal'} />
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
	)
}

SwiperCarousel.propTypes = {
	data: PropTypes.shape({
		APP_DOMAIN_CDN_IMAGE: PropTypes.string.isRequired,
		items: PropTypes.arrayOf(PropTypes.object).isRequired,
	}),
	isLoading: PropTypes.bool.isRequired,
}
export default SwiperCarousel
