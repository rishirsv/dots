import { classifyCase, normalizeCaseId } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error('Usage: node scripts/onboarding/classify-case.mjs --case-id <kebab-case>');
}

const args = parseArgMap(process.argv.slice(2));
const caseId = normalizeCaseId(args.get('case-id'));
if (!caseId) usage();

const classification = classifyCase({ caseId });
console.log(`Classification: ${classification.recommendedPrimitiveRef || 'none'}`);
console.log(`Candidates: ${classification.candidates.length}`);
