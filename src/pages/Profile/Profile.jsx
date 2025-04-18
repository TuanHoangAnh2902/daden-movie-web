import { Avatar, Col, Flex, Row, Spin } from 'antd'
import classNames from 'classnames/bind'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import styles from './Profile.module.scss'
import { TiHeartFullOutline } from 'react-icons/ti'
import { FaPlus, FaUser } from 'react-icons/fa6'
import { UserOutlined } from '@ant-design/icons'

const cx = classNames.bind(styles)
const Profile = () => {
	const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)

	const navigate = useNavigate()
	const location = useLocation()
	const currentPath = location.pathname.split('/')[2] || 'profile' // Get the current path after '/user/' or default to 'profile'

	// If not authenticated, redirect to home
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate('/')
		}
	}, [isAuthenticated, isLoading, navigate])

	// Define menu items with their paths and icons for cleaner code
	const menuItems = [
		{ path: 'profile', label: 'Tài khoản', icon: <FaUser /> },
		{ path: 'favourite', label: 'Yêu thích', icon: <TiHeartFullOutline /> },
		{ path: 'lists', label: 'Danh sách', icon: <FaPlus /> },
	]

	useEffect(() => {
		// Scroll to top when the component mounts or the path changes
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [])

	if (isLoading) {
		return (
			<Flex align='center' justify='center' style={{ height: '80vh' }}>
				<Spin size='large' />
			</Flex>
		)
	}

	return (
		<div className={cx('wrapper')}>
			<Row className={cx('profile-container')} align={'top'} justify={'space-between'}>
				<Col flex='0 0 18%' className={cx('tabs-side')}>
					<h1>Quản lý tài khoản</h1>
					<Flex vertical className={cx('profile-menu')}>
						{menuItems.map((item) => (
							<Link key={item.path} to={item.path}>
								<Flex gap={10} className={cx('menu-item', { active: currentPath === item.path })} align='center'>
									{item.icon}
									<p>{item.label}</p>
								</Flex>
							</Link>
						))}
					</Flex>

					<Flex vertical gap={16} className={cx('user-info')}>
						<Avatar
							size={65}
							src={user?.photoURL}
							icon={!user?.photoURL && <UserOutlined />}
							className={cx('user-avatar')}
						/>
						<Flex vertical gap={5} className={cx('user-detail')}>
							<h5>{user?.displayName || 'Người dùng'}</h5>
							<p type='secondary'>{user?.email}</p>
						</Flex>
					</Flex>
				</Col>
				<Col flex='auto' className={cx('content-side')}>
					<Outlet />
				</Col>
			</Row>
		</div>
	)
}

export default Profile
