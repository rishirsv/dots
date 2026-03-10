import fs from 'node:fs';

import { compareCase, getCasePaths, normalizeCaseId } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/compare-candidate.mjs --case-id <kebab-case>',
  );
}

const args = parseArgMap(process.argv.slice(2));
const caseId = normalizeCaseId(args.get('case-id'));
if (!caseId) usage();

const paths = getCasePaths(caseId);
if (!fs.existsSync(paths.referencePngPath)) {
  throw new Error(`Missing reference PNG: ${paths.referencePngPath}`);
}
if (!fs.existsSync(paths.candidatePreviewPngPath)) {
  throw new Error(`Missing candidate preview PNG: ${paths.candidatePreviewPngPath}`);
}

const { scorecard } = compareCase({ caseId });

console.log(`Candidate PNG: ${paths.candidatePngPath}`);
console.log(`Diff PNG: ${paths.diffPngPath}`);
console.log(`Scorecard: ${paths.scorecardPath}`);
console.log(`Deterministic status: ${scorecard.deterministicStatus}`);
console.log(`Diff pass: ${scorecard.pass ? 'yes' : 'no'}`);
