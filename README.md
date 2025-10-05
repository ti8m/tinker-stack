# Frontend Monorepo for Rapid Prototyping

This is a [npm Template](https://remix.run/docs/en/main/guides/templates) for a Frontend Monorepo. 

It puts emphasis on rapid prototyping and a prototype-driven development
([Pixar Planning](https://www.youtube.com/watch?v=gbuWJ48T0bE&t=1294s)).

## What is included?

This monorepo contains the following packages/apps:

### Apps and Packages

- A prototype for the application, based on React Router SPA.
- A package that provides the domain types and enums.
- A documentation in Antora (AsciiDoc) format.
- A package that provides synthetic data for the applications using
  [Faker.js](https://fakerjs.dev/).
- A package that provides a mock API via service workers using [MSW](https://mswjs.io/).
- A component library that is shared by the main application and the prototype.
- ESLint and TypeScript configurations that are shared throughout the monorepo.

### Features

- Monorepo based on ESM standards.
- Turborepo for building and running the monorepo.
- Pre-Configured CI Pipeline for Gitlab CI.
- Continuous deployment for the prototype and preview environments for merge-requests.
- Automatic deployment of the documentation to Gitlab Pages.
- Code formatting with [Prettier](https://prettier.io/) and linting with
  [ESLint](https://eslint.org/).

Each package/app is written in [TypeScript](https://www.typescriptlang.org/).

The prototype is automatically deployed to a preview server on a push to the `main` branch or a
tagged commit.

## Documentation

The developer documentation is located in the `docs` folder. It is automatically published via
Gitlab Pages.

The project documentation is written in [AsciiDoc](https://asciidoctor.org/) and is generated using
[Antora](https://antora.org/).

## Getting Started

To get started, run the following command:

```bash
npx create tinker-stack
```
