import { Flex, Typography } from 'antd'
import styles from './TopicsList.module.scss'

import { FaAngleRight } from 'react-icons/fa6'
import classNames from 'classnames/bind'
import MovieCard from '~/components/movie/MovieCard/MovieCard'

import PropTypes from 'prop-types'

const cx = classNames.bind(styles)
function TopicsList({ data, isLoading }) {
	return (
		<div>
			{!isLoading ? (
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
					<MovieCard imageUrl={data?.APP_DOMAIN_CDN_IMAGE} movieData={data} />
				</Flex>
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
	}).isRequired,
	isLoading: PropTypes.bool.isRequired,
}
