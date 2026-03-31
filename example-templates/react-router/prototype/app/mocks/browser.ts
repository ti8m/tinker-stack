import type { RequestHandler } from 'msw';
import { setupWorker } from 'msw/browser';

export async function startWorker() {
	const { handlers } = await import('#/mocks/handlers');
	const worker = setupWorker(...(handlers as RequestHandler[]));

	return worker.start();
}
