


## Local testing

To verify the generator before publishing:

1. Run `npm pack` in this repository to produce a tarball (for example `create-tinker-stack-0.2.6.tgz`).
2. In a temporary directory, execute `npx --yes create-tinker-stack@file://$(pwd)/create-tinker-stack-0.2.6.tgz`.
    - Replace the path with the absolute path to the tarball from step 1 (npm `create` does not currently support `file:` specifiers).
