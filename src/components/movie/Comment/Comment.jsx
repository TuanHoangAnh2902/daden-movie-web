import { SendOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Flex, Form, Input, Spin, message } from 'antd'
import classNames from 'classnames/bind'
import { onValue, push, ref, serverTimestamp, set } from 'firebase/database'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { FaCommentDots } from 'react-icons/fa'
import { db } from '~/config/firebase'
import styles from './Comment.module.scss'
import { useSelector } from 'react-redux'

const cx = classNames.bind(styles)
function Comment({ movieId }) {
	const user = useSelector((state) => state.auth.user)
	console.log('🚀 ~ Comment ~ user:', user)
	const [form] = Form.useForm()
	const [comments, setComments] = useState([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)

	// Lấy danh sách comments từ Firebase khi component mount hoặc movieId thay đổi
	useEffect(() => {
		if (!movieId) return

		const commentsRef = ref(db, `comments/${movieId}`)
		setLoading(true)

		const unsubscribe = onValue(
			commentsRef,
			(snapshot) => {
				const data = snapshot.val()
				const commentsList = []

				if (data) {
					// Chuyển đổi object thành array và sắp xếp theo thời gian mới nhất
					Object.keys(data).forEach((key) => {
						commentsList.push({
							id: key,
							...data[key],
						})
					})

					// Sắp xếp comments theo thời gian giảm dần (mới nhất lên đầu)
					commentsList.sort((a, b) => {
						// Handle case when timestamp is null or undefined
						if (!a.timestamp) return 1
						if (!b.timestamp) return -1
						return b.timestamp - a.timestamp
					})
				}

				setComments(commentsList)
				setLoading(false)
			},
			(error) => {
				console.error('Error loading comments:', error)
				message.error('Không thể tải bình luận. Vui lòng thử lại sau.')
				setLoading(false)
			},
		)

		// Cleanup listener khi component unmount
		return () => unsubscribe()
	}, [movieId])

	const onFinish = (values) => {
		if (!user || !movieId) {
			message.warning('Vui lòng đăng nhập để bình luận')
			return
		}

		setSubmitting(true)

		// Tạo một ID duy nhất cho comment mới
		const newCommentRef = push(ref(db, `comments/${movieId}`))

		// Lưu comment vào database
		set(newCommentRef, {
			content: values.commentContent,
			userId: user.uid,
			userName: user.displayName || 'Người dùng ẩn danh',
			userPhoto: user.photoURL || '',
			timestamp: serverTimestamp(),
		})
			.then(() => {
				// Reset form sau khi gửi comment thành công
				form.resetFields()
				message.success('Đã gửi bình luận')
			})
			.catch((error) => {
				console.error('Error posting comment:', error)
				if (error.code === 'PERMISSION_DENIED') {
					message.error('Bạn không có quyền gửi bình luận. Vui lòng đăng nhập lại.')
				} else {
					message.error('Không thể gửi bình luận. Vui lòng thử lại sau.')
				}
			})
			.finally(() => {
				setSubmitting(false)
			})
	}

	// Format timestamp thành chuỗi thời gian tương đối
	const formatTimestamp = (timestamp) => {
		if (!timestamp) return 'Vừa xong'

		const now = new Date()
		const time = new Date(timestamp)
		const diffInSeconds = Math.floor((now - time) / 1000)

		if (diffInSeconds < 60) return 'Vừa xong'
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
		if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`

		// Format date DD/MM/YYYY
		return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`
	}

	return (
		<div className={cx('wrapper')}>
			<Flex className={cx('title')} gap={14} align='center'>
				<FaCommentDots />
				<h5>Bình luận</h5>
			</Flex>

			<Form className={cx('comment-form')} onFinish={onFinish} layout='vertical' form={form}>
				<Flex className={cx('account-user')} gap={14} align='center'>
					<Avatar size={48} icon={<UserOutlined />} src={user?.photoURL} />
					<Flex className={cx('user-info')} gap={4} vertical justify='space-between'>
						<p className={cx('user-title')}>Bình luận với tên</p>
						<p className={cx('user-name')}>{user?.displayName || 'Vui lòng đăng nhập'}</p>
					</Flex>
				</Flex>
				<div className={cx('comment-input')}>
					<Form.Item name='commentContent' rules={[{ required: true, message: 'Bình luận không thể trống!' }]}>
						<Input.TextArea
							className={cx('input')}
							placeholder={user ? 'Viết bình luận' : 'Vui lòng đăng nhập để bình luận'}
							rows={4}
							disabled={!user}
						/>
					</Form.Item>
					<Form.Item>
						<Button
							className={cx('send-btn')}
							type='link'
							htmlType='submit'
							icon={<SendOutlined />}
							iconPosition='end'
							loading={submitting}
							disabled={!user || submitting}>
							Gửi
						</Button>
					</Form.Item>
				</div>
			</Form>

			<div className={cx('content')}>
				{loading ? (
					<Flex justify='center' style={{ padding: '20px 0' }}>
						<Spin />
					</Flex>
				) : comments.length > 0 ? (
					comments.map((comment) => (
						<Flex
							className={cx('account-comment')}
							gap={14}
							align='top'
							key={comment.id}
							style={{ marginBottom: '20px' }}>
							<Avatar size={48} icon={<UserOutlined />} src={comment.userPhoto} />
							<div className={cx('account-info')}>
								<Flex gap={14} align='center'>
									<p className={cx('account-name')}>{comment.userName}</p>
									<p className={cx('account-time')}>{formatTimestamp(comment.timestamp)}</p>
								</Flex>
								<p className={cx('account-comment-text')}>{comment.content}</p>
							</div>
						</Flex>
					))
				) : (
					<p style={{ textAlign: 'center', opacity: 0.7 }}>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
				)}
			</div>
		</div>
	)
}

Comment.propTypes = {
	movieId: PropTypes.string,
}

export default Comment
