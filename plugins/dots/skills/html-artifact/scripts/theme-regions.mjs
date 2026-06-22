import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Development-only helpers for skill validation. These functions are used by
// validate.mjs and repo verification; they are not inlined into generated HTML
// artifacts or executed in the reader's browser.
const __filename = fileURLToPath(import.meta.url);
export const skillRoot = path.resolve(path.dirname(__filename), "..");
export const themePath = path.join(skillRoot, "assets/theme.css");

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function readThemeCss() {
  return readText(themePath);
}

export function extractMarkedRegion(text, name, { includeMarkers = true } = {}) {
  // Markers are part of the contract so parity checks can compare shipped CSS
  // byte-for-byte, including the comments future agents rely on.
  const start = `/* html-artifact:${name}:start */`;
  const end = `/* html-artifact:${name}:end */`;
  const startIndex = text.indexOf(start);
  if (startIndex === -1) {
    throw new Error(`Missing start marker: ${start}`);
  }
  const contentStart = startIndex + start.length;
  const endIndex = text.indexOf(end, contentStart);
  if (endIndex === -1) {
    throw new Error(`Missing end marker: ${end}`);
  }
  if (includeMarkers) {
    return text.slice(startIndex, endIndex + end.length);
  }
  return text.slice(contentStart, endIndex);
}

export function extractCssBlocks(html) {
  return [...html.matchAll(/<style(?:\s[^>]*)?>\n?([\s\S]*?)\n?<\/style>/g)].map(
    (match) => match[1],
  );
}

export function extractThemeCssFromHtml(html) {
  return extractMarkedRegion(html, "theme.css");
}

export function listFiles(dir, predicate) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(full, predicate));
    } else if (!predicate || predicate(full)) {
      out.push(full);
    }
  }
  return out;
}
