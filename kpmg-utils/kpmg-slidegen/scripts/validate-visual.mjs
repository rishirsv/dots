import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { getImageDimensions } from '../generator/helpers/media.js';
import { createSlidesAdapter } from '../generator/postprocess/slides-adapter.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

/**
 * Return sorted slide PNG paths from a preview directory.
 * @param {string} previewDir
 * @returns {string[]}
 */
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

/**
 * Assert a PNG exists, is non-empty, and has measurable dimensions.
 * @param {string} imagePath
 */
function assertImageValid(imagePath) {
  assert.equal(fs.existsSync(imagePath), true, `Expected image to exist: ${imagePath}`);
  const stat = fs.statSync(imagePath);
  assert.ok(stat.size > 0, `Expected image size > 0: ${imagePath}`);
  const { width, height } = getImageDimensions(imagePath);
  assert.ok(width > 0, `Expected width > 0: ${imagePath}`);
  assert.ok(height > 0, `Expected height > 0: ${imagePath}`);
}

const adapter = createSlidesAdapter();
const availability = adapter.detectAvailability();
if (!availability.available) {
  throw new Error(
    `Visual validation requires an available slides runtime. Reason: ${availability.reason || 'unknown'}`,
  );
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-visual-'));
const outPath = path.join(tmpDir, 'deck.pptx');
const qaPath = path.join(tmpDir, 'qa.json');
const previewDir = path.join(tmpDir, 'preview');
const montagePath = path.join(tmpDir, 'montage.png');

const deckSpec = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'decks', 'qa-golden-all-layouts.deckSpec.json'), 'utf8'),
);
const templatePackage = loadTemplatePackage('kpmg-diligence');

await generateToFile(deckSpec, outPath, {
  templatePackage,
  qaPath,
  strict: false,
  allowSparse: false,
  enforceOverlap: true,
  postprocess: {
    withPreview: true,
    withMontage: true,
    withVisualOverflow: true,
    previewWidth: 1600,
    previewHeight: 900,
    previewOutputDir: previewDir,
    montageOutputFile: montagePath,
    montageCols: 5,
    montageLabelMode: 'number',
    visualOverflowPadPx: 100,
  },
  postprocessAdapter: adapter,
});

assert.equal(fs.existsSync(outPath), true, 'Expected generated deck.pptx');
assert.equal(fs.existsSync(qaPath), true, 'Expected qa.json');

const qa = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
assert.equal(qa?.valid, true, 'Expected QA report to be valid');
if (qa?.postprocess?.preview?.status !== 'ok') {
  const details = qa?.postprocess?.preview?.stderr || qa?.postprocess?.preview?.reason || 'unknown';
  if (String(details).includes("No module named 'pdf2image'")) {
    throw new Error(
      'Preview generation failed: missing Python dependency `pdf2image` in slides runtime. Install it and re-run `node scripts/validate-visual.mjs`.',
    );
  }
  throw new Error(`Preview generation failed: ${details}`);
}
if (qa?.postprocess?.montage?.status !== 'ok') {
  const details = qa?.postprocess?.montage?.stderr || qa?.postprocess?.montage?.reason || 'unknown';
  throw new Error(`Montage generation failed: ${details}`);
}

const slides = listSlidePngs(previewDir);
assert.ok(slides.length > 0, 'Expected preview to produce at least one slide image');
assert.equal(
  slides.length,
  qa.outputSlideCount,
  `Expected ${qa.outputSlideCount} preview PNGs to match rendered slide count`,
);
for (const slidePath of slides) {
  assertImageValid(slidePath);
}

assertImageValid(montagePath);

const overflowVisual = qa?.postprocess?.overflowVisual || {};
assert.ok(
  ['pass', 'fail'].includes(overflowVisual.status),
  `Expected overflow status to be pass/fail when runtime is available, got: ${overflowVisual.status}`,
);

if (overflowVisual.status === 'fail') {
  for (const idx of overflowVisual.failingSlides || []) {
    assert.ok(Number.isInteger(idx), `Expected integer failing slide index: ${idx}`);
    assert.ok(idx >= 1 && idx <= slides.length, `Failing slide index out of range: ${idx}`);
  }
}

for (const imagePath of overflowVisual.imagePaths || []) {
  assert.ok(fs.existsSync(imagePath), `Expected overflow artifact image to exist: ${imagePath}`);
}

console.log('Visual validation passed.');
console.log(`Temp output: ${tmpDir}`);
console.log(`Slides runtime: ${availability.slidesDir}`);
