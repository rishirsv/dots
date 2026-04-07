---
name: design-system-common
description: Shared design-system and UI-foundations guidance for this repository. Covers the token pipeline (tokens.ts → semantic-tokens.css → Tailwind + Chakra v3), semantic color usage, spacing, typography, iconography, light/dark mode, Chakra v3 recipe conventions, component usage decision rules, and component reuse threshold. Read this skill whenever component, layout, or forms work needs consistent token, spacing, or typography decisions — not only when authoring tokens.
---

# Design System Common

## Purpose

Help Codex keep component, layout, forms, and design-system work consistent by:

- describing the token pipeline and semantic color contract
- providing spacing, typography, and iconography conventions all skills share
- defining light/dark mode architecture and component usage decision rules
- establishing when to promote local components to shared

## When to use this skill:

- Any `component`, `layout`, or `forms` skill is in use and Codex needs spacing, typography, iconography, or component-selection decisions.
- The task adds or modifies design tokens, CSS custom properties, Tailwind color config, or Chakra semantic tokens.
- Codex must decide primitive vs custom component vs Chakra, or local vs shared placement.

### Do NOT use this skill if:

- The task has no UI output (pure saga, pure Redux slice, pure routing config).
- A `## Design System Design` block is already in scope — follow it directly.

## Inputs

- The target component or surface in scope; nearby components for convention matching.
- When authoring tokens: `src/styles/tokens.ts`, `src/styles/semantic-tokens.css`, `src/styles/semantic-tailwind-colors.ts`, `tailwind.config.js`, `src/styles/theme.ts`.

## Output Format

This skill does not define a standalone deliverable. It supplies shared guidance the designer and implementor skills apply.

## Workflow

### 1. Token pipeline

```
tokens.ts (kpmgPrimitives — only place raw hex values live)
  ├─► semantic-tokens.css      --kpmg-* primitives + --color-* semantic aliases
  │     :root {}   light values
  │     html.dark {} dark overrides
  ├─► semantic-tailwind-colors.ts → tailwind.config.js  (var(--color-*) classes)
  └─► theme.ts (Chakra v3)  brand tokens + semanticTokens referencing var(--color-*)
```

- Never hardcode hex outside `tokens.ts`. See `../../ui-references/design-system-palette.md` for the full palette when you need to verify a key or hex value.
- To add a new token follow the checklist in section 8.

### 2. Semantic color tokens (light → dark)

Components consume `--color-*` vars and their Tailwind/Chakra aliases — never primitive keys.

| Token                                        | Light                  | Dark               |
| -------------------------------------------- | ---------------------- | ------------------ |
| `--color-surface` / `bg-surface`             | white                  | black              |
| `--color-surface-muted` / `bg-surface-muted` | gray5                  | gray1              |
| `--color-fg` / `text-fg`                     | black                  | offWhite           |
| `--color-primary` / `bg-primary`             | kpmgCobaltBlue #1E4AE2 | kpmgPurple #7213EA |
| `--color-primary-emphasized`                 | kpmgCobaltBlueHover    | kpmgPurpleHover    |
| `--color-primary-muted`                      | kpmgLightBlue2         | kpmgLightPurple    |
| `--color-primary-fg` / `text-primary-fg`     | white                  | offWhite           |
| `--color-error` / `text-error`               | red #ED2124            | red #ED2124        |
| `--color-warning`                            | yellowWarning #C5782F  | yellowWarning      |
| `--color-success`                            | green #269924          | green              |
| `--color-focus`                              | kpmgBlue #00338D       | _(inherits light)_ |
| `--color-link` / `text-link`                 | lightLink              | darkLink           |

> Dark mode primary is **Purple**, not Cobalt — intentional.

### 3. Light/dark mode

- `next-themes` writes `dark` class to `<html>`; `html.dark {}` in `semantic-tokens.css` overrides `--color-*` vars.
- Provider chain: `ThemeProvider` (breakpoints) wraps `ColorModeProvider` (next-themes).
- Use `useColorMode()` from `ColorModeProvider.tsx` — never `useTheme()` from next-themes directly.
- next-themes persists choice to `localStorage` automatically; do not add a second write.
- Tailwind dark variant: `dark:` prefix (wired to `.dark` class via `@custom-variant dark`).

### 4. Component usage decision rules

1. **Raw HTML + Tailwind** — layout/structural containers (`div`, `span`, `ul`, `section`, `header`, `main`).
2. **Predefined custom component** (shared components folder) — use whenever one exists.
3. **Chakra v3** — complex interactive controls only: Slider, Accordion, Tabs, Modal, Toast, Select, Menu, Breadcrumb.
4. Do not use Chakra layout primitives (`Box`, `Stack`, `Text`) for structural containers.
5. Do not introduce Radix UI; Chakra v3 is the required library.

New Chakra components use `defineRecipe`. Follow the `buttonRecipe` pattern: extend the Chakra base recipe, reference semantic token names (`bg: 'primary.solid'`), define `_disabled` (`opacity: 0.6, cursor: 'not-allowed'`) and `_focusVisible` (`boxShadow: '0 0 0 4px var(--color-primary-muted)', outline: 'none'`).

### 5. Component state variants

Every interactive component must define all six states with semantic tokens:

| State    | Pattern                                                                                     |
| -------- | ------------------------------------------------------------------------------------------- |
| default  | base surface + text semantic tokens                                                         |
| hover    | `primary-emphasized` or `surface-muted`                                                     |
| focus    | `.ring-light` / `.ring-dark` utilities or `boxShadow: 0 0 0 4px var(--color-primary-muted)` |
| active   | `--color-active` (kpmgBlueHover)                                                            |
| disabled | `opacity-60 cursor-not-allowed` + `aria-disabled="true"`                                    |
| loading  | spinner/skeleton within bounds; also apply disabled state                                   |

### 6. Spacing conventions

Use Tailwind spacing scale only — no arbitrary pixel values. Match nearby components first; these are recommended defaults.

| Context                                     | Classes           |
| ------------------------------------------- | ----------------- |
| Tight internals (icon pad, badge)           | `p-1` / `p-2`     |
| Standard component (input, card, list item) | `p-3` / `p-4`     |
| Panel / section                             | `p-4` / `p-6`     |
| Page-level gaps                             | `gap-6` / `gap-8` |
| Inline (icon + label, button group)         | `gap-1` / `gap-2` |
| Form: label→input, input→error              | `gap-1` / `mt-1`  |
| Form: between field groups                  | `gap-4` / `gap-6` |

Prefer `gap-*` on flex/grid containers over child margins. Do not mix `p-*` and `px-*/py-*` on the same element.

### 6a. Form control baselines

Use one default size for all single-line controls. Textareas are the only exception.

| Control | Default baseline |
| ------- | ---------------- |
| `input`, `select`, date picker, number input | `rounded-md px-3` |
| `textarea` | `rounded-md px-3 py-2` |


Rules:
1. All non-textarea field controls must share the same visual height by default.
2. Use `h-10` as the default single-line control height unless an existing shared recipe already encodes the same value.
3. Use `rounded-md` as the default control radius for all non-textarea field controls.
4. Do not introduce per-control one-off height or radius overrides unless the task explicitly calls for a deliberate size variant.
5. When a control is Chakra-backed, encode the baseline in the Chakra recipe or size variant instead of repeating Tailwind classes at each usage site.
6. Textareas are exempt from the uniform-height rule and should size by content with a `min-h-*` baseline.

Conflict-prevention rules:
- Do not stack conflicting utility classes on the same element, especially multiple `h-*`, `min-h-*`, `rounded-*`, `p-*`, `px-*`, `py-*`, or `border-*` classes.
- Do not mix Tailwind height or radius utilities with Chakra `size`, `h`, `minH`, or `borderRadius` props on the same control.
- One control should have one styling owner for its size and radius.

### 7. Typography scale

`font-opensans` (body, default) and `font-opensanscondensed` (display headings only). Base font inherited from `html` — do not redeclare per component. Match nearby components first; these are recommended defaults.

| Role            | Size        | Weight                        | Line-height      |
| --------------- | ----------- | ----------------------------- | ---------------- |
| heading-xl      | `text-2xl`  | `font-semibold`               | `leading-tight`  |
| heading-lg      | `text-xl`   | `font-semibold`               | `leading-tight`  |
| heading-md      | `text-lg`   | `font-medium`                 | `leading-snug`   |
| heading-sm      | `text-base` | `font-medium`                 | `leading-snug`   |
| body            | `text-sm`   | `font-normal`                 | `leading-normal` |
| body-sm / label | `text-xs`   | `font-normal` / `font-medium` | `leading-normal` |
| caption         | `text-xs`   | `font-normal`                 | `leading-normal` |

Default body is `text-sm`. Pair heading text with `text-fg`; muted text with `text-fg opacity-70`. Truncated text: `truncate` or `line-clamp-*` + tooltip.

## 7a. Guidance for Dense panels, rails, and side surfaces

- Use `font-opensans` for headings in narrow rails, side panels, cards, and dense utility surfaces. do not use `font-opensanscondensed` there.
- Prefer `text-base font-medium` or `text-sm font-semibold` for subsection headings in dense surfaces.
- Avoid all-caps headings for repeated subsections in narrow containers.
- In narrow panels, supporting copy should usually stay within 2-3 lines before truncation, collapse, or moving the detail elsewhere.
- Default spacing for stacked rail groups: outer `gap-4`, inner `p-4`, action groups `gap-2`.
- Avoid repeating a large `heading + paragraph + full-width primary button` pattern unless the surface has been validated for content density.

### 8. Iconography

Library: `react-icons/bi`. Import from `'react-icons/bi'` — not from the top-level barrel. Do not use other icon libraries.

Sizing: `w-4 h-4` (inline body), `w-5 h-5` (heading / icon button), `w-8 h-8`+ (decorative/empty state). Always set both `w-*` and `h-*`.

Accessibility: decorative icon alongside text → `aria-hidden="true"`. Icon-only interactive → `aria-label` on the **button/link**, `aria-hidden="true"` on the icon. Never put `aria-label` on the `<svg>` when the parent element can carry it. Use semantic color tokens for icon color; never raw hex.

### 9. Component reuse threshold

| Usage                              | Action                                                       |
| ---------------------------------- | ------------------------------------------------------------ |
| First use                          | Keep local to owning page/feature                            |
| Second use, same domain            | Evaluate domain-level `components/` folder                   |
| Cross-domain, confirmed second use | Move to `src/shared/components/<Category>/`                  |
| Already in shared                  | Use it; extend with props rather than making a local variant |

Shared component categories: `Buttons/`, `Inputs/`, `Menus/`, `Popups/`, `Selects/`, `Display/`, `Layout/`, `Feedback/`. Update all consumers in the same PR when promoting.

### 10. Adding new tokens

1. Add hex to `tokens.ts` `kpmgPrimitives`.
2. Add `--kpmg-<n>: theme(colors.<n>)` in `semantic-tokens.css` `:root`.
3. If semantic role needed: add `--color-<role>` in `:root`; add override in `html.dark {}` if dark differs.
4. If Tailwind needs it: add to `semantic-tailwind-colors.ts`.
5. If Chakra needs it: add to `theme.ts` `semanticTokens.colors`.
6. Verify WCAG AA contrast (4.5:1 body text, 3:1 UI components) in both modes.

## Guardrails

- Do not hardcode hex values anywhere except `tokens.ts`.
- Do not add dark-mode overrides in component CSS; use `semantic-tokens.css` `html.dark {}`.
- Do not call `useTheme()` from next-themes in feature code; use `useColorMode()`.
- Do not use `cursor: pointer` on disabled elements.
- Do not remove focus `outline`/`boxShadow` without replacing with `.ring-light`/`.ring-dark`.
- Do not use Chakra layout primitives for structural containers.
- Do not introduce a new component library or icon library (`react-icons/bi` only).
- Do not define breakpoints anywhere other than `breakpoints.ts`.
- Do not use arbitrary pixel values for spacing.
- Do not freestyle `text-*`/`font-*` combos; use the typography table in section 7.
- Do not use `font-opensanscondensed` for body copy.
- Do not use `font-opensanscondensed` for subsection headings in narrow or dense containers.
- Do not use all-caps subsection headings in narrow rails or side panels by default.
- Do not stack repeated full-width action blocks under long descriptive copy without checking density at supported narrow widths.
- Do not create shared components speculatively; follow the reuse threshold in section 9.
- Do not create local variants of shared components to change styling; extend with props.
- Do not mix Chakra props and Tailwind classes for the same property group on the same interactive control.
- Do not apply more than one height utility or more than one radius utility to the same input-like element.

