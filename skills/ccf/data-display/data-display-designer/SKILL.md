---
name: data-display-designer
description: Produce a Data Display Design block describing the surface type, information hierarchy, field definitions, null handling, status indicators, and accessibility contract that an implementation agent can follow. Use when asked to design a read-only data presentation surface (without implementing code) aligned to existing repository conventions.
---

# Data Display Design

## Purpose

Help Codex complete data display design work end-to-end by:

- producing one implementation-ready `## Data Display Design (for data-display-implementor)` block
- defining the surface type, information hierarchy, field structure, and null handling for the task
- relying on `../data-display-common/SKILL.md` for shared conventions instead of repeating them here

## When to use this skill:

- The user wants a data display design or spec without code changes.
- The task needs explicit surface type selection, information hierarchy, field definitions, and null handling.
- Another frontend skill needs a data display design block that an implementation agent can apply directly.

### Do NOT use this skill if:

- The user wants code changes rather than a design artifact.
- The surface is primarily for actions, settings, commands, or workflow navigation. Use a different UI skill such as `component-designer`, `layout-designer`, `forms-designer`, `navigation-designer` or another one instead.
- The surface contains significant interactive elements and the content mainly supports those actions. treat it as an action surface, not a data-display surface.
- The task is a list or table of records. use `tables-and-lists-designer`.
- The request only needs generic display advice with no concrete field or hierarchy contract.

## Inputs

- Task name.
- Task description including the data domain and fields to present.
- Relative importance or hierarchy of the fields.
- Whether status indicators, timelines, or comparison views are involved.

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions`
3. `## Data Display Design (for data-display-implementor)`

The design block must include only:

- **Task Goal**
- **Surface Type and Rationale**
- **Information Hierarchy** (primary / secondary / tertiary field groupings)
- **Field Definitions** (label key, data key, type, null handling, truncation rule per field)
- **Status Indicators** (if applicable. variants, label keys, display position)
- **Timeline or Comparison Spec** (if applicable)
- **Accessibility Notes**

## Workflow

1. Read `../data-display-common/SKILL.md` and apply its shared conventions.
2. Classify the surface as read-mostly or action-mostly before designing it. if the primary outcome is taking action, stop and route to the appropriate non-data-display skill.
3. Select the correct surface type and justify the choice explicitly.
4. Group fields into primary, secondary, and tertiary. document the rationale for hierarchy decisions.
5. For each field, define: i18n label key, data key/path, value type, null render rule, truncation rule.
6. For status indicators: define each variant with its semantic color token, icon, and i18n label key.
7. Add task-specific accessibility notes beyond the shared baseline.

## Guardrails

- Keep the design scoped to the display layer. do not design fetch logic or interactive behaviors here.
- Do not hardcode label strings in the design. always reference i18n keys.
- Do not leave null handling undefined for any field.
- State assumptions when data shape or API response structure is not confirmed.
- If the primary outcome is taking an action, do not produce a data-display design block and route to another UI skill.
- Do not turn every field group into its own visual section or card by default.
