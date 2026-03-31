import { http, passthrough } from 'msw';

export const handlers = [
	http.get('*', () => passthrough()),
	http.post('*', () => passthrough()),
	http.put('*', () => passthrough()),
	http.patch('*', () => passthrough()),
	http.delete('*', () => passthrough()),
];
