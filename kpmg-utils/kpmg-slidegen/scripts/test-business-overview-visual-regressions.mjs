import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { getImageDimensions } from '../generator/helpers/media.js';
import { createSlidesAdapter } from '../generator/postprocess/slides-adapter.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const BASELINE_PATH = path.join(process.cwd(), 'testing', 'visual-baselines', 'business-overview.hashes.json');

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
  if (!args.outDir) args.outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-business-overview-visual-'));
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

function assertImageValid(imagePath) {
  assert.equal(fs.existsSync(imagePath), true, `Expected image to exist: ${imagePath}`);
  const stat = fs.statSync(imagePath);
  assert.ok(stat.size > 0, `Expected image size > 0: ${imagePath}`);
  const { width, height } = getImageDimensions(imagePath);
  assert.ok(width > 0, `Expected width > 0: ${imagePath}`);
  assert.ok(height > 0, `Expected height > 0: ${imagePath}`);
}

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
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
    `Business-overview visual regressions require an available slides runtime. Reason: ${availability.reason || 'unknown'}`,
  );
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const scenarios = [
  {
    name: 'business-overview-north',
    deckPath: path.join(process.cwd(), 'decks', 'regression-business-overview-north.deckSpec.json'),
    expect: {
      minSlides: 1,
      maxSlides: 1,
      expectsSplit: false,
      maxOverlapWarnings: 30,
      maxOverlapSevere: 4,
      baselineKey: 'business-overview-north.slide-1',
    },
  },
  {
    name: 'business-overview-coffee',
    deckPath: path.join(process.cwd(), 'decks', 'regression-business-overview-coffee.deckSpec.json'),
    expect: {
      minSlides: 1,
      maxSlides: 1,
      expectsSplit: false,
      maxOverlapWarnings: 40,
      maxOverlapSevere: 6,
      baselineKey: 'business-overview-coffee.slide-1',
    },
  },
  {
    name: 'business-overview-overflow',
    deckPath: path.join(process.cwd(), 'decks', 'regression-business-overview-overflow.deckSpec.json'),
    expect: {
      minSlides: 2,
      expectsSplit: true,
      splitType: 'businessOverview',
      splitMode: 'business-overview-overview-body',
      maxOverlapWarnings: 50,
      maxOverlapSevere: 8,
    },
  },
];

const baseline = readBaseline();
const observedHashes = {};
const summary = [];

for (const scenario of scenarios) {
  const caseDir = path.join(args.outDir, scenario.name);
  const outPath = path.join(caseDir, 'deck.pptx');
  const qaPath = path.join(caseDir, 'qa.json');
  const previewDir = path.join(caseDir, 'preview');
  fs.rmSync(caseDir, { recursive: true, force: true });
  fs.mkdirSync(caseDir, { recursive: true });

  const deck = JSON.parse(fs.readFileSync(scenario.deckPath, 'utf8'));
  await generateToFile(deck, outPath, {
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
  const previewStatus = qa?.postprocess?.preview?.status;
  const overflowStatus = qa?.postprocess?.overflowVisual?.status;
  const outputSlideCount = Number(qa?.outputSlideCount || 0);
  const overlapWarnings = Number(qa?.overlapSummary?.warningCount || 0);
  const overlapSevere = Number(qa?.overlapSummary?.severeCount || 0);

  assert.equal(previewStatus, 'ok', `${scenario.name}: expected preview status 'ok', got '${previewStatus}'`);
  assert.equal(overflowStatus, 'pass', `${scenario.name}: expected overflow status 'pass', got '${overflowStatus}'`);
  assert.ok(outputSlideCount > 0, `${scenario.name}: expected output slides > 0`);

  if (Number.isFinite(scenario.expect?.minSlides)) {
    assert.ok(
      outputSlideCount >= scenario.expect.minSlides,
      `${scenario.name}: expected at least ${scenario.expect.minSlides} slides, got ${outputSlideCount}`,
    );
  }
  if (Number.isFinite(scenario.expect?.maxSlides)) {
    assert.ok(
      outputSlideCount <= scenario.expect.maxSlides,
      `${scenario.name}: expected at most ${scenario.expect.maxSlides} slides, got ${outputSlideCount}`,
    );
  }
  if (Number.isFinite(scenario.expect?.maxOverlapWarnings)) {
    assert.ok(
      overlapWarnings <= scenario.expect.maxOverlapWarnings,
      `${scenario.name}: expected overlap warnings <= ${scenario.expect.maxOverlapWarnings}, got ${overlapWarnings}`,
    );
  }
  if (Number.isFinite(scenario.expect?.maxOverlapSevere)) {
    assert.ok(
      overlapSevere <= scenario.expect.maxOverlapSevere,
      `${scenario.name}: expected overlap severe <= ${scenario.expect.maxOverlapSevere}, got ${overlapSevere}`,
    );
  }

  const splits = (qa?.paginationDecisions || []).filter(
    (item) =>
      item?.slideType === scenario.expect?.splitType &&
      item?.mode === scenario.expect?.splitMode &&
      Number(item?.splitInto || 0) > 1,
  );
  if (scenario.expect?.expectsSplit) {
    assert.ok(splits.length > 0, `${scenario.name}: expected split decision`);
  }

  const slides = listSlidePngs(previewDir);
  assert.equal(
    slides.length,
    outputSlideCount,
    `${scenario.name}: expected ${outputSlideCount} preview PNGs, got ${slides.length}`,
  );
  for (const imagePath of slides) {
    assertImageValid(imagePath);
  }

  if (scenario.expect?.baselineKey) {
    const first = slides[0];
    assert.ok(first, `${scenario.name}: expected first slide preview image`);
    const hash = sha256File(first);
    observedHashes[scenario.expect.baselineKey] = hash;
    if (!args.updateBaseline) {
      const expectedHash = baseline?.[scenario.expect.baselineKey];
      assert.ok(
        expectedHash,
        `${scenario.name}: missing baseline hash for key '${scenario.expect.baselineKey}'. Run with --update-baseline once.`,
      );
      assert.equal(
        hash,
        expectedHash,
        `${scenario.name}: baseline mismatch for ${scenario.expect.baselineKey}.\nexpected=${expectedHash}\nactual=${hash}\nimage=${first}`,
      );
    }
  }

  summary.push({
    name: scenario.name,
    outputSlideCount,
    overlapWarnings,
    overlapSevere,
    splitCount: splits.length,
    previewDir,
  });
}

if (args.updateBaseline) {
  const nextBaseline = { ...baseline, ...observedHashes };
  writeBaseline(nextBaseline);
}

console.log('Business overview visual regressions passed.');
console.log(`Temp output: ${args.outDir}`);
for (const item of summary) {
  console.log(
    `- ${item.name}: slides=${item.outputSlideCount}, overlapWarnings=${item.overlapWarnings}, overlapSevere=${item.overlapSevere}, splits=${item.splitCount}, preview=${item.previewDir}`,
  );
}
if (args.updateBaseline) {
  console.log(`Updated baseline: ${BASELINE_PATH}`);
}
