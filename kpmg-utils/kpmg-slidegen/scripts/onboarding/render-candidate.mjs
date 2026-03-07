import { parseArgMap, renderCandidate } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/render-candidate.mjs --layout-id <camelCaseId> [--with-montage]',
  );
}

const args = parseArgMap(process.argv.slice(2));
const layoutId = args.get('layout-id');
if (!layoutId) usage();

const result = await renderCandidate({
  layoutId: String(layoutId),
  withMontage: Boolean(args.get('with-montage')),
});

console.log(`Candidate deck: ${result.paths.candidateDeckPath}`);
console.log(`Candidate QA: ${result.paths.candidateQaPath}`);
console.log(`Preview PNG: ${result.paths.candidatePreviewPngPath}`);
