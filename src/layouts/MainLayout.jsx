import { Outlet } from 'react-router-dom'
import MovieTopNav from '~/components/layouts/MovieTopNav/MovieTopNav'

function MainLayout() {
	return (
		<>
			<nav>
				<MovieTopNav />
			</nav>
			<main>
				<Outlet /> {/* Hiển thị các trang con */}
			</main>
		</>
	)
}

export default MainLayout
