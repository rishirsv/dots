---
name: layout-common
description: Shared React layout guidance for this repository. Use alongside layout design or layout implementation tasks when Codex needs the common rules for app detection, layout placement, region ownership, structural accessibility, and repository-aligned file-shape decisions without duplicating them in role-specific skills.
---

# Layout Common

## Purpose
Help Codex keep layout design and implementation work consistent by:
- centralizing shared rules for layout ownership, placement, and structural responsibility
- defining the baseline expectations for regions, slots, responsive structure, and landmark semantics
- removing duplicated layout setup from the designer and implementor skills

## When to use this skill:
- The task is about designing or implementing page or feature layout structure in this repository.
- A layout designer or implementor skill needs shared guidance for region ownership, placement, or accessibility.
- Codex must decide whether the requested work belongs in a layout shell versus ordinary components.

### Do NOT use this skill if:
- The task is primarily about ordinary leaf components or form behavior rather than layout structure.
- The work is a routing-only or Redux-only task with no layout ownership decision.
- The request is outside this repository's React UI code.

## Inputs

- The target app and layout surface in scope.
- The task description or layout design block.
- Nearby layout and page examples when available.

## Output Format

This skill does not define a standalone deliverable. It supplies shared layout guidance that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide frontend constraints.
2. Identify the target app and surface:
   - page shell
   - feature shell
   - route wrapper
   - nested layout
3. Inspect nearby layouts and pages to match naming, exports, styling, and composition conventions.
4. Use `../../ui-references/placement-matrix.md` and existing local layout patterns before proposing placement.

### 2. Decide layout ownership and boundaries

1. Keep layouts responsible for regions, spacing, responsive structure, and landmark semantics.
2. Keep business logic, data loading, and Redux wiring out of layouts unless an existing pattern or explicit task requires them.
3. Split into sub-layouts only when that reduces complexity or matches an existing shared shell boundary.
4. Keep first use local to the owning route or feature unless reuse is already proven.

### 3. Apply shared layout baseline

1. Prefer explicit slots or region props when multiple areas are composed.
2. Use TypeScript props without `any`.
3. Omit empty containers when optional regions are not present.
4. Use semantic landmarks such as `header`, `nav`, `main`, `aside`, and `footer` where appropriate.
5. Keep structural controls keyboard-operable and aligned with existing focus behavior.
6. Match the local layout styling approach first; use simple DOM structure and utility classes for straightforward shells, and use Chakra layout primitives only when nearby layouts already do.
7. Ensure any sub-components that intend to be seen by the viewer are able to be reached (not cut off, can be accessed via scroll, etc.).
8. For rails, sidebars, split panes, modals, and bounded panels, decide explicitly which container owns scrolling.
9. In flex and grid layouts, apply `min-w-0` and `min-h-0` where needed so child regions wrap, shrink, or scroll instead of overflowing their parents.
10. If a region contains variable content, let it grow with content or define intentional scrolling; never rely on clipping or implicit overflow.
11. Validate layout decisions against realistic content density, including long text, multiple stacked controls, and narrow widths.
12. Design layouts in a way that minimizes unnecessary view switching and back-and-forth scrolling.

## Guardrails

- Do not create shared layout abstractions "just in case."
- Do not move existing files unless explicitly requested.
- Do not relocate business logic into layouts without a clear existing pattern.
- Keep layout guidance directly tied to the scoped page or feature structure.
- Do not assign fixed heights to regions that contain variable text or stacked controls unless the correct overflow behavior is also defined.
- Do not allow overlap or illegible overflow at supported widths; content must wrap, grow, or scroll intentionally.
- Prefer one clear scroll owner per major region. avoid nested scroll areas unless the task explicitly requires them.
