# Frontend Monorepo for Rapid Prototyping

This is a npm Template for a Frontend Monorepo. 

It puts emphasis on rapid prototyping and a prototype-driven development
([Pixar Planning](https://www.youtube.com/watch?v=gbuWJ48T0bE&t=1294s)).

The prototypes are using a virtual and ephemeral backend, so changes can be made very quickly without any need for
data migrations on schema changes.

Stakeholders can test a fully working UI before a single line of backend code has been written.

Test UI concepts on day 1, iterate on them with the designer on day 2 and present them to the customer on day 3.

The API to the backend has usually had several major iterations before a backend developer even gets involved.

## What is included?

This monorepo contains the following packages/apps:

### Apps and Packages

- A prototype for the application, based on React Router SPA.
- A package that provides the domain types and enums that can be shared with the backend.
- A documentation in [Antora](https://antora.org/) (AsciiDoc) format.
- A package that provides synthetic data for the applications using
  [Faker.js](https://fakerjs.dev/).
- A package that provides a mock API via service workers using [MSW](https://mswjs.io/).
- A component library that is shared by the main application and the prototype (still empty).
- ESLint and TypeScript configurations that are shared throughout the monorepo.

### Features

- [TypeScript](https://www.typescriptlang.org/) Monorepo based on ESM standards.
- Turborepo setup for building and running the monorepo.
- Code formatting with [Prettier](https://prettier.io/) and linting with
  [ESLint](https://eslint.org/).

## Documentation

The project documentation is written in [AsciiDoc](https://asciidoctor.org/) and is generated using
[Antora](https://antora.org/).

## Getting Started

To get started, run the following command:

```bash
npm create tinker-stack@latest
```

This will create a new project based on the Tinker Stack.
