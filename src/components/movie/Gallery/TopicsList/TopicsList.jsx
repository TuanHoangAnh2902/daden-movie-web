import { Col, Flex, Row, Typography } from 'antd'
import { FaAngleRight } from 'react-icons/fa6'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'

import styles from './TopicsList.module.scss'
import SwiperCarousel from '~/components/common/SwiperCarousel/SwiperCarousel'

import 'swiper/css'
import 'swiper/css/navigation'

const cx = classNames.bind(styles)
function TopicsList({ data, isLoading }) {
	// Generate a stable nav ID for the carousel

	// Loading state
	if (isLoading) {
		return <div className={cx('loading-container')}>loading</div>
	}

	return (
		<Row wrap={false} className={cx('topics-list')} justify={'space-around'} align='middle'>
			<Col span={3} className={cx('topics-list-content')}>
				<Typography.Title className={cx('topic-title')} level={2}>
					{data?.breadCrumb?.[0]?.name || 'Default Title'}
				</Typography.Title>
				<Flex align='center' gap={4} className={cx('view-more')}>
					<Typography.Text>Xem toàn bộ</Typography.Text>
					<FaAngleRight />
				</Flex>
			</Col>
			<Col span={21}>
				<SwiperCarousel data={data} isLoading={isLoading} />
			</Col>
		</Row>
	)
}

TopicsList.propTypes = {
	data: PropTypes.shape({
		breadCrumb: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				items: PropTypes.arrayOf(
					PropTypes.shape({
						_id: PropTypes.string.isRequired,
					}),
				),
			}),
		),
		APP_DOMAIN_CDN_IMAGE: PropTypes.string,
		items: PropTypes.arrayOf(
			PropTypes.shape({
				_id: PropTypes.string.isRequired,
			}),
		),
	}),
	isLoading: PropTypes.bool,
}

export default TopicsList
