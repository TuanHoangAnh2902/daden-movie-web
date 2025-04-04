import { Col, Flex, Row, Typography, Skeleton } from 'antd'
import { FaAngleRight } from 'react-icons/fa6'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'

import SwiperCarousel from '~/components/common/SwiperCarousel/SwiperCarousel'
import styles from './TopicsList.module.scss'

import 'swiper/css'
import 'swiper/css/navigation'
import { getRandomRGBColor } from '~/utils/getRandomColor'
import { useState } from 'react'

const cx = classNames.bind(styles)

function TopicsList({ data, isLoading }) {
	const [randomColor] = useState(() => getRandomRGBColor())

	// Xác định đường dẫn điều hướng
	const navParam = `movies/${data?.params?.type_slug === 'danh-sach' ? '' : 'country'}`
	const breadcrumbTitle = data?.breadCrumb?.[0]?.name || 'Default Title'
	const typeList = data?.type_list || ''

	// Hiển thị loading skeleton nếu đang tải dữ liệu
	if (isLoading) {
		return (
			<Row wrap={false} className={cx('topics-list', 'skeleton-container')} justify='space-around' align='middle'>
				<Col span={3} className={cx('topics-list-content')}>
					<Skeleton.Button active size='large' shape='square' block style={{ height: 28, marginBottom: 12 }} />
					<Skeleton.Button active size='small' shape='round' style={{ width: 100 }} />
				</Col>
				<Col span={21} className={cx('skeleton-carousel')}>
					<Flex gap={16}>
						{[...Array(6)].map((_, index) => (
							<div key={index} className={cx('skeleton-card')}>
								<Skeleton.Image active style={{ width: 160, height: 240 }} />
								<Skeleton.Button active size='small' shape='square' block style={{ marginTop: 8, height: 16 }} />
								<Skeleton.Button
									active
									size='small'
									shape='square'
									block
									style={{ marginTop: 4, height: 14, width: '70%' }}
								/>
							</div>
						))}
					</Flex>
				</Col>
			</Row>
		)
	}
	return (
		<Row wrap={false} className={cx('topics-list')} justify='space-around' align='middle'>
			<Col span={3} className={cx('topics-list-content')}>
				<Typography.Title
					className={cx('topic-title')}
					level={3}
					style={{
						background: `linear-gradient(45deg, ${randomColor}, #fff)`,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						fontWeight: 700,
					}}>
					{breadcrumbTitle}
				</Typography.Title>
				<Flex align='center' gap={4} className={cx('view-more')}>
					<Link
						className={cx('view-more-text')}
						to={`${navParam}?name=${typeList}&page=1`}
						state={{ param: typeList, randomColor: randomColor }}>
						Xem toàn bộ
					</Link>
					<FaAngleRight />
				</Flex>
			</Col>
			<Col span={21}>{data?.items?.length > 0 && <SwiperCarousel data={data} isLoading={isLoading} />}</Col>
		</Row>
	)
}

// Định nghĩa PropTypes để đảm bảo tính an toàn của dữ liệu đầu vào
TopicsList.propTypes = {
	data: PropTypes.shape({
		breadCrumb: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
			}),
		),
		params: PropTypes.shape({
			type_slug: PropTypes.string,
		}),
		type_list: PropTypes.string,
		items: PropTypes.arrayOf(
			PropTypes.shape({
				_id: PropTypes.string.isRequired,
			}),
		),
	}),
	isLoading: PropTypes.bool,
}

export default TopicsList
