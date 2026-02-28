import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { getImageDimensions } from '../generator/helpers/media.js';
import { createSlidesAdapter } from '../generator/postprocess/slides-adapter.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

function parseOutDir(argv = process.argv.slice(2)) {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--out-dir' && argv[i + 1]) return path.resolve(argv[i + 1]);
    if (argv[i].startsWith('--out-dir=')) return path.resolve(argv[i].slice('--out-dir='.length));
  }
  if (process.env.VISUAL_OUT_DIR) return path.resolve(process.env.VISUAL_OUT_DIR);
  return fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-callouts-dense-visual-'));
}

function listSlidePngs(previewDir) {
  const names = fs
    .readdirSync(previewDir)
    .filter((name) => /^slide-\d+\.png$/i.test(name))
    .sort((a, b) => {
      const ai = Number(a.match(/\d+/)?.[0] || 0);
      const bi = Number(b.match(/\d+/)?.[0] || 0);
      return ai - bi;
    });
  return names.map((name) => path.join(previewDir, name));
}

function assertImageValid(imagePath) {
  assert.equal(fs.existsSync(imagePath), true, `Expected image to exist: ${imagePath}`);
  const stat = fs.statSync(imagePath);
  assert.ok(stat.size > 0, `Expected image size > 0: ${imagePath}`);
  const { width, height } = getImageDimensions(imagePath);
  assert.ok(width > 0, `Expected width > 0: ${imagePath}`);
  assert.ok(height > 0, `Expected height > 0: ${imagePath}`);
}

function readDeck(deckName) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'decks', deckName), 'utf8'));
}

const PAIRS = [
  {
    id: 'one-column',
    baselineDeck: 'regression-callouts-dense-one-column-no-callouts.deckSpec.json',
    calloutDeck: 'regression-callouts-dense-one-column-with-callouts.deckSpec.json',
  },
  {
    id: 'analysis-wide-2col',
    baselineDeck: 'regression-callouts-dense-analysis-wide-2col-no-callouts.deckSpec.json',
    calloutDeck: 'regression-callouts-dense-analysis-wide-2col-with-callouts.deckSpec.json',
  },
  {
    id: 'analysis-wide-table',
    baselineDeck: 'regression-callouts-dense-analysis-wide-table-no-callouts.deckSpec.json',
    calloutDeck: 'regression-callouts-dense-analysis-wide-table-with-callouts.deckSpec.json',
  },
];

const adapter = createSlidesAdapter();
const availability = adapter.detectAvailability();
if (!availability.available) {
  throw new Error(
    `Dense callout visual regressions require an available slides runtime. Reason: ${availability.reason || 'unknown'}`,
  );
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const outRoot = parseOutDir();
fs.mkdirSync(outRoot, { recursive: true });

async function runVariant({ pairId, variantId, deckName }) {
  const runDir = path.join(outRoot, pairId, variantId);
  const outPath = path.resolve(runDir, 'deck.pptx');
  const qaPath = path.resolve(runDir, 'qa.json');
  const previewDir = path.resolve(runDir, 'preview');
  fs.mkdirSync(runDir, { recursive: true });

  const deckSpec = readDeck(deckName);
  await generateToFile(deckSpec, outPath, {
    templatePackage,
    qaPath,
    strict: false,
    allowSparse: true,
    enforceOverlap: true,
    postprocess: {
      withPreview: true,
      withMontage: false,
      withVisualOverflow: true,
      previewWidth: 1600,
      previewHeight: 900,
      previewOutputDir: previewDir,
      visualOverflowPadPx: 100,
    },
    postprocessAdapter: adapter,
  });

  const qa = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
  assert.equal(qa?.valid, true, `${pairId}/${variantId}: expected qa.valid=true`);
  assert.equal(
    qa?.postprocess?.preview?.status,
    'ok',
    `${pairId}/${variantId}: expected preview status ok`,
  );
  assert.equal(
    qa?.postprocess?.overflowVisual?.status,
    'pass',
    `${pairId}/${variantId}: expected overflow visual pass`,
  );
  assert.equal(
    Number(qa?.overlapSummary?.severeCount || 0),
    0,
    `${pairId}/${variantId}: expected no severe overlap findings`,
  );

  const slides = listSlidePngs(previewDir);
  assert.ok(slides.length > 0, `${pairId}/${variantId}: expected at least one preview image`);
  assert.equal(
    slides.length,
    Number(qa?.outputSlideCount || 0),
    `${pairId}/${variantId}: preview PNG count should match outputSlideCount`,
  );
  for (const imagePath of slides) assertImageValid(imagePath);

  return {
    outPath,
    qaPath,
    previewDir,
    outputSlideCount: Number(qa?.outputSlideCount || 0),
    paginationDecisions: Array.isArray(qa?.paginationDecisions) ? qa.paginationDecisions.length : 0,
  };
}

const summary = [];
for (const pair of PAIRS) {
  const baseline = await runVariant({
    pairId: pair.id,
    variantId: 'baseline',
    deckName: pair.baselineDeck,
  });
  const withCallouts = await runVariant({
    pairId: pair.id,
    variantId: 'with-callouts',
    deckName: pair.calloutDeck,
  });
  summary.push({
    pairId: pair.id,
    baseline,
    withCallouts,
  });
}

console.log('Dense callout visual regressions passed (automated checks).');
console.log(`Output root: ${outRoot}`);
console.log('Manual visual signoff checklist:');
console.log('1. Compare baseline vs with-callouts previews for clipping, overlaps, and visual hierarchy drift.');
console.log('2. Confirm callouts appear only on the first continuation page when splits occur.');
console.log('3. Confirm chart/table regions remain visually stable on analysis-wide-table cases.');
console.log('4. Confirm readability is not degraded versus baseline in the commentary region.');
for (const item of summary) {
  console.log(
    `- ${item.pairId}: baseline(slides=${item.baseline.outputSlideCount}, decisions=${item.baseline.paginationDecisions}, preview=${item.baseline.previewDir}) | with-callouts(slides=${item.withCallouts.outputSlideCount}, decisions=${item.withCallouts.paginationDecisions}, preview=${item.withCallouts.previewDir})`,
  );
}

