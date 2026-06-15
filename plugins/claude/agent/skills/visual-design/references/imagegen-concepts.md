# Image Gen Concepts

Read this when concepting with Image Gen, generating assets, implementing from
an accepted concept, translating a screenshot/mockup/reference image into code,
or doing fidelity QA against an accepted design.

## When To Use Image Gen

Use Image Gen for visual concepts unless the user explicitly opts out or the
task is a small UI fix inside an existing design system. Follow the installed
Image Generation skill for tool choice, save-path behavior, editing, asset
generation, and transparency workflows.

External setup should not block Image Gen concepting, static UI work, or design
review that does not exercise external behavior. When the app needs
capabilities outside frontend design, coordinate with the installed skill for
that capability instead of inventing placeholder setup instructions.

If a capability-specific setup skill exists, use its credential and provider
flow instead of fake keys, placeholder environment variables, or manual setup
instructions. Design concepting can proceed before that setup when it does not
exercise the external behavior.

## Image Gen Brief

Before calling Image Gen, copy concrete details from the request, screenshots,
existing app, repo docs, or brief. Do not reduce them to a generic category like
"modern landing page" or "clean dashboard."

Include:

- purpose, audience, and primary user action
- complete requested scope: full page, app screen, dashboard, game screen,
  coordinated sections, states, responsive variants, or detail concepts
- selected visual source when one exists: screenshot, mockup, Figma frame,
  product URL, reference image, Image Gen output, viewport, and state
- exact visible content: headlines, labels, CTAs, nav items, section names,
  table fields, sample entities, dates, prices, statuses, media requirements,
  and required copy
- structure: first viewport, section order, sidebars, rails, drawers, grids,
  tables, charts, media areas, forms, footers, status regions, and responsive
  continuation
- interaction model: selected states, hover/focus affordances, filters, tabs,
  mode switches, creation/editing flow, success states, playback states, game
  HUD, or other local-state behavior
- visual system: palette mood, typography personality, density, spacing rhythm,
  radii, shadows, borders, container model, card usage, icon style, image
  treatment, brand mark direction, and reference style
- implementation constraints: code-native app UI text and controls, reusable
  component families, tokens, accessible/responsive layout, and practical
  production handoff
- negative constraints: no header-only crops for full-surface work, no extra
  product areas, no fake metrics, no decorative filler, no default card grids,
  no invented hero eyebrows/kickers/badges/pills, no unrelated sections, no new
  claims, and no moving true app UI text into images

For complex dashboards, tools, editors, or multi-panel product surfaces, assume
React + Vite unless the user or repo specifies another framework.

## Concept Quality Bar

Every concept should feel like a professional product mockup by a senior product
designer:

- clean, airy, distinctive, complete, readable, and not repetitive by default
- one clear creative idea or visual point of view
- full requested surface, not only a hero, unless the user asked only for a hero
- strong first viewport with clear product signal and primary action
- coherent rhythm across sections, states, and responsive continuation
- excellent typography and intentional whitespace, including control chrome
- simpler by default: fewer, stronger visual elements
- consistent palette, spacing, components, icon style, imagery, shadows,
  borders, gradients, and container model
- purposeful motion or interaction cues that can be implemented later
- specific, non-generic copy when exact copy is not supplied

Default to roughly 7/10 creativity: distinctive and art-directed, but still
implementable. "Clean" means edited, airy, legible, and not cluttered or
repetitive.

Reject concepts that are header-only for full-surface asks, cluttered, generic,
repetitive, under-specified, unreadable, over-decorated, impractical to
implement, or off-spec.

## Image Count And Clarity

Readability and extraction quality outrank compact presentation.

For a 1-section request, generate 1 primary section concept. For 2-10 requested
or implied sections, default to 2-10 coordinated primary section concepts, one
fresh image per major section, when that improves readability.

Use an optional full-page overview only for overall rhythm, section order, and
transition logic. Do not treat the overview as the only implementation spec if
it compresses text, buttons, card anatomy, or spacing.

For dashboards, tools, editors, and dense app screens, generate the full primary
screen plus focused state or detail concepts for dense areas such as sidebars,
tables, inspector panels, modals, charts, toolbars, forms, selected states, and
empty states.

If any concept screenshot is too small, blurry, cropped, crowded, or ambiguous,
generate a fresh standalone section, state, or detail screenshot before coding.
Do not crop, slice, zoom, or reuse part of an older full-page image as the main
reference.

For games, plan a concept pass and a production asset pass: sprites or sprite
sheets, terrain/platform tiles, collectibles, hazards, goals, props, HUD
placement, and parallax/background layers as needed. HUD text, scoring,
controls, physics, hit boxes, and game state stay code-native.

## Asset Planning

Keep real app UI text, form fields, nav, metrics, tables, and controls in code.

Use Image Gen for logos, brand marks, hero imagery, product renders, background
scenes, product images, packaging, signage, posters, cutouts, textures,
thumbnails, avatars, empty-state art, illustrated objects, and game art.

For screenshot/mockup recreation, catalog every visual asset before building:
hero and background images, article or product imagery, thumbnails, decorative
illustrations, textures, motifs, logos, product renders, avatars, posters,
packaging, signs, and any art embedded in cards or empty states. Generate or
extract individual production assets for those roles instead of leaving generic
placeholders.

If text belongs inside an asset, quote the exact asset text and require
verbatim rendering. If the asset needs to layer into code-native UI, request a
transparent background or clean cutout.

Do not crop a full-page concept into production UI as a shortcut. Recreate or
isolate needed assets with Image Gen. Supporting assets must match the accepted
layout concept and must not introduce a new visual direction.

Do not substitute div art, CSS art, decorative gradients, emoji, text glyphs,
placeholder boxes, inline doodles, or handcrafted SVG illustrations for real
visual assets shown or implied by the reference. Use Image Gen for logos, brand
marks, and non-icon visual assets. SVG is fine for faithful icons and
directional glyphs.

Choose fonts and icon libraries that match the accepted design. Use the repo's
existing assets first when they match. Do not default to Lucide, system fonts,
or generic nearby icons when the reference calls for a different visual
language.

## Selected Image To Code Path

Use this path when the user provides or accepts a screenshot, mockup, Figma
frame, reference image, or Image Gen result that must be recreated in code.

Do not start faithful recreation without both a confirmed brief for this exact
request and a selected visual target. A written brief alone is enough to ideate,
but not enough for image-to-code implementation. If the visual target is missing,
ask for it or generate concepts first.

Treat the selected image as the design spec. If it shows a mobile viewport,
build and verify mobile first. If the target viewport is unclear, default to
desktop while still checking responsive behavior.

Before coding:

- inventory all sections, states, major regions, and image assets
- measure layout relationships: section heights, gutters, alignment, spacing,
  element sizes, crop logic, and first-viewport composition
- identify matching fonts, icon family, icon weight, and control typography
- decide which visible content is code-native UI text and which text belongs
  inside image assets
- record interactions implied by the mockup: navigation, hover/focus, selected
  states, tabs, filters, menus, modals, forms, playback, or generated-output
  demos

Build the complete requested surface, not a static shell. Visible controls need
real local behavior and states unless the accepted brief explicitly calls for a
static mock. Do not add new routes, pages, or product areas unless requested.

Run the app locally, capture the same viewport and interaction state as the
reference, then compare the reference image and browser render directly. If the
view or state does not match, capture the missing view before judging fidelity.

Do not hand off until P0/P1/P2 visual QA issues are fixed or a concrete blocker
is recorded. P3 polish can be listed as follow-up notes, but anything that would
draw a design-review comment about fidelity, readability, assets, typography,
or interaction quality must be fixed before final.

## After Concept Acceptance

Once accepted, the concept is a production design spec. No creative liberties:
do not reinterpret layout, visible copy, hierarchy, container model, styling,
imagery, density, sections, colors, gradients, typography, or assets unless the
user approves it or a concrete blocker requires it.

Before coding, extract:

- visible copy, nav labels, CTAs, section headings, data labels, and proof text
- per-section/state image inventory: source concept screenshot, native aspect,
  visual priority, readable text, typography relationships, spacing,
  button/control styling, component/container rules, dominant colors, and
  unresolved details that required a fresh extraction screenshot
- first viewport composition, section order, downstream states, and responsive
  continuation, including next-section preview when relevant
- allowed above-the-fold copy list
- section continuity plan: how adjacent sections connect, and which major
  component families are allowed. Treat unshown major components as prohibited
  unless the user requested them or a required workflow cannot function without
  them.
- palette, including whether backgrounds are true white, off-white, cream, gray,
  dark, or tinted
- typography system for content and UI chrome
- spacing scale, radii, borders, shadows, elevation, and motion timing
- component families, variants, and container model
- image treatment, hero media overlays, masks, fades, transparency, and asset
  roles
- standalone asset needs: logos, brand marks, product labels, packaging,
  posters, signs, product renders, branded background objects, transparent
  cutouts, and matching asset passes
- game asset needs: transparent sprites or sprite sheets, terrain/platform
  tiles, collectibles, hazards, goals, props, and parallax/background layers
- icon inventory: metaphor, outline vs filled style, stroke width, size, color,
  container, alignment, spacing, and state treatment
- implementation architecture for complex apps: app shell, navigation, feature
  regions, reusable primitives, data/state helpers, chart/table/form modules,
  asset modules, and responsive boundaries
- core workflow controls that must respond: selected states, filters, tabs,
  edits, creation flow, success state, playback, game controls, or generated
  result demo

Color fidelity is mandatory. Do not warm up, cool down, mute, or "tastefully"
reinterpret the accepted palette. If the concept uses white, implement white,
not cream, ivory, beige, warm gray, or softened off-white.

Hero media treatment must match the accepted design. If the hero image has no
color overlay or tint, do not add one. Use matching assets, transparent cutouts,
edge fades, masks, or background gradients around the image instead of washing
the image with an overlay.

Do not substitute generic nearby icons for accepted icons. Use the repo's icon
set or lucide only when it matches the concept. Otherwise create production
quality SVG variants that preserve metaphor, fill/stroke style, optical weight,
size, color, alignment, and state behavior.

For multi-section pages, implement and verify one section or contiguous viewport
at a time. Compare the browser screenshot to the relevant section concept, fix
visible drift, then move to the next section.

## Implementation Fidelity

Build the real usable surface first, not a marketing wrapper around a future
app.

For new complex app UIs without an existing framework constraint, use React +
Vite and structure it like a senior front-end engineer would: small focused
components, a clear app shell, reusable primitives, feature modules for
dashboards/tables/charts/forms, separated sample data and state helpers, shared
tokens/styles, and `App` as composition glue rather than a monolithic screen.

Implement through the extracted design system. Similar elements should use the
same component or shared style primitive; differences should be explicit
variants, not one-off copied CSS.

For multi-section pages, implement in slices that match accepted section
concepts. Start with the first viewport, compare its browser screenshot to the
section concept, fix visible drift, then continue section by section. Do not
defer all visual comparison until the whole page is coded.

Do not add new above-the-fold copy, hero eyebrows/kickers, explanatory labels,
subtitles, category text, proof strings, or unshown major UI components unless
they appear in the accepted concept, came from the user, or are recorded as an
intentional deviation. If semantic HTML, SEO, or accessibility requires changing
heading levels, change semantics first; do not invent compensating visible copy.

Define typography on controls deliberately. Do not rely on browser defaults or
inherited 16px sizing for buttons, tabs, inputs, toolbars, sidebars, inspector
panels, layer rows, status bars, command palettes, table cells, chart labels, or
export/share controls.

Preserve the container model. Do not add cards, bordered panels, floating
containers, tiles, or card grids where the spec uses open whitespace, bands,
rails, lists, tables, canvases, or full-bleed composition.

Use SVG/icon components for arrows, chevrons, carets, disclosure indicators,
pagination arrows, and carousel arrows. Do not use plain text glyphs unless the
concept intentionally does.

Custom SVG icons must be production-quality vector assets: clear `viewBox`,
clean geometry, consistent stroke widths, aligned joins/caps, balanced negative
space, optical centering, scalable paths, no jagged placeholder shapes, and
`currentColor` or explicit fills only when they match the design system.

Make app interfaces experiential: local state, meaningful selected states,
working filters/tabs/forms, editable or creatable items, success states,
playback controls, game controls, or simulated generated output where
appropriate.

Keep implementation production-oriented: semantic markup, stable responsive
dimensions, no fragile hardcoded hacks, and type/lint/test checks when the repo
supports them.

## Verification

Use Browser/IAB first. Use Playwright Chromium only when Browser/IAB is
unavailable or unreliable, and state the fallback reason.

Before final handoff, inspect the accepted concept and latest browser screenshot
with `view_image` in the same QA pass. This cannot be skipped or replaced with
browser inspection, functional testing, or build checks alone.

Capture the implementation at the accepted concept's native dimensions when
practical. If that is not practical, record the blocker and also verify the
current browser viewport.

Write a fidelity ledger before final:

| Mismatch | Concept evidence | Render evidence | Fix made or reason not fixed |
|---|---|---|---|

Inspect at least five concrete comparison points: copy, layout, typography,
palette/gradients, asset treatment, spacing/container model, responsive
behavior, icon treatment, motion, or interaction state.

Run an above-the-fold copy diff against the allowed copy list. Added, removed,
renamed, or reordered visible copy must be fixed or listed as an intentional
deviation.

Audit typography everywhere, not just the hero or main canvas. Check headings,
body, captions, labels, toolbar controls, sidebar rows, tabs, inputs, inspector
fields, status bars, command palettes, export/share buttons, table cells, chart
labels, and mobile line breaks. Use computed CSS sizes, weights, and
line-heights when screenshots suggest drift.

Audit icons wherever they appear: nav, buttons, cards, toolbar controls,
sidebars, tables, status indicators, empty states, pagination, carousels, and
mobile controls. Check metaphor, stroke/fill style, size, color, alignment,
optical weight, spacing, and state changes against the accepted concept.

For canvas/editor apps, audit app chrome separately from canvas or document
text. Default zoom and pan are part of the spec; persisted local state must not
hide seed, scale, or typography fixes during verification.

Verify generated assets load, are framed correctly, and do not obscure text or
controls. Verify the core workflow updates real local UI state. Do not ship
inert controls, fake media progress, hidden required media, or placeholder
interactions.

Functional QA does not count as fidelity QA. Passing build checks, clicking
controls, or verifying local state cannot replace concept-to-screenshot
comparison, native-size checks, and the written mismatch ledger.

Ask explicitly: is this agency-signoff faithfully implemented, and would a
great design agency sign off on this exact implementation of the accepted
design? If the answer is no, keep editing or report the concrete blocker.

Hard stops include clipped primary content, accidental wrapping, prototype-like
layout, rough seeded data, placeholder boxes, generic assets, unfinished cards,
code-drawn game placeholders replacing concept art, invented visible copy,
invented hero eyebrows/kickers/pills/badges, mismatched colors or gradients,
white backgrounds changed to cream/off-white, unapproved hero image overlays,
missing or generic substituted icons, mismatched icon style or stroke weight,
images that do not blend with the background, hidden required media, fake media
progress, inert controls, unreadable text, type-scale drift, browser-default
control typography, mobile overflow, unprofessional responsive collapse, stale
debug artifacts, and any visible drift from the accepted spec.

## Final Handoff

For concept-driven implementation, include:

- accepted concept path
- rendered screenshot method
- Browser/IAB verification method or Playwright fallback reason
- `view_image` inspection of the accepted concept and latest screenshot
- native-size viewport checked or blocker
- at least five inspected comparison points
- above-the-fold copy diff result
- material mismatches fixed
- remaining intentional deviations
- core interaction path verified
- explicit statement that the implementation was faithfully verified against
  the accepted design, or the concrete blocker that prevents that claim
- if no material mismatches remain, say so directly
