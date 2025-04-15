import AppRoutes from './routes/AppRoutes'
import AuthInitializer from './components/auth/AuthInitializer'
import FavoritesInitializer from './components/auth/FavoritesInitializer'

function App() {
	return (
		<>
			<AuthInitializer>
				<FavoritesInitializer>
					<AppRoutes />
				</FavoritesInitializer>
			</AuthInitializer>
		</>
	)
}

export default App
