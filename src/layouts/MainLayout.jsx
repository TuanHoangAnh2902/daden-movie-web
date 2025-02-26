import { Outlet, Link } from 'react-router-dom'

function MainLayout() {
	return (
		<div className='p-4'>
			<nav className='flex gap-4 mb-4'>
				<Link to='/'>Home</Link>
				<Link to='/about'>About</Link>
			</nav>
			<main>
				<Outlet /> {/* Hiển thị các trang con */}
			</main>
		</div>
	)
}

export default MainLayout
