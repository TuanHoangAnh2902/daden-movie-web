import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Divider, Flex, Typography } from 'antd'
import classNames from 'classnames/bind'
const { Title, Text } = Typography

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '~/features/auth/authSlice'
import { logOut } from '~/services/authService'

import styles from './AccountInfo.module.scss'

const cx = classNames.bind(styles)
function AccountInfo() {
	const { user } = useSelector((state) => state.auth)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleLogout = async () => {
		const result = await logOut()
		if (!result.error) {
			dispatch(logout())
			navigate('/')
		}
	}

	return (
		<div className={cx('wrapper')}>
			<div className={cx('profile-container')}>
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
		</div>
	)
}

export default AccountInfo
