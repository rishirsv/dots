// Author-time SVG charting for html-artifact.
//
// Development-only tooling. Run this while authoring an artifact to turn data
// into a STATIC inline <svg> string, then paste the string into the
// inline-chart primitive's `chart` slot. It is never bundled into a generated
// reader artifact and never runs in the reader's browser — the artifact stays a
// single static file with no runtime chart library (see references/authoring.md).
//
// Contract:
//   - Output is a self-contained SVG string with a `viewBox` and no fixed px
//     width, so it scales and prints. The <svg> is aria-hidden="true"; the
//     visible data-table is the accessible source of record, so charts carry no
//     role="img"/aria-label (see references/primitives.md, design.md).
//   - Colors are theme tokens only: marks use var(--chart-*) and text uses
//     currentColor (resolved to --chart-text by the inline-chart theme region).
//     No raw hex is ever emitted, so charts track light/dark automatically.
//   - All interpolated text/attributes are escaped, because chart labels are
//     source-grounded and may contain <, &, or quotes.

// ---- escaping -------------------------------------------------------------

const TEXT_ESC = { "<": "&lt;", ">": "&gt;", "&": "&amp;" };
const ATTR_ESC = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" };

export function escapeText(value) {
  return String(value).replace(/[<>&]/g, (c) => TEXT_ESC[c]);
}

export function escapeAttr(value) {
  return String(value).replace(/[<>&"']/g, (c) => ATTR_ESC[c]);
}

// ---- numeric guards -------------------------------------------------------

function finite(value, label) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(`plot: ${label} must be a finite number, received ${JSON.stringify(value)}`);
  }
  return n;
}

function round(n) {
  // keep output compact and deterministic; avoids long float tails and NaN.
  return Math.round(n * 100) / 100;
}

// ---- element helpers (the composable core / escape hatch) -----------------

function attrs(map) {
  return Object.entries(map)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => ` ${k}="${escapeAttr(v)}"`)
    .join("");
}

export const rect = (a) => `<rect${attrs(a)}/>`;
export const line = (a) => `<line${attrs(a)}/>`;
export const circle = (a) => `<circle${attrs(a)}/>`;
export const path = (a) => `<path${attrs(a)}/>`;
export const text = (a, content) => `<text${attrs(a)}>${escapeText(content)}</text>`;

// `bar` and `dot` are thin semantic wrappers over rect/circle so the mark
// vocabulary in presets reads as bar/dot/rule/text.
export const bar = rect;
export const dot = (a) => circle(a);
export const rule = (a) => line(a);

// ---- scales ---------------------------------------------------------------

export function linearScale(domain, range) {
  const [d0, d1] = domain.map((d) => finite(d, "domain"));
  const [r0, r1] = range.map((r) => finite(r, "range"));
  const span = d1 - d0 || 1;
  const scale = (value) => round(r0 + ((finite(value, "value") - d0) / span) * (r1 - r0));
  scale.domain = [d0, d1];
  scale.range = [r0, r1];
  return scale;
}

// Band scale for the category axis: evenly spaced slots with inner padding.
export function bandScale(values, range, { paddingInner = 0.2 } = {}) {
  const [r0, r1] = range.map((r) => finite(r, "range"));
  const n = values.length || 1;
  const step = (r1 - r0) / n;
  const bandwidth = step * (1 - paddingInner);
  const index = new Map(values.map((v, i) => [v, i]));
  const scale = (value) => round(r0 + index.get(value) * step + (step - bandwidth) / 2);
  scale.bandwidth = () => round(bandwidth);
  scale.step = () => round(step);
  return scale;
}

// ---- margins ---------------------------------------------------------------

// Long tick labels are the main failure mode: estimate the space the longest
// label needs so it is never clipped. Callers can override with an explicit
// margin. ~6.4px/char at the label size is a deliberate slight overestimate.
export function estimateLabelWidth(labels, { perChar = 6.4, pad = 14, max = Infinity } = {}) {
  const longest = labels.reduce((m, l) => Math.max(m, String(l).length), 0);
  return Math.min(Math.ceil(longest * perChar) + pad, max);
}

function resolveMargin(base, override) {
  return { ...base, ...(override || {}) };
}

// ---- plot() : wrap marks in a themed, accessible-by-omission SVG -----------

export function plot({ width = 720, height = 240, marks = [] }) {
  const w = finite(width, "width");
  const h = finite(height, "height");
  const body = marks.filter(Boolean).join("");
  // aria-hidden: the figure's data-table is the accessible data source.
  return (
    `<svg viewBox="0 0 ${round(w)} ${round(h)}" preserveAspectRatio="xMidYMid meet"` +
    ` aria-hidden="true" focusable="false">${body}</svg>`
  );
}

// ---- small helpers shared by presets ---------------------------------------

function requireRows(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("plot: data must be a non-empty array");
  }
  return data;
}

function readRows(data, labelKey, valueKey) {
  return requireRows(data).map((row) => ({
    label: String(row[labelKey]),
    value: finite(row[valueKey], `${valueKey}`),
    raw: row,
  }));
}

const identityFormat = (v) => String(v);

// ---- presets ---------------------------------------------------------------

// Horizontal ranked bars. Long category labels live in the left margin.
export function barRanking(data, options = {}) {
  const {
    label = "label",
    value = "value",
    width = 720,
    barHeight = 26,
    gap = 12,
    sort = "desc",
    format = identityFormat,
    margin,
  } = options;

  let rows = readRows(data, label, value);
  if (sort === "desc") rows = [...rows].sort((a, b) => b.value - a.value);
  else if (sort === "asc") rows = [...rows].sort((a, b) => a.value - b.value);

  const m = resolveMargin(
    {
      top: 6,
      bottom: 6,
      right: 52,
      left: estimateLabelWidth(rows.map((r) => r.label), { pad: 16, max: width * 0.42 }),
    },
    margin,
  );

  const step = barHeight + gap;
  const height = m.top + rows.length * step - gap + m.bottom;
  const maxValue = Math.max(0, ...rows.map((r) => r.value));
  const x = linearScale([0, maxValue], [m.left, width - m.right]);
  const y = bandScale(
    rows.map((r) => r.label),
    [m.top, m.top + rows.length * step],
    { paddingInner: gap / step },
  );

  const marks = [];
  for (const row of rows) {
    const top = y(row.label);
    const mid = round(top + barHeight / 2);
    marks.push(rule({ x1: m.left, y1: mid, x2: width - m.right, y2: mid, stroke: "var(--chart-axis)", "stroke-width": 0.75 }));
    marks.push(bar({ x: m.left, y: top, width: round(x(row.value) - m.left), height: barHeight, rx: 3, fill: "var(--chart-primary)" }));
    marks.push(text({ x: m.left - 8, y: mid, "text-anchor": "end", "dominant-baseline": "middle", fill: "currentColor", "font-size": 12 }, row.label));
    marks.push(text({ x: x(row.value) + 6, y: mid, "dominant-baseline": "middle", fill: "currentColor", "font-size": 12 }, format(row.value, row.raw)));
  }
  return plot({ width, height, marks });
}

// Bars diverging from a zero baseline: positive one way, negative the other.
export function divergingBar(data, options = {}) {
  const {
    label = "label",
    value = "value",
    width = 720,
    barHeight = 26,
    gap = 12,
    format = identityFormat,
    margin,
  } = options;

  const rows = readRows(data, label, value);
  const m = resolveMargin(
    {
      top: 6,
      bottom: 6,
      right: 52,
      left: estimateLabelWidth(rows.map((r) => r.label), { pad: 16, max: width * 0.42 }),
    },
    margin,
  );

  const step = barHeight + gap;
  const height = m.top + rows.length * step - gap + m.bottom;
  const values = rows.map((r) => r.value);
  // Inset the left of the plot so a negative bar's value label clears the
  // category-label gutter instead of colliding with it.
  const valuePad = 44;
  const x = linearScale([Math.min(0, ...values), Math.max(0, ...values)], [m.left + valuePad, width - m.right]);
  const zero = x(0);
  const y = bandScale(
    rows.map((r) => r.label),
    [m.top, m.top + rows.length * step],
    { paddingInner: gap / step },
  );

  const marks = [rule({ x1: zero, y1: m.top, x2: zero, y2: height - m.bottom, stroke: "var(--chart-axis)", "stroke-width": 1 })];
  for (const row of rows) {
    const top = y(row.label);
    const mid = round(top + barHeight / 2);
    const end = x(row.value);
    const left = Math.min(zero, end);
    const w = Math.abs(end - zero);
    const positive = row.value >= 0;
    marks.push(bar({ x: round(left), y: top, width: round(w), height: barHeight, rx: 3, fill: positive ? "var(--chart-pos)" : "var(--chart-neg)" }));
    marks.push(text({ x: m.left - 8, y: mid, "text-anchor": "end", "dominant-baseline": "middle", fill: "currentColor", "font-size": 12 }, row.label));
    const valX = positive ? end + 6 : end - 6;
    marks.push(text({ x: round(valX), y: mid, "text-anchor": positive ? "start" : "end", "dominant-baseline": "middle", fill: "currentColor", "font-size": 12 }, format(row.value, row.raw)));
  }
  return plot({ width, height, marks });
}

// Lollipop: thin stem (rule) + dot at the value. Lighter than a bar at the
// same density, good for ranked magnitudes.
export function lollipop(data, options = {}) {
  const {
    label = "label",
    value = "value",
    width = 720,
    rowHeight = 30,
    sort = "desc",
    radius = 5,
    format = identityFormat,
    margin,
  } = options;

  let rows = readRows(data, label, value);
  if (sort === "desc") rows = [...rows].sort((a, b) => b.value - a.value);
  else if (sort === "asc") rows = [...rows].sort((a, b) => a.value - b.value);

  const m = resolveMargin(
    {
      top: 8,
      bottom: 8,
      right: 52,
      left: estimateLabelWidth(rows.map((r) => r.label), { pad: 16, max: width * 0.42 }),
    },
    margin,
  );
  const height = m.top + rows.length * rowHeight - rowHeight + 2 * m.bottom;
  const maxValue = Math.max(0, ...rows.map((r) => r.value));
  const x = linearScale([0, maxValue], [m.left, width - m.right]);

  const marks = [];
  rows.forEach((row, i) => {
    const cy = round(m.top + i * rowHeight);
    const cx = x(row.value);
    marks.push(rule({ x1: m.left, y1: cy, x2: cx, y2: cy, stroke: "var(--chart-axis)", "stroke-width": 2 }));
    marks.push(dot({ cx, cy, r: radius, fill: "var(--chart-primary)" }));
    marks.push(text({ x: m.left - 8, y: cy, "text-anchor": "end", "dominant-baseline": "middle", fill: "currentColor", "font-size": 12 }, row.label));
    marks.push(text({ x: cx + radius + 5, y: cy, "dominant-baseline": "middle", fill: "currentColor", "font-size": 12 }, format(row.value, row.raw)));
  });
  return plot({ width, height, marks });
}

// Slope chart: each row is a line from a "from" value to a "to" value across
// two columns. Reads change/ranking shifts at a glance.
export function slope(data, options = {}) {
  const {
    label = "label",
    from = "from",
    to = "to",
    fromLabel = "Before",
    toLabel = "After",
    width = 520,
    height = 320,
    radius = 4,
    format = identityFormat,
    margin,
  } = options;

  const rows = requireRows(data).map((row) => ({
    label: String(row[label]),
    from: finite(row[from], "from"),
    to: finite(row[to], "to"),
    raw: row,
  }));

  // Margins must fit the rendered label strings, not just the category name:
  // the left end reads "name value" (identity), the right end reads the value.
  const leftStrings = rows.map((r) => `${r.label} ${format(r.from, r.raw)}`);
  const rightStrings = rows.map((r) => `${format(r.to, r.raw)}`);
  const leftPad = estimateLabelWidth(leftStrings, { pad: 18, max: width * 0.45 });
  const rightPad = estimateLabelWidth(rightStrings, { pad: 18, max: width * 0.3 });
  const m = resolveMargin({ top: 34, bottom: 14, left: leftPad, right: rightPad }, margin);

  const leftX = m.left;
  const rightX = width - m.right;
  const allValues = rows.flatMap((r) => [r.from, r.to]);
  const y = linearScale([Math.min(...allValues), Math.max(...allValues)], [height - m.bottom, m.top]);

  const marks = [
    rule({ x1: leftX, y1: m.top - 12, x2: leftX, y2: height - m.bottom, stroke: "var(--chart-axis)", "stroke-width": 1 }),
    rule({ x1: rightX, y1: m.top - 12, x2: rightX, y2: height - m.bottom, stroke: "var(--chart-axis)", "stroke-width": 1 }),
    text({ x: leftX, y: m.top - 18, "text-anchor": "middle", fill: "currentColor", "font-size": 11 }, fromLabel),
    text({ x: rightX, y: m.top - 18, "text-anchor": "middle", fill: "currentColor", "font-size": 11 }, toLabel),
  ];
  for (const row of rows) {
    const y0 = y(row.from);
    const y1 = y(row.to);
    marks.push(line({ x1: leftX, y1: y0, x2: rightX, y2: y1, stroke: "var(--chart-primary)", "stroke-width": 1.5 }));
    marks.push(dot({ cx: leftX, cy: y0, r: radius, fill: "var(--chart-primary)" }));
    marks.push(dot({ cx: rightX, cy: y1, r: radius, fill: "var(--chart-primary)" }));
    marks.push(text({ x: leftX - radius - 6, y: y0, "text-anchor": "end", "dominant-baseline": "middle", fill: "currentColor", "font-size": 11 }, `${row.label} ${format(row.from, row.raw)}`));
    marks.push(text({ x: rightX + radius + 6, y: y1, "dominant-baseline": "middle", fill: "currentColor", "font-size": 11 }, `${format(row.to, row.raw)}`));
  }
  return plot({ width, height, marks });
}

// ---- data-table helper -----------------------------------------------------

// Convenience builder for the mandatory `data-table` slot, so the visible
// source of record is generated from the same data as the chart.
export function dataTable(data, columns) {
  requireRows(data);
  const head = columns.map((c) => `<th>${escapeText(c.head)}</th>`).join("");
  const body = data
    .map((row) => `<tr>${columns.map((c) => `<td>${escapeText(c.cell(row))}</td>`).join("")}</tr>`)
    .join("");
  return `<div data-slot="data-table" class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}
