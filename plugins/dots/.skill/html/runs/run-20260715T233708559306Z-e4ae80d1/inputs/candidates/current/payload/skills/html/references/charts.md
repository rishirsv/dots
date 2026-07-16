# Charts

Read this before building any chart. Charts here are right by construction,
not by taste: the data's job picks the form, tokens pick every color, and
fixed mark specs pick every size.

## Generate supported forms, author others

Use `scripts/chart.mjs` for bar charts and sparklines. It computes every
coordinate and emits a finished catalog fragment (`data-component`, title,
accessible data, `reveal`, `--chart-*` tokens) with the input spec embedded as
a `<!-- chart-spec {...} -->` comment:

```sh
echo '{"title":"Spend by team, $k",
       "data":[["platform",412],["growth",255],["ml",104]],
       "emphasis":"platform"}' | node scripts/chart.mjs bar
```

Forms: `bar` (ranked magnitudes) and `sparkline` (inline trend; spec needs
`data` numbers plus visible `value` text). Bar spec keys: `title`, `data` (rows
as `[label, value]`), `emphasis` (label of the one accent-colored element),
`sort` (`desc`/`asc`/`none`), and `limit`. Labels, titles, and visible values
must not contain `--`.

To edit an existing chart, never touch coordinates: read its `chart-spec`
comment, change the spec, then run `node scripts/chart.mjs --from-fragment
<file>`. The command rewrites that fragment file in place.

Author forms the script does not support when they make the data easier to
understand. Follow the mark specs and accessibility contract below, use only
the `x-chart` roles in [DESIGN.md](DESIGN.md), and preserve the closest registry
component's anatomy where it applies.

CSS: `bar` needs `bar-chart.html` on the page; `sparkline` needs
`sparkline.html`. Colors flow through the `--chart-*` tokens — emphasis is
accent, everything else neutral, and themes can re-point chart color without
touching the script.

## Form follows the data's job

| The reader needs to… | Form |
|---|---|
| Compare magnitudes across items | Horizontal bars (`bar-chart`) |
| See a trend over time | Sparkline inline, or a line figure for keepers |
| See above/below a baseline | Diverging bars from a zero rule |
| See parts of a whole | Stacked bar — one bar, labeled segments |
| Absorb one headline number | Not a chart — `stat-tiles` |
| Scan many attributes per item | Not a chart — `data-table` |

Use a chart when magnitude, direction, or shape is easier to see than read.
Prefer prose or a table when visual encoding adds no decision value; dataset
size alone is not the deciding rule. Refuse numbers you would have to invent.
A missing chart is honest; a decorative one is not.

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

## Mark specs (fixed, not per-artifact taste)

- Bars: 18px tall, 4px radius, 10px row gap; value labels right-aligned,
  tabular-nums, 12px.
- Sparklines: ~120×28, 1.5px stroke, one terminal dot at 2.5px in accent.
- Lines in figures: 2px; grid rules 1px at `--a12`; no drop shadows, no
  gradients, no 3D.
- Direct labels beat legends: 1-3 series may share a quiet legend line; 4+
  series must be directly labeled or split into small multiples.

## Accessibility

Every chart is inline SVG with `aria-hidden="true"`; the accessible content
is adjacent text or a table carrying the same numbers. If the numbers appear
only in the SVG, the chart is wrong. Bars animate via the shared `.reveal`
pattern (grow once); with reduced motion or no JS they render at full width.
