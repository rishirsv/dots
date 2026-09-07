#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const appHome = process.env.ORACLE_REPO_MCP_HOME
  ?? path.join(os.homedir(), 'Library', 'Application Support', 'Oracle Repo MCP');
const args = process.argv.slice(2);

if (
  args[0] === 'start'
  && !args.includes('--task-id')
  && process.env.CODEX_THREAD_ID
) {
  args.push('--task-id', process.env.CODEX_THREAD_ID);
}

let installation;
try {
  installation = JSON.parse(
    readFileSync(path.join(appHome, 'installation.json'), 'utf8'),
  );
} catch {
  console.error(
    'Oracle Repo MCP is not installed. Run its scripts/install-local.mjs.',
  );
  process.exit(1);
}

const child = spawn(
  installation.node,
  [path.join(installation.packageRoot, 'dist', 'cli.js'), ...args],
  { stdio: 'inherit' },
);

child.once('error', () => {
  console.error(
    'Oracle Repo MCP installation is unavailable. Re-run its local installer.',
  );
  process.exitCode = 1;
});
child.once('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
