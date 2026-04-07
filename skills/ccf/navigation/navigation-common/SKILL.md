---
name: navigation-common
description: Shared in-app navigation UI guidance for this repository. Use alongside navigation design or implementation tasks when Codex needs the common rules for surface type selection, active state derivation, sidebar conventions, tab bars, breadcrumbs, deep linking, back behavior, and accessibility without duplicating them in role-specific skills.
---

# Navigation Common

## Purpose

Help Codex keep navigation UI work consistent by:

- distinguishing navigation UI concerns from route/guard concerns (routing-common owns those)
- centralizing active state, deep linking, and back behavior conventions
- defining accessibility and keyboard navigation requirements per surface type
- removing duplicated setup from the navigation designer and implementor skills

## When to use this skill:

- The task involves adding or modifying a nav bar, sidebar, tab bar, breadcrumb trail, or contextual menu.
- A designer or implementor skill needs shared active state, deep linking, or accessibility guidance.
- Navigation state persistence across page transitions needs to be defined.

### Do NOT use this skill if:

- The task is only about route definitions, guards, or redirects (use `routing-common`).
- The surface is a dropdown used inside a form field. use the forms skill.
- The work is a layout shell with no nav interaction logic.
- The task is a data table's pagination control. use `tables-and-lists-common`.

## Inputs

- The target app and navigation surface type.
- The route/page structure the navigation maps to.
- Whether navigation state needs to survive page transitions.

## Output Format

This skill does not define a standalone deliverable. It supplies shared navigation guidance that the designer and implementor skills should apply.

## Workflow

### 1. Select the navigation surface type

| Surface                    | Use when                                                     |
| -------------------------- | ------------------------------------------------------------ |
| Top nav bar                | Primary app-level destinations, horizontal layout            |
| Sidebar / left nav         | Many destinations, hierarchy, collapsible groups             |
| Tab bar                    | Peer-level views within a page or section                    |
| Breadcrumb                 | Deep hierarchy, helps user understand location and backtrack |
| Contextual / overflow menu | Per-item actions not worth permanent nav space               |
| Step indicator             | Linear flows (wizards, multi-step forms)                     |

Do not mix surface types without a clear information architecture reason.

### 2. Active state conventions

- Derive active state from the router's current location (`useLocation`, `useMatch`). never from `useState`.
- Parent nav items are active when any child route is current.
- Exact matching for leaf items; prefix matching for parent items.
- Apply active styles via class or attribute. provide both visual and non-visual indicators.

### 3. Sidebar conventions

- Group expand/collapse: local state for simple sidebars; Redux or persisted preference when state must survive navigation.
- Auto-expand the group containing the currently active route on mount.
- Collapsed (icon-only) mode: visible tooltip on hover/focus for all labels.
- Responsive: sidebar becomes a drawer on narrow viewports; closes on navigation, overlay click, and `Escape`.
- Focus: moves into the drawer on open; returns to trigger on close.

### 4. Tab bar conventions

- Tabs are peer-level navigation. do not use for sequential steps.
- Active tab corresponds to current route segment or query param (URL-reflected).
- Inactive tab content is not rendered. do not hide with CSS.
- Do not nest tab bars more than one level deep.
- Keyboard: arrow keys between tabs; `Tab` moves focus to tab panel content.

### 5. Breadcrumb conventions

- Build from the current route hierarchy. do not hardcode per-page.
- Each crumb except the last is a link; the last is `aria-current="page"` and not a link.
- Use `<nav aria-label="Breadcrumb">` wrapping an `<ol>`.
- Truncate on narrow viewports, preserving first and last crumbs.

### 6. Deep linking conventions

Navigation state that users should be able to bookmark must live in the URL:

- Active tab: URL path segment or `?tab=` query param.
- Applied filters from a navigation entry point: query params.
- Ephemeral state (hover, transient drawer): component state only.

### 7. Back behavior conventions

- Do not push history entries for transient UI (modal open, tooltip).
- Explicit back buttons use `router.back()` only when the previous entry is within the same app; otherwise navigate to a known parent route.
- Wizard steps: each step is a distinct history entry so back steps backward through the wizard.

### 8. Accessibility baseline

- Top nav and sidebar: `<nav>` landmark with a unique `aria-label`.
- Multiple `<nav>` elements on the same page must have distinct labels.
- Active item: `aria-current="page"` on the current link.
- Tab bars: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`.
- Sidebar collapsible groups: `aria-expanded` on the group trigger.
- Skip nav link: "Skip to main content" at the top of each page layout.

## Guardrails

- Do not manage active nav state with `useState`. derive from router location.
- Do not use tabs for sequential/wizard flows.
- Do not put ephemeral UI state in Redux or URL.
- Do not allow navigation surfaces to own route guard logic.
- Do not duplicate nav structure across multiple components. define it once in config or a layout component.
