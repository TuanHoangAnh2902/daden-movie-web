import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import { Link, Navigate, Outlet } from 'react-router-dom'

export default function AuthLayout() {
	const { isAuthenticated, isAuthLoading } = useSelector((state) => state.auth)

	if (isAuthLoading) {
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<Spin size='large' />
			</div>
		)
	}

	if (isAuthenticated) {
		return <Navigate to='/' replace />
	}

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h2 className='text-2xl mb-4'>🔒 Authentication</h2>
			<Outlet /> {/* Render Login/Register */}
			<Link to='/' className='mt-4 text-blue-500'>
				⬅️ Back to Home
			</Link>
		</div>
	)
}
