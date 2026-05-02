# Craft

Craft creates or substantially redesigns a surface. It includes design direction, optional visual exploration, implementation, and rendered verification.

## Flow

1. Load `docs/DESIGN.md` first when present, then repo docs, components, tokens, screenshots, and running UI.
2. Identify register: product or brand.
3. Shape the surface enough to force real commitments.
4. Generate visual probes or mockups when useful or requested. For image mockups, read [mockups.md](mockups.md).
5. Build with the project's real stack and conventions.
6. Inspect the rendered surface.
7. Patch material defects found by inspection.
8. Report what was built and what was verified.

## Shape Commitments

Answer from repo context first. Ask only when material inputs are missing.

When questions are needed, ask 2-3 at a time, then wait. Do not dump a full intake form into chat.

Always understand:

- primary action or primary thing to understand
- user context and state of mind
- content/data ranges and states
- fidelity: sketch, direction, production-ready, or flagship
- anti-goals

For brand, net-new, or directionally ambiguous work, force three commitments before code:

1. Color strategy: Restrained, Committed, Full palette, or Drenched.
2. Theme scene sentence: who uses this, where, under what light, with what emotional pressure.
3. Named anchor references: two or three products, brands, physical objects, places, or materials. Do not accept adjectives like modern or clean as references.

For brand landing pages, also read [lenses.md](lenses.md) and commit to a visual thesis, content plan, and interaction thesis.

For product app surfaces, also read [lenses.md](lenses.md) and identify the primary workspace, navigation, secondary context or inspector, and one clear accent for action or state.

Do not create a separate design brief file unless the user asks.

## Mockups And Image Generation

Use mockups when they improve the result:

- net-new or high-stakes surface
- major redesign
- brand, onboarding, hero, or visually ambiguous work
- user explicitly asks for mocks

For interface mockup images, option boards, flows, component studies, state matrices, reference edits, responsive sets, or north-star visuals, read [mockups.md](mockups.md). It defines artifact types, variation depth, prompt construction, evaluation, and implementation handoff.

Choose fidelity intentionally:

- `sketch`: loose spatial idea
- `wireframe`: structure and hierarchy
- `mid-fi`: density, rhythm, component relationships
- `high-fi`: near-final visual direction
- `north-star`: aspirational composition and tone to preserve in code
- `asset study`: badges, textures, marks, product imagery, illustrations
- `state matrix`: default, empty, loading, error, success, long-content variants
- `responsive set`: mobile, tablet, desktop versions

Before coding from a mock, name what carries into implementation: composition, hierarchy, density, typography, color, imagery, motifs, and motion cues. Also name what not to literalize. Do not rasterize text, controls, forms, nav, or core content.

## Build Bar

- Use real or realistic content. Remove placeholders, dead controls, unused scaffold, and fake links unless explicitly accepted.
- Build semantics first: headings, labels, landmarks, roles/traits, accessible names, form associations.
- Use the repo's components, tokens, icon set, and platform conventions.
- Calibrate spacing, alignment, density, and rhythm. Do not accept arbitrary margins or default gaps.
- Make typography deliberate: role scale, line-height, measure, weights, wrapping, and font loading where relevant.
- Cover states: default, focus, active, disabled, loading, error, success, empty, overflow, and long text.
- Make adaptive behavior structural, not just smaller.
- Use motion for state, continuity, feedback, or reveal. Respect reduced motion.
- Do not add dependencies for visual effect unless the value is clear.
- Establish the core visual system before detail work: type strategy, radius family, border behavior, shadow/depth language, accent strategy, icon style, and motion vocabulary.

For typography, layout, imagery, motion, copy, and micro-polish details, read [lenses.md](lenses.md) when the task touches that axis.

## Verify

Render the surface with the strongest available tool. If it cannot be rendered, say what blocked verification.

Default checks:

- primary state
- narrow/mobile
- tablet or small laptop
- wide desktop or large device
- at least one non-happy state

Fix visible defects before presenting: overlap, clipping, weak hierarchy, off-grid alignment, awkward whitespace, tiny touch targets, unreadable type, broken imagery, layout shift, and text overflow.
