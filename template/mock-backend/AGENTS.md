# MSW Mocks – Agent Guide

This document captures the conventions for adding and evolving the MSW handlers in this repo. Follow these guidelines to keep mocks predictable, type-safe, and realistic.

Related docs
- `../mock-data/AGENTS.md` — mock dataset structure, generators and presets.
- `../AGENTS.md` — project overview and how mocks integrate in dev/tests.
- `../mock-data/data-mocks/mock-data.small.json` — A small and representative example of the dataset that is passed to the generate functions.

## Core Principles

- Type safety first: use the http method generics for Params, RequestBody, ResponseBody but not Path since this is inferred.
- Never read cookies directly: always call `auth(request.headers)` or `auth(request.headers, 'admin')`.
- Prefer early auth failure: use `auth(request.headers, 'admin')` on admin-only routes to avoid manual checks.
- Keep responses realistic: return 404 for missing resources and 403 for RBAC violations, and add small `serverDelay(...)`.
- Mutations can and should update the in-memory dataset in-place, including reverse indices.
- Use absolute URLs for paths: `http://localhost:3000/api/v1/...`.
- You can throw error responses like 403 with custom bodies instead of returning them to avoid type errors.

The code for the api layer that is consuming the mock API is defined in src/api.

## Imports You’ll Typically Need

- Dataset and types
  - `import type { Dataset } from '@/mock-data/dataset'`
  - Domain types from `src/types/*
- Helpers
  - `import { serverDelay } from '@/mock-backend/utils'`
  - `import type { AuthFunction } from '@/mock-backend/utils'`

## Handler Shape and Exports

- Group related handlers in a `getXxxHandlers(dataset, auth, addDelay)` function that returns a plain object.
- Export `xxxHandlers(dataset, auth, addDelay)` as an array: `Object.values(getXxxHandlers(...))`.

Example skeleton:

```
function getWidgetHandlers(dataset: Dataset, auth: AuthFunction, addDelay: boolean) {
  return {
    list: http.get<never, never, WidgetRead[], 'http://localhost:3000/api/v1/widgets'>(
      'http://localhost:3000/api/v1/widgets',
      async ({ request }) => {
        auth(request.headers, 'admin');
        const data = Object.values(dataset.widgets);
        await serverDelay(data.length, addDelay);
        return HttpResponse.json(data);
      },
    ),
  };
}

export const widgetHandlers = (dataset: Dataset, auth: AuthFunction, addDelay: boolean) =>
  Object.values(getWidgetHandlers(dataset, auth, addDelay));
```

## Generics and Types

Always annotate the handler with generics: `http.METHOD<Params, RequestBody, ResponseBody>(...)`.
Do not pass the path as a 4th generic argument — it is inferred from the first string parameter. Keep only the first three generic parameters typed.

Examples for a "Things" Endpoint:

- List
```
http.get<never, never, ThingRead[]>(
  'http://localhost:3000/api/v1/things',
  async ({ request }) => { /* auth(request.headers, 'admin') ... */ },
)
```

- Mine
```
http.get<never, never, ThingRead[]>(
  'http://localhost:3000/api/v1/things/mine',
  async ({ request }) => { /* auth(request.headers) ... */ },
)
```

- Detail
```
http.get<{ id: string }, never, ThingRead>(
  'http://localhost:3000/api/v1/things/:id',
  async ({ request, params }) => { /* ... */ },
)
```

- Create
```
http.post<never, Thing, ThingRead>(
  'http://localhost:3000/api/v1/things',
  async ({ request }) => { /* ... */ },
)
```

- Update
```
http.put<{ id: string }, Thing & { readonly id: string }, ThingRead>(
  'http://localhost:3000/api/v1/things/:id',
  async ({ request, params }) => { /* ... */ },
)
```

- Delete
```
http.delete<{ id: string }, never>(
  'http://localhost:3000/api/v1/things/:id',
  async ({ request, params }) => { /* ... */ },
)
```

## Auth and RBAC

- Use `auth(request.headers)` for routes accessible to both admin and end-users. RBAC checks (e.g., owner vs non-owner) must be handled within the handler.
- Use `auth(request.headers, 'admin')` for admin-only routes. This fails early with a standardized error — no extra checks needed.
- Do not access cookies directly. The `auth` helper returns a Session with `user.role` and `user.id`.
- If mocks are active, the Auth token that was returned from Entra ID is replaced with a serialized hero user object. This is then extracted in the auth() function.

Owner-check example (admin-or-owner):

```
const session = auth(request.headers);
const isAdmin = session.user.role === 'admin';
const userId = session.user.id!;
const isOwner = userId === thing.ownerId
if (!isAdmin && !isOwner) {
  return HttpResponse.json({ detail: 'Not authorized' }, { status: 403, statusText: 'Forbidden' });
}
```

## Errors and Delays

- Not found: `return HttpResponse.json(null, { status: 404, statusText: 'Not Found' })`.
- Unauthorized: `403` for RBAC failures inside handlers. Admin-only endpoints use `auth(request.headers, 'admin')` to fail early.
- Add small artificial latency using `serverDelay(sizeOr1, addDelay)`.

## Dataset Mutations

Mutations should update the dataset in-place. Maintain reverse indices to keep data consistent.

- Creating a Thing (example entity)
  - Add to `dataset.things[id]`.
  - Push `id` into owner arrays: `dataset.users_things[owner_id]`.

- Updating a Thing
  - Merge fields and update `updated_at`/`updated_by`.
  - If owners change, remove previous links and add new ones in `dataset.users_things`.

- Deleting a Thing
  - Remove id from owners in `dataset.users_things`.

## Path Conventions

- Always use absolute URL strings as the path argument (e.g., `'http://localhost:3000/api/v1/...')`. Do not pass the path as a generic type parameter; it’s inferred from the first argument.

## Do and Don’t

- Do:
  - Keep handlers concise and deterministic.
  - Use the types from `src/types` and keep response shapes identical to the real API.
  - Group related handlers and export as arrays.
- Don’t:
  - Read cookies directly or from `document.cookie` in these handlers.
  - Return shapes that differ from the real API.

---

