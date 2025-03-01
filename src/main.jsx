// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'normalize.css'
import '@ant-design/v5-patch-for-react-19'

import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(
	// <StrictMode>
	<Provider store={store}>
		<App />
	</Provider>,
	/* </StrictMode>, */
)
