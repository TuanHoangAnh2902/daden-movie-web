import { db, auth } from '~/config/firebase.js'
import { ref, get, set, remove, update } from 'firebase/database'

// Initialize movie lists when the application starts
export const initializeMovieLists = async () => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', data: [], error: 'Chưa đăng nhập' }

		const path = `movieLists/${user.uid}`
		const snapshot = await get(ref(db, path))

		if (snapshot.exists()) {
			const lists = snapshot.val()
			return { status: 'success', data: lists, error: null }
		}
		return { status: 'success', data: {}, error: null }
	} catch (error) {
		console.error('Error initializing movie lists:', error)
		return { status: 'error', data: {}, error: error.message }
	}
}

// Create a new movie list
export const createMovieList = async (listName, description = '') => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', error: 'Chưa đăng nhập' }

		const listId = Date.now().toString()
		const path = `movieLists/${user.uid}/lists/${listId}`

		await set(ref(db, path), {
			id: listId,
			name: listName,
			description: description,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			movies: {},
		})

		return {
			status: 'success',
			data: {
				id: listId,
				name: listName,
				description: description,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				movies: {},
			},
			error: null,
		}
	} catch (error) {
		console.error('Error creating movie list:', error)
		return { status: 'error', error: error.message }
	}
}

// Get all movie lists for current user
export const getMovieLists = async () => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', data: {}, error: 'Chưa đăng nhập' }

		const path = `movieLists/${user.uid}/lists`
		const snapshot = await get(ref(db, path))
		console.log('🚀 ~ getMovieLists ~ snapshot:', snapshot)

		if (snapshot.exists()) {
			return { status: 'success', data: snapshot.val(), error: null }
		}
		return { status: 'success', data: {}, error: null }
	} catch (error) {
		console.error('Error getting movie lists:', error)
		return { status: 'error', data: {}, error: error.message }
	}
}

// Get a specific movie list by ID
export const getMovieListById = async (listId) => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', data: null, error: 'Chưa đăng nhập' }

		const path = `movieLists/${user.uid}/lists/${listId}`
		const snapshot = await get(ref(db, path))

		if (snapshot.exists()) {
			return { status: 'success', data: snapshot.val(), error: null }
		}
		return { status: 'error', data: null, error: 'Danh sách không tồn tại' }
	} catch (error) {
		console.error('Error getting movie list:', error)
		return { status: 'error', data: null, error: error.message }
	}
}

// Add a movie to a list
export const addMovieToList = async (listId, movie) => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', error: 'Chưa đăng nhập' }

		// First check if list exists
		const listPath = `movieLists/${user.uid}/lists/${listId}`
		const listSnapshot = await get(ref(db, listPath))

		if (!listSnapshot.exists()) {
			return { status: 'error', error: 'Danh sách không tồn tại' }
		}

		// Add movie to the list
		const moviePath = `movieLists/${user.uid}/lists/${listId}/movies/${movie._id}`

		// Add movie data
		await set(ref(db, moviePath), {
			_id: movie._id,
			name: movie?.name || '',
			origin_name: movie?.origin_name || '',
			slug: movie?.slug || '',
			content: movie?.content || '',
			category: movie?.category || [],
			status: movie?.status || '',
			sub_docquyen: movie?.sub_docquyen || false,
			thumb_url: movie?.thumb_url || '',
			poster_url: movie?.poster_url || '',
			time: movie?.time || '',
			tmdb: movie?.tmdb || null,
			type: movie?.type || '',
			year: movie?.year || '',
			dateAdded: Date.now(),
		})

		// Update the updatedAt field of the list
		await update(ref(db, listPath), {
			updatedAt: Date.now(),
		})

		return { status: 'success', error: null }
	} catch (error) {
		console.error('Error adding movie to list:', error)
		return { status: 'error', error: error.message }
	}
}

// Remove a movie from a list
export const removeMovieFromList = async (listId, movieId) => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', error: 'Chưa đăng nhập' }

		const moviePath = `movieLists/${user.uid}/lists/${listId}/movies/${movieId}`
		const listPath = `movieLists/${user.uid}/lists/${listId}`

		// Remove movie from the list
		await remove(ref(db, moviePath))

		// Update the updatedAt field of the list
		await update(ref(db, listPath), {
			updatedAt: Date.now(),
		})

		return { status: 'success', error: null }
	} catch (error) {
		console.error('Error removing movie from list:', error)
		return { status: 'error', error: error.message }
	}
}

// Delete a movie list
export const deleteMovieList = async (listId) => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', error: 'Chưa đăng nhập' }

		const path = `movieLists/${user.uid}/lists/${listId}`
		await remove(ref(db, path))

		return { status: 'success', error: null }
	} catch (error) {
		console.error('Error deleting movie list:', error)
		return { status: 'error', error: error.message }
	}
}

// Rename a movie list
export const renameMovieList = async (listId, newName, newDescription = null) => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', error: 'Chưa đăng nhập' }

		const path = `movieLists/${user.uid}/lists/${listId}`

		// Only update fields that are provided
		const updates = {
			name: newName,
			updatedAt: Date.now(),
		}

		if (newDescription !== null) {
			updates.description = newDescription
		}

		await update(ref(db, path), updates)

		return { status: 'success', error: null }
	} catch (error) {
		console.error('Error renaming movie list:', error)
		return { status: 'error', error: error.message }
	}
}

// Check if a movie is in a specific list
export const isMovieInList = async (listId, movieId) => {
	try {
		const user = auth.currentUser
		if (!user) return false

		const path = `movieLists/${user.uid}/lists/${listId}/movies/${movieId}`
		const snapshot = await get(ref(db, path))

		return snapshot.exists()
	} catch (error) {
		console.error('Error checking if movie is in list:', error)
		return false
	}
}

// Get all movies from a specific list
export const getMoviesFromList = async (listId) => {
	try {
		const user = auth.currentUser
		if (!user) return { status: 'error', data: [], error: 'Chưa đăng nhập' }

		const path = `movieLists/${user.uid}/lists/${listId}/movies`
		const snapshot = await get(ref(db, path))

		if (snapshot.exists()) {
			const movies = Object.values(snapshot.val())
			return { status: 'success', data: movies, error: null }
		}
		return { status: 'success', data: [], error: null }
	} catch (error) {
		console.error('Error getting movies from list:', error)
		return { status: 'error', data: [], error: error.message }
	}
}
