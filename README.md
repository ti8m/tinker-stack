# Tinker Stack

Tinker Stack is a project scaffold for frontend monorepos focused on rapid prototyping.

By default it generates a clean starter workspace with:

- a minimal React Router prototype shell
- shared `api`, `ui`, `msw`, and `mocks` packages
- Turborepo, TypeScript, ESLint, Prettier, and Antora wiring
- every example template copied into `examples/<name>/`

The scaffold no longer ships a demo application in the base workspace.

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

By default, all available examples are copied into `examples/<name>/` inside the generated project.
They are self-contained and can be deleted without affecting the main workspace.

## Example templates

The generator is designed for multiple named examples. Today the repository includes:

- `react-router`

Each example is installed and run separately from its own directory. The root project does not add example folders to its npm workspaces, so Turborepo ignores them by default.
