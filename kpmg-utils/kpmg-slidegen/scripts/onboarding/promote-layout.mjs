import { normalizeCaseId, promoteCase } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function collectArgValues(argv, key) {
  const values = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== `--${key}`) continue;
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) values.push(String(next));
  }
  return values;
}

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/promote-layout.mjs --case-id <kebab-case> --approved-by <name> [--approval-notes <text>] [--manual-disposition <accepted|rejected|needs-follow-up|unreviewed>] [--approved-exception <text> ...]',
  );
}

const argv = process.argv.slice(2);
const args = parseArgMap(argv);
const caseId = normalizeCaseId(args.get('case-id'));
const approvedBy = args.get('approved-by') ? String(args.get('approved-by')) : null;
const approvalNotes = args.get('approval-notes')
  ? String(args.get('approval-notes'))
  : null;
const manualDisposition = args.get('manual-disposition')
  ? String(args.get('manual-disposition'))
  : null;
const approvedExceptions = collectArgValues(argv, 'approved-exception');

if (!caseId || !approvedBy) usage();

promoteCase({
  caseId,
  approvedBy,
  approvalNotes,
  manualDisposition,
  approvedExceptions,
});

console.log(`Promoted onboarding case: ${caseId}`);
