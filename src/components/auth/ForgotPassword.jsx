import { useState } from 'react'
import { Alert, message, Spin } from 'antd'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { resetPassword } from '~/services/authService'
import styles from './Login.module.scss'

const cx = classNames.bind(styles)

const ForgotPassword = ({ switchToLogin }) => {
	const [messageApi, contextHolder] = message.useMessage()
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [resetSent, setResetSent] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const handleResetPassword = async (e) => {
		e.preventDefault()

		// Reset error state
		setErrorMessage('')
		setStatusMessage('')

		if (!email) {
			messageApi.open({
				type: 'info',
				content: 'Vui lòng nhập email của bạn',
			})
			return
		}

		setIsLoading(true)

		try {
			console.log('Đang gửi yêu cầu đặt lại mật khẩu cho email:', email.trim().toLowerCase())
			const result = await resetPassword(email)

			if (result.success) {
				setResetSent(true)
				setStatusMessage(result.message || 'Email đặt lại mật khẩu đã được gửi.')

				messageApi.open({
					type: 'success',
					content: result.message || 'Email đặt lại mật khẩu đã được gửi.',
				})
			} else {
				setErrorMessage(result.error || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.')
				messageApi.open({
					type: 'error',
					content: result.error || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.',
				})
			}
		} catch (error) {
			console.error('Lỗi xử lý đặt lại mật khẩu:', error)
			const errorMsg = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
			setErrorMessage(errorMsg)
			messageApi.open({
				type: 'error',
				content: errorMsg,
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			{contextHolder}
			<div className={cx('login-container')}>
				<h2>Quên mật khẩu</h2>

				{resetSent ? (
					<div className={cx('reset-success')}>
						<Alert
							type='success'
							message='Yêu cầu đặt lại mật khẩu đã được xử lý'
							description={
								<>
									<p>{statusMessage}</p>
									<p>Nếu bạn không thấy email trong hộp thư đến, vui lòng kiểm tra thư mục spam hoặc thư rác.</p>
								</>
							}
							showIcon
							style={{ marginBottom: '20px' }}
						/>

						<button onClick={switchToLogin} className={cx('login-button')}>
							Quay lại đăng nhập
						</button>
					</div>
				) : (
					<>
						<p className={cx('reset-instructions')}>
							Nhập email đã đăng ký của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
						</p>

						{errorMessage && (
							<Alert
								type='error'
								message='Không thể gửi email đặt lại mật khẩu'
								description={errorMessage}
								showIcon
								style={{ marginBottom: '20px' }}
							/>
						)}

						<form onSubmit={handleResetPassword}>
							<div className={cx('input-group')}>
								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='Email'
									required
								/>
							</div>

							<button type='submit' className={cx('login-button')} disabled={isLoading}>
								{isLoading ? (
									<>
										<Spin size='small' /> Đang kiểm tra...
									</>
								) : (
									'Gửi liên kết đặt lại'
								)}
							</button>
						</form>

						<div className={cx('swicth-auth')}>
							<span>Đã nhớ mật khẩu?</span>
							<button onClick={switchToLogin} className={cx('switch-button')} disabled={isLoading}>
								Đăng nhập
							</button>
						</div>
					</>
				)}
			</div>
		</>
	)
}

ForgotPassword.propTypes = {
	switchToLogin: PropTypes.func.isRequired,
}

export default ForgotPassword
