import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, './src/components'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@types': path.resolve(__dirname, './src/types'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@routes': path.resolve(__dirname, './src/routes'),
			'@contexts': path.resolve(__dirname, './src/contexts'),
		},
	},
	server: {
		open: true,
	},
	test: {
		dir: 'src',
		globals: true,
	},
})
