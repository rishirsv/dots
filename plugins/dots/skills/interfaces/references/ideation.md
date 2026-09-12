# Ideation

Explore distinct directions through local HTML prototypes or generated images.
Start from the grounded brief in the main skill; reuse settled context.

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

- **HTML prototypes:** default when layout, real typography, responsive behavior,
  or interaction is the decision. Build only enough behavior to experience the
  meaningful difference.
- **Image Gen:** use for rapid visual direction, imagery, or compositions whose
  expression is easier to explore as images. Generated controls are visual
  proposals, not evidence of working behavior.
- **Mixed:** use images for art direction or assets and HTML for the interaction
  question. Keep the extra medium only when it helps decide.

Follow an explicit medium preference. Choose dimensions from the reference or
intended surface; use consistent viewports across comparable options rather than
forcing every concept into one device preset.

## HTML Variants And Board

Create isolated local HTML variants with stable names and paths. Reuse existing
prototype or board conventions when available. Otherwise create a local HTML
comparison board linking to each variant, with embedded previews at the same
viewport and an option to open each at full size.

Keep titles, premises, and comparison notes outside the prototype viewport. Let
users inspect each design at its intended scale; a thumbnail cannot establish
readability. Show the main task with realistic content, the distinguishing
interaction, and relevant states. Use local sample data and assets rather than
adding backend services for an exploration.

Open the board and variants in the in-app browser. Check that previews load,
primary interactions work, and board framing does not distort the designs.
Preserve the individual artifacts so later feedback can name a specific variant.

## Image Variants

Create each direction as a separate image. Attach relevant visual references
through the available image tool and incorporate product tokens or constraints
in the prompt. Only claim references were attached when the tool received them.
If a required reference is inaccessible, resolve that gap; otherwise disclose
what the proposal could not use.

For each prompt, specify:

- Subject, audience, primary job, and the direction's distinguishing premise.
- Intended viewport or aspect ratio and the screen or state to depict.
- Realistic content, hierarchy, palette, typography, and asset treatment.
- Existing design constraints and the aspects intentionally being varied.

Focus the frame on the intended task rather than advertising every product
feature. Use grouping, spacing, and typography to establish hierarchy; add
containers and decoration where they serve the direction. Keep device chrome
outside the design unless it is part of the requested presentation. Preserve
source dates or use a coherent date context when temporal content matters.

Present each generated result once and retain its exact identity. If numbering
options, bind numbers to their displayed order after results appear, not prompt
submission order. Use stable concept names and result identifiers so later
selection remains unambiguous.

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

Continue from selected HTML rather than rebuilding it unnecessarily. For a
selected image, use [reference-to-code.md](reference-to-code.md). Once an accepted
visual target exists, [design-qa.md](design-qa.md) governs fidelity and correction
iterations. Ideation itself explores alternatives; it does not require a fidelity
pass against a target that has not yet been chosen.
