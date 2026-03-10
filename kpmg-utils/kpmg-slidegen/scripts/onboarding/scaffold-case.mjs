import { normalizeCaseId, scaffoldCase } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/scaffold-case.mjs --case-id <kebab-case> [--primitive-ref <primitive@version>] [--new-primitive-id <id>] [--base-primitive-ref <primitive@version>]',
  );
}

const args = parseArgMap(process.argv.slice(2));
const caseId = normalizeCaseId(args.get('case-id'));
if (!caseId) usage();

const result = scaffoldCase({
  caseId,
  primitiveRef: args.get('primitive-ref') ? String(args.get('primitive-ref')) : null,
  newPrimitiveId: args.get('new-primitive-id') ? String(args.get('new-primitive-id')) : null,
  basePrimitiveRef: args.get('base-primitive-ref') ? String(args.get('base-primitive-ref')) : null,
});

console.log(`Scaffolded with primitive: ${result.primitiveRef}`);
console.log(`Builder mode: ${result.builderMode}`);
