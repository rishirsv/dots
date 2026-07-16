#!/usr/bin/env node
/**
 * generate-theme.mjs — compile DESIGN.md front-matter into assets/theme.css.
 *
 * Usage:   node scripts/generate-theme.mjs [--check]
 * Inputs:  references/DESIGN.md (YAML front-matter; restricted subset —
 *          nested maps, scalars, and flat arrays only; no anchors or
 *          multi-line strings).
 * Output:  assets/theme.css (tokens + alpha ladder + base styles + motion).
 *          --check exits 1 if the committed theme.css is stale.
 *
 * DESIGN.md is canonical; never edit theme.css by hand. The x-dark,
 * x-alpha-steps, and x-motion keys are generator-owned extensions beyond the
 * design.md alpha spec.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const designPath = join(root, "references", "DESIGN.md");
const outPath = join(root, "assets", "theme.css");

// ---------- minimal YAML subset parser (indentation maps + inline arrays) ----------

function parseYaml(text) {
  const lines = text.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  const rootObj = {};
  const stack = [{ indent: -1, obj: rootObj }];
  for (const line of lines) {
    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();
    const colon = trimmed.indexOf(":");
    if (colon === -1) throw new Error(`Unparseable line: ${line}`);
    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (value === "") {
      const child = {};
      parent[key] = child;
      stack.push({ indent, obj: child });
    } else if (value.startsWith("[")) {
      parent[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => (isNaN(Number(v)) ? stripQuotes(v) : Number(v)));
    } else {
      parent[key] = stripQuotes(value);
    }
  }
  return rootObj;
}

function stripQuotes(v) {
  return v.replace(/^["']|["']$/g, "");
}

function frontMatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error("DESIGN.md has no front-matter block");
  return parseYaml(m[1]);
}

// ---------- alpha ladder ----------

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function alphaLadder(foreground, steps) {
  const [r, g, b] = hexToRgb(foreground);
  return steps
    .map((s) => `  --a${s}: rgba(${r}, ${g}, ${b}, ${(s / 100).toFixed(2)});`)
    .join("\n");
}

function colorVars(colors) {
  return Object.entries(colors)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
}

// ---------- emit ----------

const design = frontMatter(readFileSync(designPath, "utf8"));
const { colors, typography, spacing, rounded } = design;
const dark = design["x-dark"];
const steps = design["x-alpha-steps"];
const motion = design["x-motion"];
const chart = design["x-chart"];
const t = (role, prop) => typography[role][prop];

// x-chart values are var() references into base tokens, so one :root block
// suffices — they follow the dark override of whatever they point at.
const chartVars = Object.entries(chart)
  .map(([k, v]) => `  --chart-${k}: ${v};`)
  .join("\n");

const css = `/* GENERATED from DESIGN.md by scripts/generate-theme.mjs — do not edit.
 * Tokens + base document styles for dots HTML artifacts. Inline this file
 * verbatim inside <style> in every artifact. */

:root {
${colorVars(colors)}
${alphaLadder(colors.foreground, steps)}
  --font-sans: ${t("body", "fontFamily")};
  --font-mono: ${t("mono", "fontFamily")};
  --article: ${spacing.article};
  --section: ${spacing.section};
  --block: ${spacing.block};
  --r-card: ${rounded.card};
  --r-code: ${rounded.code};
  --r-inline: ${rounded.inline};
  --r-pill: ${rounded.pill};
  --dur-fast: ${motion["duration-fast"]};
  --dur-reveal: ${motion["duration-reveal"]};
  --ease: ${motion["ease"]};
  --stagger: ${motion["stagger-step"]};
${chartVars}
}

[data-theme="dark"] {
${colorVars(dark)}
${alphaLadder(dark.foreground, steps)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
${colorVars(dark).replace(/^ {2}/gm, "    ")}
${alphaLadder(dark.foreground, steps).replace(/^ {2}/gm, "    ")}
  }
}

/* ---------- base ---------- */

* { box-sizing: border-box; }

html, body { margin: 0; padding: 0; overflow-x: clip; }

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-size: ${t("body", "fontSize")};
  line-height: ${t("body", "lineHeight")};
  -webkit-font-smoothing: antialiased;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--r-inline);
}

::selection { background: var(--a12); }

h1 {
  font-size: ${t("h1", "fontSize")};
  line-height: ${t("h1", "lineHeight")};
  letter-spacing: ${t("h1", "letterSpacing")};
  font-weight: ${t("h1", "fontWeight")};
  margin: 0;
  text-wrap: balance;
}

h2 {
  font-size: ${t("h2", "fontSize")};
  line-height: ${t("h2", "lineHeight")};
  letter-spacing: ${t("h2", "letterSpacing")};
  font-weight: ${t("h2", "fontWeight")};
  margin: 0 0 16px;
  text-wrap: balance;
}

h3 {
  font-size: ${t("h3", "fontSize")};
  line-height: ${t("h3", "lineHeight")};
  letter-spacing: ${t("h3", "letterSpacing")};
  font-weight: ${t("h3", "fontWeight")};
  margin: 0 0 12px;
}

p { margin: 0 0 var(--block); }
p:last-child { margin-bottom: 0; }

section { margin-bottom: var(--section); }

code {
  font-family: var(--font-mono);
  font-size: ${t("mono", "fontSize")};
  background: var(--a4);
  border-radius: var(--r-inline);
  padding: 1px 5px;
}

pre code { background: none; padding: 0; }

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border-top: 1px solid var(--a20);
}

th, td {
  text-align: left;
  padding: 12px 4px;
  border-bottom: 1px solid var(--a12);
  vertical-align: top;
}

thead th {
  font-size: 12px;
  letter-spacing: 0.02em;
  color: var(--a55);
  font-weight: 500;
}

tbody tr:last-child td { border-bottom: 1px solid var(--a20); }

.num { font-variant-numeric: tabular-nums; }

/* ---------- motion: choreographed moments only ---------- */
/* One-time load stagger + one-time scroll reveals. Elements render complete
 * and static by default; page-behavior opts them in only when JS
 * runs and reduced-motion is off. Nothing loops; nothing is ambient. */

@media (prefers-reduced-motion: no-preference) {
  html.js-motion .stagger > * {
    opacity: 0;
    transform: translateY(6px);
    animation: rise var(--dur-reveal) var(--ease) forwards;
  }
  html.js-motion .stagger > *:nth-child(1) { animation-delay: 0ms; }
  html.js-motion .stagger > *:nth-child(2) { animation-delay: var(--stagger); }
  html.js-motion .stagger > *:nth-child(3) { animation-delay: calc(var(--stagger) * 2); }
  html.js-motion .stagger > *:nth-child(4) { animation-delay: calc(var(--stagger) * 3); }
  html.js-motion .stagger > *:nth-child(5) { animation-delay: calc(var(--stagger) * 4); }

  html.js-motion .reveal {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity var(--dur-reveal) var(--ease), transform var(--dur-reveal) var(--ease);
  }
  html.js-motion .reveal.is-in { opacity: 1; transform: none; }

  html.js-motion .reveal .bar-fill {
    transform: scaleX(0);
    transform-origin: left;
    transition: transform calc(var(--dur-reveal) * 1.5) var(--ease) 120ms;
  }
  html.js-motion .reveal.is-in .bar-fill { transform: scaleX(1); }

  a, summary, button { transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease); }
}

@keyframes rise {
  to { opacity: 1; transform: none; }
}
`;

const args = process.argv.slice(2);
if (args.includes("--check")) {
  const current = readFileSync(outPath, "utf8");
  if (current !== css) {
    console.error("theme.css is stale — run: node scripts/generate-theme.mjs");
    process.exit(1);
  }
  console.log("theme.css is up to date with DESIGN.md");
} else {
  writeFileSync(outPath, css);
  console.log(`Wrote ${outPath} (${css.length} bytes)`);
}
