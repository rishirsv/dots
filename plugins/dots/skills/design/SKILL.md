---
name: design
description: "Designs, builds, redesigns, and polishes visible product UI. Use for web and app screens, React, iOS/SwiftUI, frontend implementation, responsive refinement, and design-system alignment; not for docs, backend, CLI, or invisible fixes."
---

# Visual Design

Create, revise, and faithfully implement distinctive visible product UI. Use
this skill when the requested work changes a web or app surface that users see
and interact with.

## Route

Use this skill for:

- new web pages, app screens, dashboards, tools, games, landing pages,
  iOS/SwiftUI views, and interactive prototypes
- visual redesigns, style passes, implementation polish loops, responsive
  cleanup, and design-system alignment
- implementation work where Image Gen concepts, screenshots, or accepted visual
  references need faithful translation into code

Do not use it for backend-only changes, CLI tools, pure docs/prose work, static
artifact mocks, chat-native throwaway diagrams, or bug fixes with no visible UI
surface.

Choose the path before loading references:

- **Accepted visual target:** ground the product context, then follow the
  target-driven path in [image-to-code.md](references/image-to-code.md).
- **No accepted visual target:** ground the work, decide whether visual
  ambiguity warrants concepts, then implement the chosen direction.

## Conditional References

- Read [grounding.md](references/grounding.md) before changing visual direction
  or implementing a new or modified surface. It owns source precedence, change
  freedom, assumptions, and the brief.
- Read [visual-principles.md](references/visual-principles.md) before choosing
  the visual direction, typography, layout language, or polish pass.
- Read [typography.md](references/typography.md) when establishing or changing
  type roles, hierarchy, reading measure, responsive type, font delivery, or
  text scaling.
- Read [color.md](references/color.md) when establishing or changing palette,
  semantic color, themes, contrast, atmospheric color, or data color.
- Read [spacing.md](references/spacing.md) when choosing or auditing density,
  spatial rhythm, proportions, symmetry, component sizing, spacing systems,
  optical alignment, or hit areas.
- Read [interaction-design.md](references/interaction-design.md) when designing
  interactive states, focus, forms, loading, destructive actions, keyboard
  navigation, or gesture discoverability for web UI.
- Read [animation-vocabulary.md](references/animation-vocabulary.md) when
  precise motion language would improve an interaction being designed.
- Read [ios-motion.md](references/ios-motion.md) for iOS/SwiftUI animation and,
  on any platform, direct-manipulation gestures, springs, momentum,
  rubber-banding, or synchronized haptics.
- Read [imagegen-concepts.md](references/imagegen-concepts.md) when concepting
  with Image Gen or generating visual assets.
- Read [image-to-code.md](references/image-to-code.md) when implementing a
  selected screenshot, mockup, reference image, or accepted Image Gen concept.
- Read [surface-gates.md](references/surface-gates.md) when the UI type has
  specific preservation rules such as dashboards, games, media surfaces, forms,
  canvas tools, or landing pages.

## Design Workflow

### 1. Ground The Work

Read [grounding.md](references/grounding.md). Follow its source precedence, set
the permitted change freedom, state a compact executable brief, and proceed
using repository evidence and safe assumptions. Current product evidence
outranks remembered preferences. Ask only when a required input cannot be
derived or safely assumed and different answers would materially change the
product, scope, or implementation.

Grounding is complete when the design authority, product truth, requested scope,
and any material unresolved decision are explicit.

### 2. Choose The Implementation Path

#### Accepted target

For a selected screenshot, mockup, reference image, or accepted Image Gen
concept, read [image-to-code.md](references/image-to-code.md) and follow its
target-recreation workflow through design-system extraction, asset and state
verification, rendered comparison, and fidelity verification.

Treat the accepted target as the production design spec. Do not reinterpret
layout, visible copy, hierarchy, styling, imagery, density, sections, or
component model unless the user approves the deviation or a concrete blocker
requires it.

#### Material visual ambiguity

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

Once a concept is selected, enter the accepted-target path above.

#### Direction already clear

When the repository design system, brief, or authorized assumptions determine
the direction, state the compact direction and implement without concept
generation.

### 3. Implement Or Revise The Surface

Follow the repo's framework, routing, component, styling, state, accessibility,
and asset conventions. For a new complex app UI without an existing framework
constraint, default to React + Vite.

For work without an accepted target, extract the design system needed for the
surface before coding:

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

When motion or gesture behavior is part of the surface, load the applicable
conditional motion references before implementing or revising it. Use the
vocabulary to name the intended behavior, the repository's platform conventions
for browser motion, and the iOS doctrine for native motion and direct
manipulation. Apply each platform clause only to the interaction mechanism it
covers.

Build the real usable surface first, not a marketing wrapper around a future
app. Read [interaction-design.md](references/interaction-design.md), assign each
reachable state to the control, field, region, or flow that owns it, and design
only applicable states. Apply reduced-motion behavior as a user preference
across affected interactions, not as an element-owned state. Harden the surface
against real-world content — text overflow, long strings, localization, and
recoverable errors that preserve user input — so it does not break outside the
ideal case.

Keep real interactive app UI text, navigation, buttons, forms, tables, controls,
and labels code-native. Use generated raster assets for logos, brand marks,
hero imagery, product renders, branded scenes, backgrounds, posters, avatars,
empty-state art, and game art when those assets are part of the accepted design.

Do not add unapproved hero eyebrows, kickers, pretitle labels, badges, pills,
fake metrics, decorative gradients, color overlays, card grids, extra sections,
or new visible copy. A hero eyebrow or badge is allowed only when the user
explicitly requested it or the accepted/reference design already contains it.

Implementation is complete when the full requested surface and every applicable
reachable state work with realistic content inside the governing design system.

### 4. Polish In Loops

After the first pass, critique the rendered surface against the brief, repo
design guidance, visual principles, and accepted concept if one exists.

Run focused polish loops:

- composition, hierarchy, spacing, alignment, density, and rhythm
- typography scale, weight, line length, control text, labels, and
  narrow-viewport wrapping
- palette, material, image treatment, shadows, borders, and container model
- interaction affordances, states, motion, focus, and ergonomic flow
- copy specificity, empty states, labels, data realism, and microcopy
- distinctiveness: whether the surface could belong only to this product or
  subject

Change the design after critique. Do not only describe what could be better.
Give the composition one product-specific focal move, keep repeated elements
consistent, and remove decoration that does not serve the brief.

Polish is complete only after the rendered surface has changed in response to
the critique or the inspection finds no material visual issue.

### 5. Validate Fidelity

Validate the rendered product, not just the build. Follow the shared
[visual-proof checklist](../../references/visual-proof.md) for tool order,
the recurring capture failures, and the proof standard; for iOS additionally
check platform conventions, safe areas, dynamic type, touch targets, and
chrome.

Use a focused visual self-check for routine work: inspect the rendered surface
at relevant viewports and states, compare it with the brief and local design
system, and fix visible regressions. For target-driven, acceptance-critical,
externally shipped, brand-sensitive, or accessibility-sensitive work, compare
the accepted target and rendered surface at matching viewports and states,
record material mismatches, fix them, and repeat until no material mismatch
remains or a concrete blocker is reported. Functional QA cannot replace visual
fidelity verification.

Remove only temporary QA screenshots, reports, scratch notes, and generated
assets created by the current task and no longer needed. Never delete
pre-existing user artifacts merely because they look temporary.

Validation is complete when the rendered surface has been inspected at relevant
viewports and states, visible regressions are fixed, and required fidelity
comparisons have either passed or produced a concrete unresolved blocker.

## Output

When a brief contains a blocking decision, present the brief and that decision.
Otherwise state the direction briefly and proceed with the implementation.

For implementation work, finish with the design direction, material changes,
repo design anchors followed, validation performed, remaining intentional
deviations, and any unresolved risks.
