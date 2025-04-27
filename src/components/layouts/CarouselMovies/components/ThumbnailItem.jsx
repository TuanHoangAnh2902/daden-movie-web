import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { memo } from 'react'
import styles from '../CarouselMovies.module.scss'

const cx = classNames.bind(styles)

const ThumbnailItem = ({ isActive, posterUrl, movieName, onClick }) => (
	<div className={cx('carousel-item', { active: isActive })} onClick={onClick}>
		<img
			src={posterUrl || 'fallback.jpg'}
			alt={`thumbnail-${movieName}`}
			loading='lazy'
			style={{
				transform: isActive ? 'scale(1.2)' : 'scale(1)',
				opacity: isActive ? 1 : 0.7,
				outline: isActive ? '1px solid #f1c40f' : 'none',
			}}
		/>
	</div>
)

ThumbnailItem.propTypes = {
	isActive: PropTypes.bool.isRequired,
	posterUrl: PropTypes.string,
	movieName: PropTypes.string,
	onClick: PropTypes.func.isRequired,
}

ThumbnailItem.displayName = 'ThumbnailItem'

export default memo(ThumbnailItem)
