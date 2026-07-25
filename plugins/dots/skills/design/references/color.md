# Color

Color creates hierarchy, meaning, and atmosphere. Preserve confirmed brand and
semantic conventions; do not replace a visual world under the name of
colorizing it.

## Read The Existing System

Inspect checked-in design rules, tokens, assets, current themes, and
representative states. Identify:

- confirmed brand commitments;
- current canvas, surface, text, border, action, focus, selection, and semantic
  roles;
- places where grayscale obscures hierarchy or state;
- contrast failures and color-only communication;
- light, dark, elevated, overlay, data-visualization, and image-backed needs;
- whether the request asks for more color or for a new identity.

If color would establish a new identity, use the redesign boundary in
[grounding.md](grounding.md). Ask only when a binding brand or domain decision
cannot be inferred.

## Choose A Strategy

Before selecting values, name the emotional temperature, dominant color
relationship, contrast range, and dosage. The strategy may be restrained or
immersive; it must follow the product, use scene, and selected visual world
rather than a fixed percentage rule.

Dark or light is not a category default. Describe who uses the surface, where,
under what ambient light, and for how long; let that scene inform the answer.

Build roles, not a bag of swatches:

- canvas and elevated surfaces;
- primary, secondary, and inverse text;
- primary action, secondary action, focus, and selection;
- borders and separators;
- success, warning, error, and information;
- data categories, ordered scales, or diverging scales when needed.

Use the project's existing color space. For a new web palette, prefer OKLCH when
the stack supports it because lightness and chroma can be adjusted predictably.
Choose hue from product meaning and visual direction, never from an assumed
category default.

## Apply At System Scale

- Let the strongest color own a deliberate region or stable role instead of
  scattering tiny accents.
- Keep the primary action easy to find. Do not spend its identifying color on
  decoration.
- Tint neutrals only when the brand hue genuinely creates cohesion. Neutral
  gray is valid when it serves the visual world.
- On colored surfaces, derive secondary text from the foreground or surface hue
  instead of reaching automatically for washed-out generic gray.
- Keep semantic meanings stable across the product while respecting platform
  and domain conventions; do not assume a fixed hue without checking them.
- In data displays, combine lightness, chroma, shape, label, position, or pattern
  so color is not the only code.
- Compose dark mode explicitly through surface elevation, text hierarchy,
  borders, imagery, and contrast. Do not mechanically invert the light theme.
- When the project has tokens, define primitive values and map them into
  semantic roles. Theme changes should normally remap roles rather than fork
  component styling.

Decoration without a relationship to hierarchy, state, content, or the visual
world is not a color strategy.

## Contrast And Perception

Verify computed foreground and background pairs. Use WCAG AA as the ordinary
floor:

| Content | Minimum contrast |
| --- | --- |
| Body text | `4.5:1` |
| Large text | `3:1` |
| Controls, icons, and focus indicators | `3:1` against adjacent colors |

Do not rely on eyesight alone. Check every applicable interactive state,
overlays, text on images, disabled content, charts, and each supported theme.
Simulate common color-vision deficiencies. Information conveyed by color also
needs text, shape, iconography, pattern, or position.

When deriving OKLCH ramps, vary lightness and reduce chroma near white and black.
Do not preserve high chroma at extreme lightness merely to make the math uniform.
Prefer explicit values over chains of translucent overlays when alpha makes
contrast depend unpredictably on what sits underneath.

## Verify

- Every color has a stable semantic role or a deliberate atmospheric purpose.
- Attention lands on the intended action, content, or state.
- Quiet, dense, interactive, disabled, error, loading, and empty states remain
  coherent where they are reachable.
- Light and dark themes are each composed rather than mechanically inverted.
- Contrast and non-color cues pass in every relevant state.
- The palette remains recognizably this product rather than a generic colorful
  treatment.

Verify with computed values and rendered evidence at representative viewports.
Do not treat token existence or a clean static scan as proof that contextual
contrast and hierarchy work.
