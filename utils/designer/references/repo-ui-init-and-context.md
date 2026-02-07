# Repo UI init and context files

Use this when the task is iterative design on an existing repo UI.

## Commands

- `init design context`: create `.design/` and generate all required context files.
- `update design context`: refresh all `.design/*.md` files from current repo sources.

## Output location

Write context files to `.design/` in the project root.

Required files:
- `.design/components.md`
- `.design/layouts.md`
- `.design/routes.md`
- `.design/theme.md`

## What each file must contain

### `.design/components.md`
- Shared/reusable UI primitives and building blocks.
- File path + short note + full source code blocks.

### `.design/layouts.md`
- Shared layout wrappers and shells (app layout, nav, header, sidebar, footer).
- File path + short note + full source code blocks.

### `.design/routes.md`
- Route map: path, file, layout relation.
- Include router config content when present.

### `.design/theme.md`
- Full token/theme extraction (see `design-token-sync.md`).
- Include raw file content for global styles/config sources.

## Mandatory read rule

For every iterative design task:
- Read all four `.design/*.md` files before diagnosing or proposing design changes.
- If files are missing or stale, regenerate before continuing.

## Context-file usage

When preparing design analysis/reproduction, always attach context files for:
- Target page/feature file(s)
- Shared layouts used by that page
- Reusable UI primitives used in that page
- Global styles and theme/token sources

Keep context practical and relevant. Do not require exhaustive repo-wide file inclusion.
