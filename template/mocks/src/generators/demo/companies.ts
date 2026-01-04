import type { Faker } from '@faker-js/faker';
import type { ICompany, IWorkingAt } from './types.js';

/**
 * Example Generator. Generates a Company.
 * id and name can be provided to generate a specific company (used for testing).
 */
export function Company({
	faker,
	id,
	refDate,
	name,
}: {
	faker: Faker;
	id?: string;
	name?: string;
	refDate?: string | Date | number;
}): ICompany {
	return {
		id: id ?? faker.string.ulid({ refDate }),
		name: name ?? faker.company.name(),
	};
}

export function WorkingAt({
	faker,
	personId,
	companyId,
}: {
	faker: Faker;
	personId: string;
	companyId: string;
}): IWorkingAt {
	return {
		personId,
		companyId,
		role: faker.datatype.boolean(0.8) ? 'employee' : 'manager',
	};
}
