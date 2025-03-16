import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'normalize.css'
import '@ant-design/v5-patch-for-react-19'
import '~/styles/global.scss'

import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<ConfigProvider theme={{ token: { colorBgLayout: '#191b24' } }}>
				<App />
			</ConfigProvider>
		</Provider>
	</StrictMode>,
)
