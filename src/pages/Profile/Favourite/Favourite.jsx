import { Typography } from 'antd'
import styles from './Favourite.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)
function Favourite() {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('favourite-container')}>
				<Typography.Title level={3} className={cx('title')}>
					Danh sách yêu thích
				</Typography.Title>
			</div>
		</div>
	)
}

export default Favourite
