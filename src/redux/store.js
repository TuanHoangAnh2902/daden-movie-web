import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { movieApi } from '~/services/ophimApi' // Import API đúng
import movieReducer from '~/features/movies/movieSlice' // Import reducer đúng
import authReducer from '~/features/auth/authSlice' // Import auth reducer
import favoritesReducer from '~/features/favorites/favoritesSlice' // Import favorites reducer
import movieListsReducer from '~/features/movieLists/movieListsSlice' // Import movie lists reducer

export const store = configureStore({
	reducer: {
		[movieApi.reducerPath]: movieApi.reducer, // Đưa reducer của API vào store
		movie: movieReducer, // Đưa reducer của slice vào store
		auth: authReducer, // Đưa auth reducer vào store
		favorites: favoritesReducer, // Đưa favorites reducer vào store
		movieLists: movieListsReducer, // Đưa movie lists reducer vào store
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(movieApi.middleware), // Thêm middleware cho RTK Query
})

setupListeners(store.dispatch)
