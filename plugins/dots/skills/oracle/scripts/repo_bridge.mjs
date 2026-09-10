#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync, writeSync } from 'node:fs';
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
  if (typeof installation.node !== 'string' || typeof installation.packageRoot !== 'string') throw new Error('Invalid installation');
} catch {
  writeSync(1, JSON.stringify({ok:false,error:{code:'NOT_INSTALLED',message:'Oracle Repo MCP is not installed. Run its scripts/install-local.mjs.'}})+'\n');
  process.exit(1);
}

const child = spawn(
  installation.node,
  [path.join(installation.packageRoot, 'dist', 'cli.js'), ...args],
  { stdio: ['inherit', 'pipe', 'inherit'] },
);

let bytes = 0;
child.stdout.on('data', chunk => { bytes += chunk.length; writeSync(1, chunk); });
const failure = code => writeSync(1, JSON.stringify({ok:false,error:{code,message:'Oracle bridge returned no receipt. Inspect installation and retry status.'}})+'\n');
child.once('error', () => {
  console.error(
    'Oracle Repo MCP installation is unavailable. Re-run its local installer.',
  );
  if (!bytes) { failure('BRIDGE_START_FAILED'); bytes++; }
  process.exitCode = 1;
});
child.once('close', (code, signal) => {
  if (!bytes) failure('EMPTY_BRIDGE_RESPONSE');
  process.exitCode = bytes ? code ?? (signal ? 1 : 0) : 1;
});
