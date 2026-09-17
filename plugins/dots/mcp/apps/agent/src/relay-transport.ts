import { randomBytes } from 'node:crypto';
import { createApplication } from '../../../packages/core/src/application.js';
import { SecretStore } from '../../../packages/core/src/secrets.js';
import { check, err, PortalError, id, requestHash, sha, TERMINAL } from '../../../packages/protocol/src/index.js';
type App = ReturnType<typeof createApplication>;
export class DeviceTransport {
    private socket: any;
    private stopped = true;
    private generation = 0;
    private attempt = 0;
    private timer?: NodeJS.Timeout;
    private retry?: NodeJS.Timeout;
    private lastAck = 0;
    private heartbeatNonce = '';
    private epoch = 0;
    private sending = false;
    private ready = false;
    constructor(public app: App) { }
    get healthy() { return this.ready && performance.now() - this.lastAck < 45000; }
    start() { this.stopped = false; void this.connect(); this.timer = setInterval(() => void this.tick(), 1000); }
    stop() { this.stopped = true; this.generation++; this.ready = false; if (this.timer)
        clearInterval(this.timer); if (this.retry)
        clearTimeout(this.retry); this.socket?.close(); }
    reconnect() { this.generation++; this.ready = false; this.socket?.close(); if (this.retry)
        clearTimeout(this.retry); if (!this.stopped)
        void this.connect(); }
    private async connect() { const generation = ++this.generation; if (this.stopped || this.app.store.setting<string>('transport', 'local') !== 'relay')
        return; const identity = this.app.store.identity(); if (identity.revoked || !identity.relay || !identity.credential_ref)
        return; try {
        const { WebSocket } = await import('ws');
        if (this.stopped || generation !== this.generation)
            return;
        const test = this.app.store.setting('testProfile', false);
        const url = new URL('/device/connect', identity.relay);
        check(url.protocol === 'https:' || test, 'FORBIDDEN', 'Device transport requires TLS');
        url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        const key = new SecretStore(this.app.store.dir, test).get(identity.credential_ref);
        const ws = new WebSocket(url, { headers: { Authorization: 'Bearer ' + key }, handshakeTimeout: 10000, maxPayload: 1048576 });
        this.socket = ws;
        ws.on('message', (bytes: any) => { if (generation !== this.generation || this.stopped)
            return; void Promise.resolve().then(() => this.message(JSON.parse(bytes.toString()))).catch(() => { ws.close(1008, 'protocol rejected'); }); });
        ws.on('error', () => { });
        ws.on('close', () => { if (generation !== this.generation || this.stopped)
            return; this.ready = false; this.schedule(); });
    }
    catch (e) {
        this.app.store.setSetting('relayDiagnostic', { code: 'DEVICE_OFFLINE', message: e instanceof Error ? e.message : 'Relay unavailable', at: Date.now() });
        this.schedule();
    } }
    private schedule() { if (this.stopped || this.retry)
        return; const delay = Math.random() * Math.min(30000, 500 * 2 ** Math.min(this.attempt++, 8)); this.retry = setTimeout(() => { this.retry = undefined; void this.connect(); }, delay); }
    private send(body: any) { if (!this.socket || this.socket.readyState !== 1)
        return false; check(this.socket.bufferedAmount < 4 * 1024 * 1024, 'OVERLOADED', 'Device transport backpressure'); const d = this.app.store.identity(); this.socket.send(JSON.stringify({ v: 1, messageId: id('msg'), deviceId: d.id, epoch: this.epoch, ...body })); return true; }
    private queueResult(remoteId: string, result: any) { const payload = JSON.stringify(result), digest = sha(payload), deliveryId = 'delivery:' + remoteId + ':' + digest; check(Buffer.byteLength(payload) <= 8 * 1024 * 1024, 'LIMIT_EXCEEDED', 'Device result exceeds relay payload bound'); this.app.store.run('INSERT OR IGNORE INTO relay_result_outbox(id,remote_operation_id,payload,digest,created_at) VALUES(?,?,?,?,?)', deliveryId, remoteId, payload, digest, Date.now()); }
    private async message(m: any) {
        const { store, broker, frontDoor } = this.app;
        const identity = store.identity();
        check(m.v === 1 && m.deviceId === identity.id, 'FORBIDDEN', 'Frame device/version mismatch');
        if (m.type === 'hello') {
            check(Number.isSafeInteger(m.epoch) && m.epoch > 0, 'STALE_CONNECTION', 'Invalid connection epoch');
            this.epoch = m.epoch;
            store.run('UPDATE device_identity SET connection_epoch=?', m.epoch);
            this.lastAck = performance.now();
            this.ready = true;
            this.heartbeatNonce = randomBytes(16).toString('hex');
            this.send({ type: 'heartbeat', nonce: this.heartbeatNonce, version: '0.1.0' });
            return;
        }
        check(m.epoch === this.epoch, 'STALE_CONNECTION', 'Old connection generation');
        if (m.type === 'heartbeat_ack') {
            check(m.nonce === this.heartbeatNonce, 'STALE_CONNECTION', 'Heartbeat acknowledgement mismatch');
            this.lastAck = performance.now();
            this.heartbeatNonce = '';
            this.attempt = 0;
            this.ready = true;
            return;
        }
        if (m.type === 'revoke') {
            broker.accepting = false;
            store.run('UPDATE device_identity SET revoked=1,connection_epoch=connection_epoch+1');
            store.run('UPDATE grants SET revoked=1,revision=revision+1');
            store.run("UPDATE jobs SET state='cancel_requested' WHERE state IN ('accepted','running')");
            this.stop();
            return;
        }
        if (m.type === 'result_ack') {
            store.run('UPDATE relay_result_outbox SET acknowledged=1 WHERE id=? AND digest=?', m.deliveryId, m.digest);
            return;
        }
        check(m.type === 'operation' && typeof m.operationId === 'string' && m.accountId === identity.account_id && Array.isArray(m.scopes), 'FORBIDDEN', 'Invalid operation binding');
        const request = { name: m.name, arguments: m.arguments }, digest = requestHash(request);
        const existing = store.one('SELECT * FROM remote_inbox WHERE id=?', m.operationId);
        if (existing) {
            check(existing.request_hash === digest, 'IDEMPOTENCY_CONFLICT', 'Relayed operation changed');
            this.send({ type: 'accepted', operationId: m.operationId });
            if (existing.result)
                this.queueResult(m.operationId, JSON.parse(existing.result));
            else {
                let result: any;
                const key = m.arguments.idempotencyKey, ws = m.arguments.workspaceId ?? '__device__';
                const op = key ? store.one('SELECT * FROM operations WHERE account_id=? AND device_id=? AND workspace_id=? AND idempotency_key=?', identity.account_id, identity.id, ws, key) : null;
                result = op ? store.result(op) : err(new PortalError('OUTCOME_UNKNOWN', 'Prior device dispatch intent has no conclusive result; it is not automatically replayed', {}, 'after_status_check'));
                this.queueResult(m.operationId, result);
            }
            return;
        }
        check(this.healthy, 'DEVICE_OFFLINE', 'Device is reconciling');
        store.run('INSERT INTO remote_inbox(id,request_hash,request,state,deadline,created_at) VALUES(?,?,?,?,?,?)', m.operationId, digest, JSON.stringify(request), 'accepted', m.deadline, Date.now());
        this.send({ type: 'accepted', operationId: m.operationId });
        let result: any;
        if (Date.now() > m.deadline)
            result = err(new PortalError('DISPATCH_DEADLINE_EXCEEDED', 'Dispatch deadline elapsed before local execution'));
        else {
            store.run("UPDATE remote_inbox SET state='intent' WHERE id=?", m.operationId);
            result = await frontDoor.call({ accountId: identity.account_id, deviceId: identity.id, connectionEpoch: this.epoch, transport: 'relay', scopes: m.scopes }, m.name, m.arguments);
        }
        store.run('UPDATE remote_inbox SET state=?,result=?,local_operation_id=? WHERE id=?', result.state, JSON.stringify(result), result.operationId ?? null, m.operationId);
        this.queueResult(m.operationId, result);
    }
    private async tick() {
        if (this.stopped || this.sending)
            return;
        const { store } = this.app;
        if (!this.socket || this.socket.readyState !== 1)
            return;
        if (performance.now() - this.lastAck > 45000) {
            this.reconnect();
            return;
        }
        if (performance.now() - this.lastAck > 15000 && this.healthy && !this.heartbeatNonce) {
            this.heartbeatNonce = randomBytes(16).toString('hex');
            this.send({ type: 'heartbeat', nonce: this.heartbeatNonce, version: '0.1.0' });
        }
        if (!this.ready)
            return;
        this.sending = true;
        try {
            for (const result of store.all('SELECT o.id,o.operation_id,o.payload,i.id remote_id FROM result_outbox o JOIN remote_inbox i ON i.local_operation_id=o.operation_id WHERE o.acknowledged=0 LIMIT 20')) {
                this.queueResult(result.remote_id, JSON.parse(result.payload)); /* local evidence remains protected until hosted delivery is acknowledged */
                const digest = sha(result.payload);
                if (store.one('SELECT id FROM relay_result_outbox WHERE remote_operation_id=? AND digest=? AND acknowledged=1', result.remote_id, digest))
                    store.run('UPDATE result_outbox SET acknowledged=1 WHERE id=?', result.id);
            }
            for (const out of store.all('SELECT * FROM relay_result_outbox WHERE acknowledged=0 ORDER BY created_at LIMIT 5')) {
                const b = Buffer.from(out.payload), total = Math.max(1, Math.ceil(b.length / 500000));
                for (let i = 0; i < total; i++) {
                    if (!this.healthy)
                        return;
                    this.send({ type: 'result_chunk', operationId: out.remote_operation_id, deliveryId: out.id, digest: out.digest, index: i, total, data: b.subarray(i * 500000, (i + 1) * 500000).toString('base64') });
                }
            }
        }
        catch {
            this.reconnect();
        }
        finally {
            this.sending = false;
        }
    }
}
