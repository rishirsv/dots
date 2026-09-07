import http from 'node:http';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { randomBytes, createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { CommandPool } from './commands.js';
import { Repository } from './repo.js';
import { ToolError } from './errors.js';
import { constantEqual, createTools, openMcpEndpoint, toolFailure, type ToolDefinition, type ToolReply, type Endpoint } from './mcp.js';
import { APP_HOME, CONTROL_PORT, readConfig, keychain, writePrivateJson } from './settings.js';
import { Consultation, Events, conversationUrl } from './consultation.js';
export { conversationUrl } from './consultation.js';
import { startTunnel, type TunnelHandle } from './tunnel.js';

const execFileAsync = promisify(execFile);
export async function canonicalRepository(candidate: string): Promise<string> {
  const dir = await fs.realpath(path.resolve(candidate));
  const result = await execFileAsync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { maxBuffer: 65536 });
  return fs.realpath(result.stdout.trim());
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}
export type ReceiptReference = { tool: string; request_id: string };
type Receipt = { digest: string; reply?: Promise<ToolReply>; size: number; settled: boolean; retired: boolean; critical: boolean; created_at: number; settled_at?: number; acknowledged_at?: number; outcome?: string };
/** Reply payloads can be acknowledged; retired IDs never become executable again. */
export class ReceiptLedger {
  private retainedBytes = 0;
  private reservedBytes = 0;
  private entries = new Map<string, Receipt>();
  constructor(private capacity = 512, private byteCapacity = 32 * 1024 * 1024, private idCapacity = 16_384) {}

  run(tool: string, requestId: string, input: unknown, effect: () => Promise<ToolReply>, critical = false): Promise<ToolReply> {
    const key = `${tool}\0${requestId}`;
    // A handoff epoch governs admission, not the identity of an already accepted action.
    const identity = input && typeof input === 'object' ? Object.fromEntries(Object.entries(input).filter(([name]) => name !== 'access_epoch')) : input;
    const digest = createHash('sha256').update(canonical(identity)).digest('hex');
    const old = this.entries.get(key);
    if (old) {
      if (old.digest !== digest) throw new ToolError('REQUEST_ID_CONFLICT', 'This request ID was already used with different action arguments.');
      if (old.retired) throw new ToolError('RECEIPT_RETIRED', 'This action was acknowledged; its reply was discarded and the action will not execute again.');
      return old.reply!;
    }
    const retained = [...this.entries.values()].filter(entry => !entry.retired && entry.critical === critical).length;
    const replyReservation = critical ? 256 * 1024 : 3 * 1024 * 1024;
    const byteLimit = this.byteCapacity + (critical ? 2 * 1024 * 1024 : 0);
    if (this.entries.size >= this.idCapacity || retained >= (critical ? 32 : this.capacity) || this.retainedBytes + this.reservedBytes + replyReservation > byteLimit) {
      throw new ToolError('RECEIPT_LIMIT', 'Acknowledge consumed action replies to free payload capacity. At the total ID limit, finish this instance and create a new handoff.', this.status());
    }
    this.reservedBytes += replyReservation;
    const entry: Receipt = { digest, size: 0, settled: false, retired: false, critical, created_at: Date.now() };
    entry.reply = Promise.resolve().then(effect).catch(toolFailure).then(value => {
      let size = Buffer.byteLength(JSON.stringify(value));
      if (size > replyReservation) {
        value = toolFailure(new ToolError('OUTPUT_LIMIT', 'Response exceeds its reserved wire budget; narrow the request.'));
        size = Buffer.byteLength(JSON.stringify(value));
      }
      this.reservedBytes -= replyReservation;
      this.retainedBytes += size;
      entry.size = size;
      entry.settled = true; entry.settled_at = Date.now(); entry.outcome = value.isError ? 'error' : 'success';
      return value;
    });
    this.entries.set(key, entry);
    return entry.reply;
  }

  acknowledge(requests: ReceiptReference[]): Record<string, unknown> {
    const selected = requests.map(request => {
      const entry = this.entries.get(`${request.tool}\0${request.request_id}`);
      if (!entry) throw new ToolError('UNKNOWN_RECEIPT', `No saved action for ${request.tool}/${request.request_id}.`);
      if (!entry.settled) throw new ToolError('RECEIPT_IN_FLIGHT', 'Wait for the action reply before acknowledging it.');
      return entry;
    });
    let retired = 0;
    for (const entry of selected) {
      if (entry.retired) continue;
      this.retainedBytes -= entry.size;
      entry.size = 0;
      entry.reply = undefined;
      entry.retired = true; entry.acknowledged_at = Date.now();
      retired++;
    }
    return { acknowledged: requests.length, retired, receipts: this.status() };
  }

  list(offset = 0, limit = 50): Record<string, unknown> {
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new ToolError('INVALID_PAGE', 'Use offset >= 0 and limit 1..100.');
    const entries = [...this.entries.entries()].slice(offset, offset + limit).map(([key, entry]) => {
      const separator = key.indexOf('\0');
      const tool = key.slice(0, separator), request_id = key.slice(separator + 1);
      return { tool, request_id, state: entry.retired ? 'retired' : entry.settled ? 'retained' : 'in_flight',
        created_at: entry.created_at, settled_at: entry.settled_at, acknowledged_at: entry.acknowledged_at, outcome: entry.outcome };
    });
    return { entries, next_offset: offset + entries.length < this.entries.size ? offset + entries.length : null, total: this.entries.size };
  }

  status(): Record<string, number> {
    const retired = [...this.entries.values()].filter(entry => entry.retired).length;
    return { retained: this.entries.size - retired, retired, payload_bytes: this.retainedBytes, reserved_bytes: this.reservedBytes,
      payload_capacity: this.byteCapacity, action_capacity: this.capacity, total_ids: this.entries.size, total_id_capacity: this.idCapacity,
      remaining_ids: this.idCapacity - this.entries.size };
  }
}

export type AccessControl = 'oracle' | 'pausing' | 'codex';
export type InstanceState = {
  instance_id: string; task_id: string; root: string; pid: number; phase: string; control: AccessControl; access_epoch: number;
  local_only: boolean; tunnel: unknown; last_tool_at: number | null; commands: unknown; blockers: unknown; receipts: unknown; timings: unknown;
  conversation_url?: string; consultation?: unknown; cursor?: number; startup_stage?: string; lifecycle_command?: string;
};
export function taskIdentity(value: string | undefined): string {
  if (!value || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(value)) throw new ToolError('TASK_REQUIRED', 'Supply --task-id with the owning task ID (or CODEX_THREAD_ID).');
  return value;
}

export async function runInstance(options: {
  root: string; taskId: string; localOnly?: boolean; home?: string; port?: number; signal?: AbortSignal;
  onStarted?: (state: InstanceState) => void; onReady?: (state: InstanceState) => void;
}) {
  const root = await canonicalRepository(options.root);
  const taskId = taskIdentity(options.taskId);
  const home = options.home ?? APP_HOME;
  const port = options.port ?? CONTROL_PORT;
  const instanceId = `run_${randomBytes(16).toString('hex')}`;
  const token = randomBytes(32).toString('base64url');
  const stateFile = path.join(home, 'instance.json');
  const events = new Events();
  const consultation = new Consultation();
  let startupStage = 'starting';
  let phase = 'starting';
  let access: AccessControl = 'oracle';
  let epoch = 1;
  let conversation: string | undefined;
  let lastTool: number | null = null;
  const startedAt = performance.now();
  let readyMs: number | null = null;
  const toolTimings: Record<string, { calls: number; total_ms: number; queue_ms: number; max_ms: number; response_bytes: number }> = {};
  const commands = new CommandPool(root);
  commands.onStateChange(() => events.publish('command_changed'));
  const repo = new Repository(root, commands);
  const receipts = new ReceiptLedger();
  const active = new Set<Promise<ToolReply>>();
  const drains = new Set<Promise<ToolReply>>();
  let drainAdmission = true;
  let executing = 0;
  const queue: Array<() => void> = [];
  let endpoint: Endpoint | undefined;
  let tunnel: TunnelHandle | undefined;
  let stopping: Promise<void> | undefined;
  let pausing: Promise<void> | undefined;
  let controlTail: Promise<void> = Promise.resolve();
  let startup: Promise<void> = Promise.resolve();
  const startupAbort = new AbortController();
  let resolveDone!: () => void;
  const done = new Promise<void>(resolve => { resolveDone = resolve; });
  let persistence = Promise.resolve();
  const persist = (clean = false, accessState = access, accessEpoch = epoch): Promise<void> => {
    const data = { instance_id: instanceId, task_id: taskId, root, pid: process.pid, port, token,
      control: accessState, access_epoch: accessEpoch, ...(conversation ? { conversation_url: conversation } : {}), ...(clean ? { clean_exit: true } : {}) };
    const writing = persistence.then(() => writePrivateJson(stateFile, data));
    persistence = writing.catch(() => {});
    return writing;
  };

  const status = (): InstanceState => ({
    instance_id: instanceId, task_id: taskId, root, pid: process.pid, phase, control: access, access_epoch: epoch,
    cursor: events.cursor, consultation: consultation.status(), startup_stage: startupStage, lifecycle_command: path.join(home, 'bin', 'oracle-repo'),
    local_only: !!options.localOnly, tunnel: tunnel?.status() ?? { state: options.localOnly ? 'local-only' : 'connecting' },
    last_tool_at: lastTool, commands: commands.list(), blockers: { calls: active.size, draining_calls: drains.size, commands: commands.list().filter(item => !item.settled).map(item => item.session_id), quiescent: commands.isQuiescent() },
    receipts: receipts.status(), timings: { ready_ms: readyMs, executing, queued: queue.length, tools: structuredClone(toolTimings) },
    ...(conversation ? { conversation_url: conversation } : {})
  });
  const acquire = async (): Promise<() => void> => {
    if (executing >= 8) {
      if (queue.length >= 32) throw new ToolError('SERVER_BUSY', 'Repository work queue is full; finish or cancel existing work before retrying.');
      await new Promise<void>(resolve => queue.push(resolve));
    } else executing++;
    return () => {
      const next = queue.shift();
      if (next) next();
      else executing--;
    };
  };
  const dispatch = async (tool: ToolDefinition, input: unknown): Promise<ToolReply> => {
    const parsed = tool.schema.parse(input) as Record<string, unknown>;
    if (phase !== 'ready') throw new ToolError('NOT_READY', 'This instance is not accepting tools.');
    if ((tool.name !== 'repo_status' || parsed.instance_id !== undefined) && parsed.instance_id !== instanceId) throw new ToolError('STALE_INSTANCE', 'Instance ID differs. Request a new Oracle handoff; do not adopt another checkout.');
    const metadata = tool.name === 'repo_status' || tool.name === 'repo_acknowledge' || tool.name === 'repo_receipts';
    if (tool.name !== 'repo_status' && parsed.access_epoch !== epoch) throw new ToolError('STALE_ACCESS', 'The handoff epoch changed. Obtain the current handoff from the task owner; do not adopt it from status.');
    const drain = tool.name === 'cancel_command' || (tool.name === 'write_stdin' && (parsed.chars === undefined || parsed.chars === ''));
    if (!metadata && access !== 'oracle' && !(access === 'pausing' && drain && drainAdmission)) {
      throw new ToolError('ACCESS_PAUSED', 'Oracle access is paused for local work. The owning task must explicitly resume it.');
    }
    const effect = async () => {
      const queuedAt = performance.now();
      const release = metadata || drain ? () => {} : await acquire();
      const began = performance.now();
      let responseBytes = 0;
      try {
        const value = await tool.execute(parsed);
        responseBytes = Buffer.byteLength(JSON.stringify(value));
        return value;
      } finally {
        release();
        const elapsed = Math.round(performance.now() - began);
        const timing = toolTimings[tool.name] ??= { calls: 0, total_ms: 0, queue_ms: 0, max_ms: 0, response_bytes: 0 };
        timing.calls++; timing.total_ms += elapsed; timing.queue_ms += Math.round(began - queuedAt);
        timing.max_ms = Math.max(timing.max_ms, elapsed); timing.response_bytes += responseBytes;
      }
    };
    const promise = tool.replay ? receipts.run(tool.name, parsed.request_id as string, parsed, effect, drain) : effect();
    const tracking = access === 'pausing' && drain ? drains : active;
    tracking.add(promise); events.publish('tool_started');
    try { return await promise; } finally { tracking.delete(promise); events.publish('tool_finished'); }
  };
  const beginPause = () => {
    if (access !== 'oracle') return;
    access = 'pausing'; events.publish('pausing');
    const barrier = [...active];
    pausing = (async () => {
      await Promise.allSettled(barrier);
      await commands.whenQuiescent();
      drainAdmission = false;
      await Promise.allSettled([...drains]);
      if (phase !== 'ready') return;
      repo.clearSearchSnapshots();
      access = 'codex';
      await persist(); events.publish('paused');
    })();
    void pausing.catch(() => { /* Live status is authoritative; metadata is recovered on the next transition. */ });
  };
  const resume = async (expectedEpoch: number) => {
    if (expectedEpoch !== epoch) throw new ToolError('STALE_ACCESS', 'Resume requires the epoch from the paused receipt.');
    if (access === 'oracle') return;
    if (access !== 'codex' || !commands.isQuiescent()) throw new ToolError('NOT_QUIESCENT', 'Pause has not finished draining. Inspect blockers or explicitly cancel commands.');
    repo.clearSearchSnapshots();
    const nextEpoch = epoch + 1;
    await persist(false, 'oracle', nextEpoch);
    if (phase !== 'ready') throw new ToolError('NOT_READY', 'The instance stopped while resuming.');
    epoch = nextEpoch;
    drainAdmission = true;
    access = 'oracle'; consultation.invalidate(); events.publish('resumed');
  };
  const control = http.createServer(async (req, res) => {
    if (req.headers.host !== `127.0.0.1:${port}` || req.headers.origin || !constantEqual(req.headers.authorization ?? '', `Bearer ${token}`)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', 'application/json');
    try {
      if (req.method === 'GET' && req.url?.split('?')[0] === '/status') { res.end(JSON.stringify(status())); return; }
      const query = new URL(req.url ?? '/', 'http://localhost');
      if (req.method === 'GET' && ['/wait', '/receipts'].includes(query.pathname)) {
        if (req.headers['x-oracle-task-id'] !== taskId) throw new ToolError('TASK_BUSY', 'Use the owning task.');
        if (query.searchParams.get('instance_id') !== instanceId) throw new ToolError('STALE_INSTANCE', 'Use the owned instance.');
        if (query.pathname === '/receipts') {
          res.end(JSON.stringify({ ...status(), receipt_details: receipts.list(Number(query.searchParams.get('offset') ?? 0), Number(query.searchParams.get('limit') ?? 50)) })); return;
        }
        const abort = new AbortController();
        const disconnect = () => abort.abort(); res.once('close', disconnect);
        const result = await events.wait(Number(query.searchParams.get('after') ?? events.cursor), Number(query.searchParams.get('timeout_ms') ?? 0), abort.signal);
        res.removeListener('close', disconnect);
        res.end(JSON.stringify({ ...status(), ...result })); return;
      }
      if (req.method !== 'POST') { res.writeHead(404).end(); return; }
      const action = /^\/(stop|pause|resume|remember|begin|observe)\/([^/]+)$/.exec(req.url ?? '');
      if (!action || action[2] !== instanceId) throw new ToolError('STALE_INSTANCE', 'Control requires the exact owned instance.');
      if (req.headers['x-oracle-task-id'] !== taskId) throw new ToolError('TASK_BUSY', 'This instance belongs to another task.');
      if (action[1] === 'stop') { res.end(JSON.stringify({ ...status(), phase: 'stopping' })); void close(); return; }
      const operation = controlTail.then(async () => {
        if (phase !== 'ready') throw new ToolError('NOT_READY', 'The instance is not ready for this control action.');
        if (action[1] === 'remember') {
          conversation = conversationUrl(String(req.headers['x-oracle-conversation'] ?? ''));
          await persist(); events.publish('conversation_remembered'); return;
        }
        const expectedEpoch = Number(req.headers['x-oracle-access-epoch']);
        if (!Number.isSafeInteger(expectedEpoch) || expectedEpoch !== epoch) throw new ToolError('STALE_ACCESS', 'Use the exact access epoch from this task\'s receipt.');
        if (action[1] === 'begin' || action[1] === 'observe') {
          let body = ''; for await (const chunk of req) { body += String(chunk); if (body.length > 4096) throw new ToolError('INVALID_OBSERVATION', 'Observation exceeds 4096 bytes.'); }
          const input = JSON.parse(body);
          const result = action[1] === 'begin' ? consultation.begin(input, epoch) : consultation.observe(input, epoch);
          conversation = 'conversation_url' in result ? result.conversation_url : undefined;
          await persist(); events.publish(action[1] === 'begin' ? 'consultation_started' : 'consultation_observed'); return;
        }
        if (action[1] === 'pause') beginPause();
        else if (action[1] === 'resume') await resume(expectedEpoch);
      });
      controlTail = operation.catch(() => {});
      await operation;
      res.end(JSON.stringify(status()));
    } catch (error) {
      const failure = toolFailure(error);
      res.writeHead(409).end(JSON.stringify(failure.structuredContent));
    }
  });
  control.requestTimeout = 5000; control.headersTimeout = 5000;
  await new Promise<void>((resolve, reject) => {
    control.once('error', reject);
    control.listen(port, '127.0.0.1', () => { control.removeListener('error', reject); resolve(); });
  }).catch(error => { throw new ToolError((error as NodeJS.ErrnoException).code === 'EADDRINUSE' ? 'BUSY' : 'CONTROL_FAILED', 'The singleton control listener is unavailable. Inspect status before starting another repository.'); });
  const close = (): Promise<void> => {
    if (stopping) return stopping;
    phase = 'stopping'; events.publish('stopping');
    startupAbort.abort();
    stopping = (async () => {
      await startup.catch(() => {});
      await controlTail;
      await Promise.allSettled([commands.close(), tunnel?.close()]);
      await Promise.allSettled([...active, ...drains]);
      await pausing?.catch(() => {});
      await endpoint?.close();
      await persist(true);
      await new Promise<void>(resolve => control.close(() => resolve()));
      phase = 'stopped'; events.publish('stopped'); resolveDone();
    })();
    return stopping;
  };
  startup = (async () => {
    await persist();
    options.onStarted?.(status());
    endpoint = await openMcpEndpoint({
      tools: createTools(repo, commands, async () => {
        const { task_id: _taskId, conversation_url: _conversationUrl, consultation: _consultation, lifecycle_command: _command, cursor: _cursor, ...remoteStatus } = status();
        return { ...remoteStatus, ...(access === 'oracle' ? { repository: await repo.status() } : {}) };
      }, requests => receipts.acknowledge(requests), (offset, limit) => receipts.list(offset, limit)),
      instructions: 'One live checkout and owning task per instance. Keep the server warm across prompts. Use exact instance_id and access_epoch from the current Oracle handoff. Never adopt another scope from status. Codex pauses remote access before local edits. Preserve unrelated changes. Do not stage, commit, switch branches, push, or publish. Normal-user shell permissions. Reuse request_id only for the same action arguments; a renewed access_epoch does not create a new action. Acknowledge consumed receipts to free payload capacity.',
      dispatch, onToolCall: () => { lastTool = Date.now(); }
    });
    startupStage = 'local_ready'; events.publish(startupStage); options.onStarted?.(status());
    if (!options.localOnly) {
      startupStage = 'tunnel_connecting'; events.publish(startupStage); options.onStarted?.(status());
      const config = await readConfig(home);
      const key = await keychain('get', config.keychainAccount);
      tunnel = await startTunnel({ config, key, localUrl: endpoint.url, probeHeaders: endpoint.probeHeaders, home, signal: startupAbort.signal });
    }
    if (phase === 'starting') { readyMs = Math.round(performance.now() - startedAt); phase = 'ready'; startupStage = 'ready'; events.publish('ready'); options.onReady?.(status()); }
  })();
  const onAbort = () => { void close(); };
  options.signal?.addEventListener('abort', onAbort, { once: true });
  if (options.signal?.aborted) onAbort();
  void done.then(() => options.signal?.removeEventListener('abort', onAbort));
  try { await startup; } catch (error) { await close(); throw error; }
  return { status, close, done, localUrl: options.localOnly ? endpoint!.url : undefined };
}

export type ControlAction = 'status' | 'stop' | 'pause' | 'resume' | 'remember' | 'begin' | 'observe' | 'wait' | 'receipts';
export type ControlOptions = { home?: string; expectedInstance?: string; taskId?: string; accessEpoch?: number; conversationUrl?: string; body?: unknown; after?: number; timeoutMs?: number; offset?: number; limit?: number };
export async function controlRequest(action: ControlAction, options: ControlOptions = {}, publicationAttempt = 0): Promise<Record<string, unknown> | null> {
  let disk: { token: string; port: number; instance_id: string; task_id?: string; root?: string; clean_exit?: boolean };
  try { disk = JSON.parse(await fs.readFile(path.join(options.home ?? APP_HOME, 'instance.json'), 'utf8')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw new ToolError('INVALID_STATE', 'Instance metadata cannot be read.'); }
  if (typeof disk.token !== 'string' || disk.port !== CONTROL_PORT || typeof disk.instance_id !== 'string') throw new ToolError('INVALID_STATE', 'Instance metadata is invalid.');
  if (action !== 'status' && options.expectedInstance !== disk.instance_id) throw new ToolError('STALE_INSTANCE', 'Control requires the exact instance ID owned by this task.');
  if (action !== 'status' && options.taskId !== disk.task_id) throw new ToolError('TASK_BUSY', 'Control requires the task that owns this instance.');
  const headers: Record<string, string> = { authorization: `Bearer ${disk.token}` };
  if (options.taskId) headers['x-oracle-task-id'] = options.taskId;
  if (options.accessEpoch !== undefined) headers['x-oracle-access-epoch'] = String(options.accessEpoch);
  if (options.conversationUrl !== undefined) headers['x-oracle-conversation'] = options.conversationUrl;
  const readAction = ['status', 'wait', 'receipts'].includes(action);
  const query = new URLSearchParams({ instance_id: disk.instance_id });
  for (const [key, value] of Object.entries({ after: options.after, timeout_ms: options.timeoutMs, offset: options.offset, limit: options.limit })) if (value !== undefined) query.set(key, String(value));
  try {
    const response = await fetch(`http://127.0.0.1:${disk.port}/${readAction ? `${action}?${query}` : `${action}/${disk.instance_id}`}`, {
      method: readAction ? 'GET' : 'POST', headers, body: options.body === undefined ? undefined : JSON.stringify(options.body), signal: AbortSignal.timeout(action === 'wait' ? Math.min(options.timeoutMs ?? 0, 55_000) + 3000 : 3000)
    });
    if (response.status === 403 && publicationAttempt < 25) {
      await new Promise(resolve => setTimeout(resolve, 40));
      return controlRequest(action, options, publicationAttempt + 1);
    }
    if (!response.ok) {
      if (response.status === 409) {
        const failure = await response.json() as { code: string; message: string };
        throw new ToolError(failure.code, failure.message);
      }
      throw new ToolError('CONTROL_REJECTED', 'The listener did not authenticate this instance metadata.');
    }
    const value = await response.json() as Record<string, unknown>;
    if (value.instance_id !== disk.instance_id) throw new ToolError('STALE_INSTANCE', 'The running listener has a different instance ID.');
    if (options.taskId && value.task_id !== options.taskId) throw new ToolError('TASK_BUSY', 'The running instance belongs to another task.');
    return value;
  } catch (error) {
    if (error instanceof ToolError) throw error;
    if ((error as { cause?: { code?: string } }).cause?.code === 'ECONNREFUSED') {
      if (disk.clean_exit) return null;
      return { phase: 'unclean', instance_id: disk.instance_id, task_id: disk.task_id, root: disk.root, detail: 'The previous listener exited without confirmed cleanup. Detached commands may remain; request a new handoff, never blindly replay old actions.' };
    }
    throw new ToolError('CONTROL_UNREACHABLE', 'The control request did not complete; state is unconfirmed. Retry status.');
  }
}
export async function waitForExistingReady(initial: Record<string, unknown>, root: string, localOnly: boolean,
  read: () => Promise<Record<string, unknown> | null> = () => controlRequest('status'), taskId?: string): Promise<Record<string, unknown>> {
  const id = initial.instance_id;
  let current: Record<string, unknown> | null = initial;
  const deadline = Date.now() + 75_000;
  while (current) {
    if (current.instance_id !== id) throw new ToolError('STALE_INSTANCE', 'The instance changed while waiting for readiness. Request a new handoff.');
    if (current.root !== root || current.local_only !== localOnly) throw new ToolError('BUSY', 'Another repository or connection mode owns the server.');
    if (taskId && current.task_id !== taskId) throw new ToolError('TASK_BUSY', 'Another task owns this server.');
    if (current.phase === 'ready') return current;
    if (current.phase !== 'starting' || Date.now() >= deadline) break;
    await new Promise(resolve => setTimeout(resolve, 200));
    current = await read();
  }
  throw new ToolError('NOT_READY', 'The original instance is no longer starting or did not become ready. Inspect status before retrying.');
}
