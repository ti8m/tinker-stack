# React Router Example

This is the self-contained React Router example for Tinker Stack.

It preserves the original demo-oriented workspace, including:

- a richer prototype flow
- generated mock data
- MSW handlers wired to that dataset
- docs that describe the demo setup

## Run the example

Work inside this directory, not from the generated project root:

```bash
npm install
npm run build:data
npm run dev
```

## How to use it

This example is meant to be mined for patterns, not coupled to the main workspace.

Copy ideas selectively from:

- `prototype/` for routing, layouts, and UI flows
- `mocks/` for seeded dataset generation
- `msw/` for handler composition
- `api/` for shared response types

You can delete the entire example directory without affecting the generated root project.
