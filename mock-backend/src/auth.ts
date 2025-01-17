import type { Permission } from '@repo/api/commons/enums';
import memoize from 'memoize';
import { HttpResponse } from 'msw';

/**
 * Extracts the token from the request headers and parses it.
 * Returns a 401 response if the token is invalid.
 * @param tokenString - encoded JSON String
 */
function parseToken(tokenString: string) {
	const token = JSON.parse(decodeURIComponent(tokenString)) as {
		orgId: string;
		sub: string;
		permissions: Permission[];
	};

	console.debug({ token });

	if (!token?.orgId || !token.sub) {
		throw new HttpResponse(null, { status: 401, statusText: 'Invalid token' });
	}

	return token;
}

const memoizedParseToken = memoize(parseToken);
/**
 * Mock auth handler. Liest das Token.
 * Gibt einen 401 response zurück, falls das Token ungültig ist.
 * @param request
 * @returns
 */
export const auth = (
	cookies: Record<string, string>,
): { orgId: string; sub: string; permissions: Permission[] } => {
	if (!cookies?.authToken) {
		console.warn('User not logged in', cookies);
		throw new HttpResponse(null, { status: 401, statusText: 'No token' });
	}

	return memoizedParseToken(cookies.authToken);
};

/**
 * Throws a 403 error if the user does not have the given permission.
 * @param permission - The permission to check for.
 * @param cookies - The cookies to check the permission for.
 */
export function needsPermission(permission: Permission, cookies: Record<string, string>) {
	const { permissions } = auth(cookies);
	if (!permissions.includes(permission)) {
		throw new HttpResponse(null, {
			status: 403,
			statusText: `User not authorized, missing permission: ${permission}`,
		});
	}
}

export type AuthFunction = typeof auth;
