import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/run-layout-onboarding.mjs --case-id <kebab-case> --source-pptx <file.pptx> --slide <n> --layout-id <camelCaseId> [--primitive-ref <primitive@version>] [--with-montage] [--stop-after extract|classify|scaffold|render|compare] [--force]',
  );
}

function runNode(scriptName, passthroughArgs) {
  const scriptPath = path.join(process.cwd(), 'scripts', 'onboarding', scriptName);
  const result = spawnSync(process.execPath, [scriptPath, ...passthroughArgs], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const args = parseArgMap(process.argv.slice(2));
const sourcePptx = args.get('source-pptx');
const slide = args.get('slide');
const layoutId = args.get('layout-id');
const caseId = args.get('case-id');
const stopAfter = args.get('stop-after') ? String(args.get('stop-after')) : 'compare';

if (!sourcePptx || !slide || !layoutId || !caseId) usage();
if (!['extract', 'classify', 'scaffold', 'render', 'compare'].includes(stopAfter)) {
  throw new Error('Expected --stop-after to be one of: extract, classify, scaffold, render, compare');
}

const extractArgs = [
  '--case-id',
  String(caseId),
  '--source-pptx',
  String(sourcePptx),
  '--slide',
  String(slide),
  '--layout-id',
  String(layoutId),
];
if (args.get('force')) extractArgs.push('--force');
runNode('extract-case.mjs', extractArgs);
if (stopAfter === 'extract') process.exit(0);

runNode('classify-case.mjs', ['--case-id', String(caseId)]);
if (stopAfter === 'classify') process.exit(0);

const scaffoldArgs = ['--case-id', String(caseId)];
if (args.get('primitive-ref')) scaffoldArgs.push('--primitive-ref', String(args.get('primitive-ref')));
if (args.get('new-primitive-id')) scaffoldArgs.push('--new-primitive-id', String(args.get('new-primitive-id')));
if (args.get('builder-from-family')) scaffoldArgs.push('--builder-from-family', String(args.get('builder-from-family')));
runNode('scaffold-case.mjs', scaffoldArgs);
if (stopAfter === 'scaffold') process.exit(0);

const renderArgs = ['--case-id', String(caseId)];
if (args.get('with-montage')) renderArgs.push('--with-montage');
runNode('render-candidate.mjs', renderArgs);
if (stopAfter === 'render') process.exit(0);

runNode('compare-candidate.mjs', ['--case-id', String(caseId)]);
