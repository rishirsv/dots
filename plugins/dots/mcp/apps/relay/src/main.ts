import fs from 'node:fs';
import path from 'node:path';
import http, { IncomingMessage, ServerResponse } from 'node:http';
import { randomBytes } from 'node:crypto';
import { RelayStore } from '../../../packages/storage/src/postgres.js';
import { OAuthResourceServer, AuthConfig, Principal } from './auth.js';
import { check, PortalError, err, ok, id, sha, validate, s, requestHash, sleep } from '../../../packages/protocol/src/index.js';
import { makeMcpServer } from '../../mcp-local/src/server.js';
import { ownerDashboard } from '../../dashboard/src/index.js';
export interface RelayConfig extends AuthConfig {
    databaseUrl: string;
    host: string;
    port: number;
}
async function body(req: IncomingMessage) { const chunks: Buffer[] = []; let n = 0; for await (const data of req) {
    const b = Buffer.from(data);
    n += b.length;
    check(n <= 1048576, 'LIMIT_EXCEEDED', 'HTTP request exceeds 1 MiB');
    chunks.push(b);
} const text = Buffer.concat(chunks).toString('utf8'); return (req.headers['content-type'] ?? '').startsWith('application/x-www-form-urlencoded') ? Object.fromEntries(new URLSearchParams(text)) : text ? JSON.parse(text) : {}; }
export async function createRelay(config: RelayConfig) {
    const store = await RelayStore.connect(config.databaseUrl), auth = new OAuthResourceServer(config, store), root = path.resolve(import.meta.dirname, '../../../..');
    const metadata = JSON.parse(fs.readFileSync(path.join(root, 'manifests/tools.json'), 'utf8')), catalogue = JSON.parse(fs.readFileSync(path.join(root, 'manifests/capabilities.json'), 'utf8')), staticBundle = JSON.parse(fs.readFileSync(path.join(root, 'manifests/skills.json'), 'utf8'));
    const connections = new Map<string, {
        socket: any;
        epoch: number;
        accountId: string;
        confirmed: number;
    }>(), rate = new Map<string, {
        count: number;
        until: number;
    }>();
    let stopped = false, ticking = false;
    const json = (res: ServerResponse, value: any, status = 200) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
    const frame = (deviceId: string, value: any) => { const c = connections.get(deviceId); check(c && c.socket.readyState === 1, 'DEVICE_OFFLINE', 'Device is offline'); check(c.socket.bufferedAmount < 4 * 1024 * 1024, 'OVERLOADED', 'Relay device socket is backed up'); c.socket.send(JSON.stringify({ v: 1, deviceId, epoch: c.epoch, messageId: id('msg'), ...value })); };
    const revoke = async (accountId: string, deviceId: string) => { const rows = await store.query('UPDATE devices SET revoked=true,credential_generation=credential_generation+1 WHERE id=$1 AND account_id=$2 RETURNING id', [deviceId, accountId]); check(rows.length, 'NOT_FOUND', 'Device not found'); if (connections.has(deviceId)) {
        frame(deviceId, { type: 'revoke' });
        setTimeout(() => connections.get(deviceId)?.socket.close(1008, 'revoked'), 100);
    } };
    const deviceAuth = async (header?: string) => { check(header?.startsWith('Bearer '), 'UNAUTHENTICATED', 'Device credential required'); const hash = sha(header!.slice(7)); const [d] = await store.query('SELECT * FROM devices WHERE revoked=false AND (credential_hash=$1 OR (previous_credential_hash=$1 AND previous_credential_expires>now()))', [hash]); check(d, 'UNAUTHENTICATED', 'Device credential is invalid or revoked'); return d; };
    const live = (deviceId: string) => { const c = connections.get(deviceId); return Boolean(c && c.socket.readyState === 1 && Date.now() - c.confirmed < 45000); };
    const cached = (row: any) => { if (row.result_expired)
        return err(new PortalError('RESULT_EXPIRED', 'Relay payload expired; the operation will not run again', { operationId: row.id, knownOutcome: row.state }, 'never'), { operationId: row.id, source: 'relay-cache', freshness: 'stale' }); if (row.result)
        return { ...row.result, source: 'relay-cache', freshness: live(row.device_id) ? 'live' : 'stale' }; return ok({ deviceId: row.device_id, dispatchDeadline: row.dispatch_deadline }, { operationId: row.id, state: row.state === 'dispatched' ? 'accepted' : row.state, source: 'relay-cache', freshness: live(row.device_id) ? 'live' : 'stale' }); };
    const tool = async (principal: Principal, name: string, args: any) => {
        auth.require(principal, 'portal:read');
        const definition = metadata.tools.find((t: any) => t.name === name);
        check(definition, 'NOT_FOUND', 'Unknown tool');
        validate(definition.inputSchema, args);
        if (name === 'status' && !args.deviceId && !args.workspaceId) {
            const devices = await store.query('SELECT id,label,revoked,agent_version,last_heartbeat FROM devices WHERE account_id=$1 ORDER BY created_at', [principal.accountId]);
            return ok({ devices: devices.map((d: any) => ({ ...d, connected: live(d.id), freshness: live(d.id) ? 'live' : 'stale' })), workspaces: await store.query('SELECT id,device_id,summary FROM workspace_summaries WHERE account_id=$1', [principal.accountId]) }, { source: 'relay-cache', freshness: 'stale' });
        }
        let deviceId = args.deviceId, workspaceId = args.workspaceId ?? '__device__';
        if (name === 'get_operation') {
            check(Boolean(args.operationId) !== Boolean(args.workspaceId || args.idempotencyKey) && (!args.workspaceId || Boolean(args.idempotencyKey)) && (!args.idempotencyKey || Boolean(args.workspaceId)), 'INVALID_ARGUMENT', 'Use only operationId OR workspaceId plus idempotencyKey');
            if (args.operationId) {
                const row = await store.cached(principal.accountId, args.operationId);
                if (row)
                    return cached(row);
                const [route] = await store.query('SELECT * FROM operation_routes WHERE id=$1 AND account_id=$2', [args.operationId, principal.accountId]);
                check(route, 'NOT_FOUND', 'Operation is not routed for this account');
                deviceId = route.device_id;
                workspaceId = route.workspace_id;
            }
            else {
                check(args.workspaceId && args.idempotencyKey, 'INVALID_ARGUMENT', 'Use operationId OR workspaceId and key');
                const [row] = await store.query('SELECT * FROM operations WHERE account_id=$1 AND workspace_id=$2 AND idempotency_key=$3', [principal.accountId, args.workspaceId, args.idempotencyKey]);
                if (row)
                    return cached(row);
            }
        }
        if (!deviceId && workspaceId !== '__device__') {
            const [ws] = await store.query('SELECT * FROM workspace_summaries WHERE id=$1 AND account_id=$2', [workspaceId, principal.accountId]);
            check(ws, 'NOT_FOUND', 'Workspace not found for this account');
            deviceId = ws.device_id;
        }
        if (!deviceId && ['discover'].includes(name)) {
            return ok({ entries: catalogue.capabilities.filter((c: any) => (c.id + ' ' + c.description).toLowerCase().includes(args.query.toLowerCase())).slice(0, 10).map((c: any) => ({ id: c.id, description: c.description, revision: c.revision, availability: 'requires selected device/workspace' })) });
        }
        check(deviceId, 'INVALID_ARGUMENT', 'Select a device/workspace explicitly');
        const [device] = await store.query('SELECT * FROM devices WHERE id=$1 AND account_id=$2', [deviceId, principal.accountId]);
        check(device && !device.revoked, 'DEVICE_REVOKED', 'Device unavailable for this account');
        let effect = definition.annotations.readOnlyHint ? 'read' : 'write';
        let family = '';
        if (name === 'invoke') {
            const cap = catalogue.capabilities.find((c: any) => c.id === args.capabilityId);
            check(cap, 'NOT_FOUND', 'Capability not found');
            check(cap.revision === args.revision, 'CAPABILITY_CHANGED', 'Capability revision changed');
            effect = cap.effect;
            family = cap.family;
        }
        if (['exec_command', 'write_stdin', 'cancel_job'].includes(name))
            auth.require(principal, 'portal:exec');
        if (effect === 'write' && name !== 'open_workspace' || name === 'open_workspace' && args.access === 'write')
            auth.require(principal, 'portal:write');
        if (effect === 'spawn')
            auth.require(principal, 'portal:exec');
        if (effect === 'network')
            auth.require(principal, 'portal:network');
        if (family === 'documents')
            auth.require(principal, 'portal:documents');
        const key = args.idempotencyKey ?? id('read'), prior = (await store.query('SELECT * FROM operations WHERE account_id=$1 AND device_id=$2 AND workspace_id=$3 AND idempotency_key=$4', [principal.accountId, deviceId, workspaceId, key]))[0];
        if (!prior)
            check(connections.has(deviceId) && Date.now() - connections.get(deviceId)!.confirmed < 45000, 'DEVICE_OFFLINE', 'New work is not queued to a known-offline device');
        const row = await store.accept(principal.accountId, deviceId, workspaceId, key, { name, arguments: args }, principal.scopes);
        if (row.result || row.result_expired)
            return cached(row);
        await dispatch();
        const until = performance.now() + 1500;
        while (performance.now() < until) {
            const [current] = await store.query('SELECT * FROM operations WHERE id=$1 AND account_id=$2', [row.id, principal.accountId]);
            if (current.result)
                return cached(current);
            await sleep(50);
        }
        return cached(row);
    };
    async function dispatch() { if (ticking || stopped)
        return; ticking = true; try {
        const pending = await store.query("SELECT o.*,d.attempts,d.last_attempt FROM operations o JOIN dispatch_outbox d ON d.operation_id=o.id WHERE d.acknowledged=false AND o.state IN ('accepted','dispatched') ORDER BY o.created_at LIMIT 100");
        for (const op of pending) {
            if (new Date(op.dispatch_deadline).getTime() < Date.now()) {
                const result = err(new PortalError(op.attempts === 0 ? 'DISPATCH_DEADLINE_EXCEEDED' : 'OUTCOME_UNKNOWN', op.attempts === 0 ? 'Deadline expired before any dispatch attempt' : 'Dispatch may have reached the device; await device evidence, never blindly repeat', {}, 'after_status_check'), { operationId: op.id });
                await store.query('UPDATE operations SET state=$1,result=$2,updated_at=now() WHERE id=$3', [result.state, result, op.id]);
                continue;
            }
            if (!connections.has(op.device_id) || (op.last_attempt && Date.now() - new Date(op.last_attempt).getTime() < 2000))
                continue;
            await store.query("UPDATE dispatch_outbox SET attempts=attempts+1,last_attempt=now() WHERE operation_id=$1", [op.id]);
            await store.query("UPDATE operations SET state='dispatched' WHERE id=$1 AND state='accepted'", [op.id]);
            frame(op.device_id, { type: 'operation', operationId: op.id, accountId: op.account_id, scopes: op.scopes, name: op.request.name, arguments: op.request.arguments, deadline: new Date(op.dispatch_deadline).getTime() });
        }
    }
    finally {
        ticking = false;
    } }
    const server = http.createServer(async (req, res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'no-referrer');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; form-action 'self'");
        try {
            const url = new URL(req.url ?? '/', config.publicOrigin);
            if (url.pathname === '/internal/live')
                return json(res, { live: true });
            if (url.pathname === '/internal/ready') {
                await store.query('SELECT 1');
                return json(res, { ready: true });
            }
            check(req.headers.host === new URL(config.publicOrigin).host, 'FORBIDDEN', 'Unexpected Host header');
            if (req.headers.origin)
                check(req.headers.origin === config.publicOrigin || url.pathname === '/mcp' && req.headers.origin === 'https://chatgpt.com', 'FORBIDDEN', 'Unexpected Origin');
            if (url.pathname === '/.well-known/oauth-protected-resource' || url.pathname === '/.well-known/oauth-protected-resource/mcp')
                return json(res, auth.metadata());
            if (url.pathname === '/device/pair/start' && req.method === 'POST') {
                const ip = req.socket.remoteAddress ?? 'unknown', entry = rate.get(ip);
                if (!entry || entry.until < Date.now())
                    rate.set(ip, { count: 1, until: Date.now() + 3600000 });
                else {
                    entry.count++;
                    check(entry.count <= 30, 'OVERLOADED', 'Pairing rate limit exceeded');
                }
                if (rate.size > 10000)
                    for (const [k, v] of rate)
                        if (v.until < Date.now())
                            rate.delete(k);
                const a = await body(req);
                validate(s.object({ installationId: s.key(), label: s.string(100), credentialHash: s.sha(), pollingHash: s.sha(), fingerprint: s.string(16) }), a);
                check(a.fingerprint === a.credentialHash.slice(0, 16), 'INVALID_ARGUMENT', 'Fingerprint does not match credential hash');
                const pairingId = id('pair'), code = randomBytes(4).toString('hex').toUpperCase();
                await store.query('INSERT INTO pairing_intents(id,installation_id,label,credential_hash,polling_hash,code,fingerprint,expires_at) VALUES($1,$2,$3,$4,$5,$6,$7,now()+interval \'10 minutes\')', [pairingId, a.installationId, a.label, a.credentialHash, a.pollingHash, code, a.fingerprint]);
                return json(res, { pairingId, code, ownerUrl: config.publicOrigin + '/owner/pair/' + pairingId, expiresIn: 600 });
            }
            if (url.pathname.startsWith('/device/pair/status/')) {
                check(req.headers.authorization?.startsWith('Bearer '), 'UNAUTHENTICATED', 'Polling secret required');
                const [intent] = await store.query('SELECT * FROM pairing_intents WHERE id=$1 AND polling_hash=$2', [url.pathname.split('/').pop(), sha(req.headers.authorization!.slice(7))]);
                check(intent, 'UNAUTHENTICATED', 'Invalid pairing poll');
                const state = new Date(intent.expires_at).getTime() < Date.now() && intent.state === 'pending' ? 'expired' : intent.state;
                return json(res, { state, ...(state === 'approved' ? { deviceId: intent.device_id, accountId: intent.account_id, generation: 1 } : {}) });
            }
            if (url.pathname === '/device/unpair' && req.method === 'POST') {
                const d = await deviceAuth(req.headers.authorization);
                await revoke(d.account_id, d.id);
                return json(res, { revoked: true });
            }
            if (url.pathname === '/device/credentials/rotate' && req.method === 'POST') {
                const d = await deviceAuth(req.headers.authorization), a = await body(req);
                validate(s.object({ expectedGeneration: s.int(1), credentialHash: s.sha() }), a);
                const rows = await store.query("UPDATE devices SET previous_credential_hash=credential_hash,previous_credential_expires=now()+interval '30 seconds',credential_hash=$1,credential_generation=credential_generation+1 WHERE id=$2 AND credential_generation=$3 AND revoked=false RETURNING credential_generation", [a.credentialHash, d.id, a.expectedGeneration]);
                check(rows.length, 'IDEMPOTENCY_CONFLICT', 'Credential generation changed');
                return json(res, { generation: rows[0].credential_generation });
            }
            if (url.pathname === '/device/credentials/status') {
                const d = await deviceAuth(req.headers.authorization);
                return json(res, { deviceId: d.id, generation: d.credential_generation });
            }
            if (url.pathname.startsWith('/owner'))
                return await ownerDashboard(req, res, url, req.method === 'POST' ? await body(req) : {}, auth, store, revoke);
            if (url.pathname === '/mcp') {
                const principal = await auth.principal(req.headers.authorization);
                auth.require(principal, 'portal:read');
                const sdk = await makeMcpServer(metadata.tools, (name, args) => tool(principal, name, args), { staticList: () => ({ skills: staticBundle.skills }), staticGet: (uri: string) => { const skill = staticBundle.skills.find((s: any) => s.uri === uri); check(skill, 'NOT_FOUND', 'Public skill missing'); return { skill }; }, resource: (uri: string) => { const resource = staticBundle.resources[uri]; check(resource, 'NOT_FOUND', 'Public resource missing'); return { contents: [resource] }; } } as any);
                const { StreamableHTTPServerTransport } = await import('@modelcontextprotocol/sdk/server/streamableHttp.js');
                const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
                res.on('close', () => { void transport.close(); void sdk.close(); });
                await sdk.connect(transport);
                return await transport.handleRequest(req, res, req.method === 'POST' ? await body(req) : undefined);
            }
            if (url.pathname.startsWith('/results/')) {
                const p = await auth.principal(req.headers.authorization);
                auth.require(p, 'portal:read');
                const row = await store.cached(p.accountId, url.pathname.split('/').pop()!);
                check(row, 'NOT_FOUND', 'Result missing');
                return json(res, cached(row));
            }
            if (url.pathname.startsWith('/artifacts/')) {
                const p = await auth.principal(req.headers.authorization);
                auth.require(p, 'portal:read');
                const [a] = await store.query('SELECT * FROM artifact_routes WHERE id=$1 AND account_id=$2', [url.pathname.split('/').pop(), p.accountId]);
                check(a, 'NOT_FOUND', 'Artifact missing for account');
                check(connections.has(a.device_id), 'DEVICE_OFFLINE', 'Artifact bytes remain on the Mac; the device is offline');
                const cap = catalogue.capabilities.find((c: any) => c.id === 'artifacts.get');
                res.setHeader('Content-Type', a.mime_type);
                res.setHeader('Content-Disposition', `attachment; filename="${a.id}"`);
                let cursor: string | undefined;
                while (!res.destroyed) {
                    const result: any = await tool(p, 'invoke', { workspaceId: a.workspace_id, capabilityId: 'artifacts.get', revision: cap.revision, arguments: { artifactId: a.id, ...(cursor ? { cursor } : {}), maxBytes: 65536 } });
                    check(result.data?.base64 !== undefined, 'DEVICE_OFFLINE', 'Artifact page is not yet available');
                    const b = Buffer.from(result.data.base64, 'base64');
                    if (!res.write(b))
                        await new Promise<void>(r => res.once('drain', r));
                    cursor = result.data.nextCursor;
                    if (!cursor)
                        break;
                }
                return res.end();
            }
            json(res, { error: 'NOT_FOUND' }, 404);
        }
        catch (e) {
            if (res.headersSent) {
                res.destroy();
                return;
            }
            const code = e instanceof PortalError ? e.code : 'IO_ERROR';
            if (code === 'UNAUTHENTICATED')
                res.setHeader('WWW-Authenticate', auth.challenge());
            json(res, err(e), code === 'UNAUTHENTICATED' ? 401 : code === 'FORBIDDEN' || code === 'DEVICE_REVOKED' ? 403 : code === 'NOT_FOUND' ? 404 : code === 'OVERLOADED' ? 429 : code === 'DEVICE_OFFLINE' ? 503 : 400);
        }
    });
    const { WebSocketServer } = await import('ws');
    const wss = new WebSocketServer({ noServer: true, maxPayload: 1048576 });
    server.on('upgrade', (req, socket, head) => { void (async () => { check(req.url === '/device/connect' && req.headers.host === new URL(config.publicOrigin).host, 'FORBIDDEN', 'Invalid device upgrade route'); const d = await deviceAuth(req.headers.authorization); const [updated] = await store.query('UPDATE devices SET connection_epoch=connection_epoch+1 WHERE id=$1 AND revoked=false RETURNING *', [d.id]); check(updated, 'DEVICE_REVOKED', 'Device revoked during connect'); wss.handleUpgrade(req, socket, head, (ws: any) => { const old = connections.get(d.id); old?.socket.close(1008, 'superseded'); const epoch = Number(updated.connection_epoch); connections.set(d.id, { socket: ws, epoch, accountId: d.account_id, confirmed: Date.now() }); frame(d.id, { type: 'hello' }); ws.on('error', () => { }); ws.on('close', () => { if (connections.get(d.id)?.socket === ws)
        connections.delete(d.id); }); ws.on('message', (bytes: any) => { void (async () => { const m = JSON.parse(bytes.toString()); check(m.v === 1 && m.deviceId === d.id && m.epoch === epoch && connections.get(d.id)?.socket === ws, 'STALE_CONNECTION', 'Stale device frame'); const [current] = await store.query('SELECT id FROM devices WHERE id=$1 AND connection_epoch=$2 AND revoked=false', [d.id, epoch]); check(current, 'DEVICE_REVOKED', 'Device generation revoked'); if (m.type === 'heartbeat') {
        check(typeof m.nonce === 'string' && m.nonce.length <= 100, 'INVALID_ARGUMENT', 'Invalid heartbeat');
        connections.get(d.id)!.confirmed = Date.now();
        await store.query('UPDATE devices SET last_heartbeat=now(),agent_version=$1 WHERE id=$2', [String(m.version ?? '').slice(0, 30), d.id]);
        frame(d.id, { type: 'heartbeat_ack', nonce: m.nonce });
        await dispatch();
    }
    else if (m.type === 'accepted') {
        await store.query('UPDATE dispatch_outbox SET acknowledged=true WHERE operation_id IN (SELECT id FROM operations WHERE id=$1 AND account_id=$2 AND device_id=$3)', [m.operationId, d.account_id, d.id]);
    }
    else if (m.type === 'result_chunk') {
        if (await store.resultChunk(d.id, epoch, m))
            frame(d.id, { type: 'result_ack', deliveryId: m.deliveryId, digest: m.digest });
    }
    else
        throw new PortalError('INVALID_ARGUMENT', 'Unknown device frame'); })().catch(() => ws.close(1008, 'invalid frame')); }); }); })().catch(() => { socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n'); socket.destroy(); }); });
    const tick = setInterval(() => void dispatch().catch(() => { }), 1000), prune = setInterval(() => void store.prune().catch(() => { }), 3600000);
    await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(config.port, config.host, resolve); });
    return { server, store, auth, tool, connections, revoke, close: async () => { stopped = true; clearInterval(tick); clearInterval(prune); for (const c of connections.values())
            c.socket.close(); await new Promise<void>(r => server.close(() => r())); await store.close(); } };
}
export function configFromEnvironment(): RelayConfig { const required = (name: string) => { const v = process.env[name]; check(v, 'INVALID_ARGUMENT', `${name} is required`); return v; }; return { databaseUrl: required('DATABASE_URL'), issuer: required('OAUTH_ISSUER'), audience: required('OAUTH_AUDIENCE'), jwksUri: required('OAUTH_JWKS_URI'), publicOrigin: required('PUBLIC_ORIGIN'), testOnly: process.env.PORTAL_TEST_ISSUER === '1', ownerClientId: process.env.OWNER_CLIENT_ID, ownerClientSecret: process.env.OWNER_CLIENT_SECRET, authorizationEndpoint: process.env.OAUTH_AUTHORIZATION_ENDPOINT, tokenEndpoint: process.env.OAUTH_TOKEN_ENDPOINT, host: process.env.HOST ?? '127.0.0.1', port: Number(process.env.PORT ?? 8787) }; }
if (import.meta.url === new URL('file://' + process.argv[1]).href) {
    const relay = await createRelay(configFromEnvironment());
    console.log('Portal relay listening');
    process.on('SIGTERM', () => void relay.close().then(() => process.exit(0)));
}
