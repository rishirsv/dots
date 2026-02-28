import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const REPO_ROOT = process.cwd();
const DECK_PATH = path.join(REPO_ROOT, 'decks', 'qa-golden-all-layouts.deckSpec.json');
const GOLDEN_PATH = path.join(REPO_ROOT, 'outputs', 'qa-golden-fixture', 'golden-all-layouts.qa.json');
const UPDATE_GOLDEN = process.env.UPDATE_GOLDEN === '1';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function scrubString(value, replacements = []) {
  let out = String(value ?? '');
  for (const { from, to } of replacements) {
    if (!from) continue;
    out = out.split(from).join(to);
  }
  return out;
}

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = sortKeysDeep(value[key]);
  }
  return out;
}

function normalizeQa(qa, { outputPptxPath } = {}) {
  const clone = JSON.parse(JSON.stringify(qa || {}));
  delete clone.generatedAt;
  delete clone.postprocess;

  if (clone.outputPptx) {
    clone.outputPptx = '<OUTPUT_PPTX>';
  }

  const replacements = [
    { from: REPO_ROOT, to: '<REPO_ROOT>' },
    { from: outputPptxPath || '', to: '<OUTPUT_PPTX>' },
  ];

  function walk(node) {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') {
      return typeof node === 'string' ? scrubString(node, replacements) : node;
    }
    for (const key of Object.keys(node)) {
      node[key] = walk(node[key]);
    }
    return node;
  }

  return sortKeysDeep(walk(clone));
}

function ensureFixtureCoversAllLayouts(deck, templatePackage) {
  const expected = Object.keys(templatePackage?.layouts?.types || {}).sort();
  const actual = [...new Set((deck?.slides || []).map((slide) => slide?.type).filter(Boolean))].sort();
  assert.deepEqual(
    actual,
    expected,
    `Golden fixture must include every layout exactly once set-wise.\nExpected: ${expected.join(', ')}\nActual: ${actual.join(', ')}`,
  );
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const fixtureDeck = readJson(DECK_PATH);
ensureFixtureCoversAllLayouts(fixtureDeck, templatePackage);

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-golden-'));
const outPath = path.join(tmpDir, 'deck.pptx');
const qaPath = path.join(tmpDir, 'qa.json');

await generateToFile(fixtureDeck, outPath, {
  templatePackage,
  qaPath,
  allowSparse: true,
  enforceOverlap: true,
  strict: false,
});

const qaActual = normalizeQa(readJson(qaPath), { outputPptxPath: outPath });

assert.equal(qaActual.valid, true, 'Golden fixture should render successfully.');
assert.equal(qaActual.inputSlideCount, 12, 'Golden fixture should contain 12 input slides.');
assert.ok(qaActual.outputSlideCount > qaActual.inputSlideCount, 'Golden fixture should force continuation slides.');
assert.ok(Array.isArray(qaActual.paginationDecisions) && qaActual.paginationDecisions.length >= 4, 'Expected multiple pagination decisions.');
assert.ok(
  qaActual.paginationDecisions.some((d) => d.slideType === 'twoColumnText' && d.mode === 'two-column-bullets'),
  'Expected two-column pagination coverage.',
);
assert.ok(
  qaActual.paginationDecisions.some((d) => d.slideType === 'analysisNarrowTable' && d.mode === 'table-rows'),
  'Expected narrow-table pagination coverage.',
);

if (UPDATE_GOLDEN) {
  fs.mkdirSync(path.dirname(GOLDEN_PATH), { recursive: true });
  fs.writeFileSync(GOLDEN_PATH, `${JSON.stringify(qaActual, null, 2)}\n`);
  console.log(`Updated golden QA fixture: ${GOLDEN_PATH}`);
  process.exit(0);
}

if (!fs.existsSync(GOLDEN_PATH)) {
  throw new Error(`Missing golden fixture: ${GOLDEN_PATH}. Run with UPDATE_GOLDEN=1 to create it.`);
}

const qaExpected = sortKeysDeep(readJson(GOLDEN_PATH));
assert.deepEqual(
  qaActual,
  qaExpected,
  'Golden QA mismatch. If intentional, run: UPDATE_GOLDEN=1 npm run test:qa:golden',
);

console.log('Golden QA fixture test passed.');
