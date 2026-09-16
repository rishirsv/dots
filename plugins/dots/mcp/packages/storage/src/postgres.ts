import fs from 'node:fs';
import path from 'node:path';
import { sha, check, id, requestHash, PortalError } from '../../protocol/src/index.js';
export class RelayStore {
    constructor(public pool: any) { }
    static async connect(url: string) { const { Pool } = await import('pg'); const pool = new Pool({ connectionString: url, max: 10, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000 }); const store = new RelayStore(pool); await store.migrate(); return store; }
    async query(sql: string, args: any[] = []) { return (await this.pool.query(sql, args)).rows; }
    async tx<T>(fn: (client: any) => Promise<T>): Promise<T> { const c = await this.pool.connect(); try {
        await c.query('BEGIN');
        const result = await fn(c);
        await c.query('COMMIT');
        return result;
    }
    catch (e) {
        await c.query('ROLLBACK');
        throw e;
    }
    finally {
        c.release();
    } }
    async migrate() { await this.query('CREATE TABLE IF NOT EXISTS schema_migrations(version integer PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())'); const dir = path.resolve(import.meta.dirname, '../../../..', 'migrations/relay'); for (const f of fs.readdirSync(dir).filter(f => /^\d+.*\.sql$/.test(f)).sort()) {
        const n = parseInt(f), sql = fs.readFileSync(path.join(dir, f), 'utf8'), digest = sha(sql);
        const [old] = await this.query('SELECT * FROM schema_migrations WHERE version=$1', [n]);
        if (old) {
            check(old.checksum === digest, 'CAPABILITY_CHANGED', 'Relay migration checksum changed');
            continue;
        }
        await this.tx(async (c) => { await c.query("SELECT pg_advisory_xact_lock(77882211)"); const again = await c.query('SELECT version FROM schema_migrations WHERE version=$1', [n]); if (again.rows.length)
            return; await c.query(sql); await c.query('INSERT INTO schema_migrations(version,checksum) VALUES($1,$2)', [n, digest]); });
    } }
    async account(issuer: string, subject: string) { const rows = await this.query('INSERT INTO accounts(id,issuer,subject) VALUES($1,$2,$3) ON CONFLICT(issuer,subject) DO UPDATE SET subject=excluded.subject RETURNING id', [id('account'), issuer, subject]); return rows[0].id as string; }
    async accept(accountId: string, deviceId: string, workspaceId: string, key: string, request: any, scopes: string[]) { return this.tx(async (c) => { const hash = requestHash({ accountId, deviceId, workspaceId, request, scopes: [...scopes].sort() }); await c.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))', [JSON.stringify([accountId, deviceId, workspaceId, key])]); const [old] = (await c.query('SELECT * FROM operations WHERE account_id=$1 AND device_id=$2 AND workspace_id=$3 AND idempotency_key=$4 FOR UPDATE', [accountId, deviceId, workspaceId, key])).rows; if (old) {
        check(old.request_hash === hash, 'IDEMPOTENCY_CONFLICT', 'The original relay key was used with different arguments or scopes', { operationId: old.id });
        return old;
    } const count = (await c.query("SELECT COUNT(*) n FROM operations WHERE device_id=$1 AND state IN ('accepted','dispatched','running')", [deviceId])).rows[0].n; check(Number(count) < 100, 'OVERLOADED', 'Device dispatch queue is full', { retryAfterMs: 1000 }); const operationId = id('op'); const row = (await c.query("INSERT INTO operations(id,account_id,device_id,workspace_id,idempotency_key,request_hash,request,scopes,state,dispatch_deadline) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'accepted',now()+interval '30 seconds') RETURNING *", [operationId, accountId, deviceId, workspaceId, key, hash, request, JSON.stringify(scopes)])).rows[0]; await c.query('INSERT INTO dispatch_outbox(operation_id) VALUES($1)', [operationId]); await c.query("INSERT INTO operation_events(operation_id,event) VALUES($1,'relay_accepted')", [operationId]); return row; }); }
    async cached(accountId: string, operationId: string) { return (await this.query('SELECT * FROM operations WHERE account_id=$1 AND (id=$2 OR device_operation_id=$2) ORDER BY created_at DESC LIMIT 1', [accountId, operationId]))[0]; }
    async resultChunk(deviceId: string, epoch: number, frame: any) { return this.tx(async (c) => { const [dev] = (await c.query('SELECT * FROM devices WHERE id=$1 AND connection_epoch=$2 AND revoked=false FOR SHARE', [deviceId, epoch])).rows; check(dev, 'STALE_CONNECTION', 'Obsolete device transport'); const [op] = (await c.query('SELECT * FROM operations WHERE id=$1 AND account_id=$2 AND device_id=$3 FOR UPDATE', [frame.operationId, dev.account_id, deviceId])).rows; check(op, 'FORBIDDEN', 'Result does not belong to this account/device'); const [done] = (await c.query('SELECT * FROM result_deliveries WHERE id=$1', [frame.deliveryId])).rows; if (done) {
        check(done.operation_id === op.id && done.digest === frame.digest, 'IDEMPOTENCY_CONFLICT', 'Result delivery identity changed');
        return true;
    } check(Number.isInteger(frame.index) && frame.index >= 0 && Number.isInteger(frame.total) && frame.total > 0 && frame.total <= 20 && frame.index < frame.total && typeof frame.data === 'string' && frame.data.length <= 700000, 'INVALID_ARGUMENT', 'Invalid result chunk'); const [old] = (await c.query('SELECT * FROM result_chunks WHERE delivery_id=$1 AND chunk_index=$2', [frame.deliveryId, frame.index])).rows; if (old)
        check(old.data === frame.data && old.digest === frame.digest && old.total === frame.total && old.operation_id === op.id, 'IDEMPOTENCY_CONFLICT', 'Result chunk changed');
    else
        await c.query('INSERT INTO result_chunks(delivery_id,operation_id,chunk_index,total,digest,data) VALUES($1,$2,$3,$4,$5,$6)', [frame.deliveryId, op.id, frame.index, frame.total, frame.digest, frame.data]); const chunks = (await c.query('SELECT * FROM result_chunks WHERE delivery_id=$1 ORDER BY chunk_index', [frame.deliveryId])).rows; if (chunks.length !== frame.total)
        return false; check(chunks.every((x: any, i: number) => x.chunk_index === i && x.digest === frame.digest && x.total === frame.total), 'INVALID_ARGUMENT', 'Inconsistent result chunks'); const bytes = Buffer.concat(chunks.map((x: any) => Buffer.from(x.data, 'base64'))); check(bytes.length <= 8 * 1024 * 1024 && sha(bytes) === frame.digest, 'SOURCE_CHANGED', 'Result digest mismatch'); const result = JSON.parse(bytes.toString('utf8')); check(result.schemaVersion === 1 && ['accepted', 'queued', 'running', 'succeeded', 'failed', 'cancel_requested', 'cancelled', 'interrupted', 'outcome_unknown'].includes(result.state), 'INVALID_ARGUMENT', 'Invalid result envelope'); const terminal = ['succeeded', 'failed', 'cancelled', 'interrupted']; const stale = terminal.includes(op.state) && !terminal.includes(result.state); if (!stale)
        await c.query('UPDATE operations SET state=$1,result=$2,device_operation_id=$3,updated_at=now(),result_expired=false WHERE id=$4', [result.state, result, result.operationId ?? null, op.id]); await c.query('INSERT INTO result_deliveries(id,operation_id,digest) VALUES($1,$2,$3)', [frame.deliveryId, op.id, frame.digest]); await c.query('DELETE FROM result_chunks WHERE delivery_id=$1', [frame.deliveryId]); await c.query("INSERT INTO operation_events(operation_id,event) VALUES($1,'result_committed')", [op.id]); if (op.request.name === 'open_workspace' && result.data?.workspaceId)
        await c.query('INSERT INTO workspace_summaries(id,account_id,device_id,summary) VALUES($1,$2,$3,$4) ON CONFLICT(id) DO UPDATE SET summary=excluded.summary,updated_at=now()', [result.data.workspaceId, op.account_id, deviceId, result.data]); if (result.operationId)
        await c.query('INSERT INTO operation_routes VALUES($1,$2,$3,$4) ON CONFLICT(id) DO NOTHING', [result.operationId, op.account_id, deviceId, op.workspace_id]); for (const child of result.data?.children ?? result.error?.details?.children ?? [])
        if (child.operationId)
            await c.query('INSERT INTO operation_routes VALUES($1,$2,$3,$4) ON CONFLICT(id) DO NOTHING', [child.operationId, op.account_id, deviceId, op.workspace_id]); const artifacts = [result.data?.artifact, ...(result.artifactRefs ?? []), result.data?.returned?.artifact].filter(Boolean); for (const a of artifacts)
        if (a.id && a.sha256)
            await c.query('INSERT INTO artifact_routes VALUES($1,$2,$3,$4,$5,$6,$7,now()) ON CONFLICT(id) DO NOTHING', [a.id, op.account_id, deviceId, op.workspace_id, a.mimeType, a.bytes, a.sha256]); return true; }); }
    async prune() { await this.query("UPDATE operations o SET result=NULL,result_expired=true WHERE result IS NOT NULL AND state IN ('succeeded','failed','cancelled','interrupted') AND updated_at < now() - make_interval(days => COALESCE((SELECT retention_days FROM owner_settings s WHERE s.account_id=o.account_id),7))"); await this.query("DELETE FROM result_chunks WHERE created_at<now()-interval '1 hour'"); await this.query("DELETE FROM owner_sessions WHERE expires_at<now()"); await this.query("UPDATE pairing_intents SET state='expired' WHERE state='pending' AND expires_at<now()"); }
    async close() { await this.pool.end(); }
}
