---
name: design
description: "Builds, redesigns, and implements visible UI — web, React, iOS/SwiftUI, prototypes. Invoked via design (also visual-design). Use for product design, UI/UX design, redesign, or front-end work changing what a user sees. Pairs with design-review for critique/audit; not for backend-only, CLI, docs-only, or invisible-UI bug fixes."
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
  with Image Gen or generating visual assets.
- Read [image-to-code.md](references/image-to-code.md) when implementing a
  selected screenshot, mockup, reference image, or accepted Image Gen concept
  as a faithful responsive frontend.
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
fixes with no visible UI surface. Chat-native throwaway diagrams or mockup
sketches are outside this skill. For a small UI fix inside an existing design
system, follow the repo's local conventions first and use only the relevant
polish and validation parts of this skill.

## Workflow

### 1. Ground The Work

Start from the target repo and product context before designing. Load the repo
design contract — the precedence of design sources and the conflict-resolution
authority order — from [grounding.md](references/grounding.md): an `AGENTS.md`
`## Design` section or `DESIGN.md`, then tokens / theme / component library, then
nearby shipped UI, then product briefs and prior accepted designs.

When the repo carries design conventions they are the authority for how this
surface looks; apply this skill's visual principles inside those constraints, and
build through the repo's existing components and tokens before writing new
markup. Treat shipped code as evidence, not law — if the user's ask or the task
conflicts with a repo pattern, name the conflict and ask before overriding.

Use relevant memory or prior context about the human's preferences, product, or
past designs only as a hint. The subject's own world, materials, instruments,
artifacts, and vernacular should drive distinctive choices.

If the task is a new surface, vague feature, redesign, substantial visual
change, or design-from-scratch request, run the discovery and brief gate in
[grounding.md](references/grounding.md). Present the brief, then stop and wait
for explicit user confirmation. Do not continue to code in the same response.

No visual target, no build: without a URL, screenshot, Figma frame, mockup,
source image, accepted Image Gen concept, or existing code target, this gate
applies even to `full working version`, `no refs`, `go for it`, or `make an
assumption` requests — those phrases waive polish, not grounding.

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
requires it. Use [image-to-code.md](references/image-to-code.md) for the
implementation workflow.

### 3. Extract The Design System

Before coding from an accepted concept or selected visual target, extract a
small design system:

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
app. Design every reachable state, not just the happy path: default, empty,
loading, error, disabled, selected, success, dense data, responsive collapse,
hover, focus, and reduced-motion. Harden the surface against real-world content —
text overflow, long strings, localization, and recoverable errors that preserve
user input — so it does not break outside the ideal case.

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

Validate the rendered product, not just the build. Follow the shared
[visual-proof checklist](../../references/visual-proof.md) for tool order,
the recurring capture failures, and the proof standard; for iOS additionally
check platform conventions, safe areas, dynamic type, touch targets, and
chrome.

For concept-driven or target-driven work, run the surface critique path of
[design-review](../design-review/SKILL.md) as the blocking gate. It owns the
comparison method, the fidelity surfaces, the severity scale, and the pass/block
decision — bring it the accepted target and the latest screenshot together
(`view_image` for the concept-vs-render pass) and fix what it finds. Functional
QA cannot replace this. Do not hand off until the design-review gate passes, or
report the concrete blocker.

Use [image-to-code.md](references/image-to-code.md) for the build-loop details:
target recreation, design-system extraction, asset and state verification, and
the build-side inputs to the gate.

Remove temporary QA screenshots, reports, scratch notes, and unused generated
assets before handoff unless the user or task explicitly asks to keep them.

## Output

For a brief gate, present only the brief and the confirmation prompt.

For critique-only work, report the strongest design findings first, then give a
specific repair plan.

For implementation work, finish with the design direction, material changes,
repo design anchors followed, validation performed, remaining intentional
deviations, and any unresolved risks.
