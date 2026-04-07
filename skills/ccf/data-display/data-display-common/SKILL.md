---
name: data-display-common
description: Shared read-only presentation guidance for this repository. Use alongside data-display design or implementation tasks when Codex needs the common rules for detail views, cards, key-value panels, stat blocks, status chips, timelines, comparison views, null handling, and accessibility without duplicating them in role-specific skills.
---

# Data Display Common

## Purpose

Help Codex keep read-only data presentation consistent by:

- defining surface type selection and information hierarchy conventions
- centralizing key-value panel, card, stat block, status chip, and timeline rules
- specifying null/empty field handling and accessibility patterns
- removing duplicated setup from the data-display designer and implementor skills

## When to use this skill:

- The primary UI goal is presenting information the user reads, not acts on.
- A designer or implementor skill needs shared hierarchy, null handling, or status indicator guidance.
- The task involves a detail view, profile panel, record summary, or metadata section.

### Do NOT use this skill if:

- The display surface contains significant interactive elements. use the appropriate skill for those parts.
- The surface is primarily for taking actions, changing settings, invoking tools, or navigating between workflows. Use a different UI skill such as `component-*`, `layout-*`, `forms-*`, `navigation-*` or another one instead.
- The display surface contains significant interactive elements and the user reads the content mainly to decide what action to take. treat it as an action surface, not a data-display surface.
- The task is primarily about fetching the data to display. use `data-fetching-common`.
- The task is a list or table of records. use `tables-and-lists-common`.

## Inputs

- The data domain and fields being displayed.
- The hierarchy or relative importance of the information.
- Whether status, state, or category indicators are present.

## Output Format

This skill does not define a standalone deliverable. It supplies shared data-display guidance that the designer and implementor skills should apply.

## Workflow

### 1. Classify the surface before selecting a display pattern

Ask:
- Is the user's primary goal to read and understand information?
- Or is the user's primary goal to take an action, configure something, or move to another workflow?
- If the primary goal is action, this skill should not lead. route to a different UI skill like `layout-*`, - `component-*`, `forms-*`, `navigation-*` or another as appropriate.

If actions are secondary and the content is still primarily read-only, continue with this skill.

### 2. Select the display surface type

| Surface                   | Use when                                            |
| ------------------------- | --------------------------------------------------- |
| Detail view / record page | Full context for a single entity                    |
| Summary card              | Scannable snapshot in a list or grid                |
| Key-value panel           | Structured metadata with clear label-value pairs    |
| Stat block                | Single metric or KPI with optional trend/delta      |
| Status chip / badge       | Inline state, category, or classification indicator |
| Timeline                  | Chronological event sequence for an entity          |
| Comparison view           | Side-by-side presentation of two or more entities   |
| Metadata panel / sidebar  | Supporting detail alongside a primary content area  |

### 3. Information hierarchy

Structure into three levels:

1. **Primary**. entity identity and most critical status
2. **Secondary**. fields most often referenced or acted on
3. **Tertiary**. supporting metadata, audit fields, rarely-used details

Apply hierarchy through visual weight (size, contrast) and spatial proximity. not color alone. Use progressive disclosure for tertiary fields.

### 4. Key-value panel conventions

- Label and value are visually distinct (label: muted/smaller; value: primary weight).
- Labels use sentence case from i18n keys. no hardcoded label strings.
- Null values render as ``(em dash). never as empty space or raw`null`.
- Very long values truncate with a tooltip expansion affordance.
- Related fields are grouped with a section heading.
- Two-column (label left, value right) for compact panels; single-column for wider sections.

### 5. Summary card conventions

- Communicates entity's primary identity + one or two key fields.
- Status chip always visible on the card surface.
- Cards in a grid share the same height within a row unless variation is explicitly designed.
- Card loading state uses a skeleton matching the card's content regions.
- Maximum 5-6 fields per summary card.

### 6. Stat block conventions

- Primary metric is the most prominent element.
- Trend/delta uses both directional color and icon. never color alone.
- Time period or context label is always present.
- Zero and null states are distinct: `0` means no activity; null means data unavailable.

### 7. Status chip and badge conventions

- Each variant has a semantic color, icon, and label. defined in the design system, not ad hoc.
- Never communicate status by color alone.
- Chip text comes from i18n keys.
- Show the single most relevant status. do not stack multiple chips for the same dimension.

### 8. Timeline conventions

- Newest-first by default unless domain convention is chronological.
- Each event shows: timestamp, actor (if applicable), event description.
- Relative time for recent events; absolute date for older events (threshold: 24 hours).
- Paginate or lazy-load long timelines.

### 9. Null and empty field handling

| Situation               | Render                                   |
| ----------------------- | ---------------------------------------- |
| Value is null/undefined | `` (em dash) or "Not set"                |
| Value is 0 (numeric)    | `0`. never treat as empty                |
| Value is empty string   | Treat as null. render ``                 |
| Value is loading        | Skeleton or inline spinner               |
| Value is an error       | Error indicator with retry if applicable |

Use consistent null rendering across the entire app.

### 10. Accessibility baseline

- Wrap detail sections in `<section>` with `aria-labelledby` pointing to the section heading.
- Use `<section>` for document structure, not as an automatic visual wrapper or card boundary.
- Status chips: `aria-label` when chip label alone is insufficient for context.
- Truncated text: tooltip must be keyboard-accessible.
- Do not use `<table>` for key-value panels. use labeled groups.

## Guardrails

- Do not hardcode label strings. use i18n keys.
- Do not render null as empty space. always use an explicit placeholder.
- Do not communicate state by color alone.
- Do not load all timeline events at once. paginate long lists.
- Do not flatten information hierarchy. always structure into primary, secondary, and tertiary.
- Do not use this skill for action rails, command panels, settings surfaces, or tool shelves.
- Do not use `<section>` as a styling hook or automatic bordered container.
- Do not create a separate visual section for every small field group; consolidate related content into a small number of readable blocks.
- If actions outnumber read-only fields, or the surface is dominated by buttons, this skill should not lead.
