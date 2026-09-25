#!/usr/bin/env node
/** Discover report helpers and keep human galleries synchronized with examples. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { meta, resetFigureIds, ruleDescriptions } from './kits/report.mjs';
import { diagramCount, diagramFigures, diagramStyles, helperExample } from './diagram-examples.mjs';
import { replaceLiteral } from './lib/html.mjs';

const skillRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(skillRoot, 'assets');
const templates = join(skillRoot, 'scripts', 'templates');
const registry = JSON.parse(readFileSync(join(assets, 'registry', 'registry.json'), 'utf8'));
const preferred = { 'finding-list': 'findings', 'flow-diagram': 'flow' };

function slot(source, marker, content) {
  if (!source.includes(marker)) throw new Error(`gallery template has no ${marker} slot`);
  return replaceLiteral(source, marker, content);
}

function fragment(item) {
  const source = readFileSync(join(assets, 'registry', item.file), 'utf8');
  return source.slice(source.lastIndexOf('</style>') + 8).trim().replace(/\s+href=(["'])([^"']+)\1/g, (attribute, _quote, target) => {
    if (target.startsWith('#') || /^[a-z]+:/i.test(target) || existsSync(resolve(assets, target))) return attribute;
    // A component fragment can show a linked-page shape without shipping its sample pages.
    return ' aria-disabled="true"';
  });
}

export function renderAtlas(source) {
  const diagramSection = `<section id="diagram-vocabulary"><h2>Diagram templates</h2><p class="reading-column">Choose among ${diagramCount} relationship-specific forms before drawing. Open the dedicated <a href="./diagrams.html">diagram atlas</a> when this vocabulary is the main work surface.</p>\n${diagramFigures({ atlas: true })}\n</section>`;
  resetFigureIds(1000);
  const groups = new Map();
  for (const [name, entry] of Object.entries(meta)) {
    if (entry.component === 'page-shell') continue;
    const list = groups.get(entry.component) ?? [];
    list.push(name);
    groups.set(entry.component, list);
  }
  const sections = registry.items.filter((item) => !['page-shell', 'page-behavior'].includes(item.name)).map((item) => {
    const names = groups.get(item.name);
    const name = preferred[item.name] ?? names?.[0];
    const markup = name ? helperExample(name) : fragment(item);
    return `<section id="${item.name}"><h2>${item.title}</h2><p class="reading-column">${item.when}</p>\n${markup}\n</section>`;
  });
  source = slot(source, '__CATALOG_SECTIONS__', [diagramSection, ...sections].join('\n'));
  source = slot(source, '__ATLAS_FRAME_CSS__', readFileSync(join(assets, 'registry', 'atlas-frame.css'), 'utf8'));
  const componentStyles = registry.items.map((item) => readFileSync(join(assets, 'registry', item.file), 'utf8').match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').join('\n');
  source = slot(source, '__COMPONENT_STYLES__', `<style>${componentStyles}</style>`);
  return slot(source, '__DIAGRAM_STYLES__', diagramStyles({ components: false }));
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
  let source = slot(template, '__DOTS_THEME_CSS__', theme);
  if (name === 'atlas') return renderAtlas(source);
  source = slot(source, '__DIAGRAM_FIGURES__', diagramFigures());
  source = slot(source, '__DIAGRAM_STYLES__', diagramStyles());
  return slot(source, '__DIAGRAM_COUNT__', String(diagramCount));
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
      console.log(`${args[1]} — ${entry.summary}\nSignature: ${entry.params}\nRules: ${ruleDescriptions(args[1])}\nExample: ${entry.example}`);
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
