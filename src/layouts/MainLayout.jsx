import { Outlet } from 'react-router-dom'
import MovieNav from '~/components/layouts/MovieNav'

function MainLayout() {
	return (
		<div className='p-4'>
			<nav className='flex gap-4 mb-4'>
				<MovieNav />
			</nav>
			<main>
				<Outlet /> {/* Hiển thị các trang con */}
			</main>
		</div>
	)
}

export default MainLayout
