import { normalizeCaseId, renderCase } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/render-candidate.mjs --case-id <kebab-case> [--with-montage]',
  );
}

const args = parseArgMap(process.argv.slice(2));
const caseId = normalizeCaseId(args.get('case-id'));
if (!caseId) usage();

const result = await renderCase({
  caseId,
  withMontage: Boolean(args.get('with-montage')),
});

console.log(`Candidate deck: ${result.paths.candidateDeckPath}`);
console.log(`Candidate QA: ${result.paths.candidateQaPath}`);
console.log(`Preview PNG: ${result.paths.candidatePreviewPngPath}`);
