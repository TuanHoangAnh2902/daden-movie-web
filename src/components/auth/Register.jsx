import { Col, message, Row } from 'antd'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginFailure, loginStart, loginSuccess } from '~/features/auth/authSlice'
import { registerWithEmailAndPassword, serializeUser } from '~/services/authService'

import styles from './Login.module.scss'

const Register = ({ onClose, switchToLogin }) => {
	const [messageApi, contextHolder] = message.useMessage()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const dispatch = useDispatch()
	const { isLoading } = useSelector((state) => state.auth)

	const handleRegister = async (e) => {
		e.preventDefault()

		if (!email || !password || !confirmPassword) {
			dispatch(loginFailure('Vui lòng điền đầy đủ thông tin'))
			messageApi.open({
				type: 'info',
				content: 'Vui lòng điền đầy đủ thông tin',
			})
			return
		}

		if (password !== confirmPassword) {
			dispatch(loginFailure('Mật khẩu không khớp'))
			messageApi.open({
				type: 'info',
				content: 'Mật khẩu không khớp',
			})
			return
		}

		if (password.length < 6) {
			dispatch(loginFailure('Mật khẩu phải có ít nhất 6 ký tự'))
			messageApi.open({
				type: 'info',
				content: 'Mật khẩu phải có ít nhất 6 ký tự',
			})
			return
		}

		dispatch(loginStart())

		const result = await registerWithEmailAndPassword(email, password)

		if (result.error) {
			dispatch(loginFailure(result.error))
			messageApi.open({
				type: 'error',
				content: result.error,
			})
		} else {
			dispatch(loginSuccess(serializeUser(result.user)))
			messageApi.open({
				type: 'success',
				content: 'Đăng ký thành công!',
			})
			if (onClose) onClose()
		}
	}

	const cx = classNames.bind(styles)
	return (
		<>
			{contextHolder}
			<div className={cx('login-container')}>
				<h2>Đăng ký</h2>
				<form onSubmit={handleRegister}>
					<div className={cx('input-group')}>
						<input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Emai' required />
					</div>

					<Row gutter={12}>
						<Col span={12}>
							<div className={cx('input-group')}>
								<input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder='Mật khẩu'
									required
								/>
							</div>
						</Col>
						<Col span={12}>
							<div className={cx('input-group')}>
								<input
									type='password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder='Xác nhận mật khẩu'
									required
								/>
							</div>
						</Col>
					</Row>

					<button type='submit' className={cx('login-button')} disabled={isLoading}>
						{isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
					</button>
				</form>

				<div className={cx('swicth-auth')}>
					<span>Đã có tài khoản?</span>
					<button onClick={switchToLogin} className={cx('switch-button')} disabled={isLoading}>
						Đăng nhập
					</button>
				</div>
			</div>
		</>
	)
}
Register.propTypes = {
	onClose: PropTypes.func,
	switchToLogin: PropTypes.func.isRequired,
}

export default Register
