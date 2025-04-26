import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import MovieCategoryList from '~/components/movie/MovieCategoryList/MovieCategoryList'
import MoviesCountiesList from '~/components/movie/MoviesCountiesList/MoviesCountiesList'
import MoviesList from '~/components/movie/MoviesList/MoviesList'
import MoviesSearchList from '~/components/movie/MoviesSearchList/MoviesSearchList'
import { moviesCategories } from '~/constants/routes'
import AuthLayouts from '~/layouts/AuthLayouts'
import MainLayout from '~/layouts/MainLayout'
import About from '~/pages/About'
import Home from '~/pages/Home/Home'
import MovieDetail from '~/pages/MovieDetail/MovieDetail'
import NotFound from '~/pages/NotFount'
import AccountInfo from '~/pages/Profile/AccountInfo/AccountInfo'
import Favourite from '~/pages/Profile/Favourite/Favourite'
import MoviesListAdded from '~/pages/Profile/MoviesListAdded/MoviesListAdded'
import Profile from '~/pages/Profile/Profile'
import WatchMovie from '~/pages/WatchMovie/WatchMovie'

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
				path: 'movies/category',
				element: <MovieCategoryList />,
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
					{ path: 'lists', element: <MoviesListAdded /> },
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
