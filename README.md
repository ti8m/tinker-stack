# Tinker Stack

A monorepo template for prototype-driven development.

> You have got to start with the customer experience and work backwards to the technology.
>
> — Steve Jobs

## Prototype-driven development

Tinker Stack scaffolds a frontend monorepo that starts from the customer experience and works backwards to the technology. You ship a clickable prototype first: shared domain types, synthetic data, and a mock API. Stakeholders exercise a working UI before any backend exists. Schema changes stay cheap because the backend is virtual and ephemeral — no migrations.

Typical cadence: test a UI concept on day 1, iterate with design on day 2, present to the customer on day 3. The API has usually gone through several major iterations before a backend developer is involved. Validated flows, types, and UI primitives then move into the production application instead of being thrown away.

The workflow is framework-agnostic. Shared packages (`api`, `mocks`, `msw`, `docs`) do not depend on a UI framework. The default example ships a React Router SPA prototype; replace it with any frontend stack.

### Apps and packages

- A prototype for the application, based on React Router SPA (replaceable).
- A package that provides the domain types and enums.
- Documentation in [Antora](https://antora.org/) format with automatic deployment to GitLab Pages.
- A package that provides synthetic data for the applications.
- A package that provides a mock API via service workers.
- A React component library shared by the main application and the prototype.
- ESLint and TypeScript configurations that are shared throughout the monorepo.
- [Turborepo](https://turbo.build/repo) for building and running the monorepo.

The generator produces a clean starter workspace. 

## Create a project

```bash
npm create tinker-stack@latest
```

To generate the base workspace without any example folders:

```bash
npm create tinker-stack@latest -- --no-examples
```

To generate only specific example templates:

```bash
npm create tinker-stack@latest -- --example react-router
```

To run fully non-interactive, pass the app title with `--title` (the only value that is otherwise prompted for):

```bash
npm create tinker-stack@latest -- --title "My App" my-app
```

By default, all available examples are copied into `examples/<name>/` inside the generated project.
They are self-contained and can be deleted without affecting the main workspace.

## Example templates

The generator is designed for multiple named examples. Today the repository includes:

- `react-router`

Each example is installed and run separately from its own directory. The root project does not add example folders to its npm workspaces, so Turborepo ignores them by default.
