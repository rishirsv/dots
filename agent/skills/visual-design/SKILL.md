---
name: visual-design
description: "Use when creating, revising, critiquing, polishing, or validating visible UI for web, HTML/CSS, React, iOS, SwiftUI, app screens, dashboards, landing pages, games, or interactive tools, especially when visual judgment, layout, styling, assets, interaction polish, or rendered validation matters; not for backend-only work, CLI tools, documentation-only writing, or bug fixes with no visible UI surface."
---

# Visual Design

Create, critique, revise, and faithfully implement distinctive visible UI. Use
this skill whenever front-end work changes what a user sees.

## References

- Read [grounding.md](references/grounding.md) before starting a new surface,
  vague feature, redesign, or substantial visual change.
- Read [visual-principles.md](references/visual-principles.md) before choosing
  the visual direction, typography, layout language, or polish pass.
- Read [imagegen-concepts.md](references/imagegen-concepts.md) when concepting
  with Image Gen, generating assets, implementing from an accepted concept,
  translating a screenshot/mockup/reference image into code, or doing fidelity
  QA.
- Read [surface-gates.md](references/surface-gates.md) when the UI type has
  specific preservation rules such as dashboards, games, media surfaces, forms,
  canvas tools, or landing pages.

## Route

Use this skill for:

- new web pages, app screens, dashboards, tools, games, landing pages, HTML
  artifacts, iOS/SwiftUI views, and interactive prototypes
- visual redesigns, style passes, critique, polish loops, responsive cleanup,
  and design-system alignment
- implementation work where Image Gen concepts, screenshots, or accepted visual
  references need faithful translation into code

Do not use it for backend-only changes, CLI tools, pure docs/prose work, or bug
fixes with no visible UI surface. For a small UI fix inside an existing design
system, follow the repo's local conventions first and use only the relevant
polish and validation parts of this skill.

## Workflow

### 1. Ground The Work

Start from the target repo and product context before designing. Look for repo
design guidance, design-system docs, `PRODUCT.md`, existing screenshots, nearby
UI code, component libraries, tokens, and established conventions.

Repo design guidance is the authority when present. Apply this skill's visual
principles inside those constraints. If the user asks for something that
conflicts with repo design guidance, name the conflict and ask before overriding
the repo.

Use relevant memory or prior context about the human's preferences, product, or
past designs only as a hint. The subject's own world, materials, instruments,
artifacts, and vernacular should drive distinctive choices.

If the task is a new surface, vague feature, redesign, substantial visual
change, or design-from-scratch request, run the discovery and brief gate in
[grounding.md](references/grounding.md). Present the brief, then stop and wait
for explicit user confirmation. Do not continue to code in the same response.

### 2. Ideate Before Coding

For new full pages, apps, dashboards, games, product interfaces, and substantial
redesigns, create Image Gen design concepts before coding unless the user
explicitly opts out or the task is a small UI fix inside an existing design
system.

Design the complete requested surface. A header, hero, or cropped fragment is
not enough for a full page, app screen, dashboard, game, or product interface.
For multi-section websites, prefer coordinated section-by-section concepts over
one tall image that loses detail.

Use [imagegen-concepts.md](references/imagegen-concepts.md) for Image Gen
briefing, image count, asset planning, concept rejection, and approval rules.
In Plan mode, generate the design first, then use the structured question tool
for design approval when it exists. Otherwise ask directly in chat and stop.

Once the user accepts a concept, treat it as the production design spec. Do not
reinterpret layout, visible copy, hierarchy, styling, imagery, density, sections,
or component model unless the user approves the deviation or a concrete blocker
requires it.

### 3. Extract The Design System

Before coding from an accepted concept, extract a small design system:

- tokens: background, surface, text, muted text, borders, shadows, accents,
  semantic colors, radii, elevation, spacing, and motion timing
- typography: display, body, caption, labels, UI chrome, controls, table text,
  toolbar text, sidebars, and responsive behavior
- component families: buttons, navigation, panels, cards only where present,
  tables, forms, media frames, icons, empty states, selected states, and
  responsive variants
- assets: image roles, generated assets, project assets, SVG/icon needs,
  transparent cutouts, product renders, game sprites, and media treatment
- container model: open layout, bands, rails, lists, tables, canvases, drawers,
  sidebars, modals, cards, panels, or full-bleed sections

Build through that system so repeated elements stay consistent. Differences
should be explicit variants, not copied one-off styles.

### 4. Implement Or Revise The Surface

Follow the repo's framework, routing, component, styling, state, accessibility,
and asset conventions. For a new complex app UI without an existing framework
constraint, default to React + Vite.

Build the real usable surface first, not a marketing wrapper around a future
app. Make common states visible in the implementation: default, empty, loading,
error, disabled, selected, success, dense data, responsive collapse, hover,
focus, and reduced-motion behavior where relevant.

Keep real interactive app UI text, navigation, buttons, forms, tables, controls,
and labels code-native. Use generated raster assets for logos, brand marks,
hero imagery, product renders, branded scenes, backgrounds, posters, avatars,
empty-state art, and game art when those assets are part of the accepted design.

Do not add unapproved hero eyebrows, kickers, pretitle labels, badges, pills,
fake metrics, decorative gradients, color overlays, card grids, extra sections,
or new visible copy. A hero eyebrow or badge is allowed only when the user
explicitly requested it or the accepted/reference design already contains it.

### 5. Polish In Loops

After the first pass, critique the rendered surface against the brief, repo
design guidance, visual principles, and accepted concept if one exists.

Run focused polish loops:

- composition, hierarchy, spacing, alignment, density, and rhythm
- typography scale, weight, line length, control text, labels, and mobile wraps
- palette, material, image treatment, shadows, borders, and container model
- interaction affordances, states, motion, focus, and ergonomic flow
- copy specificity, empty states, labels, data realism, and microcopy
- distinctiveness: whether the surface could belong only to this product or
  subject

Change the design after critique. Do not only describe what could be better.
Spend boldness in one place, keep the surrounding system disciplined, and remove
decoration that does not serve the brief.

### 6. Validate Fidelity

Validate the rendered product, not just the build.

Use Browser/IAB first for web verification. Use Playwright Chromium only when
Browser/IAB is unavailable or unreliable, and state the fallback reason.

For web, inspect desktop and mobile widths, scroll, and click through the core
workflow. For iOS, use the available simulator, previews, or screenshots and
check platform conventions, safe areas, dynamic type, touch targets, and chrome.

Before final handoff for concept-driven work, inspect both the accepted concept
and the latest rendered screenshot with `view_image` in the same QA pass. This
cannot be replaced by browser inspection alone. If `view_image` or screenshots
are unavailable, report the blocker and do not claim agency-signoff fidelity.

Use [imagegen-concepts.md](references/imagegen-concepts.md) for the fidelity
ledger, copy diff, icon audit, asset audit, state verification, native-size
check, and final handoff requirements. Keep fixing visual, interaction,
responsive, asset, and typography mismatches until the implementation would pass
agency sign-off or a concrete blocker remains.

Remove temporary QA screenshots, reports, scratch notes, and unused generated
assets before handoff unless the user or task explicitly asks to keep them.

## Output

For a brief gate, present only the brief and the confirmation prompt.

For critique-only work, report the strongest design findings first, then give a
specific repair plan.

For implementation work, finish with the design direction, material changes,
repo design anchors followed, validation performed, remaining intentional
deviations, and any unresolved risks.
