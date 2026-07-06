#!/usr/bin/env node
/**
 * chart.mjs — compile a chart spec into a catalog-conformant fragment.
 *
 * Authoring-time only: run it while building an artifact, paste the output,
 * never ship the script. Colors come exclusively from --chart-* tokens
 * (see DESIGN.md x-chart); markup matches the registry anatomy so output is
 * indistinguishable from hand-authored catalog work and machine-editable.
 *
 * CLI:  node scripts/chart.mjs <bar|diverging|slope|sparkline> --in spec.json
 *       cat spec.json | node scripts/chart.mjs bar
 *       node scripts/chart.mjs bar --spec '{"title":"…","data":[["a",1]]}'
 *       node scripts/chart.mjs --from-fragment chart.html   (re-render from
 *       the embedded chart-spec comment — the edit loop)
 * API:  import { chart, parseSpec } from "./chart.mjs"
 *
 * Every fragment embeds its normalized spec as `<!-- chart-spec {...} -->`.
 * To edit a chart: read the spec, change it, re-run, replace the fragment.
 * Spec strings must not contain "--" (HTML comments forbid it).
 *
 * CSS dependencies (paste the registry fragment's CSS once per page):
 *   bar → bar-chart.html · sparkline → sparkline.html
 *   diverging/slope → bar-chart.html (.chart-card/.chart-title only)
 */

import { readFileSync } from "node:fs";

// ---------- text safety ----------

const TEXT_ESC = { "<": "&lt;", ">": "&gt;", "&": "&amp;" };
const ATTR_ESC = { ...TEXT_ESC, '"': "&quot;", "'": "&#39;" };

export const escapeText = (v) => String(v).replace(/[<>&]/g, (c) => TEXT_ESC[c]);
export const escapeAttr = (v) => String(v).replace(/[<>&"']/g, (c) => ATTR_ESC[c]);

const round = (n) => Math.round(n * 100) / 100;

function fail(msg) {
  throw new Error(`chart.mjs: ${msg}`);
}

// ---------- scales ----------

export function linearScale([d0, d1], [r0, r1]) {
  if (d0 === d1) fail("linearScale domain has zero span");
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

// ---------- spec normalization ----------

const TYPES = ["bar", "diverging", "slope", "sparkline"];

function toRows(data, keys) {
  if (!Array.isArray(data) || data.length === 0) fail("spec.data must be a non-empty array");
  return data.map((row, i) => {
    const values = Array.isArray(row) ? row : keys.map((k) => row[k]);
    const out = {};
    keys.forEach((k, j) => (out[k] = values[j]));
    if (typeof out.label !== "string" || !out.label.length) fail(`row ${i}: label must be a non-empty string`);
    if (out.label.includes("--")) fail(`row ${i}: labels must not contain "--" (breaks the chart-spec comment)`);
    for (const k of keys.slice(1)) {
      if (!Number.isFinite(out[k])) fail(`row ${i}: ${k} must be a finite number`);
    }
    return out;
  });
}

export function normalizeSpec(type, spec) {
  if (!TYPES.includes(type)) fail(`unknown type "${type}" (expected ${TYPES.join("|")})`);
  if (spec == null || typeof spec !== "object") fail("spec must be an object");
  if (typeof (spec.title ?? "") !== "string") fail("spec.title must be a string");
  if ((spec.title ?? "").includes("--")) fail('spec.title must not contain "--"');
  if (type !== "sparkline" && !spec.title) fail(`spec.title is required for ${type}`);

  const norm = { type, title: spec.title ?? "" };

  if (type === "sparkline") {
    if (!Array.isArray(spec.data) || spec.data.length < 2 || !spec.data.every(Number.isFinite)) {
      fail("sparkline spec.data must be 2+ finite numbers");
    }
    if (typeof spec.value !== "string" || !spec.value.length) fail("sparkline spec.value (visible text) is required");
    if (spec.value.includes("--")) fail('spec.value must not contain "--"');
    return { ...norm, data: spec.data.slice(), value: spec.value };
  }

  const keys = type === "slope" ? ["label", "from", "to"] : ["label", "value"];
  let rows = toRows(spec.data, keys);

  const sort = spec.sort ?? (type === "bar" ? "desc" : "none");
  if (!["desc", "asc", "none"].includes(sort)) fail('spec.sort must be "desc", "asc", or "none"');
  const sortKey = type === "slope" ? "to" : "value";
  if (sort !== "none") rows = rows.slice().sort((a, b) => (sort === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));

  if (spec.limit != null) {
    if (!Number.isInteger(spec.limit) || spec.limit < 1) fail("spec.limit must be a positive integer");
    rows = rows.slice(0, spec.limit);
  }

  if (spec.emphasis != null) {
    if (!rows.some((r) => r.label === spec.emphasis)) fail(`spec.emphasis "${spec.emphasis}" matches no row label`);
    norm.emphasis = spec.emphasis;
  }

  const out = { ...norm, data: rows.map((r) => keys.map((k) => r[k])), sort };
  if (spec.limit != null) out.limit = spec.limit;
  if (type === "slope") {
    out.fromLabel = spec.fromLabel ?? "before";
    out.toLabel = spec.toLabel ?? "after";
    for (const k of ["fromLabel", "toLabel"]) {
      if (typeof out[k] !== "string" || out[k].includes("--")) fail(`spec.${k} must be a string without "--"`);
    }
  }
  return out;
}

// ---------- shared emit helpers ----------

const specComment = (norm) => `<!-- chart-spec ${JSON.stringify(norm)} -->`;

function chartCard(norm, body) {
  return [
    `<div data-component="${norm.type === "bar" ? "bar-chart" : norm.type + "-chart"}" class="chart-card reveal">`,
    specComment(norm),
    `  <div class="chart-title">${escapeText(norm.title)}</div>`,
    body,
    `</div>`,
  ].join("\n");
}

function dataDetails(headers, rows) {
  const head = headers.map((h) => `<th>${escapeText(h)}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${r.map((c, i) => `<td${i > 0 ? ' class="num"' : ""}>${escapeText(c)}</td>`).join("")}</tr>`)
    .join("\n      ");
  return [
    `  <details class="chart-data">`,
    `    <summary>Data</summary>`,
    `    <table>`,
    `      <thead><tr>${head}</tr></thead>`,
    `      <tbody>${body}</tbody>`,
    `    </table>`,
    `  </details>`,
  ].join("\n");
}

const LABEL_STYLE = 'style="font-family:var(--font-sans);font-size:12px;fill:var(--chart-label)"';
const VALUE_STYLE = 'style="font-family:var(--font-sans);font-size:12px;fill:var(--chart-value);font-variant-numeric:tabular-nums"';
const VALUE_EMPH_STYLE = 'style="font-family:var(--font-sans);font-size:12px;font-weight:600;fill:var(--chart-value-emphasis);font-variant-numeric:tabular-nums"';

// generous label estimate; override with spec-free explicit design instead of
// plot.mjs's tight 6.4px/char guess
const labelWidth = (labels) => Math.min(220, Math.max(...labels.map((l) => l.length)) * 7.2 + 16);

// ---------- presets ----------

function barFragment(norm) {
  const rows = norm.data.map(([label, value]) => ({ label, value }));
  const max = Math.max(...rows.map((r) => r.value));
  if (max <= 0) fail("bar chart needs at least one positive value");
  const body = rows
    .map((r) => {
      const emph = r.label === norm.emphasis;
      const pct = round((r.value / max) * 100);
      return [
        `  <div class="bar-row">`,
        `    <div class="bar-name">${escapeText(r.label)}</div>`,
        `    <div class="bar-track"><div class="bar-fill${emph ? " emphasis" : ""}" style="width:${pct}%"></div></div>`,
        `    <div class="bar-value"${emph ? ' style="color:var(--chart-value-emphasis);font-weight:600"' : ""}>${escapeText(r.value)}</div>`,
        `  </div>`,
      ].join("\n");
    })
    .join("\n");
  return chartCard(norm, body);
}

function divergingFragment(norm) {
  const rows = norm.data.map(([label, value]) => ({ label, value }));
  const W = 640, ROW = 26, GAP = 8, VAL_PAD = 44;
  const left = labelWidth(rows.map((r) => r.label));
  const H = rows.length * (ROW + GAP) - GAP;
  const maxPos = Math.max(0, ...rows.map((r) => r.value));
  const maxNeg = Math.min(0, ...rows.map((r) => r.value));
  if (maxPos === 0 && maxNeg === 0) fail("diverging chart needs a nonzero value");
  const x = linearScale([Math.min(maxNeg, 0), Math.max(maxPos, 0)], [left + VAL_PAD, W - VAL_PAD]);
  const zero = round(x(0));

  const marks = [
    `<line x1="${zero}" y1="0" x2="${zero}" y2="${H}" stroke="var(--chart-grid)" stroke-width="1"/>`,
  ];
  rows.forEach((r, i) => {
    const y = i * (ROW + GAP);
    const emph = r.label === norm.emphasis;
    const fill = emph ? "var(--chart-emphasis)" : r.value >= 0 ? "var(--chart-pos)" : "var(--chart-neg)";
    const bx = r.value >= 0 ? zero : round(x(r.value));
    const bw = round(Math.abs(x(r.value) - zero));
    marks.push(
      `<text x="${left - 8}" y="${y + ROW / 2 + 4}" text-anchor="end" ${LABEL_STYLE}>${escapeText(r.label)}</text>`,
      `<rect x="${bx}" y="${y + 4}" width="${bw}" height="${ROW - 8}" rx="4" fill="${fill}"/>`,
      `<text x="${r.value >= 0 ? round(x(r.value)) + 6 : round(x(r.value)) - 6}" y="${y + ROW / 2 + 4}" text-anchor="${r.value >= 0 ? "start" : "end"}" ${emph ? VALUE_EMPH_STYLE : VALUE_STYLE}>${escapeText(r.value)}</text>`
    );
  });

  const body = [
    `  <div class="chart-scroll" style="overflow-x:auto">`,
    `    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style="width:100%;height:auto">`,
    `      ${marks.join("\n      ")}`,
    `    </svg>`,
    `  </div>`,
    dataDetails(["item", "value"], norm.data),
  ].join("\n");
  return chartCard(norm, body);
}

function slopeFragment(norm) {
  const rows = norm.data.map(([label, from, to]) => ({ label, from, to }));
  const W = 520, H = Math.max(200, rows.length * 44), PAD = 28;
  const left = labelWidth(rows.map((r) => `${r.label} ${r.from}`));
  const right = 64;
  const all = rows.flatMap((r) => [r.from, r.to]);
  const lo = Math.min(...all), hi = Math.max(...all);
  const y = lo === hi ? () => H / 2 : linearScale([lo, hi], [H - PAD, PAD]);
  const x0 = left, x1 = W - right;

  // nudge overlapping labels apart (14px minimum)
  function spread(items) {
    const sorted = items.slice().sort((a, b) => a.y - b.y);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].y - sorted[i - 1].y < 14) sorted[i].y = sorted[i - 1].y + 14;
    }
    return items;
  }
  const leftLabels = spread(rows.map((r) => ({ r, y: y(r.from) })));
  const rightLabels = spread(rows.map((r) => ({ r, y: y(r.to) })));

  const marks = [
    `<text x="${x0}" y="14" text-anchor="start" ${LABEL_STYLE}>${escapeText(norm.fromLabel)}</text>`,
    `<text x="${x1}" y="14" text-anchor="end" ${LABEL_STYLE}>${escapeText(norm.toLabel)}</text>`,
  ];
  rows.forEach((r) => {
    const emph = r.label === norm.emphasis;
    const stroke = emph ? "var(--chart-emphasis)" : "var(--chart-mark)";
    marks.push(
      `<line x1="${x0}" y1="${round(y(r.from))}" x2="${x1}" y2="${round(y(r.to))}" stroke="${stroke}" stroke-width="2"/>`,
      `<circle cx="${x0}" cy="${round(y(r.from))}" r="3.5" fill="${stroke}"/>`,
      `<circle cx="${x1}" cy="${round(y(r.to))}" r="3.5" fill="${stroke}"/>`
    );
  });
  leftLabels.forEach(({ r, y: ly }) =>
    marks.push(`<text x="${x0 - 10}" y="${round(ly) + 4}" text-anchor="end" ${r.label === norm.emphasis ? VALUE_EMPH_STYLE : LABEL_STYLE}>${escapeText(`${r.label} ${r.from}`)}</text>`)
  );
  rightLabels.forEach(({ r, y: ry }) =>
    marks.push(`<text x="${x1 + 10}" y="${round(ry) + 4}" text-anchor="start" ${r.label === norm.emphasis ? VALUE_EMPH_STYLE : VALUE_STYLE}>${escapeText(r.to)}</text>`)
  );

  const body = [
    `  <div class="chart-scroll" style="overflow-x:auto">`,
    `    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style="width:100%;height:auto">`,
    `      ${marks.join("\n      ")}`,
    `    </svg>`,
    `  </div>`,
    dataDetails(["item", norm.fromLabel, norm.toLabel], norm.data),
  ].join("\n");
  return chartCard(norm, body);
}

function sparklineFragment(norm) {
  const d = norm.data;
  const W = 120, H = 28, PAD = 2;
  const lo = Math.min(...d), hi = Math.max(...d);
  const xs = linearScale([0, d.length - 1], [0, W]);
  const ys = lo === hi ? () => H / 2 : linearScale([lo, hi], [H - PAD, PAD]);
  const points = d.map((v, i) => `${round(xs(i))},${round(ys(v))}`).join(" ");
  const last = d[d.length - 1];
  return [
    `<span data-component="sparkline" class="sparkline-row">`,
    specComment(norm),
    `  <svg class="sparkline" viewBox="0 0 ${W} ${H}" aria-hidden="true">`,
    `    <polyline class="sparkline-line" points="${points}" />`,
    `    <circle class="sparkline-dot" cx="${round(xs(d.length - 1))}" cy="${round(ys(last))}" r="2.5" />`,
    `  </svg>`,
    `  <span class="sparkline-value">${escapeText(norm.value)}</span>`,
    `</span>`,
  ].join("\n");
}

const PRESETS = { bar: barFragment, diverging: divergingFragment, slope: slopeFragment, sparkline: sparklineFragment };

// ---------- public API ----------

export function chart(type, spec) {
  const norm = normalizeSpec(type, spec);
  return PRESETS[type](norm);
}

/** Extract the normalized spec from a previously emitted fragment. */
export function parseSpec(fragmentHtml) {
  const m = fragmentHtml.match(/<!-- chart-spec (\{.*?\}) -->/s);
  if (!m) fail("no chart-spec comment found in fragment");
  return JSON.parse(m[1]);
}

// ---------- CLI ----------

const invokedDirectly = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());
if (invokedDirectly) {
  try {
    const args = process.argv.slice(2);
    const flag = (name) => {
      const i = args.indexOf(name);
      return i === -1 ? undefined : args[i + 1];
    };

    let type, spec;
    const fromFragment = flag("--from-fragment");
    if (fromFragment) {
      spec = parseSpec(readFileSync(fromFragment, "utf8"));
      type = spec.type;
    } else {
      type = args[0];
      const inline = flag("--spec");
      const file = flag("--in");
      const raw = inline ?? (file ? readFileSync(file, "utf8") : readFileSync(0, "utf8"));
      spec = JSON.parse(raw);
    }
    process.stdout.write(chart(type, spec) + "\n");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
