

## Local testing

To verify the generator before publishing:

1. Run `npm pack` in this repository to produce a tarball (for example `create-tinker-stack-0.2.11.tgz`).
2. Run the generator from this repository, passing a target directory as a positional argument:

```bash
npx --yes create-tinker-stack@file://$(pwd)/create-tinker-stack-0.2.11.tgz my-project
```

This scaffolds a clean starter into `./my-project` with the example bundles.

The generator prompts for the app title. To run fully non-interactive (for scripts and CI), pass the title as a flag:

```bash
npx --yes create-tinker-stack@file://$(pwd)/create-tinker-stack-0.2.11.tgz --title "My Project" my-project
```

Setting the `CI` environment variable also skips the prompt and falls back to the title `Demo Title`.

The example is placed in `my-project/examples/react-router/` and is independent of the root workspace.

### Notes

- `$(pwd)` must be run from the repository root where the tarball was produced.
- `npm create` does not currently support `file:` specifiers, so `npx` must be used.
- Omit the target directory argument to scaffold into the current working directory.
