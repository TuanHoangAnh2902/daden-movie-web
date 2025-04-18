import { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Modal, List, Button, Typography, Divider, Checkbox, Empty, Spin, Space, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import useMovieLists from '~/hooks/useMovieLists'
import MoviesListHandle from '../MoviesListHandle'
import styles from './MovieListSelector.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

// Sub-component for list item
const ListItem = ({ list, isChecked, isLoading, onToggleInList, onEdit, onDelete }) => (
	<List.Item
		className={cx('list-item')}
		actions={[
			<Button key='edit' icon={<EditOutlined />} size='small' onClick={() => onEdit(list)} />,
			<Button key='delete' icon={<DeleteOutlined />} danger size='small' onClick={() => onDelete(list.id)} />,
		]}>
		<div className={cx('list-item-content')}>
			<Checkbox checked={isChecked} onChange={(e) => onToggleInList(list.id, e.target.checked)} disabled={isLoading}>
				<Space>
					{isLoading ? <Spin size='small' /> : null}
					<Typography.Text strong>{list.name}</Typography.Text>
				</Space>
			</Checkbox>
			{list.description && (
				<Typography.Text type='secondary' className={cx('list-description')}>
					{list.description}
				</Typography.Text>
			)}
		</div>
	</List.Item>
)

ListItem.propTypes = {
	list: PropTypes.object.isRequired,
	isChecked: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	onToggleInList: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
}

// Main component
const MovieListSelector = ({ movie, isOpen, onClose }) => {
	const [createMode, setCreateMode] = useState(false)
	const [editMode, setEditMode] = useState(null) // null or listId being edited
	const [formInitialValues, setFormInitialValues] = useState({ name: '', description: '' })
	const [checkedLists, setCheckedLists] = useState({})
	const [loadingStates, setLoadingStates] = useState({})
	const [initializing, setInitializing] = useState(false)
	const [initialLoadComplete, setInitialLoadComplete] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)

	const {
		lists,
		loading,
		contextHolder,
		handleCreateList,
		handleDeleteList,
		handleRenameList,
		handleAddMovieToList,
		handleRemoveMovieFromList,
		checkIsMovieInList,
	} = useMovieLists()

	// Memoize danh sách để tránh re-render không cần thiết
	const userLists = useMemo(() => Object.values(lists || {}), [lists])

	// Khởi tạo checked state một cách hiệu quả
	useEffect(() => {
		if (!isOpen || !movie || !userLists.length || initialLoadComplete) {
			return
		}

		const initializeCheckedStates = async () => {
			try {
				setInitializing(true)
				setErrorMessage(null)

				// Tạo mảng các promise để check từng danh sách song song
				const checkPromises = userLists.map(async (list) => {
					try {
						const isInList = await checkIsMovieInList(list.id, movie._id)
						return { listId: list.id, isInList }
					} catch (error) {
						console.error(`Lỗi khi kiểm tra phim trong danh sách ${list.id}:`, error)
						return { listId: list.id, isInList: false }
					}
				})

				// Chờ tất cả các promise hoàn thành
				const results = await Promise.all(checkPromises)

				// Chuyển mảng kết quả thành object state
				const newCheckedStates = results.reduce((acc, { listId, isInList }) => {
					acc[listId] = isInList
					return acc
				}, {})

				setCheckedLists(newCheckedStates)
				setInitialLoadComplete(true)
			} catch (error) {
				console.error('Lỗi khi khởi tạo trạng thái danh sách:', error)
				setErrorMessage('Không thể tải trạng thái danh sách. Vui lòng thử lại sau.')
			} finally {
				setInitializing(false)
			}
		}

		initializeCheckedStates()
	}, [isOpen, movie, userLists, checkIsMovieInList, initialLoadComplete])

	// Reset initialLoadComplete khi đóng và mở lại modal
	useEffect(() => {
		if (!isOpen) {
			setInitialLoadComplete(false)
			setErrorMessage(null)
		}
	}, [isOpen])

	// Tạo danh sách mới
	const handleCreate = useCallback(
		async (values) => {
			try {
				const newList = await handleCreateList(values.name, values.description || '')
				if (newList) {
					setCreateMode(false)
					message.success('Tạo danh sách thành công')
					return true
				}
				return false
			} catch (error) {
				console.error('Lỗi khi tạo danh sách:', error)
				message.error('Không thể tạo danh sách. Vui lòng thử lại sau.')
				return false
			}
		},
		[handleCreateList],
	)

	// Chỉnh sửa danh sách
	const handleEdit = useCallback(
		async (values) => {
			if (!editMode) return false

			try {
				const success = await handleRenameList(editMode, values.name, values.description)

				if (success) {
					setEditMode(null)
					message.success('Cập nhật danh sách thành công')
					return true
				}
				return false
			} catch (error) {
				console.error('Lỗi khi cập nhật danh sách:', error)
				message.error('Không thể cập nhật danh sách. Vui lòng thử lại sau.')
				return false
			}
		},
		[editMode, handleRenameList],
	)

	// Xóa danh sách
	const handleDelete = useCallback(
		async (listId) => {
			try {
				const success = await handleDeleteList(listId)
				if (success) {
					message.success('Xóa danh sách thành công')
				}
			} catch (error) {
				console.error('Lỗi khi xóa danh sách:', error)
				message.error('Không thể xóa danh sách. Vui lòng thử lại sau.')
			}
		},
		[handleDeleteList],
	)

	// Thêm/xóa phim khỏi danh sách
	const handleToggleInList = useCallback(
		async (listId, checked) => {
			// Cập nhật trạng thái loading cho danh sách cụ thể
			setLoadingStates((prev) => ({ ...prev, [listId]: true }))

			try {
				let success = false

				if (checked) {
					success = await handleAddMovieToList(listId, movie)
					if (success) {
						message.success('Đã thêm phim vào danh sách')
					}
				} else {
					success = await handleRemoveMovieFromList(listId, movie._id)
					if (success) {
						message.success('Đã xóa phim khỏi danh sách')
					}
				}

				// Cập nhật UI nếu thành công
				if (success) {
					setCheckedLists((prev) => ({ ...prev, [listId]: checked }))
				}
			} catch (error) {
				console.error('Lỗi khi thêm/xóa phim khỏi danh sách:', error)
				message.error('Không thể cập nhật trạng thái phim trong danh sách')
			} finally {
				// Xóa trạng thái loading
				setLoadingStates((prev) => ({ ...prev, [listId]: false }))
			}
		},
		[handleAddMovieToList, handleRemoveMovieFromList, movie],
	)

	// Bắt đầu chỉnh sửa danh sách
	const startEditing = useCallback((list) => {
		setEditMode(list.id)
		setCreateMode(false)
		setFormInitialValues({
			name: list.name,
			description: list.description || '',
		})
	}, [])

	// Bắt đầu tạo danh sách mới
	const startCreating = useCallback(() => {
		setCreateMode(true)
		setEditMode(null)
		setFormInitialValues({ name: '', description: '' })
	}, [])

	// Hủy tạo/chỉnh sửa
	const cancelFormAction = useCallback(() => {
		setCreateMode(false)
		setEditMode(null)
	}, [])

	// Xử lý submit form
	const handleFormSubmit = useCallback(
		async (values) => {
			if (editMode) {
				return await handleEdit(values)
			} else {
				return await handleCreate(values)
			}
		},
		[editMode, handleEdit, handleCreate],
	)

	// Nội dung hiển thị trong modal
	const renderModalContent = () => {
		if (createMode || editMode) {
			return (
				<MoviesListHandle
					initialValues={formInitialValues}
					isEditing={!!editMode}
					onSubmit={handleFormSubmit}
					onCancel={cancelFormAction}
					onDelete={editMode ? () => handleDelete(editMode) : undefined}
					loading={loading}
				/>
			)
		}

		return (
			<>
				<Button icon={<PlusOutlined />} onClick={startCreating} className={cx('create-list-btn')}>
					Tạo danh sách mới
				</Button>

				<Divider />

				{errorMessage && (
					<Typography.Text type='danger' style={{ display: 'block', marginBottom: '16px' }}>
						{errorMessage}
					</Typography.Text>
				)}

				{loading || initializing ? (
					<div className={cx('loading-container')}>
						<Spin size='large' />
						<Typography.Text type='secondary' style={{ marginTop: 10 }}>
							{initializing ? 'Đang kiểm tra trạng thái phim...' : 'Đang tải danh sách...'}
						</Typography.Text>
					</div>
				) : userLists.length > 0 ? (
					<List
						dataSource={userLists}
						renderItem={(list) => (
							<ListItem
								key={list.id}
								list={list}
								isChecked={!!checkedLists[list.id]}
								isLoading={!!loadingStates[list.id]}
								onToggleInList={handleToggleInList}
								onEdit={startEditing}
								onDelete={handleDelete}
							/>
						)}
					/>
				) : (
					<Empty description='Chưa có danh sách nào' />
				)}
			</>
		)
	}

	return (
		<Modal
			title='Thêm vào danh sách'
			open={isOpen}
			onCancel={onClose}
			footer={null}
			width={500}
			className={cx('movie-list-modal')}
			destroyOnClose>
			{contextHolder}
			{renderModalContent()}
		</Modal>
	)
}

MovieListSelector.propTypes = {
	movie: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
}

export default MovieListSelector
