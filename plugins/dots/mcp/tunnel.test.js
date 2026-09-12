import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fork } from 'node:child_process';

// Exercise process ownership without a real tunnel or credentials.
test('tunnel guardian reaps its child when the service crashes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dots-tunnel-test-'));
  await writeFile(join(dir, 'tunnel-client'), `#!/usr/bin/env node
const fs = require('node:fs');
const http = require('node:http');
fs.writeFileSync(process.env.TEST_PID_FILE, String(process.pid));
const server = http.createServer((req,res) => res.end('ready'));
server.listen(0,'127.0.0.1',()=>fs.writeFileSync(process.argv[process.argv.indexOf('--health.url-file')+1], 'http://127.0.0.1:'+server.address().port));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
`, { mode: 0o755 });
  await writeFile(join(dir, 'service.mjs'), `import { startTunnel } from ${JSON.stringify(new URL('./tunnel.js', import.meta.url).href)};
await startTunnel({tunnelId:'test',keyRef:'env:TEST'}, ${JSON.stringify(dir)}, 1234, ()=>{});
process.send({ready:true});
`);
  const parent = fork(join(dir, 'service.mjs'), { env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, TEST_PID_FILE: join(dir, 'pid') }, stdio: ['ignore','ignore','inherit','ipc'] });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('guardian never ready')), 5000);
      parent.once('message', () => { clearTimeout(timer); resolve(); });
      parent.once('exit', code => { clearTimeout(timer); reject(new Error(`parent exited ${code}`)); });
    });
    const pid = Number(await readFile(join(dir, 'pid'), 'utf8'));
    parent.kill('SIGKILL');
    let alive = true;
    for (let attempt = 0; attempt < 50; attempt++) {
      try { process.kill(pid, 0); } catch (error) { if (error.code === 'ESRCH') { alive = false; break; } throw error; }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.equal(alive, false, 'tunnel survived service crash');
  } finally {
    parent.kill('SIGKILL');
    await rm(dir, { recursive: true, force: true });
  }
});

import { startTunnel } from './tunnel.js';

test('missing tunnel executable reports its startup error', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dots-tunnel-missing-'));
  const priorPath = process.env.PATH;
  try {
    process.env.PATH = dir;
    await assert.rejects(startTunnel({ tunnelId: 'test', keyRef: 'env:TEST' }, dir, 1234, () => {}), /ENOENT/);
  } finally {
    process.env.PATH = priorPath;
    await rm(dir, { recursive: true, force: true });
  }
});

test('closing a signal-exited guardian completes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dots-tunnel-signal-'));
  const priorPath = process.env.PATH;
  await writeFile(join(dir, 'tunnel-client'), `#!${process.execPath}
const fs = require('node:fs');
const http = require('node:http');
const server = http.createServer((req,res) => res.end('ready'));
server.listen(0,'127.0.0.1',()=>fs.writeFileSync(process.argv[process.argv.indexOf('--health.url-file')+1], 'http://127.0.0.1:'+server.address().port));
setTimeout(()=>{process.kill(process.ppid,'SIGKILL');server.close(()=>process.exit(0));},1000);
`, { mode: 0o755 });
  let timer;
  try {
    process.env.PATH = dir;
    let failed;
    const failure = new Promise(resolve => { failed = resolve; });
    const tunnel = await startTunnel({ tunnelId: 'test', keyRef: 'env:TEST' }, dir, 1234, failed);
    await failure;
    await Promise.race([tunnel.close(), new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('close hung after signal exit')), 2000);
    })]);
  } finally {
    clearTimeout(timer);
    process.env.PATH = priorPath;
    await rm(dir, { recursive: true, force: true });
  }
});
