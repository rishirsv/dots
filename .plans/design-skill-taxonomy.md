# Design Skill Taxonomy

## Final Names

Use these names as the stable design-family vocabulary:

- `$design`: router and brief gate for visual/product design requests.
- `$ideate`: visual directions and image-backed options before build work.
- `$design-review`: read-only critique, QA, and target-vs-rendered comparison for existing surfaces.
- `$ui-polish`: focused implementation polish for an existing selected surface.
- `$docs-writer`: durable design-system or product documentation when the requested artifact is prose.
- `$clarify`: missing-brief recovery before the design router can choose a lane.

Do not introduce `visual-directions` as a public skill name. Treat "visual directions" as the plain-language job that routes to `$ideate`.

## Router Boundary

`$design` owns routing only. It should identify the user's design job, check whether the brief is sufficient, name the next child skill, and stop. It should not critique, generate options, edit code, write design docs, or run QA itself.

Route by next useful artifact:

- Need judgment about an existing screen, screenshot, flow, implementation, or target-vs-rendered match -> `$design-review`.
- Need independent visual options, remixes, conservative-to-bold alternatives, or image-generated directions -> `$ideate`.
- Need focused craft edits to an existing selected UI surface -> `$ui-polish`.
- Need durable design-system or product design documentation -> `$docs-writer`.
- Need missing product surface, visual source, constraints, or interactivity level clarified -> `$clarify`, then return to `$design`.

## Child Order

When a request mixes lanes, sequence the children in this order:

1. `$clarify` when the target, purpose, visual source, interactivity, or constraints are missing.
2. `$design-review` when an existing surface needs critique before changes.
3. `$ideate` when the user needs visual directions or alternatives before choosing.
4. Wait for the user to select or approve a direction when options were generated.
5. `$ui-polish` to implement focused edits on the chosen or existing surface.
6. `$design-review` again for final target-vs-rendered QA when both the target and rendered result exist.
7. `$docs-writer` only when the user asks for durable documentation, or after the design decision should be captured as docs.

Design QA is not a future lane name. It is current `$design-review` behavior when the reviewed object is a rendered implementation, a target comparison, or a release-readiness design check.

## Do Not Trigger Examples

Do not trigger `$design` for:

- "Fix this failing test."
- "Review this PR for bugs."
- "Explain how this module works."
- "Write the README for this CLI."
- "Brainstorm database schema names."
- "Implement the feature exactly as specified."

Do not trigger `$ideate` for:

- "Make the selected option real."
- "Polish this existing settings screen."
- "Does this match the Figma target?"
- "Review this screenshot and list issues."
- "Brainstorm non-visual product names."

Do not trigger `$design-review` for:

- "Create three new dashboard concepts."
- "Patch the layout spacing now."
- "Generate a landing-page hero image."
- "Refactor these components."
- "Review code correctness."

Do not trigger `$ui-polish` for:

- "Give me critique only."
- "Explore radically different looks."
- "Choose the product direction for me without a target."
- "Write design-system docs."
- "Add an unrelated feature while you are here."

## Drift Guards

- Keep `$design` as the public router boundary; child skills should mention that they are children, but should not duplicate router ownership.
- Keep `$ideate` as the public skill name even when the user says "visual directions."
- Keep `$design-review` current and active for design QA; do not split QA into an aspirational future lane.
- Keep `$ui-polish` scoped to selected or existing surfaces; broad redesign belongs in `$ideate` before implementation.
- If a new design-family name is proposed, map it to one of the stable names above unless it produces a genuinely new artifact type.
