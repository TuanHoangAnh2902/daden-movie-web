import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import {
	addList,
	updateList,
	removeList,
	addMovieToListAction,
	removeMovieFromListAction,
	setMovieLists,
} from '~/features/movieLists/movieListsSlice'
import {
	createMovieList,
	deleteMovieList,
	renameMovieList,
	addMovieToList,
	removeMovieFromList,
	isMovieInList,
	getMovieLists,
} from '~/features/movieLists/movieListsService'

const useMovieLists = () => {
	const [loading, setLoading] = useState(false)
	const [messageApi, contextHolder] = message.useMessage()
	const dispatch = useDispatch()
	const { lists } = useSelector((state) => state.movieLists)
	const { isAuthenticated } = useSelector((state) => state.auth)

	// Fetch movie lists when the hook is initialized
	useEffect(() => {
		let isMounted = true

		const fetchMovieLists = async () => {
			try {
				const response = await getMovieLists()
				// Only update state if component is still mounted
				if (isMounted && response.data) {
					dispatch(setMovieLists(response.data))
				}
			} catch (error) {
				console.error('Error fetching movie lists:', error)
			}
		}

		fetchMovieLists()

		// Cleanup function to prevent state updates after unmount
		return () => {
			isMounted = false
		}
	}, [dispatch])

	// Get all available lists
	const getAllLists = useCallback(() => {
		return lists ? Object.values(lists) : []
	}, [lists])

	// Create a new list
	const handleCreateList = useCallback(
		async (name, description = '') => {
			if (!isAuthenticated) {
				messageApi.error('Bạn cần đăng nhập để sử dụng chức năng này')
				return null
			}

			try {
				setLoading(true)
				const result = await createMovieList(name, description)

				if (result.status === 'success') {
					dispatch(addList(result.data))
					messageApi.success(`Đã tạo danh sách "${name}"`)
					return result.data
				} else {
					messageApi.error(result.error || 'Không thể tạo danh sách')
					return null
				}
			} catch (error) {
				console.error('Error creating list:', error)
				messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau')
				return null
			} finally {
				setLoading(false)
			}
		},
		[dispatch, isAuthenticated, messageApi],
	)

	// Delete a list
	const handleDeleteList = useCallback(
		async (listId) => {
			if (!isAuthenticated) {
				messageApi.error('Bạn cần đăng nhập để sử dụng chức năng này')
				return false
			}

			try {
				setLoading(true)
				const result = await deleteMovieList(listId)

				if (result.status === 'success') {
					dispatch(removeList(listId))
					messageApi.success('Đã xóa danh sách')
					return true
				} else {
					messageApi.error(result.error || 'Không thể xóa danh sách')
					return false
				}
			} catch (error) {
				console.error('Error deleting list:', error)
				messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau')
				return false
			} finally {
				setLoading(false)
			}
		},
		[dispatch, isAuthenticated, messageApi],
	)

	// Rename a list
	const handleRenameList = useCallback(
		async (listId, newName, newDescription) => {
			if (!isAuthenticated) {
				messageApi.error('Bạn cần đăng nhập để sử dụng chức năng này')
				return false
			}

			try {
				setLoading(true)
				const result = await renameMovieList(listId, newName, newDescription)

				if (result.status === 'success') {
					dispatch(
						updateList({
							listId,
							updates: {
								name: newName,
								...(newDescription !== undefined && { description: newDescription }),
								updatedAt: Date.now(),
							},
						}),
					)
					messageApi.success('Đã cập nhật danh sách')
					return true
				} else {
					messageApi.error(result.error || 'Không thể cập nhật danh sách')
					return false
				}
			} catch (error) {
				console.error('Error renaming list:', error)
				messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau')
				return false
			} finally {
				setLoading(false)
			}
		},
		[dispatch, isAuthenticated, messageApi],
	)

	// Add a movie to a list
	const handleAddMovieToList = useCallback(
		async (listId, movie) => {
			if (!isAuthenticated) {
				messageApi.error('Bạn cần đăng nhập để sử dụng chức năng này')
				return false
			}

			try {
				setLoading(true)
				const result = await addMovieToList(listId, movie)

				if (result.status === 'success') {
					dispatch(addMovieToListAction({ listId, movie }))
					messageApi.success('Đã thêm phim vào danh sách')
					return true
				} else {
					messageApi.error(result.error || 'Không thể thêm phim vào danh sách')
					return false
				}
			} catch (error) {
				console.error('Error adding movie to list:', error)
				messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau')
				return false
			} finally {
				setLoading(false)
			}
		},
		[dispatch, isAuthenticated, messageApi],
	)

	// Remove a movie from a list
	const handleRemoveMovieFromList = useCallback(
		async (listId, movieId) => {
			if (!isAuthenticated) {
				messageApi.error('Bạn cần đăng nhập để sử dụng chức năng này')
				return false
			}

			try {
				setLoading(true)
				const result = await removeMovieFromList(listId, movieId)

				if (result.status === 'success') {
					dispatch(removeMovieFromListAction({ listId, movieId }))
					messageApi.success('Đã xóa phim khỏi danh sách')
					return true
				} else {
					messageApi.error(result.error || 'Không thể xóa phim khỏi danh sách')
					return false
				}
			} catch (error) {
				console.error('Error removing movie from list:', error)
				messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau')
				return false
			} finally {
				setLoading(false)
			}
		},
		[dispatch, isAuthenticated, messageApi],
	)

	// Check if a movie is in a list
	const checkIsMovieInList = useCallback(
		async (listId, movieId) => {
			if (!isAuthenticated || !lists || !lists[listId]) {
				return false
			}

			// First check in Redux store if the movie is in the list
			if (lists[listId]?.movies && lists[listId].movies[movieId]) {
				return true
			}

			// If not found in the store, check in Firebase
			return await isMovieInList(listId, movieId)
		},
		[isAuthenticated, lists],
	)

	return {
		lists,
		loading,
		contextHolder,
		getAllLists,
		handleCreateList,
		handleDeleteList,
		handleRenameList,
		handleAddMovieToList,
		handleRemoveMovieFromList,
		checkIsMovieInList,
	}
}

export default useMovieLists
