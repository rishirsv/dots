---
name: navigation-implementor
description: Implement navigation UI surfaces aligned to existing repository conventions. Use when asked to create or update nav bars, sidebars, tab bars, breadcrumbs, or contextual menus in an identified app, including active state wiring, URL-reflected state, keyboard navigation, and accessibility.
---

# Navigation Implementation

## Purpose

Help Codex complete navigation implementation work end-to-end by:

- translating a navigation design or scoped UI task into repository-aligned React component code
- keeping active state derivation, URL strategy, keyboard navigation, and ARIA consistent with local patterns
- relying on `../navigation-common/SKILL.md` for shared conventions instead of duplicating them here

## When to use this skill:

- The user wants a navigation surface created or updated in code.
- The work includes active state wiring, collapsible groups, tab routing, or breadcrumb generation.
- The task needs accessibility, keyboard navigation, and deep linking in addition to the visual structure.

### Do NOT use this skill if:

- The user only wants a navigation design/spec with no code changes.
- The task is about route guard logic or URL structure changes. use `routing-implementor`.
- The surface is a form dropdown. use the forms implementor.

## Inputs

- A `## Navigation Design (for navigation-implementor)` block when available.
- Or a scoped task description plus access to nearby navigation component patterns.

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for active state derivation, state persistence, and ARIA

## Workflow

1. Read `../navigation-common/SKILL.md` and apply its shared conventions.
2. Implement in this order:
   - Surface shell with correct landmark element (`<nav aria-label="...">`, `role="tablist"`, `<ol>` for breadcrumb)
   - Item rendering from config or route definition. no hardcoded per-item JSX
   - Active state: derive from `useLocation` / `useMatch`. no `useState` for current item
   - Collapsible groups: `aria-expanded` on trigger, auto-expand active group on mount
   - Responsive behavior: drawer pattern for sidebar on narrow viewports, focus management on open/close
   - Deep linking: sync tab or group state to URL param or path segment
   - Skip nav link if not already present in the layout shell
3. Verify all interactive elements are keyboard-operable per the shared surface-specific rules.
4. Confirm no route guard logic has leaked into the navigation component.

## Guardrails

- Never manage active item state with `useState`. always derive from router location.
- Never render inactive tab content hidden with CSS. conditionally render via route outlet.
- Never duplicate the navigation structure across multiple components. use a single config source.
- Never add route guard logic inside a navigation component.
- Do not introduce a new navigation library unless existing patterns are confirmed absent.
