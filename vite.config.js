import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

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
		visualizer({ open: false }), // Thêm plugin để phân tích kích thước bundle
	],
	server: {
		port: 3434,
	},
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
	build: {
		target: 'es2015', // Đảm bảo tương thích với các trình duyệt hiện đại
		minify: 'terser', // Sử dụng terser để minify code tốt hơn
		terserOptions: {
			compress: {
				drop_console: true, // Loại bỏ console.log trong production
				drop_debugger: true, // Loại bỏ debugger trong production
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'], // Tách các thư viện lớn thành chunks riêng
					antd: ['antd'], // Tách riêng antd nếu được sử dụng
					redux: ['@reduxjs/toolkit', 'react-redux'], // Tách riêng Redux nếu được sử dụng
				},
			},
		},
		chunkSizeWarningLimit: 1000, // Tăng giới hạn cảnh báo kích thước chunk
		sourcemap: false, // Tắt source map trong production để giảm kích thước build
		cssCodeSplit: true, // Tách CSS thành các file riêng biệt
		assetsInlineLimit: 4096, // Nhúng các assets nhỏ hơn 4kb vào bundle
	},
})
