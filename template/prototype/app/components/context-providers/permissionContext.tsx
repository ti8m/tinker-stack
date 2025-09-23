import type { Permission } from '@repo/api/commons/enums';
import { parse } from '@tinyhttp/cookie';
import { createContext, useContext, useMemo } from 'react';

export const AuthContext = createContext<{
	permissions: Permission[];
	omId: string;
	organisationId: string;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const token = useMemo(() => {
		if (typeof globalThis.document === 'undefined') {
			return null;
		}
		if (document.cookie?.includes('authToken')) {
			try {
				const { authToken } = parse(document.cookie);
				if (authToken) {
					return JSON.parse(decodeURIComponent(authToken)) as {
						organisationId: string;
						omId: string;
						permissions: Permission[];
					};
				} else {
					console.error('No authToken found in cookie');
				}
			} catch (error) {
				console.error('Error parsing authToken', error);
			}
		}
		return null;
	}, [globalThis.document?.cookie]);

	return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
}

const noPermissions: Permission[] = [];

/**
 * Hook to access the permissions that have been read from the cookie.
 * Die Permissions werden mit dem Root-Loader geladen und stehen erst nach der Response des Root-Loaders zur Verfügung.
 */
export function usePermissions(): Permission[] {
	const token = useContext(AuthContext);
	return token?.permissions ?? noPermissions;
}

export function useOmId(): string {
	const token = useContext(AuthContext);
	return token?.omId ?? '';
}
