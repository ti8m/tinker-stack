import { auth } from '#/auth.js';
import { authHandlers } from '#/handlers/auth.js';
import { demoHandlers } from '#/handlers/demo.js';
import type { Dataset } from '@repo/mock-data';
import { buildDataset, datasetConfigs } from '@repo/mock-data';

console.time('building dataset');
const { data, indexes } = buildDataset(datasetConfigs.medium);
console.timeEnd('building dataset');

const handlers = [
	...authHandlers(data),
	...demoHandlers({ dataset: data, indexes, auth, addDelay: false }),
];

export { handlers };
export type { Dataset };
