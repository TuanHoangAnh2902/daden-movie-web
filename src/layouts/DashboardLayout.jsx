import { Outlet, Link } from 'react-router-dom'

export default function DashboardLayout() {
	return (
		<div className='flex'>
			<aside className='w-64 h-screen bg-gray-200 p-4'>
				<h3 className='text-xl font-bold mb-4'>📊 Dashboard</h3>
				<nav className='flex flex-col gap-2'>
					<Link to='/dashboard'>Overview</Link>
					<Link to='/dashboard/settings'>Settings</Link>
					<Link to='/'>Logout</Link>
				</nav>
			</aside>

			<main className='flex-1 p-6'>
				<Outlet />
			</main>
		</div>
	)
}
