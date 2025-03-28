import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

import Home from '~/pages/Home/Home'
import About from '~/pages/About'
import NotFound from '~/pages/NotFount'
import MainLayout from '~/layouts/MainLayout'
import AuthLayouts from '~/layouts/AuthLayouts'
import MoviesList from '~/components/movie/MoviesList/MoviesList'

import { moviesCategories } from '~/constants/routes'
import MoviesSearchList from '~/components/movie/MoviesSearchList/MoviesSearchList'
import MoviesCountiesList from '~/components/movie/MoviesCountiesList/MoviesCountiesList'

const navRoutes = moviesCategories.flatMap(({ to, name, children }) =>
	children
		? children?.map(({ to: childTo, name: childName }) => ({
				path: `movies/${childTo}`,
				element: <MoviesList title={childName} />,
		  }))
		: [{ path: `movies/${to}`, element: <MoviesList title={name} /> }],
)

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'about', element: <About /> },
			{
				path: 'search/:nameMovie',
				element: <MoviesSearchList />,
			},
			{
				path: 'movies/countries/:param',
				element: <MoviesCountiesList />,
			},
			...navRoutes,
		],
	},
	{
		path: '/auth',
		element: <AuthLayouts />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
])

function AppRoutes() {
	return <RouterProvider router={router} />
}

export default AppRoutes
