import classNames from 'classnames/bind'
import styles from './CategoryInfo.module.scss'
import PropTypes from 'prop-types'

import { Flex } from 'antd'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)
function CategoryInfo({ categoryData, carousel = false }) {
	return (
		<Flex className={cx('category-container')} gap={10} wrap>
			{categoryData?.map((category) => (
				<Link
					to={`/movies/category?name=${category?.slug}`}
					key={category.id}
					className={cx(carousel ? 'category-item-carousel' : 'category-item')}>
					{category.name}
				</Link>
			))}
		</Flex>
	)
}
CategoryInfo.propTypes = {
	categoryData: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			name: PropTypes.string,
		}),
	),
	carousel: PropTypes.bool,
}

export default CategoryInfo
