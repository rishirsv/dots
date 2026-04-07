---
name: design-system-implementor
description: Implement design-system changes following the project's exact token pipeline (tokens.ts → semantic-tokens.css → semantic-tailwind-colors.ts + tailwind.config.js + theme.ts). Covers adding primitives, semantic CSS custom properties, Tailwind aliases, Chakra v3 recipes, light/dark mode via html.dark class, and base component state variants. Use when asked to build or update tokens, theming, shared UI primitives or applying styling on UI primitives in code.
---

# Design System Implementation

## Purpose

Help Codex complete design-system implementation work end-to-end by:

- following the exact project token pipeline across the five theming files
- implementing light/dark mode correctly via `semantic-tokens.css` `html.dark {}` and next-themes
- building Chakra v3 recipes and shared components with correct state variants and token references
- relying on `../design-system-common/SKILL.md` for pipeline architecture and shared rules instead of duplicating them here

## When to use this skill:

- The user wants design tokens, semantic aliases, or base components added or modified in code.
- The work touches any of: `tokens.ts`, `semantic-tokens.css`, `semantic-tailwind-colors.ts`, `tailwind.config.js`, `theme.ts`, `ColorModeProvider.tsx`, `ThemeProvider.tsx`, or a shared component recipe.
- The task implements a `## Design System Design (for design-system-implementor)` block.

### Do NOT use this skill if:

- The user only wants a feature component with no token or theming contract change.
- The task is a pure accessibility or form fix with no design-system file impact.

## Inputs

- A `## Design System Design (for design-system-implementor)` block when available.
- Or a scoped task description plus access to the five theming files.

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs for modified files
4. Notes on conventions matched: token pipeline step, semantic naming, Chakra recipe pattern, contrast result

## Workflow

1. Read `../design-system-common/SKILL.md` and apply its pipeline rules, semantic token table, and component decision rules.
2. Implement in pipeline order — earlier steps must be complete before later steps reference them:

**Step 1 — `src/styles/tokens.ts`**

- Add new hex values to `kpmgPrimitives` as `const` entries.
- Use camelCase key names consistent with existing entries.
- No other logic; this file is hex values only.

**Step 2 — `src/styles/semantic-tokens.css`**

- Add `--kpmg-<n>: theme(colors.<n>)` in `:root` for each new primitive.
- Add `--color-<role>: var(--kpmg-<n>)` in `:root` for each new semantic alias.
- Add override in `html.dark {}` only when the dark value differs from light.
- Do not add dark-mode overrides anywhere else.

**Step 3 — `src/styles/semantic-tailwind-colors.ts`**

- Add `'<role>': 'var(--color-<role>)'` for each new semantic alias that Tailwind needs.
- `tailwind.config.js` spreads this object automatically; no change to the config file needed for semantic colors.
- For new primitive colors that need direct Tailwind access, they are already available via the `kpmgPrimitives` spread — no config change needed.

**Step 4 — `src/styles/theme.ts` (Chakra v3)**

- Add new primitive to `tokens.colors.brand.*` referencing `kpmgPrimitives.<key>` directly.
- Add new semantic alias to `semanticTokens.colors` referencing `var(--color-<role>)`.
- Follow existing nesting: `primary.solid`, `primary.fg`, `button.ghost.color`, etc.
- Do not add raw hex values here; reference `kpmgPrimitives` or `var(--color-*)`.

**Step 5 — Chakra recipes (e.g., `src/styles/recipes/<component>Recipe.ts`)**

- Use `defineRecipe`; extend Chakra's base recipe with spread where available.
- Reference semantic token names in style values: `'primary.solid'`, `'surface.muted'`, etc.
- Implement all six state variants for every interactive component:
  ```ts
  _disabled: { opacity: 0.6, cursor: 'not-allowed' },
  _focusVisible: {
    boxShadow: '0 0 0 4px var(--color-primary-muted)',
    outline: 'none',
  },
  _hover: { bg: 'primary.emphasized' },
  _active: { bg: 'primary.emphasized' },
  ```
- Register new recipes in `theme.ts` `config.theme.recipes`.
- For input-like controls, encode one default single-line control height equivalent to `h-10` and one default corner radius equivalent to `rounded-md`.
- Textareas are exempt from the single-line height rule and should use a content-appropriate `minH` baseline instead.
- Do not mix Chakra sizing or radius props with Tailwind sizing or radius classes on the same DOM node.


**Step 6 — Shared components**

- Place in `src/shared/components/<Domain>/`.
- Use semantic Tailwind classes (`bg-primary`, `text-primary-fg`, `dark:bg-surface`) — no hex values.
- Use `.ring-light` / `.ring-dark` Tailwind utilities for focus rings on non-Chakra components.
- Apply `disabled:opacity-60 disabled:cursor-not-allowed` and `aria-disabled="true"` for disabled state.
- Use `useColorMode()` (not `useTheme()`) if the component needs to read the current color mode.
- Shared non-textarea field primitives must default to the same height and radius as the form-control baseline.

**Step 7 — Provider wiring (only when scope includes provider changes)**

- `ColorModeProvider.tsx`: wraps `next-themes ThemeProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`.
- `ThemeProvider.tsx`: wraps `ColorModeProvider`; provides breakpoint context via `useThemeContext`.
- Do not add a second `localStorage` write for color mode.

3. Verify WCAG AA contrast for every new color pairing in both modes before marking done.
4. Add axe-core test for each new shared component asserting no violations.

## Guardrails

- Do not hardcode hex values in any file except `tokens.ts`.
- Do not add dark-mode overrides in component files or Chakra recipes; use `semantic-tokens.css` `html.dark {}`.
- Do not call `useTheme()` from next-themes in feature code; use `useColorMode()`.
- Do not add a second `localStorage` write for color mode.
- Do not use `cursor: pointer` on disabled elements.
- Do not remove focus outlines without providing the `boxShadow` or `.ring-*` replacement.
- Do not use Chakra layout primitives (`Box`, `Stack`, `Text`) for structural containers.
- Do not introduce a new component library alongside Chakra v3.
- Do not change `breakpoints.ts` values without updating all consumers.

## Acceptance / Quality Checks

| Check                        | Pass condition                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| No raw hex outside tokens.ts | Zero hex literals in `.tsx`, `.ts` (non-tokens), `.css` component files                            |
| Pipeline complete            | New token present in all five files that need it (tokens → CSS vars → Tailwind → Chakra)           |
| Dark mode override           | New `--color-*` with a different dark value has an entry in `html.dark {}`                         |
| Chakra/Tailwind sync         | Same semantic role available via both Tailwind class and Chakra token name                         |
| All six state variants       | Every new interactive component/recipe defines default/hover/focus/active/disabled/loading         |
| Focus ring present           | `_focusVisible` uses `boxShadow` + `outline: 'none'`; or `.ring-light`/`.ring-dark` for non-Chakra |
| Disabled cursor              | `cursor: 'not-allowed'` + `opacity: 0.6` on disabled; no `cursor: pointer`                         |
| WCAG AA                      | All new color pairings pass 4.5:1 (body text) / 3:1 (UI) in both light and dark                    |
| axe clean                    | New shared components pass axe-core with no violations                                             |
| Uniform control height       | All non-textarea input-like controls use one default height (`h-10` or Chakra-equivalent)         |
| Corner radius baseline       | All non-textarea input-like controls use `rounded-md` or Chakra-equivalent `md` radius             |
| No style conflicts           | No control mixes Chakra and Tailwind for the same property group; no duplicate `h-*` or `rounded-*` |


## Example — adding a new semantic surface token

```ts
// 1. tokens.ts
kpmgNavyCard: '#0A2849',

// 2. semantic-tokens.css :root
--kpmg-kpmgNavyCard: theme(colors.kpmgNavyCard);
--color-surface-navy: var(--kpmg-kpmgNavyCard);

// html.dark {} — no override needed if dark mode keeps same navy card

// 3. semantic-tailwind-colors.ts
'surface-navy': 'var(--color-surface-navy)',

// 4. theme.ts semanticTokens.colors
'surface-navy': { value: 'var(--color-surface-navy)' },

// 5. Component usage
<div className="bg-surface-navy text-primary-fg">...</div>
```
