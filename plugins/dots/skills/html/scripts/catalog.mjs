#!/usr/bin/env node
/** Discover report helpers and keep human galleries synchronized with examples. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { helpers, meta, resetFigureIds } from './kits/report.mjs';
import { renderDiagramGallery } from './diagram-examples.mjs';

const skillRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(skillRoot, 'assets');
const templates = join(skillRoot, 'scripts', 'templates');
const registry = JSON.parse(readFileSync(join(assets, 'registry', 'registry.json'), 'utf8'));
const preferred = { callout: 'callout', 'finding-list': 'findings', 'flow-diagram': 'flow' };

function example(name) {
  const names = Object.keys(helpers);
  const result = new Function(...names, `return (${meta[name].example});`)(...names.map((key) => helpers[key]));
  return Array.isArray(result) ? result.map(String).join('') : String(result.body ?? result);
}

export function renderAtlas(source) {
  source = renderDiagramGallery(source, { atlas: true });
  resetFigureIds(1000);
  const groups = new Map();
  for (const [name, entry] of Object.entries(meta)) {
    if (entry.component === 'page-shell') continue;
    const list = groups.get(entry.component) ?? [];
    list.push(name);
    groups.set(entry.component, list);
  }
  for (const item of registry.items) {
    const names = groups.get(item.name);
    if (!names?.length) continue;
    const name = preferred[item.name] ?? names[0];
    const id = item.name;
    let start = source.indexOf(`<section id="${id}">`);
    if (start < 0 && ['line-chart', 'stacked-chart'].includes(id)) {
      const next = source.indexOf('<section id="sparkline">');
      if (next < 0) throw new Error('atlas sparkline section is missing');
      source = source.slice(0, next) + `<section id="${id}"><h2>${item.title}</h2><p class="reading-column">${item.when}</p></section>\n  ` + source.slice(next);
      start = source.indexOf(`<section id="${id}">`);
    }
    if (start < 0) throw new Error(`atlas section ${id} is missing`);
    const end = source.indexOf('</section>', start) + '</section>'.length;
    if (end < '</section>'.length) throw new Error(`atlas section ${id} is not closed`);
    const section = source.slice(start, end);
    const introEnd = section.indexOf('</p>') + '</p>'.length;
    if (introEnd < '</p>'.length) throw new Error(`atlas section ${id} needs its intro`);
    const head = section.slice(0, introEnd);
    source = source.slice(0, start) + `${head}\n    <!-- GENERATED from report meta by catalog.mjs: ${name} -->\n    ${example(name)}\n  </section>` + source.slice(end);
  }
  return source;
}

function htmlFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}

export function themeCopies({ assetsDir = assets, howDir = join(skillRoot, '..', 'how', 'assets') } = {}) {
  const theme = readFileSync(join(assetsDir, 'theme.css'), 'utf8').trim();
  const roots = [assetsDir, howDir];
  return roots.flatMap(htmlFiles).filter((file) => readFileSync(file, 'utf8').includes('GENERATED from DESIGN.md')).filter((file) => !readFileSync(file, 'utf8').includes(theme));
}

export function writeGalleries() {
  const diagramFile = join(assets, 'diagrams.html');
  const atlasFile = join(assets, 'atlas.html');
  writeFileSync(diagramFile, freshGallery('diagrams'));
  writeFileSync(atlasFile, freshGallery('atlas'));
}

function freshGallery(name, assetsDir = assets) {
  const theme = readFileSync(join(assetsDir, 'theme.css'), 'utf8').trim();
  const template = readFileSync(join(templates, `${name}.template`), 'utf8');
  if (!template.includes('__DOTS_THEME_CSS__')) throw new Error(`${name} template has no theme slot`);
  const source = template.replace('__DOTS_THEME_CSS__', theme);
  return name === 'atlas' ? renderAtlas(source) : renderDiagramGallery(source);
}

export function checkGalleries({ assetsDir = assets, howDir = join(skillRoot, '..', 'how', 'assets') } = {}) {
  const diagramFile = join(assetsDir, 'diagrams.html');
  const atlasFile = join(assetsDir, 'atlas.html');
  const stale = [];
  if (readFileSync(diagramFile, 'utf8') !== freshGallery('diagrams', assetsDir)) stale.push(diagramFile);
  if (readFileSync(atlasFile, 'utf8') !== freshGallery('atlas', assetsDir)) stale.push(atlasFile);
  stale.push(...themeCopies({ assetsDir, howDir }));
  return stale;
}

const directly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (directly) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === '--list') {
      for (const [name, entry] of Object.entries(meta)) console.log(`${name}: ${entry.params}`);
    } else if (args.length === 2 && args[0] === '--help') {
      const entry = meta[args[1]];
      if (!entry) throw new Error(`unknown helper ${args[1]}`);
      console.log(`${args[1]} — ${entry.summary}\nSignature: ${entry.params}\nRules: ${entry.rules ?? 'Pass required fields; strings are escaped, SafeHtml is preserved.'}\nExample: ${entry.example}`);
    } else if (args.length === 1 && args[0] === '--write') {
      writeGalleries();
    } else if (args.length === 1 && args[0] === '--check') {
      const stale = checkGalleries();
      if (stale.length) throw new Error(`stale gallery or theme copy:\n${stale.join('\n')}`);
      console.log('catalog.mjs: galleries and theme copies are current');
    } else throw new Error('usage: catalog.mjs --list | --help <helper> | --write | --check');
  } catch (error) {
    console.error(`catalog.mjs: ${error.message}`);
    process.exitCode = 1;
  }
}
