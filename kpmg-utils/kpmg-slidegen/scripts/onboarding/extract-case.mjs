import fs from 'node:fs';

import { extractCase, normalizeCaseId, normalizeLayoutId } from './case-lib.mjs';
import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/extract-case.mjs --case-id <kebab-case> --layout-id <camelCaseId> --source-pptx <file.pptx> --slide <n> [--force]',
  );
}

const args = parseArgMap(process.argv.slice(2));
const caseId = normalizeCaseId(args.get('case-id'));
const layoutId = normalizeLayoutId(args.get('layout-id'));
const sourcePptxPath = args.get('source-pptx');
const slideNumber = Number(args.get('slide'));

if (!caseId || !layoutId || !sourcePptxPath || !Number.isInteger(slideNumber) || slideNumber < 1) usage();
if (!fs.existsSync(sourcePptxPath)) {
  throw new Error(`Missing source PPTX: ${sourcePptxPath}`);
}

const result = await extractCase({
  caseId,
  layoutId,
  sourcePptxPath: String(sourcePptxPath),
  slideNumber,
  force: Boolean(args.get('force')),
});

console.log(`Initialized onboarding case: ${result.paths.caseRoot}`);
console.log(`Reference PNG: ${result.paths.referencePngPath}`);
console.log(`Intake: ${result.paths.intakePath}`);
