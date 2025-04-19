import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'normalize.css'
import '@ant-design/v5-patch-for-react-19'
import '~/styles/global.scss'
import AOS from 'aos'
import 'aos/dist/aos.css'

import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store'

// Khởi tạo AOS cho toàn bộ ứng dụng
AOS.init({
	once: true,
	duration: 500,
	easing: 'ease-in-out',
	disable: 'mobile',
	offset: 100,
})

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
)
