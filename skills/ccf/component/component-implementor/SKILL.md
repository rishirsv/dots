---
name: component-implementor
description: Scaffold React TypeScript components aligned to existing repository conventions without premature abstraction. Use when asked to create or update frontend components, dialogs, cards, table parts, form sections, or route-bound UI in identified app, including file placement, exports, typing, accessibility baseline, and minimal test scaffolding.
---

# React Component Scaffold

## Purpose

Help Codex complete component implementation work end-to-end by:

- translating a component design or scoped UI task into repository-aligned React code
- keeping placement, file shape, exports, accessibility, and test coverage consistent with local patterns
- relying on `../component-common/SKILL.md` for shared component rules instead of duplicating them here

## When to use this skill:

- The user wants components created or updated in code.
- The work includes page UI, dialogs, cards, tables, or other reusable React component surfaces.
- The task needs file placement, typing, exports, and minimal tests in addition to component code.

### Do NOT use this skill if:

- The user only wants a component design/spec with no code changes.
- The task is primarily a form flow, layout shell, route tree change, or Redux integration and another skill should lead.
- The work is not in this repository's React component code.

## Inputs

- A `## Component Design (for component-implementor)` block when available.
- Or a scoped task description plus access to nearby component patterns.

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for exports, styling, and tests

## Workflow

1. Read `../component-common/SKILL.md` and apply its shared placement and baseline rules.
2. Determine the smallest correct placement for each component and helper.
3. Mirror the local component shape first:
   - `<Component>.tsx`
   - `<Component>.types.ts` when contracts are substantial
   - `index.ts` only where local barrels already exist
4. When the owning surface is a route-bound page, keep `pages/<PageName>/index.tsx` as a thin entry file when possible.
   - Put large presentational regions in nearby local components.
   - Put non-trivial local logic in `use<PageName>*.ts`, `*.types.ts`, or `*.validation.ts` files when that matches nearby patterns.
   - Prefer a local folder over keeping a large mixed file of JSX, handlers, and helpers in one route entry.
5. Implement the component baseline with typed props, safe defaults, rendered states, and task-specific interactions.
6. Wire exports and imports using the local alias and barrel conventions already present nearby.
7. Add or update focused tests when test setup exists, prioritizing render coverage and one key interaction.

## Guardrails

- Keep scaffolds small and directly tied to the requested UI.
- Do not let a route page file accumulate large JSX regions, section-specific logic, validation helpers, and modal flows in one file when nearby local extraction would make the page meaningfully easier to scan.
- If a page file needs multiple screenfuls to understand its structure, extract local subcomponents or hooks before adding more behavior.
- Do not create shared helpers or utilities without demonstrated reuse pressure.
- Do not override established local patterns for file layout, styling, or tests.
- Do not use absolute positioning, negative margins, or translated offsets for normal sidebar/card/list layout unless the task explicitly requires layered UI.
- Sidebar sections must remain in normal document flow using flex/grid/stack layout with explicit spacing tokens.
- Do not give fixed heights to containers with variable text or dynamic content. Let cards grow with content.
- If multiple panels share a rail, compose them in one parent vertical stack with consistent gaps; do not visually float independent cards into the same space.
- Buttons, headings, helper text, and list rows must have enough vertical space to render at supported content lengths without collision.
- When adding a new section, inspect sibling sidebar sections first and match their spacing, padding, border treatment, and width behavior.
- Prefer reducing helper copy over compressing spacing or text line-height.
- Before finishing a UI task, verify at least desktop rail width and one narrow/mobile width. No text, cards, or controls may overlap, clip, or become illegible.
- If the implemented layout becomes crowded, simplify the section structure instead of stacking more nested surfaces.
- Never render task-artifact language directly into product UI.
- Do not expose provided documentation such as requirements, task titles, implementation notes, acceptance-criteria wording, or instructional/rationale text to end users.
- User-facing copy must come from explicit product requirements, existing repo copy patterns, or minimal neutral labels. Do not include text describing requirements or task artifacts, nor text that explains app behavior unless it is explicitly needed (like in a tooltip or information/help page)
- If copy intent is unclear, use the smallest sensible product label and avoid explanatory paragraphs.
- Before finalizing UI text, ask: would this make sense to a user who has never seen the task artifact? If not, rewrite or remove it.
- Child content must stay contained within component bounds. Components with dynamic content must either grow naturally or define intentional scrolling.
- Do not give fixed heights to cards, sections, panels, or list containers that render variable text or dynamic child content unless overflow behavior is explicitly part of the task.
- If a component is meant to be height-bounded, put scrolling on the correct inner container instead of allowing children to spill out of the parent.
- In flex and grid layouts, use `min-w-0` and `min-h-0` where needed so text can wrap and scroll containers can shrink correctly.
- Long labels, helper text, validation text, and status copy must wrap within the component instead of overflowing or being visually clipped (except in the case of text ellipses).
- Do not use `overflow-hidden` as a cosmetic fix for broken layout unless the task explicitly calls for clipped presentation.
- Before finishing, inspect populated, empty, loading, error, and long-copy states. No child element may overflow its parent unless that overflow is intentionally scrollable.
- A task is not complete if the resulting UI is visually illegible at supported widths, even if all requested controls are present.
- A task is not complete if component children overflow their parent containers without an intentional grow-or-scroll behavior.

