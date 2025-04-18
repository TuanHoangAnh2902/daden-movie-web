import {
	DeleteOutlined,
	EditOutlined,
	LikeOutlined,
	LikeFilled,
	DislikeOutlined,
	DislikeFilled,
	SendOutlined,
	UserOutlined,
	MessageOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Flex, Form, Input, Spin, message, Popconfirm, Pagination, Select, Tooltip } from 'antd'
import classNames from 'classnames/bind'
import { onValue, push, ref, serverTimestamp, set, update, remove, get } from 'firebase/database'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { FaCommentDots } from 'react-icons/fa'
import { db } from '~/config/firebase'
import styles from './Comment.module.scss'
import { useSelector } from 'react-redux'

const cx = classNames.bind(styles)
function Comment({ movieId }) {
	const user = useSelector((state) => state.auth.user)
	const [form] = Form.useForm()
	const [replyForm] = Form.useForm()
	const [editForm] = Form.useForm()
	const [comments, setComments] = useState([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [replyingTo, setReplyingTo] = useState(null)
	const [editingComment, setEditingComment] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [sortBy, setSortBy] = useState('newest')
	const [totalComments, setTotalComments] = useState(0)
	const [commentCount, setCommentCount] = useState(0)

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
				const repliesMap = {}

				if (data) {
					// Trước tiên thu thập tất cả bình luận và phản hồi
					Object.keys(data).forEach((key) => {
						const comment = {
							id: key,
							...data[key],
							likes: data[key].likes || {},
							dislikes: data[key].dislikes || {},
							replies: [],
						}

						// Tính toán số lượng like và dislike
						comment.likeCount = comment.likes ? Object.keys(comment.likes).length : 0
						comment.dislikeCount = comment.dislikes ? Object.keys(comment.dislikes).length : 0

						if (comment.parentId) {
							// Đây là phản hồi, lưu vào map tạm thời
							if (!repliesMap[comment.parentId]) {
								repliesMap[comment.parentId] = []
							}
							repliesMap[comment.parentId].push(comment)
						} else {
							// Đây là bình luận gốc
							commentsList.push(comment)
						}
					})

					// Gán các phản hồi vào bình luận gốc tương ứng
					commentsList.forEach((comment) => {
						if (repliesMap[comment.id]) {
							comment.replies = repliesMap[comment.id]
							// Sắp xếp phản hồi theo thời gian tăng dần
							comment.replies.sort((a, b) => {
								if (!a.timestamp) return 1
								if (!b.timestamp) return -1
								return a.timestamp - b.timestamp
							})
						}
					})

					// Sắp xếp comments theo thời gian mới nhất mặc định
					sortComments(commentsList, sortBy)
				}

				setComments(commentsList)
				setTotalComments(commentsList.length)

				// Đếm tổng số bình luận (bao gồm cả phản hồi)
				let totalCount = commentsList.length
				commentsList.forEach((comment) => {
					totalCount += comment.replies.length
				})
				setCommentCount(totalCount)

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
	}, [movieId, sortBy])

	// Hàm sắp xếp comments
	const sortComments = (commentsList, method) => {
		switch (method) {
			case 'newest':
				commentsList.sort((a, b) => {
					if (!a.timestamp) return 1
					if (!b.timestamp) return -1
					return b.timestamp - a.timestamp
				})
				break
			case 'oldest':
				commentsList.sort((a, b) => {
					if (!a.timestamp) return 1
					if (!b.timestamp) return -1
					return a.timestamp - b.timestamp
				})
				break
			case 'mostLiked':
				commentsList.sort((a, b) => {
					const aLikes = a.likeCount || 0
					const bLikes = b.likeCount || 0
					return bLikes - aLikes
				})
				break
			case 'mostReplies':
				commentsList.sort((a, b) => {
					const aReplies = a.replies ? a.replies.length : 0
					const bReplies = b.replies ? b.replies.length : 0
					return bReplies - aReplies
				})
				break
			default:
				commentsList.sort((a, b) => {
					if (!a.timestamp) return 1
					if (!b.timestamp) return -1
					return b.timestamp - a.timestamp
				})
		}
	}

	// Xử lý thay đổi cách sắp xếp
	const handleSortChange = (value) => {
		setSortBy(value)
		const sortedComments = [...comments]
		sortComments(sortedComments, value)
		setComments(sortedComments)
		setCurrentPage(1) // Reset trang khi thay đổi sắp xếp
	}

	// Xử lý khi gửi bình luận
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
			likes: {},
			dislikes: {},
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

	// Xử lý khi trả lời bình luận
	const handleReply = (values) => {
		if (!user || !movieId || !replyingTo) {
			message.warning('Vui lòng đăng nhập để trả lời bình luận')
			return
		}

		setSubmitting(true)

		// Tạo một ID duy nhất cho reply mới
		const newReplyRef = push(ref(db, `comments/${movieId}`))

		// Lưu reply vào database
		set(newReplyRef, {
			content: values.replyContent,
			userId: user.uid,
			userName: user.displayName || 'Người dùng ẩn danh',
			userPhoto: user.photoURL || '',
			timestamp: serverTimestamp(),
			parentId: replyingTo.id,
			replyToUser: replyingTo.userName,
			likes: {},
			dislikes: {},
		})
			.then(() => {
				// Reset form và trạng thái sau khi gửi reply thành công
				replyForm.resetFields()
				setReplyingTo(null)
				message.success('Đã gửi phản hồi')
			})
			.catch((error) => {
				console.error('Error posting reply:', error)
				message.error('Không thể gửi phản hồi. Vui lòng thử lại sau.')
			})
			.finally(() => {
				setSubmitting(false)
			})
	}

	// Xử lý khi chỉnh sửa bình luận
	const handleEdit = (values) => {
		if (!user || !movieId || !editingComment) {
			message.warning('Không thể chỉnh sửa bình luận')
			return
		}

		if (editingComment.userId !== user.uid) {
			message.error('Bạn chỉ có thể chỉnh sửa bình luận của mình')
			return
		}

		setSubmitting(true)

		// Cập nhật bình luận trong database
		const commentRef = ref(db, `comments/${movieId}/${editingComment.id}`)
		update(commentRef, {
			content: values.editContent,
			edited: true,
			editTimestamp: serverTimestamp(),
		})
			.then(() => {
				// Reset form và trạng thái sau khi chỉnh sửa thành công
				editForm.resetFields()
				setEditingComment(null)
				message.success('Đã cập nhật bình luận')
			})
			.catch((error) => {
				console.error('Error editing comment:', error)
				message.error('Không thể cập nhật bình luận. Vui lòng thử lại sau.')
			})
			.finally(() => {
				setSubmitting(false)
			})
	}

	// Xử lý khi xóa bình luận
	const handleDelete = (comment) => {
		if (!user || !movieId) {
			message.warning('Không thể xóa bình luận')
			return
		}

		if (comment.userId !== user.uid) {
			message.error('Bạn chỉ có thể xóa bình luận của mình')
			return
		}

		// Nếu là bình luận gốc, cần xóa cả các phản hồi
		const deleteComment = async () => {
			try {
				// Trước tiên kiểm tra xem bình luận có phản hồi không
				if (!comment.parentId) {
					// Đây là bình luận gốc, lấy tất cả phản hồi
					const repliesSnapshot = await get(ref(db, `comments/${movieId}`))
					const replies = repliesSnapshot.val()

					// Xóa tất cả phản hồi của bình luận này
					if (replies) {
						const deletePromises = Object.keys(replies)
							.filter((key) => replies[key].parentId === comment.id)
							.map((key) => remove(ref(db, `comments/${movieId}/${key}`)))

						// Chờ tất cả các phản hồi được xóa
						if (deletePromises.length > 0) {
							await Promise.all(deletePromises)
						}
					}
				}

				// Xóa bình luận
				await remove(ref(db, `comments/${movieId}/${comment.id}`))
				message.success('Đã xóa bình luận')
			} catch (error) {
				console.error('Error deleting comment:', error)
				message.error('Không thể xóa bình luận. Vui lòng thử lại sau.')
			}
		}

		deleteComment()
	}

	// Xử lý thích/không thích bình luận
	const handleReaction = async (comment, reactionType) => {
		if (!user || !movieId) {
			message.warning('Vui lòng đăng nhập để thích/không thích bình luận')
			return
		}

		const commentRef = ref(db, `comments/${movieId}/${comment.id}`)
		const userId = user.uid

		try {
			// Kiểm tra trạng thái hiện tại
			const commentSnapshot = await get(commentRef)
			const commentData = commentSnapshot.val()

			if (!commentData) {
				message.error('Bình luận không tồn tại')
				return
			}

			const likes = commentData.likes || {}
			const dislikes = commentData.dislikes || {}

			const updates = {}

			if (reactionType === 'like') {
				if (likes[userId]) {
					// Người dùng đã thích, bỏ thích
					updates[`likes/${userId}`] = null
				} else {
					// Người dùng chưa thích, thêm thích và xóa không thích (nếu có)
					updates[`likes/${userId}`] = true
					updates[`dislikes/${userId}`] = null
				}
			} else if (reactionType === 'dislike') {
				if (dislikes[userId]) {
					// Người dùng đã không thích, bỏ không thích
					updates[`dislikes/${userId}`] = null
				} else {
					// Người dùng chưa không thích, thêm không thích và xóa thích (nếu có)
					updates[`dislikes/${userId}`] = true
					updates[`likes/${userId}`] = null
				}
			}

			// Cập nhật dữ liệu
			await update(commentRef, updates)
		} catch (error) {
			console.error('Error updating reaction:', error)
			message.error('Không thể cập nhật phản ứng. Vui lòng thử lại sau.')
		}
	}

	// Kiểm tra người dùng đã thích/không thích bình luận hay chưa
	const hasUserReacted = (comment, reactionType) => {
		if (!user) return false

		const userId = user.uid
		if (reactionType === 'like' && comment.likes) {
			return !!comment.likes[userId]
		} else if (reactionType === 'dislike' && comment.dislikes) {
			return !!comment.dislikes[userId]
		}

		return false
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

	// Render bình luận
	const renderComment = (comment, isReply = false) => {
		const isCommentOwner = user && user.uid === comment.userId
		const likeActive = hasUserReacted(comment, 'like')
		const dislikeActive = hasUserReacted(comment, 'dislike')

		return (
			<Flex
				className={cx('account-comment', { 'comment-reply': isReply })}
				gap={14}
				align='top'
				key={comment.id}
				style={{ marginBottom: '20px' }}>
				<Avatar size={isReply ? 36 : 48} icon={<UserOutlined />} src={comment.userPhoto} />
				<div className={cx('account-info')}>
					<Flex gap={14} align='center'>
						<p className={cx('account-name')}>{comment.userName}</p>
						<p className={cx('account-time')}>
							{formatTimestamp(comment.timestamp)}
							{comment.edited && <span className={cx('edited-mark')}> (đã chỉnh sửa)</span>}
						</p>
					</Flex>

					{/* Hiển thị tag người được phản hồi */}
					{comment.replyToUser && (
						<p className={cx('reply-to')}>
							Trả lời <span>@{comment.replyToUser}</span>
						</p>
					)}

					{/* Nội dung bình luận hoặc form chỉnh sửa */}
					{editingComment && editingComment.id === comment.id ? (
						<Form form={editForm} initialValues={{ editContent: comment.content }} onFinish={handleEdit}>
							<Form.Item name='editContent' rules={[{ required: true, message: 'Nội dung không thể trống!' }]}>
								<Input.TextArea className={cx('edit-input')} rows={3} autoFocus />
							</Form.Item>
							<Flex gap={8}>
								<Button type='primary' htmlType='submit' loading={submitting}>
									Lưu
								</Button>
								<Button onClick={() => setEditingComment(null)}>Hủy</Button>
							</Flex>
						</Form>
					) : (
						<p className={cx('account-comment-text')}>{comment.content}</p>
					)}

					{/* Actions cho bình luận */}
					<Flex className={cx('comment-actions')} gap={16} align='center'>
						<Tooltip title='Thích'>
							<Button
								type='text'
								icon={likeActive ? <LikeFilled /> : <LikeOutlined />}
								onClick={() => handleReaction(comment, 'like')}
								className={cx({ 'active-like': likeActive })}>
								{comment.likeCount > 0 && <span>{comment.likeCount}</span>}
							</Button>
						</Tooltip>

						<Tooltip title='Không thích'>
							<Button
								type='text'
								icon={dislikeActive ? <DislikeFilled /> : <DislikeOutlined />}
								onClick={() => handleReaction(comment, 'dislike')}
								className={cx({ 'active-dislike': dislikeActive })}>
								{comment.dislikeCount > 0 && <span>{comment.dislikeCount}</span>}
							</Button>
						</Tooltip>

						{!isReply && (
							<Tooltip title='Trả lời'>
								<Button type='text' icon={<MessageOutlined />} onClick={() => setReplyingTo(comment)}>
									Trả lời
								</Button>
							</Tooltip>
						)}

						{isCommentOwner && (
							<>
								<Tooltip title='Chỉnh sửa'>
									<Button
										type='text'
										icon={<EditOutlined />}
										onClick={() => {
											setEditingComment(comment)
											editForm.setFieldsValue({ editContent: comment.content })
										}}
									/>
								</Tooltip>
								<Tooltip title='Xóa'>
									<Popconfirm
										title='Xóa bình luận'
										description='Bạn có chắc chắn muốn xóa bình luận này?'
										onConfirm={() => handleDelete(comment)}
										okText='Có'
										cancelText='Không'>
										<Button type='text' danger icon={<DeleteOutlined />} />
									</Popconfirm>
								</Tooltip>
							</>
						)}
					</Flex>

					{/* Form trả lời */}
					{replyingTo && replyingTo.id === comment.id && (
						<div className={cx('reply-form')}>
							<Form form={replyForm} onFinish={handleReply}>
								<Form.Item name='replyContent' rules={[{ required: true, message: 'Vui lòng nhập nội dung trả lời!' }]}>
									<Input.TextArea
										placeholder={`Đang trả lời @${comment.userName}`}
										rows={3}
										className={cx('reply-input')}
										autoFocus
									/>
								</Form.Item>
								<Flex gap={8} justify='flex-end'>
									<Button onClick={() => setReplyingTo(null)}>Hủy</Button>
									<Button type='primary' htmlType='submit' loading={submitting}>
										Gửi trả lời
									</Button>
								</Flex>
							</Form>
						</div>
					)}

					{/* Hiển thị replies */}
					{!isReply && comment.replies && comment.replies.length > 0 && (
						<div className={cx('replies-container')}>{comment.replies.map((reply) => renderComment(reply, true))}</div>
					)}
				</div>
			</Flex>
		)
	}

	// Tính toán phân trang
	const startIndex = (currentPage - 1) * pageSize
	const endIndex = startIndex + pageSize
	const paginatedComments = comments.slice(startIndex, endIndex)

	return (
		<div className={cx('wrapper')}>
			<Flex className={cx('title')} gap={14} align='center' justify='space-between'>
				<Flex gap={14} align='center'>
					<FaCommentDots />
					<h5>Bình luận ({commentCount})</h5>
				</Flex>
				<Select
					defaultValue='newest'
					style={{ width: 150 }}
					onChange={handleSortChange}
					options={[
						{ value: 'newest', label: 'Mới nhất' },
						{ value: 'oldest', label: 'Cũ nhất' },
						{ value: 'mostLiked', label: 'Nhiều lượt thích' },
						{ value: 'mostReplies', label: 'Nhiều phản hồi' },
					]}
				/>
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
				) : paginatedComments.length > 0 ? (
					<>
						{paginatedComments.map((comment) => renderComment(comment))}

						{totalComments > pageSize && (
							<Flex justify='center' style={{ marginTop: '40px' }}>
								<Pagination
									current={currentPage}
									pageSize={pageSize}
									total={totalComments}
									onChange={(page) => setCurrentPage(page)}
									onShowSizeChange={(current, size) => {
										setCurrentPage(1)
										setPageSize(size)
									}}
									showSizeChanger
									pageSizeOptions={['5', '10', '20', '50']}
								/>
							</Flex>
						)}
					</>
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
