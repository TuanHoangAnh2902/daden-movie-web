import styles from '../MovieCardWithHover.module.scss'
import classNames from 'classnames/bind'
import { Skeleton } from 'antd'
import PropTypes from 'prop-types'
import { useThemeColors } from '~/themes/useThemeColors'

// Skeleton component for MovieCardWithHover
const cx = classNames.bind(styles)
const MovieCardWithHoverSkeleton = ({ direction = 'vertical' }) => {
	const { cardHeightHorizontal, cardHeightVertical, cardWidthHorizontal, cardWidthVertical } = useThemeColors()

	return (
		<div className={cx('movie-card', direction, 'skeleton')}>
			<div className={cx('card')}>
				<div className={cx('card-img')}>
					<Skeleton.Image
						active
						className={cx('card-img-element', 'skeleton-img')}
						style={{
							minWidth: direction === 'vertical' ? cardWidthVertical : cardWidthHorizontal,
							minHeight: direction === 'vertical' ? cardHeightVertical : cardHeightHorizontal,
						}}
					/>
				</div>
				<div className={cx('card-content')}>
					<Skeleton.Input
						active
						size='small'
						className={cx('skeleton-title')}
						style={{ width: '100%', marginTop: '8px' }}
					/>
					{direction === 'horizontal' && (
						<Skeleton.Input
							active
							size='small'
							className={cx('skeleton-subtitle')}
							style={{ width: '70%', marginTop: '4px' }}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
MovieCardWithHoverSkeleton.propTypes = {
	direction: PropTypes.oneOf(['vertical', 'horizontal']),
}

export default MovieCardWithHoverSkeleton
