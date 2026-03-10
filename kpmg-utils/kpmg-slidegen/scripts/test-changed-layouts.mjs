import { spawnSync } from 'node:child_process';

import { REPO_ROOT } from './support.mjs';

function changedFiles() {
  const result = spawnSync('git', ['diff', '--name-only', 'HEAD'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) return [];
  return String(result.stdout || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function runNode(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

const changed = changedFiles();
const touchesAuthoring = changed.some((file) => file.startsWith('templates-src/kpmg-diligence/layouts/'));

runNode('scripts/codegen/generate-runtime-aggregates.mjs', ['--check']);

if (touchesAuthoring) {
  runNode('scripts/test-contracts.mjs');
}

console.log('Changed layout lane passed.');
