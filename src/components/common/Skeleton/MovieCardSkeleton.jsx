import { Flex, Skeleton } from 'antd'
import classNames from 'classnames/bind'
import styles from './MovieCardSkeleton.module.scss'
import PropTypes from 'prop-types'

const cx = classNames.bind(styles)

const MovieCardSkeleton = ({ direction = 'vertical', active = true }) => {
	return (
		<Flex vertical className={cx('movie-card-skeleton', direction)}>
			<Flex justify='center' align='center' className={cx('card-img-skeleton')}>
				<Skeleton.Image active={active} className={cx('img-skeleton')} />
			</Flex>
			<Flex vertical justify='center' className={cx('card-content-skeleton')}>
				<Skeleton
					active={active}
					paragraph={{ rows: direction === 'horizontal' ? 2 : 1, width: ['100%'] }}
					title={false}
				/>
			</Flex>
		</Flex>
	)
}

MovieCardSkeleton.propTypes = {
	direction: PropTypes.oneOf(['vertical', 'horizontal']),
	active: PropTypes.bool,
}

export default MovieCardSkeleton
