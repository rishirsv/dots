import { createServer, type Server } from 'node:http';
import { chmod, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { Config } from '../src/settings.js';
import { startTunnel, type TunnelHandle, type TunnelStatus } from '../src/tunnel.js';

interface MockOptions {
  healthUrl: string;
  publishHealth?: boolean;
  exitFirstAfterMs?: number;
  exitFirstOnTrigger?: boolean;
}

const homes: string[] = [];
const servers: Server[] = [];
const handles: TunnelHandle[] = [];

afterEach(async () => {
  await Promise.allSettled(handles.splice(0).map((handle) => handle.close()));
  await Promise.allSettled(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
  await Promise.allSettled(homes.splice(0).map((home) => rm(home, { recursive: true, force: true })));
});

async function healthServer(options: { probe?: string; statusAvailable?: boolean } = {}): Promise<{ url: string; server: Server }> {
  const server = createServer((request, response) => {
    if (request.url === '/readyz') {
      response.writeHead(200).end('ok');
      return;
    }
    if (request.url === '/metrics') {
      response.writeHead(200, { 'content-type': 'text/plain' });
      response.end([
        `commands_poll_last_successful_timestamp_seconds ${Date.now() / 1000}`,
        'commands_poll_cycles_total 1',
        'commands_poll_errors_total 0',
        ''
      ].join('\n'));
      return;
    }
    if (request.url === '/api/status') {
      if (options.statusAvailable === false) {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({
        version: 'test',
        channels: [{ name: 'main', probe_status: options.probe ?? 'ok' }],
        tunnel_metadata_error: '',
        uptime_seconds: 1
      }));
      return;
    }
    response.writeHead(404).end();
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });
  servers.push(server);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Health server did not bind to TCP');
  return { url: `http://127.0.0.1:${address.port}`, server };
}

async function mockTunnel(options: MockOptions): Promise<{
  home: string;
  executable: string;
  recordFile: string;
  countFile: string;
  signalFile: string;
  exitFile: string;
}> {
  const home = await mkdtemp(path.join(tmpdir(), 'oracle-tunnel-test-'));
  homes.push(home);
  const executable = path.join(home, 'mock-tunnel.cjs');
  const recordFile = path.join(home, 'launches.ndjson');
  const countFile = path.join(home, 'launch-count');
  const signalFile = path.join(home, 'signals');
  const exitFile = path.join(home, 'exit-first');
  const script = `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
const healthIndex = args.indexOf('--health.url-file');
const healthFile = healthIndex >= 0 ? args[healthIndex + 1] : undefined;
let count = 0;
try { count = Number(fs.readFileSync(${JSON.stringify(countFile)}, 'utf8')) || 0; } catch {}
count += 1;
fs.writeFileSync(${JSON.stringify(countFile)}, String(count));
fs.appendFileSync(${JSON.stringify(recordFile)}, JSON.stringify({
  args,
  key: process.env.CONTROL_PLANE_API_KEY,
  server: process.env.MCP_SERVER_URL,
  headers: process.env.MCP_DISCOVERY_EXTRA_HEADERS
}) + '\\n');
process.on('SIGTERM', () => {
  fs.appendFileSync(${JSON.stringify(signalFile)}, 'SIGTERM\\n');
  process.exit(0);
});
if (${options.publishHealth !== false} && healthFile) fs.writeFileSync(healthFile, ${JSON.stringify(options.healthUrl)} + '\\n');
if (count === 1 && ${options.exitFirstAfterMs ?? 0} > 0) {
  setTimeout(() => process.exit(23), ${options.exitFirstAfterMs ?? 0});
}
if (count === 1 && ${options.exitFirstOnTrigger === true}) {
  const trigger = setInterval(() => {
    if (fs.existsSync(${JSON.stringify(exitFile)})) {
      clearInterval(trigger);
      process.exit(23);
    }
  }, 10);
}
setInterval(() => {}, 1000);
`;
  await writeFile(executable, script, { mode: 0o700 });
  await chmod(executable, 0o700);
  return { home, executable, recordFile, countFile, signalFile, exitFile };
}

function config(executable: string): Config {
  return {
    tunnelId: `tunnel_${'a'.repeat(32)}`,
    tunnelBinary: executable,
    keychainAccount: 'test-runtime'
  };
}

async function eventually(predicate: () => boolean | Promise<boolean>, timeoutMs = 5_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!(await predicate())) {
    if (Date.now() >= deadline) throw new Error('Condition was not reached before timeout');
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
}

async function fileText(file: string): Promise<string> {
  try { return await readFile(file, 'utf8'); } catch { return ''; }
}

describe('tunnel lifecycle', () => {
  it('waits for a fresh poll, reports ready, and closes the process and private temp directory', async () => {
    const health = await healthServer();
    const mock = await mockTunnel({ healthUrl: health.url });
    const statuses: TunnelStatus[] = [];
    const handle = await startTunnel({
      config: config(mock.executable),
      key: 'test-key-not-a-credential',
      localUrl: 'http://127.0.0.1:43210/mcp',
      probeHeaders: { 'x-test-probe': 'probe-value' },
      home: mock.home,
      startupTimeoutMs: 3_000,
      onStatus: (status) => statuses.push(status)
    });
    handles.push(handle);

    expect(handle.status().state).toBe('ready');
    expect(handle.status().last_poll_at).toBeGreaterThan(Date.now() - 2_000);
    expect(statuses.at(-1)?.detail).toBe('Tunnel is polling OpenAI');
    const launch = JSON.parse((await readFile(mock.recordFile, 'utf8')).trim()) as Record<string, unknown>;
    expect(launch.key).toBe('test-key-not-a-credential');
    expect(launch.server).toBe('url=http://127.0.0.1:43210/mcp,channel=main');
    expect(launch.headers).toBe('x-test-probe: probe-value');
    expect(launch.args).not.toContain('test-key-not-a-credential');

    const firstClose = handle.close();
    const secondClose = handle.close();
    expect(secondClose).toBe(firstClose);
    await firstClose;
    expect(handle.status().state).toBe('stopped');
    expect(await fileText(mock.signalFile)).toContain('SIGTERM');
    expect(await readdir(path.join(mock.home, 'tmp'))).toEqual([]);
    await handle.close();
  });

  it('times out startup, terminates the child, and removes its temp state', async () => {
    const health = await healthServer();
    const mock = await mockTunnel({ healthUrl: health.url, publishHealth: false });

    await expect(startTunnel({
      config: config(mock.executable),
      key: 'test-key',
      localUrl: 'http://127.0.0.1:43210/mcp',
      probeHeaders: {},
      home: mock.home,
      startupTimeoutMs: 350
    })).rejects.toMatchObject({ code: 'TUNNEL_NOT_READY' });

    expect(await fileText(mock.signalFile)).toContain('SIGTERM');
    expect(await readdir(path.join(mock.home, 'tmp'))).toEqual([]);
  });

  it.each([
    ['a failing main-channel probe', { probe: 'failed' }],
    ['a missing client status endpoint', { statusAvailable: false }]
  ])('does not report ready with %s', async (_name, healthOptions) => {
    const health = await healthServer(healthOptions);
    const mock = await mockTunnel({ healthUrl: health.url });

    await expect(startTunnel({
      config: config(mock.executable),
      key: 'test-key',
      localUrl: 'http://127.0.0.1:43210/mcp',
      probeHeaders: {},
      home: mock.home,
      startupTimeoutMs: 350
    })).rejects.toMatchObject({ code: 'TUNNEL_NOT_READY' });

    expect(await readdir(path.join(mock.home, 'tmp'))).toEqual([]);
  });

  it('aborts startup promptly and performs the normal close cleanup', async () => {
    const health = await healthServer();
    const mock = await mockTunnel({ healthUrl: health.url, publishHealth: false });
    const controller = new AbortController();
    const started = Date.now();
    const startup = startTunnel({
      config: config(mock.executable),
      key: 'test-key',
      localUrl: 'http://127.0.0.1:43210/mcp',
      probeHeaders: {},
      home: mock.home,
      startupTimeoutMs: 30_000,
      signal: controller.signal
    });
    await eventually(async () => Number(await fileText(mock.countFile)) === 1);
    controller.abort();

    await expect(startup).rejects.toMatchObject({ code: 'ABORTED' });
    expect(Date.now() - started).toBeLessThan(1_000);
    expect(await fileText(mock.signalFile)).toContain('SIGTERM');
    expect(await readdir(path.join(mock.home, 'tmp'))).toEqual([]);
  });

  it('moves offline and relaunches after the ready tunnel process exits', async () => {
    const health = await healthServer();
    const mock = await mockTunnel({ healthUrl: health.url, exitFirstOnTrigger: true });
    const statuses: TunnelStatus[] = [];
    const handle = await startTunnel({
      config: config(mock.executable),
      key: 'test-key',
      localUrl: 'http://127.0.0.1:43210/mcp',
      probeHeaders: {},
      home: mock.home,
      startupTimeoutMs: 3_000,
      onStatus: (status) => statuses.push(status)
    });
    handles.push(handle);

    await writeFile(mock.exitFile, 'exit');
    await eventually(async () => Number(await fileText(mock.countFile)) >= 2);
    await eventually(() => handle.status().state === 'ready');
    expect(statuses.some((status) => status.detail === 'Tunnel stopped; reconnecting')).toBe(true);
    expect(statuses.filter((status) => status.state === 'ready')).toHaveLength(2);
  });
});
