

## Local testing

To verify the generator before publishing:

1. Run `npm pack` in this repository to produce a tarball (for example `create-tinker-stack-0.2.9.tgz`).
2. Run the generator from this repository, passing a target directory as a positional argument:

```bash
npx --yes create-tinker-stack@file://$(pwd)/create-tinker-stack-0.2.9.tgz my-project
```

This scaffolds a clean starter into `./my-project`.

The example is placed in `my-project/examples/react-router/` and is independent of the root workspace.

### Notes

- `$(pwd)` must be run from the repository root where the tarball was produced.
- `npm create` does not currently support `file:` specifiers, so `npx` must be used.
- Omit the target directory argument to scaffold into the current working directory.
