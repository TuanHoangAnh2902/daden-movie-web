import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { movieApi } from '~/services/ophimApi' // Import API đúng
import movieReducer from '~/features/movies/movieSlice' // Import reducer đúng

export const store = configureStore({
	reducer: {
		[movieApi.reducerPath]: movieApi.reducer, // Đưa reducer của API vào store
		movie: movieReducer, // Đưa reducer của slice vào store
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(movieApi.middleware), // Thêm middleware cho RTK Query
})

setupListeners(store.dispatch)
