# Surface Critique

Judge one rendered surface on its own terms or against an accepted visual
target. A focused critique returns the strongest findings. A full acceptance
review returns `passed` or `blocked`.

## Establish The Comparison

Choose one mode:

- **Target comparison:** inspect both the source visual target and the rendered
  implementation.
- **Single-surface critique:** inspect the rendered implementation and any
  governing brief, specification, prompt, or acceptance criteria.

Return `final result: blocked` when required evidence cannot be opened,
captured, or compared. Do not call a target comparison complete from separate
image descriptions.

For a target comparison:

1. Match viewport, state, theme, density, route, content, authentication, and
   interaction state before judging.
2. Align crop, scale, and device frame. Put the target and implementation in the
   same comparison input.
3. Inspect the whole view for composition, hierarchy, density, and responsive
   structure, then inspect focused regions where type, alignment, imagery,
   icons, controls, or states are not readable at full-view scale.

For a single-surface critique, state the intended user task and quality bar,
then capture the smallest set of viewports and reachable states needed to judge
them.

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

## Decide The Result

Return `final result: passed` when the surface is ready for its stated handoff
and every remaining difference is classified as acceptable, expected, or
non-blocking polish.

Return `final result: blocked` when:

- required evidence is missing;
- a target comparison cannot establish fidelity;
- a required fidelity surface has an unresolved acceptance issue;
- any `P0` or `P1` remains; or
- a `P2` breaks the stated bar, target fidelity, usability, accessibility, or
  responsive quality.

`P3` does not block unless the user set a stricter bar.

## Report

Lead with:

1. `final result: passed|blocked`;
2. what was compared and at which states or viewports;
3. findings using the parent finding contract;
4. the ordered implementation checklist when useful;
5. material evidence limits.

Finish when every required surface is covered or explicitly inapplicable, each
finding has an acceptance check, and the result follows the rules above.
