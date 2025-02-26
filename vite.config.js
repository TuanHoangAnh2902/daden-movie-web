import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression'
import imp from 'vite-plugin-imp'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		compression(),
		imp({
			libList: [
				{
					libName: 'antd',
					style: (name) => `antd/es/${name}/style`,
				},
			],
		}),
	],
	resolve: {
		alias: [{ find: '~', replacement: '/src' }],
	},
})
