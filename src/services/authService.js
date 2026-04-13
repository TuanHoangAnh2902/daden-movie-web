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
	sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, firestore } from '../config/firebase'

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

// Lưu thông tin người dùng vào Firestore
export const saveUserToFirestore = async (user) => {
	if (!user) return

	try {
		await setDoc(doc(firestore, 'users', user.uid), {
			email: user.email,
			createdAt: new Date().toISOString(),
		})
	} catch (error) {
		console.error('Lỗi khi lưu thông tin người dùng vào Firestore:', error)
		throw error
	}
}

// Register a new user with email and password
export const registerWithEmailAndPassword = async (email, password) => {
	try {
		// Thay vì kiểm tra email trong Firestore (gây lỗi quyền truy cập),
		// sử dụng fetchSignInMethodsForEmail của Firebase Authentication
		try {
			const methods = await fetchSignInMethodsForEmail(auth, email.trim().toLowerCase())
			if (methods && methods.length > 0) {
				return { user: null, error: 'Email đã được sử dụng bởi một tài khoản khác.' }
			}
		} catch {
			// Nếu có lỗi khi kiểm tra, vẫn tiếp tục quá trình đăng ký
			// Firebase sẽ tự động từ chối nếu email đã tồn tại
		}

		// Tiến hành đăng ký
		const userCredential = await createUserWithEmailAndPassword(auth, email, password)
		const user = userCredential.user

		// Lưu thông tin người dùng vào Firestore
		try {
			await saveUserToFirestore(user)
		} catch (firestoreError) {
			console.error('Không thể lưu thông tin người dùng vào Firestore:', firestoreError)
			// Không throw lỗi ở đây - để quá trình đăng ký vẫn thành công
		}

		return { user: userCredential.user, error: null }
	} catch (error) {
		// Xử lý lỗi Firebase Authentication
		if (error.code === 'auth/email-already-in-use') {
			return { user: null, error: 'Email này đã được sử dụng bởi một tài khoản khác.' }
		}
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

// Send password reset email with a generic response to avoid account enumeration
export const resetPassword = async (email) => {
	const normalizedEmail = email.trim().toLowerCase()
	const genericSuccessMessage =
		'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.'

	try {
		await sendPasswordResetEmail(auth, normalizedEmail)
		return {
			success: true,
			message: genericSuccessMessage,
		}
	} catch (error) {
		// Tránh lộ thông tin tồn tại tài khoản.
		if (error?.code === 'auth/user-not-found') {
			return {
				success: true,
				message: genericSuccessMessage,
			}
		}

		console.error('Lỗi khi xử lý yêu cầu đặt lại mật khẩu:', error)
		return {
			success: false,
			error: 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.',
		}
	}
}
