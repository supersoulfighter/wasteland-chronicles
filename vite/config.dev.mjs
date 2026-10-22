import {defineConfig} from 'vite';
import concat from '@vituum/vite-plugin-concat';

export default defineConfig({
	base: './',
	server: {
		port: 8080
	},
	plugins: [
		concat({
			files: { 'wasteland-chronicles.js': ['src/**/*.js'] },
			input: ['wasteland-chronicles.js']
		})
	]
});
