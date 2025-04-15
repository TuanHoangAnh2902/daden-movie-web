import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeFavorites } from '~/features/favorites/favoritesService'
import { setFavorites, clearFavorites } from '~/features/favorites/favoritesSlice'

const FavoritesInitializer = ({ children }) => {
	const dispatch = useDispatch()
	const { isAuthenticated } = useSelector((state) => state.auth)
	const { initialized } = useSelector((state) => state.favorites)

	useEffect(() => {
		const loadFavorites = async () => {
			if (isAuthenticated && !initialized) {
				try {
					const result = await initializeFavorites()
					if (result.status === 'success') {
						dispatch(setFavorites(result.data))
					} else {
						console.error('Error loading favorites:', result.error)
					}
				} catch (error) {
					console.error('Failed to load favorites:', error)
				}
			} else if (!isAuthenticated && initialized) {
				// Người dùng đăng xuất, xóa danh sách yêu thích
				dispatch(clearFavorites())
			}
		}

		loadFavorites()
	}, [isAuthenticated, initialized, dispatch])

	return children
}

export default FavoritesInitializer
