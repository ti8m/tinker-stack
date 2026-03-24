# PLANNING STACK TEMPLATE Mock Data

This package is a starter-safe placeholder for generated mock data.

By default the base scaffold exports an empty dataset so `npm run build:data` works before you have
defined any domain entities.

## Usage

- Replace `src/generators/config.ts` with the presets that make sense for your product.
- Replace `src/generators/dataset.ts` with your real data generation logic.
- Run `npm run generate:small` or `npm run generate:medium` to write JSON snapshots under
  `data-mocks/`.

If you want a full worked example, scaffold one of the optional example templates and inspect its
`mocks/` package separately.
