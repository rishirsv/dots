# Charts

Use this reference when choosing or editing a chart. For a page module, find
the supported helper with `node scripts/catalog.mjs --list` and read its
signature with `--help <helper>`.

## Generate supported charts, build others

Use the report helpers, or `scripts/chart.mjs` for a hand-written body, to
build bar, line, stacked, and sparkline charts. The script computes
coordinates and emits a chart fragment with its input spec embedded as a
`<!-- chart-spec {...} -->` comment. Chart text cannot contain `--`, which
would break that comment:

```sh
echo '{"title":"Spend by team, $k",
       "data":[["platform",412],["growth",255],["ml",104]],
       "emphasis":"platform"}' | node scripts/chart.mjs bar
```

Forms: `bar` for ranked magnitudes; `line` for ordered `[label, value]` points;
`stacked` for `[label, ...values]` rows with named `series`; and `sparkline`
for an inline trend with visible `value` text. Bar spec keys include `emphasis`,
`sort`, and `limit`. Bar and stacked values must be non-negative. Use the
catalog's `--help` for the exact helper signatures.

To edit a generated chart, change its `chart-spec` comment and run
`node scripts/chart.mjs --from-fragment
<file>`. The command regenerates every chart with a `chart-spec` comment in
place, preserving the rest of the file, including when `<file>` is a full page.

Build chart types the script does not support when they make the data easier to
understand. Follow the mark specs and accessibility rules below, use only
the `x-chart` roles in [DESIGN.md](DESIGN.md), and preserve the closest registry
component's structure where it applies.

For a hand-written body, add the matching registry component CSS. Colors flow
through the `--chart-*` tokens so themes work without changing the chart data.

## Choose the chart from the reader's question

| The reader needs to… | Form |
|---|---|
| Compare magnitudes across items | Horizontal bars (`bar-chart`) |
| See a trend over time | Sparkline for a compact inline trend; line chart for a full figure |
| See above/below a baseline | Diverging bars from a zero rule |
| See parts of a whole | Stacked bar — one bar, labeled segments |
| Compare several measures or distributions | Shared-scale small multiples |
| Show parallel work over time | Aligned lanes on one shared time axis |
| Absorb one headline number | Not a chart — `stat-tiles` |
| Scan many attributes per item | Not a chart — `data-table` |

Use a chart when magnitude, direction, or shape is easier to see than read.
Prefer prose or a table when visual encoding adds no decision value; dataset
size alone is not the deciding rule.

## Compose the chart, not a dashboard around it

For a named numeric dataset or one-off analysis, start with the chart. Put the
important values and takeaway on its marks, axis, or annotations when space
allows. Do not add a KPI row, controls, cards, or a second visualization unless
they answer a different supplied question.

Render every requested dimension together when comparison is the point. Use
shared-scale facets or small multiples instead of hiding one dimension behind a
toggle. For parallel sequences, align lanes to one time axis and annotate
totals, waits, and bottlenecks where they occur rather than duplicating them in
cards above the plot.

## Color by purpose, from tokens only

- Structure (tracks, axes, connectors): the alpha ladder — `--a4` tracks,
  `--a20` rules, `--a40` marks.
- The one emphasized series or point: `--accent` (deep text partner:
  `--accent-deep`).
- Non-emphasized series: alpha steps (`--a20`/`--a40`/`--a70`) — lightness
  separates them in both modes and survives color-vision deficiency.
- Good/bad polarity: `--warning-*`/`--danger-*` inks only when the data is
  genuinely a warning, never as a second decorative hue.

Never introduce raw hex in a chart. If two series can't be told apart with
the ladder, that's the signal to split into small multiples, not to add
color.

Keep each encoding stable throughout the page. Apply a category or series
encoding to its marks, not its text labels, and pair emphasis with a direct
label, shape, position, or line treatment so color never carries meaning alone.

## Fixed sizes

- Bars: 18px tall, 4px radius, 10px row gap; value labels right-aligned,
  tabular-nums, 12px.
- Sparklines: ~120×28, 1.5px stroke, one terminal dot at 2.5px in accent.
- Lines in figures: 2px; grid rules 1px at `--a12`; no drop shadows, no
  gradients, no 3D.
- Direct labels beat legends: 1-3 series may share a quiet legend line; 4+
  series must be directly labeled or split into small multiples.
- Reserve space for the longest formatted label and value at every supported
  width. Move, wrap, or reduce tick density before allowing text to overlap a
  mark, axis, legend, or edge.
- Scope SVG selectors to the chart component; never style every `svg` inside a
  container that may also hold icons or unrelated figures.

## Accessibility

Every chart is inline SVG with `aria-hidden="true"`; the accessible content
is adjacent text or a table carrying the same numbers. If the numbers appear
only in the SVG, the chart is wrong. Bars animate via the shared `.reveal`
pattern (grow once); with reduced motion or no JS they render at full width.
Use no network-loaded chart library: author inline SVG or generate a supported
chart locally so the final page remains self-contained.
