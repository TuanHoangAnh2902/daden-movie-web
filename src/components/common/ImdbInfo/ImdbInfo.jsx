import { Flex } from 'antd'
import styles from './ImdbInfo.module.scss'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'

const cx = classNames.bind(styles)
function ImdbInfo({ ImdbData }) {
	return (
		<Flex className={cx('imdb-info')} gap={6}>
			{ImdbData?.year && <div className={cx('imdb-info-item')}>{ImdbData?.year}</div>}
			{ImdbData?.lang && <div className={cx('imdb-info-item')}>{ImdbData?.lang}</div>}
			{ImdbData?.episode_current && <div className={cx('imdb-info-item')}>{ImdbData?.episode_current}</div>}
			{ImdbData?.time && <div className={cx('imdb-info-item')}>{ImdbData?.time}</div>}
		</Flex>
	)
}

ImdbInfo.propTypes = {
	ImdbData: PropTypes.shape({
		year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		lang: PropTypes.string,
		episode_current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		time: PropTypes.string,
	}).isRequired,
}

export default ImdbInfo
