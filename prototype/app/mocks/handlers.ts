// Import medium or full dataset. (build full dateset before import)
import { handlers as mockHandlers } from '@repo/mock-backend/medium';
import { http, passthrough } from 'msw';

export const handlers = [
	...mockHandlers,
	// Pass-Through Handler für alles andere
	http.get('*', () => passthrough()),
];
