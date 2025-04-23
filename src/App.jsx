import AppRoutes from './routes/AppRoutes'
import AuthInitializer from './components/auth/AuthInitializer'
import FavoritesInitializer from './components/auth/FavoritesInitializer'
import MovieListsInitializer from './components/auth/MovieListsInitializer'
import { ConfigProvider, FloatButton } from 'antd'
import { useThemeColors } from './themes/useThemeColors'

function App() {
	const { subColor } = useThemeColors()
	return (
		<>
			<ConfigProvider
				theme={{
					token: { colorBgLayout: '#191b24', fontFamily: '"Be Vietnam Pro","sans-serif"', colorPrimary: subColor },
					components: {
						Message: {
							contentBg: '#ffffff',
							colorText: '#141414',
							padding: 16,
							borderRadius: 8,
							boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
						},
						Select: {
							selectorBg: '#25272f',
							colorBorder: 'none',
							hoverBorderColor: 'none',
							activeBorderColor: 'none',
							colorText: '#fff',
							colorTextPlaceholder: '#ccc',
						},
					},
				}}>
				<AuthInitializer>
					<FavoritesInitializer>
						<MovieListsInitializer>
							<AppRoutes />
						</MovieListsInitializer>
					</FavoritesInitializer>
				</AuthInitializer>
			</ConfigProvider>
			<FloatButton.BackTop />
		</>
	)
}

export default App
