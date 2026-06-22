#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  extractCssBlocks,
  extractMarkedRegion,
  extractThemeCssFromHtml,
  listFiles,
  readText,
  readThemeCss,
  skillRoot,
  themePath,
} from "./theme-regions.mjs";

// Development-only guardrail for the html-artifact skill payload. This script
// runs from repo verification to keep theme.css, atlas examples, and docs from
// drifting; it is not bundled into generated reader artifacts.
const failures = [];

function fail(message) {
  failures.push(message);
}

function rel(filePath) {
  return path.relative(skillRoot, filePath);
}

function stripSvg(text) {
  return text.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");
}

function hexMatches(text) {
  return [...text.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)];
}

function declarationMap(block) {
  const map = new Map();
  for (const match of block.matchAll(/--([A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) {
    map.set(match[1], match[2].trim());
  }
  return map;
}

function mapsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (b.get(key) !== value) return false;
  }
  return true;
}

function luminance(hex) {
  const raw = hex.replace("#", "");
  const parts = raw.length === 3
    ? raw.split("").map((c) => c + c)
    : [raw.slice(0, 2), raw.slice(2, 4), raw.slice(4, 6)];
  const rgb = parts.map((part) => {
    const value = Number.parseInt(part, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function tokenBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  if (!match) {
    throw new Error(`Missing token block for ${selector}`);
  }
  return match[1];
}

function checkThemeCss(themeCss) {
  // Manual dark mode and OS dark mode must stay token-identical so users do not
  // see different palettes depending on how dark mode was activated.
  const mediaMatch = themeCss.match(/@media \(prefers-color-scheme: dark\) \{ :root:not\(\[data-theme="light"\]\) \{ ([^}]+) \} \}/);
  const manualMatch = themeCss.match(/:root\[data-theme="dark"\] \{ ([^}]+) \}/);
  if (!mediaMatch || !manualMatch) {
    fail("theme.css must contain both OS dark and manual dark token blocks.");
  } else if (!mapsEqual(declarationMap(mediaMatch[1]), declarationMap(manualMatch[1]))) {
    fail("theme.css dark media-query tokens differ from :root[data-theme=\"dark\"] tokens.");
  }

  const allowedHexSpans = [];
  const addRegexSpan = (regex) => {
    const match = themeCss.match(regex);
    if (match) allowedHexSpans.push([match.index, match.index + match[0].length]);
  };
  // Raw hex belongs only in canonical token declarations. Component rules must
  // consume variables so visual changes have one editable source.
  addRegexSpan(/:root\s*\{[^}]+\}/);
  addRegexSpan(/@media \(prefers-color-scheme: dark\) \{ :root:not\(\[data-theme="light"\]\) \{ [^}]+ \} \}/);
  addRegexSpan(/:root\[data-theme="dark"\] \{ [^}]+ \}/);
  for (const match of hexMatches(themeCss)) {
    const ok = allowedHexSpans.some(([start, end]) => match.index >= start && match.index < end);
    if (!ok) fail(`theme.css has raw hex outside token declarations: ${match[0]}`);
  }

  if (!/\[data-primitive="code-panel"\]\[data-variant="dark"\] \[data-slot="code"\] \{ background: var\(--code-surface\); \}/.test(themeCss)) {
    fail("theme.css dark code-panel background must use --code-surface.");
  }
  if (!/\[data-slot="hunk"\] \{ background: var\(--code-surface\);/.test(themeCss)) {
    fail("theme.css diff hunk background must use --code-surface.");
  }
  if (/background(?:-color)?:\s*var\(--text/.test(themeCss)) {
    fail("theme.css keys a background off a text variable.");
  }
  if (!/@media print \{ \[data-primitive="theme-toggle"\] \{ display: none; \} \}/.test(themeCss)) {
    fail("theme.css must hide theme-toggle in print.");
  }

  const rootMap = declarationMap(tokenBlock(themeCss, ":root"));
  const darkMap = manualMatch ? declarationMap(manualMatch[1]) : new Map();
  // The contrast list is intentionally focused on tokens that are most likely
  // to regress during polish: page text plus status foreground/background pairs
  // in both themes.
  const pairs = [
    ["light text/bg", rootMap.get("text"), rootMap.get("bg")],
    ["light body/bg", rootMap.get("text-body"), rootMap.get("bg")],
    ["light danger status", rootMap.get("danger-strong"), rootMap.get("danger-soft")],
    ["light success status", rootMap.get("success-strong"), rootMap.get("success-soft")],
    ["light warning status", rootMap.get("warning-strong"), rootMap.get("warning-soft")],
    ["light info status", rootMap.get("info-strong"), rootMap.get("info-soft")],
    ["light pending status", rootMap.get("pending-strong"), rootMap.get("pending-soft")],
    ["dark text/bg", darkMap.get("text"), darkMap.get("bg")],
    ["dark body/bg", darkMap.get("text-body"), darkMap.get("bg")],
    ["dark danger status", darkMap.get("danger-strong"), darkMap.get("danger-soft")],
    ["dark success status", darkMap.get("success-strong"), darkMap.get("success-soft")],
    ["dark warning status", darkMap.get("warning-strong"), darkMap.get("warning-soft")],
    ["dark info status", darkMap.get("info-strong"), darkMap.get("info-soft")],
    ["dark pending status", darkMap.get("pending-strong"), darkMap.get("pending-soft")],
  ];
  for (const [name, fg, bg] of pairs) {
    if (!fg || !bg || !/^#[0-9A-Fa-f]{6}$/.test(fg) || !/^#[0-9A-Fa-f]{6}$/.test(bg)) {
      fail(`Cannot check contrast for ${name}; missing 6-digit color token.`);
      continue;
    }
    if (contrast(fg, bg) < 4.5) {
      fail(`${name} contrast is below AA: ${contrast(fg, bg).toFixed(2)}`);
    }
  }
}

function checkHtmlFile(filePath, themeCss) {
  const html = readText(filePath);
  const file = rel(filePath);
  let embeddedTheme;
  try {
    embeddedTheme = extractThemeCssFromHtml(html);
  } catch (error) {
    fail(`${file}: ${error.message}`);
    return;
  }
  if (embeddedTheme.trimEnd() !== themeCss.trimEnd()) {
    fail(`${file}: embedded theme.css region differs from assets/theme.css.`);
  }

  // The atlas is standalone HTML, so it must carry one real toggle example, but
  // generated artifacts should not grow multiple competing theme controls.
  const themeToggleButtons = [...html.matchAll(/<button\b[^>]*data-primitive="theme-toggle"[^>]*>/g)];
  if (themeToggleButtons.length !== 1) {
    fail(`${file}: expected exactly one theme-toggle button, found ${themeToggleButtons.length}.`);
  }

  const withoutTheme = html.replace(
    /\/\* html-artifact:theme\.css:start \*\/[\s\S]*?\/\* html-artifact:theme\.css:end \*\//,
    "",
  );
  const cssBlocks = extractCssBlocks(withoutTheme).join("\n");
  if (/:root\s*\{/.test(cssBlocks)) {
    fail(`${file}: local CSS must not redefine :root tokens.`);
  }
  // Local atlas chrome can frame specimens, but primitive styling remains owned
  // by theme.css. The shell schematic is the one documented exception because
  // it labels regions of the artifact shell rather than restyling a primitive.
  for (const match of cssBlocks.matchAll(/\[data-primitive=(?:"([^"]+)"|'([^']+)'|([^\]\s]+))/g)) {
    const primitive = match[1] || match[2] || match[3];
    if (!(file === "assets/primitive-atlas.html" && primitive === "artifact-shell")) {
      fail(`${file}: local CSS targets canonical primitive ${primitive}.`);
    }
  }

  const rawSurface = stripSvg(withoutTheme);
  for (const match of hexMatches(rawSurface)) {
    fail(`${file}: raw hex outside theme block or inline SVG demo art: ${match[0]}`);
  }
}

function checkMarkdownAndYaml() {
  // Shipped docs should explain the contract without becoming a second token
  // source. Hex values and stale DESIGN.md references are therefore failures.
  for (const filePath of listFiles(skillRoot, (file) => /\.(md|ya?ml)$/.test(file))) {
    const file = rel(filePath);
    const text = readText(filePath);
    if (/DESIGN\.md|references\/DESIGN/.test(text)) {
      fail(`${file}: stale DESIGN.md reference.`);
    }
    for (const match of hexMatches(text)) {
      fail(`${file}: raw hex value in shipped docs: ${match[0]}`);
    }
  }
}

function main() {
  const themeCss = readThemeCss();
  if (!fs.existsSync(themePath)) {
    fail("Missing assets/theme.css.");
  }
  checkThemeCss(themeCss);
  for (const htmlFile of listFiles(path.join(skillRoot, "assets"), (file) => file.endsWith(".html"))) {
    checkHtmlFile(htmlFile, themeCss);
  }
  checkMarkdownAndYaml();

  if (failures.length) {
    console.error("html-artifact validation failed:");
    for (const message of failures) console.error(`- ${message}`);
    process.exit(1);
  }
  console.log("html-artifact validation passed");
}

main();
