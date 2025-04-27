import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { movieApi } from '~/services/ophimApi'
import authReducer from '~/features/auth/authSlice'
import favoritesReducer from '~/features/favorites/favoritesSlice'
import movieListsReducer from '~/features/movieLists/movieListsSlice'

export const store = configureStore({
	reducer: {
		[movieApi.reducerPath]: movieApi.reducer,
		auth: authReducer,
		favorites: favoritesReducer,
		movieLists: movieListsReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(movieApi.middleware),
})

setupListeners(store.dispatch)
