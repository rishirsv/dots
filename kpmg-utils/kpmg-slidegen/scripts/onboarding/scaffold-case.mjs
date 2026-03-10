import { normalizeCaseId, scaffoldCase } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/scaffold-case.mjs --case-id <kebab-case> [--primitive-ref <primitive@version>] [--new-primitive-id <id>] [--builder-from-family <existingType>]',
  );
}

const args = parseArgMap(process.argv.slice(2));
const caseId = normalizeCaseId(args.get('case-id'));
if (!caseId) usage();

const result = scaffoldCase({
  caseId,
  primitiveRef: args.get('primitive-ref') ? String(args.get('primitive-ref')) : null,
  newPrimitiveId: args.get('new-primitive-id') ? String(args.get('new-primitive-id')) : null,
  builderFromFamily: args.get('builder-from-family') ? String(args.get('builder-from-family')) : null,
});

console.log(`Scaffolded with primitive: ${result.primitiveRef}`);
console.log(`Builder mode: ${result.builderMode}`);
