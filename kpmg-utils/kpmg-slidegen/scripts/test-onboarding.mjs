import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { createSlidesAdapter } from '../generator/postprocess/slides-adapter.js';
import { compareCandidateImages } from './onboarding/lib.mjs';
import { REPO_ROOT } from './support.mjs';

const adapter = createSlidesAdapter();
const availability = adapter.detectAvailability();
assert.equal(
  availability.available,
  true,
  `Onboarding smoke requires an available slides runtime (${availability.reason || 'unknown'}).`,
);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-onboarding-smoke-'));
const caseRoot = path.join(tempRoot, 'cases');
const outputRoot = path.join(tempRoot, 'outputs');

try {
  const extractRun = spawnSync(
    process.execPath,
    [
      path.join(REPO_ROOT, 'scripts', 'onboarding', 'extract-case.mjs'),
      '--case-id',
      'business-overview-onboarding-smoke',
      '--source-pptx',
      path.join(REPO_ROOT, 'references', 'diligence_template.pptx'),
      '--slide',
      '1',
      '--layout-id',
      'businessOverviewOnboardingSmoke',
    ],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        ONBOARDING_CASE_ROOT: caseRoot,
        ONBOARDING_OUTPUT_ROOT: outputRoot,
        PYTHONDONTWRITEBYTECODE: '1',
      },
    },
  );

  if (extractRun.status !== 0) {
    throw new Error(`Onboarding extract failed.\n${extractRun.stdout || ''}\n${extractRun.stderr || ''}`.trim());
  }

  const classifyRun = spawnSync(
    process.execPath,
    [
      path.join(REPO_ROOT, 'scripts', 'onboarding', 'classify-case.mjs'),
      '--case-id',
      'business-overview-onboarding-smoke',
    ],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        ONBOARDING_CASE_ROOT: caseRoot,
        ONBOARDING_OUTPUT_ROOT: outputRoot,
        PYTHONDONTWRITEBYTECODE: '1',
      },
    },
  );
  if (classifyRun.status !== 0) {
    throw new Error(`Onboarding classify failed.\n${classifyRun.stdout || ''}\n${classifyRun.stderr || ''}`.trim());
  }

  const scaffoldRun = spawnSync(
    process.execPath,
    [
      path.join(REPO_ROOT, 'scripts', 'onboarding', 'scaffold-case.mjs'),
      '--case-id',
      'business-overview-onboarding-smoke',
      '--primitive-ref',
      'businessOverview@1',
    ],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        ONBOARDING_CASE_ROOT: caseRoot,
        ONBOARDING_OUTPUT_ROOT: outputRoot,
        PYTHONDONTWRITEBYTECODE: '1',
      },
    },
  );
  if (scaffoldRun.status !== 0) {
    throw new Error(`Onboarding scaffold failed.\n${scaffoldRun.stdout || ''}\n${scaffoldRun.stderr || ''}`.trim());
  }

  const base = path.join(outputRoot, 'business-overview-onboarding-smoke');
  const layoutBase = path.join(caseRoot, 'business-overview-onboarding-smoke');
  const expectedFiles = [
    path.join(layoutBase, 'intake.json'),
    path.join(layoutBase, 'extract.raw.json'),
    path.join(layoutBase, 'extract.normalized.json'),
    path.join(layoutBase, 'fingerprint.json'),
    path.join(layoutBase, 'classify.json'),
    path.join(layoutBase, 'candidate.layout.json'),
    path.join(layoutBase, 'candidate.deckSpec.json'),
    path.join(base, 'compare', 'reference.png'),
  ];

  for (const filePath of expectedFiles) {
    assert.equal(fs.existsSync(filePath), true, `Expected onboarding artifact: ${filePath}`);
  }

  const referencePngPath = path.join(base, 'compare', 'reference.png');
  const candidatePngPath = path.join(base, 'compare', 'candidate.png');
  const diffPngPath = path.join(base, 'compare', 'diff.png');
  const diffJsonPath = path.join(base, 'compare', 'diff.json');
  const scorecardPath = path.join(base, 'compare', 'scorecard.json');
  fs.copyFileSync(referencePngPath, candidatePngPath);
  compareCandidateImages({
    referencePngPath,
    candidatePngPath,
    diffPngPath,
    diffJsonPath,
    scorecardPath,
  });

  const scorecard = JSON.parse(
    fs.readFileSync(path.join(base, 'compare', 'scorecard.json'), 'utf8'),
  );
  assert.equal(scorecard?.deterministicStatus, 'pass', 'Scorecard should expose deterministic status.');
  assert.equal(scorecard?.manualDisposition, 'unreviewed', 'Scorecard should default manual disposition.');
  assert.ok(Array.isArray(scorecard?.approvedExceptions), 'Scorecard should expose approved exceptions.');
  assert.equal(typeof scorecard?.metrics?.similarity?.ssim, 'number', 'Scorecard should expose SSIM.');
  assert.equal(typeof scorecard?.pass, 'boolean', 'Scorecard should preserve the compatibility pass flag.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('Onboarding lane passed.');
