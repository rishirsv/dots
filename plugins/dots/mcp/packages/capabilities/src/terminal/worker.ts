import fs from 'node:fs';
import os from 'node:os';
import { LocalStore, bootId } from '../../../storage/src/local.js';
import { serveIpc, secretFile } from '../../../core/src/ipc.js';
import { CodexClient, executorAvailability } from '../../../codex-adapter/src/index.js';
import { OutputSpool } from './spool.js';
import { check, requestHash, ok, err, PortalError, TERMINAL, sleep } from '../../../protocol/src/index.js';
const [stateDir, jobId] = process.argv.slice(2);
const store = new LocalStore(stateDir);
const row = store.one('SELECT * FROM jobs WHERE id=?', jobId);
check(row && !TERMINAL.has(row.state) && row.boot_id === bootId(), 'OUTCOME_UNKNOWN', 'Worker cannot re-run an old job');
const config = JSON.parse(store.one('SELECT config FROM worker_configs WHERE job_id=?', jobId).config);
const gate = executorAvailability(stateDir);
check(gate.available, 'EXECUTOR_UPGRADE_REQUIRED', 'Worker requires the qualified binary');
check(config.binary === gate.qualification!.binary, 'EXECUTOR_UPGRADE_REQUIRED', 'Executor binding changed');
const client = new CodexClient(config.binary, { ...config.env, HOME: os.homedir(), TMPDIR: config.scratch }), spool = new OutputSpool(store);
let cancelRequested = false, finished = false, started = false, terminating = false;
const persist = (state: string, result: any) => { if (finished)
    return; finished = true; store.tx(() => { store.run('UPDATE jobs SET state=?,exit_code=?,signal=?,updated_at=? WHERE id=?', state, result.exitCode ?? null, result.signal ?? null, Date.now(), jobId); if (state !== 'outcome_unknown')
    store.run('UPDATE writer_leases SET operation_id=NULL,quiescent=1 WHERE workspace_id=? AND operation_id=?', row.workspace_id, row.operation_id); }); store.finish(row.operation_id, result.error ? err(new PortalError(state === 'outcome_unknown' ? 'OUTCOME_UNKNOWN' : 'CAPABILITY_UNAVAILABLE', result.error, {}, 'after_status_check'), { operationId: row.operation_id, state: state as any }) : ok({ jobId, jobState: state, exitCode: result.exitCode ?? null, signal: result.signal ?? null }, { operationId: row.operation_id, state: state === 'cancelled' ? 'cancelled' : 'succeeded' })); };
const cancel = async () => { cancelRequested = true; if (finished || terminating)
    return; terminating = true; store.run("UPDATE jobs SET state='cancel_requested' WHERE id=?", jobId); if (started) {
    try {
        await client.call('command/exec/terminate', { processId: jobId }, 2000);
    }
    catch { }
} setTimeout(() => { if (!finished) {
    client.stop();
    persist('outcome_unknown', { error: 'Forced executor termination: descendant quiescence could not be confirmed' });
} }, 3000).unref(); };
const server = await serveIpc(row.control_socket, secretFile(row.control_secret_ref), async (method, args) => { if (method === 'status')
    return { jobId, workerId: row.worker_id, bootId: row.boot_id, pid: process.pid, jobState: store.one('SELECT state FROM jobs WHERE id=?', jobId).state }; check(['stdin', 'resize', 'cancel', 'renew'].includes(method), 'FORBIDDEN', 'Unsupported worker control'); if (method === 'renew') {
    check(Number.isSafeInteger(args.leaseDeadline) && args.leaseDeadline <= row.deadline, 'INVALID_ARGUMENT', 'Invalid lease');
    store.run('UPDATE jobs SET lease_deadline=? WHERE id=?', args.leaseDeadline, jobId);
    return { renewed: true };
} const hash = requestHash({ method, args }), prior = store.one('SELECT * FROM worker_controls WHERE operation_id=?', args.operationId); if (prior) {
    check(prior.request_hash === hash, 'IDEMPOTENCY_CONFLICT', 'Worker control key changed');
    return prior.result ? JSON.parse(prior.result) : err(new PortalError('OUTCOME_UNKNOWN', 'Previous control may have executed', {}, 'after_status_check'));
} store.run('INSERT INTO worker_controls VALUES(?,?,?,?,?)', args.operationId, jobId, hash, 'intent', null); let result; try {
    if (method === 'cancel') {
        await cancel();
        result = { jobId, cancelRequested: true };
    }
    else {
        check(started && !finished, 'FORBIDDEN', 'Command is not interactive');
        result = await client.call(method === 'stdin' ? 'command/exec/write' : 'command/exec/resize', method === 'stdin' ? { processId: jobId, deltaBase64: args.base64 ?? Buffer.from(args.text ?? '').toString('base64'), closeStdin: args.closeStdin ?? false } : { processId: jobId, size: { rows: args.rows, cols: args.cols } }, 5000);
    }
    store.run("UPDATE worker_controls SET state='succeeded',result=? WHERE operation_id=?", JSON.stringify(result ?? {}), args.operationId);
    return result ?? {};
}
catch (e) {
    result = err(e);
    store.run("UPDATE worker_controls SET state='outcome_unknown',result=? WHERE operation_id=?", JSON.stringify(result), args.operationId);
    return result;
} });
const monitor = setInterval(() => { const current = store.one('SELECT state,lease_deadline,deadline FROM jobs WHERE id=?', jobId); if (current.state === 'cancel_requested' || Date.now() > current.deadline || Date.now() > current.lease_deadline)
    void cancel(); }, 500);
client.on('output', (p: any) => { if (p.processId !== jobId || finished)
    return; check(['stdout', 'stderr'].includes(p.stream) && typeof p.deltaBase64 === 'string', 'INVALID_ARGUMENT', 'Unexpected output frame'); spool.append(jobId, config.tty ? 'pty' : p.stream, Buffer.from(p.deltaBase64, 'base64')); });
try {
    await client.start();
    store.run("UPDATE jobs SET state='running',pid=?,process_start=?,updated_at=? WHERE id=?", process.pid, String(process.uptime()), Date.now(), jobId);
    started = true;
    const final = await client.call('command/exec', { command: config.command, cwd: config.cwd, sandboxPolicy: config.sandboxPolicy, processId: jobId, tty: config.tty, size: { rows: config.rows, cols: config.cols }, streamStdoutStderr: true, disableOutputCap: true, timeoutMs: config.timeoutMs }, config.timeoutMs + 10000);
    if (!finished) {
        persist(cancelRequested ? 'cancelled' : 'succeeded', { exitCode: final.exitCode, signal: final.signal });
        store.event(row.operation_id, 'executor_trace', { methods: client.trace, upstreamTruncated: final.stdoutTruncated ?? final.stderrTruncated ?? false });
    }
}
catch (e) {
    persist(started ? 'outcome_unknown' : 'interrupted', { error: e instanceof Error ? e.message : 'Executor failed' });
}
finally {
    clearInterval(monitor);
    client.stop();
    await server.close();
    store.close();
}
