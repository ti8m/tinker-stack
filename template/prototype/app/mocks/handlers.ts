import { http } from 'msw/http';
import { passthrough } from 'msw/utils/passthrough';

export const handlers = [
	http.get('*', () => passthrough()),
	http.post('*', () => passthrough()),
	http.put('*', () => passthrough()),
	http.patch('*', () => passthrough()),
	http.delete('*', () => passthrough()),
];
