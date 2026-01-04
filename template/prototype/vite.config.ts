import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [reactRouter(), tsconfigPaths()],
	resolve: {
		preserveSymlinks: false,
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
