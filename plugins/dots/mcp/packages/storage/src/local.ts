import { DatabaseSync, backup } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { sha, id, check, PortalError, Result, State, TERMINAL } from '../../protocol/src/index.js';
export class LocalStore {
    readonly db: DatabaseSync;
    constructor(public dir: string, migrationDir = path.resolve(import.meta.dirname, '../../../..', 'migrations/local')) {
        fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
        fs.chmodSync(dir, 0o700);
        const name = path.join(dir, 'portal.sqlite');
        this.db = new DatabaseSync(name);
        fs.chmodSync(name, 0o600);
        this.db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
        this.db.exec('CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, checksum TEXT NOT NULL, applied_at INTEGER NOT NULL)');
        const files = fs.readdirSync(migrationDir).filter(x => /^\d+.*\.sql$/.test(x)).sort();
        const supported = Math.max(...files.map(x => parseInt(x)));
        check(Number(this.one('SELECT MAX(version) v FROM schema_migrations')?.v ?? 0) <= supported, 'CAPABILITY_UNAVAILABLE', 'Database downgrade is unsupported');
        for (const f of files) {
            const version = parseInt(f), sql = fs.readFileSync(path.join(migrationDir, f), 'utf8'), digest = sha(sql), old = this.one('SELECT checksum FROM schema_migrations WHERE version=?', version);
            if (old) {
                check(old.checksum === digest, 'CAPABILITY_CHANGED', 'Migration checksum changed');
                continue;
            }
            if (this.one('SELECT version FROM schema_migrations LIMIT 1'))
                this.db.exec(`VACUUM INTO '${path.join(dir, `pre-migration-${version}-${Date.now()}.sqlite`).replaceAll("'", "''")}'`);
            this.tx(() => { this.db.exec(sql); this.run('INSERT INTO schema_migrations VALUES(?,?,?)', version, digest, Date.now()); });
        }
        for (const d of ['artifacts', 'spool', 'staging', 'secrets', 'recovery'])
            fs.mkdirSync(path.join(dir, d), { recursive: true, mode: 0o700 });
    }
    one(sql: string, ...args: any[]): any { return this.db.prepare(sql).get(...args); }
    all(sql: string, ...args: any[]): any[] { return this.db.prepare(sql).all(...args); }
    run(sql: string, ...args: any[]) { return this.db.prepare(sql).run(...args); }
    tx<T>(fn: () => T): T { this.db.exec('BEGIN IMMEDIATE'); try {
        const out = fn();
        this.db.exec('COMMIT');
        return out;
    }
    catch (e) {
        this.db.exec('ROLLBACK');
        throw e;
    } }
    setting<T>(key: string, fallback: T): T { const v = this.one('SELECT value FROM settings WHERE key=?', key); return v ? JSON.parse(v.value) : fallback; }
    setSetting(key: string, value: unknown) { this.run('INSERT INTO settings VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', key, JSON.stringify(value)); }
    identity() { let row = this.one('SELECT * FROM device_identity LIMIT 1'); if (!row) {
        this.run('INSERT INTO device_identity(id,installation_id,account_id,label,boot_id) VALUES(?,?,?,?,?)', id('dev'), id('install'), 'local-owner', os.hostname(), bootId());
        row = this.one('SELECT * FROM device_identity LIMIT 1');
    } return row; }
    event(operationId: string, event: string, metadata: unknown = {}, component = 'agent') { this.run('INSERT INTO operation_events(operation_id,at,component,event,metadata) VALUES(?,?,?,?,?)', operationId, Date.now(), component, event, JSON.stringify(metadata)); }
    accept(p: {
        accountId: string;
        deviceId: string;
        workspaceId: string;
        key: string;
        hash: string;
        capability: string;
        revision: string;
        epoch?: number;
        parentId?: string;
        deadline?: number;
        operationId?: string;
    }): {
        row: any;
        created: boolean;
    } {
        return this.tx(() => {
            const old = this.one('SELECT * FROM operations WHERE account_id=? AND device_id=? AND workspace_id=? AND idempotency_key=?', p.accountId, p.deviceId, p.workspaceId, p.key);
            if (old) {
                check(old.request_hash === p.hash, 'IDEMPOTENCY_CONFLICT', 'The same key was already used with different arguments', { operationId: old.id });
                return { row: old, created: false };
            }
            check(this.one("SELECT COUNT(*) n FROM operations WHERE state IN ('accepted','queued','running')").n < 100, 'OVERLOADED', 'Device admission queue is full', { retryAfterMs: 1000 });
            const op = p.operationId ?? id('op'), now = Date.now();
            this.run('INSERT INTO operations(id,account_id,device_id,workspace_id,idempotency_key,request_hash,capability,revision,state,parent_id,actor_epoch,accepted_at,updated_at,deadline) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', op, p.accountId, p.deviceId, p.workspaceId, p.key, p.hash, p.capability, p.revision, 'accepted', p.parentId ?? null, p.epoch ?? null, now, now, p.deadline ?? now + 30000);
            this.event(op, 'accepted', { capability: p.capability, requestHash: p.hash });
            return { row: this.one('SELECT * FROM operations WHERE id=?', op), created: true };
        });
    }
    finish(operationId: string, result: Result) {
        this.tx(() => {
            const row = this.one('SELECT * FROM operations WHERE id=?', operationId);
            check(row, 'NOT_FOUND', 'Operation missing');
            if (TERMINAL.has(row.state) && row.result)
                return;
            this.run('UPDATE operations SET state=?,result=?,updated_at=? WHERE id=?', result.state ?? 'succeeded', JSON.stringify({ ...result, operationId }), Date.now(), operationId);
            this.event(operationId, result.state ?? 'succeeded');
            this.run('INSERT OR IGNORE INTO result_outbox(id,operation_id,payload,created_at) VALUES(?,?,?,?)', `result:${operationId}`, operationId, JSON.stringify({ ...result, operationId }), Date.now());
        });
    }
    transition(operationId: string, state: State) { this.tx(() => { const row = this.one('SELECT state FROM operations WHERE id=?', operationId); check(row && !TERMINAL.has(row.state), 'OUTCOME_UNKNOWN', 'Terminal operation cannot restart'); this.run('UPDATE operations SET state=?,updated_at=? WHERE id=?', state, Date.now(), operationId); this.event(operationId, state); }); }
    result(row: any): Result { check(row, 'NOT_FOUND', 'Operation not found'); if (row.payload_expired)
        throw new PortalError('RESULT_EXPIRED', 'Payload expired; this operation will not run again', { operationId: row.id, knownOutcome: row.state }, 'never'); return row.result ? JSON.parse(row.result) : { schemaVersion: 1, operationId: row.id, state: row.state, observedAt: new Date(row.updated_at).toISOString(), source: 'device', freshness: 'live', data: { children: this.all('SELECT id,state,capability FROM operations WHERE parent_id=?', row.id) } }; }
    expire(before: number) { return this.tx(() => this.run("UPDATE operations SET result=NULL,payload_expired=1 WHERE updated_at<? AND state IN ('succeeded','failed','cancelled','interrupted','outcome_unknown') AND NOT EXISTS(SELECT 1 FROM result_outbox r WHERE r.operation_id=operations.id AND acknowledged=0)", before)); }
    integrity() { return this.all('PRAGMA integrity_check'); }
    async backup(destination: string) { await backup(this.db, destination); fs.chmodSync(destination, 0o600); }
    close() { this.db.close(); }
}
export function bootId(): string { try {
    return fs.readFileSync('/proc/sys/kernel/random/boot_id', 'utf8').trim();
}
catch {
    return `${os.hostname()}:${Math.floor((Date.now() / 1000 - os.uptime()) / 60)}`;
} }
