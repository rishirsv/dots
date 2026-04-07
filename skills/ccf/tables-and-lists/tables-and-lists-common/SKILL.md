---
name: tables-and-lists-common
description: Shared list and table UI guidance for this repository. Use alongside tables-and-lists design or implementation tasks when Codex needs the common rules for sorting, filtering, pagination, selection, row actions, bulk actions, empty/loading/error states, virtualization, and accessibility without duplicating them in role-specific skills.
---

# Tables and Lists Common

## Purpose

Help Codex keep complex list UI work consistent by:

- defining complexity tiers and matching each to the right implementation approach
- centralizing column model, sorting, filtering, pagination, and selection conventions
- specifying row action, bulk action, and empty/loading/error state rules
- removing duplicated setup from the tables-and-lists designer and implementor skills

## When to use this skill:

- The task involves a table, data grid, or list of structured records.
- A designer or implementor skill needs shared sorting, filtering, pagination, or selection guidance.
- Empty states, loading skeletons, or error recovery are needed for a list view.

### Do NOT use this skill if:

- The list is a static nav menu or sidebar. use `navigation-common`.
- The display is a detail view, card summary, or key-value panel. use `data-display-common`.
- The task is purely about fetching the list data. use `data-fetching-common` for that part.

## Inputs

- The target app and the data domain being listed.
- Which capabilities are required: sorting, filtering, pagination, selection, row actions.
- Existing table/list components in the app that should be reused or extended.

## Output Format

This skill does not define a standalone deliverable. It supplies shared tables-and-lists guidance that the designer and implementor skills should apply.

## Workflow

### 1. Assess list complexity

| Level    | Characteristics                                      | Approach                                    |
| -------- | ---------------------------------------------------- | ------------------------------------------- |
| Simple   | Static data, no sort/filter, no actions              | Semantic `<table>` or `<ul>` + local state  |
| Standard | Server data, sort/filter, pagination, row actions    | Redux-connected table with saga-driven data |
| Complex  | Selection, bulk actions, inline edit, virtualization | Full feature table with dedicated slice     |

Match the approach to the level. Do not build a complex table for a simple list.

### 2. Column and row model conventions

- Define columns as a configuration array (label, key, sortable flag, width, render function).
- Row data type must be explicit and typed.
- Keep row identity stable. prefer a unique `id` field over index-based keys.
- Do not hardcode column rendering inline in the table body.

### 3. Sorting conventions

- Server-sorted: `sortKey` and `sortDirection` live in Redux; changing sort dispatches a new fetch.
- Client-sorted: sort state lives in local component state or a custom hook.
- Column header is the sort trigger. use `<button>` inside `<th>`, not the `<th>` itself.
- `aria-sort="ascending|descending"` on the active `<th>`.
- Changing sort resets pagination to page 1.

### 4. Filtering conventions

- Server-filtered: active filters in Redux; client-filtered: local state or URL params.
- Filter changes debounce text input (300-500 ms) before dispatching.
- Clearing a filter is an explicit affordance. provide clear per-filter and "clear all."
- Changing filters resets pagination to page 1.

### 5. Pagination conventions

Align with `data-fetching-common` pagination patterns:

- Store `page`, `pageSize`, `totalCount` (offset) or `nextCursor` (cursor) in Redux.
- Show current range ("Showing 1-25 of 200") when total count is available.
- Page size selector updates `pageSize` and resets to page 1.
- For infinite scroll: accumulate rows; provide a "Load more" fallback.

### 6. Selection conventions

- Single select: selected row ID in local state unless it drives a Redux flow.
- Multi-select: selected IDs in `Set<string>` in local or slice state.
- Header checkbox: select-all / deselect-all for the current page only.
- Show selection count in bulk action bar when items are selected.

### 7. Bulk action conventions

- Bulk action bar appears when one or more rows are selected (conditionally rendered).
- Each bulk action dispatches a saga flow. no direct API calls from the component.
- After a bulk action completes: deselect all rows and refetch the current page.
- Destructive bulk actions require a confirmation step.

### 8. Row action conventions

- Use an overflow menu for 3+ actions to avoid visual clutter.
- Row action callbacks receive the row `id` and dispatch the appropriate saga action.
- Destructive row actions require confirmation before dispatch.
- Disable row actions during a pending async operation on that row.
- Each action button has an accessible label that includes row context.

### 9. Empty, loading, and error states

Every list view must cover all three:

- **Loading:** skeleton matching expected row shape; never show empty state while loading.
- **Empty (no data):** domain-appropriate message, optional primary CTA.
- **Empty (no results):** "No results" message with "clear filters" affordance.
- **Error:** inline error with retry; keep stale data visible with an error banner on refetch failure.

### 10. Accessibility baseline

- Use `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">`, `<td>` for tabular data.
- Use `<ul>`/`<li>` for non-tabular lists.
- `aria-sort` on active column header.
- `aria-selected` on selected rows; `aria-checked` on checkboxes.
- Row action labels include row context (e.g., "Delete Project Alpha").
- Keyboard: `Tab` reaches interactive elements; row actions are keyboard-operable.

## Guardrails

- Do not build a full feature table for a simple static list.
- Do not store selected rows in Redux unless selection drives a server-side flow.
- Do not implement client-side sort/filter when data is server-paginated.
- Do not skip empty and error states.
- Do not use index as row key when rows can be reordered, deleted, or paginated.
