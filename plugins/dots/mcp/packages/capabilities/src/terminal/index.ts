import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { Registry } from '../../../core/src/registry.js';
import type { CapabilityContext } from '../../../core/src/types.js';
import { runtimeDir, secretFile, callIpc } from '../../../core/src/ipc.js';
import { relative } from '../../../core/src/rooted-fs.js';
import { bootId } from '../../../storage/src/local.js';
import { s, id, check, sha, requestHash, sleep, TERMINAL, PortalError } from '../../../protocol/src/index.js';
import { executorAvailability, safeEnvironment, sandboxPolicy } from '../../../codex-adapter/src/index.js';
import { OutputSpool } from './spool.js';
export function addTerminal(r: Registry, stateDir: string) {
    const availability = () => executorAvailability(stateDir);
    const input = s.object({ argv: s.array(s.string(8192), 256, 1), cwd: s.path(), executionAccess: s.enum('inherit', 'read'), tty: s.bool(), rows: s.int(1, 500), cols: s.int(1, 1000), env: s.record(s.string(4096), 20), timeoutMs: s.int(100, 86400000), yieldMs: s.int(0, 2000) }, ['argv', 'cwd']);
    r.add({ id: 'terminal.exec', description: 'Durably start one sandboxed argv command. Requires exact-binary restricted-read, write, network, PTY and teardown qualification. No shell joining.', family: 'terminal', effect: 'spawn', input, dependencies: ['qualified-codex-app-server'], availability, handler: async (c, a) => {
            const qualified = executorAvailability(c.store.dir);
            check(qualified.available, 'EXECUTOR_UPGRADE_REQUIRED', qualified.reason ?? 'Executor unqualified');
            check(c.store.one("SELECT COUNT(*) n FROM jobs WHERE state IN ('accepted','running','cancel_requested')").n < 4, 'OVERLOADED', 'Four command workers are already active');
            relative(a.cwd);
            const st = c.fs.stat(a.cwd);
            check(st.type === 'directory', 'INVALID_ARGUMENT', 'cwd must be a real granted directory');
            const jobId = id('job'), workerId = id('worker'), runtime = runtimeDir(c.store.dir), socket = path.join(runtime, jobId.slice(0, 24) + '.sock'), secretPath = path.join(c.store.dir, 'secrets', jobId);
            secretFile(secretPath);
            const scratch = path.join(c.store.dir, 'staging', jobId);
            fs.mkdirSync(scratch, { mode: 0o700 });
            const mutating = c.workspace.access === 'write' && a.executionAccess !== 'read';
            const deadline = Math.min(Date.now() + (a.timeoutMs ?? 1800000), Date.now() + c.grant.policy.maxJobMs, c.grant.expires_at, c.workspace.expires_at);
            const config = { binary: qualified.qualification!.binary, command: a.argv, cwd: path.join(c.workspace.root, a.cwd), env: safeEnvironment(a.env ?? {}, scratch), tty: a.tty ?? false, rows: a.rows ?? 24, cols: a.cols ?? 80, scratch, sandboxPolicy: sandboxPolicy(c.workspace.root, scratch, c.grant.policy.toolchainRoots, mutating, c.grant.policy.network), processId: jobId, timeoutMs: deadline - Date.now() };
            c.store.tx(() => { c.store.run('INSERT INTO jobs(id,operation_id,workspace_id,kind,worker_id,boot_id,control_socket,control_secret_ref,state,deadline,lease_deadline,argv_hash,mutating,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', jobId, c.operationId, c.workspace.id, 'command', workerId, bootId(), socket, secretPath, 'accepted', deadline, Math.min(deadline, Date.now() + 300000), requestHash(a.argv), mutating ? 1 : 0, Date.now(), Date.now()); c.store.run('INSERT INTO worker_configs VALUES(?,?)', jobId, JSON.stringify(config)); c.store.event(c.operationId, 'worker_spawn_intent', { jobId, workerId }); });
            const log = fs.openSync(path.join(c.store.dir, 'spool', jobId + '.worker.log'), 'a', 0o600);
            const child = spawn(process.execPath, [path.join(import.meta.dirname, 'worker.js'), c.store.dir, jobId], { detached: true, stdio: ['ignore', log, log], env: { PATH: process.env.PATH ?? '/usr/bin:/bin', HOME: process.env.HOME ?? '', LANG: 'en_US.UTF-8' } });
            fs.closeSync(log);
            child.unref();
            child.on('error', e => { c.store.run("UPDATE jobs SET state='interrupted' WHERE id=?", jobId); c.store.event(c.operationId, 'worker_spawn_failed', { message: e.message }); });
            c.store.run('UPDATE jobs SET pid=? WHERE id=?', child.pid ?? null, jobId);
            await sleep(a.yieldMs ?? 100);
            const j = c.store.one('SELECT state FROM jobs WHERE id=?', jobId);
            return { ...new OutputSpool(c.store).read(c.workspace.id, jobId), jobId, jobState: j.state, operationId: c.operationId };
        } });
    const lookup = (c: CapabilityContext, a: any) => { const j = c.store.one('SELECT * FROM jobs WHERE id=? AND workspace_id=?', a.jobId, c.workspace.id); check(j, 'NOT_FOUND', 'Job not found in workspace'); return j; };
    const control = async (c: CapabilityContext, a: any, method: string) => { const j = lookup(c, a); check(!TERMINAL.has(j.state), 'FORBIDDEN', 'Job already ended'); const result = await callIpc(j.control_socket, fs.readFileSync(j.control_secret_ref, 'utf8'), method, { ...a, operationId: c.operationId }, 5000); if (result?.error)
        throw new PortalError(result.error.code, result.error.message, result.error.details); return result; };
    r.add({ id: 'terminal.stdin', description: 'Write bytes or EOF once to this durable job; never use stdin as a poll.', family: 'terminal', effect: 'control', input: s.object({ jobId: s.key(), text: s.string(65536), base64: s.string(90000), closeStdin: s.bool() }, ['jobId']), availability, handler: async (c, a) => { check(!(a.text !== undefined && a.base64 !== undefined), 'INVALID_ARGUMENT', 'Choose text or base64'); check(a.text !== undefined || a.base64 !== undefined || a.closeStdin === true, 'INVALID_ARGUMENT', 'No stdin data or EOF was supplied'); return control(c, a, 'stdin'); } });
    r.add({ id: 'terminal.resize', description: 'Resize the real PTY in rows and columns.', family: 'terminal', effect: 'control', input: s.object({ jobId: s.key(), rows: s.int(1, 500), cols: s.int(1, 1000) }), availability, handler: (c, a) => control(c, a, 'resize') });
    r.add({ id: 'jobs.get', description: 'Read persisted job state, without interpreting a missing connection as process failure.', family: 'jobs', effect: 'read', input: s.object({ jobId: s.key() }), handler: (c, a) => { const j = lookup(c, a); return { jobId: j.id, jobState: j.state, kind: j.kind, deadline: j.deadline, exitCode: j.exit_code, signal: j.signal, operationId: j.operation_id }; } });
    r.add({ id: 'jobs.list', description: 'List only jobs bound to this workspace.', family: 'jobs', effect: 'read', input: s.object({}), handler: c => ({ jobs: c.store.all('SELECT id,state,kind,exit_code,signal,created_at,deadline FROM jobs WHERE workspace_id=? ORDER BY created_at DESC LIMIT 100', c.workspace.id) }) });
    r.add({ id: 'jobs.output', description: 'Independent byte cursors over committed stdout/stderr/PTY segments, with explicit eviction gaps.', family: 'jobs', effect: 'read', input: s.object({ jobId: s.key(), cursor: s.nullable(s.string(4096)), maxBytes: s.int(1, 65536), waitMs: s.int(0, 10000) }, ['jobId']), handler: async (c, a) => { lookup(c, a); const spool = new OutputSpool(c.store), end = performance.now() + (a.waitMs ?? 0); let result = spool.read(c.workspace.id, a.jobId, a.cursor, a.maxBytes); while (result.chunks.length === 0 && !TERMINAL.has(result.jobState) && performance.now() < end) {
            await sleep(50);
            result = spool.read(c.workspace.id, a.jobId, a.cursor, a.maxBytes);
        } return result; } });
    r.add({ id: 'jobs.cancel', description: 'Persist cancellation intent; report requested versus confirmed termination separately.', family: 'jobs', effect: 'control', input: s.object({ jobId: s.key() }), handler: async (c, a) => { const j = lookup(c, a); if (TERMINAL.has(j.state))
            return { jobId: j.id, jobState: j.state, terminationConfirmed: j.state === 'cancelled' }; c.store.run("UPDATE jobs SET state='cancel_requested',updated_at=? WHERE id=?", Date.now(), j.id); try {
            await control(c, a, 'cancel');
        }
        catch { } const actual = lookup(c, a); return { jobId: j.id, jobState: actual.state, cancellationRequested: true, terminationConfirmed: actual.state === 'cancelled' }; } });
}
