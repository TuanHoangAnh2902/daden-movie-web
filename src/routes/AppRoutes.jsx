import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

import Home from '~/pages/Home'
import About from '~/pages/About'
import NotFount from '~/pages/NotFount'
import MoviePage from '~/pages/MoviePage'
import MainLayout from '~/layouts/MainLayout'
import AuthLayouts from '~/layouts/AuthLayouts'
import { moviesCategories } from '~/constants/routes'

const navRoutes = moviesCategories.flatMap((category) =>
	category.children
		? category.children.map((child) => ({
				path: child.to, // Giữ nguyên đường dẫn
				element: <MoviePage title={child.name} />,
		  }))
		: {
				path: category.to,
				element: <MoviePage title={category.name} />,
		  },
)

const router = createBrowserRouter([
	{
		path: '*',
		element: <NotFount />,
	},
	{
		path: '/',
		element: <MainLayout />,
		children: [{ index: true, element: <Home /> }, { path: 'about', element: <About /> }, ...navRoutes],
	},
	{
		path: '/auth',
		element: <AuthLayouts />,
	},
])

function AppRoutes() {
	return <RouterProvider router={router} />
}

export default AppRoutes
