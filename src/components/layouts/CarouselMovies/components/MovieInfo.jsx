import { Flex } from 'antd'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { memo } from 'react'
import styles from '../CarouselMovies.module.scss'

const cx = classNames.bind(styles)

const MovieInfo = ({ episode_current, episode_total, year }) => (
	<Flex gap={8} className={cx('imdb-info')}>
		<div className={cx('category-item')}>{episode_current}</div>
		<div className={cx('category-item')}>{`Tập: ${episode_total}`}</div>
		<div className={cx('category-item')}>{year}</div>
	</Flex>
)

MovieInfo.propTypes = {
	episode_current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	episode_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

MovieInfo.displayName = 'MovieInfo'

export default memo(MovieInfo)
