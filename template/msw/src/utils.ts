import type { PaginatedResponse } from '@repo/api/commons/types';

/**
 * This function simulates a delay that is caused by the server.
 * It waits a constant amount and adds an optional linear amount depending on the parameter n.
 * @param n - lenght of the returned data array.
 * @param active - if false, the function will not wait.
 * @param constantDelay - the constant delay in milliseconds.
 * @param variableDelay - the linear delay in milliseconds per item.
 */
export async function serverDelay(n = 1, active = false, constantDelay = 100, variableDelay = 1) {
	const delay = active ? constantDelay + n * variableDelay : 0;
	await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Pagination helper. Returns a Spring Boot Paginated Response.
 * @param data Paginated data
 * @param pageStr Page number (1-indexed) as string
 * @param sizeStr Page size as string
 * @returns Paginated response
 */
export function paginate<T>(data: T[], searchParams: URLSearchParams): PaginatedResponse<T> {
	const page = Number(searchParams.get('page') ?? 1);
	const size = Number(searchParams.get('size') ?? 50);
	const start = (page - 1) * size;
	const end = start + size;
	const totalPages = Math.ceil(data.length / size);
	return {
		content: data.slice(start, end),
		pageable: { pageNumber: page, pageSize: size },
		totalPages,
		totalElements: data.length,
		first: page === 1,
		last: page === totalPages,
		size,
		number: page,
	};
}
