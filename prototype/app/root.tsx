import { ApiProvider } from '#/components/context-providers/apiContext';
import { AuthProvider, usePermissions } from '#/components/context-providers/permissionContext';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import { DemoApi } from '#/demo/api';
import { useBreakpoint } from '#/hooks/useBreakpoint';
import { cn } from '#/lib/utils';
import styles from '#/styles/tailwind.css?url';
import type { MeResponse } from '@repo/api/demo/types';
import ky from 'ky';
import {
	HomeIcon,
	LayoutDashboard,
	LogOutIcon,
	PanelLeftClose,
	PanelLeftOpen,
	Shield,
	User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ClientActionFunctionArgs } from 'react-router';
import {
	Form,
	Links,
	Meta,
	NavLink,
	Outlet,
	redirectDocument,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from 'react-router';

/**
 * Fetch the user data from the mock backend.
 */
export async function clientLoader(): Promise<
	| {
			me: MeResponse;
			authenticated: true;
	  }
	| { authenticated: false; me?: never; groups?: never; error?: Error }
> {
	const api = DemoApi(ky);
	let me: MeResponse;
	if (typeof document !== 'undefined' && document.cookie?.includes('authToken')) {
		try {
			me = await api.me();
			return { me, authenticated: true };
		} catch (error) {
			console.error('Error fetching initial data', error);
			return { authenticated: false, error: error as Error };
		}
	}

	return { authenticated: false };
}

/**
 * Log the user in or out.
 * @param request
 */
export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	const formData = await request.formData();
	const intent = formData.get('intent');
	if (intent === 'login') {
		try {
			await ky.post('/auth/login', {
				body: formData,
			});
		} catch (error) {
			console.error('Error logging in', error);
			return null;
		}
	} else if (intent === 'logout' && typeof document !== 'undefined') {
		const response = await ky.post('/auth/logout');
		document.cookie = '';
		console.log({ response });
	}
	throw redirectDocument('./');
};

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}

export function Document({ children }: { children?: React.ReactNode }) {
	return (
		<html lang="de">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex nofollow" />
				<Meta />
				<Links />
			</head>
			<body className="font-sans overflow-hidden max-h-screen">
				{children}

				<Scripts />
			</body>
		</html>
	);
}

function Header({ children }: { children?: React.ReactNode }) {
	return (
		<header className="col-span-2 grid grid-cols-[1fr_auto] items-center bg-popover px-10 pt-4 pb-3 shadow-sm z-10">
			<div className="flex items-center">
				<div className="text-3xl font-bold">PLANNING STACK TEMPLATE Prototype</div>
			</div>
			{children}
		</header>
	);
}

function MainNav({ showLabels }: { showLabels: boolean }) {
	const permissions = usePermissions();
	return (
		<nav className="mt-8 flex-grow overflow-y-auto">
			<NavItem href="/" icon={<HomeIcon />} label="Home" isOpen={showLabels} />
			<NavItem href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" isOpen={showLabels} />
			<NavItem href="/employees" icon={<User />} label="Personal" isOpen={showLabels} />
			{permissions.includes('admin') && (
				<NavItem href="/admin" icon={<Shield />} label="Admin" isOpen={showLabels} />
			)}
		</nav>
	);
}

const apiContext = {
	demo: DemoApi(ky),
};

export default function App() {
	const breakpoint = useBreakpoint();
	const loaderData = useLoaderData<typeof clientLoader>();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		if (!isSidebarOpen && breakpoint === 'lg') {
			// TODO: Temporär deaktiviert für User-Testing
			// setIsSidebarOpen(true);
		} else if (isSidebarOpen && breakpoint === 'sm') {
			setIsSidebarOpen(false);
		}
		// only act on a change of breakpoint.
	}, [breakpoint]);

	if (!loaderData) return <Document />;

	// Wenn der Benutzer nicht eingeloggt ist, wird er aufgefordert sich einzuloggen.
	if (loaderData?.authenticated === false) {
		return (
			<Document>
				<Form action="./" method="POST">
					<input type="hidden" name="intent" value="login" readOnly />
					<div className="flex  gap-4 mx-auto p-10">
						<Button type="submit" variant="outline" name="username" value="admin">
							Login as administrator
						</Button>
						<Button type="submit" variant="outline" name="username" value="manager">
							Login as manager
						</Button>
						<Button type="submit" variant="outline" name="username" value="employee">
							Login as employee
						</Button>
					</div>
					{loaderData.error && <div className="text-red-500">{loaderData.error.message}</div>}
				</Form>
			</Document>
		);
	}

	const { me } = loaderData;
	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<Document>
			<AuthProvider>
				<ApiProvider value={apiContext}>
					<div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen bg-background">
						<Header>
							<div className="flex items-center justify-end px-4 py-3 gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage src={me.portrait} alt="" />
									<AvatarFallback>{me.firstName.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className="text-sm">
									{me.firstName} {me.lastName}
								</div>
								<Form action="./" method="POST">
									<input type="hidden" name="intent" value="logout" readOnly />
									<Button type="submit" variant="ghost" size="icon">
										<LogOutIcon className="h-5 w-5" />
									</Button>
								</Form>
							</div>
						</Header>

						<aside
							data-open={isSidebarOpen}
							className="bg-popover text-popover-foreground transition-all duration-300 flex flex-col w-64 data-[open=false]:w-20 data-[open=false]:items-center row-start-2 col-start-1 h-full"
						>
							<MainNav showLabels={isSidebarOpen} />
							<div className="text-xs text-muted p-4">
								Version {import.meta.env.VITE_VERSION}, Build {import.meta.env.VITE_BUILD_NUMBER},{' '}
								{breakpoint}
							</div>
							<div className="p-4 flex justify-center">
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-secondary-foreground"
									onClick={toggleSidebar}
									title={isSidebarOpen ? 'Sidebar schliessen' : 'Sidebar öffnen'}
								>
									{isSidebarOpen ? (
										<PanelLeftClose className="h-6 w-6" />
									) : (
										<PanelLeftOpen className="h-6 w-6" />
									)}
								</Button>
							</div>
						</aside>
						<main className="row-start-2 col-start-2 overflow-x-hidden overflow-y-auto p-6 max-h-full relative scroll-smooth">
							<Outlet />
							<ScrollRestoration />
						</main>
					</div>
				</ApiProvider>
			</AuthProvider>
		</Document>
	);
}

function NavItem({
	href,
	icon,
	label,
	isOpen,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
	isOpen: boolean;
}) {
	return (
		<NavLink
			to={href}
			className={({ isActive }) =>
				cn('flex flex-none items-center px-4 py-2 hover:bg-accent', {
					'justify-start': isOpen,
					'justify-center w-12 px-0': !isOpen,
					'rounded-sm': !isOpen,
					'bg-accent': isActive,
					'font-bold': isActive,
				})
			}
		>
			<span title={label}>{icon}</span>
			{
				<span className={cn('inline-block overflow-hidden', { 'w-0': !isOpen, 'ml-4': isOpen })}>
					{label}
				</span>
			}
		</NavLink>
	);
}

export function HydrateFallback() {
	return (
		<Document>
			<div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen bg-background">
				<Header>
					<div className="h-[3.75rem]" />
				</Header>
				{/* TODO: md Klassen hinzufügen*/}
				<aside className="bg-popover text-popover-foreground flex flex-col w-20 items-center row-start-2 col-start-1 h-full"></aside>
				<main className="row-start-2 col-start-2 overflow-x-hidden overflow-y-auto p-6 max-h-full relative scroll-smooth">
					<div className="font-sans p-4">
						<h1 className="text-3xl mb-3">Lädt...</h1>
					</div>
				</main>
			</div>
		</Document>
	);
}
