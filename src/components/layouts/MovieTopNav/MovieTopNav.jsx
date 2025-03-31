import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { ConfigProvider, Dropdown, Flex, Space } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'

import Logo from '~/assets/Logo'
import styles from './MovieTopNav.module.scss'
import MovieSearch from '../../movie/MovieSearch/MovieSearch'
import { moviesCategories } from '~/constants/routes'
import { useEffect, useState } from 'react'

const cx = classNames.bind(styles)

function MovieTopNav() {
	const [lastScrollY, setLastScrollY] = useState(0)

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY
			setLastScrollY(currentScrollY)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [lastScrollY])

	return (
		<Flex className={cx('top-nav', { 'bg-color': lastScrollY !== 0 })} align='center' justify='space-around'>
			<Flex align='center' gap={14}>
				<Link to='/'>
					<Logo width={50} height={50} />
				</Link>
				<MovieSearch />
			</Flex>

			<Flex align='center' gap={20}>
				{moviesCategories?.map((category) => {
					const menuItems = category.children?.map((child) => ({
						key: child.to,
						label: <Link to={`movies/${category.to}?name=${child.to}`}>{child.name}</Link>,
					}))

					return (
						<Flex className={cx('nav-tab')} key={category.to || category.name} align='center'>
							{category.children ? (
								<ConfigProvider theme={{ components: { Dropdown: { paddingBlock: 0 } } }}>
									<Dropdown className={cx('dropdown-link')} arrow menu={{ items: menuItems }} trigger={['click']}>
										<Space>
											<p className={cx('name')}>{category.name}</p>
											<CaretDownOutlined />
										</Space>
									</Dropdown>
								</ConfigProvider>
							) : (
								<Link className='nav-child' to={`movies?name=${category.to}&page=1`}>
									{category.name}
								</Link>
							)}
						</Flex>
					)
				})}
			</Flex>
		</Flex>
	)
}

export default MovieTopNav
