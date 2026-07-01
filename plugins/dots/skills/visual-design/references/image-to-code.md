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

CRITICAL: THIS IS NOT GUIDANCE. THIS IS A CHECKLIST TO COMPLETE.

0. Do not start unless [grounding.md](grounding.md) has played back and
   confirmed the design brief for this exact request. If there is no clear
   visual target or the current thread does not already contain a confirmed
   brief, route to the brief gate in [grounding.md](grounding.md) first.

1. Do not start unless you have a selected image, screenshot, mockup, or Image
   Gen result to recreate. A written brief is not enough.

2. Treat the provided image as the design to recreate.

3. If the provided design is a mobile viewport, build a mobile app. If it's
   unclear, default to desktop.

4. Review the reference design, catalog every image asset in the design, and use
   the Image Gen tool to create individual images for each one. Zoom in so you
   can catch every asset that needs to be generated.

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

   - CRITICAL RULE: Do not create custom div art, CSS art, inline SVGs,
     handcrafted SVGs, HTML element drawings, div/span shapes, CSS drawings,
     gradients, emoji, or text glyphs instead of real icons and image assets
     ever. Use the built-in Image Gen tool for images and the closest matching
     icon library for icons.
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
   - The built-in Image Gen tool does not support transparent images;
     post-process generated assets when transparency is required.

5. Define all sections of the page. For each section, record the visible layout,
   spacing, element sizes, and alignment relationships needed to recreate the
   target.

6. Find freely available fonts that match the target design.

7. Find a freely available icon library that matches the target design. Do not
   default to Lucide icons. Search for the best match.

   Rules:

   - CRITICAL RULE: Do not create custom inline SVGs, handcrafted SVGs, HTML
     element drawings, div/span shapes, CSS drawings, gradients, emoji, or text
     glyphs. Use the built-in Image Gen tool to generate assets and use the
     closest matching icon library for icons.

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

   - Place every image asset you generated into its position before proceeding.
     I repeat, replace all placeholders, including CSS/SVG placeholders, before
     proceeding.
   - Do not leave visible controls as static chrome. Do not create new pages or
     routes unless the user asks for them.

9. Run the local app.

10. Capture the local app using Codex in-app browser first. If it is
    unavailable or unreliable, use another available browser and state the
    fallback reason.

11. Run the surface critique path of
    [design-review](../../design-review/SKILL.md) as the blocking build gate.
    `design-review` owns the comparison method, the fidelity surfaces, and the
    pass/block decision; this step is the build loop around it, not a second
    rubric.

    Steps:

    - Open the reference target and the latest prototype screenshot before the
      gate. Compare the same viewport and the same interaction state; if they do
      not match, capture the missing view first.
    - Run `design-review` on the target and screenshot together.
    - Fix P0/P1/P2 findings, capture the app again, and repeat until
      `design-review.md` says `final result: passed`.
    - Do not hand off when `design-review.md` says `final result: blocked`.

12. Handoff the app or website.

    - Only hand off after the design-review gate passes.
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

Do not substitute generic nearby icons for accepted icons. Use the repo's icon
set or lucide only when it matches the concept. Otherwise create production
quality SVG variants that preserve metaphor, fill/stroke style, optical weight,
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

`design-review` owns fidelity verification — the surface-by-surface comparison
(typography, spacing, color, image assets, icons, copy, states, responsiveness),
the severity scale, the pass/block decision, and the written findings. Do not
restate that rubric here; run the gate in step 11 and fix what it finds.

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
