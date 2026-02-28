import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { getImageDimensions } from '../generator/helpers/media.js';
import { createSlidesAdapter } from '../generator/postprocess/slides-adapter.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

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

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeDeckWithOneColumnSlide(slide) {
  return {
    metadata: {
      title: 'One Column Visual Regression',
      allowSparse: true,
    },
    slides: [slide],
  };
}

const regressionFixture = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'decks', 'regression-one-column-overflow.deckSpec.json'), 'utf8'),
);
const regressionSlide = regressionFixture?.slides?.[0];
if (!regressionSlide) {
  throw new Error('Missing slide in decks/regression-one-column-overflow.deckSpec.json');
}

const denseBody = deepClone(regressionSlide.body || []);
const longStrapline =
  'GOVERN | Full question-level observations and direct citation evidence for this question. This strapline is intentionally extended with additional explanatory narrative, qualifier language, and repeated context so that dynamic strapline sizing materially reduces the effective body region and creates a realistic stress condition for pagination geometry mismatches across render and split paths.';
const longSource =
  'Source: consolidatedReport.xlsx Observations tab, Question 8. Supplementary source context intentionally extended to consume additional source footprint and reduce available body height in footer-safe rendering mode for this stress scenario.';

const scenarios = [
  {
    name: 'regression-fixture',
    deck: regressionFixture,
    expect: {
      minSlides: 2,
      expectsSplit: true,
    },
  },
  {
    name: 'strapline-only-dense',
    deck: makeDeckWithOneColumnSlide((() => {
      const slide = {
        ...deepClone(regressionSlide),
        strapline: longStrapline,
        body: deepClone(denseBody),
      };
      delete slide.source;
      return slide;
    })()),
    expect: {
      minSlides: 2,
      expectsSplit: true,
    },
  },
  {
    name: 'source-only-dense',
    deck: makeDeckWithOneColumnSlide((() => {
      const slide = {
        ...deepClone(regressionSlide),
        source: longSource,
        body: deepClone(denseBody),
      };
      delete slide.strapline;
      return slide;
    })()),
    expect: {
      minSlides: 2,
      expectsSplit: true,
    },
  },
  {
    name: 'balanced-medium',
    deck: makeDeckWithOneColumnSlide({
      type: 'oneColumnText',
      title: 'Balanced One Column Sample',
      strapline: 'GOVERN | Medium density narrative with expected single-slide fit.',
      bodyStyle: 'bullets',
      body: [
        { text: 'Question', header: true },
        'What controls are in place to monitor priority cybersecurity objectives?',
        { text: 'Evidence summary', header: true },
        'Transcripts: Operating reviews include recurring discussions on control execution and ownership for target remediation items.',
        'Documents: Governance records reference objective tracking, progress checkpoints, and leadership escalation routines.',
        'Questionnaires: Reported cadence indicates documented risk and performance reviews with named accountability.',
      ],
      source: 'Source: consolidatedReport.xlsx Summary tab.',
    }),
    expect: {
      maxSlides: 1,
      expectsSplit: false,
    },
  },
];

const adapter = createSlidesAdapter();
const availability = adapter.detectAvailability();
if (!availability.available) {
  throw new Error(
    `One-column visual regression tests require an available slides runtime. Reason: ${availability.reason || 'unknown'}`,
  );
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-one-col-visual-'));
const summary = [];

for (const scenario of scenarios) {
  const caseDir = path.join(runDir, scenario.name);
  const outPath = path.resolve(caseDir, 'deck.pptx');
  const qaPath = path.resolve(caseDir, 'qa.json');
  const previewDir = path.resolve(caseDir, 'preview');
  fs.mkdirSync(caseDir, { recursive: true });

  await generateToFile(scenario.deck, outPath, {
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

  const oneColumnSplits = (qa?.paginationDecisions || []).filter(
    (item) => item?.slideType === 'oneColumnText' && item?.mode === 'one-column-bullets' && Number(item?.splitInto || 0) > 1,
  );
  if (scenario.expect?.expectsSplit) {
    assert.ok(oneColumnSplits.length > 0, `${scenario.name}: expected oneColumnText split decision`);
  } else {
    assert.equal(oneColumnSplits.length, 0, `${scenario.name}: expected no oneColumnText split decision`);
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

  summary.push({
    name: scenario.name,
    outputSlideCount,
    splitCount: oneColumnSplits.length,
    previewDir,
  });
}

console.log('One-column visual regressions passed.');
console.log(`Temp output: ${runDir}`);
for (const item of summary) {
  console.log(
    `- ${item.name}: slides=${item.outputSlideCount}, splits=${item.splitCount}, preview=${item.previewDir}`,
  );
}
