import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { toggleFavorite } from '~/features/favorites/favoritesService'
import { addFavorite, removeFavorite } from '~/features/favorites/favoritesSlice'

// Custom hook để xử lý chức năng thêm/xóa phim yêu thích
const useToggleFavorite = () => {
	const [isToggling, setIsToggling] = useState(false)
	const [messageApi, contextHolder] = message.useMessage()
	const dispatch = useDispatch()
	const { favoriteIds } = useSelector((state) => state.favorites)
	const { isAuthenticated } = useSelector((state) => state.auth)

	//Kiểm tra một bộ phim có trong danh sách yêu thích không
	const checkIsFavorite = (movieId) => {
		return favoriteIds.includes(movieId)
	}

	// Xử lý thêm/xóa phim khỏi danh sách yêu thích
	const handleToggleFavorite = async (movieData) => {
		if (!isAuthenticated) {
			messageApi.error('Bạn cần đăng nhập để sử dụng chức năng này')
			return
		}

		try {
			setIsToggling(true)
			const result = await toggleFavorite(movieData)

			if (result.status === 'added') {
				dispatch(addFavorite(movieData._id))
				messageApi.success('Đã thêm vào danh sách yêu thích')
			} else if (result.status === 'removed') {
				dispatch(removeFavorite(movieData._id))
				messageApi.info('Đã xóa khỏi danh sách yêu thích')
			} else if (result.error) {
				messageApi.error(result.error)
			}
		} catch (error) {
			messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau')
			console.error('Error toggling favorite:', error)
		} finally {
			setIsToggling(false)
		}
	}

	return {
		checkIsFavorite,
		isToggling,
		handleToggleFavorite,
		contextHolder,
	}
}

export default useToggleFavorite
