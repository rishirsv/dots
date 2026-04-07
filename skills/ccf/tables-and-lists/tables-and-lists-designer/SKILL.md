---
name: tables-and-lists-designer
description: Produce a Table/List Design block describing the column model, interaction capabilities, state requirements, and component breakdown that an implementation agent can follow. Use when asked to design a list or table UI (without implementing code), define sorting/filtering/pagination strategy, row/bulk actions, and empty/loading/error state handling aligned to existing repository conventions.
---

# Table and List Design

## Purpose

Help Codex complete table and list design work end-to-end by:

- producing one implementation-ready `## Table/List Design (for tables-and-lists-implementor)` block
- defining the minimum viable column model, interaction capabilities, state ownership, and component breakdown for the task
- relying on `../tables-and-lists-common/SKILL.md` for shared conventions instead of repeating them here

## When to use this skill:

- The user wants a table or list design/spec without code changes.
- The task needs explicit column definitions, sort/filter strategy, pagination approach, and action affordances.
- Another frontend skill needs a table/list design block that an implementation agent can apply directly.

### Do NOT use this skill if:

- The user wants code changes rather than a design artifact.
- The surface is a simple static list with no interaction. design inline as part of the component design.
- The task is primarily a data-fetching or Redux design problem. use `data-fetching-designer`.
- The request only needs generic list advice with no concrete column or interaction contract.

## Inputs

- Task name.
- Task description including the data domain and fields to display.
- Which capabilities are required: sorting, filtering, pagination, selection, row actions, bulk actions.

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions`
3. `## Table/List Design (for tables-and-lists-implementor)`

The design block must include only:

- **Task Goal**
- **Complexity Tier**
- **Column Model**
- **Interaction Capabilities** (sort, filter, pagination, selection. one section per capability present)
- **Row Actions**
- **Bulk Actions** (if applicable)
- **Empty, Loading, and Error States**
- **Accessibility Notes**

## Workflow

1. Read `../tables-and-lists-common/SKILL.md` and apply its shared conventions.
2. Classify the list complexity tier. state this explicitly and justify it.
3. Define the column model: for each column specify label key, data key, type, sortable flag, and any custom render note.
4. For each active capability, define the state ownership decision (local vs Redux) and the interaction model.
5. Define all row actions with their trigger, confirmation requirement, and dispatch target.
6. Define bulk actions with their conditions, confirmation requirement, and post-action behavior.
7. Specify empty, loading, and error state content for this specific domain.
8. Add any task-specific accessibility notes beyond the shared baseline.

## Guardrails

- Keep the design scoped to the list/table layer. do not design the full page layout or fetch saga here.
- Do not introduce new table component libraries unless existing ones are confirmed absent.
- State assumptions when data shape or API capabilities are unknown.
- Do not over-design. skip sections for capabilities the task does not require.
