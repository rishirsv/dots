# Diagram vocabulary

Use this when relationships, direction, hierarchy, or state are clearer as a
figure. For page modules, use the `flow`, `state`, `sequence`, or computed
`timeline` helper when it fits; `node scripts/catalog.mjs --help <helper>`
shows the input shape. Use [the diagram gallery](../assets/diagrams.html) to
compare visual forms. Hand-author a figure when the helpers cannot express the
relationship or the composition needs precise placement.

## Choose by the question

| Reader question | Diagram | Atlas source |
|---|---|---|
| What parts exist and how do they connect? | Architecture | `#architecture` |
| How does the full system divide into layers, paths, and owners? | Architecture board | `#architecture-board` |
| What happens at each decision branch? | Flowchart | `#flowchart` |
| Where do items sit on two independent axes? | Quadrant | `#quadrant` |
| Which categories are larger or smaller? | Bar chart | `#bar-chart` |
| How does a measure change over time? | Line chart | `#line-chart` |
| How does a whole divide into a few parts? | Donut chart | `#donut-chart` |
| Which states exist and what transitions between them? | State machine | `#state-machine` |
| When did milestones happen? | Timeline | `#timeline` |
| How does work cross roles or systems? | Swimlane | `#swimlane` |
| What is the parent-child hierarchy? | Tree | `#tree` |
| Which layers sit above or depend on others? | Layer stack | `#layer-stack` |
| Where do two or three sets overlap? | Venn | `#venn` |
| How did an open-high-low-close series move? | Candlestick | `#candlestick` |
| Which increments and decrements explain the ending value? | Waterfall | `#waterfall` |
| What messages pass between participants over time? | Sequence | `#sequence` |
| What fields, methods, and inheritance define the types? | Class | `#class` |
| Which records relate, and with what cardinality? | Entity relationship | `#entity-relationship` |

Use a comparison table for a binary contrast. Use ordinary prose when one box
or one arrow would merely restate a sentence.

## Draw the relationship, not decoration

- Keep an embedded diagram to about 4–9 nodes. Split a larger explanation into
  two diagrams or promote it to an architecture board.
- Emphasize only one or two elements. Neutral structure should
  carry most of the drawing.
- Remove connectors whose meaning is already obvious from placement.
- Put important labels in HTML when a responsive SVG would shrink them below
  11px. Otherwise place the diagram in an internally scrolling wrapper.
- Keep the SVG `aria-hidden="true"` and state the equivalent relationship in
  an adjacent summary or ordered explanation.
- Use existing tokens only. A new diagram may introduce geometry, never a
  second palette, font system, shadow language, or decorative texture.

For bar, line, donut, candlestick, and waterfall forms, also read
[charts.md](charts.md). Exact values need visible labels or an adjacent table;
the picture is not the only copy of the data.

## Architecture boards

Use an architecture board only when one embedded figure cannot show the
system boundary, principal runtime path, intervention point, and ownership
together. Organize it into a stable reading order:

1. title and judgment;
2. external roles or business domains;
3. system modules;
4. runtime or data path;
5. governance, ownership, or next intervention.

Prefer bands with dividers over a field of small cards. Keep 10–25 major
blocks; merge detail into domains beyond that. Orthogonal connectors should
not cross text or run along a module border.

## Hand-authored figures

Each gallery example is a complete `<figure>` with inline SVG and an adjacent
text summary. For a form without a computed helper, copy the closest figure
and its shared `.diagram-*` rules, then replace the example labels, values,
connectors, and summary with the supplied material. Adjust geometry to fit the
actual labels and relationships.

Before handoff, inspect the actual display width. A valid diagram has no
overlapping labels, ambiguous crossings, clipped content, unreadable scaled
text, or strong emphasis on more than two elements.
