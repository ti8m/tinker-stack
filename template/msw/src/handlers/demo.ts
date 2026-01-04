import { http, HttpResponse, type HttpHandler } from 'msw';

import type { AuthFunction } from '#/auth.js';
import { serverDelay } from '#/utils.js';
import type { Dataset, DatasetIndexes } from '@repo/mocks';

/**
 * The getHandlers function allows to inject the dependencies into the handlers
 * so they can be replaced in tests.
 */
export function getHandlers({
	dataset,
	indexes,
	auth,
	addDelay = false,
}: {
	dataset: Dataset;
	indexes: DatasetIndexes;
	auth: AuthFunction;
	addDelay: boolean;
}) {
	return {
		employees: http.get('/demo/employees', async ({ cookies }) => {
			const { orgId } = auth(cookies);

			const workingAt = indexes.workingAtIndexedByCompanyId[orgId];

			if (!workingAt) {
				return new HttpResponse(null, {
					status: 403,
					statusText: 'Organisation not found',
				});
			}

			const employees = workingAt.map(value => dataset.persons[value.personId]!);
			await serverDelay(employees.length, addDelay);
			return HttpResponse.json(employees);
		}),
		me: http.get('/demo/me', async ({ cookies }) => {
			const { orgId, sub, permissions } = auth(cookies);

			const user = dataset.persons[sub];

			if (!user) {
				return new HttpResponse(null, {
					status: 403,
					statusText: 'User not found',
				});
			}
			const workingAt = indexes.workingAtIndexedByPersonId[sub];

			if (!workingAt || workingAt.companyId !== orgId) {
				return new HttpResponse(null, {
					status: 403,
					statusText: 'Company not found',
				});
			}

			const company = dataset.companies[orgId]!;

			await serverDelay(1, addDelay);

			return HttpResponse.json({
				...user,
				company,
				permissions,
			});
		}),
	} satisfies Record<string, HttpHandler>;
}

export const demoHandlers = ({
	dataset,
	indexes,
	auth,
	addDelay = false,
}: {
	dataset: Dataset;
	indexes: DatasetIndexes;
	auth: AuthFunction;
	addDelay: boolean;
}): HttpHandler[] =>
	Object.values(
		getHandlers({
			dataset,
			indexes,
			auth,
			addDelay,
		}),
	);
