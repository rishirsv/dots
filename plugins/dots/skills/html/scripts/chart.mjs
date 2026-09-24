#!/usr/bin/env node
/**
 * chart.mjs — compile a chart spec into a catalog-conformant fragment.
 *
 * Authoring-time only: run it while building an artifact, paste the output,
 * never ship the script. Colors come exclusively from --chart-* tokens
 * (see references/DESIGN.md x-chart); markup matches the registry anatomy so
 * output is indistinguishable from hand-authored catalog work and
 * machine-editable.
 *
 * CLI:  node scripts/chart.mjs <bar|sparkline> --in spec.json
 *       cat spec.json | node scripts/chart.mjs bar
 *       node scripts/chart.mjs bar --spec '{"title":"…","data":[["a",1]]}'
 *       node scripts/chart.mjs --from-fragment chart.html   (re-render from
 *       the embedded chart-spec comment — the edit loop)
 * API:  import { chart, parseSpec } from "./chart.mjs"
 *
 * Every fragment embeds its normalized spec as `<!-- chart-spec {...} -->`.
 * To edit a chart: change the embedded spec, then re-render the fragment file
 * in place with `--from-fragment`.
 * Spec strings must not contain "--" (HTML comments forbid it).
 *
 * CSS dependencies (paste the registry fragment's CSS once per page):
 *   bar → bar-chart.html · sparkline → sparkline.html
 */

import { readFileSync, writeFileSync } from "node:fs";
import { escapeHtml } from "./lib/html.mjs";

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

const TYPES = ["bar", "sparkline", "line", "stacked"];

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

  if (type === "stacked") {
    if (!Array.isArray(spec.series) || spec.series.length < 2 || spec.series.some((name) => typeof name !== "string" || !name || name.includes("--"))) fail("stacked spec.series needs two or more names");
    const rows = toRows(spec.data, ["label", ...spec.series]);
    if (rows.some((row) => spec.series.some((name) => row[name] < 0))) fail("stacked values must be non-negative");
    return { ...norm, series: spec.series.slice(), data: rows.map((row) => [row.label, ...spec.series.map((name) => row[name])]) };
  }

  const keys = ["label", "value"];
  let rows = toRows(spec.data, keys);
  if (type === "bar" && rows.some((row) => row.value < 0)) fail("bar chart values must be non-negative");

  const sort = spec.sort ?? (type === "bar" ? "desc" : "none");
  if (!["desc", "asc", "none"].includes(sort)) fail('spec.sort must be "desc", "asc", or "none"');
  if (sort !== "none") rows = rows.slice().sort((a, b) => (sort === "desc" ? b.value - a.value : a.value - b.value));

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
  return out;
}

// ---------- shared emit helpers ----------

const specComment = (norm) => `<!-- chart-spec ${JSON.stringify(norm)} -->`;

function chartCard(norm, body) {
  return [
    `<div data-component="${norm.type}-chart" class="chart-card reveal">`,
    specComment(norm),
    `  <div class="chart-title">${escapeHtml(norm.title)}</div>`,
    body,
    `</div>`,
  ].join("\n");
}

function lineFragment(norm) {
  const values = norm.data.map(([, value]) => value);
  const lo = Math.min(...values), hi = Math.max(...values);
  const x = (i) => 44 + i * (560 / Math.max(1, values.length - 1));
  const y = (value) => hi === lo ? 110 : 190 - (value - lo) / (hi - lo) * 150;
  const points = values.map((value, i) => `${round(x(i))},${round(y(value))}`).join(' ');
  const labels = norm.data.map(([label], i) => `<text x="${round(x(i))}" y="230" text-anchor="middle">${escapeHtml(label)}</text>`).join('');
  const body = `  <div class="chart-scroll"><svg viewBox="0 0 640 250" style="min-width:640px" aria-hidden="true"><polyline class="line-series" points="${points}"/>${values.map((value, i) => `<circle class="line-point" cx="${round(x(i))}" cy="${round(y(value))}" r="4"/>`).join('')}${labels}</svg></div>`;
  return chartCard(norm, body);
}

function stackedFragment(norm) {
  const totals = norm.data.map(([, ...values]) => values.reduce((sum, value) => sum + value, 0));
  const max = Math.max(...totals);
  if (max <= 0) fail('stacked chart needs at least one positive total');
  const body = norm.data.map(([label, ...values], row) => `  <div class="stacked-row"><span>${escapeHtml(label)}</span><div class="stacked-track">${values.map((value, index) => `<span class="stacked-segment series-${index % 4}" style="width:${round(value / max * 100)}%" title="${escapeHtml(norm.series[index])}: ${value}"></span>`).join('')}</div><span>${totals[row]}</span></div>`).join('\n');
  const legend = `<div class="stacked-legend">${norm.series.map((name, index) => `<span><i class="series-${index % 4}"></i>${escapeHtml(name)}</span>`).join('')}</div>`;
  return chartCard(norm, body + '\n' + legend);
}

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
        `    <div class="bar-name">${escapeHtml(r.label)}</div>`,
        `    <div class="bar-track"><div class="bar-fill${emph ? " emphasis" : ""}" style="width:${pct}%"></div></div>`,
        `    <div class="bar-value"${emph ? ' style="color:var(--chart-value-emphasis);font-weight:600"' : ""}>${escapeHtml(r.value)}</div>`,
        `  </div>`,
      ].join("\n");
    })
    .join("\n");
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
    `  <span class="sparkline-value">${escapeHtml(norm.value)}</span>`,
    `</span>`,
  ].join("\n");
}

const PRESETS = { bar: barFragment, sparkline: sparklineFragment, line: lineFragment, stacked: stackedFragment };

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

/** Replace chart roots in a fragment or complete page without touching other markup. */
export function regenerateCharts(html) {
  const roots = /<(div|span)\b[^>]*\bdata-component="(?:bar-chart|sparkline|line-chart|stacked-chart)"[^>]*>\s*<!-- chart-spec (\{.*?\}) -->/gs;
  const edits = [];
  for (const match of html.matchAll(roots)) {
    const tag = match[1];
    const spec = JSON.parse(match[2]);
    const tags = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    tags.lastIndex = match.index;
    let depth = 0;
    let end;
    for (const token of html.matchAll(tags)) {
      if (token.index < match.index) continue;
      depth += token[0].startsWith("</") ? -1 : 1;
      if (depth === 0) { end = token.index + token[0].length; break; }
    }
    if (end == null) fail(`unclosed ${tag} chart component`);
    edits.push({ start: match.index, end, replacement: chart(spec.type, spec) });
  }
  if (!edits.length) fail("no chart-spec chart component found in fragment");
  for (let i = edits.length - 1; i >= 0; i -= 1) {
    const { start, end, replacement } = edits[i];
    html = html.slice(0, start) + replacement + html.slice(end);
  }
  return html;
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
      writeFileSync(fromFragment, regenerateCharts(readFileSync(fromFragment, "utf8")));
      process.exit(0);
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
