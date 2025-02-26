import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '~/layouts/MainLayout'
import About from '~/pages/About'
import Home from '~/pages/Home'
import NotFount from '~/pages/NotFount'

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'about', element: <About /> },
			{ path: '*', element: <NotFount /> },
		],
	},
])

function AppRoutes() {
	return <RouterProvider router={router} />
}

export default AppRoutes
