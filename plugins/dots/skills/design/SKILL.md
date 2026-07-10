---
name: design
description: "Use when building, redesigning, or polishing product UI: web/app screens, dashboards, tools, games, landing pages, React, or iOS/SwiftUI. Triggers: UI design, UX, redesign, frontend, make it look better. Not for HTML reports, briefs, or static mocks (html), docs, backend, CLI, or invisible bug fixes."
---

# Visual Design

Create, critique, revise, and faithfully implement distinctive visible UI. Use
this skill whenever front-end work changes what a user sees.

## References

- Read [grounding.md](references/grounding.md) before starting a new surface,
  vague feature, redesign, or substantial visual change.
- Read [briefing-calibration.md](references/briefing-calibration.md) when
  forming a new-surface brief or UI-generation prompt from sparse direction.
- Read [visual-principles.md](references/visual-principles.md) before choosing
  the visual direction, typography, layout language, or polish pass.
- Read [animation-vocabulary.md](references/animation-vocabulary.md) on demand
  when motion or interaction design needs precise terminology.
- Read [ios-motion.md](references/ios-motion.md) for iOS/SwiftUI animation and,
  on any platform, direct-manipulation gestures, springs, momentum,
  rubber-banding, or synchronized haptics.
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

- new web pages, app screens, dashboards, tools, games, landing pages,
  iOS/SwiftUI views, and interactive prototypes
- visual redesigns, style passes, critique, polish loops, responsive cleanup,
  and design-system alignment
- implementation work where Image Gen concepts, screenshots, or accepted visual
  references need faithful translation into code

Do not use it for backend-only changes, CLI tools, pure docs/prose work, report
or brief HTML artifacts, static artifact mocks, or bug fixes with no visible UI
surface. Use `html` when the user wants formed content rendered as a shareable
HTML document or static mock.
Chat-native throwaway diagrams or mockup sketches are outside this skill. For a
small UI fix inside an existing design system, follow the repo's local
conventions first and use only the relevant polish and validation parts of this
skill.

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

If the task is a genuinely ambiguous new surface, redesign, or substantial
visual change, use the discovery and brief gate in
[grounding.md](references/grounding.md). When the repository, request, or
authorized assumptions provide enough direction, state the compact brief and
proceed. Stop for confirmation only when an unresolved choice would materially
change the product, visual direction, or implementation scope.

### 2. Scout Before Coding

Use Image Gen concepts when visual ambiguity is high enough that seeing options
would materially improve the decision, or when the surface needs raster assets
that do not exist. Skip concept generation when the repository design system,
an accepted target, or a sufficiently concrete brief already determines the
direction.

Design the complete requested surface. A header, hero, or cropped fragment is
not enough for a full page, app screen, dashboard, game, or product interface.
For multi-section websites, prefer coordinated section-by-section concepts over
one tall image that loses detail.

Use [imagegen-concepts.md](references/imagegen-concepts.md) for Image Gen
briefing, image count, asset planning, concept rejection, and approval rules.
When concept selection would materially change implementation, ask the user to
choose before coding. Otherwise use the strongest concept as stated direction
and proceed within the user's authorization.

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

When motion or gesture behavior is part of the surface, load the applicable
conditional motion references before implementing or revising it. Use the
vocabulary to name the intended behavior; use the doctrine only for the
platform and interaction mechanisms it covers.

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

Use a focused visual self-check for routine work: inspect the rendered surface
at relevant viewports and states, compare it with the brief and local design
system, and fix visible regressions. Run the full independent surface critique
from [design-review](../design-review/SKILL.md) when the work is target-driven,
acceptance-critical, externally shipped, brand- or accessibility-sensitive, or
the user requests an independent review. A full gate owns the comparison method,
severity, and pass/block decision; functional QA cannot replace it.

Use [image-to-code.md](references/image-to-code.md) for the build-loop details:
target recreation, design-system extraction, asset and state verification, and
the build-side inputs to the gate.

Remove only temporary QA screenshots, reports, scratch notes, and generated
assets created by the current task and no longer needed. Never delete
pre-existing user artifacts merely because they look temporary.

## Output

When a brief contains a blocking decision, present the brief and that decision.
Otherwise state the direction briefly and proceed with the implementation.

For critique-only work, report the strongest design findings first, then give a
specific repair plan.

For implementation work, finish with the design direction, material changes,
repo design anchors followed, validation performed, remaining intentional
deviations, and any unresolved risks.
