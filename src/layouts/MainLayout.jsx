import { Outlet } from 'react-router-dom'
import FooterLayout from '~/components/layouts/FooterLayout/FooterLayout'
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
			<footer>
				<FooterLayout />
			</footer>
		</>
	)
}

export default MainLayout
