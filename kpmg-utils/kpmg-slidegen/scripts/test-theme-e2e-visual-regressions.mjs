import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { getImageDimensions } from '../generator/helpers/media.js';
import { createSlidesAdapter } from '../generator/postprocess/slides-adapter.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const FIXTURE_PATH = path.join(process.cwd(), 'decks', 'regression-theme-e2e-all-types.deckSpec.json');
const BASELINE_PATH = path.join(process.cwd(), 'testing', 'visual-baselines', 'theme-e2e.hashes.json');

function parseArgs(argv = process.argv.slice(2)) {
  const args = { updateBaseline: false, outDir: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--update-baseline') {
      args.updateBaseline = true;
      continue;
    }
    if (token === '--out-dir' && argv[i + 1]) {
      args.outDir = path.resolve(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token.startsWith('--out-dir=')) {
      args.outDir = path.resolve(token.slice('--out-dir='.length));
    }
  }
  if (!args.outDir) args.outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-theme-e2e-visual-'));
  return args;
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

function inspectImage(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  assert.ok(buffer.length > 0, `Expected image size > 0: ${imagePath}`);
  const { width, height } = getImageDimensions(buffer);
  assert.ok(width > 0, `Expected width > 0: ${imagePath}`);
  assert.ok(height > 0, `Expected height > 0: ${imagePath}`);
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return {
    width,
    height,
    hash: hash.digest('hex'),
  };
}

function readBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return {};
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
}

function writeBaseline(data) {
  fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(data, null, 2)}\n`);
}

const args = parseArgs();
const adapter = createSlidesAdapter();
const availability = adapter.detectAvailability();
if (!availability.available) {
  throw new Error(
    `Theme e2e visual regressions require an available slides runtime. Reason: ${availability.reason || 'unknown'}`,
  );
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const deckSpec = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
const expectedSlideTypes = (deckSpec.slides || []).map((slide) => String(slide?.type || 'unknown'));
const outPath = path.join(args.outDir, 'deck.pptx');
const qaPath = path.join(args.outDir, 'qa.json');
const previewDir = path.join(args.outDir, 'preview');
fs.mkdirSync(args.outDir, { recursive: true });

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
assert.equal(qa?.valid, true, 'Expected QA report to be valid');
assert.equal(qa?.postprocess?.preview?.status, 'ok', 'expected preview status ok');
assert.equal(qa?.postprocess?.overflowVisual?.status, 'pass', 'expected overflow status pass');

const splitEvents = (qa?.paginationDecisions || []).filter((item) => Number(item?.splitInto || 0) > 1);
assert.equal(splitEvents.length, 0, `expected no pagination splits, got ${splitEvents.length}`);

const outputSlideCount = Number(qa?.outputSlideCount || 0);
assert.equal(
  outputSlideCount,
  expectedSlideTypes.length,
  `expected ${expectedSlideTypes.length} slides, got ${outputSlideCount}`,
);

const slides = listSlidePngs(previewDir);
assert.equal(slides.length, outputSlideCount, `expected ${outputSlideCount} preview PNGs, got ${slides.length}`);

const baseline = readBaseline();
const observedHashes = {};
for (let index = 0; index < slides.length; index += 1) {
  const imagePath = slides[index];
  const image = inspectImage(imagePath);
  const type = expectedSlideTypes[index] || 'unknown';
  const key = `${type}.slide-${index + 1}`;
  const hash = image.hash;
  observedHashes[key] = hash;
  if (!args.updateBaseline) {
    const expectedHash = baseline[key];
    assert.ok(expectedHash, `missing baseline hash for '${key}'. Run with --update-baseline once.`);
    assert.equal(
      hash,
      expectedHash,
      `baseline mismatch for ${key}.\nexpected=${expectedHash}\nactual=${hash}\nimage=${imagePath}`,
    );
  }
}

if (args.updateBaseline) {
  const nextBaseline = { ...baseline, ...observedHashes };
  writeBaseline(nextBaseline);
}

console.log('Theme e2e visual regressions passed.');
console.log(`Temp output: ${args.outDir}`);
for (let index = 0; index < slides.length; index += 1) {
  const type = expectedSlideTypes[index] || 'unknown';
  const key = `${type}.slide-${index + 1}`;
  console.log(`- ${key}: ${observedHashes[key]}`);
}
if (args.updateBaseline) {
  console.log(`Updated baseline: ${BASELINE_PATH}`);
}
