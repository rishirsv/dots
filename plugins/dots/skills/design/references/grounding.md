# Product Grounding

Read this before choosing visual direction or changing a surface. Establish
what owns product behavior and visual decisions before applying generic design
guidance.

## Find Repository Authority

Start at the repository root and inspect the instructions that govern the
target path:

1. Root and applicable nested `AGENTS.md` files, especially product, design,
   UI, verification, and scope rules.
2. Root or applicable `DESIGN.md` files and equivalent checked-in product or
   design guidance.
3. Repository-local product-design skills named by those instructions. Read
   their complete `SKILL.md` and only the references they require for this
   task.
4. Design-system documentation, tokens, components, assets, platform
   conventions, and accepted decisions.
5. Relevant briefs, tickets, flows, screenshots, current source, and nearby
   shipped UI.

When another skill routes work into `design`, treat that skill as the product
coordinator: keep its product model, behavioral constraints, copy, and selected
direction unless the user or a more specific repository instruction changes
them. This skill supplies composition and implementation craft; it does not
silently take product authority.

Resolve conflicts by scope and authority: the user's explicit request, the
most specific applicable repository instruction, product-specific guidance,
accepted decisions and targets, the established design system and product
evidence, then this skill's generic references. Surface a genuine unresolved
conflict instead of blending incompatible directions.

If no repository authority exists, ground the work directly in the user's
goal, audience, product truth, content, and platform.

## Set Change Freedom

Choose the closest scope:

- **Refinement:** preserve identity, behavior, information, copy, and
  untargeted UI.
- **Local extension:** inherit the surrounding system and design the new
  purpose, hierarchy, states, interaction, and join.
- **Established-world surface:** explore composition and flow while preserving
  the product's visual language.
- **Redesign:** preserve product truth, function, native affordances,
  constraints, and durable brand commitments; replace only the visual or
  interaction direction the request authorizes.
- **Greenfield:** create the composition and visual system from the product
  evidence. Existing generic component patterns are options, not constraints.

Do not widen a focused request into a redesign. Within an authorized redesign
or greenfield scope, do not preserve incidental current composition merely
because it exists.

## Form A Compact Brief

Resolve only the details that guide implementation:

- outcome, audience, and primary action or decision;
- governing authority and change freedom;
- product truth, content, data, and reachable states;
- composition, hierarchy, responsive behavior, and interaction;
- visual anchors, assets, type, color, spacing, material, and motion;
- platform, accessibility, technical, scope, and fidelity constraints;
- acceptance evidence and any intentional departure from current UI.

Translate mood words into visible choices. For example, `calm` might mean fewer
competing tiers, quieter motion, longer line height, and clearer separation;
the product context decides which choices actually apply.

For a greenfield surface, ask what makes the result belong to this product
rather than a generic category. Draw from its real content, tasks, materials,
data shapes, rituals, and language. This test should produce possibilities,
not a mandatory motif checklist.

State assumptions and proceed when they are safe and reversible. Ask when a
missing answer would materially change product behavior, scope, direction, or a
costly implementation.

Grounding is complete when the governing authority, change freedom, brief, and
any unresolved material decision are explicit.
