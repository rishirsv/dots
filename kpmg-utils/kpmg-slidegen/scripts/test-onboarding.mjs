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

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-onboarding-smoke-'));
const layoutRoot = path.join(tempRoot, 'layouts');
const outputRoot = path.join(tempRoot, 'outputs');

try {
  const run = spawnSync(
    process.execPath,
    [
      path.join(REPO_ROOT, 'scripts', 'onboarding', 'run-layout-onboarding.mjs'),
      '--source-pptx',
      path.join(REPO_ROOT, 'references', 'diligence_template.pptx'),
      '--slide',
      '1',
      '--layout-id',
      'businessOverviewOnboardingSmoke',
      '--family',
      'businessOverview',
      '--extract-seed',
    ],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        ONBOARDING_LAYOUT_ROOT: layoutRoot,
        ONBOARDING_OUTPUT_ROOT: outputRoot,
        PYTHONDONTWRITEBYTECODE: '1',
      },
    },
  );

  if (run.status !== 0) {
    throw new Error(`Onboarding smoke failed.\n${run.stdout || ''}\n${run.stderr || ''}`.trim());
  }

  const base = path.join(outputRoot, 'businessOverviewOnboardingSmoke');
  const layoutBase = path.join(layoutRoot, 'businessOverviewOnboardingSmoke');
  const expectedFiles = [
    path.join(layoutBase, 'source.json'),
    path.join(layoutBase, 'seed', 'geometry.seed.json'),
    path.join(layoutBase, 'candidate.layout.json'),
    path.join(layoutBase, 'candidate.builder.js'),
    path.join(layoutBase, 'candidate.deckSpec.json'),
    path.join(base, 'candidate', 'deck.pptx'),
    path.join(base, 'candidate', 'qa.json'),
    path.join(base, 'candidate', 'preview', 'slide-1.png'),
    path.join(base, 'compare', 'reference.png'),
    path.join(base, 'compare', 'candidate.png'),
    path.join(base, 'compare', 'diff.png'),
    path.join(base, 'compare', 'diff.json'),
    path.join(base, 'compare', 'scorecard.json'),
  ];

  for (const filePath of expectedFiles) {
    assert.equal(fs.existsSync(filePath), true, `Expected onboarding artifact: ${filePath}`);
  }

  const scorecard = JSON.parse(
    fs.readFileSync(path.join(base, 'compare', 'scorecard.json'), 'utf8'),
  );
  assert.equal(typeof scorecard?.pass, 'boolean', 'Scorecard should expose a deterministic pass flag.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('Onboarding lane passed.');
