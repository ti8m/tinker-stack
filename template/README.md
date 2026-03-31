# PLANNING STACK TEMPLATE Frontend Monorepo

This monorepo is the default Tinker Stack starter for PLANNING STACK TEMPLATE.

It is intentionally lightweight:

- `@repo/prototype`: a minimal React Router prototype shell
- `@repo/api`: shared domain types and enums
- `@repo/docs`: Antora-based project documentation
- `@repo/mocks`: starter-safe mock-data package
- `@repo/msw`: starter-safe MSW package
- `@repo/ui`: shared UI primitives

## Build

Run commands from the repository root:

```bash
npm run build
npm run typecheck
npm run test
```

`npm run build:data` is available for the `@repo/mocks` package and succeeds even before you add
real generators.

## Development

Start the prototype and package watchers:

```bash
npm run dev
```

## Examples

Optional examples, when generated, live under `examples/<name>/`.

They are independent from this monorepo:

- they are not listed in the root workspaces
- they are not built by default Turbo commands
- they can be installed, run, or deleted separately

See the README inside each example directory for its own setup and copyable patterns.
