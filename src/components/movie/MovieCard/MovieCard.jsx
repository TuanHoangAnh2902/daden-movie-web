import styles from './MovieCard.module.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

const cx = classNames.bind(styles)
function MovieCard({ imageUrl, movieData, handleMouseEnter, hoveredCard, setCardPosition, cardRef, direction }) {
	const imageBaseUrl = `${imageUrl}/uploads/movies/`

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
	}, [cardRef, hoveredCard, setCardPosition])

	return (
		<div
			onMouseEnter={() => handleMouseEnter(movieData._id)}
			ref={hoveredCard === movieData._id ? cardRef : null}
			className={cx('movie-card', direction === 'vertical' ? 'vertical' : 'horizontal')}>
			<motion.div className={cx('card')} layoutId={hoveredCard}>
				<div className={cx('card-img')}>
					<motion.img
						key={hoveredCard}
						src={
							direction === 'horizontal' ? imageBaseUrl + movieData?.poster_url : imageBaseUrl + movieData?.thumb_url
						}
						alt={movieData?.name || 'Movie'}
					/>
				</div>
				<div className={cx('card-content')}>
					<p className={cx('card-content-title')}>{movieData?.name || 'Unknown Title'}</p>
				</div>
			</motion.div>
		</div>
	)
}

MovieCard.propTypes = {
	imageUrl: PropTypes.string,
	movieData: PropTypes.object,
	handleMouseEnter: PropTypes.func,
	hoveredCard: PropTypes.string,
	setCardPosition: PropTypes.func,
	cardRef: PropTypes.object,
	direction: PropTypes.string,
}

export default MovieCard
