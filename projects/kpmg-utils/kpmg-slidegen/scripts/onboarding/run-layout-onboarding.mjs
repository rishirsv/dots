import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { parseArgMap } from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/run-layout-onboarding.mjs --source-pptx <file.pptx> --slide <n> --layout-id <camelCaseId> [--family <existingType>] [--extract-seed] [--with-montage] [--stop-after init|render|compare] [--force]',
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
const stopAfter = args.get('stop-after') ? String(args.get('stop-after')) : 'compare';

if (!sourcePptx || !slide || !layoutId) usage();
if (!['init', 'render', 'compare'].includes(stopAfter)) {
  throw new Error('Expected --stop-after to be one of: init, render, compare');
}

const initArgs = [
  '--source-pptx',
  String(sourcePptx),
  '--slide',
  String(slide),
  '--layout-id',
  String(layoutId),
];
if (args.get('family')) initArgs.push('--family', String(args.get('family')));
if (args.get('extract-seed')) initArgs.push('--extract-seed');
if (args.get('force')) initArgs.push('--force');
runNode('init-layout.mjs', initArgs);
if (stopAfter === 'init') process.exit(0);

const renderArgs = ['--layout-id', String(layoutId)];
if (args.get('with-montage')) renderArgs.push('--with-montage');
runNode('render-candidate.mjs', renderArgs);
if (stopAfter === 'render') process.exit(0);

runNode('compare-candidate.mjs', ['--layout-id', String(layoutId)]);
