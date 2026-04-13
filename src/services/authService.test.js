import { describe, it, expect, vi, beforeEach } from 'vitest'

const { sendPasswordResetEmailMock, authMock } = vi.hoisted(() => ({
	sendPasswordResetEmailMock: vi.fn(),
	authMock: { app: 'test-auth' },
}))

vi.mock('firebase/auth', () => ({
	createUserWithEmailAndPassword: vi.fn(),
	signInWithEmailAndPassword: vi.fn(),
	signOut: vi.fn(),
	GoogleAuthProvider: class {
		setCustomParameters = vi.fn()
	},
	signInWithPopup: vi.fn(),
	signInWithRedirect: vi.fn(),
	getRedirectResult: vi.fn(),
	FacebookAuthProvider: class {
		setCustomParameters = vi.fn()
	},
	onAuthStateChanged: vi.fn(),
	fetchSignInMethodsForEmail: vi.fn(),
	linkWithCredential: vi.fn(),
	sendPasswordResetEmail: sendPasswordResetEmailMock,
}))

vi.mock('firebase/firestore', () => ({
	doc: vi.fn(),
	setDoc: vi.fn(),
}))

vi.mock('~/config/firebase', () => ({
	auth: authMock,
	firestore: {},
}))

import { auth } from '~/config/firebase'
import { resetPassword } from './authService'

const GENERIC_SUCCESS_MESSAGE =
	'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.'

describe('resetPassword', () => {
	beforeEach(() => {
		sendPasswordResetEmailMock.mockReset()
	})

	it('normalizes email and returns generic success message when Firebase succeeds', async () => {
		sendPasswordResetEmailMock.mockResolvedValueOnce(undefined)

		const result = await resetPassword('  USER@Example.COM  ')

		expect(sendPasswordResetEmailMock).toHaveBeenCalledWith(auth, 'user@example.com')
		expect(result).toEqual({
			success: true,
			message: GENERIC_SUCCESS_MESSAGE,
		})
	})

	it('returns generic success when Firebase reports user-not-found', async () => {
		sendPasswordResetEmailMock.mockRejectedValueOnce({ code: 'auth/user-not-found' })

		const result = await resetPassword('missing@example.com')

		expect(result).toEqual({
			success: true,
			message: GENERIC_SUCCESS_MESSAGE,
		})
	})

	it('returns generic failure message for other Firebase errors', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		sendPasswordResetEmailMock.mockRejectedValueOnce({ code: 'auth/network-request-failed' })

		const result = await resetPassword('user@example.com')

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
		expect(result).toEqual({
			success: false,
			error: 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.',
		})
	})
})
