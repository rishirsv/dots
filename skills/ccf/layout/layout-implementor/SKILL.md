---
name: layout-implementor
description: Scaffold React TypeScript Layout components that organize subcomponents within a page/view, aligned to existing repository conventions without premature abstraction. Use when asked to create or update page layouts, view shells, section composition, responsive structure, or route-bound layout wrappers in an identified app, including file placement, exports, typing, accessibility baseline, and minimal test scaffolding.
---

# React Layout Scaffold

## Purpose
Help Codex complete layout implementation work end-to-end by:
- translating a layout design or scoped layout task into repository-aligned React code
- keeping placement, file shape, exports, structural semantics, and tests consistent with local patterns
- relying on `../layout-common/SKILL.md` for shared layout rules instead of duplicating them here

## When to use this skill:
- The user wants layouts created or updated in code.
- The work includes page shells, feature shells, section composition, or route-bound structural wrappers.
- The task needs file placement, typing, exports, and minimal tests in addition to layout code.

### Do NOT use this skill if:
- The user only wants a layout design/spec with no code changes.
- The task is primarily a routing tree, ordinary component, or Redux problem and another skill should lead.
- The work is outside this repository's layout code.

## Inputs

- A `## Layout Design (for layout-implementor)` block when available.
- Or a scoped task description plus access to nearby layout patterns.

## Output Format

When implementing, return:
1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for exports, styling, and tests

## Workflow

1. Read `../layout-common/SKILL.md` and apply its shared ownership, placement, and landmark rules.
2. Determine the smallest correct placement for the layout and any local helpers.
3. Mirror the local file shape first:
   - `<LayoutName>.tsx`
   - `<LayoutName>.types.ts` when contracts are substantial
   - `index.ts` only where local barrels already exist
4. Implement typed slots or region props, responsive structure, optional region omission, and any structural controls the layout owns.
5. Keep layout code pure unless an existing pattern explicitly requires stateful behavior.
6. Add or update focused tests when test setup exists, prioritizing region rendering and one variant or omission case.

## Guardrails

- Do not create shared layout helpers without demonstrated reuse pressure.
- Do not move existing files unless explicitly requested.
- Keep business logic, data loading, and Redux wiring out of layouts unless a local pattern requires them.
- Keep changes directly tied to the requested layout structure.
- Layout regions must define containment for dynamic content: each region should either grow with content or provide intentional scrolling.
- Do not assign fixed heights to layout regions that contain variable content unless the layout also defines the correct overflow behavior.
- For split panes, sidebars, rails, modals, and bounded panels, decide explicitly which container owns scrolling; do not leave overflow to happen implicitly.
- In flex and grid layouts, apply `min-w-0` and `min-h-0` where needed so child regions can wrap, shrink, or scroll instead of overflowing their parents.
- Prefer a single clear scroll container per major region. Avoid nested scroll areas unless the task explicitly requires them.
- If a layout region is not supposed to scroll, let it size to content rather than clipping or allowing children to escape the region.
- Before finishing, verify the layout with realistic content density, including long text and stacked controls. No region should allow illegible overflow.
- Before finishing, verify the layout at the smallest supported width and at `200%` text zoom or equivalent increased text size. text must wrap and push controls downward; nothing may overlap.
- Buttons and controls must remain in normal document flow unless the design explicitly calls for overlay behavior.
- A task is not complete if the resulting UI is visually illegible at supported widths, even if all requested controls are present.
- A task is not complete if layout children overflow their parent regions without an intentional grow-or-scroll behavior.