import { CaretDownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, ConfigProvider, Dropdown, Flex, Modal, Row, Space, Tabs } from 'antd'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Logo from '~/assets/Logo'
import Login from '~/components/auth/Login'
import Register from '~/components/auth/Register'
import ForgotPassword from '~/components/auth/ForgotPassword'
import { moviesCategories } from '~/constants/routes'
import { logout } from '~/features/auth/authSlice'
import { logOut } from '~/services/authService'
import { useThemeColors } from '~/themes/useThemeColors'
import MovieSearch from '../../movie/MovieSearch/MovieSearch'
import styles from './MovieTopNav.module.scss'

const cx = classNames.bind(styles)

function MovieTopNav() {
	const [lastScrollY, setLastScrollY] = useState(0)
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
	const [activeTabKey, setActiveTabKey] = useState('1')
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const { user, isAuthenticated } = useSelector((state) => state.auth)
	const dispatch = useDispatch()
	const { subColor, textColor } = useThemeColors()

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

	const showAuthModal = (isLogin = true) => {
		setActiveTabKey(isLogin ? '1' : '2')
		setIsAuthModalOpen(true)
	}

	const handleCancel = () => {
		setIsAuthModalOpen(false)
	}

	const handleLogout = async () => {
		const result = await logOut()
		if (!result.error) {
			dispatch(logout())
		}
	}

	const userMenuItems = [
		{
			key: 'user',
			label: <Link to='/user/profile'>Hồ sơ</Link>,
			icon: <UserOutlined />,
		},
		{
			key: 'logout',
			label: <span onClick={handleLogout}>Đăng xuất</span>,
			icon: <LogoutOutlined />,
		},
	]

	const items = [
		{
			key: '1',
			label: 'Đăng nhập',
			children: (
				<Login
					onClose={handleCancel}
					switchToRegister={() => setActiveTabKey('2')}
					switchToForgotPassword={() => setActiveTabKey('3')}
				/>
			),
		},
		{
			key: '2',
			label: 'Đăng ký',
			children: <Register onClose={handleCancel} switchToLogin={() => setActiveTabKey('1')} />,
		},
		{
			key: '3',
			label: 'Quên mật khẩu',
			children: <ForgotPassword switchToLogin={() => setActiveTabKey('1')} />,
		},
	]
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

				{/* Auth Section */}
				<div className={cx('auth-section')}>
					{isAuthenticated ? (
						<Dropdown
							menu={{ items: userMenuItems }}
							trigger={['click']}
							onOpenChange={setUserMenuOpen}
							open={userMenuOpen}>
							<div className={cx('user-info')}>
								<Avatar src={user?.photoURL} icon={!user?.photoURL && <UserOutlined />} className={cx('user-avatar')} />
								<span className={cx('user-name')}>{user?.displayName || user?.email?.split('@')[0]}</span>
							</div>
						</Dropdown>
					) : (
						<Flex gap={12}>
							<Button type='primary' className={cx('login-button')} onClick={() => showAuthModal(true)}>
								Đăng nhập
							</Button>
							<Button className={cx('register-button')} onClick={() => showAuthModal(false)}>
								Đăng ký
							</Button>
						</Flex>
					)}
				</div>
			</Flex>

			{/* Auth Modal */}
			<ConfigProvider theme={{ components: { Modal: { contentBg: '#1e2545' } } }}>
				<Modal
					destroyOnClose
					open={isAuthModalOpen}
					footer={null}
					onCancel={handleCancel}
					centered
					className={cx('login-modal')}
					width={950}>
					<Row style={{ height: '100%' }}>
						<Col className={cx('modal-img')} span={12}>
							<img
								src='https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg'
								alt=''
							/>
						</Col>
						<Col span={12}>
							<ConfigProvider
								theme={{
									components: {
										Tabs: {
											itemActiveColor: subColor,
											inkBarColor: subColor,
											itemSelectedColor: subColor,
											itemHoverColor: subColor,
										},
									},
									token: { colorText: textColor },
								}}>
								<Tabs
									className={cx('tabs-auth')}
									centered
									animated
									activeKey={activeTabKey}
									onChange={setActiveTabKey}
									items={items}
								/>
							</ConfigProvider>
						</Col>
					</Row>
				</Modal>
			</ConfigProvider>
		</Flex>
	)
}

export default MovieTopNav
