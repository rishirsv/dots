---
name: design
description: "Use when creating, redesigning, implementing, or polishing visible web or app UI, including screens, flows, components, responsive layouts, and design-system work. Makes product changes; for an independent read-only critique or ship-readiness assessment, use design-review."
---

# Design

Work inside the user's authorization and the repository's product direction,
then apply the generic craft guidance only where local authority leaves room.

## Start With Product Authority

Read [grounding.md](references/grounding.md) before choosing a direction or
changing a surface. It owns repository discovery, source precedence, the
relationship with product-specific coordinator skills, change freedom, and the
brief.

If a repository-local product-design skill routed the task here, continue from
its product decisions and constraints. Do not replace its product judgment with
this skill's generic defaults or repeat decisions it has already resolved.

Choose one implementation path:

- **Accepted visual target:** read
  [image-to-code.md](references/image-to-code.md) and recreate the target within
  the governing product and platform constraints.
- **Established product without a target:** inherit its design language and
  make the smallest coherent extension or authorized redesign.
- **Greenfield surface:** compose freely from the product goal, content,
  audience, and platform. Generic examples and anti-patterns are prompts, not a
  house style or a ban on a well-supported direction.

## Load Only Relevant Craft Guidance

- Read [visual-principles.md](references/visual-principles.md) when choosing or
  refining visual direction, composition, or overall polish.
- Read [typography.md](references/typography.md),
  [color.md](references/color.md), or [spacing.md](references/spacing.md) when
  that system is being established or materially changed.
- Read [interaction-design.md](references/interaction-design.md) for web states,
  forms, focus, destructive actions, keyboard behavior, or gesture
  discoverability.
- Read [animation-vocabulary.md](references/animation-vocabulary.md) when
  precise motion language changes the design decision. Read
  [ios-motion.md](references/ios-motion.md) for iOS/SwiftUI motion or for direct
  manipulation, springs, momentum, rubber-banding, and synchronized haptics on
  any platform.
- Read [imagegen-concepts.md](references/imagegen-concepts.md) when visual
  ambiguity warrants raster concepts or the surface needs missing raster
  assets.
- Read [surface-gates.md](references/surface-gates.md) when the surface type has
  specific product risks, such as dashboards, games, media, forms, canvas
  tools, or landing pages.

## Design And Implement

### Resolve the direction

Choose a clear direction based on the product's existing design, the scope of
the requested change, the content the interface must support, and the technical
constraints. Ask the user only when an unresolved choice would substantially
change the product, expand the scope, or require an expensive implementation.

Use Image Gen concepts when seeing materially different compositions would
improve a real decision, or when needed raster assets do not exist. Skip them
when repository guidance, an accepted target, or a concrete brief already makes
the direction clear. If concept selection materially changes the product or
implementation, ask the user to choose; otherwise select the strongest
supported direction and continue.

For an accepted target, preserve its layout, hierarchy, copy, styling, imagery,
density, and component model unless repository authority or the user requires a
deviation. For a greenfield surface, invent the composition and visual system
needed to make the product specific, coherent, and usable; do not infer missing
product behavior merely to fill the canvas.

### Build the complete surface

Follow repository conventions for framework, routing, components, state,
accessibility, assets, and platform behavior. Reuse the existing system when it
governs the work. Where the authorized direction requires new design, define
the smallest coherent set of type, color, spacing, material, components,
assets, and motion needed by the surface.

Implement the full requested surface and its reachable states with realistic
content. Keep interactive text, navigation, controls, and state code-native.
Use raster assets for visual material that genuinely belongs in an image, not
as a substitute for functional UI.

Treat repeated elements as one system with explicit variants. Preserve entered
data through recoverable errors, support relevant text scaling and
localization, keep focus and input behavior usable, and provide reduced-motion
behavior where motion is present.

### Inspect and refine

When repository policy and the user's authorization permit rendering, inspect
the surface at the relevant viewports and states. Compare it with the brief,
repository guidance, and accepted target when one exists. Fix the strongest
visible issues in composition, hierarchy, typography, spacing, color, assets,
interaction, motion, content, and product specificity. When rendering is not
authorized, use available visual evidence and report the visual-proof gap; do
not treat this skill as permission to launch or test the product.

This is the implementation skill's own feedback loop, not an independent
review. Use `design-review` only when the user asks for critique, audit, or a
separate acceptance judgment.

Follow the shared [visual-proof checklist](../../references/visual-proof.md)
when rendered evidence is required. Target-driven, acceptance-critical,
brand-sensitive, and accessibility-sensitive work needs comparison at matching
viewports and states. Functional checks do not establish visual fidelity.

## Finish

Report the chosen direction, files or surfaces changed, rendered validation,
intentional deviations, and remaining risks. Remove only temporary artifacts
created by the current task; preserve pre-existing user files.
