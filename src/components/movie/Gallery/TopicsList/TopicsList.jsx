import { Col, Flex, Row, Typography } from 'antd'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCarousel from '~/components/common/SwiperCarousel/SwiperCarousel'
import { getRandomRGBColor } from '~/utils/getRandomColor'
import MovieCardWithHoverSkeleton from '../../MovieCardWithHover/MovieCardWithHoverSkeleton/MovieCardWithHoverSkeleton'
import styles from './TopicsList.module.scss'

const cx = classNames.bind(styles)

function TopicsList({ data, isLoading }) {
	const [randomColor] = useState(() => getRandomRGBColor())

	// Xác định đường dẫn điều hướng
	const navParam = `movies/${data?.params?.type_slug === 'danh-sach' ? '' : 'country'}`
	const breadcrumbTitle = data?.breadCrumb?.[0]?.name || 'Default Title'
	const typeList = data?.type_list || ''

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
			{isLoading ? (
				<Flex gap={16}>
					{[...Array(5)].map((_, index) => (
						<MovieCardWithHoverSkeleton key={index} direction='horizontal' />
					))}
				</Flex>
			) : (
				<Col span={21}>{data?.items?.length > 0 && <SwiperCarousel data={data} />}</Col>
			)}
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
