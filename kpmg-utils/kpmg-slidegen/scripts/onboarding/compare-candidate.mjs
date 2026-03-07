import fs from 'node:fs';

import {
  compareCandidateImages,
  getLayoutPaths,
  loadSourceRecord,
  normalizePng,
  parseArgMap,
  writeSourceRecord,
} from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/compare-candidate.mjs --layout-id <camelCaseId>',
  );
}

const args = parseArgMap(process.argv.slice(2));
const layoutId = args.get('layout-id');
if (!layoutId) usage();

const paths = getLayoutPaths(String(layoutId));
if (!fs.existsSync(paths.referencePngPath)) {
  throw new Error(`Missing reference PNG: ${paths.referencePngPath}`);
}
if (!fs.existsSync(paths.candidatePreviewPngPath)) {
  throw new Error(`Missing candidate preview PNG: ${paths.candidatePreviewPngPath}`);
}

normalizePng({
  inputPath: paths.candidatePreviewPngPath,
  outputPath: paths.candidatePngPath,
});
const { scorecard } = compareCandidateImages({
  referencePngPath: paths.referencePngPath,
  candidatePngPath: paths.candidatePngPath,
  diffPngPath: paths.diffPngPath,
  diffJsonPath: paths.diffJsonPath,
  scorecardPath: paths.scorecardPath,
});
const source = loadSourceRecord(String(layoutId));
writeSourceRecord(String(layoutId), {
  ...source,
  artifacts: {
    ...(source.artifacts || {}),
    scorecardPath: 'compare/scorecard.json',
  },
});

console.log(`Candidate PNG: ${paths.candidatePngPath}`);
console.log(`Diff PNG: ${paths.diffPngPath}`);
console.log(`Scorecard: ${paths.scorecardPath}`);
console.log(`Diff pass: ${scorecard.pass ? 'yes' : 'no'}`);
