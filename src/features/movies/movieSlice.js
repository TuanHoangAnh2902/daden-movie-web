import { createSlice } from '@reduxjs/toolkit'

export const movieSlice = createSlice({
	name: 'movie',
	initialState: {
		hoveredCard: null,
	},
	reducers: {
		setHoveredCard: (state, action) => {
			state.hoveredCard = action.payload
		},
	},
})

export const { setHoveredCard } = movieSlice.actions

export default movieSlice.reducer
