import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { startWorker } from './mocks/browser';

startWorker()
	.then(() =>
		startTransition(() => {
			hydrateRoot(
				document,
				<StrictMode>
					<HydratedRouter />
				</StrictMode>,
			);
		}),
	)
	.catch(console.error);
