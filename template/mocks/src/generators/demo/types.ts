export interface IThing {
	id: string;
	name: string;
}

export interface IPerson {
	readonly id: string;
	firstName: string;
	lastName: string;
	email: string;
	portrait?: string;
}

export interface ICompany {
	id: string;
	name: string;
}

export interface IWorkingAt {
	personId: string;
	companyId: string;
	role: 'employee' | 'manager' | 'admin';
}
