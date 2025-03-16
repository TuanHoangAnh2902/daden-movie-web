import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { Dropdown, Flex, Space } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'

import Logo from '~/assets/Logo'
import styles from './MovieTopNav.module.scss'
import MovieSearch from '../../movie/MovieSearch/MovieSearch'
import { moviesCategories } from '~/constants/routes'

const cx = classNames.bind(styles)

function MovieTopNav() {
	return (
		<Flex className={cx('top-nav')} align='center' justify='space-around'>
			<Flex align='center' gap={14}>
				<Link to='/'>
					<Logo width={50} height={50} />
				</Link>
				<MovieSearch />
			</Flex>
			<Flex align='center' gap={20}>
				{moviesCategories.map((category, index) => (
					<Flex className={cx('nav-tab')} key={index} align='center'>
						{category.children ? (
							<Dropdown
								arrow
								className='nav-child'
								menu={{
									items: category.children.map((child) => ({
										key: child.to, // Đặt key là đường dẫn
										label: <Link to={child.to}>{child.name}</Link>, // Hiển thị tên phim
									})),
								}}
								trigger={['click']}>
								<Space>
									{category.name}
									<CaretDownOutlined />
								</Space>
							</Dropdown>
						) : (
							<Link className='nav-child' to={category.to}>
								{category.name}
							</Link>
						)}
					</Flex>
				))}
			</Flex>
		</Flex>
	)
}

export default MovieTopNav
