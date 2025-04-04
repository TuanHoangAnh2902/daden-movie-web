import classNames from 'classnames/bind'
import styles from './CategoryInfo.module.scss'
import PropTypes from 'prop-types'

import { Flex } from 'antd'

const cx = classNames.bind(styles)
function CategoryInfo({ categoryData }) {
	return (
		<Flex className={cx('category-container')} gap={10} wrap>
			{categoryData?.map((category) => (
				<div key={category.id} className={cx('category-item')}>
					{category.name}
				</div>
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
}

export default CategoryInfo
