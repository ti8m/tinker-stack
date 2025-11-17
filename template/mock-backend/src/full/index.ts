import { auth } from '#/auth.js';
import { authHandlers } from '#/handlers/auth.js';
import { demoHandlers } from '#/handlers/demo.js';
import type { Dataset } from '@repo/mock-data';
import { buildDataset, datasetConfigs } from '@repo/mock-data';
import type { HttpHandler } from 'msw';

console.time('building dataset');
const { data, indexes } = buildDataset(datasetConfigs.full);
console.timeEnd('building dataset');

/**
 * Full import
 */

const handlers: HttpHandler[] = [
	...authHandlers(data),
	...demoHandlers({ dataset: data, indexes, auth, addDelay: false }),
];

export { handlers };
export type { Dataset };
