# Mocks – Agent Guide

This guide explains how the mock dataset under `mock-data/` is structured, how to extend it for new entities/fields, and how to keep it deterministic and aligned with the real API. These mocks power both MSW handlers (dev and tests) and the optional JSON snapshot CLI.

Related docs
- `../mock-backend/AGENTS.md` — MSW handler conventions and RBAC patterns.
- `../AGENTS.md` — project overview and how mocks are used.
- `./README.md` — ERD and API Models; authoritative schema reference for mocks.

See the root AGENTS.md for the role of mocks in local dev and tests. This document focuses on how to create and maintain the generators themselves.

## Goals

- Deterministic, realistic sample data with Faker.
- Type-safe and aligned with `src/types/*` shapes returned by the real API.
- Referential integrity between entities and reverse indices preserved.
- Simple knobs to control dataset size, seed, and reference date.

## Folder Overview

- `src/generators/config.ts`: dataset presets and the `DatasetConfig` type. Control size, seeding, and reference date.
- `src/generators/dataset.ts`: `buildDataset(config)` orchestrates end-to-end data creation and assembles indices.
- `src/generators`: pure, per-entity generators.
- `facts`: static catalogs (hero users, model names, endpoint bases) used across generations.
- `types.ts`: mock-local types not present in `src/types/*` (e.g., `EntraUser`).
- `utils.ts`: small helpers (e.g., `today()` zeroed to midnight for stable dates).
- `cli/generate-data.ts`: CLI to write JSON snapshots under `mocks/data-mocks/` for manual review.
- `data-mocks/`: optional generated snapshots, not used by the app at runtime.

## Quick Start

- Build a dataset in code (used by MSW):
  - `import { buildDataset, datasetConfigs } from '@/mock-data'` then `const { data } = buildDataset(datasetConfigs.medium)`.
- Run dev server with MSW-based mocks: `npm run dev:mocks`.
- Generate a JSON snapshot (manual inspection only):
  - `npm run generate:small`
  - or `npx tsx mock-data/cli/generate-data.ts -d medium -s 42 -o mock-data/data-mocks/mock-data.<size>.json`

## Determinism and Seeding

- `buildDataset(config)` uses Faker with a `Randomizer` and optional `seed`. Provide one for reproducible datasets.
- `refDate` (in presets) anchors all time-dependent Faker calls for stability across runs.
- If you need purely random runs, omit both `seed` and `refDate` and pass a custom `randomizer` if needed.

## Dataset Shape and Indices

`Dataset` (in `dataset.ts`) stores flat maps plus reverse indices for joins:

- Entities: `Thing` <TODO: Add entities here>.
- Reverse indices:
  - `users_things: Record<userId, subscriptionId[]>`

When mutating or extending the dataset, always keep the indices in sync. MSW handlers rely on these to serve list/detail endpoints efficiently.

## Generators – Authoring Guidelines

- Keep generators pure: they should only use the provided `faker` and arguments to return a typed value.
- Use domain read types from `src/types/*` for outputs (e.g., `ThingRead`) where possible. Otherwise, create custom types in `mock-data/types.ts`.
- Respect API invariants and optionals:
  - Example: optional entries should sometimes be `undefined`.
- Use `UniqueEnforcer` (already wired in `dataset.ts`) for fields that must be unique.
- Timestamps: prefer `created_at` <= `updated_at` <= `now/refDate` patterns. Use `faker.date.between({ from, to })` to keep order valid.
- Cross-entity coherence: generate IDs first, then derive relationships.

## Orchestration – `buildDataset`

- Users: creates two “hero” users from `static.ts` (`admin`, `user`) and fills the remainder with Faker.
- TODO: Add more hints here.

If you add new entities or relationships, follow the same pattern: create base catalogs in `static.ts` (if needed), generate entities, then compute derived relationships and reverse indices in a single pass to avoid inconsistencies.

## Presets – `config.ts`

- `DatasetConfig` supports:
  - `seed` and `refDate` for determinism; or a custom `randomizer`.
  - Size knobs: Tune these only when necessary for performance or demo fidelity.
- When changing presets, ensure MSW dev config still behaves well (see `msw/dev-handlers.ts` which uses `datasetConfigs.medium`).

## Extending the Mocks – New Entity Checklist

1. Types first
   - Add zod/TS types under `src/types/<entity>.ts` (Read/Write shapes).
   - Reuse API-level types for generator outputs (e.g., `<Entity>Read`).
2. Generator
   - Implement `generate<Entity>({ faker, ...deps })` in `mocks/generators.ts`.
   - Ensure required foreign keys are passed in or computable.
3. Static catalogs (optional)
   - If the entity has a fixed base set (like model names or endpoint bases), add a list to `mock-data/src/facts/static.ts`.
4. Dataset assembly
   - Extend `Dataset` in `mock-data/src/generators/dataset.ts` with new maps and necessary reverse indices.
   - Update `buildDataset` to generate, link, and index the new entity consistently.
5. MSW handlers
   - Add or update handlers in `msw/*.ts` to expose list/detail/mutations using the new dataset fields. See `msw/AGENTS.md` for conventions.
6. CLI output (optional)
   - Snapshots automatically include anything in `data`. No CLI changes needed unless you add CLI flags.

## Maintaining and Evolving Fields

- Add a field to an entity
  - Update `src/types/*` first; adjust generators to produce realistic values.
  - If the field is relational, update `Dataset` maps/indices and the assembly logic.
  - Update MSW handlers to read/write the field on mutations.
- Rename/remove a field
  - Change `src/types/*`, fix generators and any code in `dataset.ts` referencing it.
  - Consider a transitional period where generators output both old and new data only if MSW/test code requires it; otherwise, prefer a straight rename.
- Optional booleans/dates
  - Randomize presence with a clear probability (e.g., `faker.datatype.boolean({ probability: 0.3 })` for optional dates) to surface varied UI states.

## Quality and Performance

- Keep functions small and side-effect free; orchestration goes in `buildDataset`.
- Be mindful of the `full` preset size; it is for stress testing, not for default dev.
- Avoid heavy computations in per-entity generators; precompute sets/lists in `buildDataset` and pass them down.

## Common Pitfalls

- Forgetting reverse index updates when adding relationships (leads to empty lists in MSW routes).
- Using ad-hoc shapes instead of `src/types/*` (breaks type safety and handler consistency).
- Reading current time directly; prefer `faker.setDefaultRefDate(refDate)` and `today()` for stable scenarios.
- Returning fields that only exist in write payloads or server-only flows (e.g., secret key material).

## Examples

Add examples here

---

For handler conventions and RBAC patterns, see `mock-backend/AGENTS.md`. For how mocks integrate into the app and tests, see the root `AGENTS.md` (sections 2.3–2.5).
