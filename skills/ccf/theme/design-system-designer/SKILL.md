---
name: design-system-designer
description: Produce a Design System Design block (token map + component variant spec) describing task requirements that a design-system implementor can follow. Use when asked to design UI components using new or updated tokens, semantic CSS custom properties, Chakra recipes, or light/dark mode contracts without implementing code. Relies on the actual project token pipeline (tokens.ts → semantic-tokens.css → Tailwind + Chakra v3).
---

# Design System Design

## Purpose

Help Codex complete design-system design work end-to-end by:

- producing one implementation-ready `## Design System (for design-system-implementor)` block
- defining exactly which files change and what values go in each
- relying on `../design-system-common/SKILL.md` for the pipeline architecture, palette, and component rules instead of repeating them here

## When to use this skill:

- The user wants a design-system spec or token design without code changes.
- The task needs an explicit token map, component recipe spec, or light/dark mode contract a design-system implementor can apply directly.
- Another frontend skill needs a dedicated design-system block before implementation begins.

### Do NOT use this skill if:

- The user wants theming or token code changes rather than a design artifact.
- The task is a feature component change with no token authoring or design-system contract.
- The request only needs a one-line color fix with no new semantic role.

## Inputs

- Task name.
- Task description.
- Scope: which token categories, components, or surfaces are in scope.
- Current file contents when available: `tokens.ts`, `semantic-tokens.css`, `semantic-tailwind-colors.ts`, `tailwind.config.js`, `theme.ts`.

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions`
3. `## Design System Design (for design-system-implementor)`

The design block must include only:

- **Task Goal**
- **Token Inventory** (which of the five pipeline files change and why)
- **New / Changed Primitives** (additions to `tokens.ts` `kpmgPrimitives`, if any)
- **Semantic CSS Custom Property Map** (new or changed `--color-*` entries; light and dark values; which `--kpmg-*` each references)
- **Tailwind Semantic Color Entries** (new or changed entries for `semantic-tailwind-colors.ts`, if any)
- **Chakra Semantic Token Entries** (new or changed entries for `theme.ts` `semanticTokens.colors`, if any)
- **Component / Recipe Specs** (per component in scope: primitive choice, all six state variants with token references, focus ring pattern, disabled rules)
- **Light/Dark Contract** (any changes to provider wiring, `html.dark` overrides, or `useColorMode` usage)
- **Placement Plan** (exact file paths that change)
- **Contrast Check** (WCAG AA assertion for each new color pairing in both modes)
- **Acceptance Checks**

## Workflow

1. Read `../design-system-common/SKILL.md` and apply its pipeline rules, semantic token table, component decision rules, and state variant requirements.
2. Identify the minimum set of primitives, semantic aliases, and components needed for the task.
3. For each new or changed primitive:
   - specify the key name for `kpmgPrimitives` in `tokens.ts`
   - specify the raw hex value
   - confirm it does not duplicate an existing entry
4. For each new or changed semantic alias:
   - assign a `--color-<role>` name following existing naming convention
   - specify which `--kpmg-*` primitive it references in light mode
   - specify which `--kpmg-*` primitive it overrides in `html.dark {}` (or note "no dark override" if same)
   - specify the Tailwind class name for `semantic-tailwind-colors.ts` (if applicable)
   - specify the Chakra semantic token path for `theme.ts` (if applicable)
5. For each component or recipe in scope:
   - specify primitive choice: raw HTML + Tailwind, existing custom component, or Chakra v3 `defineRecipe`
   - define all six state variants (`default`, `hover`, `focus`, `active`, `disabled`, `loading`) using `--color-*` token names only — no hex values
   - specify focus ring: `boxShadow: '0 0 0 4px var(--color-primary-muted)'` + `outline: 'none'`, or `.ring-light`/`.ring-dark` Tailwind utilities
   - specify disabled: `opacity: 0.6`, `cursor: 'not-allowed'`, `aria-disabled="true"`
6. Note any changes to provider wiring, `html.dark` scope, or `useColorMode` usage.
7. List every file path that the implementor must touch.
8. Assert WCAG AA contrast (4.5:1 body / 3:1 UI) for each new foreground/background pairing in both light and dark mode; flag any that need adjustment.

## Guardrails

- Do not include hex values in the design block; reference `kpmgPrimitives` key names and `--color-*` / `--kpmg-*` names only.
- Do not specify a dark-mode override inside a component file; all dark switching belongs in `semantic-tokens.css` `html.dark {}`.
- Do not design component state variants without specifying the focus ring token and disabled cursor.
- Do not skip the contrast check for any new color pairing.
- Do not design tokens in only one system (Tailwind OR Chakra) when both need the value; specify both.
- Keep the design block scoped to the task; do not redesign unrelated parts of the token system.
- State assumptions when existing file contents are unavailable.
