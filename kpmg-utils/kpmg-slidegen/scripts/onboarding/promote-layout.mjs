import { normalizeCaseId, promoteCase } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/promote-layout.mjs --case-id <kebab-case> --approved-by <name> [--approval-notes <text>]',
  );
}

const args = parseArgMap(process.argv.slice(2));
const caseId = normalizeCaseId(args.get('case-id'));
const approvedBy = args.get('approved-by') ? String(args.get('approved-by')) : null;
const approvalNotes = args.get('approval-notes')
  ? String(args.get('approval-notes'))
  : null;

if (!caseId || !approvedBy) usage();

promoteCase({
  caseId,
  approvedBy,
  approvalNotes,
});

console.log(`Promoted onboarding case: ${caseId}`);
