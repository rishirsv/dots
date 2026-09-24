#!/usr/bin/env node
/**
 * Build a page module into one self-contained HTML page.
 *
 * A page module has no imports. It exports `kit`, optional `inputs` (name →
 * path relative to the module), and a default function that receives the
 * kit's helpers and the loaded inputs and returns the kit's PageSpec.
 *
 * Usage: node scripts/build.mjs <page.mjs> --out <page.html>
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assemble, checkPage, localPath } from "./assemble.mjs";
import * as report from "./kits/report.mjs";

const KITS = { report };

function fail(message) {
  throw new Error(`build.mjs: ${message}`);
}

const NUMBER = /^-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/;

/** RFC 4180 CSV: quoted fields, escaped quotes, and newlines inside quotes. */
export function parseCsv(text) {
  const records = [];
  let record = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field === "") quoted = true;
    else if (char === ",") { record.push(field); field = ""; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      record.push(field); records.push(record); record = []; field = "";
    } else field += char;
  }
  if (quoted) fail("CSV has an unterminated quoted field");
  if (field !== "" || record.length) { record.push(field); records.push(record); }
  const rows = records.filter((row) => row.some((value) => value !== ""));
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  return body.map((row, rowIndex) => {
    if (row.length !== header.length) fail(`CSV row ${rowIndex + 2} has ${row.length} fields; the header has ${header.length}`);
    return Object.fromEntries(header.map((name, column) => {
      const value = row[column];
      return [name, NUMBER.test(value.trim()) ? Number(value) : value];
    }));
  });
}

function loadInput(moduleDir, name, value) {
  const path = localPath(moduleDir, value, `inputs.${name}`, "page module");
  let text;
  try { text = readFileSync(path, "utf8"); }
  catch { fail(`cannot read inputs.${name} ("${value}")`); }
  const extension = extname(path).toLowerCase();
  if (extension === ".json") {
    try { return JSON.parse(text); }
    catch (error) { fail(`inputs.${name} is not valid JSON: ${error.message}`); }
  }
  if (extension === ".csv") return parseCsv(text);
  if (extension === ".txt") return text;
  return fail(`inputs.${name} must be .json, .csv, or .txt`);
}

const SOURCE_TYPE = "application/vnd.dots-source+json";
const SIDECAR = ".dots-source.json";

function major(version) { return String(version).split(".")[0]; }

export async function build(modulePath, { embedSource = false } = {}) {
  const file = resolve(modulePath);
  const moduleDir = dirname(file);
  const sidecar = join(moduleDir, SIDECAR);
  const expected = existsSync(sidecar) ? JSON.parse(readFileSync(sidecar, "utf8")).kitVersion : null;
  if (expected && !Object.values(KITS).some((kit) => major(expected) === major(kit.version)))
    fail(`page source uses kit ${expected}; installed kit major version differs. Rebuild with the matching major version.`);
  // A fresh URL per build so edits to the module are never served from the ESM cache.
  const url = `${pathToFileURL(file).href}?build=${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const mod = await import(url);

  const kit = KITS[mod.kit];
  if (!kit) fail(`page module must export kit = ${Object.keys(KITS).map((name) => `"${name}"`).join(" | ")}`);
  if (expected) {
    if (major(expected) !== major(kit.version)) fail(`page source uses ${mod.kit} kit ${expected}; installed kit is ${kit.version}. Rebuild with the matching major version.`);
  }
  if (typeof mod.default !== "function") fail("page module must export a default function (helpers, data) => page(...)");
  const inputs = mod.inputs ?? {};
  if (typeof inputs !== "object" || Array.isArray(inputs)) fail("inputs must be an object of name → relative path");

  const data = Object.fromEntries(Object.entries(inputs).map(([name, value]) => [name, loadInput(moduleDir, name, value)]));
  kit.resetFigureIds?.();
  const spec = await mod.default(kit.helpers, data);
  if (!spec || spec.kit !== mod.kit || !spec.body) fail(`the default export must return the ${mod.kit} kit's page(...)`);
  const violations = checkPage(spec.body.__html);
  if (violations.length) fail(violations.join("; "));

  let result = assemble({
    title: spec.title,
    context: spec.context,
    dek: spec.dek,
    footer: spec.footer,
    layout: spec.layout,
    toc: spec.toc,
    sources: spec.sources,
    components: spec.components,
    body: spec.body.__html,
    assetRoot: moduleDir,
  });
  if (embedSource) {
    const files = Object.fromEntries(Object.entries(inputs).map(([name, value]) => {
      const path = localPath(moduleDir, value, `inputs.${name}`, "page module");
      return [value, readFileSync(path, "utf8")];
    }));
    const payload = { kitVersion: kit.version, module: { name: basename(file), source: readFileSync(file, "utf8") }, inputs: files };
    const json = JSON.stringify(payload).replace(/</g, "\\u003c");
    result = result.replace("</body>", `<script type="${SOURCE_TYPE}">${json}</script>\n</body>`);
  }
  return result;
}

export function extract(pagePath, targetDir) {
  const page = readFileSync(resolve(pagePath), "utf8");
  const match = page.match(/<script type="application\/vnd\.dots-source\+json">([\s\S]*?)<\/script>/);
  if (!match) fail("page has no embedded source");
  let payload;
  try { payload = JSON.parse(match[1]); }
  catch { fail("embedded source is invalid JSON"); }
  if (!payload?.module?.name || typeof payload.module.source !== "string" || !payload.kitVersion || !payload.inputs || typeof payload.inputs !== "object" || Array.isArray(payload.inputs)) fail("embedded source is incomplete");
  const target = resolve(targetDir);
  if (existsSync(target)) fail(`refusing to overwrite ${target}`);
  const files = [[payload.module.name, payload.module.source], ...Object.entries(payload.inputs)];
  const destinations = new Set([join(target, SIDECAR)]);
  for (const [name, content] of files) {
    const path = localPath(target, name, `embedded file ${name}`, "extract");
    if (destinations.has(path)) fail(`duplicate embedded file ${name}`);
    destinations.add(path);
    if (typeof content !== "string") fail(`embedded file ${name} is not text`);
  }
  mkdirSync(target, { recursive: true });
  for (const [name, content] of files) {
    const path = localPath(target, name, `embedded file ${name}`, "extract");
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  writeFileSync(join(target, SIDECAR), JSON.stringify({ kitVersion: payload.kitVersion }) + "\n");
  console.warn("build.mjs: extracted modules are untrusted code; inspect them before rebuilding");
  return join(target, payload.module.name);
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (invokedDirectly) {
  const args = process.argv.slice(2);
  const outIndex = args.indexOf("--out");
  const out = outIndex === -1 ? undefined : args[outIndex + 1];
  try {
    if (args[0] === "--extract") {
      if (args.length !== 4 || args[2] !== "--to") fail("usage: node scripts/build.mjs --extract <page.html> --to <dir>");
      extract(args[1], args[3]);
    } else {
      const embedSource = args.includes("--embed-source");
      const modulePath = args[0];
      const valid = args.every((value, index) => index === 0 || index === outIndex || index === outIndex + 1 || value === "--embed-source");
      if (!modulePath || !out || outIndex < 1 || args.length !== (embedSource ? 4 : 3) || !valid) fail("usage: node scripts/build.mjs <page.mjs> --out <page.html> [--embed-source]");
      writeFileSync(out, await build(modulePath, { embedSource }));
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
