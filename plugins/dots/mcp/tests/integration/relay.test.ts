import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { randomBytes } from 'node:crypto';
import { missingDependencies, until } from '../support/dependencies.js';
import { startTestIssuer, TEST_SCOPES } from '../support/oidc-issuer.js';
import { createRelay } from '../../apps/relay/src/main.js';
import { createApplication } from '../../packages/core/src/application.js';
import { DeviceTransport } from '../../apps/agent/src/relay-transport.js';
import { SecretStore } from '../../packages/core/src/secrets.js';
import { sha } from '../../packages/protocol/src/index.js';
const missing = missingDependencies(['pg', 'ws', 'jose', 'zod', '@modelcontextprotocol/sdk']);
const blocker = missing.length ? 'Not exercised: dependencies missing: ' + missing.join(',') : process.env.PORTAL_RELAY_TEST !== '1' || !process.env.TEST_DATABASE_URL ? 'Not exercised: PORTAL_RELAY_TEST=1 and isolated TEST_DATABASE_URL required' : false;
async function unusedPort() { const s = net.createServer(); await new Promise<void>(r => s.listen(0, '127.0.0.1', r)); const port = (s.address() as any).port; await new Promise<void>(r => s.close(() => r())); return port as number; }
test('E06 real PostgreSQL / OAuth / WebSocket / MCP two-account two-device routing, dedupe, restart cache and revocation', { skip: blocker, timeout: 120000 }, async () => {
    const dbUrl = new URL(process.env.TEST_DATABASE_URL!);
    assert.match(dbUrl.pathname, /portal_test/, 'Use a disposable database whose name contains portal_test');
    const { Pool } = await import('pg');
    const admin = new Pool({ connectionString: dbUrl.href });
    const schema = 'portal_test_' + randomBytes(8).toString('hex');
    await admin.query(`CREATE SCHEMA ${schema}`);
    dbUrl.searchParams.set('options', '-c search_path=' + schema);
    const port = await unusedPort(), origin = 'http://127.0.0.1:' + port, issuer = await startTestIssuer({ enabled: true, audience: 'portal-test', redirects: [origin + '/owner/callback'] });
    const config = { databaseUrl: dbUrl.href, issuer: issuer.origin, audience: 'portal-test', jwksUri: issuer.origin + '/jwks', publicOrigin: origin, testOnly: true, host: '127.0.0.1', port, ownerClientId: 'portal-test-owner', authorizationEndpoint: issuer.origin + '/authorize', tokenEndpoint: issuer.origin + '/token' };
    let relay: any;
    const fixtures: any[] = [], clients: any[] = [];
    const request = async (route: string, subject: string, body?: any) => { const response = await fetch(origin + route, { method: body ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + issuer.issue(subject), 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined, redirect: 'manual' }); return { response, value: response.headers.get('content-type')?.includes('json') ? await response.json() : await response.text() }; };
    try {
        relay = await createRelay(config);
        for (const subject of ['alice', 'bob']) {
            const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-relay-e2e-')), root = path.join(dir, 'root');
            fs.mkdirSync(root);
            fs.writeFileSync(path.join(root, 'identity.txt'), subject);
            const app = createApplication(path.join(dir, 'state')), key = randomBytes(32).toString('base64url'), poll = randomBytes(32).toString('base64url'), fingerprint = sha(key).slice(0, 16);
            const response = await fetch(origin + '/device/pair/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ installationId: app.store.identity().installation_id, label: subject + ' fixture', credentialHash: sha(key), pollingHash: sha(poll), fingerprint }) });
            assert.equal(response.status, 200);
            const intent: any = await response.json();
            const approval = await request('/owner/pair/' + intent.pairingId, subject, { code: intent.code, fingerprint });
            assert.equal(approval.response.status, 200);
            const polled: any = await (await fetch(origin + '/device/pair/status/' + intent.pairingId, { headers: { Authorization: 'Bearer ' + poll } })).json();
            assert.equal(polled.state, 'approved');
            const ref = 'fixture:' + randomBytes(16).toString('hex'), secrets = new SecretStore(app.store.dir, true);
            secrets.put(ref, key);
            app.store.run('UPDATE device_identity SET id=?,account_id=?,relay=?,credential_ref=?,credential_generation=1', polled.deviceId, polled.accountId, origin, ref);
            app.store.setSetting('testProfile', true);
            app.store.setSetting('transport', 'relay');
            app.broker.addGrant({ root, alias: 'fixture', access: 'write', families: ['*'] });
            const transport = new DeviceTransport(app);
            fixtures.push({ subject, dir, root, app, transport, secrets, ref, deviceId: polled.deviceId, key, intent });
            transport.start();
        }
        await until(() => relay.connections.size, n => n === 2);
        const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
        const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
        const clientFor = async (subject: string) => { const client = new Client({ name: 'portal-relay-test', version: '1' }, { capabilities: {} }); await client.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { requestInit: { headers: { Authorization: 'Bearer ' + issuer.issue(subject) } } })); clients.push(client); return client; };
        const invoke = async (client: any, name: string, args: any) => { const response = await client.callTool({ name, arguments: args }); let r = response.structuredContent; if (r?.state === 'accepted' && r.operationId) {
            r = await until(async () => { const x = await client.callTool({ name: 'get_operation', arguments: { operationId: r.operationId } }); return x.structuredContent; }, x => x.state !== 'accepted' && x.state !== 'running', 20000);
        } return r; };
        for (const fixture of fixtures) {
            fixture.client = await clientFor(fixture.subject);
            const opened = await invoke(fixture.client, 'open_workspace', { deviceId: fixture.deviceId, rootAlias: 'fixture', access: 'write', idempotencyKey: 'open-' + fixture.subject });
            assert.equal(opened.state, 'succeeded', JSON.stringify(opened));
            fixture.ws = opened.data;
            const read = await invoke(fixture.client, 'read_file', { workspaceId: fixture.ws.workspaceId, path: 'identity.txt' });
            assert.equal(read.data.text, fixture.subject);
        }
        const [alice, bob] = fixtures;
        const denied = await invoke(bob.client, 'read_file', { workspaceId: alice.ws.workspaceId, path: 'identity.txt' });
        assert.equal(Boolean(denied.error), true);
        const desc = await invoke(alice.client, 'describe', { workspaceId: alice.ws.workspaceId, capabilityIds: ['files.write'] });
        const a = { workspaceId: alice.ws.workspaceId, writerEpoch: alice.ws.writerEpoch, idempotencyKey: 'once', capabilityId: 'files.write', revision: desc.data.capabilities[0].revision, arguments: { path: 'once.txt', text: 'once', expectedSha256: null } };
        const first = await invoke(alice.client, 'invoke', a), again = await invoke(alice.client, 'invoke', a);
        assert.equal(first.operationId, again.operationId);
        assert.equal(fs.readFileSync(path.join(alice.root, 'once.txt'), 'utf8'), 'once');
        for (const c of clients)
            await c.close();
        clients.length = 0;
        await relay.close();
        relay = await createRelay(config);
        for (const f of fixtures)
            f.transport.reconnect();
        await until(() => relay.connections.size, n => n === 2);
        alice.client = await clientFor('alice');
        alice.transport.stop();
        await until(() => relay.connections.has(alice.deviceId), n => !n);
        const cached = await invoke(alice.client, 'get_operation', { operationId: first.operationId });
        assert.equal(cached.state, 'succeeded');
        assert.equal(cached.freshness, 'stale');
        await relay.revoke(bob.app.store.identity().account_id, bob.deviceId);
        await until(() => bob.app.store.identity().revoked, n => n === 1);
        const status = await fetch(origin + '/device/credentials/status', { headers: { Authorization: 'Bearer ' + bob.key } });
        assert.equal(status.status, 401);
    }
    finally {
        for (const c of clients)
            await c.close().catch(() => { });
        for (const f of fixtures)
            f.transport.stop();
        await new Promise(r => setTimeout(r, 150));
        if (relay)
            await relay.close().catch(() => { });
        for (const f of fixtures) {
            f.secrets.delete(f.ref);
            f.app.store.close();
            fs.rmSync(f.dir, { recursive: true, force: true });
        }
        await issuer.close();
        await admin.query(`DROP SCHEMA ${schema} CASCADE`);
        await admin.end();
    }
});
