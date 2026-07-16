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

const TYPES = ["bar", "sparkline"];

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

  const keys = ["label", "value"];
  let rows = toRows(spec.data, keys);

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
    `<div data-component="${norm.type === "bar" ? "bar-chart" : norm.type + "-chart"}" class="chart-card reveal">`,
    specComment(norm),
    `  <div class="chart-title">${escapeText(norm.title)}</div>`,
    body,
    `</div>`,
  ].join("\n");
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
        `    <div class="bar-name">${escapeText(r.label)}</div>`,
        `    <div class="bar-track"><div class="bar-fill${emph ? " emphasis" : ""}" style="width:${pct}%"></div></div>`,
        `    <div class="bar-value"${emph ? ' style="color:var(--chart-value-emphasis);font-weight:600"' : ""}>${escapeText(r.value)}</div>`,
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
    `  <span class="sparkline-value">${escapeText(norm.value)}</span>`,
    `</span>`,
  ].join("\n");
}

const PRESETS = { bar: barFragment, sparkline: sparklineFragment };

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
      writeFileSync(fromFragment, chart(type, spec) + "\n");
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
