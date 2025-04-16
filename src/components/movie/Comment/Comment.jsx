import { FaCommentDots } from 'react-icons/fa'
import styles from './Comment.module.scss'
import classNames from 'classnames/bind'
import { Avatar, Button, Flex, Form, Input } from 'antd'
import { UserOutlined, SendOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const cx = classNames.bind(styles)
function Comment() {
	const { user } = useSelector((state) => state.auth)

	const onFinish = (values) => {
		console.log(values)
	}

	return (
		<div className={cx('wrapper')}>
			<Flex className={cx('title')} gap={14} align='center'>
				<FaCommentDots />
				<h5>Bình luận</h5>
			</Flex>

			<Form className={cx('comment-form')} onFinish={onFinish} layout='vertical'>
				<Flex className={cx('account-user')} gap={14} align='center'>
					<Avatar size={54} icon={<UserOutlined />} src={user?.photoURL} />
					<Flex className={cx('user-info')} gap={4} vertical justify='space-between'>
						<p className={cx('user-title')}>Bình luận với tên</p>
						<p className={cx('user-name')}>{user?.displayName || 'Vui lòng đăng nhập'}</p>
					</Flex>
				</Flex>
				<div className={cx('comment-input')}>
					<Form.Item name='commentContent' rules={[{ required: true, message: 'Bình luận không thể trống!' }]}>
						<Input.TextArea className={cx('input')} placeholder='Viết bình luận' rows={4} disabled={!user} />
					</Form.Item>
					<Form.Item>
						<Button className={cx('send-btn')} type='link' htmlType='submit' icon={<SendOutlined />} iconPosition='end'>
							Gửi
						</Button>
					</Form.Item>
				</div>
			</Form>

			<div className={cx('content')}>
				<Flex className={cx('account-comment')} gap={14} align='top'>
					<Avatar size={54} icon={<UserOutlined />} />
					<div className={cx('account-info')}>
						<Flex gap={14} align='center'>
							<p className={cx('account-name')}>Tên tài khoản</p>
							<p className={cx('account-time')}>Thời gian</p>
						</Flex>
						<p className={cx('account-comment-text')}>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, cumque.
						</p>
					</div>
				</Flex>
			</div>
		</div>
	)
}

export default Comment
