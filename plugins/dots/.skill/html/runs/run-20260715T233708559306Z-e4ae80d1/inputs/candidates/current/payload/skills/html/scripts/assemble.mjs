#!/usr/bin/env node
/**
 * Package a real HTML body fragment with the dots page shell, theme, and the
 * CSS or behavior for explicitly selected registry components.
 *
 * The caller owns narrative, component choice, and markup. This script only
 * removes repeated packaging work and keeps component CSS deduplicated.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryRoot = join(root, "assets", "registry");
const registry = JSON.parse(readFileSync(join(registryRoot, "registry.json"), "utf8"));
const items = new Map(registry.items.map((item) => [item.name, item]));

const TEXT_ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeText = (value) => String(value).replace(/[&<>"']/g, (char) => TEXT_ESC[char]);

function fail(message) {
  throw new Error(`assemble.mjs: ${message}`);
}

function sourceFor(name) {
  const item = items.get(name);
  if (!item) fail(`unknown component "${name}"`);
  return readFileSync(join(registryRoot, item.file), "utf8");
}

function extractAll(source, tag) {
  const pattern = new RegExp(`^<${tag}(?:\\s[^>]*)?>\\n?([\\s\\S]*?)^<\\/${tag}>`, "gim");
  return [...source.matchAll(pattern)].map((match) => match[1].trim()).filter(Boolean);
}

function orderedComponents(requested) {
  const ordered = [];
  const seen = new Set(["page-shell"]);

  function visit(name) {
    if (seen.has(name)) return;
    const item = items.get(name);
    if (!item) fail(`unknown component "${name}"`);
    seen.add(name);
    for (const dependency of item.deps ?? []) visit(dependency);
    ordered.push(name);
  }

  for (const name of requested) visit(name);
  return ordered;
}

function pageShell({ title, context, dek, status, footer, body }) {
  let shell = sourceFor("page-shell").match(/<div data-component="page-shell"[\s\S]*$/)?.[0];
  if (!shell) fail("page-shell markup is missing");

  shell = shell
    .replace(/<p class="context-line">[\s\S]*?<\/p>/, context ? `<p class="context-line">${escapeText(context)}</p>` : "")
    .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${escapeText(title)}</h1>`)
    .replace(/<span class="status">[\s\S]*?<\/span>/, status ? `<span class="status">${escapeText(status)}</span>` : "")
    .replace(/<p class="dek">[\s\S]*?<\/p>/, dek ? `<p class="dek">${escapeText(dek)}</p>` : "")
    .replace(/\s*<!-- slot: toc-rail[^\n]*-->/, "")
    .replace(/\s*<!-- slot: sections[^\n]*-->/, `\n\n  ${body.trim().replace(/\n/g, "\n  ")}`)
    .replace(/\s*<footer class="sources">[\s\S]*?<\/footer>/, footer ? `\n\n  <footer class="sources">${escapeText(footer)}</footer>` : "");

  return shell;
}

export function assemble({ title, context = "", dek = "", status = "", footer = "", body, components = [], lang = "en" }) {
  if (!title) fail("title is required");
  if (body == null) fail("body is required");

  const selected = orderedComponents([...new Set(components.filter(Boolean))]);
  const componentSources = selected.map((name) => sourceFor(name));
  const css = [
    readFileSync(join(root, "assets", "theme.css"), "utf8").trim(),
    ...extractAll(sourceFor("page-shell"), "style"),
    ...componentSources.flatMap((source) => extractAll(source, "style")),
  ].join("\n\n");
  const scripts = componentSources
    .flatMap((source) => [...source.matchAll(/^<script(?:\s[^>]*)?>[\s\S]*?^<\/script>/gim)].map((match) => match[0].trim()))
    .join("\n\n");
  const shell = pageShell({ title, context, dek, status, footer, body });

  return `<!doctype html>
<html lang="${escapeText(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeText(title)}</title>
<style>
${css}
</style>
</head>
<body>
${shell}
${scripts ? `\n${scripts}\n` : ""}</body>
</html>
`;
}

function parseArgs(args) {
  const values = {};
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    if (!key.startsWith("--")) fail(`unexpected argument "${key}"`);
    const value = args[i + 1];
    if (value == null || value.startsWith("--")) fail(`${key} needs a value`);
    values[key.slice(2)] = value;
    i += 1;
  }
  return values;
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invokedDirectly) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.body) fail("--body is required");
    if (!args.out) fail("--out is required");
    const html = assemble({
      title: args.title,
      context: args.context,
      dek: args.dek,
      status: args.status,
      footer: args.footer,
      lang: args.lang,
      body: readFileSync(args.body, "utf8"),
      components: (args.components ?? "").split(",").map((name) => name.trim()).filter(Boolean),
    });
    writeFileSync(args.out, html);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
