# Layout And Responsiveness

Compose around the user's task and information relationships. Preserve established
grids and spacing conventions unless changing them is part of the brief.

## Establish Hierarchy And Density

Identify the primary action, reading order, and information needed together.
Group related content through proximity, alignment, and type before adding
containers. Cards suit independently meaningful objects; they are not a default
wrapper for every section. Match density to use: repeated expert work may need
more simultaneous information than onboarding or a focused decision.

Choose a grid that serves the content. Give repeated rows consistent lanes for
icons, labels, values, and actions, including rows with missing optional content.
Tune optical alignment after structural alignment. Use spacing tokens for repeated relationships.

Use a few strong alignment axes within each region; several unrelated left,
center, and right edges make scanning harder.

Choose one major and one minor spacing unit for vertical rhythm, and align
everything to those units by default.

Organize the first view around the user's immediate task. Remove labels that
merely restate visible context and avoid repeating the same fact, status, or
result in multiple regions. Defer provenance, original inputs, and internal
rule or revision details until they help someone verify, compare, or correct
the result. Keep risk, coverage, and approval information visible when it
changes the user's decision or next action.

Judge repeated rows as a collection at the real viewport, not as one component
in isolation. Account for every recurring control, label, divider, and line of
copy: a small excess repeated across the visible list can dominate the screen.
When a row has optional supporting content, put one clearly named disclosure
control in the row and expand the content in place; do not spend a permanent
subrow on the disclosure alone. A disclosure still adds a control and a
decision, so include it only when the hidden content is useful in that view.

## Adapt The Composition

Choose breakpoints where content stops working, not only from device labels.
Decide what reflows, stacks, condenses, moves into disclosure, or remains scrollable.
Preserve task priority and logical reading order as the structure changes.

Prefer intrinsic sizing, flexible tracks, and bounded reading widths over fixed
geometry. Account for long labels, empty regions, additional rows, translated
content, and enlarged text. Keep controls reachable when browser chrome, a virtual
keyboard, safe areas, or sticky regions reduce the available space.

Do not scale every property by the same ratio. Large display type, media, and
generous padding often need to contract faster than body text, controls, and
touch targets. Keep elements near the size their content needs while space is
available; let flexible regions absorb change and introduce compression only
when a real constraint requires it.

Dense tables and canvases may need intentional scrolling or alternate views.
Keep essential context and controls available, and distinguish that behavior from
accidental page overflow. Avoid hiding information solely to fit a smaller screen.

## Inspect In Context

Inspect narrow and wide containers and the widths around layout transitions.
Check real content, extreme lengths, text scaling, and relevant orientations.
Look for collisions, stranded headings, broken grouping, and sticky elements
covering focused content. Evaluate whether hierarchy survives, not merely whether
the page fits. Use the active audit or QA workflow for findings and iterations.

## Irregular Collections

When items have different proportions, choose deliberately between cropping,
regular tracks and a masonry-style layout. Preserve meaningful source order and
check that keyboard traversal agrees with visual grouping. Treat new layout
features as progressive enhancements and inspect the fallback in the supported
browsers.

For logical CSS properties or independently resizing web components, read
[adaptive layout](recipes/adaptive-layout.md).
For lazy SwiftUI collection sizing or state loss, read [scrolling.md](platforms/scrolling.md).
For close nested radii, read [surface geometry](recipes/surface-geometry.md).
For unbalanced glyphs or button padding, read [optical alignment](recipes/optical-alignment.md).
