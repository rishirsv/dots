import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
const exec = promisify(execFile);

test('CLI consultation returns durable advice, reuses live start, and stops', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dots-advisor-cli-'));
  const repo = join(dir, 'repo');
  await mkdir(repo);
  await writeFile(join(repo, 'message.txt'), 'hello from the repo');
  await writeFile(join(dir, 'brief.md'), 'Read message.txt, run printf, and return advice.');
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const env = { ...process.env, DOTS_ADVISOR_STATE_DIR: join(dir, 'state'), COMPLETION_GRACE_MS: '500', MAX_LIFETIME_MS: '20000' };
  const cli = async (...args) => JSON.parse((await exec(process.execPath, ['advisor.js', ...args], { cwd: import.meta.dirname, env, timeout: 15000 })).stdout);
  const args = ['start', '--local', '--repo', repo, '--brief', join(dir, 'brief.md'), '--port', String(port)];
  let started;
  let client;
  try {
    started = await cli(...args);
    assert.equal((await cli(...args)).runId, started.runId);
    client = new Client({ name: 'dots-cli-proof', version: '1' });
    await client.connect(new StreamableHTTPClientTransport(new URL(started.endpoint)));
    const call = async (name, args = {}) => {
      const result = await client.callTool({ name, arguments: { runId: started.runId, ...args } });
      assert.ok(!result.isError, result.content[0].text);
      return result.content[0].text;
    };
    assert.match(await call('consultation'), /Read message.txt/);
    assert.equal(JSON.parse(await call('read_file', { path: 'message.txt' })).text, 'hello from the repo');
    const job = JSON.parse(await call('exec', { key: 'proof', command: ['/usr/bin/printf', 'terminal verified'] }));
    const result = JSON.parse(await call('terminal', { id: job.id, waitMs: 1000 }));
    assert.equal(result.stdout, 'terminal verified');
    await call('finish', { advice: 'Read the repository file and verified terminal execution.' });
    const final = await cli('wait', started.runId, '--timeout', '2');
    assert.equal(final.status, 'complete');
    assert.match(final.advice, /verified terminal/);
    assert.equal(JSON.parse(await readFile(started.resultFile, 'utf8')).advice, final.advice);
    await client.close(); client = null;
    const stopped = await cli('stop', started.runId, '--timeout', '5');
    assert.equal(stopped.running, false);
    assert.equal(stopped.status, 'complete');
  } finally {
    await client?.close();
    if (started) await cli('stop', started.runId, '--timeout', '5').catch(() => {});
    await rm(dir, { recursive: true, force: true });
  }
});

test('CLI reports an immediate service startup failure without waiting for timeout', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dots-advisor-failure-'));
  const brief = join(dir, 'brief.md');
  await writeFile(brief, 'Startup failure probe');
  try {
    await assert.rejects(exec(process.execPath, ['advisor.js', 'start', '--local', '--repo', dir, '--brief', brief], {
      cwd: import.meta.dirname,
      env: { ...process.env, DOTS_ADVISOR_STATE_DIR: join(dir, 'state'), MAX_LIFETIME_MS: 'invalid' },
      timeout: 5000,
    }), error => !error.killed && /Invalid maximum lifetime/.test(error.stderr));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
