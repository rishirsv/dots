#!/usr/bin/env node
/**
 * Reject structural defects that should never survive into a self-contained
 * dots HTML artifact. Visual quality still requires rendered inspection.
 *
 * Usage: node scripts/check-artifact.mjs /absolute/or/relative/artifact.html
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function visibleText(markup) {
  return markup
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAccessibleName(tag, body = "") {
  return Boolean(
    attribute(tag, "aria-label")?.trim()
    || attribute(tag, "aria-labelledby")?.trim()
    || visibleText(body)
  );
}

export function checkArtifact(html) {
  const failures = [];
  const add = (code, message) => failures.push({ code, message });

  if (/\bwindow\.openai\b/.test(html)) {
    add("host-api", "host-only window.openai behavior must be replaced before standalone delivery");
  }
  if (/\bdata-embed-src\s*=/i.test(html)) {
    add("unembedded-asset", "assemble every data-embed-src asset into a data URI before delivery");
  }
  const resourceTags = /<(script|img|source|video|audio|iframe|embed|object|link|image|use)\b[^>]*>/gi;
  for (const match of html.matchAll(resourceTags)) {
    const tag = match[0];
    const name = match[1].toLowerCase();
    const resource = attribute(tag, name === "object" ? "data" : name === "link" || name === "image" || name === "use" ? "href" : "src")
      || attribute(tag, "poster");
    if (resource && !resource.trim().startsWith("data:") && !(name === "use" && resource.trim().startsWith("#"))) {
      add("external-request", "standalone artifacts must embed resource files and make no external requests");
    }
    if (/\bsrcset\s*=/i.test(tag)) {
      add("external-request", "standalone artifacts must use one embedded src instead of srcset resources");
    }
  }
  for (const match of html.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    const resource = match[2].trim();
    if (resource && !resource.startsWith("data:") && !resource.startsWith("#")) {
      add("external-request", "standalone CSS resources must be embedded as data URIs");
    }
  }
  if (/@import\b/i.test(html)
      || /\b(?:fetch|WebSocket|EventSource)\s*\(/.test(html)
      || /\bXMLHttpRequest\b/.test(html)) {
    add("external-request", "standalone artifacts must not load external resources or data");
  }
  if (/\btabindex\s*=/i.test(html)) {
    add("tab-order", "preserve native tab order; do not add tabindex");
  }

  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const tag = `<button${match[1]}>`;
    if (!hasAccessibleName(tag, match[2])) add("control-name", "every button needs visible text or an accessible name");
  }
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const tag = `<a${match[1]}>`;
    if (!hasAccessibleName(tag, match[2])) add("link-name", "every link needs visible text or an accessible name");
  }

  for (const match of html.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
    const tag = match[0];
    if (match[1].toLowerCase() === "input" && attribute(tag, "type")?.toLowerCase() === "hidden") continue;
    const id = attribute(tag, "id");
    const escapedId = id?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const hasLabel = hasAccessibleName(tag)
      || (escapedId && new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*(["'])${escapedId}\\1`, "i").test(html));
    if (!hasLabel) add("control-label", `every ${match[1].toLowerCase()} needs an explicit label or accessible name`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const alt = attribute(match[0], "alt");
    if (!alt?.trim()) add("image-alt", "meaningful images need concise non-empty alt text; omit decorative raster images");
  }
  for (const match of html.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi)) {
    const tag = `<svg${match[1]}>`;
    if (attribute(tag, "aria-hidden") === "true") continue;
    const named = attribute(tag, "role") === "img"
      && Boolean(attribute(tag, "aria-label")?.trim() || attribute(tag, "aria-labelledby")?.trim() || /<title\b[^>]*>\s*\S[\s\S]*?<\/title>/i.test(match[2]));
    if (!named) add("svg-name", "informative SVGs need role=img plus an accessible name; decorative SVGs need aria-hidden=true");
  }

  for (const match of html.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi)) {
    if (Number(match[1]) < 11) add("text-size", `text must not render below 11px (${match[1]}px found)`);
  }

  return failures;
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invokedDirectly) {
  const input = process.argv[2];
  if (!input) {
    console.error("check-artifact.mjs: provide an HTML file");
    process.exit(2);
  }
  let html;
  try { html = readFileSync(input, "utf8"); }
  catch { console.error(`check-artifact.mjs: cannot read "${input}"`); process.exit(2); }
  const failures = checkArtifact(html);
  if (failures.length) {
    for (const failure of failures) console.error(`${failure.code}: ${failure.message}`);
    process.exit(1);
  }
  process.stdout.write(`${input}: structural checks passed\n`);
}
