import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { callIpc, runtimeDir } from '../../packages/core/src/ipc.js';
import { sleep, sha } from '../../packages/protocol/src/index.js';
import { data, error } from '../support/fixture.js';
test('I25 real daemon singleton, authenticated owner-only IPC, frontend loss and agent restart retain file receipts', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-daemon-test-')), state = path.join(dir, 'state'), root = path.join(dir, 'root');
    fs.mkdirSync(root);
    const agent = path.resolve(import.meta.dirname, '../../apps/agent/src/main.js');
    let child: any;
    const start = async () => { child = spawn(process.execPath, [agent, state], { stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, HOME: os.homedir() } }); let diagnostic = ''; child.stderr.on('data', (b: Buffer) => diagnostic += b.toString()); for (let i = 0; i < 80; i++) {
        await sleep(50);
        try {
            const token = fs.readFileSync(path.join(state, 'secrets/admin'), 'utf8');
            const r = await callIpc(path.join(runtimeDir(state), 'admin.sock'), token, 'status', {}, 1000);
            if (r.data)
                return;
        }
        catch { }
    } throw new Error('Daemon not ready: ' + diagnostic); };
    const owner = (method: string, args: any = {}) => callIpc(path.join(runtimeDir(state), 'admin.sock'), fs.readFileSync(path.join(state, 'secrets/admin'), 'utf8'), method, args, 10000);
    const tool = (method: string, args: any = {}) => callIpc(path.join(runtimeDir(state), 'tools.sock'), fs.readFileSync(path.join(state, 'secrets/frontend'), 'utf8'), method, args, 10000);
    try {
        await start();
        const second = spawnSync(process.execPath, [agent, state], { encoding: 'utf8', timeout: 5000 });
        assert.notEqual(second.status, 0);
        assert.match(second.stderr, /already owns this installation/);
        assert.equal(fs.statSync(path.join(runtimeDir(state), 'admin.sock')).mode & 0o777, 0o600);
        error(await callIpc(path.join(runtimeDir(state), 'tools.sock'), 'wrong', 'status', {}), 'UNAUTHENTICATED');
        const identity = await owner('identity');
        await owner('grant.add', { root, alias: 'fixture', access: 'write' });
        const ws = data(await tool('open_workspace', { deviceId: identity.id, rootAlias: 'fixture', access: 'write', idempotencyKey: 'open' }));
        const desc = data(await tool('describe', { workspaceId: ws.workspaceId, capabilityIds: ['files.write'] }));
        const args = { workspaceId: ws.workspaceId, writerEpoch: ws.writerEpoch, idempotencyKey: 'write-once', capabilityId: 'files.write', revision: desc.capabilities[0].revision, arguments: { path: 'result.txt', text: 'one execution', expectedSha256: null } };
        const first = await tool('invoke', args);
        data(first);
        const pid = child.pid;
        await owner('restart');
        await new Promise<void>(r => child.once('exit', () => r()));
        await start();
        assert.notEqual(child.pid, pid);
        const retry = await tool('invoke', args);
        data(retry);
        assert.equal(retry.operationId, first.operationId);
        assert.equal(fs.readFileSync(path.join(root, 'result.txt'), 'utf8'), 'one execution');
        const read = data(await tool('read_file', { workspaceId: ws.workspaceId, path: 'result.txt', expectedSha256: sha('one execution') }));
        assert.equal(read.text, 'one execution');
        const report = await owner('diagnostics');
        assert.equal(report.includesCredentials, false);
        assert.equal(report.includesContent, false);
        await owner('stop');
        await new Promise<void>(r => child.once('exit', () => r()));
    }
    finally {
        child?.kill('SIGKILL');
        await sleep(25);
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
