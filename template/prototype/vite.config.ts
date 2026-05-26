import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";

// `.env` lives at the monorepo root, not inside this workspace.
const envDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export default defineConfig(({ mode }) => ({
	envDir,
	plugins: [reactRouter(), tailwindcss()],
	resolve: {
		preserveSymlinks: false,
		tsconfigPaths: true,
	},
	optimizeDeps: {
		exclude: mode === 'development' ? ['@repo/ui'] : [],
	},
	server: {
		watch: {
			followSymlinks: true, // Vite beobachtet auch verlinkte Dependencies
		},
	},
}));
