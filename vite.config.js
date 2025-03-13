import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		compression(),
		svgr(),
		[
			'import',
			{
				libraryName: 'antd',
				libraryDirectory: 'es',
				style: 'css',
			},
			'antd',
		],
	],
	resolve: {
		alias: [{ find: '~', replacement: '/src' }],
	},
})
