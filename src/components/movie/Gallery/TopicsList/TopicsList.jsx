import { Button, Flex, Typography } from 'antd'
import styles from './TopicsList.module.scss'
import { FaAngleRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import classNames from 'classnames/bind'
import MovieCard from '~/components/movie/MovieCard/MovieCard'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules'
import { useCallback, useMemo, useRef, useState } from 'react'

import 'swiper/css'
import 'swiper/css/navigation'
import MovieCardHover from '../../MovieCard/MovieCardHover/MovieCardHover'

const cx = classNames.bind(styles)

function TopicsList({ data, isLoading }) {
	// Generate a stable nav ID for the carousel
	const cardNavId = useMemo(() => `card-nav-${Math.floor(Math.random() * 100)}`, [])

	// States for hover functionality
	const [hoveredCard, setHoveredCard] = useState(null)
	const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })

	// Create a memoized lookup for the hovered card data to avoid recalculation
	const cardDetail = useMemo(
		() => (hoveredCard ? data?.items.find((m) => m._id === hoveredCard) : null),
		[hoveredCard, data?.items],
	)

	// Ref for the card element
	const cardRef = useRef(null)

	// Memoized handlers for mouse events to prevent recreation on each render
	const handleMouseEnter = useCallback((id) => {
		setHoveredCard(id)

		// Get the position of the card immediately when it's hovered
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect()
			setCardPosition({
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
			})
		}
	}, [])

	const handleMouseLeave = useCallback(() => {
		setHoveredCard(null)
	}, [])

	// Loading state
	if (isLoading) {
		return <div className={cx('loading-container')}>loading</div>
	}

	return (
		<div className={cx('container')}>
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
						className={cx(`custom-prev-${cardNavId}`, 'nav-btn-prev')}
						icon={<FaChevronLeft />}
					/>
					<Swiper
						modules={[Navigation, Scrollbar, Autoplay]}
						slidesPerView={4}
						grabCursor
						spaceBetween={18}
						navigation={{
							prevEl: `.custom-prev-${cardNavId}`,
							nextEl: `.custom-next-${cardNavId}`,
						}}
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
										direction='horizontal'
									/>
								</SwiperSlide>
							))}
					</Swiper>
					<Button
						size='large'
						shape='circle'
						className={cx(`custom-next-${cardNavId}`, 'nav-btn-next')}
						icon={<FaChevronRight />}
					/>
				</Flex>
			</Flex>

			{/* Only render MovieCardHover when a card is hovered */}
			{hoveredCard && (
				<MovieCardHover
					movieData={cardDetail}
					hoveredCard={hoveredCard}
					cardPosition={cardPosition}
					handleMouseLeave={handleMouseLeave}
					imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
				/>
			)}
		</div>
	)
}

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

export default TopicsList
