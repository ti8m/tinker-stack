# Example Project Toggle Spec

## Background
- The generator `create/main.js` copies the entire `template/` workspace into the target directory and immediately runs setup commands, producing a project pre-populated with demo data and demo UI flows.
- Removing the example today requires deep edits across `prototype`, `mock-backend`, and `mock-data`, plus updates to docs and build scripts. Developers struggle to strip the demo without breaking interconnected references to demo APIs, dataset builders, and MSW handlers.
- Goal: ship a clean, empty project by default while preserving the current demo as an opt-in bundle.

## Current Template State
- **Prototype (`template/prototype`)**
  - Routes are hard-wired to demo screens (`app/routes.ts` routing into `app/demo/*.tsx`, e.g. `dashboard.tsx`, `employees.tsx`) that assume MSW demo endpoints.
  - Root loader/action logic (`app/root.tsx`) fetches demo user data (`DemoApi` from `app/demo/api.ts`) and renders demo-specific login buttons, navigation, and layout.
  - Local MSW setup (`app/mocks/handlers.ts`) imports `@repo/mock-backend/medium` so the app only works with the demo dataset.
- **Mock backend (`template/mock-backend/src`)**
  - Provides dataset-bound handlers (`handlers/demo.ts`) and dataset presets (`medium`, `full`) that generate demo responses by reading demo dataset indices.
  - Auth utilities (`auth.ts`) expect JWT payloads populated by the demo dataset.
- **Mock data (`template/mock-data`)**
  - Dataset generator (`src/generators/dataset.ts`) creates seeded data for companies, persons, roles, and auth tokens that power demo flows.
  - CLI (`cli/generate-data.mjs`) and published JSON fixtures (`data-mocks/*.json`) serialize the demo dataset in small/medium/full sizes.
- **Generator behavior**
  - `create/main.js` blindly copies `template/` and replaces tokens, so the default scaffold always contains demo code, fixtures, and run scripts that assume the dataset can build immediately.
  - Automated tests (`tests/generator.test.mjs`) assert that the generated project can run `npm run build:data` and `npm run build`, implicitly relying on demo assets.

## Desired Behavior & Requirements
1. **Empty project by default**
   - Generated workspace should have the same package layout but with neutral starter files: prototype is a skeleton shell, mock backend/data contain minimal no-op implementations (or are omitted) so new teams can build from scratch.
   - Default `npm run build`, `npm run typecheck`, and other scripts must succeed without demo data.
2. **Opt-in example bundle**
   - Introduce a generator flag (e.g. `--with-example`, `withExample` option from `npm init`) that copies the existing demo content into a sibling `example/` directory _inside_ the generated project.
   - The `example/` directory should mirror the current template structure (`prototype`, `mock-data`, `mock-backend`, etc.) so teams can browse or copy patterns without polluting the main workspace.
   - Example assets should remain runnable in-place (document how to install & build the example).
   - It must be possible to delete the example directory without breaking any dependencies.
3. **Flag plumbing**
   - Update argument normalization in `create/index.js` so CLI flags / `npm init` options expose `withExample` (boolean).
   - Modify `create/main.js` to:
     - Copy the slim template into the project root.
     - When `withExample` is true, additionally copy the rich demo tree into `targetDir/example`.
     - Ensure environment token replacement, dependency installs, and format commands only touch the base project; example content can be left untouched or bootstrapped separately per spec decisions.
4. **Documentation & DX**
   - Document the new flag and default-empty behavior in `README.md` (both repository root and generated template readmes as needed).
   - Provide guidance inside `example/README.md` (new or repurposed) explaining how to run the demo and what parts can be copied into the main app.
5. **Testing & automation**
   - Expand `tests/generator.test.mjs` (or add new cases) to cover:
     - Default scaffold produces empty baseline and still passes install/typecheck/build (with updated expectations).
     - `--with-example` scaffolds the extra directory and preserves demo assets (spot-check key files or run targeted commands if feasible).
   - Ensure CI steps or scripts that assume demo data are updated or gated behind the flag.

## Implementation Notes & Work Items
- Refactor template content:
  - Extract current demo sources (`prototype/app/demo`, associated context providers, MSW handlers, dataset generation, mock backend handlers, `mock-data` presets) into a new source tree destined for `example/`.
  - Introduce lightweight placeholders in the base template: e.g., a blank `prototype` with a single welcome page, stubbed mock-data scripts that return empty structures, and no prebuilt JSON fixtures.
  - Decide whether base template should keep mock packages at all (empty package with placeholder README) vs. omit them; ensure workspaces remain valid.
- Update generator copy logic:
  - Allow copying multiple source roots (base template and example bundle) while respecting existing token replacement (app name/title) without touching example content unless required.
  - Consider deduplicating shared config (eslint/tsconfig) so both base and example can reuse it without duplication.
  - Guard install/format steps when `withExample` is used (e.g., do not attempt to install dependencies inside `example/` unless explicitly desired).
- Data & auth considerations:
  - Empty project should not ship demo JWT payloads or auth stubs; evaluate whether to include a minimal `auth` scaffold or leave instructions for developers to implement.
  - When `withExample` is chosen, ensure dataset presets and JSON outputs remain accessible (copy existing `data-mocks/*.json`).
- Migration of docs & scripts:
  - Audit references to demo flows in `template/docs` and update to reflect new optional example.
  - Update `README` badges, quick-start instructions, and `docs/modules/ROOT/pages` to describe both baseline and example usage.
- Ensure `npm run build:data` and related scripts degrade gracefully when the dataset is empty (either no-op or produce placeholder files).

## Open Questions
- Should the CLI prompt the user interactively about including the example when running without `--with-example`?
- Should the example directory be completely independent (own package.json/turbo config), or share the monorepo root and rely on workspaces?
- Do we need to ship prebuilt mock JSON for the empty template (e.g., empty arrays) to satisfy downstream tooling?
- How do we handle token replacement inside the example bundle—do we mirror replacements there or leave the original `planning-stack-template` strings?

## Validation Plan
- Run generator default path with `SKIP_SETUP=1` to ensure scaffolding succeeds and key files contain the expected placeholders.
- Run generator with `--with-example`, install dependencies, and verify both the base project and the `example/` bundle can execute `npm run build:data`, `npm run build`, and `npm run dev` (document which commands should run where).
- Add automated test coverage for the new flag and update snapshots/expectations accordingly.
- Confirm lint/typecheck/build commands in the repository (root) remain green after restructuring template assets.
