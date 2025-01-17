import type { EmployeeRead, MeResponse } from '@repo/api/demo/types';
import ky, { type KyInstance } from 'ky';

export function DemoApi(ky: KyInstance) {
	return {
		getEmployees: async (): Promise<EmployeeRead[]> => ky.get('/demo/employees').json(),
		me: async (): Promise<MeResponse> => ky.get('/demo/me').json(),
	};
}

export const demoApi = DemoApi(ky);
