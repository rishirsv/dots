# Reference to Code

Recreate a selected image, screenshot, mockup, or live URL as a faithful,
responsive, interactive interface. Default to browser-openable local HTML with CSS and
JavaScript. Use an existing app's stack when the task is to integrate there.

## Inputs

- **Target:** the exact selected image, screenshot, mockup, generated result,
  or URL and the routes to reproduce.
  A written brief alone does not establish visual fidelity.
- **Context:** relevant project code, brand assets, fonts, tokens, components,
  content, and behavior requirements already supplied or available locally.
- **Scope:** static mock, interactive prototype, or production integration;
  reference viewport and supported sizes. Infer the platform from the task and
  project, not the screenshot's aspect ratio.

Use this workflow when the reference is the target to reproduce. For inspiration
or redesign requests, preserve only the aspects the user selected; do not assume
that resemblance means an exact clone.

## Inspect The Reference

### Image Or Mockup

Resolve the selected target before building. For numbered options, use the
user-visible image order, not generation or submission order. Prefer an exact
attachment or image identifier over an ordinal. If the selection is ambiguous,
ask which image to reproduce rather than implementing a nearby option.

Inspect the original at full resolution and retain detail crops where typography,
icons, or assets need closer comparison. A still image establishes appearance;
use the brief and product context for behavior it cannot show.

### Live URL

Read [capture-live.md](capture-live.md) to record the requested routes, states,
assets and responsive behavior before recreating them.

## Read The Target

Inspect the whole composition, then zoom into text, controls, and assets.
Map the sections, content order, grid, major proportions, alignment, margins,
padding, spacing rhythm, density, and visible states. Separate page content from
browser chrome, device frames, and the surrounding presentation canvas.

Use source values when available; otherwise estimate relationships and record
uncertainties that affect fidelity. For live sources, use the captured responsive behavior. Match the reference
viewport first, then
adapt the composition to the supported sizes. For a phone prototype, use the
reference or requested device dimensions and retain reachable primary actions
without accidental horizontal scrolling or clipping.

## Prepare Assets, Type, And Icons

Read [recreation-assets.md](recreation-assets.md) when the target includes
imagery, distinctive fonts or icons that must be recovered or matched.

## Build The Local Interface

Use one HTML file with embedded CSS and JavaScript when practical, with local
asset files as needed. Add a framework or build tooling only when the existing
project or requested behavior needs it. Organize repeated styles and components
so corrections propagate consistently.

Build from captured evidence and preserve the target's copy, imagery, hierarchy,
and visual direction. In an
existing app, connect controls to its state and navigation rather than creating
parallel behavior to mimic the screenshot.

Unless the user requests a static mock, make the core experience work:

- Navigation, links, tabs, menus, and primary calls to action.
- Visible inputs, filters, toggles, selections, and forms.
- Relevant hover, focus, selected, open/closed, loading, empty, error, and success
  states.
- The main task or journey from entry through its outcome.

Use local sample data and in-memory state for prototypes. Keep simulated outcomes
honest; add authentication, persistence, external integrations, or production
services only when the task requires them. Add screens only when needed for the
requested journey. Peripheral visual-only controls should be identifiable as
such in the handoff.

## Preview And Iterate

Open the HTML file by its absolute filesystem path in the in-app browser. Use a
local server when modules, routing, or browser restrictions require one, and
open its local URL. Inspect the rendered interface, exercise primary interactions,
and investigate console errors affecting the experience. For URL references,
replay the captured interactions and compare desktop/mobile behavior with the
corresponding source states.

Run [design-qa.md](design-qa.md) against the selected target at matching viewports
and states. Its default is one complete correction iteration; use the user's
requested count when specified. Retain comparison captures and post-fix evidence
in the task's existing record. A running server or successful build does not
establish visual fidelity.

Return the clickable HTML file or local preview URL, the QA result, and material
remaining differences or unverified behavior. Reaching the iteration limit may
leave QA blocked; deliver the reviewable prototype with that status rather than
claiming a match or silently continuing beyond the limit. Keep a required preview
server available for review. Local delivery is sufficient; publishing is a
separate request.
