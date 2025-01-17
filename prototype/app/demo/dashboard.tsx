import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Activity, Clock, DollarSign, Users } from 'lucide-react';

export default function Dashboard() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			<div className="@container">
				<div className="grid grid-cols-2 @lg:grid-cols-3 gap-4">
					{/* Gesamtbenutzer Widget */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Gesamtbenutzer</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">1234</div>
							<p className="text-xs text-muted-foreground">+10% gegenüber dem Vormonat</p>
						</CardContent>
					</Card>

					{/* Umsatzübersicht Widget */}
					<Card className="col-span-2">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Umsatzübersicht</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">CHF 54321</div>
							<p className="text-xs text-muted-foreground">Monatlicher Umsatz</p>
							<div className="mt-4 h-[60px] w-full bg-muted rounded-md"></div>
						</CardContent>
					</Card>

					{/* Aktivitätsfeed Widget */}
					<Card className="row-span-2">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Aktivitätsfeed</CardTitle>
							<Activity className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li className="text-sm">Benutzeranmeldung: Hans Muster</li>
								<li className="text-sm">Neue Bestellung: #12345</li>
								<li className="text-sm">Zahlung erhalten: CHF 99.99</li>
								<li className="text-sm">Produktaktualisierung: v2.0.1</li>
								<li className="text-sm">Support-Ticket geschlossen: #987</li>
							</ul>
						</CardContent>
					</Card>

					{/* Aktuelle Zeit Widget */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Aktuelle Zeit</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{new Date().toLocaleTimeString('de-CH')}</div>
							<p className="text-xs text-muted-foreground">Lokalzeit</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
