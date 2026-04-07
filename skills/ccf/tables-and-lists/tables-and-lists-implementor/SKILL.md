---
name: tables-and-lists-implementor
description: Implement table and list UI components aligned to existing repository conventions. Use when asked to create or update data tables, sortable/filterable lists, paginated views, row action menus, selection controls, or bulk action bars in an identified app, including column config, state wiring, empty/loading/error states, and accessibility.
---

# Table and List Implementation

## Purpose

Help Codex complete table and list implementation work end-to-end by:

- translating a table/list design or scoped UI task into repository-aligned React component code
- keeping column config, sorting, filtering, pagination, selection, and action wiring consistent with local patterns
- relying on `../tables-and-lists-common/SKILL.md` for shared conventions instead of duplicating them here

## When to use this skill:

- The user wants a table or list component created or updated in code.
- The work includes column config, sort/filter controls, pagination, row actions, or bulk actions.
- The task needs empty, loading, and error state implementation in addition to the happy path.

### Do NOT use this skill if:

- The user only wants a table/list design/spec with no code changes.
- The surface is a simple static nav list. use `navigation-implementor`.
- The task is primarily a data-fetching saga or Redux slice change. use `data-fetching-implementor` for that layer.

## Inputs

- A `## Table/List Design (for tables-and-lists-implementor)` block when available.
- Or a scoped task description plus access to nearby table and list component patterns.

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for column config, state ownership, action wiring, and accessibility

## Workflow

1. Read `../tables-and-lists-common/SKILL.md` and apply its shared conventions.
2. Confirm the complexity tier and select the matching implementation approach.
3. Implement in this order:
   - Column config array with typed column definitions
   - Table/list component shell with correct semantic HTML (`<table>` vs `<ul>`)
   - Sort controls: `<button>` in `<th>`, `aria-sort`, dispatch or local state update
   - Filter controls: debounced input, clear affordance, dispatch or local state update
   - Pagination control: page/cursor state wiring, range display, boundary disabling
   - Selection: checkbox column, header select-all, selection count, bulk action bar visibility
   - Row actions: overflow menu or inline buttons with row-context accessible labels
   - Empty state: distinguish no-data vs no-results, add CTA or clear-filters affordance
   - Loading state: skeleton matching row shape
   - Error state: inline error with retry button
4. Wire Redux selectors and dispatch calls using typed hooks. no direct API calls from the component.
5. Verify all interactive elements are keyboard-operable and ARIA attributes are correct.

## Guardrails

- Never call an API directly from a table component. always dispatch a saga action.
- Never use index as row key when rows can be reordered, deleted, or paginated.
- Never implement client-side sort/filter when data is server-paginated.
- Never skip empty and error state implementations.
- Do not build a complex feature table for a simple static list.
