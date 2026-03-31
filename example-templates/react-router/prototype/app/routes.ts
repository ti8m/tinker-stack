// app/routes.ts
import { type RouteConfig, index, route } from '@react-router/dev/routes';

const routes = [
	route('dashboard', './demo/dashboard.tsx'),
	route('employees', './demo/employees.tsx'),
	route('admin', './demo/admin.tsx'),
	index('./routes/_index.tsx'),
] satisfies RouteConfig;

export default routes;
