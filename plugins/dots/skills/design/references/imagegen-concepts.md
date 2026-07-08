# Image Gen Concepts

Read this when concepting with Image Gen or generating visual assets. For
faithfully implementing a selected screenshot, mockup, reference image, or
accepted Image Gen concept, switch to [image-to-code.md](image-to-code.md).

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

For a standalone surface, first check that the prompt has concrete direction
for type, spacing or grid, layout skeleton, references or anchor examples, and
anti-patterns. Fill gaps from repo evidence when it is safe; otherwise return
to the brief gate instead of generating from broad mood words.

Include:

- purpose, audience, and primary user action
- complete requested scope: full page, app screen, dashboard, game screen,
  coordinated sections, states, responsive variants, or detail concepts
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

Every concept must give implementation enough visual information to build from:

- one visible creative idea or visual point of view
- full requested surface, not only a hero, unless the user asked only for a hero
- first viewport shows the product, primary user action, and the next section or
  continuation
- coherent rhythm across sections, states, and responsive continuation
- typography hierarchy and whitespace for headings, body, controls, and dense
  chrome
- fewer visual elements when extra decoration would not change the user's task
- consistent palette, spacing, components, icon style, imagery, shadows,
  borders, gradients, and container model
- purposeful motion or interaction cues that can be implemented later
- specific, non-generic copy when exact copy is not supplied

Default to roughly 7/10 creativity: distinctive and art-directed, but still
implementable. "Clean" means edited, airy, legible, and not cluttered or
repetitive.

Reject concepts that are header-only for full-surface asks, cluttered, generic,
repetitive, under-specified, unreadable, over-decorated, impractical to
implement, or off-spec. Reject clean concepts too when the layout, imagery,
type, component motifs, or copy could be swapped into another product with
minimal changes.

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

When revising concepts, preserve the working structure and prompt targeted
deltas: spacing rhythm, type weight, image variety, component shape, motion
timing, or anti-pattern removal. Avoid broad resets like `make it better` when a
specific correction would keep the useful design intact.

For games, plan a concept pass and a production asset pass: sprites or sprite
sheets, terrain/platform tiles, collectibles, hazards, goals, props, HUD
placement, and parallax/background layers as needed. HUD text, scoring,
controls, physics, hit boxes, and game state stay code-native.

## Asset Planning

Keep real app UI text, form fields, nav, metrics, tables, and controls in code.

Use Image Gen for logos, brand marks, hero imagery, product renders, background
scenes, product images, packaging, signage, posters, cutouts, textures,
thumbnails, avatars, empty-state art, illustrated objects, and game art.

If text belongs inside an asset, quote the exact asset text and require
verbatim rendering. If the asset needs to layer into code-native UI, request a
transparent background or clean cutout.

Do not crop a full-page concept into production UI as a shortcut. Recreate or
isolate needed assets with Image Gen. Supporting assets must match the accepted
layout concept and must not introduce a new visual direction.

SVG is fine for faithful icons and directional glyphs. Use Image Gen for logos,
brand marks, and non-icon visual assets.

## Concept Acceptance Handoff

Once accepted, the concept is a production design spec. No creative liberties:
do not reinterpret layout, visible copy, hierarchy, container model, styling,
imagery, density, sections, colors, gradients, typography, or assets unless the
user approves it or a concrete blocker requires it.

The Image Gen workflow ends with a selected concept or asset set. Before coding,
switch to [image-to-code.md](image-to-code.md) for extraction, implementation,
interaction behavior, screenshot capture, and fidelity QA.
