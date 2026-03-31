import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'PLANNING STACK TEMPLATE Prototype' }];
};

export default function Index() {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-3xl font-semibold tracking-tight">Start with a blank product shell</h2>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          This prototype is intentionally empty. Add your first route, connect your own API layer,
          or use one of the optional examples as reference.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-border bg-background p-6">
          <h3 className="text-lg font-medium">Prototype</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Replace this landing page with the first user flow you want to validate.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-background p-6">
          <h3 className="text-lg font-medium">Mocks</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The base project ships with starter-safe mock data and MSW packages that build without
            demo entities.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-background p-6">
          <h3 className="text-lg font-medium">Examples</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If you generated an example, open the matching folder under <code>examples/</code> and
            run it independently.
          </p>
        </article>
      </section>
    </div>
  );
}
