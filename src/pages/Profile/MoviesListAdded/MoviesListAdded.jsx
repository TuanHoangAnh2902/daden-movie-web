import { ConfigProvider, Empty, Flex, Modal, Tabs } from 'antd'
import classNames from 'classnames/bind'
import { useCallback, useState } from 'react'
import { FaRegPlayCircle } from 'react-icons/fa'
import { TiPlus } from 'react-icons/ti'
import MovieCardWithHover from '~/components/movie/MovieCardWithHover/MovieCardWithHover'
import MoviesListHandle from '~/components/movie/MoviesListHandle'
import useMovieLists from '~/hooks/useMovieLists'
import { useThemeColors } from '~/themes/useThemeColors'
import styles from './MoviesListAdded.module.scss'
import { IoMdClose } from 'react-icons/io'

const cx = classNames.bind(styles)
function MoviesListAdded() {
	const [editMode, setEditMode] = useState(null) // null or listId being edited
	const [formInitialValues, setFormInitialValues] = useState({ name: '', description: '' })
	const { lists, contextHolder, handleCreateList, handleDeleteList, handleRenameList } = useMovieLists()
	const [createModal, setCreateModal] = useState(false)
	const { subColor } = useThemeColors()

	const showCreateModal = () => {
		setEditMode(null)
		setFormInitialValues({ name: '', description: '' })
		setCreateModal(true)
	}

	const hideCreateModal = () => {
		setCreateModal(false)
	}

	// Xử lý form submit (tạo hoặc sửa)
	const handleFormSubmit = useCallback(
		async (values) => {
			try {
				let success = false

				if (editMode) {
					success = await handleRenameList(editMode, values.name, values.description || '')
					if (success) {
						setEditMode(null)
					}
				} else {
					const newList = await handleCreateList(values.name, values.description || '')
					success = !!newList
				}

				if (success) {
					setCreateModal(false)
					return true
				}
				return false
			} catch (error) {
				console.error('Lỗi khi xử lý danh sách:', error)
				return false
			}
		},
		[editMode, handleCreateList, handleRenameList],
	)

	// Xử lý xóa danh sách
	const handleDelete = useCallback(async () => {
		if (!editMode) return false

		try {
			const success = await handleDeleteList(editMode)
			if (success) {
				setCreateModal(false)
				return true
			}
			return false
		} catch (error) {
			console.error('Lỗi khi xóa danh sách:', error)
			return false
		}
	}, [editMode, handleDeleteList])

	// Bắt đầu chỉnh sửa danh sách
	const startEditing = useCallback((list) => {
		setEditMode(list.id)
		setFormInitialValues({
			name: list.name,
			description: list.description || '',
		})
		setCreateModal(true)
	}, [])

	// Tạo nội dung tabs cho mỗi danh sách phim
	const tabItems =
		lists && typeof lists === 'object'
			? Object.keys(lists).map((key) => {
					const list = lists[key]
					const movieCount = list.movies ? Object.keys(list.movies).length : 0

					return {
						key: list.id,
						label: (
							<Flex className={cx('list-header')} vertical gap={10}>
								<span>{list.name}</span>
								<Flex className={cx('movie-info')} align='center' justify='space-between'>
									<Flex className={cx('movie-count')} align='center' gap={4}>
										<FaRegPlayCircle /> {movieCount} <p>Phim</p>
									</Flex>
									<p className={cx('update')} onClick={() => startEditing(list)}>
										Sửa
									</p>
								</Flex>
							</Flex>
						),
						children: (
							<div>
								{list.movies && Object.keys(list.movies).length > 0 ? (
									<Flex className={cx('list-movies')} wrap='wrap' gap={16}>
										{Object.keys(list.movies).map((movieId) => {
											const movie = list.movies[movieId]
											return (
												<MovieCardWithHover
													key={movie._id}
													imageUrl={null}
													direction={'vertical'}
													movieData={list.movies[movieId]}
												/>
											)
										})}
									</Flex>
								) : (
									<Empty description='Không có phim nào trong danh sách này' className={cx('empty-list')} />
								)}
							</div>
						),
					}
			  })
			: []

	return (
		<>
			{contextHolder}
			<div className={cx('wrapper')}>
				<Flex className={cx('title')} gap={12}>
					<h5>Danh sách</h5>
					<button className={cx('add-btn')} onClick={showCreateModal}>
						<Flex>
							<TiPlus />
							<p>Thêm mới</p>
						</Flex>
					</button>
				</Flex>
				{tabItems.length > 0 ? (
					<ConfigProvider
						theme={{
							components: {
								Tabs: { colorPrimary: subColor, inkBarColor: 'none' },
							},
						}}>
						<Tabs type='card' size='small' defaultActiveKey='1' items={tabItems} />
					</ConfigProvider>
				) : (
					<Empty description='Bạn chưa tạo danh sách nào' />
				)}
			</div>

			<Modal
				closeIcon={<IoMdClose className={cx('close-icon')} />}
				className={cx('modal')}
				title={editMode ? 'Cập nhật danh sách' : 'Tạo danh sách mới'}
				open={createModal}
				onCancel={hideCreateModal}
				footer={null}
				destroyOnClose>
				<MoviesListHandle
					initialValues={formInitialValues}
					isEditing={!!editMode}
					onSubmit={handleFormSubmit}
					onCancel={hideCreateModal}
					onDelete={editMode ? handleDelete : undefined}
				/>
			</Modal>
		</>
	)
}

export default MoviesListAdded
