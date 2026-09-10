# Image prompts for GPT-image-2

## Describe the visible result

Establish the intended use, subject, and setting. Add the visual decisions that
matter: medium, materials, framing, viewpoint, lighting, palette, and mood.
Prefer observable details over adjectives such as “stunning.” State
photorealism explicitly when wanted; camera terminology is a visual cue, not
a guarantee of physical simulation.

Describe placement, relative scale, and negative space when layout matters.
For people, specify relevant pose, gaze, and interaction with objects. These
are optional decisions, not a checklist to fill for every image.

## Text and reference images

Quote required lettering exactly and specify its placement, hierarchy, and
typography. Distinguish text rendered inside the image from space reserved for
later typesetting.

Identify each supplied image by number and recognizable description. Assign
its role: subject identity, composition, palette, or style. Explain which
features transfer instead of saying only “use these references.”

For edits, state the change and the features that must remain intact, such as
identity, geometry, labels, or framing. Follow-up prompts should isolate the
next change and restate critical invariants rather than redescribe everything.

## Keep API controls separate

Preserve requested dimensions and aspect ratio as requirements, but do not
suggest that prompt wording sets API parameters. Include settings instructions
only when the recipient controls the API and the request needs them.

For GPT-image-2, transparent output requires `background: "transparent"` and
PNG or WebP, not JPEG. Describe an isolated subject without a painted backdrop
or checkerboard. GPT-image-2 does not accept `input_fidelity`; image inputs
already use high fidelity. Do not import that parameter from older recipes.

## Examples

**Input:** Write an image prompt for a portrait community-garden poster, with
illustrated seedlings below, “Grow Together” at the top, and room for event
details to be added later.

**Prompt:** Create a portrait community-garden poster. Place illustrated
seedlings across the lower portion and the exact headline “Grow Together” at
the top. Leave a clear middle area for event details to be typeset later;
do not generate those details.

**Input:** Write a prompt to recolor the background of my bottle photo using
the palette in the second image. Leave the bottle and shot unchanged.

**Prompt:** Edit image 1, the bottle photograph. Recolor only its background
using the palette from image 2; do not copy image 2's objects or layout.
Preserve the bottle's shape, label lettering, position, lighting, and camera
framing exactly.
