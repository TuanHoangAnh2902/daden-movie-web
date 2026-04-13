import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

const shouldAnalyze = globalThis.process?.env?.ANALYZE === 'true'

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
		compression({ algorithm: 'gzip' }),
		compression({ algorithm: 'brotliCompress', ext: '.br' }),
		svgr(),
		shouldAnalyze && visualizer({ open: false, filename: 'stats.html' }),
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
				manualChunks(id) {
					if (!id.includes('node_modules')) return

					const hasModule = (moduleName) => new RegExp(`[\\\\/]${moduleName}[\\\\/]`).test(id)
					const isReactCoreModule = /[\\\\/]node_modules[\\\\/](react|react-dom|react-router-dom)[\\\\/]/.test(id)

					if (isReactCoreModule) {
						return 'react-core'
					}

					if (hasModule('antd') || id.includes('@ant-design')) {
						return 'antd'
					}

					if (id.includes('@reduxjs/toolkit') || hasModule('react-redux')) {
						return 'redux'
					}

					if (hasModule('firebase') || id.includes('@firebase')) {
						return 'firebase'
					}

					if (hasModule('react-icons')) {
						return 'icons'
					}

					if (hasModule('react-share')) {
						return 'share'
					}

					if (hasModule('react-player') || hasModule('hls.js') || hasModule('plyr')) {
						return 'media'
					}

					if (hasModule('framer-motion') || hasModule('swiper') || hasModule('aos')) {
						return 'ui-motion'
					}

					return 'vendor'
				},
			},
		},
		chunkSizeWarningLimit: 1000, // Tăng giới hạn cảnh báo kích thước chunk
		sourcemap: false, // Tắt source map trong production để giảm kích thước build
		cssCodeSplit: true, // Tách CSS thành các file riêng biệt
		assetsInlineLimit: 4096, // Nhúng các assets nhỏ hơn 4kb vào bundle
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/test/setup.js',
	},
})
