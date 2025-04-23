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
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
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
		console.log('Đã lưu thông tin người dùng vào Firestore')
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
		} catch (error) {
			// Nếu có lỗi khi kiểm tra, vẫn tiếp tục quá trình đăng ký
			// Firebase sẽ tự động từ chối nếu email đã tồn tại
			console.log('Lỗi khi kiểm tra phương thức đăng nhập:', error)
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

// Send password reset email using Firebase Authentication and checking Firestore
export const resetPassword = async (email) => {
	// Chuẩn hóa email
	const normalizedEmail = email.trim().toLowerCase()

	try {
		console.log('Đang xử lý yêu cầu đặt lại mật khẩu cho email:', normalizedEmail)

		// Kiểm tra email trong Firestore trước
		console.log('Kiểm tra email trong Firestore...')
		let existsInFirestore = false

		try {
			// Tạo truy vấn tìm kiếm email trong collection users
			const q = query(collection(firestore, 'users'), where('email', '==', normalizedEmail))

			// Thực hiện truy vấn
			const querySnapshot = await getDocs(q)
			existsInFirestore = !querySnapshot.empty

			console.log(`Email ${normalizedEmail} ${existsInFirestore ? 'tồn tại' : 'không tồn tại'} trong Firestore`)
		} catch (firestoreError) {
			console.warn('Lỗi khi kiểm tra Firestore:', firestoreError)
			// Tiếp tục với Firebase Authentication nếu có lỗi khi truy cập Firestore
		}

		// Kiểm tra email trong Firebase Authentication
		console.log('Kiểm tra email trong Firebase Authentication...')
		try {
			const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail)
			const existsInAuth = methods && methods.length > 0

			// Nếu email tồn tại trong Firestore hoặc Authentication, gửi email đặt lại mật khẩu
			if (existsInFirestore || existsInAuth) {
				console.log(`Email ${normalizedEmail} tồn tại trong hệ thống.`)
				if (existsInAuth) {
					console.log('Phương thức đăng nhập:', methods)
				}

				// Gửi email đặt lại mật khẩu
				await sendPasswordResetEmail(auth, normalizedEmail)
				console.log(`Email đặt lại mật khẩu đã được gửi đến ${normalizedEmail}`)

				return {
					success: true,
					message: 'Email đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn.',
					existsInFirestore, // Chỉ trả về trạng thái tồn tại, không trả về dữ liệu cụ thể
					existsInAuth,
				}
			} else {
				console.log(`Email ${normalizedEmail} không tồn tại trong hệ thống.`)
				return {
					success: false,
					error: 'Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc đăng ký mới.',
				}
			}
		} catch (error) {
			console.error('Lỗi khi kiểm tra Authentication:', error)
			return {
				success: false,
				error: `Đã xảy ra lỗi khi kiểm tra email. Vui lòng thử lại sau. (${error.message})`,
			}
		}
	} catch (error) {
		console.error('Lỗi khi xử lý yêu cầu đặt lại mật khẩu:', error)
		return {
			success: false,
			error: `Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau. (${error.message})`,
		}
	}
}
