#!/usr/bin/env node
/**
 * Package a real HTML body fragment with the dots page shell, theme, and the
 * CSS or behavior for explicitly selected registry components.
 *
 * The caller supplies the narrative, component choice, and markup. This script
 * removes repeated packaging work and keeps component CSS deduplicated.
 */

import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, isAbsolute, join, posix, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryRoot = join(root, "assets", "registry");
const registry = JSON.parse(readFileSync(join(registryRoot, "registry.json"), "utf8"));
const items = new Map(registry.items.map((item) => [item.name, item]));

const TEXT_ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeText = (value) => String(value).replace(/[&<>"']/g, (char) => TEXT_ESC[char]);
const IMAGE_MIME = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

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

function embedLocalImages(markup, assetRoot) {
  return markup.replace(/<img\b([^>]*?)\sdata-embed-src=(["'])([^"']+)\2([^>]*)>/gi, (tag, before, quote, source, after) => {
    if (!assetRoot) fail("data-embed-src requires assetRoot (the CLI uses the body file's directory)");
    if (/\ssrc\s*=/i.test(`${before} ${after}`)) fail("an image cannot have both src and data-embed-src");
    const mime = IMAGE_MIME.get(extname(source).toLowerCase());
    if (!mime) fail(`unsupported embedded image type for "${source}"`);
    const input = isAbsolute(source) ? source : resolve(assetRoot, source);
    let encoded;
    try { encoded = readFileSync(input).toString("base64"); }
    catch { fail(`cannot read embedded image "${source}"`); }
    return `<img${before} src="data:${mime};base64,${encoded}"${after}>`;
  });
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

function pageShell({ title, context, contextMarkup, dek, footer, body, layout }) {
  let shell = sourceFor("page-shell").match(/<div data-component="page-shell"[\s\S]*$/)?.[0];
  if (!shell) fail("page-shell markup is missing");

  const renderedContext = [
    contextMarkup,
    context ? `<p class="context-line${contextMarkup ? " sequence-page-context" : ""}">${escapeText(context)}</p>` : "",
  ].filter(Boolean).join("\n    ");

  shell = shell
    .replace('data-layout="article"', `data-layout="${layout}"`)
    .replace(/<p class="context-line">[\s\S]*?<\/p>/, renderedContext)
    .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${escapeText(title)}</h1>`)
    .replace(/<p class="dek">[\s\S]*?<\/p>/, dek ? `<p class="dek">${escapeText(dek)}</p>` : "")
    .replace(/\s*<!-- slot: toc-rail[^\n]*-->/, "")
    .replace(/\s*<!-- slot: sections[^\n]*-->/, `\n\n  ${body.trim().replace(/\n/g, "\n  ")}`)
    .replace(/\s*<footer class="sources">[\s\S]*?<\/footer>/, footer ? `\n\n  <footer class="sources">${escapeText(footer)}</footer>` : "");

  return shell;
}

export function assemble({ title, context = "", contextMarkup = "", dek = "", footer = "", body, components = [], lang = "en", assetRoot, layout = "article" }) {
  if (!title) fail("title is required");
  if (body == null) fail("body is required");
  if (!["article", "wide", "canvas"].includes(layout)) fail(`unknown layout "${layout}"`);

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
  const shell = pageShell({ title, context, contextMarkup, dek, footer, body: embedLocalImages(body, assetRoot), layout });

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

function localPath(rootPath, value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`${label} must be a non-empty relative path`);
  if (isAbsolute(value)) fail(`${label} must be relative`);
  const target = resolve(rootPath, value);
  const offset = relative(rootPath, target);
  if (offset === ".." || offset.startsWith(`..${sep}`) || isAbsolute(offset)) fail(`${label} must stay inside the manifest directory`);
  return target;
}

function outputPath(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`${label} must be a non-empty relative path`);
  if (value.includes("\\") || posix.isAbsolute(value)) fail(`${label} must be a portable relative path`);
  const normalized = posix.normalize(value);
  if (normalized === ".." || normalized.startsWith("../") || normalized === ".") fail(`${label} must stay inside the output directory`);
  if (!normalized.endsWith(".html")) fail(`${label} must end in .html`);
  if (!/^[a-z0-9][a-z0-9._/-]*\.html$/.test(normalized)) fail(`${label} must use lowercase portable filename characters`);
  return normalized;
}

function readManifestPage(page, index, manifestRoot) {
  const label = `pages[${index}]`;
  if (!page || typeof page !== "object" || Array.isArray(page)) fail(`${label} must be an object`);
  if (typeof page.id !== "string" || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(page.id)) fail(`${label}.id must use lowercase letters, digits, and internal hyphens`);
  if (typeof page.label !== "string" || !page.label.trim()) fail(`${label}.label is required`);
  if (typeof page.title !== "string" || !page.title.trim()) fail(`${label}.title is required`);
  if (page.parent != null && (typeof page.parent !== "string" || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(page.parent))) fail(`${label}.parent must be a page id`);
  if (page.number != null && (typeof page.number !== "string" || !page.number.trim())) fail(`${label}.number must be a non-empty string`);
  for (const field of ["time", "context", "dek", "footer"]) {
    if (page[field] != null && typeof page[field] !== "string") fail(`${label}.${field} must be a string`);
  }
  if (page.layout != null && !["article", "wide", "canvas"].includes(page.layout)) fail(`${label}.layout is not supported`);
  if (page.components != null && (!Array.isArray(page.components) || page.components.some((item) => typeof item !== "string" || !item))) fail(`${label}.components must be an array of component names`);
  const bodyPath = localPath(manifestRoot, page.body, `${label}.body`);
  if (!existsSync(bodyPath) || !lstatSync(bodyPath).isFile()) fail(`${label}.body does not resolve to a file`);
  return {
    ...page,
    label: page.label.trim(),
    title: page.title.trim(),
    parent: page.parent?.trim(),
    number: page.number?.trim(),
    output: outputPath(page.output, `${label}.output`),
    bodyPath,
  };
}

export function validateManifest(manifest, manifestRoot) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) fail("manifest must be an object");
  if (manifest.schemaVersion !== 1) fail("manifest.schemaVersion must be 1");
  if (typeof manifest.title !== "string" || !manifest.title.trim()) fail("manifest.title is required");
  if (manifest.lang != null && (typeof manifest.lang !== "string" || !manifest.lang.trim())) fail("manifest.lang must be a non-empty string");
  if (manifest.navigationLabel != null && typeof manifest.navigationLabel !== "string") fail("manifest.navigationLabel must be a string");
  if (!Array.isArray(manifest.pages) || manifest.pages.length === 0) fail("manifest.pages must contain at least one page");
  const pages = manifest.pages.map((page, index) => readManifestPage(page, index, manifestRoot));
  const ids = new Set();
  const outputs = new Set();
  for (const page of pages) {
    if (ids.has(page.id)) fail(`duplicate page id "${page.id}"`);
    if (outputs.has(page.output)) fail(`duplicate page output "${page.output}"`);
    ids.add(page.id);
    outputs.add(page.output);
  }
  const hierarchical = pages.some((page) => page.parent != null);
  if (hierarchical) {
    const roots = pages.filter((page) => page.parent == null);
    if (roots.length !== 1) fail("hierarchical manifests must contain exactly one root page");
    for (const page of pages) {
      if (page.parent != null && !ids.has(page.parent)) fail(`page "${page.id}" references missing parent "${page.parent}"`);
      if (page.parent === page.id) fail(`page "${page.id}" cannot be its own parent`);
    }
    const byId = new Map(pages.map((page) => [page.id, page]));
    for (const page of pages) {
      const visited = new Set([page.id]);
      let current = page.parent ? byId.get(page.parent) : null;
      while (current) {
        if (visited.has(current.id)) fail(`page hierarchy contains a cycle at "${current.id}"`);
        visited.add(current.id);
        current = current.parent ? byId.get(current.parent) : null;
      }
    }
  }
  return { ...manifest, title: manifest.title.trim(), lang: manifest.lang?.trim() || "en", pages };
}

function pageHref(from, to) {
  return posix.relative(posix.dirname(from), to) || posix.basename(to);
}

function flatSequenceMarkup(manifest, page, index) {
  const total = manifest.pages.length;
  const number = String(index + 1).padStart(2, "0");
  const totalText = String(total).padStart(2, "0");
  const previousIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11.75 4.75 6.5 10l5.25 5.25M7 10h7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const nextIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8.25 4.75 5.25 5.25-5.25 5.25M13 10H6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const links = manifest.pages.map((peer, peerIndex) => {
    const current = peerIndex === index ? ' aria-current="page"' : "";
    return `<a href="${escapeText(pageHref(page.output, peer.output))}"${current}><span class="sequence-index">${String(peerIndex + 1).padStart(2, "0")}</span>${escapeText(peer.label)}</a>`;
  }).join("\n        ");
  const previous = index > 0
    ? `<a href="${escapeText(pageHref(page.output, manifest.pages[index - 1].output))}" rel="prev" aria-label="Previous page" lang="en">${previousIcon}</a>`
    : `<span class="sequence-control-empty" aria-hidden="true">${previousIcon}</span>`;
  const next = index < total - 1
    ? `<a href="${escapeText(pageHref(page.output, manifest.pages[index + 1].output))}" rel="next" aria-label="Next page" lang="en">${nextIcon}</a>`
    : `<span class="sequence-control-empty" aria-hidden="true">${nextIcon}</span>`;
  const time = page.time ? `<span class="sequence-time">${escapeText(page.time)}</span>` : "";
  return {
    top: `<nav data-component="sequence-nav" class="sequence-nav" aria-label="${escapeText(manifest.navigationLabel || manifest.title)}">
  <div class="sequence-nav-inner">
    <div class="sequence-topline">
      <span>${escapeText(manifest.title)}</span>
      <span class="sequence-position" lang="en">Page ${number} of ${totalText}</span>
      ${time}
    </div>
    <div class="sequence-links">
      ${links}
    </div>
  </div>
  <div class="sequence-reading-progress" role="progressbar" aria-label="Page reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" lang="en">
    <span class="sequence-reading-progress-bar"></span>
  </div>
</nav>`,
    controls: `<nav class="sequence-controls" aria-label="Previous and next page" lang="en">
  ${previous}
  <span class="sequence-controls-position">${number} / ${totalText}</span>
  ${next}
</nav>`,
  };
}

function hierarchyFor(manifest) {
  const byId = new Map(manifest.pages.map((page) => [page.id, page]));
  const children = new Map(manifest.pages.map((page) => [page.id, []]));
  for (const page of manifest.pages) {
    if (page.parent) children.get(page.parent).push(page);
  }
  return { byId, children };
}

function ancestorsOf(page, byId) {
  const ancestors = [];
  let current = page.parent ? byId.get(page.parent) : null;
  while (current) {
    ancestors.unshift(current);
    current = current.parent ? byId.get(current.parent) : null;
  }
  return ancestors;
}

function hierarchyBreadcrumbs(page, hierarchy) {
  const ancestors = ancestorsOf(page, hierarchy.byId);
  if (!ancestors.length) return "";
  const siblings = hierarchy.children.get(page.parent) ?? [];
  const index = siblings.findIndex((peer) => peer.id === page.id);
  const links = ancestors.map((ancestor) => `<a href="${escapeText(pageHref(page.output, ancestor.output))}">${escapeText(ancestor.label)}</a>`).join('<span aria-hidden="true">›</span>');
  const position = siblings.length > 1 ? `<span class="sequence-breadcrumb-position" lang="en">${index + 1} of ${siblings.length}</span>` : "";
  return `<nav class="context-line sequence-breadcrumbs" aria-label="Breadcrumb"><span class="sequence-breadcrumb-links">${links}</span>${position}</nav>`;
}

function hierarchicalSequenceMarkup(manifest, page, hierarchy) {
  const siblings = page.parent ? hierarchy.children.get(page.parent) : hierarchy.children.get(page.id);
  const index = siblings.findIndex((peer) => peer.id === page.id);
  const total = siblings.length;
  const parent = page.parent ? hierarchy.byId.get(page.parent) : null;
  const context = parent
    ? `${parent.number ? `${parent.number} · ` : ""}${parent.label}`
    : manifest.title;
  const position = index >= 0 ? `${index + 1} of ${total}` : page.label;
  const links = siblings.map((peer, peerIndex) => {
    const current = peer.id === page.id ? ' aria-current="page"' : "";
    const number = peer.number ?? String(peerIndex + 1).padStart(2, "0");
    return `<a href="${escapeText(pageHref(page.output, peer.output))}"${current}><span class="sequence-index">${escapeText(number)}</span>${escapeText(peer.label)}</a>`;
  }).join("\n        ");
  const previousIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11.75 4.75 6.5 10l5.25 5.25M7 10h7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const nextIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8.25 4.75 5.25 5.25-5.25 5.25M13 10H6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const previous = index > 0
    ? `<a href="${escapeText(pageHref(page.output, siblings[index - 1].output))}" rel="prev" aria-label="Previous page" lang="en">${previousIcon}</a>`
    : `<span class="sequence-control-empty" aria-hidden="true">${previousIcon}</span>`;
  const next = index >= 0 && index < total - 1
    ? `<a href="${escapeText(pageHref(page.output, siblings[index + 1].output))}" rel="next" aria-label="Next page" lang="en">${nextIcon}</a>`
    : `<span class="sequence-control-empty" aria-hidden="true">${nextIcon}</span>`;
  const time = page.time ? `<span class="sequence-time">${escapeText(page.time)}</span>` : "";
  return {
    top: `<nav data-component="sequence-nav" class="sequence-nav is-hierarchical" aria-label="${escapeText(manifest.navigationLabel || manifest.title)}">
  <div class="sequence-nav-inner">
    <div class="sequence-topline">
      <span>${escapeText(context)}</span>
      <span class="sequence-position" lang="en">${escapeText(position)}</span>
      ${time}
    </div>
    <div class="sequence-links">
      ${links}
    </div>
  </div>
  <div class="sequence-reading-progress" role="progressbar" aria-label="Page reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" lang="en">
    <span class="sequence-reading-progress-bar"></span>
  </div>
</nav>`,
    controls: index >= 0 ? `<nav class="sequence-controls" aria-label="Previous and next page" lang="en">
  ${previous}
  <span class="sequence-controls-position">${index + 1} / ${total}</span>
  ${next}
</nav>` : "",
  };
}

function chapterIndexMarkup(page, hierarchy) {
  const children = hierarchy.children.get(page.id) ?? [];
  if (!children.length) return "";
  const grouped = children.some((child) => (hierarchy.children.get(child.id) ?? []).length);
  const kind = page.parent == null ? "Chapters" : "Lessons";
  const count = `${children.length} ${children.length === 1 ? kind.slice(0, -1).toLowerCase() : kind.toLowerCase()}`;
  const item = (child, from) => {
    const dek = child.dek ? `<small>${escapeText(child.dek)}</small>` : "";
    const peers = hierarchy.children.get(child.parent) ?? [];
    const number = child.number ?? String(peers.findIndex((peer) => peer.id === child.id) + 1);
    return `<a href="${escapeText(pageHref(from.output, child.output))}"><span class="chapter-index-number">${escapeText(number)}</span><span class="chapter-index-copy"><strong>${escapeText(child.label)}</strong>${dek}</span><span class="chapter-index-arrow" aria-hidden="true">↗</span></a>`;
  };
  const content = grouped
    ? children.map((child) => {
      const descendants = hierarchy.children.get(child.id) ?? [];
      return `<div class="chapter-index-group">${item(child, page)}${descendants.length ? `<ol>${descendants.map((descendant) => `<li>${item(descendant, page)}</li>`).join("")}</ol>` : ""}</div>`;
    }).join("")
    : `<ol>${children.map((child) => `<li>${item(child, page)}</li>`).join("")}</ol>`;
  return `<section id="curriculum" data-component="chapter-index" class="chapter-index">
  <div class="chapter-index-heading"><h2>${kind}</h2><span>${count}</span></div>
  ${content}
</section>`;
}

export function assembleSet({ manifest, manifestRoot }) {
  const validated = validateManifest(manifest, manifestRoot);
  const hierarchical = validated.pages.some((page) => page.parent != null);
  const hierarchy = hierarchical ? hierarchyFor(validated) : null;
  const rendered = new Map();
  validated.pages.forEach((page, index) => {
    const markup = hierarchical
      ? hierarchicalSequenceMarkup(validated, page, hierarchy)
      : flatSequenceMarkup(validated, page, index);
    const chapterIndex = hierarchical ? chapterIndexMarkup(page, hierarchy) : "";
    const html = assemble({
      title: page.title,
      context: page.context ?? (hierarchical && page.parent ? "" : `${validated.title} / ${page.label}`),
      contextMarkup: hierarchical ? hierarchyBreadcrumbs(page, hierarchy) : "",
      dek: page.dek ?? "",
      footer: page.footer ?? "",
      lang: validated.lang,
      layout: page.layout ?? "article",
      body: [readFileSync(page.bodyPath, "utf8"), chapterIndex].filter(Boolean).join("\n\n"),
      assetRoot: dirname(page.bodyPath),
      components: [...new Set([...(page.components ?? []), ...(chapterIndex ? ["chapter-index"] : []), "sequence-nav"])],
    });
    rendered.set(page.output, html
      .replace("<body>", `<body class="has-sequence-nav">\n${markup.top}`)
      .replace("</body>", `${markup.controls}\n</body>`));
  });
  return rendered;
}

export function writeSetAtomically(rendered, outDir) {
  const target = resolve(outDir);
  if (existsSync(target)) fail(`output directory already exists: ${target}`);
  const parent = dirname(target);
  mkdirSync(parent, { recursive: true });
  const staging = mkdtempSync(join(parent, `.${basename(target)}-staging-`));
  try {
    for (const [name, html] of rendered) {
      const output = resolve(staging, name);
      mkdirSync(dirname(output), { recursive: true });
      writeFileSync(output, html);
    }
    renameSync(staging, target);
  } catch (error) {
    rmSync(staging, { recursive: true, force: true });
    throw error;
  }
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
    if (Object.hasOwn(args, "status")) fail("--status is not supported; state material status in the page body");
    if (!args.out) fail("--out is required");
    if (args.manifest) {
      if (args.body) fail("use either --manifest or --body, not both");
      const manifestPath = resolve(args.manifest);
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      writeSetAtomically(assembleSet({ manifest, manifestRoot: dirname(manifestPath) }), args.out);
      process.exit(0);
    }
    if (!args.body) fail("--body is required");
    const html = assemble({
      title: args.title,
      context: args.context,
      dek: args.dek,
      footer: args.footer,
      lang: args.lang,
      layout: args.layout,
      body: readFileSync(args.body, "utf8"),
      assetRoot: dirname(resolve(args.body)),
      components: (args.components ?? "").split(",").map((name) => name.trim()).filter(Boolean),
    });
    writeFileSync(args.out, html);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
