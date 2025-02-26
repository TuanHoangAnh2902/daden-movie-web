import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
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
