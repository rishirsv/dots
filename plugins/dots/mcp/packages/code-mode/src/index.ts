import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { Registry } from '../../core/src/registry.js';
import { bootId } from '../../storage/src/local.js';
import { s, id, check, err, ok, PortalError, safeJson, requestHash, TERMINAL, sleep } from '../../protocol/src/index.js';
import { OutputSpool } from '../../capabilities/src/terminal/spool.js';
import { putArtifact } from '../../capabilities/src/artifacts/index.js';
export function codeAvailability() { try {
    createRequire(import.meta.url).resolve('quickjs-emscripten');
    return { available: true };
}
catch {
    return { available: false, reason: 'Pinned quickjs-emscripten WASM dependency is not installed; no Node eval fallback exists' };
} }
export function addCodeMode(r: Registry) {
    for (const readonly of [true, false])
        r.add({ id: readonly ? 'code.run_read' : 'code.run', description: readonly ? 'Compose explicitly selected read capabilities in isolated QuickJS; no spawn, mutation, stdin or network.' : 'Compose explicitly selected capabilities in isolated QuickJS; every side effect needs a stable stepKey and remains broker-authorized.', family: 'code', effect: 'control', input: s.object({ code: s.string(65536), capabilityIds: s.array({ ...s.string(120), pattern: '^[a-z]+(?:\.[a-z_]+)+$' }, 30), limits: s.object({ wallMs: s.int(100, 300000), maxCalls: s.int(1, 100) }, []) }, ['code', 'capabilityIds']), dependencies: ['quickjs-emscripten'], availability: codeAvailability, handler: async (c, a) => {
                const caps = [...new Set(a.capabilityIds)] as string[];
                for (const id of caps) {
                    const cap = r.get(id);
                    check(cap.family !== 'code', 'FORBIDDEN', 'Nested code execution is not permitted');
                    if (readonly)
                        check(cap.effect === 'read' && !['terminal', 'network', 'processes'].includes(cap.family), 'FORBIDDEN', 'Read-only code selection contains a side-effecting capability');
                    check(c.grant.policy.families.includes('*') || c.grant.policy.families.includes(cap.family), 'FORBIDDEN', 'Selected capability is not granted');
                }
                check(c.store.one("SELECT COUNT(*) n FROM jobs WHERE kind='code' AND state IN ('running','accepted')").n < 2, 'OVERLOADED', 'Code worker concurrency limit reached');
                const jobId = id('code'), workerId = id('worker'), wallMs = Math.min(a.limits?.wallMs ?? 60000, c.grant.expires_at - Date.now(), c.workspace.expires_at - Date.now()), deadline = Date.now() + wallMs;
                check(wallMs > 0, 'GRANT_EXPIRED', 'No remaining code execution time');
                c.store.run('INSERT INTO jobs(id,operation_id,workspace_id,kind,worker_id,boot_id,state,deadline,lease_deadline,argv_hash,mutating,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', jobId, c.operationId, c.workspace.id, 'code', workerId, bootId(), 'running', deadline, deadline, requestHash(a.code), 0, Date.now(), Date.now());
                const child = spawn(process.execPath, ['--max-old-space-size=128', path.join(import.meta.dirname, 'worker.js')], { stdio: ['pipe', 'pipe', 'pipe'], env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' } });
                c.store.run('UPDATE jobs SET pid=? WHERE id=?', child.pid ?? null, jobId);
                const spool = new OutputSpool(c.store);
                let done = false, admission = true, calls = 0, inFlight = 0, logs = 0, buffer = Buffer.alloc(0);
                const waiting: (() => void)[] = [];
                let mutationTail: Promise<void> = Promise.resolve();
                const descendants = () => c.store.all('SELECT id,state,capability,result FROM operations WHERE parent_id=?', c.operationId).map(x => ({ operationId: x.id, state: x.state, capability: x.capability }));
                const liveJobs = () => c.store.all("SELECT j.id,j.state FROM jobs j JOIN operations o ON j.operation_id=o.id WHERE o.parent_id=? AND j.state IN ('accepted','running','cancel_requested')", c.operationId);
                const finish = (value: any, error?: string) => { if (done)
                    return; done = true; admission = false; clearInterval(monitor); clearTimeout(timer); child.kill('SIGKILL'); const children = descendants(), partialEffects = children.some(x => x.state === 'succeeded' && r.get(x.capability).effect !== 'read'); const outcome = error ? err(new PortalError('CODE_FAILED', error, { partialEffects, children, liveJobs: liveJobs() }, 'after_status_check'), { operationId: c.operationId }) : ok({ jobId, returned: value, children, liveJobs: liveJobs(), partialEffects: false }, { operationId: c.operationId }); if (!error && Buffer.byteLength(JSON.stringify(outcome)) > 65536)
                    (outcome.data as any).returned = { artifact: putArtifact(c.store, c.workspace.id, c.actor.accountId, Buffer.from(JSON.stringify(value)), 'application/json') }; c.store.run('UPDATE jobs SET state=?,updated_at=? WHERE id=?', error ? 'failed' : 'succeeded', Date.now(), jobId); c.store.finish(c.operationId, outcome); };
                const cancel = () => { admission = false; for (const job of liveJobs())
                    c.store.run("UPDATE jobs SET state='cancel_requested' WHERE id=?", job.id); finish(null, 'Program cancelled or expired; inspect child receipts and jobs before continuing'); };
                const monitor = setInterval(() => { const j = c.store.one('SELECT state FROM jobs WHERE id=?', jobId), g = c.store.one('SELECT revoked,revision,expires_at FROM grants WHERE id=?', c.grant.id); if (j.state === 'cancel_requested' || g.revoked || g.revision !== c.grant.revision || g.expires_at <= Date.now())
                    cancel(); }, 100);
                const timer = setTimeout(cancel, wallMs + 500);
                child.stdin.on('error', () => { });
                child.stderr.on('data', () => { });
                child.once('error', e => finish(null, e.message));
                child.once('exit', (code, signal) => { if (!done)
                    finish(null, `Code worker exited before a durable result: ${code ?? signal}`); });
                const reply = (id: number, result: any) => { if (!done)
                    child.stdin.write(JSON.stringify({ type: 'reply', id, result }) + '\n'); };
                const dispatch = async (m: any) => { if (m.type === 'log') {
                    if (logs < 16384) {
                        const b = Buffer.from(m.text + '\n').subarray(0, 16384 - logs);
                        logs += b.length;
                        spool.append(jobId, 'stdout', b);
                    }
                    return;
                } if (m.type === 'result') {
                    finish(m.value);
                    return;
                } if (m.type === 'error') {
                    finish(null, m.message);
                    return;
                } if (m.type !== 'call')
                    throw new Error('Unexpected code frame'); try {
                    check(admission && performance.now() >= 0, 'CANCEL_REQUESTED', 'Bridge admission revoked');
                    check(++calls <= (a.limits?.maxCalls ?? 100), 'LIMIT_EXCEEDED', 'Code bridge call limit exceeded');
                    safeJson(m.arguments, 262144);
                    if (m.capabilityId === '$sleep') {
                        check(Number.isInteger(m.arguments.ms) && m.arguments.ms >= 0 && m.arguments.ms <= 1000, 'INVALID_ARGUMENT', 'Invalid sleep');
                        await sleep(m.arguments.ms);
                        reply(m.id, ok({}));
                        return;
                    }
                    check(caps.includes(m.capabilityId), 'FORBIDDEN', 'Capability was not selected for this program');
                    const cap = r.get(m.capabilityId), args = { ...m.arguments };
                    const step = args.stepKey;
                    delete args.stepKey;
                    if (cap.effect !== 'read')
                        check(typeof step === 'string' && /^[A-Za-z0-9_.:-]{1,80}$/.test(step), 'INVALID_ARGUMENT', 'Every side-effecting bridge call needs an explicit stable stepKey');
                    let releaseMutation: (() => void) | undefined;
                    if (cap.effect !== 'read') {
                        const previous = mutationTail;
                        mutationTail = new Promise<void>(resolve => { releaseMutation = resolve; });
                        await previous;
                    }
                    if (inFlight >= 4)
                        await new Promise<void>(resolve => waiting.push(resolve));
                    if (!admission) {
                        releaseMutation?.();
                        throw new PortalError('CANCEL_REQUESTED', 'Bridge admission revoked');
                    }
                    inFlight++;
                    try {
                        const result = await c.invoke(m.capabilityId, args, step);
                        reply(m.id, result);
                    }
                    finally {
                        inFlight--;
                        waiting.shift()?.();
                        releaseMutation?.();
                    }
                }
                catch (e) {
                    reply(m.id, err(e));
                } };
                child.stdout.on('data', (b: Buffer) => { buffer = Buffer.concat([buffer, b]); if (buffer.length > 1048576) {
                    finish(null, 'Code frame exceeded 1 MiB');
                    return;
                } let n; while ((n = buffer.indexOf(10)) >= 0) {
                    const line = buffer.subarray(0, n);
                    buffer = buffer.subarray(n + 1);
                    try {
                        void dispatch(JSON.parse(line.toString())).catch(e => finish(null, e.message));
                    }
                    catch {
                        finish(null, 'Malformed code worker frame');
                    }
                } });
                child.stdin.write(JSON.stringify({ type: 'start', code: a.code, capabilityIds: caps, wallMs }) + '\n');
                return { jobId, jobState: 'running', operationId: c.operationId, capabilityRevisions: Object.fromEntries(caps.map(id => [id, r.get(id).revision])), readOnly: readonly };
            } });
}
