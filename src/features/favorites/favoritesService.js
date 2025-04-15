import { db, auth } from '~/config/firebase.js'
import { ref, get, set, remove, update } from 'firebase/database'

// Hàm mới để khởi tạo dữ liệu yêu thích khi ứng dụng khởi động
export const initializeFavorites = async () => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', data: [], error: 'Chưa đăng nhập' }

		const path = `favorites/${user.uid}`
		const snapshot = await get(ref(db, path))

		if (snapshot.exists()) {
			const favorites = snapshot.val()
			const favoriteIds = Object.keys(favorites)
			return { status: 'success', data: favoriteIds, error: null }
		}
		return { status: 'success', data: [], error: null }
	} catch (error) {
		console.error('Error initializing favorites:', error)
		return { status: 'error', data: [], error: error.message }
	}
}

export const toggleFavorite = async (movie) => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', error: 'Bạn cần đăng nhập để sử dụng chức năng này.' }

		const movieRef = ref(db, `favorites/${user.uid}/${movie._id}`)
		const snapshot = await get(movieRef)

		if (snapshot.exists()) {
			// Nếu đã có -> xoá
			await remove(movieRef)
			return { status: 'removed', error: null }
		} else {
			// Nếu chưa có -> thêm
			await set(movieRef, {
				category: movie?.category || '',
				chieurap: movie?.chieurap || false,
				country: movie?.country || '',
				episode_current: movie?.episode_current || '',
				imdb: movie?.imdb || null,
				lang: movie?.lang || '',
				modified: movie?.modified || '',
				name: movie?.name || '',
				origin_name: movie?.origin_name || '',
				quality: movie?.quality || '',
				slug: movie?.slug || '',
				sub_docquyen: movie?.sub_docquyen || false,
				thumb_url: movie?.thumb_url || '',
				poster_url: movie?.poster_url || '',
				time: movie?.time || '',
				tmdb: movie?.tmdb || null,
				type: movie?.type || '',
				year: movie?.year || '',
				_id: movie?._id || '',
				dateAdded: Date.now(), // Thêm thời gian thêm vào yêu thích
			})
			return { status: 'added', error: null }
		}
	} catch (error) {
		console.error('Error toggling favorite:', error)
		return { status: 'error', error: error.message }
	}
}

export const isFavorite = async (movieId) => {
	try {
		const user = auth.currentUser
		if (!user) return false

		const path = `favorites/${user.uid}/${movieId}`
		const snapshot = await get(ref(db, path))

		return snapshot.exists()
	} catch (error) {
		console.error('Error checking favorite status:', error)
		return false
	}
}

export const getFavorites = async () => {
	try {
		const user = auth.currentUser
		if (!user) return {}

		const path = `favorites/${user.uid}`
		const snapshot = await get(ref(db, path))

		return snapshot.exists() ? snapshot.val() : {}
	} catch (error) {
		console.error('Error getting favorites:', error)
		return {}
	}
}

export const removeMultipleFavorites = async (movieIds) => {
	try {
		const user = auth.currentUser
		if (!user) return { success: false, error: 'Bạn cần đăng nhập để sử dụng chức năng này.' }

		if (!Array.isArray(movieIds) || movieIds.length === 0) {
			return { success: false, error: 'Không có phim nào để xóa' }
		}

		// Create an object with null values for each movie ID to remove
		const updates = {}
		movieIds.forEach((id) => {
			updates[`favorites/${user.uid}/${id}`] = null
		})

		// Update with Firebase's multi-path update for better performance
		await update(ref(db), updates)
		return { success: true, error: null }
	} catch (error) {
		console.error('Error removing multiple favorites:', error)
		return { success: false, error: error.message }
	}
}

export const getSortedFavorites = async (sortBy = 'dateAdded', ascending = false) => {
	try {
		const favorites = await getFavorites()

		// Convert to array for sorting
		const favoritesArray = Object.values(favorites)

		// Sort based on criteria
		favoritesArray.sort((a, b) => {
			if (!a[sortBy]) return ascending ? -1 : 1
			if (!b[sortBy]) return ascending ? 1 : -1

			if (typeof a[sortBy] === 'string') {
				return ascending ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy])
			}

			return ascending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
		})

		return favoritesArray
	} catch (error) {
		console.error('Error getting sorted favorites:', error)
		return []
	}
}
