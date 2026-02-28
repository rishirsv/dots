# Design init and repo UI context

Use this when the task is iterative design on an existing repo UI.

This guide keeps all design context consolidated in `docs/DESIGN.md` so high-level policy and repo-grounded evidence stay in one file.

## Explicit trigger phrases (natural language)

Create or refresh design context only when the user explicitly asks, for example:
- "Set up design context for this repo."
- "Create the design md before we iterate."
- "Refresh design context from current code."
- "Update the design md."

If the user did not explicitly ask, do not rewrite context sections.
Use these commands only when the user asks for context generation or refresh:
- `init design context` or `init design md`: create `docs/DESIGN.md` if missing and populate required context sections.
- `update design context` or `update design md`: refresh required context sections in `docs/DESIGN.md` from current repo sources.

## Output location

Write context to `docs/DESIGN.md` in the project root.

Required context sections:
- `Component Context`
- `Layout Context`
- `Route Context`
- `Theme and Token Context`

## Sync contract

When `docs/DESIGN.md` exists, keep these sections aligned:
- `Design System Map`
- `Component Context`
- `Layout Context`
- `Route Context`
- `Theme and Token Context`
- `Context Refresh Contract`
- `Validation Notes`

If `docs/DESIGN.md` is missing, create it only when explicitly requested.

## Hybrid context format (required)

Context should be more than an index, but not full code dumps.

For each entry, include:
- path
- purpose/ownership
- key contracts and dependencies
- interaction risks
- targeted code excerpts (small, high-signal snippets) with source path + line anchors

Default excerpt size:
- 8-30 lines per snippet
- 3-8 snippets per high-value entry

Use pointer-only entries for low-risk boilerplate.

## What each section must contain

### `Component Context`
- Shared/reusable UI primitives and major feature components.
- For each component:
  - purpose
  - key exports/APIs
  - dependencies
  - interaction risks
  - targeted snippets with anchors

### `Layout Context`
- Shared layout wrappers and shells (app layout, nav, header, sidebar, footer).
- For each layout:
  - ownership boundaries
  - route/surface contracts
  - risky geometry/inset behavior
  - targeted snippets with anchors

### `Route Context`
- Route map: path, file, layout relation.
- Navigation contracts and route ownership notes.
- Risky transitions and cross-stack openings.

### `Theme and Token Context`
- Token and design-system digest (see `design-token-sync.md`).
- Keep raw-value fidelity, but avoid full file dumps by default.
- Include token values and focused snippets for global styles/config sources.

## Read rule

For iterative design tasks:
- Read `docs/DESIGN.md` first when it exists.
- If context is stale or missing, regenerate only when explicitly requested by the user.

## Context usage

When preparing design analysis or reproduction, include context for:
- target page/feature file(s)
- shared layouts used by that page
- reusable UI primitives used in that page
- global styles and theme/token sources

Keep context practical and relevant. Do not require exhaustive repo-wide file inclusion.
