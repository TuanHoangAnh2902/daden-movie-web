import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	user: null,
	isLoading: false,
	error: null,
	isAuthenticated: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Start login process
		loginStart: (state) => {
			state.isLoading = true
			state.error = null
		},
		// Login successful
		loginSuccess: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = true
			state.user = action.payload
			state.error = null
		},
		// Login failed
		loginFailure: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = false
			state.error = action.payload
		},
		// Logout
		logout: (state) => {
			state.isAuthenticated = false
			state.user = null
			state.error = null
		},
		// Clear errors
		clearErrors: (state) => {
			state.error = null
		},
	},
})

export const { loginStart, loginSuccess, loginFailure, logout, clearErrors } = authSlice.actions

export default authSlice.reducer
