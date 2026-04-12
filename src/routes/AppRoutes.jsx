import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Navigate, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'
import { moviesCategories } from '~/constants/routes'
import AuthLayouts from '~/layouts/AuthLayouts'
import MainLayout from '~/layouts/MainLayout'

const About = lazy(() => import('~/pages/About'))
const Home = lazy(() => import('~/pages/Home/Home'))
const MovieDetail = lazy(() => import('~/pages/MovieDetail/MovieDetail'))
const NotFound = lazy(() => import('~/pages/NotFount'))
const AccountInfo = lazy(() => import('~/pages/Profile/AccountInfo/AccountInfo'))
const Favourite = lazy(() => import('~/pages/Profile/Favourite/Favourite'))
const MoviesListAdded = lazy(() => import('~/pages/Profile/MoviesListAdded/MoviesListAdded'))
const Profile = lazy(() => import('~/pages/Profile/Profile'))
const WatchMovie = lazy(() => import('~/pages/WatchMovie/WatchMovie'))
const MovieCategoryList = lazy(() => import('~/components/movie/MovieCategoryList/MovieCategoryList'))
const MoviesCountiesList = lazy(() => import('~/components/movie/MoviesCountiesList/MoviesCountiesList'))
const MoviesList = lazy(() => import('~/components/movie/MoviesList/MoviesList'))
const MoviesSearchList = lazy(() => import('~/components/movie/MoviesSearchList/MoviesSearchList'))
const Login = lazy(() => import('~/components/auth/Login'))
const Register = lazy(() => import('~/components/auth/Register'))
const ForgotPassword = lazy(() => import('~/components/auth/ForgotPassword'))

function RouteFallback() {
	return (
		<div style={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}>
			<Spin size='large' />
		</div>
	)
}

function AuthLoginRoute() {
	const navigate = useNavigate()

	return (
		<Login
			onClose={() => navigate('/', { replace: true })}
			switchToRegister={() => navigate('/auth/register', { replace: true })}
			switchToForgotPassword={() => navigate('/auth/forgot-password', { replace: true })}
		/>
	)
}

function AuthRegisterRoute() {
	const navigate = useNavigate()

	return <Register onClose={() => navigate('/', { replace: true })} switchToLogin={() => navigate('/auth/login', { replace: true })} />
}

function AuthForgotPasswordRoute() {
	const navigate = useNavigate()

	return <ForgotPassword switchToLogin={() => navigate('/auth/login', { replace: true })} />
}

const navRoutes = moviesCategories.flatMap(({ name, children, to }) =>
	children
		? children.map(({ name: childTitle }) => ({
				path: `movies/${to}`,
				element: <MoviesList title={childTitle} />,
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
					{ index: true, element: <Navigate to='profile' replace /> },
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
		children: [
			{ index: true, element: <Navigate to='login' replace /> },
			{ path: 'login', element: <AuthLoginRoute /> },
			{ path: 'register', element: <AuthRegisterRoute /> },
			{ path: 'forgot-password', element: <AuthForgotPasswordRoute /> },
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
])

function AppRoutes() {
	return (
		<Suspense fallback={<RouteFallback />}>
			<RouterProvider router={router} />
		</Suspense>
	)
}

export default AppRoutes
