# Surface Critique

Judge one rendered surface against its user task, governing brief, and accepted
product intent. For comparison with a visual target, use
[fidelity-review.md](fidelity-review.md).

State the intended task and quality bar, then inspect the smallest set of
viewports and reachable states needed to judge them. Continue with supported
findings when some evidence is unavailable and state the resulting limits.

## Inspect The Applicable Surfaces

For a full acceptance review, cover the five fidelity surfaces below. For a
focused critique, inspect only surfaces that can change the requested judgment.

| Surface | Inspect |
| --- | --- |
| Typography | Family and fallback, weight, size, line height, spacing, hierarchy, wrapping, truncation, text scaling, and UI chrome—not only headings. Read [typography.md](../../design/references/typography.md) when type is material. |
| Spacing and layout | Frame, crop, grid, alignment, margins, padding, gaps, sizing rhythm, radii, elevation, grouping, density, and breakpoint behavior. Read [spacing.md](../../design/references/spacing.md) when spatial fidelity is material. |
| Color and tokens | Palette, semantic roles, contrast, themes, gradients, opacity, borders, shadows, focus, and state color. Read [color.md](../../design/references/color.md) when color is material. |
| Images, icons, and assets | Subject, crop, aspect ratio, scale, sharpness, compression, masking, transparency, icon family, stroke, optical alignment, and target assets. Flag code-drawn or placeholder substitutions when the accepted target requires a specific visible asset. |
| Copy and content | Required app-specific text, labels, hierarchy, coherence, truncation, and fidelity to supplied content. |

Also inspect when applicable:

- reachable default, hover, focus, active, selected, disabled, loading, empty,
  success, error, permission, and reduced-motion states; read
  [interaction-design.md](../../design/references/interaction-design.md);
- keyboard access, focus visibility, labels, contrast, target size, text
  scaling, and reflow;
- desktop, intermediate, and mobile widths that materially change the layout;
- whether imagery, type, composition, components, and copy belong to this
  product rather than a swappable template;
- live or recorded behavior under
  [motion-audit.md](motion-audit.md) when motion affects acceptance.

Do not treat every pixel difference as a defect when intent and acceptance hold.
Do not accept a full-view pass when material details are unreadable.

For a full review of one surface, also use the applicable state, adaptation,
and accessibility probes in [experience-audit.md](experience-audit.md), without
expanding to an unrelated journey.

## Report And Finish

Use the parent's compact report and acceptance rules. Return a verdict only for
a requested acceptance or readiness gate. Finish when the scoped surfaces are
covered or their evidence gaps named, every finding has an acceptance check,
and any verdict follows the evidence. Preserve meaningful visual character and
deliberate omissions when recommending corrections.
