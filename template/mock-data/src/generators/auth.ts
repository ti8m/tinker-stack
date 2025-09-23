import type { Permission } from '@repo/api/commons/enums';
import type { ICompany, IPerson, IWorkingAt } from './demo/types.js';

function permissionsForRole(role: IWorkingAt['role']): Permission[] {
	const permissions: Permission[] = ['reports-create'];
	if (role === 'manager') permissions.push('reports-approve');
	if (role === 'admin') permissions.push('admin');

	return permissions;
}

/**
 * The payload part from the JWT Token.
 */
export function JWTPayload({
	person,
	company,
	role,
}: {
	person: IPerson;
	company: ICompany;
	role: IWorkingAt['role'];
}) {
	const permissions = permissionsForRole(role);

	return {
		sub: person.id,
		cn: `${person.firstName} ${person.lastName}`,
		orgName: company.name,
		orgId: company.id,
		username: person.email.split('@')[0],
		permissions,
		locale: 'de',
		email: person.email,
	};
}

export type JWTPayload = ReturnType<typeof JWTPayload>;
