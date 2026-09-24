# Ideation

Explore distinct directions through local HTML prototypes, native previews, or
generated images.
Reuse the settled brief; read [brief.md](brief.md) when the subject, audience
or intended outcome still needs grounding.

## Frame The Exploration

Identify the decision the variants should resolve: product framing, information
hierarchy, composition, interaction, or visual identity. Inspect relevant product
screens and supplied references directly. Preserve the brief's hard constraints
and distinguish missing evidence from freedom to invent.

For an established product, vary structure, emphasis, and interaction within its
identity unless a new style is requested. For broad exploration, vary both concept
and visual system. Give each direction a descriptive name and a concise premise.
Differences should change the experience, not merely swap accent colors.

Default to three variants unless the user specifies a count or the question needs
a smaller comparison. Keep subject, core content, task, and viewport comparable
so the user can judge the intended differences. Variant count is separate from
iteration count: producing three alternatives is one exploration round.

## Choose The Medium

- **HTML prototypes:** default for web questions about layout, typography,
  responsiveness, or interaction. Build only enough behavior to experience the
  meaningful difference. Read [variants and boards](ideation-html.md).
- **Native previews:** use the target stack for platform controls, gestures, text
  scaling, or spatial behavior. Keep named variants and reusable preview states;
  compare them in the native preview environment and retain the selected source.
  For content-state stress tests or parameter tuning, read [interactive previews](ideation-interactive.md).
- **Image Gen:** use for rapid visual direction, imagery, or compositions whose
  expression is easier to explore as images. Generated controls are visual
  proposals, not evidence of working behavior. Read [image variants](ideation-images.md).
- **Mixed:** use images for art direction or assets and HTML for the interaction
  question. Keep the extra medium only when it helps decide.

Follow an explicit medium preference. Choose dimensions from the reference or
intended surface; use consistent viewports across comparable options rather than
forcing every concept into one device preset.

## Compare And Continue

Show the variants with a short comparison of their defining choice, benefit, and
trade-off. Recommend a direction against the brief and explain why. Avoid grading
all options against a single aesthetic preference.

For ideation-only requests, stop with the reviewable options and ask which to
pursue or refine. If the user already asked you to choose and build, select the
best-supported direction and continue. Do not add a second confirmation after
an unambiguous selection.

Apply feedback to the named variant. When combining directions, identify which
structure, styling, and behavior carry forward; produce a revised concept if
the combination needs visual resolution. Small, explicit corrections can go
directly into the selected HTML prototype. Preserve earlier variants for comparison.

Continue from the selected prototype source rather than rebuilding it
unnecessarily. For a selected image, use [reference-to-code.md](reference-to-code.md). Once an accepted
visual target exists, [design-qa.md](design-qa.md) governs fidelity and correction
iterations. Ideation itself explores alternatives; it does not require a fidelity
pass against a target that has not yet been chosen.
