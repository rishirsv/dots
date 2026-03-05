#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'acorn';

const STRICT = process.argv.includes('--strict');
const ROOT = process.cwd();
const TARGET_DIRS = ['generator/builders', 'generator/helpers', 'generator/runtime'];
const ALLOWED_FILES = new Set([
  'generator/runtime/theme.js',
]);
const STYLE_NUMBER_KEYS = new Set([
  'fontSize',
  'pt',
  'margin',
  'padding',
  'lineSpacing',
  'lineSpacingPt',
  'paraSpaceAfter',
  'paraSpaceAfterPt',
  'paraSpaceBefore',
  'paraSpaceBeforePt',
  'indentPt',
]);
const STYLE_COLOR_KEYS = new Set([
  'color',
  'fill',
  'bgColor',
  'borderColor',
  'separatorColor',
  'titleBarFill',
  'headerFill',
  'line',
]);
const DATA_CONTEXT_KEYS = new Set(['values', 'labels', 'data', 'rows', 'columns', 'chartColors']);
const HEX_COLOR_RE = /^[0-9A-Fa-f]{6}$/;

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(abs, out);
      continue;
    }
    if (entry.isFile() && abs.endsWith('.js')) out.push(abs);
  }
  return out;
}

function keyName(keyNode) {
  if (!keyNode) return '';
  if (keyNode.type === 'Identifier') return keyNode.name;
  if (keyNode.type === 'Literal') return String(keyNode.value || '');
  return '';
}

function isHexColor(value) {
  return typeof value === 'string' && HEX_COLOR_RE.test(value.trim());
}

function isObjectExpression(node) {
  return Boolean(node && node.type === 'ObjectExpression');
}

function isLiteral(node) {
  return Boolean(node && node.type === 'Literal');
}

function isLikelyDataPath(pathStack) {
  return pathStack.some((key) => DATA_CONTEXT_KEYS.has(key));
}

function collectFindings(source, relPath) {
  const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
  const findings = [];
  const maxFindings = STRICT ? 1 : Number.POSITIVE_INFINITY;

  function atLimit() {
    return findings.length >= maxFindings;
  }

  function pushFinding(node, message) {
    findings.push({
      file: relPath,
      line: node?.loc?.start?.line || 1,
      message,
    });
    return atLimit();
  }

  function visit(node, pathStack = []) {
    if (atLimit()) return;
    if (!node || typeof node !== 'object') return;

    if (node.type === 'ObjectExpression') {
      for (const property of node.properties || []) {
        visit(property, pathStack);
        if (atLimit()) return;
      }
      return;
    }
    if (node.type === 'ArrayExpression') {
      for (const element of node.elements || []) {
        visit(element, pathStack);
        if (atLimit()) return;
      }
      return;
    }
    if (node.type === 'Property') {
      const key = keyName(node.key);
      const nextPath = key ? [...pathStack, key] : pathStack;
      const value = node.value;
      const styleNumeric = STYLE_NUMBER_KEYS.has(key);
      const styleColor = STYLE_COLOR_KEYS.has(key) || key.toLowerCase().includes('color');
      const styleFontFace = key === 'fontFace';
      const skipForData = isLikelyDataPath(nextPath);

      if (!skipForData && styleNumeric && isLiteral(value) && typeof value.value === 'number') {
        if (pushFinding(value, `numeric style literal on "${key}"`)) return;
      }

      if (!skipForData && styleNumeric && value?.type === 'ArrayExpression') {
        const numericElements = (value.elements || []).filter((element) => isLiteral(element) && typeof element.value === 'number');
        if (numericElements.length > 0) {
          if (pushFinding(value, `numeric style array literal on "${key}"`)) return;
        }
      }

      if (!skipForData && styleColor && isLiteral(value) && isHexColor(value.value)) {
        if (pushFinding(value, `hex color literal on "${key}"`)) return;
      }

      if (!skipForData && styleColor && isObjectExpression(value)) {
        for (const child of value.properties || []) {
          if (child?.type !== 'Property') continue;
          const childKey = keyName(child.key);
          if (childKey !== 'color') continue;
          if (!isLiteral(child.value) || !isHexColor(child.value.value)) continue;
          if (pushFinding(child.value, `hex color literal on "${key}.color"`)) return;
        }
      }

      if (!skipForData && styleFontFace && isLiteral(value) && typeof value.value === 'string') {
        if (pushFinding(value, 'fontFace string literal')) return;
      }

      visit(value, nextPath);
      return;
    }

    for (const child of Object.values(node)) {
      if (atLimit()) return;
      if (!child) continue;
      if (Array.isArray(child)) {
        for (const entry of child) {
          visit(entry, pathStack);
          if (atLimit()) return;
        }
        continue;
      }
      if (typeof child === 'object' && child.type) visit(child, pathStack);
    }
  }

  visit(ast, []);
  return findings;
}

const files = TARGET_DIRS
  .flatMap((dir) => walkFiles(path.join(ROOT, dir)))
  .map((abs) => ({
    abs,
    rel: path.relative(ROOT, abs).replace(/\\/g, '/'),
  }))
  .filter((item) => !ALLOWED_FILES.has(item.rel));

let findings = [];
for (const file of files) {
  const source = fs.readFileSync(file.abs, 'utf8');
  findings = findings.concat(collectFindings(source, file.rel));
  if (STRICT && findings.length > 0) break;
}

if (findings.length === 0) {
  console.log('Theme drift guard: no style-literal drift findings.');
  process.exit(0);
}

const preview = findings.slice(0, 80);
console.log(`Theme drift guard findings: ${findings.length}`);
for (const finding of preview) {
  console.log(`${finding.file}:${finding.line} ${finding.message}`);
}
if (findings.length > preview.length) {
  console.log(`...and ${findings.length - preview.length} more`);
}

if (STRICT) process.exit(1);
