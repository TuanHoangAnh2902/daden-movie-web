import { configureStore } from '@reduxjs/toolkit'
import { movieApi } from '~/services/ophimApi' // Import API đúng

export const store = configureStore({
	reducer: {
		[movieApi.reducerPath]: movieApi.reducer, // Đưa reducer của API vào store
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(movieApi.middleware), // Thêm middleware cho RTK Query
})
