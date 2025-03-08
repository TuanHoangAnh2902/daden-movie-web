import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '~/layouts/MainLayout'
import About from '~/pages/About'
import Home from '~/pages/Home'
import NotFount from '~/pages/NotFount'
import AuthLayouts from '~/layouts/AuthLayouts'

const router = createBrowserRouter([
	{
		path: '*',
		element: <NotFount />,
	},
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'about', element: <About /> },
		],
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
