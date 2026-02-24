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
  return fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-layout-visual-'));
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

function readDeck(name) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'decks', name), 'utf8'));
}

function makeOneColumnBalanced() {
  return {
    metadata: { title: 'One Column Balanced', allowSparse: true },
    slides: [
      {
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
      },
    ],
  };
}

function makeTwoColumnBalanced() {
  return {
    metadata: { title: 'Two Column Balanced', allowSparse: true },
    slides: [
      {
        type: 'twoColumnText',
        title: 'RS.CO Tactical Summary',
        strapline: 'RESPOND | Balanced two-column content for non-split baseline.',
        bodyStyle: 'bullets',
        leftBody: [
          { text: 'Priority', header: true },
          'Update incident response triggers and ownership definitions.',
          'Document one-hour communication sequencing and backup approvers.',
          'Track post-incident closure evidence and remediation owners.',
        ],
        rightBody: [
          { text: 'Governance', header: true },
          'Align regulatory reporting timelines with internal escalation steps.',
          'Maintain notification registers and periodic contract clause reviews.',
          'Standardize executive update templates for decision-ready reporting.',
        ],
      },
    ],
  };
}

function makeAnalysisWideBalanced() {
  return {
    metadata: { title: 'Analysis Wide Balanced', allowSparse: true },
    slides: [
      {
        type: 'analysisWideChartTableText',
        title: 'Maturity Score by Function',
        strapline: 'Function-level averages highlight where executive attention should be concentrated.',
        heading: 'Function-level snapshot',
        bodyStyle: 'bullets',
        body: [
          { text: 'What the scores indicate', header: true },
          'Respond and Recover remain comparatively stronger across assessed artifacts.',
          'Detect and Protect remain pressure points with lower control maturity.',
          { text: 'Management implication', header: true },
          'Prioritize monitoring governance and policy-to-practice control execution.',
        ],
        chart: {
          type: 'bar',
          data: [
            {
              name: 'Average Maturity Score',
              labels: ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'],
              values: [2.3, 2.3, 2.2, 2.0, 2.8, 2.5],
            },
          ],
          source: 'Source: consolidatedReport.xlsx Summary tab, Maturity Score by subcategory',
        },
        table: {
          headers: ['Function', 'Avg Score', 'Maturity Band', 'Categories'],
          rows: [
            ['GOVERN', '2.33', 'Developing', '6'],
            ['IDENTIFY', '2.33', 'Developing', '3'],
            ['PROTECT', '2.20', 'Developing', '5'],
            ['DETECT', '2.00', 'Developing', '2'],
            ['RESPOND', '2.75', 'Managed', '4'],
            ['RECOVER', '2.50', 'Managed', '2'],
          ],
        },
        noteSource: 'Source: consolidatedReport.xlsx Summary tab, Maturity Score by subcategory',
      },
    ],
  };
}

const scenarios = [
  {
    name: 'one-column-regression',
    deck: readDeck('regression-one-column-overflow.deckSpec.json'),
    expect: { minSlides: 2, expectsSplit: true, splitType: 'oneColumnText', splitMode: 'one-column-bullets' },
  },
  {
    name: 'one-column-balanced',
    deck: makeOneColumnBalanced(),
    expect: { maxSlides: 1, expectsSplit: false, splitType: 'oneColumnText', splitMode: 'one-column-bullets' },
  },
  {
    name: 'two-column-regression',
    deck: readDeck('regression-two-column-overflow.deckSpec.json'),
    expect: { minSlides: 2, expectsSplit: true, splitType: 'twoColumnText', splitMode: 'two-column-bullets' },
  },
  {
    name: 'two-column-balanced',
    deck: makeTwoColumnBalanced(),
    expect: { maxSlides: 1, expectsSplit: false, splitType: 'twoColumnText', splitMode: 'two-column-bullets' },
  },
  {
    name: 'analysis-wide-regression',
    deck: readDeck('regression-analysis-wide-chart-table-overflow.deckSpec.json'),
    expect: {
      minSlides: 2,
      expectsSplit: true,
      splitType: 'analysisWideChartTableText',
      splitMode: 'text-with-chart',
    },
  },
  {
    name: 'analysis-wide-balanced',
    deck: makeAnalysisWideBalanced(),
    expect: {
      maxSlides: 1,
      expectsSplit: false,
      splitType: 'analysisWideChartTableText',
      splitMode: 'text-with-chart',
    },
  },
];

const adapter = createSlidesAdapter();
const availability = adapter.detectAvailability();
if (!availability.available) {
  throw new Error(
    `Layout visual regressions require an available slides runtime. Reason: ${availability.reason || 'unknown'}`,
  );
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const outDir = parseOutDir();
fs.mkdirSync(outDir, { recursive: true });
const summary = [];

for (const scenario of scenarios) {
  const caseDir = path.join(outDir, scenario.name);
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

  const splits = (qa?.paginationDecisions || []).filter(
    (item) =>
      item?.slideType === scenario.expect?.splitType &&
      item?.mode === scenario.expect?.splitMode &&
      Number(item?.splitInto || 0) > 1,
  );
  if (scenario.expect?.expectsSplit) {
    assert.ok(splits.length > 0, `${scenario.name}: expected split decision`);
  } else {
    assert.equal(splits.length, 0, `${scenario.name}: expected no split decision`);
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
    slides: outputSlideCount,
    splits: splits.length,
    previewDir,
  });
}

console.log('Layout visual regressions passed.');
console.log(`Output root: ${outDir}`);
for (const item of summary) {
  console.log(`- ${item.name}: slides=${item.slides}, splits=${item.splits}, preview=${item.previewDir}`);
}

