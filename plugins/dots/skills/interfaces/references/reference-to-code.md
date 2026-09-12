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

Open the source in the in-app browser, or the user's chosen browser. Confirm the
intended route and state before treating it as evidence. An unexpected login,
redirect, error, or loading screen is not the target. Try another available
browser when it could resolve an access problem; if access remains blocked,
identify the missing source and continue only from usable supplied evidence.

Capture each requested page from top to bottom with overlapping viewport views.
Let lazy content load and note sticky regions, scroll effects, animation, and
newly revealed controls. Return to the top to check changes caused by scrolling.
Repeat at relevant desktop and mobile sizes, using the user's device dimensions
when supplied. Keep each capture associated with its route, viewport, and state.

Use available DOM and computed-style inspection alongside screenshots to recover
copy, link destinations, component structure, layout dimensions, spacing, colors,
fonts, assets, and responsive rules. Prefer observed values to guessed CSS.

Exercise the controls within the requested experience: navigation, inputs, menus,
drawers, dialogs, tabs, carousels, hover/focus states, and sticky behavior. Isolate
each interaction from a known starting state and record its trigger, visible
result, dismissal or recovery, and relevant DOM changes. For actions that would
change live data or submit a transaction, use an available safe preview or record
the untested behavior instead of executing it merely to inspect the design.

Collect accessible source assets locally, including images, logos, icons, fonts,
video, SVGs, sprites, masks, cursors, and backgrounds needed by the captured
experience. Preserve filenames or source mappings useful for verification. Avoid
hotlinking source assets in the delivered prototype. Track unavailable assets and
substitutions through the shared asset workflow below.

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

Inventory every visible asset and its intended location: hero/background images,
article art, thumbnails, illustrations, textures, logos, product imagery, and
avatars. Record the needed dimensions, crop, focal point, and transparency.

Reuse supplied originals and project assets first. Generate missing custom
imagery when needed, using reference crops and a shared art direction, palette,
and rendering style. Inspect each result at its consuming size. Prioritize
assets visible in the initial viewport and replace temporary placeholders before
QA. If an exact asset cannot be recovered, disclose the approximation.

Keep lettering inside posters, packaging, signs, or illustrations in the image
when it belongs to the artwork. Implement editable interface copy as real text.
Do not flatten interactive UI into a screenshot or use generic placeholders
where distinctive imagery carries the design. Choose image, vector, or CSS
techniques for fidelity and editability; ordinary borders and gradients do not
require generated assets.

Use supplied fonts when available; otherwise find an available, appropriately
licensed match. Compare letterforms, weight, width, optical size, line metrics,
and wrapping rather than matching the family category alone. Choose an icon
library by shape, stroke, fill, and optical weight rather than defaulting to a
favorite. Preserve supplied brand marks.

When asset production can proceed independently, delegate bounded asset tasks
while building the page. Give each task its reference crop, dimensions, focal
point, style, output path, and consuming element. Keep asset work separate from
page edits to avoid conflicts; standard library icons need no asset subtask.

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
