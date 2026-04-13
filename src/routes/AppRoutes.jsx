import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Navigate, RouterProvider, createBrowserRouter, useNavigate, useSearchParams } from 'react-router-dom'
import { moviesCategories } from '~/constants/routes'
import AuthLayouts from '~/layouts/AuthLayouts'
import MainLayout from '~/layouts/MainLayout'
import {
	toMovieCategoryPath,
	toMovieCountryPath,
	toMovieDetailPath,
	toMovieListPath,
	toMovieWatchPath,
	toSearchPath,
} from '~/utils/routePaths'

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

	return (
		<Register
			onClose={() => navigate('/', { replace: true })}
			switchToLogin={() => navigate('/auth/login', { replace: true })}
		/>
	)
}

function AuthForgotPasswordRoute() {
	const navigate = useNavigate()

	return <ForgotPassword switchToLogin={() => navigate('/auth/login', { replace: true })} />
}

function LegacySearchRedirect() {
	const [searchParams] = useSearchParams()
	const query = searchParams.get('query')
	const page = Number.parseInt(searchParams.get('page') || '1', 10)

	if (!query) {
		return <Navigate to='/' replace />
	}

	return <Navigate to={toSearchPath(query, Number.isNaN(page) ? 1 : page)} replace />
}

function LegacyMovieDetailRedirect() {
	const [searchParams] = useSearchParams()
	const movieId = searchParams.get('id')

	if (!movieId) {
		return <Navigate to='/' replace />
	}

	return <Navigate to={toMovieDetailPath(movieId)} replace />
}

function LegacyMovieWatchRedirect() {
	const [searchParams] = useSearchParams()
	const movieId = searchParams.get('id')
	const episodeSlug = searchParams.get('ep') || 'full'

	if (!movieId) {
		return <Navigate to='/' replace />
	}

	return <Navigate to={toMovieWatchPath(movieId, episodeSlug)} replace />
}

function LegacyMovieListRedirect() {
	const [searchParams] = useSearchParams()
	const listSlug = searchParams.get('name')
	const page = Number.parseInt(searchParams.get('page') || '1', 10)

	if (!listSlug) {
		return <Navigate to='/' replace />
	}

	return <Navigate to={toMovieListPath(listSlug, Number.isNaN(page) ? 1 : page)} replace />
}

function LegacyMovieCategoryRedirect() {
	const [searchParams] = useSearchParams()
	const categorySlug = searchParams.get('name')
	const page = Number.parseInt(searchParams.get('page') || '1', 10)

	if (!categorySlug) {
		return <Navigate to='/' replace />
	}

	return <Navigate to={toMovieCategoryPath(categorySlug, Number.isNaN(page) ? 1 : page)} replace />
}

function LegacyMovieCountryRedirect() {
	const [searchParams] = useSearchParams()
	const countrySlug = searchParams.get('name')
	const page = Number.parseInt(searchParams.get('page') || '1', 10)

	if (!countrySlug) {
		return <Navigate to='/' replace />
	}

	return <Navigate to={toMovieCountryPath(countrySlug, Number.isNaN(page) ? 1 : page)} replace />
}

const navRoutes = moviesCategories.flatMap(({ name, children, to }) =>
	children ?
		children.map(({ name: childTitle, to: childSlug }) => ({
			path: `movies/list/${childSlug}`,
			element: <MoviesList title={childTitle} />,
		}))
	:	[{ path: `movies/list/${to}`, element: <MoviesList title={name} /> }],
)

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'about', element: <About /> },
			{ path: 'search', element: <LegacySearchRedirect /> },
			{
				path: 'search/:query',
				element: <MoviesSearchList />,
			},
			{ path: 'movies', element: <LegacyMovieListRedirect /> },
			{
				path: 'movies/country',
				element: <LegacyMovieCountryRedirect />,
			},
			{
				path: 'movies/country/:countrySlug',
				element: <MoviesCountiesList />,
			},
			{
				path: 'movies/category',
				element: <LegacyMovieCategoryRedirect />,
			},
			{
				path: 'movies/category/:categorySlug',
				element: <MovieCategoryList />,
			},
			{
				path: 'movie/detail',
				element: <LegacyMovieDetailRedirect />,
			},
			{
				path: 'movie/:movieId',
				element: <MovieDetail />,
			},
			{
				path: 'movie/watch',
				element: <LegacyMovieWatchRedirect />,
			},
			{
				path: 'watch/:movieId/:episodeSlug?',
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
