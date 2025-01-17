/**
 * Image Object
 */
export type Image = {
	url: string;
	alt?: string;
	width?: number;
	height?: number;
};

/**
 * Calendar Date String (YYYY-MM-DD)
 */
export type IsoDateString = string;
/**
 * ISO 8601 Timestamp String
 */
export type IsoTimestampString = string;

/**
 * Spring Boot Paginated Response
 */
export type PaginatedResponse<T> = {
	content: T[];
	pageable: {
		pageNumber: number;
		pageSize: number;
	};
	totalPages: number;
	totalElements: number;
	first: boolean;
	last: boolean;
	size: number;
	number: number;
};

export type File = {
	readonly type: string;
	readonly name: string;
	readonly size: number;
	readonly createdAt: IsoTimestampString;
};
