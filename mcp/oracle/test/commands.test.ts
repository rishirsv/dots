import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { CommandPool } from '../src/commands.js';
import { ToolError } from '../src/errors.js';

const pools: CommandPool[] = [];

async function makePool(options?: ConstructorParameters<typeof CommandPool>[1]): Promise<{ pool: CommandPool; root: string }> {
  const root = await mkdtemp(path.join(tmpdir(), 'oracle-command-pool-'));
  const commandPool = new CommandPool(root, options);
  pools.push(commandPool);
  return { pool: commandPool, root };
}

async function eventually(predicate: () => boolean, timeoutMs = 2_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error('Condition was not reached before timeout');
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

afterEach(async () => {
  await Promise.allSettled(pools.splice(0).map((value) => value.close()));
});

describe('CommandPool', () => {
  it('runs pipe commands with the Codex output shape and exit status', async () => {
    const { pool } = await makePool();
    const result = await pool.exec({ cmd: 'printf hello; printf error >&2; exit 7', login: false });

    expect(result.chunk_id).toMatch(/^[0-9a-f]{6}$/);
    expect(result.output).toBe('helloerror');
    expect(result.exit_code).toBe(7);
    expect(result.session_id).toBeUndefined();
  });

  it('supports stdin and drains each output chunk once', async () => {
    const { pool } = await makePool();
    const first = await pool.exec({
      cmd: 'printf ready; IFS= read -r value; printf "received:%s" "$value"',
      login: false,
      yield_time_ms: 250
    });
    expect(first.output).toBe('ready');
    expect(first.session_id).toBeTypeOf('number');

    const final = await pool.write({ session_id: first.session_id!, chars: 'answer\n', yield_time_ms: 2_000 });
    expect(final.output).toBe('received:answer');
    expect(final.output).not.toContain('ready');
    expect(final.exit_code).toBe(0);
  });

  it('uses a real PTY when requested', async () => {
    const { pool } = await makePool();
    const result = await pool.exec({ cmd: 'if test -t 0 && test -t 1; then printf pty; else printf pipe; fi', tty: true });

    expect(result.output).toContain('pty');
    expect(result.exit_code).toBe(0);
  });

  it('retains the head and tail and reports truncation', async () => {
    const { pool } = await makePool();
    const result = await pool.exec({
      cmd: `printf HEAD; /usr/bin/yes x | /usr/bin/head -c 5000; printf TAIL`,
      login: false,
      max_output_tokens: 20
    });

    expect(result.output.startsWith('HEAD')).toBe(true);
    expect(result.output.endsWith('TAIL')).toBe(true);
    expect(result.output).toContain('bytes truncated');
    expect(result.truncated).toBe(true);
    expect(result.original_token_count).toBeGreaterThan(1_000);
  });

  it('keeps an exited session until a later poll collects its output', async () => {
    const { pool } = await makePool();
    const first = await pool.exec({ cmd: 'sleep 0.4; printf late', login: false, yield_time_ms: 250 });
    expect(first.session_id).toBeTypeOf('number');
    await new Promise((resolve) => setTimeout(resolve, 350));

    const final = await pool.write({ session_id: first.session_id!, yield_time_ms: 250 });
    expect(final.output).toBe('late');
    expect(final.exit_code).toBe(0);
  });

  it('cancels the whole process group and returns final output', async () => {
    const { pool, root } = await makePool();
    const pidFile = path.join(root, 'grandchild.pid');
    const first = await pool.exec({
      cmd: `sleep 30 & child=$!; printf '%s' "$child" > grandchild.pid; printf started; wait`,
      login: false,
      yield_time_ms: 250
    });
    expect(first.output).toBe('started');
    const grandchild = Number(await readFile(pidFile, 'utf8'));

    const cancelled = await pool.cancel(first.session_id!);
    expect(cancelled.signal).toBeTruthy();
    expect(cancelled.session_id).toBeUndefined();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(() => process.kill(grandchild, 0)).toThrow();
  });

  it('closes running commands and rejects every later launch', async () => {
    const { pool } = await makePool({ maxProcesses: 2 });
    const pending = pool.exec({ cmd: 'sleep 30', login: false, yield_time_ms: 250 });
    const closing = pool.close();
    await closing;
    const initial = await pending;
    expect(initial.session_id).toBeUndefined();
    expect(initial.signal).toBeTruthy();
    await expect(pool.exec({ cmd: 'true' })).rejects.toMatchObject({ code: 'pool_closed' });
    await expect(pool.runFile('/usr/bin/true', [])).rejects.toMatchObject({ code: 'pool_closed' });
  });

  it('waits for an in-progress timeout termination before close returns', async () => {
    const { pool, root } = await makePool({ maxRuntimeMs: 500 });
    const pidFile = path.join(root, 'timeout-grandchild.pid');
    const initial = await pool.exec({
      cmd: `trap '' TERM; sleep 30 & child=$!; printf '%s' "$child" > timeout-grandchild.pid; printf started; wait`,
      login: false,
      yield_time_ms: 250
    });
    expect(initial.session_id).toBeTypeOf('number');
    const grandchild = Number(await readFile(pidFile, 'utf8'));
    await eventually(() => pool.list().some((item) => item.session_id === initial.session_id && item.state === 'timed_out'));

    await pool.close();
    expect(() => process.kill(grandchild, 0)).toThrow();
  });

  it('bounds runFile output and terminates it at its deadline', async () => {
    const { pool } = await makePool({ maxRuntimeMs: 2_000 });
    const bounded = await pool.runFile('/bin/sh', ['-c', 'printf BEGIN; yes z | head -c 10000; printf END'], { maxBytes: 100 });
    expect(bounded.stdout.startsWith('BEGIN')).toBe(true);
    expect(bounded.stdout.endsWith('END')).toBe(true);
    expect(bounded.truncated).toBe(true);

    const timedOut = await pool.runFile('/bin/sh', ['-c', 'printf waiting; sleep 30'], { timeoutMs: 50 });
    expect(timedOut.stdout).toBe('waiting');
    expect(timedOut.exitCode).toBe(124);
  });

  it('returns a tool error for closed stdin without crashing or losing the live command', async () => {
    const { pool } = await makePool();
    const first = await pool.exec({ cmd: 'exec 0<&-; sleep 2', shell: '/bin/sh', login: false, yield_time_ms: 250 });
    await expect(pool.write({ session_id: first.session_id!, chars: 'probe' })).rejects.toMatchObject({ code: 'write_failed' });
    expect(pool.list().find(item => item.session_id === first.session_id)?.state).toBe('running');
    await pool.cancel(first.session_id!);
    expect((await pool.exec({cmd: 'printf alive', login:false})).output).toBe('alive');
  });

  it('signals cancellation immediately during a long output poll', async () => {
    const { pool } = await makePool();
    const first = await pool.exec({ cmd: 'sleep 30', login:false, yield_time_ms:250 });
    const poll = pool.write({session_id:first.session_id!, yield_time_ms:5000});
    await new Promise(resolve=>setTimeout(resolve,50));
    const start = performance.now();
    await pool.cancel(first.session_id!);
    await poll;
    expect(performance.now()-start).toBeLessThan(2000);
  });

  it('kills a TERM-ignoring descendant after its leader and streams exit', async () => {
    const { pool, root } = await makePool();
    const first = await pool.exec({
      cmd: "sh -c 'trap \"\" TERM; echo $$ > descendant.pid; exec sleep 30' </dev/null >/dev/null 2>&1 & wait",
      shell:'/bin/sh', login:false, yield_time_ms:250
    });
    const pid = Number(await readFile(path.join(root,'descendant.pid'),'utf8'));
    try {
      const result = await pool.cancel(first.session_id!);
      expect(result.session_id).toBeUndefined();
      expect(()=>process.kill(pid,0)).toThrow();
    } finally { try { process.kill(pid,'SIGKILL'); } catch {} }
  });

  it('wakes a long poll when useful output arrives instead of waiting for process exit', async () => {
    const {pool}=await makePool();
    const first=await pool.exec({cmd:'sleep 0.5; printf available; sleep 30',login:false,yield_time_ms:250});
    const began=performance.now();
    const next=await pool.write({session_id:first.session_id!,yield_time_ms:5000});
    expect(next.output).toBe('available');expect(next.session_id).toBe(first.session_id);
    expect(performance.now()-began).toBeLessThan(1500);
    await pool.cancel(first.session_id!);
  });

  it('reserves process capacity for repository inspection when user sessions fill their share', async () => {
    const {pool}=await makePool({maxProcesses:5});
    const first=await pool.exec({cmd:'sleep 30',login:false,yield_time_ms:250});
    await expect(pool.exec({cmd:'sleep 30',login:false,yield_time_ms:250})).rejects.toMatchObject({code:'process_limit'});
    expect((await pool.runFile('/usr/bin/true',[])).exitCode).toBe(0);
    expect(pool.isQuiescent()).toBe(false);
    const quiet=pool.whenQuiescent();await pool.cancel(first.session_id!);await quiet;
    expect(pool.isQuiescent()).toBe(true);
    expect((await pool.exec({cmd:'true',login:false})).exit_code).toBe(0);
  });

  it('rejects canonical working directories outside the root', async () => {
    const { pool } = await makePool();
    await expect(pool.exec({ cmd: 'pwd', workdir: tmpdir() })).rejects.toBeInstanceOf(ToolError);
  });
});
