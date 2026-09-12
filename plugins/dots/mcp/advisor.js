#!/usr/bin/env node
import { fork } from 'node:child_process';
import { randomUUID, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, realpath, open } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { serve } from './server.js';
import { startTunnel } from './tunnel.js';

const state = process.env.DOTS_ADVISOR_STATE_DIR || join(process.env.XDG_STATE_HOME || join(homedir(), '.local', 'state'), 'dots-advisor');
const { positionals, values: flags } = parseArgs({ allowPositionals: true, options: {
  repo: { type: 'string' }, brief: { type: 'string' }, access: { type: 'string', default: 'workspace-write' },
  port: { type: 'string' }, local: { type: 'boolean', default: false }, timeout: { type: 'string', default: '60' },
  'tunnel-id': { type: 'string' }, 'key-ref': { type: 'string' }, 'app-url': { type: 'string' },
} });
const [command = 'help', argument] = positionals;
await mkdir(join(state, 'runs'), { recursive: true });
const configPath = join(state, 'config.json');
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
async function optionalJson(path) {
  try { return await readJson(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
async function atomicJson(path, value) {
  const temp = `${path}.${randomUUID()}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temp, path);
}
function number(value, label, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < min || result > max) throw new Error(`Invalid ${label}`);
  return result;
}
async function health(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1000) });
    return response.ok ? await response.json() : null;
  } catch { return null; }
}
async function getRun(id = argument) {
  id ||= (await optionalJson(join(state, 'active.json')))?.id;
  if (!id || !/^[a-f0-9-]{36}$/.test(id)) throw new Error('Specify a consultation ID or start a consultation first.');
  const dir = join(state, 'runs', id);
  return { dir, run: await readJson(join(dir, 'run.json')) };
}
async function status(record) {
  const { run, dir } = record;
  const final = await optionalJson(join(dir, 'final.json'));
  const live = await health(run.port);
  let runtime = await optionalJson(join(dir, 'runtime.json'));
  if (!final && live?.runId !== run.id && ['starting', 'active'].includes(runtime?.status)) {
    runtime = { ...runtime, status: 'interrupted', reason: 'Service is no longer running; this run cannot resume.' };
    await atomicJson(join(dir, 'runtime.json'), runtime);
  }
  return { runId: run.id, repo: run.repo, access: run.access, status: final ? 'complete' : runtime?.status || 'interrupted',
    running: live?.runId === run.id, reason: runtime?.reason, result: final ? join(dir, 'final.json') : null,
    ...(final ? { advice: final.advice } : {}) };
}
function launchInfo(run, dir, config) {
  return { runId: run.id, repo: run.repo, access: run.access, localOnly: run.local,
    appUrl: config?.appUrl || 'https://chatgpt.com/plugins', promptFile: join(dir, 'prompt.txt'),
    resultFile: join(dir, 'final.json'), endpoint: `http://127.0.0.1:${run.port}/mcp` };
}

try {
  if (command === 'configure') {
    const prior = await optionalJson(configPath) || {};
    const config = { ...prior,
      ...(flags['tunnel-id'] ? { tunnelId: flags['tunnel-id'] } : {}),
      ...(flags['key-ref'] ? { keyRef: flags['key-ref'] } : {}),
      ...(flags['app-url'] ? { appUrl: flags['app-url'] } : {}),
    };
    if (!/^tunnel_[a-zA-Z0-9]+$/.test(config.tunnelId || '')) throw new Error('Provide --tunnel-id from OpenAI tunnel settings.');
    if (!/^(env:[A-Za-z_][A-Za-z0-9_]*|file:\/.+)$/.test(config.keyRef || '')) throw new Error('Provide --key-ref env:NAME or file:/absolute/path; never a literal key.');
    if (config.appUrl && new URL(config.appUrl).origin !== 'https://chatgpt.com') throw new Error('App URL must be on chatgpt.com.');
    await atomicJson(configPath, config);
    console.log(JSON.stringify({ configured: true, configPath, tunnelId: config.tunnelId }));
  } else if (command === 'start') {
    if (!flags.repo || !flags.brief) throw new Error('start requires --repo and --brief.');
    if (!['workspace-write', 'read-only'].includes(flags.access)) throw new Error('Access must be workspace-write or read-only.');
    const repo = await realpath(resolve(flags.repo));
    const brief = await readFile(resolve(flags.brief), 'utf8');
    if (!brief.trim()) throw new Error('Brief is empty.');
    const port = number(flags.port || '8765', 'port', 1, 65535);
    const config = await optionalJson(configPath);
    if (!flags.local && !config) throw new Error('Configure the persistent tunnel first; use --local only for local testing.');
    const live = await health(port);
    if (live) {
      const existing = await getRun(live.runId);
      if (live.status === 'active' && existing.run.repo === repo && existing.run.brief === brief && existing.run.access === flags.access && existing.run.local === flags.local) {
        console.log(JSON.stringify(launchInfo(existing.run, existing.dir, config), null, 2));
      } else throw new Error(`Port ${port} already has consultation ${live.runId} (${live.status}); finish or stop it first.`);
    } else {
      const id = randomUUID();
      const dir = join(state, 'runs', id);
      await mkdir(dir);
      const run = { id, repo, brief, access: flags.access, createdAt: new Date().toISOString(), port,
        local: flags.local, controlToken: randomBytes(24).toString('hex') };
      await atomicJson(join(dir, 'run.json'), run);
      await atomicJson(join(dir, 'runtime.json'), { status: 'starting' });
      await writeFile(join(dir, 'prompt.txt'), `Use the Dots Advisor plugin for consultation ${id}. First call consultation with runId "${id}" to read the brief and repository context. Follow the brief, using only this runId for repository and terminal tools. When finished and all commands have completed, call finish with the full advice, findings, validation, and any changes made. Do not just leave the advice in this chat.\n`);
      const log = await open(join(dir, 'service.log'), 'a', 0o600);
      const child = fork(fileURLToPath(import.meta.url), ['serve', dir], { detached: true, stdio: ['ignore', log.fd, log.fd, 'ipc'] });
      const started = new Promise((done, reject) => {
        const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error(`Startup timed out; see ${join(dir, 'service.log')}`)); }, 60000);
        child.once('error', error => { clearTimeout(timer); reject(error); });
        child.once('exit', code => { clearTimeout(timer); reject(new Error(`Startup failed (${code}); see ${join(dir, 'service.log')}`)); });
        child.on('message', message => {
          if (message.ready) { clearTimeout(timer); child.disconnect(); child.unref(); done(); }
          else if (message.error) { clearTimeout(timer); reject(new Error(message.error)); }
        });
      });
      await started.finally(() => log.close());
      await atomicJson(join(state, 'active.json'), { id });
      console.log(JSON.stringify(launchInfo(run, dir, config), null, 2));
    }
  } else if (command === 'serve') {
    const runDir = resolve(argument);
    const run = await readJson(join(runDir, 'run.json'));
    const config = await optionalJson(configPath);
    let tunnel;
    let service;
    const closedBeforeReady = error => { if (service) void service.close(error.message); else process.kill(process.pid, 'SIGTERM'); };
    service = await serve({ runDir, port: run.port,
      idleMs: number(process.env.IDLE_TIMEOUT_MS || '3600000', 'idle timeout'),
      maxMs: number(process.env.MAX_LIFETIME_MS || '82800000', 'maximum lifetime'),
      graceMs: number(process.env.COMPLETION_GRACE_MS || '60000', 'completion grace'),
      onReady: async () => { if (!run.local) tunnel = await startTunnel(config, runDir, run.port, closedBeforeReady); },
      onClose: async () => { await tunnel?.close(); },
    });
    const stop = () => { void service.close(); };
    process.once('SIGTERM', stop);
    process.once('SIGINT', stop);
    if (process.connected) process.send({ ready: true });
    await service.closed;
    process.off('SIGTERM', stop);
    process.off('SIGINT', stop);
  } else if (['status', 'wait', 'result', 'stop'].includes(command)) {
    const record = await getRun();
    if (command === 'stop') {
      const live = await health(record.run.port);
      if (live?.runId === record.run.id) {
        const response = await fetch(`http://127.0.0.1:${record.run.port}/stop`, { method: 'POST', headers: { Authorization: `Bearer ${record.run.controlToken}` } });
        if (!response.ok) throw new Error(`Stop failed (${response.status})`);
      }
    }
    const deadline = Date.now() + number(flags.timeout, 'timeout seconds') * 1000;
    let current = await status(record);
    while ((command === 'wait' && ['active', 'starting'].includes(current.status) || command === 'stop' && current.running) && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 500));
      current = await status(record);
    }
    if (command === 'result') {
      if (current.status !== 'complete') throw new Error(`Advice is not ready (${current.status}).`);
      console.log(current.advice);
    } else console.log(JSON.stringify(current, null, 2));
  } else {
    console.log(`Dots Advisor\n  configure --tunnel-id ID --key-ref file:/path/to/key [--app-url URL]\n  start --repo PATH --brief FILE [--access read-only] [--local]\n  status|wait|result|stop [RUN_ID] [--timeout SECONDS]\n\nState: ${state}\nWeb consultations require the configured Dots Advisor plugin selected in ChatGPT.`);
  }
} catch (error) {
  console.error(error.message);
  if (process.connected) process.send({ error: error.message });
  process.exitCode = 1;
}
