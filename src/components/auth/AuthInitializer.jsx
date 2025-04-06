import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess, logout } from '../../features/auth/authSlice'
import { subscribeToAuthChanges, serializeUser, getAuthRedirectResult } from '../../services/authService'

const AuthInitializer = ({ children }) => {
	const dispatch = useDispatch()

	useEffect(() => {
		// Check for redirect authentication result
		const handleRedirectResult = async () => {
			try {
				const { user, error } = await getAuthRedirectResult()
				if (user) {
					// User successfully authenticated via redirect
					dispatch(loginSuccess(serializeUser(user)))
				} else if (error) {
					console.error('Redirect authentication error:', error)
				}
			} catch (err) {
				console.error('Error processing redirect result:', err)
			}
		}

		// Call once to check for redirect results
		handleRedirectResult()

		// Set up auth state listener
		const unsubscribe = subscribeToAuthChanges((user) => {
			if (user) {
				dispatch(loginSuccess(serializeUser(user)))
			} else {
				dispatch(logout())
			}
		})

		// Cleanup subscription
		return () => unsubscribe()
	}, [dispatch])

	return children
}

export default AuthInitializer
