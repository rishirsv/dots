import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createApplication } from '../../packages/core/src/application.js';
import { id, sha } from '../../packages/protocol/src/index.js';
export function data(result: any) { assert.equal(result.error, undefined, JSON.stringify(result.error)); return result.data; }
export function error(result: any, code: string) { assert.equal(result.error?.code, code, JSON.stringify(result)); return result.error; }
export async function fixture() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-test-')), root = path.join(dir, 'root'), state = path.join(dir, 'state');
    fs.mkdirSync(root);
    const app = createApplication(state), actor = app.broker.localActor();
    app.broker.addGrant({ root, alias: 'fixture', access: 'write', families: ['*'] });
    const ws = data(await app.broker.openWorkspace(actor, { deviceId: actor.deviceId, rootAlias: 'fixture', access: 'write', idempotencyKey: 'open-fixture' }));
    const call = (capabilityId: string, args: any, key = id('request'), override: any = {}) => app.broker.invoke(actor, { workspaceId: ws.workspaceId, writerEpoch: ws.writerEpoch, idempotencyKey: key, capabilityId, revision: app.registry.get(capabilityId).revision, arguments: args, ...override });
    const put = (name: string, text: string | Buffer) => { fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); fs.writeFileSync(path.join(root, name), text); return sha(text); };
    return { ...app, actor, ws, dir, root, state, call, put, async close() { await new Promise(r => setTimeout(r, 25)); app.store.close(); fs.rmSync(dir, { recursive: true, force: true }); } };
}
export function seedJob(f: any, name = 'job_fixture') {
    const op = f.store.accept({ accountId: f.actor.accountId, deviceId: f.actor.deviceId, workspaceId: f.ws.workspaceId, key: name, hash: sha(name), capability: 'terminal.exec', revision: 'fixture' }).row;
    f.store.run('INSERT INTO jobs(id,operation_id,workspace_id,kind,worker_id,boot_id,state,deadline,lease_deadline,mutating,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', name, op.id, f.ws.workspaceId, 'command', 'worker-fixture', 'fixture-boot', 'running', Date.now() + 100000, Date.now() + 100000, 1, Date.now(), Date.now());
    return { jobId: name, operationId: op.id };
}
