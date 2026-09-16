import fs from 'node:fs';
import path from 'node:path';
import { createApplication } from '../../../packages/core/src/application.js';
import { native } from '../../../packages/core/src/rooted-fs.js';
import { runtimeDir, secretFile, serveIpc, callIpc } from '../../../packages/core/src/ipc.js';
import { bootId } from '../../../packages/storage/src/local.js';
import { err, check, ok, PortalError, TERMINAL, sleep } from '../../../packages/protocol/src/index.js';
import { PowerMonitor } from './power.js';
import { DeviceTransport } from './relay-transport.js';
export async function runAgent(stateDir: string) {
    fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
    const lock = fs.openSync(path.join(stateDir, 'agent.lock'), 'a+', 0o600);
    try {
        native.lock(lock);
    }
    catch {
        fs.closeSync(lock);
        throw new PortalError('WRITER_BUSY', 'Another Portal agent already owns this installation');
    }
    const app = createApplication(stateDir), { store, broker, skills, frontDoor } = app;
    const runtime = runtimeDir(stateDir);
    let closing = false;
    let tools: any, admin: any;
    const relay = new DeviceTransport(app);
    let ready = true;
    async function reconcile() { if (closing)
        return; for (const j of store.all("SELECT * FROM jobs WHERE state IN ('accepted','running','cancel_requested')")) {
        if (j.boot_id !== bootId()) {
            store.run("UPDATE jobs SET state='interrupted',updated_at=? WHERE id=?", Date.now(), j.id);
            store.run('UPDATE writer_leases SET operation_id=NULL,quiescent=1 WHERE operation_id=?', j.operation_id);
            store.finish(j.operation_id, err(new PortalError('OUTCOME_UNKNOWN', 'Host reboot interrupted the old job; it will not be rerun', {}, 'after_status_check'), { operationId: j.operation_id, state: 'interrupted' }));
            continue;
        }
        if (j.kind === 'code') {
            if (Date.now() > j.deadline + 1000) {
                store.run("UPDATE jobs SET state='interrupted' WHERE id=?", j.id);
                store.finish(j.operation_id, err(new PortalError('OUTCOME_UNKNOWN', 'Code parent ended without a durable result; inspect child receipts', {}, 'after_status_check'), { operationId: j.operation_id, state: 'interrupted' }));
            }
            continue;
        }
        try {
            const result = await callIpc(j.control_socket, fs.readFileSync(j.control_secret_ref, 'utf8'), 'status', {}, 1000);
            check(result.workerId === j.worker_id && result.bootId === j.boot_id, 'OUTCOME_UNKNOWN', 'Worker identity mismatch');
            const healthy = store.setting<string>('transport', 'local') !== 'relay' || relay.healthy;
            const grant = store.one('SELECT g.revoked,g.expires_at,g.revision,w.grant_revision FROM grants g JOIN workspaces w ON w.grant_id=g.id WHERE w.id=?', j.workspace_id);
            if (healthy && grant && !grant.revoked && grant.expires_at > Date.now() && grant.revision === grant.grant_revision && j.state !== 'cancel_requested')
                await callIpc(j.control_socket, fs.readFileSync(j.control_secret_ref, 'utf8'), 'renew', { leaseDeadline: Math.min(j.deadline, Date.now() + 300000) }, 1000);
            else if (j.state === 'cancel_requested' || !grant || grant.revoked || grant.expires_at <= Date.now())
                await callIpc(j.control_socket, fs.readFileSync(j.control_secret_ref, 'utf8'), 'cancel', { operationId: 'revoke:' + j.id }, 1000);
        }
        catch {
            if (Date.now() - j.created_at > 10000) {
                store.run("UPDATE jobs SET state='outcome_unknown' WHERE id=?", j.id);
                store.finish(j.operation_id, err(new PortalError('OUTCOME_UNKNOWN', 'Worker control is unreachable; descendant quiescence is not established', {}, 'after_status_check'), { operationId: j.operation_id })); /* keep its writer gate: a lost socket is not proof of process death */
            }
        }
    } broker.reconcileOperations(); }
    const stop = async (preserve = false) => {
        if (closing)
            return;
        closing = true;
        broker.accepting = false;
        clearInterval(timer);
        power.stop();
        relay.stop();
        if (!preserve) {
            store.run("UPDATE jobs SET state='cancel_requested' WHERE state IN ('accepted','running')");
            const end = Date.now() + 8000;
            while (Date.now() < end && store.one("SELECT COUNT(*) n FROM jobs WHERE state IN ('accepted','running','cancel_requested')").n) {
                for (const j of store.all("SELECT * FROM jobs WHERE state='cancel_requested' AND kind='command'")) {
                    try {
                        await callIpc(j.control_socket, fs.readFileSync(j.control_secret_ref, 'utf8'), 'cancel', { operationId: 'stop:' + j.id }, 1000);
                    }
                    catch { }
                }
                await sleep(100);
            }
        }
        const unknown = store.all("SELECT id,state FROM jobs WHERE state IN ('accepted','running','cancel_requested','outcome_unknown')");
        setTimeout(() => { void (async () => { await tools?.close(); await admin?.close(); store.close(); fs.closeSync(lock); process.exit(0); })(); }, 100);
        return { stopped: true, preservedWorkers: preserve, unconfirmedJobs: unknown };
    };
    const toolHandler = async (method: string, args: any) => { if (method === 'meta.tools')
        return { tools: frontDoor.tools }; if (method === 'skills/list')
        return skills.staticList(args.cursor); if (method === 'skills/get')
        return skills.staticGet(args.uri); if (method === 'resources/read')
        return skills.resource(args.uri); const actor = { ...broker.localActor(), transport: 'private' as const }; check(store.setting<string>('transport', 'local') !== 'relay', 'FORBIDDEN', 'Private frontend is disabled while hosted relay is the active transport'); return frontDoor.call(actor, method, args); };
    tools = await serveIpc(path.join(runtime, 'tools.sock'), secretFile(path.join(stateDir, 'secrets', 'frontend')), toolHandler);
    admin = await serveIpc(path.join(runtime, 'admin.sock'), secretFile(path.join(stateDir, 'secrets', 'admin')), async (method, args) => { switch (method) {
        case 'stop': return stop(false);
        case 'restart': return stop(true);
        case 'grant.add': return broker.addGrant(args);
        case 'grant.list': return store.all('SELECT * FROM grants');
        case 'grant.revoke': return broker.revokeGrant(args.grantId);
        case 'approval.list': return store.all("SELECT id,scope,state,expires_at FROM approvals WHERE state='pending'");
        case 'approval.approve': return broker.approve(args.approvalId);
        case 'skills.add-root': {
            const canonical = fs.realpathSync(args.path);
            check(/^[a-z][a-z0-9-]{0,30}$/.test(args.alias) && args.alias !== 'builtin', 'INVALID_ARGUMENT', 'Choose a non-builtin namespace');
            store.run('INSERT INTO skill_roots(alias,path,grant_id) VALUES(?,?,?) ON CONFLICT(alias) DO UPDATE SET path=excluded.path,grant_id=excluded.grant_id,enabled=1', args.alias, canonical, args.grantId ?? null);
            return { alias: args.alias, path: canonical };
        }
        case 'skills.list': return skills.discover('', args.grantId);
        case 'skills.refresh': return { ...skills.discover('', args.grantId), refreshed: true };
        case 'configure':
            check(['transport', 'tunnel', 'python'].includes(args.key), 'INVALID_ARGUMENT', 'Unknown local configuration');
            if (args.key === 'transport')
                check(['local', 'tunnel', 'relay'].includes(args.value), 'INVALID_ARGUMENT', 'Unknown transport profile');
            store.setSetting(args.key, args.value);
            if (args.key === 'python')
                process.env.PORTAL_PYTHON = args.value;
            relay.reconnect();
            return { configured: args.key, value: args.value };
        case 'pair.bind':
            check(!store.one("SELECT id FROM workspaces WHERE state IN ('open','closing')"), 'WRITER_BUSY', 'Close all workspaces before changing the account binding');
            store.run('UPDATE device_identity SET id=?,account_id=?,relay=?,credential_ref=?,credential_generation=?,revoked=0,connection_epoch=0', args.deviceId, args.accountId, args.relay, args.credentialRef, args.generation);
            store.setSetting('testProfile', !!args.testProfile);
            store.setSetting('transport', 'relay');
            relay.reconnect();
            return { paired: true, deviceId: args.deviceId, accountId: args.accountId };
        case 'identity': return store.identity();
        case 'status': return broker.status(broker.localActor());
        case 'call': return frontDoor.call(broker.localActor(), args.tool, args.arguments);
        case 'backup':
            await store.backup(args.destination);
            return { backup: args.destination };
        case 'emergency-revoke':
            store.run('UPDATE device_identity SET revoked=1,connection_epoch=connection_epoch+1');
            store.run('UPDATE grants SET revoked=1,revision=revision+1');
            return stop(false);
        case 'diagnostics': return { version: '0.1.0', platform: process.platform, arch: process.arch, journal: store.integrity(), operations: store.all('SELECT state,COUNT(*) count FROM operations GROUP BY state'), jobs: store.all('SELECT state,kind,COUNT(*) count FROM jobs GROUP BY state,kind'), unavailable: app.registry.all().filter(x => !x.availability().available).map(x => ({ id: x.id, ...x.availability() })), includesContent: false, includesCredentials: false };
        default: throw new PortalError('NOT_FOUND', 'Unknown local owner action');
    } });
    store.identity();
    if (store.setting<string | undefined>('python', undefined))
        process.env.PORTAL_PYTHON = store.setting('python', '');
    store.run("UPDATE searches SET state='interrupted' WHERE state='running'");
    await reconcile();
    relay.start();
    const timer = setInterval(() => void reconcile().catch(() => { }), 2000);
    const power = new PowerMonitor();
    power.on('change', (event: any) => { broker.accepting = false; store.setSetting('lastPowerEvent', { ...event, observedAt: new Date().toISOString() }); relay.reconnect(); void reconcile().finally(() => { if (!closing)
        broker.accepting = true; }); });
    power.start();
    process.on('SIGTERM', () => void stop(false));
    process.on('SIGINT', () => void stop(false));
    console.error(JSON.stringify({ product: 'Portal', event: 'agent-ready', deviceId: store.identity().id, runtime }));
}
if (import.meta.url === new URL('file://' + process.argv[1]).href)
    await runAgent(process.argv[2]);
