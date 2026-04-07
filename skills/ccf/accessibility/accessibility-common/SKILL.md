---
name: accessibility-common
description: Shared accessibility guidance for React TypeScript UI work. Use alongside accessibility design or implementation tasks when Codex needs the common checklist for semantics, keyboard behavior, focus management, labeling, ARIA, dynamic announcements, and repository-aligned accessibility review.
---

# Accessibility Common

## Purpose
Help Codex keep accessibility design and implementation work consistent by:
- defining the shared accessibility review baseline
- identifying the repository context that must be checked before making a plan or code change
- centralizing reusable accessibility rules so designer and implementor skills do not duplicate them

## When to use this skill:
- The task is about accessibility design, accessibility fixes, or accessibility review for React TypeScript UI.
- A designer or implementor accessibility skill is being used and needs the shared accessibility checklist.
- Codex needs a single source of truth for semantics, keyboard behavior, focus, labeling, ARIA, and announcements.

### Do NOT use this skill if:
- The task is not about UI accessibility behavior.
- The task only needs a generic component or form design with no accessibility-specific depth.
- The work is purely visual styling with no impact on interaction, semantics, or assistive technology behavior.

## Inputs

- The target app, feature, or surface in scope.
- Either a task description, a design request, or a list of known accessibility issues.
- Nearby repository patterns for primitives, dialogs, forms, tables, alerts, and focus behavior when available.

## Output Format

This skill does not define a standalone deliverable. It supplies the shared checklist and guardrails that the designer and implementor accessibility skills should apply.

## Workflow

### 1. Inspect repository context

1. Identify the owning app and target surface.
2. Check nearby conventions for:
   - component primitives such as button, input, dialog, menu, tabs, and table
   - styling and focus ring patterns
   - labeling, validation, and error presentation
   - toast, alert, and status announcement behavior
3. Prefer established local patterns over introducing new abstractions.

### 2. Build the accessibility inventory

1. List each interactive or stateful surface in scope:
   - buttons, links, inputs, menus, tabs, tables, dialogs, alerts, async states
2. Call out known or likely risk areas:
   - icon-only controls without names
   - non-semantic clickable containers
   - custom composite widgets
   - modal or popover focus behavior
   - dynamic updates that may need announcements
   - validation, error, empty, and loading states

### 3. Apply the shared accessibility checklist

1. Semantics and structure:
   - prefer semantic HTML before ARIA
   - define landmarks, headings, labels, grouping, and reading order
2. Keyboard behavior:
   - ensure logical tab order
   - use Enter and Space according to the control type
   - only specify arrow-key behavior for composite widgets that require it
   - support Escape for dismissible UI when applicable
3. Focus management:
   - define initial focus, trap behavior, and restore behavior for dialogs/popovers
   - ensure predictable focus after submit, navigation, or dynamic view changes
   - handle validation failure focus according to local patterns
4. Labeling and descriptions:
   - prefer visible labels for form controls
   - ensure icon-only controls have accessible names
   - connect helper text and errors with `aria-describedby` only when needed
5. ARIA usage:
   - add ARIA only where semantics are insufficient
   - keep ARIA roles, states, and relationships synchronized with behavior
   - avoid redundant or conflicting ARIA
6. Dynamic announcements:
   - decide whether loading, success, error, or result updates need announcement
   - use alert/status patterns that match the repository
   - avoid noisy live regions
7. Visual accessibility constraints:
   - maintain visible focus indication
   - avoid relying on color alone for meaning
   - preserve or improve contrast using existing tokens or theme patterns where feasible
   - ensure content remains readable and operable at increased text size and narrow widths; text must reflow instead of overlapping

### 4. Check against WCAG-aligned concerns

Validate the parts of the task affected by:
- `1.3.1` Info and Relationships
- `1.4.4` Resize Text
- `1.4.10` Reflow
- `2.1.1` Keyboard
- `2.4.3` Focus Order
- `2.4.7` Focus Visible
- `3.3.1` Error Identification
- `3.3.2` Labels or Instructions
- `4.1.2` Name, Role, Value

## Guardrails

- Prefer semantic HTML over ARIA.
- Keep changes close to the owning feature or component unless the repository already centralizes that concern.
- Do not introduce new dependencies unless explicitly requested.
- Do not propose shared abstractions or utilities without clear existing reuse pressure.
- Keep recommendations concrete, testable, and tied to the scoped task.
