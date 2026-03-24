import type { Faker } from '@faker-js/faker';
import type { IPerson } from './types.js';

export function Person({
	id,
	faker,
	refDate,
}: {
	id?: string;
	faker: Faker;
	refDate?: string | Date | number;
}): IPerson {
	const gender = faker.datatype.boolean(0.2) ? 'female' : 'male';
	const firstName = faker.person.firstName(gender);
	const lastName = faker.person.lastName();

	return {
		id: id ?? faker.string.ulid({ refDate }),
		firstName,
		lastName,
		email: faker.internet.email({ firstName, lastName }),
		portrait: `https://randomuser.me/api/portraits/med/${gender === 'female' ? 'women' : 'men'}/${faker.string.numeric(2)}.jpg`,
	};
}
