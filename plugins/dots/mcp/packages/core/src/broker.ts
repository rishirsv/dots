import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { LocalStore } from '../../storage/src/local.js';
import { Registry } from './registry.js';
import { RootedFs, overlaps, relative } from './rooted-fs.js';
import type { Actor, CapabilityContext } from './types.js';
import { check, PortalError, err, ok, id, requestHash, validate, safeJson, s, Result, Obj, TERMINAL } from '../../protocol/src/index.js';
export interface Invocation {
    workspaceId: string;
    capabilityId: string;
    arguments: Obj;
    revision?: string;
    writerEpoch?: number;
    idempotencyKey?: string;
    parentId?: string;
    readOnly?: boolean;
    signal?: AbortSignal;
    operationId?: string;
    dispatchDeadline?: number;
}
const controlSchema = s.object({ deviceId: s.key(), rootAlias: s.key(), access: s.enum(['read', 'write']), idempotencyKey: s.key() });
export class OperationBroker {
    readonly protectedRoots: string[];
    private active = new Map<string, AbortController>();
    accepting = true;
    constructor(public store: LocalStore, public registry: Registry) {
        // macOS commonly exposes /var/folders through a symlink. Canonicalize
        // the control-state root before comparing it with a granted root so a
        // grant cannot bypass the protected-root check through that alias.
        const canonical = (root: string) => {
            try {
                return fs.realpathSync(root);
            }
            catch {
                return path.resolve(root);
            }
        };
        this.protectedRoots = [canonical(store.dir), canonical(path.resolve(import.meta.dirname, '../../../..')), ...['.ssh', '.aws', '.azure', '.config/gcloud', 'Library/Keychains', 'Library/Application Support/Google/Chrome', 'Library/Safari'].map(x => canonical(path.join(os.homedir(), x)))];
    }
    localActor(): Actor { const d = this.store.identity(); return { accountId: d.account_id, deviceId: d.id, scopes: ['*'], transport: 'local' }; }
    authenticate(actor: Actor) { const d = this.store.identity(); check(actor.accountId === d.account_id && actor.deviceId === d.id, 'FORBIDDEN', 'Account/device binding mismatch'); check(!d.revoked, 'DEVICE_REVOKED', 'Device is locally revoked'); if (actor.transport === 'relay') {
        check(this.store.setting<string>('transport', 'local') === 'relay', 'FORBIDDEN', 'Hosted transport is not locally active');
        check(actor.connectionEpoch === d.connection_epoch, 'STALE_CONNECTION', 'Obsolete transport generation');
    } }
    scope(actor: Actor, scope: string) { check(actor.scopes.includes('*') || actor.scopes.includes(scope), 'FORBIDDEN', `OAuth scope ${scope} is required`); }
    context(actor: Actor, workspaceId: string, allowClosing = false) { this.authenticate(actor); const ws = this.store.one('SELECT * FROM workspaces WHERE id=? AND account_id=? AND device_id=?', workspaceId, actor.accountId, actor.deviceId); check(ws, 'NOT_FOUND', 'Workspace not found'); check(ws.state === 'open' || (allowClosing && ws.state === 'closing'), 'WORKSPACE_CLOSED', 'Workspace is closed or closing'); const grant = this.store.one('SELECT * FROM grants WHERE id=?', ws.grant_id); check(grant && !grant.revoked, 'GRANT_EXPIRED', 'Grant was revoked'); check(grant.expires_at > Date.now() && ws.expires_at > Date.now(), 'GRANT_EXPIRED', 'Workspace or grant expired'); check(grant.revision === ws.grant_revision, 'GRANT_CHANGED', 'Grant changed; open a new workspace'); grant.policy = JSON.parse(grant.policy); return { ws, grant }; }
    addGrant(input: {
        root: string;
        alias: string;
        access: 'read' | 'write';
        network?: boolean;
        families?: string[];
        maxJobMs?: number;
        toolchainRoots?: string[];
        expiresAt?: number;
    }) {
        validate(s.object({ root: s.string(4096), alias: s.key(), access: s.enum(['read', 'write']), network: s.bool(), families: s.array(s.string(100), 30), maxJobMs: s.int(1000, 86400000), toolchainRoots: s.array(s.string(4096), 20), expiresAt: s.int() }, ['root', 'alias', 'access']), input);
        const root = fs.realpathSync(input.root);
        check(!this.protectedRoots.some(x => overlaps(root, x)), 'PATH_OUTSIDE_GRANT', 'Grant overlaps Portal installation/state or protected credential paths');
        const rooted = new RootedFs(root, this.protectedRoots);
        const st = rooted.stat('.');
        rooted.close();
        const old = this.store.one('SELECT * FROM grants WHERE alias=?', input.alias);
        check(!old || !this.store.one("SELECT id FROM workspaces WHERE grant_id=? AND state IN ('open','closing')", old.id), 'WRITER_BUSY', 'Close existing workspaces before replacing a grant');
        const grantId = old?.id ?? id('grant'), revision = (old?.revision ?? 0) + 1, policy = { families: input.families ?? ['files', 'search', 'images', 'artifacts', 'documents', 'tasks', 'skills', 'instructions', 'code', 'jobs'], network: input.network ?? false, maxJobMs: input.maxJobMs ?? 1800000, toolchainRoots: (input.toolchainRoots ?? []).map(x => fs.realpathSync(x)), keepAwake: false, gitAdministrativeWrites: false, defaultShellLogin: false };
        this.store.run('INSERT INTO grants(id,alias,revision,root,dev,ino,access,policy,expires_at,revoked) VALUES(?,?,?,?,?,?,?,?,?,0) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,root=excluded.root,dev=excluded.dev,ino=excluded.ino,access=excluded.access,policy=excluded.policy,expires_at=excluded.expires_at,revoked=0', grantId, input.alias, revision, root, String(st.dev), String(st.ino), input.access, JSON.stringify(policy), input.expiresAt ?? Date.now() + 365 * 86400000);
        return { grantId, revision, rootAlias: input.alias, root, effectiveAccess: input.access, ...policy };
    }
    async revokeGrant(grantId: string) { const g = this.store.one('SELECT * FROM grants WHERE id=? OR alias=?', grantId, grantId); check(g, 'NOT_FOUND', 'Grant not found'); this.store.run('UPDATE grants SET revoked=1,revision=revision+1 WHERE id=?', g.id); for (const ws of this.store.all('SELECT id FROM workspaces WHERE grant_id=?', g.id)) {
        for (const [op, abort] of this.active) {
            const r = this.store.one('SELECT workspace_id FROM operations WHERE id=?', op);
            if (r?.workspace_id === ws.id)
                abort.abort();
        }
        this.store.run("UPDATE jobs SET state='cancel_requested' WHERE workspace_id=? AND state IN ('accepted','running')", ws.id);
    } return { grantId: g.id, revoked: true, cancellation: 'requested; inspect jobs for confirmation' }; }
    async openWorkspace(actor: Actor, args: Obj): Promise<Result> {
        try {
            validate(controlSchema, args);
            this.authenticate(actor);
            this.scope(actor, args.access === 'write' ? 'portal:write' : 'portal:read');
            check(args.deviceId === actor.deviceId, 'FORBIDDEN', 'Wrong device');
            check(this.accepting, 'OVERLOADED', 'Agent is draining');
            const g = this.store.one('SELECT * FROM grants WHERE alias=? AND revoked=0', args.rootAlias);
            check(g && g.expires_at > Date.now(), 'GRANT_EXPIRED', 'No active local grant for this alias');
            check(args.access === 'read' || g.access === 'write', 'FORBIDDEN', 'Write access was not locally granted');
            const accepted = this.store.accept({ accountId: actor.accountId, deviceId: actor.deviceId, workspaceId: '__device__', key: args.idempotencyKey, hash: requestHash(args), capability: 'open_workspace', revision: '1' });
            if (!accepted.created)
                return this.store.result(accepted.row);
            const op = accepted.row.id;
            try {
                const result = this.store.tx(() => {
                    if (args.access === 'write') {
                        for (const w of this.store.all("SELECT root,id FROM workspaces WHERE access='write' AND state IN ('open','closing')"))
                            check(!overlaps(w.root, g.root), 'WRITER_BUSY', 'An overlapping root already has a writer', { workspaceId: w.id });
                    }
                    const workspaceId = id('ws'), writerEpoch = Number(this.store.setting('nextWriterEpoch', 0)) + 1;
                    this.store.setSetting('nextWriterEpoch', writerEpoch);
                    this.store.run('INSERT INTO workspaces(id,device_id,account_id,grant_id,grant_revision,root,access,writer_epoch,state,expires_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)', workspaceId, actor.deviceId, actor.accountId, g.id, g.revision, g.root, args.access, writerEpoch, 'open', Math.min(g.expires_at, Date.now() + 8 * 3600000), Date.now());
                    if (args.access === 'write')
                        this.store.run('INSERT INTO writer_leases(workspace_id,domain,epoch,quiescent) VALUES(?,?,?,1)', workspaceId, g.root, writerEpoch);
                    return ok({ workspaceId, writerEpoch, grantId: g.id, grantRevision: g.revision, rootAlias: g.alias, effectiveAccess: args.access, networkAccess: JSON.parse(g.policy).network ? 'allowed' : 'denied', capabilityRevision: this.registry.revision(), recommendedSkills: ['builtin:portal', 'builtin:portal-files'] }, { operationId: op });
                });
                this.store.finish(op, result);
                return result;
            }
            catch (e) {
                const result = err(e, { operationId: op });
                this.store.finish(op, result);
                return result;
            }
        }
        catch (e) {
            return err(e);
        }
    }
    async invoke(actor: Actor, request: Invocation): Promise<Result> {
        let operationId: string | undefined, rooted: RootedFs | undefined, held = false;
        try {
            safeJson(request.arguments);
            const cap = this.registry.get(request.capabilityId);
            validate(cap.input, request.arguments);
            const { ws, grant } = this.context(actor, request.workspaceId, cap.id === 'jobs.cancel' || cap.id === 'jobs.output' || cap.id === 'jobs.get');
            this.scope(actor, 'portal:read');
            check(grant.policy.families.includes('*') || grant.policy.families.includes(cap.family), 'FORBIDDEN', 'Capability family is not locally granted', { family: cap.family });
            if (request.revision)
                check(request.revision === cap.revision, 'CAPABILITY_CHANGED', 'Capability contract changed', { expected: cap.revision });
            if (request.readOnly)
                check(cap.effect === 'read' && !['terminal', 'network', 'processes'].includes(cap.family), 'FORBIDDEN', 'Read-only code cannot perform this capability');
            if (cap.effect === 'network') {
                this.scope(actor, 'portal:network');
                check(grant.policy.network, 'FORBIDDEN', 'Network capability is not locally approved');
            }
            if (cap.family === 'documents')
                this.scope(actor, 'portal:documents');
            if (cap.family === 'terminal' || cap.id === 'jobs.cancel')
                this.scope(actor, 'portal:exec');
            const mutation = cap.effect === 'write' || (cap.effect === 'spawn' && !(request.arguments.executionAccess === 'read' || ws.access === 'read'));
            if (mutation) {
                this.scope(actor, 'portal:write');
                check(ws.access === 'write', 'FORBIDDEN', 'A writable workspace is required');
                check(request.writerEpoch === ws.writer_epoch, 'STALE_WRITER', 'Writer epoch does not match');
            }
            const durable = cap.effect !== 'read';
            let duplicate = false;
            if (durable) {
                check(this.accepting, 'OVERLOADED', 'Agent is draining');
                validate(s.key(), request.idempotencyKey);
                const hash = requestHash({ capability: cap.id, revision: cap.revision, arguments: request.arguments, writerEpoch: request.writerEpoch ?? null, root: ws.root, grantRevision: grant.revision, ...(cap.family === 'code' ? { selectedRevisions: Object.fromEntries((request.arguments.capabilityIds as string[]).map(id => [id, this.registry.get(id).revision])) } : {}) });
                const accepted = this.store.accept({ accountId: actor.accountId, deviceId: actor.deviceId, workspaceId: ws.id, key: request.idempotencyKey!, hash, capability: cap.id, revision: cap.revision, epoch: request.writerEpoch, parentId: request.parentId, operationId: request.operationId, deadline: request.dispatchDeadline });
                operationId = accepted.row.id;
                if (!accepted.created)
                    return this.store.result(accepted.row);
                check(accepted.row.deadline > Date.now(), 'DISPATCH_DEADLINE_EXCEEDED', 'Operation expired before execution');
            }
            const available = cap.availability();
            check(available.available, available.reason?.includes('EXECUTOR_UPGRADE_REQUIRED') ? 'EXECUTOR_UPGRADE_REQUIRED' : 'CAPABILITY_UNAVAILABLE', available.reason ?? 'Capability dependency unavailable', { capabilityId: cap.id });
            if (cap.approval || (cap.id === 'files.apply_patch' && /^\*\*\* Delete File:/m.test(request.arguments.patch))) {
                const requestDigest = requestHash({ capability: cap.id, arguments: request.arguments });
                const approved = this.store.one("SELECT * FROM approvals WHERE workspace_id=? AND request_hash=? AND state='approved' AND expires_at>? AND consumed_by IS NULL", ws.id, requestDigest, Date.now());
                if (!approved) {
                    let pending = this.store.one("SELECT * FROM approvals WHERE workspace_id=? AND request_hash=? AND state='pending' AND expires_at>?", ws.id, requestDigest, Date.now());
                    if (!pending) {
                        const aid = id('approval');
                        this.store.run('INSERT INTO approvals(id,workspace_id,request_hash,scope,state,expires_at,created_at) VALUES(?,?,?,?,?,?,?)', aid, ws.id, requestDigest, JSON.stringify({ capability: cap.id, arguments: request.arguments }), 'pending', Date.now() + 600000, Date.now());
                        pending = { id: aid };
                    }
                    throw new PortalError('APPROVAL_REQUIRED', 'Owner must approve this exact action locally, then submit a new explicit continuation', { approvalId: pending.id, requestHash: requestDigest }, 'new_request');
                }
                this.store.run('UPDATE approvals SET consumed_by=? WHERE id=?', operationId, approved.id);
            }
            if (mutation) {
                this.store.tx(() => { const lease = this.store.one('SELECT * FROM writer_leases WHERE workspace_id=?', ws.id); check(lease && !lease.operation_id && lease.quiescent, 'WRITER_BUSY', 'A mutating operation or live command owns this domain', { operationId: lease?.operation_id }); this.store.run('UPDATE writer_leases SET operation_id=?,quiescent=0 WHERE workspace_id=?', operationId, ws.id); });
                held = true;
            }
            const getFs = () => rooted ?? (rooted = new RootedFs(ws.root, this.protectedRoots, { dev: grant.dev, ino: grant.ino }));
            const abort = new AbortController();
            if (operationId)
                this.active.set(operationId, abort);
            request.signal?.addEventListener('abort', () => abort.abort(), { once: true });
            check(!request.signal?.aborted, 'CANCEL_REQUESTED', 'Operation cancelled before execution');
            if (operationId)
                this.store.transition(operationId, 'running');
            const ctx: CapabilityContext = { store: this.store, workspace: ws, grant, actor, get fs() { return getFs(); }, operationId: operationId ?? id('read'), signal: abort.signal, parentId: request.parentId, invoke: (capabilityId, args, stepKey) => this.invoke(actor, { workspaceId: ws.id, capabilityId, arguments: args, writerEpoch: request.writerEpoch, idempotencyKey: operationId && stepKey ? `${operationId}:${stepKey}` : undefined, parentId: operationId, readOnly: request.readOnly || cap.id === 'code.run_read', signal: abort.signal }) };
            const data = await cap.handler(ctx, request.arguments);
            const normalized = JSON.parse(JSON.stringify(data ?? {}));
            validate(cap.output, normalized);
            const state = normalized.jobState === 'running' || normalized.jobState === 'accepted' ? 'running' : 'succeeded';
            const result = ok(normalized, { operationId, state, ...(normalized.nextCursor ? { nextCursor: normalized.nextCursor } : {}), ...(normalized.truncated ? { truncated: true } : {}) });
            if (operationId) {
                if (state === 'running')
                    this.store.run('UPDATE operations SET result=?,updated_at=? WHERE id=?', JSON.stringify(result), Date.now(), operationId);
                else
                    this.store.finish(operationId, result);
            }
            if (held && state === 'running')
                held = false; // durable job releases its gate only after confirmed worker termination
            return result;
        }
        catch (e) {
            const result = err(e, { operationId });
            if (operationId) {
                const commits = this.store.all('SELECT path,state,before_sha,after_sha FROM file_commits WHERE operation_id=?', operationId);
                if (commits.length && result.error)
                    result.error.details = { ...result.error.details, partialEffects: commits.some(x => x.state === 'committed'), fileReceipts: commits };
                this.store.finish(operationId, result);
            }
            return result;
        }
        finally {
            rooted?.close();
            if (operationId)
                this.active.delete(operationId);
            if (held)
                this.store.run('UPDATE writer_leases SET operation_id=NULL,quiescent=1 WHERE workspace_id=? AND operation_id=?', request.workspaceId, operationId);
        }
    }
    getOperation(actor: Actor, args: Obj) { this.authenticate(actor); this.scope(actor, 'portal:read'); validate(s.object({ operationId: s.key(), workspaceId: s.key(), idempotencyKey: s.key() }, []), args); check((!!args.operationId && !args.workspaceId && !args.idempotencyKey) || (!args.operationId && !!args.workspaceId && !!args.idempotencyKey), 'INVALID_ARGUMENT', 'Use operationId OR workspaceId plus idempotencyKey'); const row = args.operationId ? this.store.one('SELECT * FROM operations WHERE id=? AND account_id=? AND device_id=?', args.operationId, actor.accountId, actor.deviceId) : this.store.one('SELECT * FROM operations WHERE workspace_id=? AND idempotency_key=? AND account_id=? AND device_id=?', args.workspaceId, args.idempotencyKey, actor.accountId, actor.deviceId); check(row, 'NOT_FOUND', 'Operation not found'); const result = this.store.result(row); return { ...result, data: { ...(result.data as any ?? {}), children: this.store.all('SELECT id,state,capability FROM operations WHERE parent_id=?', row.id) } }; }
    status(actor: Actor) { this.authenticate(actor); this.scope(actor, 'portal:read'); const d = this.store.identity(); return ok({ version: '0.1.0', deviceId: d.id, label: d.label, transport: this.store.setting('transport', 'local'), authenticated: true, accepting: this.accepting, workspaces: this.store.all('SELECT id,access,writer_epoch,state,expires_at FROM workspaces WHERE account_id=?', actor.accountId), grants: this.store.all('SELECT alias,access,revision,expires_at,revoked FROM grants'), jobs: this.store.all('SELECT id,workspace_id,state,kind,exit_code,deadline FROM jobs ORDER BY created_at DESC LIMIT 100'), capabilities: this.registry.all().filter(c => !c.availability().available).map(c => ({ id: c.id, ...c.availability() })), journal: this.store.integrity() }); }
    async closeWorkspace(actor: Actor, args: Obj): Promise<Result> { try {
        validate(s.object({ workspaceId: s.key(), idempotencyKey: s.key(), behavior: s.enum(['refuse_if_busy', 'drain', 'cancel']), report: s.string(65536) }, ['workspaceId', 'idempotencyKey', 'behavior']), args);
        this.authenticate(actor);
        const ws = this.store.one('SELECT * FROM workspaces WHERE id=? AND account_id=?', args.workspaceId, actor.accountId);
        check(ws, 'NOT_FOUND', 'Workspace missing');
        this.scope(actor, ws.access === 'write' ? 'portal:write' : 'portal:read');
        if (args.behavior === 'cancel')
            this.scope(actor, 'portal:exec');
        const accept = this.store.accept({ accountId: actor.accountId, deviceId: actor.deviceId, workspaceId: ws.id, key: args.idempotencyKey, hash: requestHash(args), capability: 'close_workspace', revision: '1' });
        if (!accept.created)
            return this.store.result(accept.row);
        let result: Result;
        try {
            const jobs = this.store.all("SELECT id FROM jobs WHERE workspace_id=? AND state IN ('accepted','running','cancel_requested')", ws.id);
            check(!jobs.length || args.behavior !== 'refuse_if_busy', 'WRITER_BUSY', 'Workspace has active jobs', { jobs });
            const lease = this.store.one('SELECT * FROM writer_leases WHERE workspace_id=?', ws.id);
            check(jobs.length || !lease || lease.quiescent, 'WRITER_NOT_QUIESCENT', 'A prior mutation has no confirmed quiescent outcome; recover locally before closing');
            if (jobs.length) {
                this.store.run("UPDATE workspaces SET state='closing' WHERE id=?", ws.id);
                if (args.behavior === 'cancel')
                    this.store.run("UPDATE jobs SET state='cancel_requested' WHERE workspace_id=? AND state IN ('accepted','running')", ws.id);
                result = ok({ workspaceId: ws.id, closed: false, closureRequested: true, behavior: args.behavior, jobs });
            }
            else {
                this.store.tx(() => { this.store.run("UPDATE workspaces SET state='closed' WHERE id=?", ws.id); this.store.run('DELETE FROM writer_leases WHERE workspace_id=?', ws.id); });
                result = ok({ workspaceId: ws.id, closed: true, deviceRemainsAvailable: true });
            }
            this.store.finish(accept.row.id, result);
            return { ...result, operationId: accept.row.id };
        }
        catch (e) {
            result = err(e, { operationId: accept.row.id });
            this.store.finish(accept.row.id, result);
            return result;
        }
    }
    catch (e) {
        return err(e);
    } }
    reconcileOperations() {
        for (const row of this.store.all("SELECT * FROM operations WHERE state IN ('accepted','queued','running')")) {
            if (this.active.has(row.id) || this.store.one("SELECT id FROM jobs WHERE operation_id=? AND state IN ('accepted','running','cancel_requested')", row.id))
                continue;
            const commits = this.store.all('SELECT * FROM file_commits WHERE operation_id=?', row.id);
            let effects = 0;
            for (const c of commits) {
                try {
                    const root = new RootedFs(c.root, this.protectedRoots);
                    const actual = root.hash(c.path);
                    root.close();
                    if (actual === c.after_sha) {
                        this.store.run("UPDATE file_commits SET state='committed' WHERE id=?", c.id);
                        effects++;
                    }
                    else if (actual !== c.before_sha)
                        this.store.run("UPDATE file_commits SET state='unknown' WHERE id=?", c.id);
                }
                catch {
                    this.store.run("UPDATE file_commits SET state='unknown' WHERE id=?", c.id);
                }
            }
            const knownSingle = commits.length === 1 && effects === 1 && ['files.write', 'files.append', 'files.replace', 'files.remove'].includes(row.capability);
            this.store.finish(row.id, knownSingle ? ok({ recovered: true, files: commits.map(c => ({ path: c.path, sha256: c.after_sha, commitId: c.id })), executionCountNotProven: true }, { operationId: row.id }) : err(new PortalError(row.state === 'accepted' ? 'INTERRUPTED_BEFORE_DISPATCH' : 'OUTCOME_UNKNOWN', row.state === 'accepted' ? 'Agent stopped before dispatch; no automatic replay' : 'Operation owner was lost; inspect recorded effects before continuing', { partialEffects: effects > 0, files: commits.map(c => ({ path: c.path, state: c.state })) }, 'after_status_check'), { operationId: row.id }));
            this.store.run('UPDATE writer_leases SET operation_id=NULL,quiescent=1 WHERE operation_id=?', row.id);
        }
        for (const ws of this.store.all("SELECT id FROM workspaces WHERE state='closing'")) {
            if (!this.store.one("SELECT id FROM jobs WHERE workspace_id=? AND state IN ('accepted','running','cancel_requested')", ws.id) && !this.store.one('SELECT operation_id FROM writer_leases WHERE workspace_id=? AND operation_id IS NOT NULL', ws.id)) {
                this.store.run("UPDATE workspaces SET state='closed' WHERE id=?", ws.id);
                this.store.run('DELETE FROM writer_leases WHERE workspace_id=?', ws.id);
            }
        }
    }
    approve(approvalId: string) { const a = this.store.one("SELECT * FROM approvals WHERE id=? AND state='pending'", approvalId); check(a && a.expires_at > Date.now(), 'NOT_FOUND', 'Pending approval missing or expired'); this.store.run("UPDATE approvals SET state='approved' WHERE id=?", approvalId); return { approvalId, approved: true, scope: JSON.parse(a.scope) }; }
}
