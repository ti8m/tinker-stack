# PLANNING STACK TEMPLATE Mock Data

This module contains a mock data generator for the PLANNING STACK TEMPLATE Web Project. Pseudorandom
data is generated using the [Faker JS Library](https://fakerjs.dev/).

NOTE: This repo builds only snapshot releases. Make sure you always install the latest version of
the package using the 'next' tag.

```bash
npm install @repo/mocks@next
```

Also make sure Vite does not cache the module.

```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@repo/mocks'],
  },
});
```

A full dataset export for medium and small size are exported separately and can be imported into
projects.

    import { medium } from '@repo/mocks/medium';

The Repository also exports msw 2 handlers for the mock data. The handlers can read the user data
from the request and return the correct data for the user. msw is a peer dependency of this package.

```typescript
// handlers.ts

import { stammdatenHandlers, auth } from '@repo/mocks/handlers';
import { medium } from '@repo/mocks/medium';

// Create handlers for the medium dataset and the provided auth function
export const handlers = [...stammdatenHandlers(medium, auth)];
```

The dataset is also built during CI and can be downloaded from the
[CI Pipelines page](https://gitlab.ti8m.ch/planning-stack-template/mocks/-/pipelines).

Download the latest Artifact:
[JSON](https://gitlab.ti8m.ch/planning-stack-template/mocks/-/jobs/artifacts/main/download?job=publish)
/
[JavaScript](https://gitlab.ti8m.ch/planning-stack-template/mocks/-/jobs/artifacts/main/download?job=build).

## Usage

NOTE: To get consistent data, there has to be one randomizer instance that is used exclusively for
the whole run and passed in as an argument to all generators. Never use a global Faker instance to
generate data.

The generator creates models that represent the data structure for the domain. Then the API
responses are inferred from these models.

The `buildDataset` method generates a complete dataset based on the provided configuration. There
are 3 pre-defined configurations in `datasetConfigs` that can be used:

- `small`: Generates a dataset with 7 organisations with up to 6 members each.
- `medium`: Generates a dataset with 7 organisations with up to 18 members each.
- `full`: Generates a dataset with all organisations with the true number of members each. (not
  implemented yet)

## Repo Structure

- cli: Command-Line tool to generate the dataset.
- src/data: Contains the Typescript exports for the small and medium dataset. The dataset is
  generated at import time.
- src/facts: Contains static data from other sources or enums.
- src/generators: Contains the Typescript code for the generated mock data.
