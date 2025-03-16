import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [
					[
						'import',
						{
							libraryName: 'antd',
							libraryDirectory: 'es',
							style: 'css', // ✅ Tự động import CSS
						},
						'antd',
					],
				],
			},
		}),
		compression(),
		svgr(),
	],
	resolve: {
		alias: [
			{ find: '~', replacement: '/src' },
			{ find: '@', replacement: '/src' },
		],
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "@/styles/variables" as *; @use "@/styles/mixins" as *;`,
			},
		},
	},
})
