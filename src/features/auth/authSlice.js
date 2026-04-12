import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	user: null,
	isAuthenticated: false,
	isAuthLoading: true,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.isAuthenticated = true
			state.user = action.payload
		},
		setAuthLoading: (state, action) => {
			state.isAuthLoading = action.payload
		},
		logout: (state) => {
			state.isAuthenticated = false
			state.user = null
		},
	},
})

export const { loginSuccess, logout, setAuthLoading } = authSlice.actions

export default authSlice.reducer
