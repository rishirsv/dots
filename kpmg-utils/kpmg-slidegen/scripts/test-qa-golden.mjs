import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const REPO_ROOT = process.cwd();
const DECK_PATH = path.join(REPO_ROOT, 'decks', 'qa-golden-all-layouts.deckSpec.json');
const SCHEMA_PATH = path.join(REPO_ROOT, 'skills', 'kpmg-slides', 'references', 'deckspec.schema.json');
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

function ensureFixtureCoversAllSlots(deck, templatePackage) {
  const slides = Array.isArray(deck?.slides) ? deck.slides : [];
  const byType = new Map();
  for (const slide of slides) {
    const type = slide?.type;
    if (!type) continue;
    const group = byType.get(type) || [];
    group.push(slide);
    byType.set(type, group);
  }

  for (const [type, contract] of Object.entries(templatePackage?.layouts?.types || {})) {
    const typeSlides = byType.get(type) || [];
    assert.ok(typeSlides.length > 0, `Golden fixture must include at least one slide of type '${type}'.`);

    const seenKeys = new Set();
    for (const slide of typeSlides) {
      for (const key of Object.keys(slide || {})) {
        seenKeys.add(key);
      }
    }

    const expectedSlots = Object.keys(contract?.slots || {});
    const missingSlots = expectedSlots.filter((slot) => !seenKeys.has(slot));
    assert.deepEqual(
      missingSlots,
      [],
      `Golden fixture must include every slot for '${type}'. Missing: ${missingSlots.join(', ') || 'none'}`,
    );
  }
}

function collectBulletLists(slide) {
  const lists = [];
  if (Array.isArray(slide?.body)) lists.push(slide.body);
  if (Array.isArray(slide?.leftBody)) lists.push(slide.leftBody);
  if (Array.isArray(slide?.rightBody)) lists.push(slide.rightBody);
  if (Array.isArray(slide?.insights)) lists.push(slide.insights);
  if (Array.isArray(slide?.overviewBody)) lists.push(slide.overviewBody);

  for (const column of Array.isArray(slide?.columns) ? slide.columns : []) {
    if (Array.isArray(column?.body)) lists.push(column.body);
  }
  for (const column of Array.isArray(slide?.analysisColumns) ? slide.analysisColumns : []) {
    if (Array.isArray(column?.body)) lists.push(column.body);
  }

  return lists;
}

function markBulletItemCoverage(item, coverage) {
  if (typeof item === 'string') {
    coverage.stringItem = true;
    return;
  }
  if (!item || typeof item !== 'object') return;
  if (item.header === true) coverage.headerItem = true;
  if (item.subheader === true) coverage.subheaderItem = true;
  if (Array.isArray(item.children) && item.children.length > 0) {
    coverage.childrenItem = true;
    for (const child of item.children) {
      markBulletItemCoverage(child, coverage);
    }
  }
}

function ensureFixtureCoversBulletVariants(deck) {
  const coverage = {
    bulletStyle: false,
    paragraphStyle: false,
    stringItem: false,
    headerItem: false,
    subheaderItem: false,
    childrenItem: false,
  };

  for (const slide of deck?.slides || []) {
    if (slide?.bodyStyle === 'bullets') coverage.bulletStyle = true;
    if (slide?.bodyStyle === 'paragraphs') coverage.paragraphStyle = true;
    for (const list of collectBulletLists(slide)) {
      for (const item of list) {
        markBulletItemCoverage(item, coverage);
      }
    }
  }

  assert.equal(coverage.bulletStyle, true, 'Golden fixture must include bullet-style body rendering.');
  assert.equal(coverage.paragraphStyle, true, 'Golden fixture must include paragraph-style body rendering.');
  assert.equal(coverage.stringItem, true, 'Golden fixture must include plain string bullet items.');
  assert.equal(coverage.headerItem, true, 'Golden fixture must include bullet items with header=true.');
  assert.equal(coverage.subheaderItem, true, 'Golden fixture must include bullet items with subheader=true.');
  assert.equal(coverage.childrenItem, true, 'Golden fixture must include nested bullet children arrays.');
}

function ensureFixtureCoversAllChartTypes(deck, schema) {
  const expected = [...(schema?.$defs?.chart?.properties?.type?.enum || [])].sort();
  assert.ok(expected.length > 0, 'Chart type enum missing from schema.');

  const actual = [...new Set((deck?.slides || []).map((slide) => slide?.chart?.type).filter(Boolean))].sort();
  assert.deepEqual(
    actual,
    expected,
    `Golden fixture must include every chart type.\nExpected: ${expected.join(', ')}\nActual: ${actual.join(', ')}`,
  );
}

function collectText(node, out) {
  if (typeof node === 'string') {
    out.push(node);
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) collectText(item, out);
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    if (key === 'values') continue;
    collectText(value, out);
  }
}

function measureSlideTextChars(slide) {
  const chunks = [];
  collectText(slide, chunks);
  return chunks.join(' ').trim().length;
}

function ensureFixtureHasShortAndVerboseNarratives(deck) {
  const narrativeTypes = new Set([
    'oneColumnText',
    'twoColumnText',
    'analysisNarrowTable',
    'analysisWideChart2ColsText',
    'analysisWideChartTableText',
    'analysisBridge',
    'businessOverview',
    'titleStrapline4TextBoxes',
  ]);
  const narrativeSlides = (deck?.slides || []).filter((slide) => narrativeTypes.has(slide?.type));
  assert.ok(narrativeSlides.length > 0, 'Golden fixture must include narrative slide types.');

  const lengths = narrativeSlides.map(measureSlideTextChars);
  const hasShortNarrative = lengths.some((len) => len <= 800);
  const hasVerboseNarrative = lengths.some((len) => len >= 1500);
  assert.equal(hasShortNarrative, true, 'Golden fixture must include at least one short narrative slide.');
  assert.equal(hasVerboseNarrative, true, 'Golden fixture must include at least one verbose narrative slide.');
}

function assertPaginationDecision(qa, { slideType, mode, message }) {
  const decisions = Array.isArray(qa?.paginationDecisions) ? qa.paginationDecisions : [];
  assert.ok(
    decisions.some((entry) => entry?.slideType === slideType && entry?.mode === mode && Number(entry?.splitInto || 0) > 1),
    message,
  );
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const fixtureDeck = readJson(DECK_PATH);
const schema = readJson(SCHEMA_PATH);
ensureFixtureCoversAllLayouts(fixtureDeck, templatePackage);
ensureFixtureCoversAllSlots(fixtureDeck, templatePackage);
ensureFixtureCoversBulletVariants(fixtureDeck);
ensureFixtureCoversAllChartTypes(fixtureDeck, schema);
ensureFixtureHasShortAndVerboseNarratives(fixtureDeck);

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
assert.equal(
  qaActual.inputSlideCount,
  fixtureDeck.slides.length,
  `Golden fixture should contain ${fixtureDeck.slides.length} input slides.`,
);
assert.ok(qaActual.outputSlideCount > qaActual.inputSlideCount, 'Golden fixture should force continuation slides.');
assert.ok(
  qaActual.outputSlideCount >= qaActual.inputSlideCount + 8,
  'Golden fixture should create a substantial continuation expansion (at least +8 slides).',
);
assert.ok(Array.isArray(qaActual.paginationDecisions) && qaActual.paginationDecisions.length >= 6, 'Expected multiple pagination decisions.');
assertPaginationDecision(qaActual, {
  slideType: 'contents',
  mode: 'contents-sections',
  message: 'Expected contents pagination coverage.',
});
assertPaginationDecision(qaActual, {
  slideType: 'oneColumnText',
  mode: 'one-column-bullets',
  message: 'Expected one-column pagination coverage.',
});
assertPaginationDecision(qaActual, {
  slideType: 'twoColumnText',
  mode: 'two-column-bullets',
  message: 'Expected two-column pagination coverage.',
});
assertPaginationDecision(qaActual, {
  slideType: 'analysisNarrowTable',
  mode: 'table-rows',
  message: 'Expected narrow-table pagination coverage.',
});
assertPaginationDecision(qaActual, {
  slideType: 'analysisWideChartTableText',
  mode: 'text-with-chart',
  message: 'Expected analysis-wide chart/table pagination coverage.',
});
assertPaginationDecision(qaActual, {
  slideType: 'analysisBridge',
  mode: 'bridge-analysis-columns',
  message: 'Expected analysis bridge pagination coverage.',
});
assert.ok(
  qaActual.paginationDecisions.some((entry) => Number(entry?.splitInto || 0) >= 3),
  'Expected at least one multi-continuation pagination split (3+ slides).',
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
