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
					if (/[^/\\]node_modules[\\\\/](react|react-dom|react-router|react-router-dom|scheduler|react-is|use-sync-external-store|loose-envify|object-assign|js-tokens|react-helmet-async|@ant-design[\\\\/]v5-patch-for-react-19|prop-types)[\\\\/]/.test(id) ||
						hasModule('antd') ||
						id.includes('@ant-design') ||
						id.includes('@rc-component') ||
						/[\\\\/]node_modules[\\\\/]rc-[^/\\\\]+[\\\\/]/.test(id) ||
						hasModule('@ant-design/icons') ||
						hasModule('classnames') ||
						hasModule('react-icons')) {
						return 'react-core'
					}

					if (id.includes('@reduxjs/toolkit') || hasModule('react-redux')) {
						return 'redux'
					}

					if (hasModule('firebase') || id.includes('@firebase')) {
						return 'firebase'
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

					return 'react-core'
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
