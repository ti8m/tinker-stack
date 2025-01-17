/**
 * Granular Permissions.
 * The UI only uses these permissions which are derived from the roles in the JWT.
 * The key is the permission name and the value is the permission description.
 */
export const permissions = {
	'reports-create': 'Create reports',
	'reports-approve': 'Approve reports',
	'admin': 'Administrative privileges',
};

export type Permission = keyof typeof permissions;
