import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

import About from '~/pages/About'
import Home from '~/pages/Home/Home'
import NotFound from '~/pages/NotFount'
import MainLayout from '~/layouts/MainLayout'
import AuthLayouts from '~/layouts/AuthLayouts'
import MoviesList from '~/components/movie/MoviesList/MoviesList'
import Profile from '~/pages/Profile/Profile'

import { moviesCategories } from '~/constants/routes'
import MoviesSearchList from '~/components/movie/MoviesSearchList/MoviesSearchList'
import MoviesCountiesList from '~/components/movie/MoviesCountiesList/MoviesCountiesList'
import MovieDetail from '~/pages/MovieDetail/MovieDetail'
import WatchMovie from '~/pages/WatchMovie/WatchMovie'
import Favourite from '~/pages/Profile/Favourite/Favourite'
import AccountInfo from '~/pages/Profile/AccountInfo/AccountInfo'

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
			{
				path: 'movie/watch',
				element: <WatchMovie />,
			},
			{
				path: 'user',
				element: <Profile />,
				children: [
					{ path: 'favourite', element: <Favourite /> },
					{ path: 'profile', element: <AccountInfo /> },
				],
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
