import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	lists: {},
}

export const movieListsSlice = createSlice({
	name: 'movieLists',
	initialState,
	reducers: {
		setMovieLists: (state, action) => {
			state.lists = action.payload
		},
		addList: (state, action) => {
			const newList = action.payload
			state.lists = {
				...state.lists,
				[newList.id]: newList,
			}
		},
		updateList: (state, action) => {
			const { listId, updates } = action.payload
			if (state.lists[listId]) {
				state.lists[listId] = {
					...state.lists[listId],
					...updates,
				}
			}
		},
		removeList: (state, action) => {
			const listId = action.payload
			const newLists = { ...state.lists }
			delete newLists[listId]
			state.lists = newLists
		},
		addMovieToListAction: (state, action) => {
			const { listId, movie } = action.payload
			if (state.lists[listId]) {
				if (!state.lists[listId].movies) {
					state.lists[listId].movies = {}
				}
				state.lists[listId].movies[movie._id] = movie
				state.lists[listId].updatedAt = Date.now()
			}
		},
		removeMovieFromListAction: (state, action) => {
			const { listId, movieId } = action.payload
			if (state.lists[listId] && state.lists[listId].movies && state.lists[listId].movies[movieId]) {
				const newMovies = { ...state.lists[listId].movies }
				delete newMovies[movieId]
				state.lists[listId].movies = newMovies
				state.lists[listId].updatedAt = Date.now()
			}
		},
		resetMovieLists: (state) => {
			state.lists = {}
		},
	},
})

export const {
	setMovieLists,
	addList,
	updateList,
	removeList,
	addMovieToListAction,
	removeMovieFromListAction,
	resetMovieLists,
} = movieListsSlice.actions

export default movieListsSlice.reducer
