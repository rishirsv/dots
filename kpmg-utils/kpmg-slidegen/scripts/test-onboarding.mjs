import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { createSlidesAdapter } from '../generator/postprocess/slides-adapter.js';
import { REPO_ROOT } from './support.mjs';

const adapter = createSlidesAdapter();
const availability = adapter.detectAvailability();
assert.equal(
  availability.available,
  true,
  `Onboarding smoke requires an available slides runtime (${availability.reason || 'unknown'}).`,
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function runNodeScript(scriptPath, args, env, label) {
  const run = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env,
  });
  if (run.status !== 0) {
    throw new Error(`${label} failed.\n${run.stdout || ''}\n${run.stderr || ''}`.trim());
  }
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-onboarding-smoke-'));
const caseRoot = path.join(tempRoot, 'cases');
const outputRoot = path.join(tempRoot, 'outputs');
const originalCaseRoot = process.env.ONBOARDING_CASE_ROOT;
const originalOutputRoot = process.env.ONBOARDING_OUTPUT_ROOT;
process.env.ONBOARDING_CASE_ROOT = caseRoot;
process.env.ONBOARDING_OUTPUT_ROOT = outputRoot;
const env = {
  ...process.env,
  ONBOARDING_CASE_ROOT: caseRoot,
  ONBOARDING_OUTPUT_ROOT: outputRoot,
  PYTHONDONTWRITEBYTECODE: '1',
};
const { assertPromotionReady } = await import(`./onboarding/case-lib.mjs?t=${Date.now()}`);

function makePromotionQa() {
  return {
    checks: [
      { id: 'validation', status: 'pass', blocking: true },
      { id: 'contracts', status: 'pass', blocking: true },
      { id: 'pagination', status: 'pass', blocking: true },
      { id: 'overlap', status: 'pass', blocking: true },
    ],
  };
}

function makeScorecard({
  deterministicStatus = 'pass',
  manualDisposition = 'unreviewed',
  approvedExceptions = [],
  pass = deterministicStatus === 'pass',
} = {}) {
  return {
    schemaVersion: 2,
    deterministicStatus,
    manualDisposition,
    approvedExceptions,
    pass,
    metrics: {
      dimensions: { width: 1600, height: 900 },
      pixelDelta: {
        changedPixels: 0,
        totalPixels: 1440000,
        changedPixelRatio: 0,
        meanAbs: 0,
        rms: 0,
        maxAbs: 0,
        changedBounds: null,
      },
      similarity: {
        ssim: 1,
        phash: {
          reference: '0'.repeat(64),
          candidate: '0'.repeat(64),
          distance: 0,
        },
      },
    },
    thresholds: {
      changedPixelRatioMax: 0.01,
      meanAbsMax: 1,
      rmsMax: 1,
      ssimMin: 0.99,
    },
    checks: {
      changedPixelRatio: { actual: 0, max: 0.01, pass: true },
      meanAbs: { actual: 0, max: 1, pass: true },
      rms: { actual: 0, max: 1, pass: true },
      ssim: { actual: 1, min: 0.99, pass: true },
    },
  };
}

function seedPromotionReadyCase(caseRoot, outputRoot, caseId, scorecard) {
  const caseDir = path.join(caseRoot, caseId);
  const outputDir = path.join(outputRoot, caseId);

  writeJson(path.join(caseDir, 'intake.json'), {
    caseId,
    layoutId: `${caseId}Layout`,
    primitiveRef: 'businessOverview@1',
    status: 'compared',
  });
  writeJson(path.join(caseDir, 'candidate.layout.json'), {
    type: `${caseId}Layout`,
    primitive: 'businessOverview@1',
    geometry: {},
    slots: {},
  });
  fs.mkdirSync(path.join(outputDir, 'candidate', 'preview'), { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'candidate', 'preview', 'slide-1.png'), '');
  writeJson(path.join(outputDir, 'candidate', 'qa.json'), makePromotionQa());
  writeJson(path.join(outputDir, 'compare', 'diff.json'), {
    schemaVersion: 2,
    metrics: {},
    thresholds: {},
    checks: {},
  });
  writeJson(path.join(outputDir, 'compare', 'scorecard.json'), scorecard);
}

try {
  const caseId = 'business-overview-onboarding-smoke';
  const layoutId = 'businessOverviewOnboardingSmoke';
  const caseDir = path.join(caseRoot, caseId);
  const outputDir = path.join(outputRoot, caseId);
  const sourceDeckSpecPath = path.join(tempRoot, 'business-overview-source.deckSpec.json');
  const sourceDeckPath = path.join(tempRoot, 'business-overview-source.pptx');
  const sourceQaPath = path.join(tempRoot, 'business-overview-source.qa.json');
  const goldenDeckSpec = readJson(path.join(REPO_ROOT, 'fixtures', 'harness', 'golden', 'all-layouts', 'deckSpec.json'));
  const businessOverviewSlide = goldenDeckSpec.slides.find((slide) => slide?.type === 'businessOverview');
  assert.ok(businessOverviewSlide, 'The golden fixture should include a businessOverview slide.');

  fs.writeFileSync(
    sourceDeckSpecPath,
    `${JSON.stringify({
      metadata: goldenDeckSpec.metadata,
      slides: [businessOverviewSlide],
    }, null, 2)}\n`,
  );

  runNodeScript(
    path.join(REPO_ROOT, 'generator', 'index.js'),
    ['--in', sourceDeckSpecPath, '--out', sourceDeckPath, '--qa-out', sourceQaPath],
    env,
    'Source deck generation',
  );

  // Run the actual onboarding lifecycle end to end against a representative slide.
  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'onboarding', 'extract-case.mjs'),
    [
      '--case-id',
      caseId,
      '--source-pptx',
      sourceDeckPath,
      '--slide',
      '1',
      '--layout-id',
      layoutId,
    ],
    env,
    'Onboarding extract',
  );

  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'onboarding', 'classify-case.mjs'),
    ['--case-id', caseId],
    env,
    'Onboarding classify',
  );

  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'onboarding', 'scaffold-case.mjs'),
    ['--case-id', caseId, '--primitive-ref', 'businessOverview@1'],
    env,
    'Onboarding scaffold',
  );

  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'onboarding', 'render-candidate.mjs'),
    ['--case-id', caseId],
    env,
    'Onboarding render',
  );

  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'onboarding', 'compare-candidate.mjs'),
    ['--case-id', caseId],
    env,
    'Onboarding compare',
  );

  const expectedFiles = [
    path.join(caseDir, 'intake.json'),
    path.join(caseDir, 'extract.raw.json'),
    path.join(caseDir, 'extract.normalized.json'),
    path.join(caseDir, 'fingerprint.json'),
    path.join(caseDir, 'classify.json'),
    path.join(caseDir, 'candidate.layout.json'),
    path.join(caseDir, 'candidate.deckSpec.json'),
    path.join(outputDir, 'candidate', 'deck.pptx'),
    path.join(outputDir, 'candidate', 'qa.json'),
    path.join(outputDir, 'candidate', 'preview', 'slide-1.png'),
    path.join(outputDir, 'compare', 'reference.png'),
    path.join(outputDir, 'compare', 'candidate.png'),
    path.join(outputDir, 'compare', 'diff.png'),
    path.join(outputDir, 'compare', 'diff.json'),
    path.join(outputDir, 'compare', 'scorecard.json'),
  ];

  for (const filePath of expectedFiles) {
    assert.equal(fs.existsSync(filePath), true, `Expected onboarding artifact: ${filePath}`);
  }

  const classification = readJson(path.join(caseDir, 'classify.json'));
  assert.equal(typeof classification.requiresManualSelection, 'boolean');
  assert.ok(Array.isArray(classification.rankedAlternatives));
  if (classification.requiresManualSelection) {
    assert.equal(
      classification.recommendedPrimitiveRef,
      null,
      'Fail-closed classification should clear recommendedPrimitiveRef when manual selection is required.',
    );
  }

  assert.equal(
    fs.existsSync(path.join(caseDir, 'candidate.primitive.json')),
    false,
    'Existing primitive scaffolds should not create candidate.primitive.json.',
  );
  assert.equal(
    fs.existsSync(path.join(caseDir, 'candidate.builder.js')),
    false,
    'Existing primitive scaffolds should not create candidate.builder.js.',
  );

  const record = readJson(path.join(caseDir, 'intake.json'));
  assert.equal(record.status, 'compared', 'The smoke case should complete the compare stage.');
  assert.equal(record.renderArtifacts?.candidateQaPath, 'candidate/qa.json');
  assert.equal(record.renderArtifacts?.candidatePngPath, 'compare/candidate.png');
  assert.equal(record.renderArtifacts?.diffJsonPath, 'compare/diff.json');
  assert.equal(record.renderArtifacts?.scorecardPath, 'compare/scorecard.json');

  const qa = readJson(path.join(outputDir, 'candidate', 'qa.json'));
  assert.equal(typeof qa, 'object');
  assert.ok(qa && !Array.isArray(qa), 'Candidate QA should be a JSON object.');

  const diff = readJson(path.join(outputDir, 'compare', 'diff.json'));
  assert.equal(diff.schemaVersion, 2, 'Compare diff should use schema version 2.');
  assert.equal(typeof diff.metrics, 'object');
  assert.equal(typeof diff.checks, 'object');

  const scorecard = readJson(path.join(outputDir, 'compare', 'scorecard.json'));
  assert.equal(scorecard.schemaVersion, 2, 'Scorecard should use schema version 2.');
  assert.equal(typeof scorecard.pass, 'boolean');
  assert.match(scorecard.deterministicStatus, /^(pass|fail)$/);
  assert.equal(scorecard.manualDisposition, 'unreviewed');
  assert.ok(Array.isArray(scorecard.approvedExceptions));
  assert.equal(typeof scorecard.metrics, 'object');
  assert.equal(typeof scorecard.checks, 'object');

  // Promotion should now see a fully-rendered, fully-compared case with all required artifacts.
  assert.doesNotThrow(
    () => assertPromotionReady({ caseId }),
    'The smoke case should satisfy promotion prerequisites after compare.',
  );

  seedPromotionReadyCase(caseRoot, outputRoot, 'promotion-scorecard-pass', makeScorecard());
  assert.doesNotThrow(
    () => assertPromotionReady({ caseId: 'promotion-scorecard-pass' }),
    'Deterministic compare passes should remain promotable without manual review.',
  );

  seedPromotionReadyCase(
    caseRoot,
    outputRoot,
    'promotion-scorecard-fail',
    makeScorecard({ deterministicStatus: 'fail', pass: false }),
  );
  assert.throws(
    () => assertPromotionReady({ caseId: 'promotion-scorecard-fail' }),
    /deterministically failed and has not been manually approved with recorded exceptions/,
    'Deterministic compare failures should block promotion until they are manually accepted with exceptions.',
  );

  seedPromotionReadyCase(
    caseRoot,
    outputRoot,
    'promotion-scorecard-manual-override',
    makeScorecard({ deterministicStatus: 'fail', pass: false }),
  );
  const manualOverride = assertPromotionReady({
    caseId: 'promotion-scorecard-manual-override',
    manualDisposition: 'accepted',
    approvedExceptions: ['Minor title anti-aliasing drift outside the content region.'],
  });
  assert.equal(manualOverride.scorecard.pass, true);
  assert.equal(manualOverride.scorecard.manualDisposition, 'accepted');
  assert.deepEqual(
    manualOverride.scorecard.approvedExceptions,
    ['Minor title anti-aliasing drift outside the content region.'],
  );

  seedPromotionReadyCase(
    caseRoot,
    outputRoot,
    'promotion-scorecard-missing-exceptions',
    makeScorecard({ deterministicStatus: 'fail', pass: false }),
  );
  assert.throws(
    () => assertPromotionReady({ caseId: 'promotion-scorecard-missing-exceptions', manualDisposition: 'accepted' }),
    /requires approvedExceptions to be recorded/,
    'Manual approval without recorded exceptions should not allow promotion.',
  );

  seedPromotionReadyCase(
    caseRoot,
    outputRoot,
    'promotion-scorecard-rejected',
    makeScorecard({ deterministicStatus: 'fail', pass: false }),
  );
  assert.throws(
    () => assertPromotionReady({ caseId: 'promotion-scorecard-rejected', manualDisposition: 'rejected' }),
    /manually rejected/,
    'Manual rejection should block promotion explicitly.',
  );
} finally {
  if (originalCaseRoot === undefined) delete process.env.ONBOARDING_CASE_ROOT;
  else process.env.ONBOARDING_CASE_ROOT = originalCaseRoot;
  if (originalOutputRoot === undefined) delete process.env.ONBOARDING_OUTPUT_ROOT;
  else process.env.ONBOARDING_OUTPUT_ROOT = originalOutputRoot;
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('Onboarding lane passed.');
