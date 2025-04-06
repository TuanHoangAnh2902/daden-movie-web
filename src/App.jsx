import AppRoutes from './routes/AppRoutes'
import AuthInitializer from './components/auth/AuthInitializer'

function App() {
	return (
		<>
			<AuthInitializer />
			<AppRoutes />
		</>
	)
}

export default App
