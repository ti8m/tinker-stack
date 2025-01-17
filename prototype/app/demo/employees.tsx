import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#/components/ui/table';
import { useLoaderData } from 'react-router';
import { demoApi } from './api';

export const clientLoader = async () => {
	const employees = await demoApi.getEmployees();
	return { employees };
};

export default function Employees() {
	const { employees } = useLoaderData<typeof clientLoader>();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Employees</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]"></TableHead>
						<TableHead>First Name</TableHead>
						<TableHead>Last Name</TableHead>
						<TableHead>Email</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employees.map(employee => (
						<TableRow key={employee.id}>
							<TableCell>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={employee.portrait}
										alt={`${employee.firstName} ${employee.lastName}`}
									/>
									<AvatarFallback>{employee.firstName.charAt(0)}</AvatarFallback>
								</Avatar>
							</TableCell>
							<TableCell>{employee.firstName}</TableCell>
							<TableCell>{employee.lastName}</TableCell>
							<TableCell>{employee.email}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
