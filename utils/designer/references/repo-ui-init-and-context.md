# Repo UI init and context files

Use this when the task is iterative design on an existing repo UI.

## Explicit trigger phrases (natural language)

Generate or refresh `.design/*` only when the user explicitly asks, for example:
- "Set up design context files for this repo."
- "Create the `.design` context docs before we iterate."
- "Refresh the design context files from current code."
- "Update the `.design` context."

If the user did not explicitly ask, do not write `.design/*` files.

## Output location

Write context files to `.design/` in the project root.

Required files:
- `.design/components.md`
- `.design/layouts.md`
- `.design/routes.md`
- `.design/theme.md`

## Shared metadata format

Each `.design/*.md` file should include:
- `generated_at: <ISO timestamp>`
- `stale_when: <condition>`

Do not include a `sources_scanned` field.

## Hybrid context format (required)

The context files should be more than an index, but not full code dumps.

For each entry, include:
- path
- purpose/ownership
- key contracts and dependencies
- interaction risks
- targeted code excerpts (small, high-signal snippets) with source path + line anchors

Default excerpt size:
- 8-30 lines per snippet
- 3-8 snippets per file entry

Use pointer-only entries for low-risk boilerplate.

## What each file must contain

### `.design/components.md`
- Shared/reusable UI primitives and major feature components.
- For each component:
  - purpose
  - key exports/APIs
  - dependencies
  - interaction risks
  - targeted snippets with anchors

### `.design/layouts.md`
- Shared layout wrappers and shells (app layout, nav, header, sidebar, footer).
- For each layout:
  - ownership boundaries
  - route/surface contracts
  - risky geometry/inset behavior
  - targeted snippets with anchors

### `.design/routes.md`
- Route map: path, file, layout relation.
- Navigation contracts and route ownership notes.
- List risky transitions and cross-stack openings.

### `.design/theme.md`
- Token and design-system digest (see `design-token-sync.md`).
- Keep raw-value fidelity, but avoid full file dumps by default.

## Mandatory read rule

For iterative design tasks:
- Read all existing `.design/*.md` files first when present.
- If files are missing or stale, only regenerate when explicitly requested by the user.

## Context-file usage

When preparing design analysis or reproduction, include context for:
- target page/feature file(s)
- shared layouts used by that page
- reusable UI primitives used in that page
- global styles and theme/token sources

Keep context practical and relevant. Do not require exhaustive repo-wide file inclusion.
