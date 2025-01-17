# Frontend Monorepo for Rapid Prototyping

This is a [Remix Template](https://remix.run/docs/en/main/guides/templates) for a Frontend Monorepo.
It puts emphasis on rapid prototyping and a prototype-driven development
([Pixar Planning](https://www.youtube.com/watch?v=gbuWJ48T0bE&t=1294s)).

## What is included?

This monorepo contains the following packages/apps:

### Apps and Packages

- A prototype for the application, based on React Router SPA.
- A package that provides the domain types and enums.
- A documentation in Antora format with automatic deployment to Gitlab Pages.
- A package that provides synthetic data for the applications.
- A package that provides a mock API via service workers.
- A basic React component library shared by the main application and the prototype.
- ESLint and TypeScript configurations that are shared throughout the monorepo.
- Turborepo for building and running the monorepo.

Each package/app is written in [TypeScript](https://www.typescriptlang.org/).

The prototype is automatically deployed to a preview server on a push to the `main` branch or a
tagged commit.

## Documentation

The developer documentation is located in the `docs` folder. It is automatically published via
Gitlab Pages.

The project documentation is written in [AsciiDoc](https://asciidoctor.org/) and is generated using
[Antora](https://antora.org/).

## Getting Started

To get started, download the template from Gitlab

https://gitlab.ti8m.ch/bao/tinker-stack/-/archive/main/tinker-stack-main.tar.gz

Then run the following command:

```bash
npx create-remix@latest --template ~/Downloads/tinker-stack-main.tar.gz
```

TODO: Update the URL once the template is published to Github.
