import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult,
	FacebookAuthProvider,
	onAuthStateChanged,
	fetchSignInMethodsForEmail,
	linkWithCredential,
} from 'firebase/auth'
import { auth } from '../config/firebase'

// Create a Google provider instance with custom parameters
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
	prompt: 'select_account',
	// Adding these parameters can help with popup issues
	login_hint: 'user@example.com',
})

// Create a Facebook provider instance with custom parameters
const facebookProvider = new FacebookAuthProvider()
facebookProvider.setCustomParameters({
	// Adding display parameter can help with popup rendering
	display: 'popup',
})

// Register a new user with email and password
export const registerWithEmailAndPassword = async (email, password) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password)
		return { user: userCredential.user, error: null }
	} catch (error) {
		return { user: null, error: error.message }
	}
}

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		return { user: userCredential.user, error: null }
	} catch (error) {
		return { user: null, error: error.message }
	}
}

// Sign in with Google
export const signInWithGoogle = async () => {
	try {
		// Try popup method first
		try {
			const result = await signInWithPopup(auth, googleProvider)
			return { user: result.user, error: null }
		} catch (popupError) {
			// If popup is blocked or COOP error occurs, try redirect method
			if (
				popupError.code === 'auth/popup-blocked' ||
				popupError.message.includes('Cross-Origin-Opener-Policy') ||
				popupError.message.includes('window.closed')
			) {
				console.log('Popup was blocked or COOP error occurred. Trying redirect method...')
				// Fallback to redirect method
				await signInWithRedirect(auth, googleProvider)
				// Note: The result will be handled in the AuthInitializer component
				return { user: null, error: null, isRedirecting: true }
			}
			throw popupError // Re-throw if it's another type of error
		}
	} catch (error) {
		console.error('Google sign-in error:', error)
		return { user: null, error: error.message }
	}
}

// Sign in with Facebook
export const signInWithFacebook = async () => {
	try {
		// Try popup method first
		try {
			const result = await signInWithPopup(auth, facebookProvider)
			return { user: result.user, error: null }
		} catch (popupError) {
			// If popup is blocked or COOP error occurs, try redirect method
			if (
				popupError.code === 'auth/popup-blocked' ||
				popupError.message.includes('Cross-Origin-Opener-Policy') ||
				popupError.message.includes('window.closed')
			) {
				console.log('Popup was blocked or COOP error occurred. Trying redirect method...')
				// Fallback to redirect method
				await signInWithRedirect(auth, facebookProvider)
				// Note: The result will be handled in the AuthInitializer component
				return { user: null, error: null, isRedirecting: true }
			}

			// Handle account-exists-with-different-credential error
			if (popupError.code === 'auth/account-exists-with-different-credential') {
				// Get the email from the error
				const email = popupError.customData.email

				// Fetch sign-in methods for the email
				const methods = await fetchSignInMethodsForEmail(auth, email)

				if (methods.length > 0) {
					// Return information about existing providers
					return {
						user: null,
						error: `Tài khoản với email ${email} đã tồn tại. Vui lòng đăng nhập bằng ${
							methods.includes('google.com') ? 'Google' : methods.includes('password') ? 'Email/Password' : methods[0]
						}`,
						existingAccount: {
							email,
							methods,
						},
					}
				}
			}

			throw popupError // Re-throw if it's another type of error
		}
	} catch (error) {
		console.error('Facebook sign-in error:', error)
		return { user: null, error: error.message }
	}
}

// Link accounts with different providers
export const linkAccounts = async (credential) => {
	try {
		const currentUser = auth.currentUser
		if (currentUser) {
			await linkWithCredential(currentUser, credential)
			return { success: true, error: null }
		}
		return { success: false, error: 'No user is currently signed in' }
	} catch (error) {
		console.error('Error linking accounts:', error)
		return { success: false, error: error.message }
	}
}

// Check for redirect result (to be used in auth initialization)
export const getAuthRedirectResult = async () => {
	try {
		const result = await getRedirectResult(auth)
		if (result) {
			return { user: result.user, error: null }
		}
		return { user: null, error: null }
	} catch (error) {
		console.error('Redirect result error:', error)
		return { user: null, error: error.message }
	}
}

// Sign out current user
export const logOut = async () => {
	try {
		await signOut(auth)
		return { error: null }
	} catch (error) {
		return { error: error.message }
	}
}

// Get current logged in user
export const getCurrentUser = () => {
	return auth.currentUser
}

// Observer for auth state changes
export const subscribeToAuthChanges = (callback) => {
	return onAuthStateChanged(auth, callback)
}

/**
 * Serializes a Firebase user object to keep only serializable properties
 * @param {Object} user - Firebase user object
 * @returns {Object} Serialized user object with only serializable properties
 */
export const serializeUser = (user) => {
	if (!user) return null

	return {
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		photoURL: user.photoURL,
		emailVerified: user.emailVerified,
		phoneNumber: user.phoneNumber,
		isAnonymous: user.isAnonymous,
		metadata: {
			creationTime: user.metadata?.creationTime,
			lastSignInTime: user.metadata?.lastSignInTime,
		},
		providerData: user.providerData ? [...user.providerData] : [],
	}
}
