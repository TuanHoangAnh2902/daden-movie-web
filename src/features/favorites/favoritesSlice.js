import { createSlice } from '@reduxjs/toolkit'

export const favoritesSlice = createSlice({
	name: 'favorites',
	initialState: {
		favoriteIds: [], // Danh sách ID phim yêu thích
		initialized: false, // Flag để kiểm tra xem đã khởi tạo chưa
	},
	reducers: {
		setFavorites: (state, action) => {
			state.favoriteIds = action.payload
			state.initialized = true
		},
		addFavorite: (state, action) => {
			if (!state.favoriteIds.includes(action.payload)) {
				state.favoriteIds.push(action.payload)
			}
		},
		removeFavorite: (state, action) => {
			state.favoriteIds = state.favoriteIds.filter((id) => id !== action.payload)
		},
		clearFavorites: (state) => {
			state.favoriteIds = []
			state.initialized = false
		},
	},
})

export const { setFavorites, addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions

export default favoritesSlice.reducer
