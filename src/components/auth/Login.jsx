import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import classNames from 'classnames/bind'
import { loginFailure, loginStart, loginSuccess } from '~/features/auth/authSlice'
import { signInWithEmail, signInWithFacebook, signInWithGoogle, serializeUser } from '~/services/authService'

import styles from './Login.module.scss'
import { Col, message, Row } from 'antd'

const cx = classNames.bind(styles)
const Login = ({ onClose, switchToRegister, switchToForgotPassword }) => {
	const [messageApi, contextHolder] = message.useMessage()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [redirecting, setRedirecting] = useState(false)
	const [existingAccountInfo, setExistingAccountInfo] = useState(null)
	const dispatch = useDispatch()
	const { isLoading, error } = useSelector((state) => state.auth)

	const handleEmailLogin = async (e) => {
		e.preventDefault()

		if (!email || !password) {
			dispatch(loginFailure('Email và mật khẩu không được để trống'))
			messageApi.open({
				type: 'info',
				content: 'Email và mật khẩu không được để trống',
			})
			return
		}

		dispatch(loginStart())

		const result = await signInWithEmail(email, password)

		if (result.error) {
			dispatch(loginFailure(result.error))
			messageApi.open({
				type: 'error',
				content: result.error.includes('auth/invalid-credential') ? 'Địa chỉ email hoặc mật khẩu không đúng' : '',
			})
		} else {
			dispatch(loginSuccess(serializeUser(result.user)))
			if (onClose) onClose()
			messageApi.open({
				type: 'success',
				content: 'Đăng nhập thành công!',
			})
		}
	}

	const handleGoogleLogin = async () => {
		dispatch(loginStart())
		const result = await signInWithGoogle()

		if (result.error) {
			dispatch(loginFailure(result.error))
			messageApi.open({
				type: 'error',
				content: error,
			})
		} else if (result.isRedirecting) {
			// User is being redirected, show appropriate UI state
			setRedirecting(true)
		} else {
			dispatch(loginSuccess(serializeUser(result.user)))
			setExistingAccountInfo(null) // Clear any existing account info
			if (onClose) onClose()
			messageApi.open({
				type: 'success',
				content: 'Đăng nhập thành công!',
			})
		}
	}

	const handleFacebookLogin = async () => {
		dispatch(loginStart())
		const result = await signInWithFacebook()

		if (result.error) {
			dispatch(loginFailure(result.error))
			messageApi.open({
				type: 'error',
				content: error,
			})

			// Check if we have existing account information
			if (result.existingAccount) {
				setExistingAccountInfo(result.existingAccount)
			}
		} else if (result.isRedirecting) {
			// User is being redirected, show appropriate UI state
			setRedirecting(true)
		} else {
			dispatch(loginSuccess(serializeUser(result.user)))
			setExistingAccountInfo(null) // Clear any existing account info
			if (onClose) onClose()
			messageApi.open({
				type: 'success',
				content: 'Đăng nhập thành công!',
			})
		}
	}

	// Helper to suggest appropriate login method based on existingAccountInfo
	const renderAlternativeLoginSuggestion = () => {
		if (!existingAccountInfo) return null

		const { methods } = existingAccountInfo

		if (methods.includes('google.com')) {
			return (
				<div className={cx('alternative-login')}>
					<p>Vui lòng đăng nhập bằng tài khoản Google của bạn:</p>
					<button onClick={handleGoogleLogin} className={cx('social-button', 'google-button')} disabled={isLoading}>
						Đăng nhập với Google
					</button>
				</div>
			)
		} else if (methods.includes('password')) {
			return (
				<div className={cx('alternative-login')}>
					<p>Vui lòng đăng nhập bằng email và mật khẩu:</p>
				</div>
			)
		}

		return null
	}

	return (
		<>
			{contextHolder}
			<div className={cx('login-container')}>
				<h2>Đăng nhập</h2>
				{redirecting && <div className={cx('redirecting')}>Đang chuyển hướng đến trang đăng nhập...</div>}

				{existingAccountInfo ? (
					<>
						{renderAlternativeLoginSuggestion()}
						<form onSubmit={handleEmailLogin}>
							<div className={cx('input-group')}>
								<label>Email</label>
								<input
									type='email'
									value={existingAccountInfo.email || email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='Email'
									required
								/>
							</div>

							<div className={cx('input-group')}>
								<label>Mật khẩu</label>
								<input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder='Mật khẩu'
									required
								/>
							</div>

							<button type='submit' className={cx('login-button')} disabled={isLoading}>
								{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
							</button>

							<div className={cx('forgot-password')}>
								<button
									type='button'
									onClick={switchToForgotPassword}
									className={cx('forgot-button')}
									disabled={isLoading}>
									Quên mật khẩu?
								</button>
							</div>
						</form>
					</>
				) : (
					<>
						<form onSubmit={handleEmailLogin}>
							<div className={cx('input-group')}>
								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='Email'
									required
								/>
							</div>

							<div className={cx('input-group')}>
								<input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder='Mật khẩu'
									required
								/>
							</div>

							<button type='submit' className={cx('login-button')} disabled={isLoading}>
								{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
							</button>

							<div className={cx('forgot-password')}>
								<button
									type='button'
									onClick={switchToForgotPassword}
									className={cx('forgot-button')}
									disabled={isLoading}>
									Quên mật khẩu?
								</button>
							</div>
						</form>

						<div className={cx('separator')}>
							<span>hoặc</span>
						</div>

						<Row gutter={12} className={cx('social-login')}>
							<Col span={12}>
								<button
									onClick={handleGoogleLogin}
									className={cx('social-button', 'google-button')}
									disabled={isLoading}>
									Đăng nhập với Google
								</button>
							</Col>
							<Col span={12}>
								<button
									onClick={handleFacebookLogin}
									className={cx('social-button', 'facebook-button')}
									disabled={isLoading}>
									Đăng nhập với Facebook
								</button>
							</Col>
						</Row>
					</>
				)}

				<div className={cx('swicth-auth')}>
					<span>Chưa có tài khoản?</span>
					<button onClick={switchToRegister} className={cx('switch-button')} disabled={isLoading}>
						Đăng ký
					</button>
				</div>
			</div>
		</>
	)
}
Login.propTypes = {
	onClose: PropTypes.func,
	switchToRegister: PropTypes.func.isRequired,
	switchToForgotPassword: PropTypes.func.isRequired,
}

export default Login
