import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { check, PortalError, sha, requestHash } from '../../protocol/src/index.js';
export const ALLOWED_RPC = new Set(['initialize', 'initialized', 'command/exec', 'command/exec/write', 'command/exec/resize', 'command/exec/terminate', 'skills/list', 'configRequirements/read']);
export const REQUIRED_PROBES = ['argv', 'cwd', 'read-denied', 'write-denied', 'network-denied', 'stdin-eof', 'pty', 'resize', 'stdout-stderr', 'cancel-descendants', 'output-stream', 'read-only-write-denied'];
export function safeEnvironment(overrides: Record<string, string> = {}, home: string) { const allowed = new Set(['PATH', 'LANG', 'LC_ALL', 'TERM', 'COLORTERM', 'TZ', 'DEVELOPER_DIR', 'SDKROOT', 'SWIFT_EXEC']); const env: Record<string, string> = { PATH: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin', LANG: 'en_US.UTF-8', HOME: home, TMPDIR: home }; for (const [k, v] of Object.entries(overrides)) {
    check(allowed.has(k) && !k.includes('TOKEN') && v.length <= 4096 && !v.includes('\0'), 'FORBIDDEN', `Environment override ${k} is not permitted`);
    check(!['PATH', 'SWIFT_EXEC', 'SDKROOT', 'DEVELOPER_DIR'].includes(k), 'FORBIDDEN', `${k} must be set by the local toolchain profile, not by the model`);
    env[k] = v;
} return env; }
export interface Qualification {
    binary: string;
    binarySha256: string;
    version: string;
    schemaSha256: string;
    platform: string;
    arch: string;
    qualified: boolean;
    probes: Record<string, boolean>;
    schemaDirectory: string;
    verifiedAt: string;
}
export function executorAvailability(stateDir: string): {
    available: boolean;
    reason?: string;
    qualification?: Qualification;
} { try {
    const q = JSON.parse(fs.readFileSync(path.join(stateDir, 'codex-qualification.json'), 'utf8')) as Qualification;
    check(q.qualified && q.platform === process.platform && q.arch === process.arch && REQUIRED_PROBES.every(x => q.probes[x] === true), 'EXECUTOR_UPGRADE_REQUIRED', 'Missing exact-platform sandbox qualification');
    check(fs.existsSync(q.binary) && sha(fs.readFileSync(q.binary)) === q.binarySha256, 'EXECUTOR_UPGRADE_REQUIRED', 'Codex binary changed after qualification');
    return { available: true, qualification: q };
}
catch (e) {
    return { available: false, reason: 'EXECUTOR_UPGRADE_REQUIRED: run portal executor qualify on the target Mac; no unrestricted fallback exists' };
} }
export class CodexClient extends EventEmitter {
    private child?: ChildProcessWithoutNullStreams;
    private sequence = 0;
    private pending = new Map<number, {
        resolve: (v: any) => void;
        reject: (e: any) => void;
        timer: NodeJS.Timeout;
    }>();
    readonly trace: string[] = [];
    private diagnostics = '';
    constructor(public binary: string, public env: Record<string, string>, private timeoutMs = 10000) { super(); }
    async start() { this.child = spawn(this.binary, ['app-server'], { env: this.env, stdio: ['pipe', 'pipe', 'pipe'], detached: true }); let buffer = Buffer.alloc(0); this.child.stdin.on('error', () => { }); this.child.stdout.on('data', (b: Buffer) => { buffer = Buffer.concat([buffer, b]); if (buffer.length > 1048576) {
        this.fail(new PortalError('LIMIT_EXCEEDED', 'Codex frame exceeded 1 MiB'));
        this.stop();
        return;
    } let n; while ((n = buffer.indexOf(10)) >= 0) {
        const line = buffer.subarray(0, n);
        buffer = buffer.subarray(n + 1);
        if (!line.length)
            continue;
        try {
            const m = JSON.parse(line.toString());
            if (m.id !== undefined) {
                const p = this.pending.get(m.id);
                if (p) {
                    this.pending.delete(m.id);
                    clearTimeout(p.timer);
                    m.error ? p.reject(new PortalError('CAPABILITY_UNAVAILABLE', 'Codex RPC rejected operation', { rpcError: m.error })) : p.resolve(m.result);
                }
            }
            else if (m.method === 'command/exec/outputDelta')
                this.emit('output', m.params);
            else if (m.id !== undefined && m.method) {
                this.child?.stdin.write(JSON.stringify({ id: m.id, error: { code: -32601, message: 'Server requests are not authorized' } }) + '\n');
            }
        }
        catch (e) {
            this.fail(e);
            this.stop();
        }
    } }); this.child.stderr.on('data', b => { this.diagnostics = (this.diagnostics + b.toString()).slice(-4096); }); this.child.once('error', e => this.fail(e)); this.child.once('exit', (code, signal) => { this.fail(new PortalError('OUTCOME_UNKNOWN', 'Codex app-server exited', { code, signal, diagnostics: this.diagnostics }, 'after_status_check')); this.emit('closed', { code, signal }); }); await this.call('initialize', { clientInfo: { name: 'portal', version: '0.1.0' }, capabilities: { experimentalApi: true } }); this.notify('initialized', {}); }
    call(method: string, params: any, timeoutMs = this.timeoutMs): Promise<any> { check(ALLOWED_RPC.has(method), 'FORBIDDEN', `RPC ${method} is not in the execution-only allowlist`); check(this.child, 'CAPABILITY_UNAVAILABLE', 'Codex is not initialized'); check(this.pending.size < 100, 'OVERLOADED', 'Too many pending Codex requests'); this.trace.push(method); const id = ++this.sequence; return new Promise((resolve, reject) => { const timer = setTimeout(() => { this.pending.delete(id); reject(new PortalError('OUTCOME_UNKNOWN', 'Codex response deadline exceeded', { method }, 'after_status_check')); }, timeoutMs); this.pending.set(id, { resolve, reject, timer }); this.child!.stdin.write(JSON.stringify({ id, method, params }) + '\n'); }); }
    notify(method: string, params: any) { check(ALLOWED_RPC.has(method), 'FORBIDDEN', 'Notification is not permitted'); this.trace.push(method); this.child?.stdin.write(JSON.stringify({ method, params }) + '\n'); }
    private fail(e: any) { for (const p of this.pending.values()) {
        clearTimeout(p.timer);
        p.reject(e);
    } this.pending.clear(); }
    stop() { if (this.child?.pid) {
        try {
            process.kill(-this.child.pid, 'SIGKILL');
        }
        catch {
            this.child.kill('SIGKILL');
        }
    } this.fail(new PortalError('OUTCOME_UNKNOWN', 'Executor connection stopped', {}, 'after_status_check')); }
}
export function sandboxPolicy(root: string, scratch: string, toolchain: string[], write: boolean, network: boolean) { const access = { type: 'restricted', includePlatformDefaults: true, readableRoots: [root, scratch, ...toolchain] }; return write ? { type: 'workspaceWrite', writableRoots: [root, scratch], readOnlyAccess: access, networkAccess: network, excludeTmpdirEnvVar: true, excludeSlashTmp: true } : { type: 'readOnly', access, networkAccess: false }; }
