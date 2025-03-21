import { Button, Flex, Typography } from 'antd'
import styles from './TopicsList.module.scss'

import { FaAngleRight } from 'react-icons/fa6'
import classNames from 'classnames/bind'
import MovieCard from '~/components/movie/MovieCard/MovieCard'

import PropTypes from 'prop-types'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import 'swiper/css'
import 'swiper/css/navigation'
import MovieCardHover from '../../MovieCard/MovieCardHover/MovieCardHover'

const cx = classNames.bind(styles)
function TopicsList({ data, isLoading }) {
	const [cardNav] = useState(() => Math.floor(Math.random() * 100))
	const [hoveredCard, setHoveredCard] = useState(null)

	const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })
	const cardRef = useRef(null)
	const cardDetail = useMemo(() => data?.items.find((m) => m._id === hoveredCard), [hoveredCard, data?.items])
	console.log('🚀 ~ TopicsList ~ cardDetail:', cardDetail)

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

		// Cập nhật vị trí của card detail để hiển thị đè lên card gốc
		setCardPosition({
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX,
		})
	}, [hoveredCard])

	return (
		<div>
			{!isLoading ? (
				<>
					<Flex className={cx('topics-list')} justify='space-between' align='center'>
						<div className={cx('topics-list-content')}>
							<Typography.Title className={cx('topic-title')} level={2}>
								{data?.breadCrumb[0].name}
							</Typography.Title>
							<Flex align='center' gap={4} className={cx('view-more')}>
								<Typography.Text>Xem toàn bộ</Typography.Text>
								<FaAngleRight />
							</Flex>
						</div>
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
								{Array.isArray(data?.items) &&
									data.items.map((item, index) => (
										<SwiperSlide key={item._id} virtualIndex={index}>
											<MovieCard
												imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
												movieData={item}
												handleMouseEnter={handleMouseEnter}
												hoveredCard={hoveredCard}
												cardPosition={cardPosition}
												setCardPosition={setCardPosition}
												cardRef={cardRef}
											/>
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
					</Flex>
					<MovieCardHover
						movieData={cardDetail}
						hoveredCard={hoveredCard}
						cardPosition={cardPosition}
						handleMouseLeave={handleMouseLeave}
						imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
					/>
				</>
			) : (
				<div>loading</div>
			)}
		</div>
	)
}

export default TopicsList

TopicsList.propTypes = {
	data: PropTypes.shape({
		breadCrumb: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
			}),
		).isRequired,
		APP_DOMAIN_CDN_IMAGE: PropTypes.string.isRequired,
		items: PropTypes.arrayOf(
			PropTypes.shape({
				_id: PropTypes.string.isRequired,
			}),
		),
	}).isRequired,
	isLoading: PropTypes.bool.isRequired,
}
