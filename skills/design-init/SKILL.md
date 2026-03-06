---
name: design-init
description: "Create or refresh `docs/DESIGN.md` for iterative UI work on an existing repository. Use only when the user explicitly asks to set up, initialize, create, refresh, or update repo design context before design iteration. This skill owns design-context generation and refresh only; it does not perform the later design, review, or polish work."
---

Create or refresh repo UI context in `docs/DESIGN.md` so later design work can start from one grounded source of truth.

## Trigger Rules

Use this skill only when the user explicitly asks to create or refresh design context, for example:
- "Set up design context for this repo."
- "Create the design md before we iterate."
- "Refresh design context from current code."
- "Update the design md."
- "Init design context."
- "Init design md."
- "Update design context."
- "Update design md."

If the user did not explicitly ask for context creation or refresh, do not rewrite `docs/DESIGN.md`.

## Scope

Own only the context document setup and refresh workflow.

Do not:
- redesign the interface
- critique the interface
- polish the interface
- silently regenerate context during ordinary design work

After context exists, later iterative design tasks should read `docs/DESIGN.md` first and then use the appropriate design skill.

## Output Contract

Write context to `docs/DESIGN.md` in the project root.

Use no alternative output path.

If `docs/DESIGN.md` is missing, create it only when explicitly requested.

Distinguish these operations:
- `init design context` or `init design md`: create `docs/DESIGN.md` if missing and populate the required context sections
- `update design context` or `update design md`: refresh the required context sections in `docs/DESIGN.md` from current repo sources

## Required Sections

Always ensure `docs/DESIGN.md` contains:
- `Component Context`
- `Layout Context`
- `Route Context`
- `Theme and Token Context`

When `docs/DESIGN.md` already exists, keep these sections aligned:
- `Design System Map`
- `Component Context`
- `Layout Context`
- `Route Context`
- `Theme and Token Context`
- `Context Refresh Contract`
- `Validation Notes`

## Context Format

Keep context practical and high-signal. Make it more than an index, but do not turn it into full code dumps.

For each high-value entry, include:
- path
- purpose or ownership
- key contracts and dependencies
- interaction risks
- targeted excerpts with source path and line anchors

Use these excerpt limits:
- 8-30 lines per snippet
- 3-8 snippets per high-value entry

Use pointer-only entries for low-risk boilerplate.

## Context Extraction Rules

Include context for:
- the target page or feature files
- shared layouts used by that page
- reusable UI primitives used by that page
- global styles and theme/token sources

Keep inclusion practical and relevant. Do not require exhaustive repo-wide file coverage.

### Component Context

Capture shared or reusable UI primitives and major feature components.

For each component, include:
- purpose
- key exports or APIs
- dependencies
- interaction risks
- targeted snippets with anchors

### Layout Context

Capture shared layout wrappers and shells such as app layouts, nav, headers, sidebars, and footers.

For each layout, include:
- ownership boundaries
- route and surface contracts
- risky geometry or inset behavior
- targeted snippets with anchors

### Route Context

Capture:
- route map with path, file, and layout relation
- navigation contracts and route ownership notes
- risky transitions and cross-stack openings

### Theme and Token Context

Capture the project’s current design system as implemented, with high signal and low context bloat.

Extract concrete token values and the minimum supporting snippets from:
- CSS variable definitions such as `:root`, theme selectors, and `data-theme` blocks
- global stylesheets such as `globals.css`, `index.css`, and app-level styles
- theme or config files such as `tailwind.config.*`
- theme provider or token source files

Capture at minimum:
- color tokens and semantic roles
- typography including families, sizes, weights, and line heights
- spacing scale
- radius and border tokens
- shadow or elevation tokens
- breakpoints or layout tokens
- motion tokens such as durations and easing when defined

Under `Theme and Token Context`:
- include source file paths per token section or subsection
- include resolved token values and semantic mapping
- avoid inferred values when raw values are available
- avoid full file dumps by default
- include token tables and focused snippets where helpful

When a token or behavior is ambiguous, include targeted excerpts only:
- 8-30 lines per snippet
- source path plus line anchor

Do not paste entire files unless the user explicitly asks for full dumps.

## Read Rule

For later iterative design tasks:
- read `docs/DESIGN.md` first when it exists
- regenerate context only when the user explicitly requests it

## Refresh Rule

Refresh `docs/DESIGN.md` only when explicitly requested, and especially when:
- theme files changed in the area being worked on
- a new design iteration starts on a different area
- visual mismatches suggest token drift

Do not silently refresh context during unrelated design work.

## Validation Notes

Before finishing, confirm that:
- output is written only to `docs/DESIGN.md`
- the required sections are present
- the aligned sections remain in sync when the file already exists
- excerpts stay within the snippet size rules
- low-value files are pointer-only
- raw token values are used when available instead of approximations

## Boundaries

- Use this skill to create or refresh design context.
- Use other design skills to implement, review, or polish the UI after the context file is ready.
