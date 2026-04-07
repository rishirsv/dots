---
name: data-display-implementor
description: Implement read-only data presentation components aligned to existing repository conventions. Use when asked to create or update detail views, summary cards, key-value panels, stat blocks, status chips, timelines, or comparison views in an identified app, including information hierarchy, null handling, and accessibility.
---

# Data Display Implementation

## Purpose

Help Codex complete data display implementation work end-to-end by:

- translating a data display design or scoped presentation task into repository-aligned React component code
- keeping surface type, information hierarchy, null handling, and status indicators consistent with local patterns
- relying on `../data-display-common/SKILL.md` for shared conventions instead of duplicating them here

## When to use this skill:

- The user wants a read-only data presentation component created or updated in code.
- The work includes detail views, cards, key-value panels, stat blocks, status chips, or timelines.
- The task needs null handling, i18n label keys, and accessibility in addition to the happy path.

### Do NOT use this skill if:

- The user only wants a data display design/spec with no code changes.
- The surface is primarily for actions, settings, commands, or workflow navigation. Use a different UI skill such as `component-implementor`, `layout-implementor`, `forms-implementor`, `navigation-implementor` or another ui `*-implementor` skill instead.
- The surface contains significant interactive elements and the content mainly supports those actions. treat it as an action surface, not a data-display surface.
- The task is a list or table of records. use `tables-and-lists-implementor`.

## Inputs

- A `## Data Display Design (for data-display-implementor)` block when available.
- Or a scoped task description plus access to nearby display component patterns.

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for hierarchy, null handling, label sourcing, and ARIA

## Workflow

1. Read `../data-display-common/SKILL.md` and apply its shared conventions.
2. Confirm the surface is read-mostly before implementing. if the primary outcome is taking action, stop and route to the appropriate non-data-display skill.
3. Implement in this order:
   - Surface shell with correct semantic element (`<section aria-labelledby>`, `<article>`)
   - Information hierarchy: primary fields first, secondary next, tertiary in collapsible section if needed
   - Field rendering: typed props, i18n label keys, null rendered as `` for all nullable fields
   - Status chips: map each status value to its design-system variant (color token + icon + i18n label)
   - Stat blocks: primary metric, trend indicator with both color and icon, context label
   - Timeline: newest-first ordering, relative/absolute timestamp logic, paginated loading
   - Comparison view: aligned attribute rows, `` for missing values, horizontal scroll with sticky column
   - Loading states: skeleton per content region
4. Confirm all label strings come from i18n keys. no hardcoded strings.
5. Verify null handling covers all nullable fields. no empty space or raw `null` rendered.
6. Verify ARIA: `aria-label` on status chips where needed.

## Guardrails

- Never hardcode label strings. always use i18n keys.
- Never render null as empty space. always use `` or "Not set".
- Never communicate status by color alone. always pair with icon or text.
- Never load all timeline events at once. paginate long event lists.
- Do not flatten information hierarchy. always implement primary, secondary, and tertiary levels.
- Do not wrap every field group in its own bordered section or card by default.
- Do not use `<section>` as a styling hook; use it only when it represents a meaningful document section.
- If the surface becomes action-dominant during implementation, stop treating it as a data-display task.
