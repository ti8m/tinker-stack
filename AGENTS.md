# Repository Guidelines

Refer to the README.md for information about this repository.

## Project Structure & Module Organization
`create/` contains the Node-based scaffold (`index.js` normalizes CLI options, `main.js` mutates the template). `template/` ships the starter monorepo with workspaces such as `api/` for backend endpoints, `mock-backend/` and `mock-data/` for fixtures, `prototype/` for the prototype app, `ui/` for shared components, and `docs/` for the Antora documentation site. Shared lint and TS configs live in `template/config/`, and bootstrap assets for generated apps sit under `template`.

## Build, Test & Development Commands
Use Node 22+. Run `npm install` at the repo root before touching the CLI. Template work happens inside `template/`: `npm install` for dependencies, `npm run dev` to launch Turbo-powered development, `npm run build` for a production check, `npm run typecheck` for repository-wide TypeScript validation, `npm run test` to execute Vitest suites, and `npm run format` to apply Prettier across Markdown and TypeScript files.

## Coding Style & Naming Conventions
Prettier enforces two-space indentation, single quotes, and trailing commas (`npm run format`). Keep imports auto-organized by the Prettier organize-imports plugin. Use `camelCase` for variables and functions, `PascalCase` for React components and types, and kebab-case for file names (e.g., `generate-data.mjs`). ESLint rules from `template/config/eslint/` run in every workspace—resolve warnings or document exceptions in-code.

## Testing Guidelines
Vitest handles unit and integration coverage; colocate specs as `*.test.ts` or `*.spec.ts`. Run `npm run test` for the full suite, or target a package with `npm run test -- --filter=@repo/ui`. Always follow tests with `npm run typecheck` before opening a PR, and extend coverage around generators (`mock-data/cli`) and UI behavior when adding features.

## Commit & Pull Request Guidelines
Mirror the existing history by writing concise, imperative subjects (`add build verification for Github`). Group logically related changes per commit. Pull requests must include a summary, testing notes (`npm run build`, `npm run test`, etc.), linked issues when applicable, and screenshots for UI updates.

## Setup & Configuration Notes
The scaffold copies `.env.example` to `.env` and swaps `planning-stack-template` tokens; keep those references in sync when editing template assets. Honor the `SKIP_SETUP` and `SKIP_FORMAT` flags in `create/main.js` so automated flows remain consistent. Update every consumer (e.g., `template/gitlab-ci.yml`) when adjusting CI scaffolding.
