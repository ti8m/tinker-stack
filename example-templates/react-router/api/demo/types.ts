import type { Permission } from '#/commons/enums.js';

export type Employee = {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	portrait?: string;
};

export type EmployeeRead = Readonly<Employee> & {
	readonly id: string;
};

type Company = {
	id: string;
	name: string;
};

export type CompanyRead = Readonly<Company> & {
	readonly id: string;
};

export type MeResponse = EmployeeRead & {
	readonly company: CompanyRead;
	readonly permissions: Permission[];
};
