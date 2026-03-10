import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  buildCaseRecord,
  buildClassificationDecision,
  PRIMITIVE_CLASSIFICATION_ACCEPTANCE_THRESHOLD,
  rankPrimitivesForFingerprint,
} from './onboarding/case-lib.mjs';
import { readSourcePrimitives } from './codegen/lib.mjs';
import { REPO_ROOT } from './support.mjs';

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const primitives = readSourcePrimitives();

{
  const scores = rankPrimitivesForFingerprint(
    {
      likelyPrimitiveCandidates: ['businessOverview'],
      hasTitleBand: true,
      connectorCount: 0,
      repeatedCardCount: 0,
    },
    primitives,
  );
  const classification = buildClassificationDecision({
    caseId: 'high-confidence-case',
    scores,
  });

  assert.equal(
    classification.recommendedPrimitiveRef,
    'businessOverview@1',
    'A strong, unambiguous match should produce a recommended primitive.',
  );
  assert.equal(classification.requiresManualSelection, false);
  assert.equal(classification.manualSelectionReason, null);
  assert.equal(classification.acceptanceThreshold, PRIMITIVE_CLASSIFICATION_ACCEPTANCE_THRESHOLD);
  assert.equal(classification.rankedAlternatives[0].primitiveRef, 'businessOverview@1');
}

{
  const scores = rankPrimitivesForFingerprint(
    {
      likelyPrimitiveCandidates: [],
      hasTitleBand: false,
      connectorCount: 0,
      repeatedCardCount: 0,
    },
    primitives,
  );
  const classification = buildClassificationDecision({
    caseId: 'zero-score-case',
    scores,
  });

  assert.equal(classification.recommendedPrimitiveRef, null);
  assert.equal(classification.requiresManualSelection, true);
  assert.equal(classification.manualSelectionReason, 'zero-score');
  assert.equal(classification.topScore, 0);
}

{
  const scores = rankPrimitivesForFingerprint(
    {
      likelyPrimitiveCandidates: ['divider', 'dividerDark'],
      hasTitleBand: false,
      connectorCount: 0,
      repeatedCardCount: 0,
    },
    primitives,
  );
  const classification = buildClassificationDecision({
    caseId: 'ambiguous-case',
    scores,
  });

  assert.equal(classification.recommendedPrimitiveRef, null);
  assert.equal(classification.requiresManualSelection, true);
  assert.equal(classification.manualSelectionReason, 'ambiguous-tie');
  assert.equal(classification.topScore, PRIMITIVE_CLASSIFICATION_ACCEPTANCE_THRESHOLD);
}

{
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-onboarding-classify-'));
  const caseRoot = path.join(tempRoot, 'cases');
  const outputRoot = path.join(tempRoot, 'outputs');
  const caseId = 'override-needed-case';
  const caseDir = path.join(caseRoot, caseId);
  try {
    writeJson(
      path.join(caseDir, 'intake.json'),
      buildCaseRecord({
        caseId,
        layoutId: 'overrideNeededLayout',
        sourcePptxPath: 'references/diligence_template.pptx',
        sourceSlideNumber: 1,
      }),
    );
    writeJson(path.join(caseDir, 'classify.json'), {
      schemaVersion: 2,
      caseId,
      acceptanceThreshold: PRIMITIVE_CLASSIFICATION_ACCEPTANCE_THRESHOLD,
      topScore: 0,
      recommendedPrimitiveRef: null,
      requiresManualSelection: true,
      manualSelectionReason: 'zero-score',
      rankedAlternatives: [],
    });

    const blocked = spawnSync(
      process.execPath,
      [
        path.join(REPO_ROOT, 'scripts', 'onboarding', 'scaffold-case.mjs'),
        '--case-id',
        caseId,
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
    assert.notEqual(blocked.status, 0, 'Scaffold should fail closed without an accepted recommendation or override.');
    assert.match(
      `${blocked.stdout}\n${blocked.stderr}`,
      /Run onboard:classify until it recommends one above threshold, or pass --primitive-ref/,
    );

    const overridden = spawnSync(
      process.execPath,
      [
        path.join(REPO_ROOT, 'scripts', 'onboarding', 'scaffold-case.mjs'),
        '--case-id',
        caseId,
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
    assert.equal(overridden.status, 0, `Explicit primitive override should succeed.\n${overridden.stdout || ''}\n${overridden.stderr || ''}`.trim());
    assert.equal(fs.existsSync(path.join(caseDir, 'candidate.layout.json')), true);
    assert.equal(fs.existsSync(path.join(caseDir, 'candidate.deckSpec.json')), true);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

console.log('Onboarding classification tests passed.');
