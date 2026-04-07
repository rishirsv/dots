---
name: component-common
description: Shared React component guidance for this repository. Use alongside component design or component implementation tasks when Codex needs the common rules for app detection, placement, local convention matching, component boundary decisions, and repository-aligned accessibility baseline without duplicating them in role-specific skills.
---

# Component Common

## Purpose
Help Codex keep React component design and implementation work consistent by:
- centralizing shared component boundary, placement, and convention checks
- defining the baseline expectations for structure, typing, states, and accessibility
- removing duplicated setup from the `component-designer` and `component-implementor` skills

## When to use this skill:
- The task is about designing or implementing React TypeScript components in this repository.
- A component designer or implementor skill needs shared placement, naming, or accessibility guidance.
- Codex must decide whether a UI unit should stay local, become feature-owned, or become shared.

### Do NOT use this skill if:
- The task is primarily about forms, routing, layout shells, or Redux state ownership and those skills should lead.
- The work is purely visual styling with no component contract or placement decisions.
- The task is not in this repository's React UI code.

## Inputs

- The target app and UI surface in scope.
- The task description or a component design block.
- Nearby repository examples for naming, exports, styling, and tests when available.

## Output Format

This skill does not define a standalone deliverable. It supplies shared component guidance that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide frontend constraints.
2. Identify the target app and target surface:
   - page-level UI
   - reusable UI
   - dialog or panel
   - table or card subcomponent
3. Inspect nearby components to match:
   - naming and export style
   - styling approach
   - file shape
   - test conventions
4. Use `../../ui-references/placement-matrix.md` and nearby local patterns before proposing placement.

### 2. Decide component ownership and boundaries

1. Identify the top-level owning surface first.
2. Split into subcomponents only when it reduces complexity or reflects existing composition boundaries.
3. Keep first use local to the owning page or feature unless reuse is already clear.
4. Use shared ownership only when multiple consumers already justify it.
5. Route-bound page files such as `pages/<PageName>/index.tsx` or `pages/<PageName>.tsx` should stay thin and easy to scan. They may compose the page, wire top-level hooks/selectors/actions, and pass props, but they should not become the long-term home for large JSX trees, section-specific handlers, or non-trivial helper logic.
6. If a page owns more than one major UI region (for example: page header, criteria form, results panel, feedback region, modal actions), extract those regions into nearby local components before the route file becomes difficult to read.
7. When a page contains non-trivial validation, normalization, derived view-model shaping, or event orchestration, move that logic into nearby local hooks or helper files rather than leaving it inline in the route file.


### 3. Apply shared component baseline

1. Define explicit responsibilities for each component.
2. Use TypeScript props without `any`.
3. Cover states the component owns or renders:
   - loading
   - empty
   - error
   - success when relevant
4. Prefer semantic HTML and only add ARIA when semantics are insufficient.
5. For simple primitives, prefer semantic HTML plus the local utility-class styling approach when that is the established pattern.
6. Reuse existing local or shared UI components before introducing new primitive patterns.
7. Use Chakra components for higher-level controls only when the surrounding app already follows that pattern.
8. Keep interactive elements keyboard-operable and align focus behavior with local patterns.
9. Ensure hover states for interactive elements are implemented (e.g. cursor being a pointer if component is a button or has an onClick handler)
10. For action-oriented panels, keep content and controls in normal document flow: heading, supporting text, then actions.
11. In narrow containers, prefer fewer groups with shorter supporting copy instead of repeating large heading/body/button stacks.
12. When reading Redux state in components, prefer named exported selectors. Do not use anonymous `useAppSelector((state) => ...)` callbacks for object/array derivation or parameterized validation logic unless the result is primitive and trivially stable.
13. Input-like controls should use the shared form-control baseline (`h-10 rounded-md` for non-textareas) instead of local one-off sizing.
14. Do not mix Chakra sizing or radius props with Tailwind sizing or radius classes on the same input-like element.
15. Keep route-entry files readable for a human reviewer: prefer short JSX, named derived constants, and local extraction over deeply nested inline render branches.



## Guardrails

- Do not create shared abstractions "just in case."
- Do not move existing files unless explicitly requested.
- Do not impose a new architecture on the app when local patterns already exist.
- Keep component guidance close to the owning feature and scoped task.
- Do not position routine actions on top of explanatory text.
- Do not rely on absolute positioning for ordinary stacked controls in rails, side panels, or cards.
- Do not split a small action surface into many visually competing subcomponents unless the layout has enough width and spacing to support it.
- Do not compute derived Redux objects or arrays inline inside `useAppSelector`.
- Do not hide selector-factory needs inside component bodies.
- If a component needs parameterized derived Redux data, require a named selector factory or local derivation from primitive selector outputs.

