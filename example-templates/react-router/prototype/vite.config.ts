import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [reactRouter(), tailwindcss()],
	resolve: {
		preserveSymlinks: false,
		tsconfigPaths: true,
	},
	optimizeDeps: {
		exclude:
			process.env.NODE_ENV === 'development'
				? [
						'@repo/msw/medium',
						'@repo/msw/handlers',
						'@repo/api/stammdaten/enums',
						'@repo/ui',
					]
				: [],
	},
	server: {
		watch: {
			followSymlinks: true, // Vite beobachtet auch verlinkte Dependencies
		},
	},
});
