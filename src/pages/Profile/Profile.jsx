import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Divider, Flex, Spin, Typography } from 'antd'
import classNames from 'classnames/bind'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logout } from '~/features/auth/authSlice'
import { logOut } from '~/services/authService'
import styles from './Profile.module.scss'

const { Title, Text } = Typography

const cx = classNames.bind(styles)
const Profile = () => {
	const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)
	console.log('🚀 ~ Profile ~ user:', user)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	// If not authenticated, redirect to home
	React.useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate('/')
		}
	}, [isAuthenticated, isLoading, navigate])

	const handleLogout = async () => {
		const result = await logOut()
		if (!result.error) {
			dispatch(logout())
			navigate('/')
		}
	}

	if (isLoading) {
		return (
			<Flex align='center' justify='center' style={{ height: '80vh' }}>
				<Spin size='large' />
			</Flex>
		)
	}

	return (
		<div className={cx('profile-container')}>
			<Title level={2} className={cx('page-title')}>
				Hồ sơ của tôi
			</Title>

			<Card className={cx('profile-card')}>
				<Flex align='center' gap={16} className={cx('user-header')}>
					<Avatar
						size={80}
						src={user?.photoURL}
						icon={!user?.photoURL && <UserOutlined />}
						className={cx('user-avatar')}
					/>
					<div className={cx('user-info')}>
						<Title level={3}>{user?.displayName || 'Người dùng'}</Title>
						<Text type='secondary'>{user?.email}</Text>
					</div>
				</Flex>

				<Divider />

				<div className={cx('account-details')}>
					<Title level={4}>Chi tiết tài khoản</Title>

					<div className={cx('detail-item')}>
						<Text strong>Email:</Text>
						<Text>{user?.email}</Text>
					</div>

					<div className={cx('detail-item')}>
						<Text strong>Xác thực email:</Text>
						<Text>{user?.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</Text>
					</div>

					<div className={cx('detail-item')}>
						<Text strong>ID người dùng:</Text>
						<Text className={cx('user-id')}>{user?.uid}</Text>
					</div>
				</div>

				<Divider />

				<Flex gap={12} className={cx('action-buttons')}>
					<Button type='primary' icon={<LockOutlined />} className={cx('change-password-btn')}>
						Đổi mật khẩu
					</Button>

					<Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
						Đăng xuất
					</Button>
				</Flex>
			</Card>
		</div>
	)
}

export default Profile
