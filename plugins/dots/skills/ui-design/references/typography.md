# Typography

Shape how text communicates identity, hierarchy, and meaning. Inspect established
faces, roles, and rendered content before editing. Preserve confirmed families
unless changing the identity is in scope.

## Choose Type For The Surface

Expressive headlines can carry the subject's character through distinctive
letterforms, proportions, and composition. Sustained reading needs comfortable
rhythm; compact controls need quick recognition; data needs reliable comparison.
Tune these uses separately rather than applying one treatment throughout.

Choose faces by their actual letterforms, x-height, width, available weights and
italics, language coverage, and fit with the product. Compare candidates using
real headings, labels, and paragraphs. A common family can be the right choice;
novelty alone is not a reason to replace it. Add a second family only for a clear
role, with enough contrast to make the pairing intentional.

## Build Hierarchy Through Roles

Define the display, heading, body, label, metadata, and numeric roles the interface
needs. Reuse the project's tokens and keep repeated roles consistent. Combine
size, weight, width, space, and case so visual emphasis matches importance.

A modular scale is a useful starting point, not proof of hierarchy. Judge adjacent
roles in context: small numerical differences can disappear, while excessive
contrast can fragment the page. Choose heading semantics from document structure
and style them for their role rather than choosing tags for their default size.

## Tune Reading And Composition

Tune measure, leading, tracking, and paragraph rhythm together using the actual
face, language, and content. For ordinary web prose, around `1rem` body text and
`45–75ch` measure are useful starting points. Dense tools, expressive layouts,
and native surfaces may need different choices.

Short headings often benefit from tighter leading; multiline text needs room to
track between lines. Wider measures generally need more leading. Inspect light
text on dark surfaces before adjusting weight or spacing. Avoid universal
corrections based only on the theme.

Align sustained text to the starting edge for its writing direction. Reserve
centering for short, independent blocks whose changing line starts remain easy
to scan. In tables, align comparable numbers by their right edge or decimal;
when different text sizes share a row, align their baselines rather than their
bounding boxes.

Use stable role sizes for compact interfaces. Fluid display sizing can support
expansive layouts when its minimum and maximum preserve hierarchy. Tune tracking
to size and letterforms; small uppercase labels and large headlines have different
needs. Use paragraph spacing or indentation deliberately rather than doubling
both without a reason.

Treat links according to context. Links embedded in prose need a persistent cue
that survives color-vision differences; navigation and other interaction-dense
regions can use weight, contrast, position, and state instead of making every
link compete with the primary action.

## Handle Wrapping And Overflow

Inspect real copy at the widths where it breaks. Balance short headings when it
improves the composition, and consider better final-line wrapping for descriptions.
Keep normal wrapping for sustained reading unless the result justifies a change.

Allow long URLs, identifiers, and words to break without forcing container
overflow. Keep short labels together only when they still fit at supported text
sizes. Truncate secondary text selectively; provide a reachable full value when
omitted content matters. Hover alone is insufficient for touch and keyboard use.

Test translated text and mixed-direction content. Set language and direction at
the appropriate content boundary; isolate inserted values whose direction differs.
Avoid hard-coded line breaks that only work for one string or viewport.

## Refine Font Behavior

Load the real weights and italics the design uses. Synthetic styles can distort
the face, but disabling synthesis without available alternatives can erase
emphasis. Inspect required styles and fallbacks before suppressing it.

Use optical sizing when supported, and compare text versus display variants at
their intended sizes. Prefer standard properties such as `font-weight` and
`font-variant-numeric` over raw axis or feature tags when equivalents exist.
Use custom axes and OpenType features only when the font supports them.

Use tabular numerals for aligned columns and changing values where digit widths
would cause movement. Tune underlines so they remain recognizable without cutting
through letterforms. Preserve useful text selection; suppress it only where it
interferes with a gesture. Avoid imposing font smoothing across platforms without
checking the rendered effect.

## Load And Adapt Reliably

Load only the required font files, weights, and character coverage. On the web,
prefer WOFF2 when available, choose a loading strategy that keeps content usable,
and match fallback metrics where late font loading causes disruptive reflow.
Derive metric adjustments from the actual faces rather than copying arbitrary
percentages.

Preserve browser zoom and user text settings. Let line boxes and containers grow
with content. In native interfaces, use platform text styles and scaling behavior
instead of translating CSS recipes literally.

For web font loading, metrics or OpenType features, read [font CSS](recipes/font-css.md).
For wrapping, truncation, underlines or mixed-direction values, read [text CSS](recipes/text-css.md).

## Inspect The Result

Check representative prose, controls, and data with real copy, long strings,
localized expansion, fallback fonts, and supported text sizes. Inspect wrapping,
clipping, hierarchy, and loading reflow in the rendered result; source inspection
alone cannot establish them.
