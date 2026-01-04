import type { Dataset, JWTPayload } from '@repo/mocks';
import { serialize } from '@tinyhttp/cookie';
import { http, HttpResponse, type HttpHandler } from 'msw';

export type { JWTPayload };

export function getAuthHandlers(dataset: Dataset) {
	return {
		login: http.post('/auth/login', async ({ request }) => {
			const formData = await request.formData();
			const username = formData.get('username');
			const token = dataset.tokens[username as string];

			console.debug({ username, token });

			if (!token) {
				throw new HttpResponse(null, { status: 401, statusText: 'Invalid username' });
			}

			const cookie = serialize('authToken', JSON.stringify(token), {
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
			});

			return new HttpResponse(null, {
				status: 204,
				headers: { 'Set-Cookie': cookie },
			});
		}),
		logout: http.post('/auth/logout', () => {
			return new HttpResponse(null, {
				status: 204,
				headers: {
					'Set-Cookie': serialize('authToken', '', { path: '/', sameSite: 'strict', maxAge: 0 }),
				},
			});
		}),
	} satisfies Record<string, HttpHandler>;
}

export const authHandlers = (dataset: Dataset): HttpHandler[] => Object.values(getAuthHandlers(dataset));
