import AppRoutes from './routes/AppRoutes'
import AuthInitializer from './components/auth/AuthInitializer'
import FavoritesInitializer from './components/auth/FavoritesInitializer'
import MovieListsInitializer from './components/auth/MovieListsInitializer'
import { ConfigProvider, FloatButton } from 'antd'
import { useThemeColors } from './themes/useThemeColors'

// 1. Import các thành phần từ react-helmet-async
import { Helmet, HelmetProvider } from 'react-helmet-async'

function App() {
	const { subColor } = useThemeColors()

	return (
		// 2. Bọc HelmetProvider ở lớp ngoài cùng
		<HelmetProvider>
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
				{/* 3. Đặt Helmet mặc định tại đây */}
				<Helmet>
					<title>DaDen Movie - Xem phim Vietsub miễn phí</title>
					<meta
						name='description'
						content='Trang web xem phim chất lượng cao với phụ đề tiếng Việt cập nhật nhanh nhất.'
					/>
					<link rel='canonical' href='https://daden-movie-web.vercel.app/' />
				</Helmet>

				<AuthInitializer>
					<FavoritesInitializer>
						<MovieListsInitializer>
							<AppRoutes />
						</MovieListsInitializer>
					</FavoritesInitializer>
				</AuthInitializer>
			</ConfigProvider>
			<FloatButton.BackTop />
		</HelmetProvider>
	)
}

export default App
