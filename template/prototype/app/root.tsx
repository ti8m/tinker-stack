import styles from '#/styles/tailwind.css?url';
import type { ReactNode } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export function Document({ children }: { children?: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex nofollow" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Starter</p>
          <h1 className="text-2xl font-semibold">PLANNING STACK TEMPLATE Prototype</h1>
        </div>
        <p className="text-sm text-muted-foreground">Replace this shell with your first workflow.</p>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <Document>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-10">
          <Outlet />
          <ScrollRestoration />
        </main>
      </div>
    </Document>
  );
}

export function HydrateFallback() {
  return (
    <Document>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Loading prototype shell...</h2>
          </div>
        </main>
      </div>
    </Document>
  );
}
