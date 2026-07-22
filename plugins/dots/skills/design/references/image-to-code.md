# Image To Code

Read this when translating a selected image, screenshot, mockup, or Image Gen
reference into an interactive website or web app.

You're tasked with recreating the selected visual target as an interactive
website or web app.

## User Context

Use saved product URLs, screenshots, reference images, codebase paths,
Storybook, tokens, design systems, brand assets, component refs, browser
preferences, and share targets as grounding material when relevant.

Do not inspect every saved reference. Inspect only what the current task needs.

## Workflow

Use this checklist in proportion to the surface. A small change within an
existing design system needs only the relevant extraction, build, and visual
verification steps.

0. Start from a brief grounded per [grounding.md](grounding.md). The brief may
   be explicitly confirmed, established by repository evidence, or stated with
   assumptions the user authorized.

1. Do not start unless you have a selected image, screenshot, mockup, or Image
   Gen result to recreate. A written brief is not enough.

2. Treat the provided image as the design to recreate.

3. If the provided design is a mobile viewport, build a mobile app. If it's
   unclear, default to desktop.

4. Review the reference design and catalog each image and icon asset. Reuse
   repository assets when they match; generate or source missing raster assets
   only when the target requires them. Zoom in so asset roles are not missed.

   Examples include:

   - Hero images including full bleed image backgrounds
   - Featured article imagery
   - Thumbnails
   - Decorative illustrations
   - Textures and background motifs
   - Logos
   - Product images
   - Avatars

   Rules:

   - Do not replace target imagery with placeholder div/CSS art, emoji, or text
     glyphs. Use appropriate raster assets for imagery and vector icons for icon
     roles.
   - If text is part of an image asset, keep it in the image asset. Examples
     include full bleed hero images, signs, posters, packaging, storefronts,
     article art, and illustrations where the type belongs to the visual
     itself. Do not crop the background image and recreate that text with
     transparent text boxes, HTML, CSS, or separate overlay layers unless the
     source clearly shows editable UI text sitting on top of the image.
   - Do not use generic placeholders where the reference implies custom visual
     content.
   - Generated assets must share the same art direction, palette, rendering
     style, and design language as the reference mockup.
   - When transparency is required, request or produce it through the installed
     image-generation workflow and verify edge quality in the final surface.

5. Define all sections of the page. For each section, record the visible layout,
   spacing, element sizes, and alignment relationships needed to recreate the
   target.

6. Find freely available fonts that match the target design.

7. Reuse the repository's icon set when it matches. Otherwise choose a fitting
   icon library rather than defaulting to one family.

   Rules:

   - If neither the repository nor a fitting library contains the required
     metaphor, a simple production-quality SVG is acceptable. Keep its geometry,
     stroke/fill, optical weight, and states consistent with the icon system.

8. Build the app starting with the repo's local prototype preflight when one
   exists. Implement every visible control, state, and interaction shown or
   implied by the target.

   Examples include:

   - Header, sidebar, tooltip, and modal interactions
   - Hover and focus states
   - Responsive navigation
   - Clickable cards and buttons
   - Animated affordances if implied by the design
   - Newsletter forms, tags, filters, or navigation elements shown in the mockup
   Rules:

   - Place every generated image asset in its intended position and replace all
     placeholders, including CSS/SVG placeholders, before proceeding.
   - Do not leave visible controls as static chrome. Do not create new pages or
     routes unless the user asks for them.

9. Run the local app.

10. Capture the local app using Codex in-app browser first. If it is
    unavailable or unreliable, use another available browser and state the
    fallback reason.

11. Run a rendered visual check. For routine work, inspect the relevant
    viewports and states directly and fix visible drift. Run the independent
    surface critique in [design-review](../../design-review/SKILL.md) as a
    blocking gate when the implementation is target-driven,
    acceptance-critical, externally shipped, brand- or accessibility-sensitive,
    or the user requests it.

    Steps:

    - Open the reference target and the latest prototype screenshot before the
      gate. Compare the same viewport and the same interaction state; if they do
      not match, capture the missing view first.
    - For a full gate, run `design-review` on the target and screenshot together.
    - Fix blocking findings, capture the app again, and repeat until the gate
      passes or report the concrete blocker.

12. Handoff the app or website.

    - When a full design-review gate was required, hand off only after it passes
      or with the concrete blocker clearly reported.
    - Keep the prototype running locally when the task requires a live local
      preview.
    - Provide the clickable local URL.
    - Briefly describe the work as a designer would.

## Extraction Checklist

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

## Fidelity Rules

Color fidelity is mandatory. Do not warm up, cool down, mute, or "tastefully"
reinterpret the accepted palette. If the concept uses white, implement white,
not cream, ivory, beige, warm gray, or softened off-white.

Hero media treatment must match the accepted design. If the hero image has no
color overlay or tint, do not add one. Use matching assets, transparent cutouts,
edge fades, masks, or background gradients around the image instead of washing
the image with an overlay.

Do not substitute generic nearby icons for accepted icons. Use the repository's
icon set first, a matching library second, and a simple production-quality SVG
only when neither fits. Preserve metaphor, fill/stroke style, optical weight,
size, color, alignment, and state behavior.

For multi-section pages, implement and verify one section or contiguous viewport
at a time. Compare the browser screenshot to the relevant section concept, fix
visible drift, then move to the next section.

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

When the target repo has an existing design system — a component library,
tokens, or a theme — build through it first: reuse its components, tokens, and
primitives before writing new markup or styles, and match its conventions over
generic defaults. This is the main lever for building in the app's established
style. Reserve new markup and generated assets for what the system does not
provide. Treat shipped components as the default, not as law — if an existing
pattern is clearly wrong for this task, name the conflict rather than
propagating it.

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

Custom SVG icons must have a clear `viewBox`, clean geometry, consistent stroke
widths, aligned joins/caps, balanced negative space, optical centering, scalable
paths, no jagged placeholder shapes, and `currentColor` or explicit fills only
when they match the design system.

Make app interfaces experiential: local state, meaningful selected states,
working filters/tabs/forms, editable or creatable items, success states,
playback controls, game controls, or simulated generated output where
appropriate.

Keep implementation production-oriented: semantic markup, stable responsive
dimensions, no fragile hardcoded hacks, and type/lint/test checks when the repo
supports them.

## Verification

For a full independent gate, `design-review` owns fidelity verification — the
surface-by-surface comparison, severity, pass/block decision, and findings. For
routine self-checks, use the same build inputs below without creating a formal
report.

This skill owns only the build-side inputs to that gate:

- Capture the implementation at the accepted concept's native dimensions when
  practical; record the blocker if not.
- Bring the accepted concept and the latest screenshot into the same comparison
  input with `view_image` so `design-review` can judge them together.
  Functional QA — passing the build, clicking controls, verifying local state —
  is not fidelity QA and cannot replace this.
- Provide the allowed-copy list and the per-section image inventory from the
  Extraction Checklist so the gate can run the copy diff and asset audit.
- Verify generated assets load, are framed correctly, and do not obscure text
  or controls, and that the core workflow updates real local UI state. Do not
  ship inert controls, fake media progress, or placeholder interactions.

For concept-driven implementation, include:

- accepted concept path
- rendered screenshot method
- Codex in-app browser verification method or browser fallback reason
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
