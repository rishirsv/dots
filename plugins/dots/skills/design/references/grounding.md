# Grounding And Brief

Read before changing visual direction or implementing a new or modified
surface. This reference owns source precedence, change freedom, assumptions,
and the brief.

## Ground In Product Evidence

Find the repository's design authority before applying general taste:

1. Checked-in design rules such as `AGENTS.md` `## Design` or `## UI`,
   `DESIGN.md`, or an equivalent.
2. Design tokens, theme, component library, assets, and platform conventions.
3. Nearby shipped UI, product briefs, tickets, flows, screenshots, URLs, and
   prior accepted designs.

Treat these as the repository design contract. Resolve conflicts in this order:
the user's explicit goal, checked-in rules, the repository design system, an
accepted target for this surface, nearby shipped behavior, then this skill's
general principles. If no authority exists, design from the user goal, audience,
product truth, and subject evidence.

## Set The Change Freedom

Classify the work before choosing a direction:

- **Refinement:** preserve identity, behavior, information, visible copy, and
  everything outside the requested scope.
- **Local extension:** inherit the surrounding surface and design only the new
  purpose, content, hierarchy, reachable states, interaction, and join.
- **Whole surface in an established world:** explore composition, structure,
  and flow while preserving type, palette, material, components, and motion
  language.
- **Redesign:** preserve product truth, content, function, native affordances,
  constraints, and established brand commitments while replacing the
  authorized visual world.
- **Incomplete identity:** preserve established assets and recognizable traits,
  then extend only the missing system.
- **No visual authority:** create a coherent world from the user goal,
  audience, product truth, and subject evidence.

Do not expand a refinement into a redesign, alter a durable design contract, or
let a local extension redefine the wider product identity unless the request
authorizes it. State the supported interpretation and proceed. Ask only when a
required input cannot be derived or safely assumed and different answers would
materially change the product, scope, or implementation.

## Form The Brief

Use repository evidence and authorized assumptions to resolve purpose, user,
content and data, visual direction, scope, interaction, constraints, and
anti-goals. State a compact brief and proceed in the same turn.

For ordinary work, capture:

- **Outcome and user:** what is being built, who it serves, and the primary
  action or decision.
- **Change freedom:** refinement, extension, established-world surface,
  redesign, incomplete identity, or new visual world.
- **Direction and anchors:** the visual lane, subject-specific materials, and
  what each available reference contributes.
- **Structure:** first viewport, major regions, hierarchy, section or screen
  flow, container model, and responsive continuation.
- **System:** typography roles, spacing and grid, palette and material, imagery,
  icon language, component motifs, and motion behavior.
- **Content and states:** visible copy, data ranges, media roles, reachable
  states, and interaction from entry to completion.
- **Constraints:** scope, platform, accessibility, fidelity, implementation
  limits, and explicit visual anti-patterns.
- **Acceptance:** what makes the result product-specific, what would make it
  generic or off-brief, and what must be true before handoff.

Expand only the fields whose ambiguity would change the design. Spend detail
first on layout, spacing or grid, typography, reference contributions, and
negative constraints. Keep palette concise unless brand fidelity,
accessibility, or an accepted target requires exact values.

A visual target is helpful but not mandatory. Generate concepts only when
seeing alternatives would materially improve the decision or the surface needs
missing raster assets.

## Make Direction Executable

Translate mood words into visible decisions rather than leaving them as the
brief:

- `sophisticated` may mean editorial type relationships, restrained chrome,
  precise spacing, and quiet dividers.
- `tactile` may use physical materials, textures, controls, or artifacts from
  the subject's world.
- `energetic` may use tighter rhythm, sharper contrast, asymmetric crops, and
  faster state transitions.
- `calm` may use fewer competing tiers, longer line heights, quieter motion,
  and more separation between groups.

Before concepting, ask what prevents the design from being swapped into another
product with only copy and color changes. If the answer is only a palette,
slogan, or mood, strengthen the brief with subject-specific imagery, data,
materials, type behavior, spacing rhythm, component motifs, and anti-patterns.

When revising a concept, preserve what works and specify visible deltas such as
gutter rhythm, type weight, image variety, component shape, or motion timing.
Avoid broad resets when a targeted correction preserves the useful design.

Grounding is complete when the design authority, change freedom, compact brief,
assumptions, and any genuine blocker are explicit.
