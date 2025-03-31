import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

import About from '~/pages/About'
import Home from '~/pages/Home/Home'
import NotFound from '~/pages/NotFount'
import MainLayout from '~/layouts/MainLayout'
import AuthLayouts from '~/layouts/AuthLayouts'
import MoviesList from '~/components/movie/MoviesList/MoviesList'

import { moviesCategories } from '~/constants/routes'
import MoviesSearchList from '~/components/movie/MoviesSearchList/MoviesSearchList'
import MoviesCountiesList from '~/components/movie/MoviesCountiesList/MoviesCountiesList'
import MovieDetail from '~/pages/MovieDetail/MovieDetail'
const navRoutes = moviesCategories.flatMap(({ name, children, to }) =>
	children
		? children.map(({ to: childName }) => ({
				path: `movies/${to}`,
				element: <MoviesList title={childName.to} />,
		  }))
		: [{ path: `movies`, element: <MoviesList title={name} /> }],
)

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'about', element: <About /> },
			{
				path: 'search',
				element: <MoviesSearchList />,
			},
			{
				path: 'movies/country',
				element: <MoviesCountiesList />,
			},
			{
				path: 'movie/detail',
				element: <MovieDetail />,
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
