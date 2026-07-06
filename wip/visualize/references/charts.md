# Charts

Use charts when data needs comparison, trend, distribution, composition, or
relationship. If a table communicates the answer faster, use a Markdown table
instead.

## Grounding

- Use user-provided data, repo data, or verified current data.
- For current prices, statistics, rankings, schedules, benchmarks, or other
  unstable facts, verify with an authoritative source before charting.
- Name uncertainty in prose. Do not make precise visuals from guessed values.
- If data is illustrative, label it as illustrative.

## Pick The Chart

| Job | Chart |
|---|---|
| Compare categories | Bar chart |
| Show change over time | Line chart |
| Show contribution to total | Stacked bar or small multiples |
| Show distribution | Histogram, strip plot, or box plot |
| Show relationship | Scatter plot |
| Show a process total | Waterfall |
| Show ranked options with few factors | Sorted bars or compact scorecards |

Avoid pie and donut charts unless there are very few parts and exact comparison
is not the point.

## Chat-Native Charts

For small datasets, a Markdown table plus a short visual cue can be clearer than
an HTML chart. Use Mermaid only for chart-like timelines or quadrant charts when
the grammar fits.

## HTML Charts

For interactive or rendered charts, create a local HTML file under
`.agents/outputs/` and validate it using [interactive-html.md](interactive-html.md).

Chart.js is acceptable when the page is a local artifact:

- Load from a reputable CDN only when network use is acceptable, or avoid the
  dependency and draw SVG/canvas directly.
- Wrap `<canvas>` in a positioned container with explicit height.
- Use `responsive: true` and `maintainAspectRatio: false`.
- Do not set CSS height directly on the canvas.
- For horizontal bars, set container height to at least `bar count * 40 + 80`.
- Disable the default legend when a custom legend with values is clearer.
- Give multiple charts unique IDs.
- Pad scatter and bubble scales so marks near boundaries do not clip.
- Use `autoSkip: false` or rotate labels when every x-axis label matters.

## Formatting

- Round values intentionally.
- Use the sign before currency: `-$5M`, not `$-5M`.
- Include units in axis labels, legends, or tooltips.
- Direct labels often beat legends for small charts.
- Keep color meaning consistent across the chart and the prose.
