// app/routes.ts
import { type RouteConfig, index } from '@react-router/dev/routes';

const routes = [
	index('./routes/_index.tsx'),
] satisfies RouteConfig;

export default routes;
