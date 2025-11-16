import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
	return [{ title: 'PLANNING STACK TEMPLATE Prototype' }];
};

export default function Index() {
	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl mb-3">PLANNING STACK TEMPLATE Prototype</h1>
			<p>Dies ist ein klickbarer Prototyp für die PLANNING STACK TEMPLATE-Anwendung.</p>
			<p>Es dient zum Austesten von Anwendungsfällen und Prozessen.</p>
			<p>Alle Daten sind synthetisch und es gibt keinen Zugriff auf ein Backend.</p>
		</div>
	);
}
