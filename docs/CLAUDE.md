# Project conventions

## Refactor principles
- Keep `renderer.js` as a thin bootstrap and event-coordination layer.
- Preserve existing business logic and UI behavior unless a change is explicitly requested.
- Prefer extracting pure helpers and small binding helpers before moving larger feature blocks.
- Keep feature-specific DOM wiring close to the feature it serves.

## Renderer guidance
- Use small functions with single responsibilities.
- Reuse existing utility modules under `src/renderer/utils/` when possible.
- For renderer refactors, prefer extracting pure formatting/sorting/grouping/request-building helpers before moving DOM bindings.
- Avoid introducing new global state unless it is shared across multiple existing flows.
- When binding DOM events, guard for missing nodes and keep handlers idempotent.

## Validation
- After renderer refactors, run lint/validation on modified files and fix introduced issues before wrapping up.
