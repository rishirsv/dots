/**
 * Bounded command sessions for the repository MCP.
 *
 * The drain-on-poll and head/tail retention semantics are adapted from OpenAI
 * Codex's unified exec implementation and Chat on Steroids' MIT-licensed
 * TypeScript port. This module is otherwise deliberately local: commands run
 * with the user's normal permissions and no approval or sandbox machinery.
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { chmodSync, existsSync, realpathSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as pty from 'node-pty';
import type { IPty } from 'node-pty';
import { DiagnosticReader, type CommandDiagnostic } from './diagnostics.js';
import { ToolError } from './errors.js';

export interface ExecInput {
  cmd: string;
  workdir?: string;
  shell?: string;
  login?: boolean;
  tty?: boolean;
  yield_time_ms?: number;
  max_output_tokens?: number;
}

export interface StdinInput {
  session_id: number;
  chars?: string;
  yield_time_ms?: number;
  max_output_tokens?: number;
}

export type ExecOutput = {
  chunk_id: string;
  wall_time_seconds: number;
  output: string;
  session_id?: number;
  exit_code?: number;
  signal?: string;
  original_token_count?: number;
  truncated?: boolean;
  queue_time_seconds?: number;
  diagnostics?: CommandDiagnostic[];
};

interface PoolOptions {
  maxProcesses?: number;
  maxRuntimeMs?: number;
}

interface RunFileOptions {
  cwd?: string;
  timeoutMs?: number;
  maxBytes?: number;
}

interface DrainedOutput {
  bytes: Buffer;
  totalBytes: number;
  truncated: boolean;
}

interface Session {
  id: number;
  pid: number | null;
  child: ChildProcess | null;
  pty: IPty | null;
  buffer: HeadTailBuffer;
  state: 'running' | 'exited' | 'cancelled' | 'timed_out' | 'failed';
  exitCode?: number;
  signal?: string;
  error?: string;
  timer: NodeJS.Timeout | null;
  exited: Promise<void>;
  resolveExited: () => void;
  interaction: Promise<void>;
  termination: Promise<void> | null;
  settled: boolean;
  processExited: boolean;
  stdinError?: string;
  outputChanged: { promise: Promise<void>; resolve: () => void };
  internal: boolean;
  diagnostics: DiagnosticReader;
}

const DEFAULT_MAX_PROCESSES = 16;
const DEFAULT_MAX_RUNTIME_MS = 30 * 60_000;
const DEFAULT_EXEC_YIELD_MS = 10_000;
const DEFAULT_WRITE_YIELD_MS = 250;
const DEFAULT_EMPTY_POLL_YIELD_MS = 5_000;
const MIN_YIELD_MS = 250;
const MAX_YIELD_MS = 30_000;
const DEFAULT_OUTPUT_TOKENS = 10_000;
const RETAINED_OUTPUT_BYTES = 1024 * 1024;
const DEFAULT_RUN_FILE_BYTES = 1024 * 1024;
const TERMINATE_GRACE_MS = 750;

const SECRET_ENV_KEYS = new Set([
  'CONTROL_PLANE_API_KEY',
  'OPENAI_API_KEY',
  'OPENAI_ADMIN_KEY',
  'CLOUDFLARED_TOKEN',
  'CLOUDFLARED_TUNNEL_TOKEN',
  'MCP_CONNECTOR_TOKEN',
  'MCP_CONNECTOR_SECRET',
  'ORACLE_REPO_TUNNEL_TOKEN'
]);

class HeadTailBuffer {
  private readonly headLimit: number;
  private readonly tailLimit: number;
  private head = Buffer.alloc(0);
  private tail = Buffer.alloc(0);
  private omitted = 0;

  constructor(private readonly limit: number) {
    this.headLimit = Math.floor(limit / 2);
    this.tailLimit = limit - this.headLimit;
  }

  get hasData(): boolean { return this.head.length + this.tail.length > 0; }

  push(value: Buffer): void {
    if (value.length === 0) return;
    const headSpace = this.headLimit - this.head.length;
    const headBytes = Math.max(0, Math.min(headSpace, value.length));
    if (headBytes > 0) this.head = Buffer.concat([this.head, value.subarray(0, headBytes)]);
    const rest = value.subarray(headBytes);
    if (rest.length === 0) return;
    const combined = Buffer.concat([this.tail, rest]);
    if (combined.length <= this.tailLimit) {
      this.tail = combined;
      return;
    }
    const dropped = combined.length - this.tailLimit;
    this.omitted += dropped;
    this.tail = combined.subarray(dropped);
  }

  drain(): DrainedOutput {
    const totalBytes = this.head.length + this.tail.length + this.omitted;
    let bytes: Buffer;
    if (this.omitted > 0) {
      const marker = Buffer.from(`\n... ${this.omitted} bytes omitted ...\n`, 'utf8');
      bytes = Buffer.concat([this.head, marker, this.tail]);
    } else {
      bytes = Buffer.concat([this.head, this.tail]);
    }
    const truncated = this.omitted > 0;
    this.head = Buffer.alloc(0);
    this.tail = Buffer.alloc(0);
    this.omitted = 0;
    return { bytes, totalBytes, truncated };
  }
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve = (): void => {};
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

function chunkId(): string {
  return randomBytes(3).toString('hex');
}

function integer(value: number | undefined, fallback: number, name: string, minimum: number, maximum: number): number {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new ToolError('invalid_argument', `${name} must be an integer from ${minimum} to ${maximum}`);
  }
  return value;
}

function yieldMs(value: number | undefined, fallback: number, maximum = MAX_YIELD_MS): number {
  if (value === undefined) return fallback;
  if (!Number.isFinite(value) || value < 0) throw new ToolError('invalid_argument', 'yield_time_ms must be non-negative');
  return Math.min(maximum, Math.max(MIN_YIELD_MS, Math.floor(value)));
}

function childEnvironment(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of Object.keys(env)) {
    if (SECRET_ENV_KEYS.has(key.toUpperCase())) delete env[key];
  }
  Object.assign(env, {
    NO_COLOR: '1',
    TERM: 'dumb',
    LANG: 'en_US.UTF-8',
    LC_CTYPE: 'en_US.UTF-8',
    LC_ALL: 'en_US.UTF-8',
    COLORTERM: '',
    PAGER: 'cat',
    GIT_PAGER: 'cat',
    GH_PAGER: 'cat',
    CODEX_CI: '1'
  });
  return env;
}

function stringEnvironment(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(childEnvironment())) {
    if (value !== undefined) result[key] = value;
  }
  return result;
}

function ensurePtyHelperExecutable(): void {
  if (process.platform !== 'darwin') return;
  const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.resolve('node-pty'))));
  for (const helper of [
    path.join(packageRoot, 'prebuilds', `darwin-${process.arch}`, 'spawn-helper'),
    path.join(packageRoot, 'build', 'Release', 'spawn-helper')
  ]) {
    if (!existsSync(helper)) continue;
    const mode = statSync(helper).mode;
    if ((mode & 0o111) === 0) chmodSync(helper, mode | 0o755);
    return;
  }
}

function waitFor(promise: Promise<void>, milliseconds: number): Promise<void> {
  if (milliseconds <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    promise.then(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}

function safeUtf8Slice(bytes: Buffer, start: number, end: number): string {
  return bytes.subarray(start, end).toString('utf8').replace(/^\uFFFD|\uFFFD$/g, '');
}

function capOutput(drained: DrainedOutput, maxTokens: number): {
  output: string;
  originalTokens?: number;
  truncated: boolean;
} {
  const maxBytes = maxTokens * 4;
  if (drained.bytes.length <= maxBytes && !drained.truncated) {
    return { output: drained.bytes.toString('utf8'), truncated: false };
  }
  const originalTokens = Math.ceil(drained.totalBytes / 4);
  if (drained.bytes.length <= maxBytes) {
    return { output: drained.bytes.toString('utf8'), originalTokens, truncated: true };
  }
  const left = Math.floor(maxBytes / 2);
  const right = maxBytes - left;
  const removed = Math.max(0, drained.totalBytes - maxBytes);
  const output = `${safeUtf8Slice(drained.bytes, 0, left)}\n... ${removed} bytes truncated ...\n${safeUtf8Slice(drained.bytes, drained.bytes.length - right, drained.bytes.length)}`;
  return { output, originalTokens, truncated: true };
}

export class CommandPool {
  private readonly root: string;
  private readonly maxProcesses: number;
  private readonly maxRuntimeMs: number;
  private readonly sessions = new Map<number, Session>();
  private readonly reservations = new Set<Promise<void>>();
  private nextSessionId = 1000;
  private closing = false;
  private closed = false;
  private closePromise: Promise<void> | null = null;
  private readonly stateListeners = new Set<() => void>();

  constructor(root: string, options: PoolOptions = {}) {
    try {
      this.root = realpathSync(root);
    } catch {
      throw new ToolError('invalid_root', `Repository root does not exist: ${root}`);
    }
    this.maxProcesses = integer(options.maxProcesses, DEFAULT_MAX_PROCESSES, 'maxProcesses', 1, 256);
    this.maxRuntimeMs = integer(options.maxRuntimeMs, DEFAULT_MAX_RUNTIME_MS, 'maxRuntimeMs', 1, 24 * 60 * 60_000);
  }

  async exec(input: ExecInput): Promise<ExecOutput> {
    if (!input || typeof input.cmd !== 'string' || input.cmd.length === 0) {
      throw new ToolError('invalid_argument', 'cmd must be a non-empty string');
    }
    const maxTokens = integer(input.max_output_tokens, DEFAULT_OUTPUT_TOKENS, 'max_output_tokens', 0, 262_144);
    const waitMs = yieldMs(input.yield_time_ms, DEFAULT_EXEC_YIELD_MS);
    const cwd = this.resolveCwd(input.workdir);
    const shell = input.shell ?? '/bin/zsh';
    const login = input.login ?? true;
    const usePty = input.tty ?? false;

    const releaseReservation = this.reserve();
    let session: Session | null = null;
    try {
      session = this.createSession();
      this.spawnSession(session, shell, login ? ['-lc', input.cmd] : ['-c', input.cmd], cwd, usePty);
      this.sessions.set(session.id, session);
    } catch (error) {
      if (session) this.finishSession(session, 'failed', undefined, undefined, error instanceof Error ? error.message : String(error));
      throw error instanceof ToolError
        ? error
        : new ToolError('spawn_failed', `Failed to start command: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      releaseReservation();
    }

    const started = performance.now();
    await this.waitForOutput(session, waitMs);
    const result = this.result(session, started, maxTokens);
    if (session.settled) this.sessions.delete(session.id);
    return result;
  }

  async write(input: StdinInput): Promise<ExecOutput> {
    const session = this.getSession(input.session_id);
    const chars = input.chars ?? '';
    if (typeof chars !== 'string') throw new ToolError('invalid_argument', 'chars must be a string');
    const maxTokens = integer(input.max_output_tokens, DEFAULT_OUTPUT_TOKENS, 'max_output_tokens', 0, 262_144);
    const waitMs = yieldMs(
      input.yield_time_ms,
      chars === '' ? DEFAULT_EMPTY_POLL_YIELD_MS : DEFAULT_WRITE_YIELD_MS,
      chars === '' ? 300_000 : MAX_YIELD_MS
    );
    return this.serialized(session, async () => {
      const started = performance.now();
      if (chars !== '') await this.writeSession(session, chars);
      if (!session.settled) await this.waitForOutput(session, waitMs);
      const result = this.result(session, started, maxTokens);
      if (session.settled) this.sessions.delete(session.id);
      return result;
    });
  }

  async cancel(sessionId: number): Promise<ExecOutput> {
    const session = this.getSession(sessionId);
    // Signal immediately, even when output collection is waiting in a long poll.
    if (session.state === 'running') session.state = 'cancelled';
    const termination = this.terminate(session);
    return this.serialized(session, async () => {
      const started = performance.now();
      await termination;
      const result = this.result(session, started, DEFAULT_OUTPUT_TOKENS);
      this.sessions.delete(session.id);
      return result;
    });
  }

  close(): Promise<void> {
    if (this.closePromise) return this.closePromise;
    this.closing = true;
    this.closePromise = (async () => {
      await Promise.allSettled([...this.reservations]);
      const unsettled = [...this.sessions.values()].filter((session) => !session.settled);
      await Promise.allSettled(unsettled.map(async (session) => {
        if (session.state === 'running') session.state = 'cancelled';
        await this.terminate(session);
      }));
      this.closed = true;
    })();
    return this.closePromise;
  }

  list(): { session_id: number; pid: number | null; state: string; settled: boolean }[] {
    return [...this.sessions.values()].map((session) => ({
      session_id: session.id,
      pid: session.pid,
      state: session.state,
      settled: session.settled
    }));
  }

  onStateChange(listener: () => void): void { this.stateListeners.add(listener); }

  isQuiescent(): boolean {
    return this.reservations.size === 0 && [...this.sessions.values()].every(session => session.settled);
  }

  /** Wait for real process groups without closing the pool or killing work. */
  whenQuiescent(): Promise<void> {
    if (this.isQuiescent()) return Promise.resolve();
    return new Promise(resolve => {
      const check = () => {
        if (!this.isQuiescent()) return;
        this.stateListeners.delete(check); resolve();
      };
      this.stateListeners.add(check);
    });
  }

  async runFile(file: string, args: readonly string[], options: RunFileOptions = {}): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
    truncated: boolean;
  }> {
    if (typeof file !== 'string' || file.length === 0 || !Array.isArray(args) || args.some((arg) => typeof arg !== 'string')) {
      throw new ToolError('invalid_argument', 'runFile requires an executable and string arguments');
    }
    const cwd = this.resolveCwd(options.cwd);
    const timeoutMs = integer(options.timeoutMs, this.maxRuntimeMs, 'timeoutMs', 1, this.maxRuntimeMs);
    const maxBytes = integer(options.maxBytes, DEFAULT_RUN_FILE_BYTES, 'maxBytes', 1, 16 * 1024 * 1024);
    const releaseReservation = this.reserve(true);
    const session = this.createSession(true);
    const stdout = new HeadTailBuffer(maxBytes);
    const stderr = new HeadTailBuffer(maxBytes);
    try {
      const child = spawn(file, [...args], {
        cwd,
        env: childEnvironment(),
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      session.child = child;
      session.pid = child.pid ?? null;
      child.stdout?.on('data', (data: Buffer) => stdout.push(data));
      child.stderr?.on('data', (data: Buffer) => stderr.push(data));
      this.attachChildLifecycle(session, child);
      session.timer = setTimeout(() => {
        if (session.state !== 'running') return;
        session.state = 'timed_out';
        void this.terminate(session);
      }, timeoutMs);
      this.sessions.set(session.id, session);
    } catch (error) {
      this.finishSession(session, 'failed', undefined, undefined, error instanceof Error ? error.message : String(error));
      throw new ToolError('spawn_failed', `Failed to start ${file}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      releaseReservation();
    }

    await session.exited;
    const out = stdout.drain();
    const err = stderr.drain();
    this.sessions.delete(session.id);
    if (session.error) throw new ToolError('process_failed', session.error);
    return {
      stdout: out.bytes.toString('utf8'),
      stderr: err.bytes.toString('utf8'),
      exitCode: session.exitCode ?? (session.state === 'timed_out' ? 124 : 1),
      truncated: out.truncated || err.truncated
    };
  }

  private reserve(internal = false): () => void {
    if (this.closing || this.closed) throw new ToolError('pool_closed', 'Command pool is closed');
    if (this.sessions.size + this.reservations.size >= this.maxProcesses) {
      throw new ToolError('process_limit', `At most ${this.maxProcesses} command sessions may be retained at once`);
    }
    const userLimit = Math.max(1, this.maxProcesses - 4);
    if (!internal && [...this.sessions.values()].filter(session => !session.internal).length >= userLimit) {
      throw new ToolError('process_limit', `At most ${userLimit} user command sessions may be retained; collect completed output to free a session.`);
    }
    const launch = deferred();
    this.reservations.add(launch.promise);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.reservations.delete(launch.promise);
      launch.resolve();
      for (const listener of this.stateListeners) listener();
    };
  }

  private createSession(internal = false): Session {
    const done = deferred();
    return {
      id: this.nextSessionId++,
      pid: null,
      child: null,
      pty: null,
      buffer: new HeadTailBuffer(RETAINED_OUTPUT_BYTES),
      state: 'running',
      timer: null,
      exited: done.promise,
      resolveExited: done.resolve,
      interaction: Promise.resolve(),
      termination: null,
      settled: false,
      processExited: false,
      outputChanged: deferred(),
      diagnostics: new DiagnosticReader(),
      internal
    };
  }

  private spawnSession(session: Session, shell: string, args: string[], cwd: string, usePty: boolean): void {
    if (usePty) {
      ensurePtyHelperExecutable();
      const terminal = pty.spawn(shell, args, {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        cwd,
        env: stringEnvironment()
      });
      session.pty = terminal;
      session.pid = terminal.pid;
      terminal.onData((data) => this.pushOutput(session, Buffer.from(data, 'utf8')));
      terminal.onExit(({ exitCode, signal }) => {
        this.processExited(session, exitCode, signal ? String(signal) : undefined);
      });
    } else {
      const child = spawn(shell, args, {
        cwd,
        env: childEnvironment(),
        detached: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      session.child = child;
      session.pid = child.pid ?? null;
      child.stdin?.on('error', (error) => { session.stdinError = error.message; });
      child.stdout?.on('data', (data: Buffer) => this.pushOutput(session, data));
      child.stderr?.on('data', (data: Buffer) => this.pushOutput(session, data));
      this.attachChildLifecycle(session, child);
    }
    session.timer = setTimeout(() => {
      if (session.state !== 'running') return;
      session.state = 'timed_out';
      this.pushOutput(session, Buffer.from(`\nCommand timed out after ${this.maxRuntimeMs}ms\n`, 'utf8'));
      void this.terminate(session);
    }, this.maxRuntimeMs);
  }

  private attachChildLifecycle(session: Session, child: ChildProcess): void {
    child.once('error', (error) => {
      session.error = error.message;
      session.state = 'failed';
      if (!child.pid) this.processExited(session);
    });
    child.once('close', (code, signal) => {
      this.processExited(session, code ?? undefined, signal ?? undefined);
    });
  }

  private processExited(session: Session, exitCode?: number, signal?: string): void {
    session.processExited = true;
    session.exitCode = exitCode;
    session.signal = signal;
    if (session.state === 'running') session.state = 'exited';
    if (this.groupAlive(session)) void this.terminate(session);
    else this.finishSession(session, session.state, exitCode, signal, session.error);
  }

  private groupAlive(session: Session): boolean {
    if (session.pid === null) return false;
    try { process.kill(-session.pid, 0); return true; }
    catch (error) { return (error as NodeJS.ErrnoException).code !== 'ESRCH'; }
  }

  private finishSession(session: Session, state: Session['state'], exitCode?: number, signal?: string, error?: string): void {
    if (session.settled) return;
    session.settled = true;
    session.state = state;
    session.exitCode = exitCode;
    session.signal = signal;
    session.error = error;
    if (session.timer) clearTimeout(session.timer);
    session.timer = null;
    session.resolveExited();
    for (const listener of this.stateListeners) listener();
  }

  private terminate(session: Session): Promise<void> {
    if (session.settled) return Promise.resolve();
    if (session.termination) return session.termination;
    // Publish the shared operation before its first await. A simultaneous close,
    // cancel, or timeout then joins the same TERM/KILL sequence.
    session.termination = this.terminateOnce(session);
    return session.termination;
  }

  private async terminateOnce(session: Session): Promise<void> {
    this.signalGroup(session, 'SIGTERM');
    const deadline = performance.now() + TERMINATE_GRACE_MS;
    while (this.groupAlive(session) && performance.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    if (this.groupAlive(session)) this.signalGroup(session, 'SIGKILL');
    // Never turn a timeout into fictitious cleanup. Keep shutdown draining until
    // both the owned group and the child's streams have actually finished.
    while (this.groupAlive(session) || !session.processExited) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    this.finishSession(session, session.state, session.exitCode, session.signal, session.error);
  }

  private signalGroup(session: Session, signal: NodeJS.Signals): void {
    if (session.pid !== null) {
      try { process.kill(-session.pid, signal); return; } catch { /* fall through */ }
    }
    try {
      if (session.pty) session.pty.kill(signal);
      else session.child?.kill(signal);
    } catch { /* process has already exited */ }
  }

  private async writeSession(session: Session, chars: string): Promise<void> {
    if (session.state !== 'running') throw new ToolError('stdin_closed', `Session ${session.id} is no longer running`);
    if (session.stdinError) throw new ToolError('stdin_closed', `stdin is closed for session ${session.id}`);
    try {
      if (session.pty) session.pty.write(chars);
      else if (session.child?.stdin?.writable) {
        const stdin = session.child.stdin;
        await new Promise<void>((resolve, reject) => {
          stdin.write(chars, (error) => error ? reject(error) : resolve());
        });
      }
      else throw new ToolError('stdin_closed', `stdin is closed for session ${session.id}`);
    } catch (error) {
      if (error instanceof ToolError) throw error;
      throw new ToolError('write_failed', `Failed to write to session ${session.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private result(session: Session, started: number, maxTokens: number): ExecOutput {
    const drained = session.buffer.drain();
    if (session.error) drained.bytes = Buffer.concat([drained.bytes, Buffer.from(`\nProcess failed: ${session.error}\n`, 'utf8')]);
    const capped = capOutput(drained, maxTokens);
    const result: ExecOutput = {
      chunk_id: chunkId(),
      wall_time_seconds: Math.max(0, performance.now() - started) / 1000,
      output: capped.output
    };
    if (!session.settled) result.session_id = session.id;
    else {
      if (session.exitCode !== undefined) result.exit_code = session.exitCode;
      if (session.signal !== undefined) result.signal = session.signal;
    }
    if (session.diagnostics.entries.length) result.diagnostics = structuredClone(session.diagnostics.entries);
    if (capped.originalTokens !== undefined) result.original_token_count = capped.originalTokens;
    if (capped.truncated) result.truncated = true;
    return result;
  }

  private serialized<T extends ExecOutput>(session: Session, operation: () => Promise<T>): Promise<T> {
    const enqueued = performance.now();
    const collect = async () => {
      const queueSeconds = (performance.now() - enqueued) / 1000;
      const result = await operation();
      return { ...result, queue_time_seconds: queueSeconds };
    };
    const run = session.interaction.then(collect, collect);
    session.interaction = run.then(() => undefined, () => undefined);
    return run;
  }

  private pushOutput(session: Session, bytes: Buffer): void {
    session.buffer.push(bytes);
    session.diagnostics.push(bytes);
    const previous = session.outputChanged;
    session.outputChanged = deferred();
    previous.resolve();
  }

  private async waitForOutput(session: Session, maximumMs: number): Promise<void> {
    const deadline = performance.now() + maximumMs;
    if (!session.settled && !session.buffer.hasData) {
      await waitFor(Promise.race([session.outputChanged.promise, session.exited]), maximumMs);
    }
    if (!session.settled && session.buffer.hasData) {
      // Coalesce a short burst without waiting out the caller's entire poll window.
      await waitFor(session.exited, Math.min(30, Math.max(0, deadline - performance.now())));
    }
  }

  private getSession(id: number): Session {
    if (!Number.isSafeInteger(id)) throw new ToolError('invalid_argument', 'session_id must be an integer');
    const session = this.sessions.get(id);
    if (!session) throw new ToolError('unknown_session', `Unknown session id ${id}`);
    return session;
  }

  private resolveCwd(value: string | undefined): string {
    if (value !== undefined && typeof value !== 'string') throw new ToolError('invalid_argument', 'workdir must be a string');
    const candidate = value === undefined ? this.root : path.resolve(this.root, value);
    let canonical: string;
    try {
      canonical = realpathSync(candidate);
    } catch {
      throw new ToolError('invalid_workdir', `Working directory does not exist: ${value ?? this.root}`);
    }
    const relative = path.relative(this.root, canonical);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      throw new ToolError('path_outside_root', 'Working directory must be inside the repository root');
    }
    return canonical;
  }
}
