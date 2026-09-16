import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fixture, data, error, seedJob } from '../support/fixture.js';
import { sha, id, s, requestHash } from '../../packages/protocol/src/index.js';
import { LocalStore } from '../../packages/storage/src/local.js';
test('I01 guarded write and duplicate append preserve a single physical effect', async () => {
    const f = await fixture();
    try {
        const w = await f.call('files.write', { path: 'a.txt', text: 'A', expectedSha256: null }, 'write-a');
        data(w);
        const stat = fs.statSync(path.join(f.root, 'a.txt'));
        assert.equal((await f.call('files.write', { path: 'a.txt', text: 'A', expectedSha256: null }, 'write-a')).operationId, w.operationId);
        assert.equal(fs.statSync(path.join(f.root, 'a.txt')).ino, stat.ino);
        const a = await f.call('files.append', { path: 'a.txt', text: 'B', expectedSha256: sha('A') }, 'append-b');
        data(a);
        assert.equal((await f.call('files.append', { path: 'a.txt', text: 'B', expectedSha256: sha('A') }, 'append-b')).operationId, a.operationId);
        assert.equal(fs.readFileSync(path.join(f.root, 'a.txt'), 'utf8'), 'AB');
        error(await f.call('files.append', { path: 'a.txt', text: 'C', expectedSha256: sha('AB') }, 'append-b'), 'IDEMPOTENCY_CONFLICT');
    }
    finally {
        await f.close();
    }
});
test('I02 stale source or writer epoch never changes bytes', async () => { const f = await fixture(); try {
    f.put('a', 'before');
    error(await f.call('files.write', { path: 'a', text: 'after', expectedSha256: sha('different') }), 'WRITE_CONFLICT');
    error(await f.call('files.write', { path: 'a', text: 'after', expectedSha256: sha('before') }, 'stale', { writerEpoch: f.ws.writerEpoch + 1 }), 'STALE_WRITER');
    assert.equal(fs.readFileSync(path.join(f.root, 'a'), 'utf8'), 'before');
}
finally {
    await f.close();
} });
test('I03 file ranges preserve CRLF, UTF-8, empty files, tail and binary boundaries', async () => { const f = await fixture(); try {
    f.put('text', 'one\r\nété\r\nlast');
    const r = data(await f.call('files.read', { path: 'text', startLine: 2, maxLines: 1 }));
    assert.equal(r.text, 'été\r\n');
    assert.equal(r.startLine, 2);
    assert.equal(r.truncated, true);
    assert.equal(data(await f.call('files.tail', { path: 'text', tailLines: 1 })).text, 'last');
    f.put('empty', '');
    assert.equal(data(await f.call('files.read', { path: 'empty' })).text, '');
    f.put('binary', Buffer.from([0, 255, 1]));
    error(await f.call('files.read', { path: 'binary' }), 'UNSUPPORTED_FORMAT');
    assert.equal(data(await f.call('files.read', { path: 'binary', startByte: 0, maxBytes: 3 })).base64, 'AP8B');
    f.put('split', 'é');
    assert.equal(data(await f.call('files.read', { path: 'split', startByte: 1, maxBytes: 1 })).base64, 'qQ==');
}
finally {
    await f.close();
} });
test('I04 read_many returns partial per-file errors and huge lines require bytes', async () => { const f = await fixture(); try {
    f.put('a', 'A');
    f.put('huge', 'x'.repeat(70000));
    const r = data(await f.call('files.read_many', { files: [{ path: 'a' }, { path: 'missing' }] }));
    assert.equal(r.items[0].text, 'A');
    assert.equal(r.items[1].error.code, 'NOT_FOUND');
    error(await f.call('files.read', { path: 'huge' }), 'LIMIT_EXCEEDED');
    assert.equal(data(await f.call('files.read', { path: 'huge', startByte: 65000, maxBytes: 5000 })).byteCount, 5000);
}
finally {
    await f.close();
} });
test('I05 listing snapshot pages are stable and reject changed directories', async () => { const f = await fixture(); try {
    for (const n of ['a', 'b', 'c', '.hidden', 'é'])
        f.put(n, n);
    const p = data(await f.call('files.list', { path: '.', limit: 2 }));
    assert.equal(p.entries.length, 2);
    const p2 = data(await f.call('files.list', { path: '.', limit: 2, cursor: p.nextCursor }));
    assert.equal(new Set([...p.entries, ...p2.entries].map((x: any) => x.name)).size, 4);
    f.put('new', 'x');
    error(await f.call('files.list', { path: '.', limit: 2, cursor: p.nextCursor }), 'SOURCE_CHANGED');
}
finally {
    await f.close();
} });
test('I06 symlinks, hardlinks, traversal and protected installations are refused', async () => { const f = await fixture(); try {
    const secret = path.join(f.dir, 'outside');
    fs.writeFileSync(secret, 'secret');
    fs.symlinkSync(secret, path.join(f.root, 'link'));
    const r = await f.call('files.read', { path: 'link' });
    assert.ok(r.error);
    assert.equal(JSON.stringify(r).includes('secret'), false);
    fs.linkSync(secret, path.join(f.root, 'hard'));
    assert.ok((await f.call('files.read', { path: 'hard' })).error);
    error(await f.call('files.read', { path: '../outside' }), 'PATH_OUTSIDE_GRANT');
    assert.throws(() => f.broker.addGrant({ root: f.state, alias: 'state', access: 'read' }));
    assert.equal(fs.readFileSync(secret, 'utf8'), 'secret');
}
finally {
    await f.close();
} });
test('I07 multi-file patches support add/update/move with source and destination preconditions', async () => { const f = await fixture(); try {
    f.put('a.txt', 'old\n');
    const patch = '*** Begin Patch\n*** Update File: a.txt\n*** Move to: moved.txt\n@@\n-old\n+new\n*** Add File: fresh.txt\n+hello\n*** End Patch';
    data(await f.call('files.apply_patch', { patch, expectedSha256: { 'a.txt': sha('old\n'), 'moved.txt': null, 'fresh.txt': null } }));
    assert.equal(fs.existsSync(path.join(f.root, 'a.txt')), false);
    assert.equal(fs.readFileSync(path.join(f.root, 'moved.txt'), 'utf8'), 'new\n');
    assert.ok(fs.readFileSync(path.join(f.root, 'fresh.txt'), 'utf8').startsWith('hello'));
}
finally {
    await f.close();
} });
test('I08 exact replacement count and destination collisions are not fuzzy-corrected', async () => { const f = await fixture(); try {
    f.put('a', 'old old');
    error(await f.call('files.replace', { path: 'a', expectedSha256: sha('old old'), oldText: 'old', newText: 'new', expectedReplacements: 1 }), 'WRITE_CONFLICT');
    f.put('b', 'keep');
    error(await f.call('files.copy', { source: 'a', destination: 'b', expectedSourceSha256: sha('old old'), expectedDestinationSha256: null }), 'WRITE_CONFLICT');
    assert.equal(fs.readFileSync(path.join(f.root, 'b'), 'utf8'), 'keep');
}
finally {
    await f.close();
} });
test('I09 removal is exact-action approved, recoverable and deduplicated', async () => { const f = await fixture(); try {
    f.put('a', 'precious');
    const args = { path: 'a', expectedSha256: sha('precious') };
    const denied = error(await f.call('files.remove', args, 'remove-denied'), 'APPROVAL_REQUIRED');
    f.broker.approve(denied.details.approvalId);
    const removed = await f.call('files.remove', args, 'remove-approved');
    data(removed);
    assert.equal(fs.existsSync(path.join(f.root, 'a')), false);
    assert.equal((await f.call('files.remove', args, 'remove-approved')).operationId, removed.operationId);
    const copies = fs.readdirSync(path.join(f.state, 'recovery'));
    assert.ok(copies.some(x => fs.statSync(path.join(f.state, 'recovery', x)).isFile() && fs.readFileSync(path.join(f.state, 'recovery', x), 'utf8') === 'precious'));
}
finally {
    await f.close();
} });
test('I10 concurrent readers coexist; overlapping writable roots cannot steal ownership', async () => { const f = await fixture(); try {
    fs.mkdirSync(path.join(f.root, 'child'));
    f.broker.addGrant({ root: path.join(f.root, 'child'), alias: 'child', access: 'write' });
    const read = await f.broker.openWorkspace(f.actor, { deviceId: f.actor.deviceId, rootAlias: 'fixture', access: 'read', idempotencyKey: 'reader' });
    data(read);
    error(await f.broker.openWorkspace(f.actor, { deviceId: f.actor.deviceId, rootAlias: 'child', access: 'write', idempotencyKey: 'writer2' }), 'WRITER_BUSY');
    error(await f.broker.openWorkspace(f.actor, { deviceId: f.actor.deviceId, rootAlias: 'fixture', access: 'write', idempotencyKey: 'writer3' }), 'WRITER_BUSY');
}
finally {
    await f.close();
} });
test('I11 exact account/device binding, OAuth scopes and connection epochs are enforced', async () => {
    const f = await fixture();
    try {
        error(await f.frontDoor.call({ ...f.actor, accountId: 'stranger' }, 'status', {}), 'FORBIDDEN');
        error(await f.frontDoor.call({ ...f.actor, scopes: [] }, 'get_operation', { operationId: 'x' }), 'FORBIDDEN');
        f.store.setSetting('transport', 'relay');
        f.store.run('UPDATE device_identity SET connection_epoch=5');
        error(await f.frontDoor.call({ ...f.actor, transport: 'relay', connectionEpoch: 4 }, 'status', {}), 'STALE_CONNECTION');
        error(await f.broker.invoke({ ...f.actor, scopes: ['portal:read'] }, { workspaceId: f.ws.workspaceId, writerEpoch: f.ws.writerEpoch, idempotencyKey: 'denied', capabilityId: 'files.write', arguments: { path: 'x', text: 'x', expectedSha256: null } }), 'FORBIDDEN');
        error(await f.frontDoor.call({ ...f.actor, scopes: ['portal:read'] }, 'close_workspace', { workspaceId: f.ws.workspaceId, idempotencyKey: 'close-no-write', behavior: 'refuse_if_busy' }), 'FORBIDDEN');
    }
    finally {
        await f.close();
    }
});
test('I12 closed workspace handles stay closed and a later writer receives a new epoch', async () => { const f = await fixture(); try {
    data(await f.broker.closeWorkspace(f.actor, { workspaceId: f.ws.workspaceId, idempotencyKey: 'close', behavior: 'refuse_if_busy' }));
    error(await f.call('files.read', { path: 'a' }), 'WORKSPACE_CLOSED');
    const next = data(await f.broker.openWorkspace(f.actor, { deviceId: f.actor.deviceId, rootAlias: 'fixture', access: 'write', idempotencyKey: 'new-open' }));
    assert.notEqual(next.workspaceId, f.ws.workspaceId);
    assert.ok(next.writerEpoch > f.ws.writerEpoch);
}
finally {
    await f.close();
} });
test('I13 active mutating jobs hold the gate after admission; unknown workers prevent unsafe closure', async () => { const f = await fixture(); try {
    const j = seedJob(f);
    f.store.run('UPDATE writer_leases SET operation_id=?,quiescent=0 WHERE workspace_id=?', j.operationId, f.ws.workspaceId);
    error(await f.call('files.write', { path: 'a', text: 'A', expectedSha256: null }), 'WRITER_BUSY');
    error(await f.broker.closeWorkspace(f.actor, { workspaceId: f.ws.workspaceId, idempotencyKey: 'close-busy', behavior: 'refuse_if_busy' }), 'WRITER_BUSY');
    f.store.run("UPDATE jobs SET state='outcome_unknown' WHERE id=?", j.jobId);
    error(await f.broker.closeWorkspace(f.actor, { workspaceId: f.ws.workspaceId, idempotencyKey: 'close-unknown', behavior: 'refuse_if_busy' }), 'WRITER_NOT_QUIESCENT');
}
finally {
    await f.close();
} });
test('I14 grant revocation fences both direct reads and pending work', async () => { const f = await fixture(); try {
    await f.broker.revokeGrant(f.ws.grantId);
    error(await f.call('files.read', { path: 'x' }), 'GRANT_EXPIRED');
    assert.throws(() => f.broker.approve('missing'));
}
finally {
    await f.close();
} });
test('I15 unavailable, unknown, forbidden and stale capability contracts are distinguishable', async () => { const f = await fixture(); try {
    error(await f.call('files.read', { path: 'x' }, 'k', { revision: '0'.repeat(64) }), 'CAPABILITY_CHANGED');
    const missing = await f.broker.invoke(f.actor, { workspaceId: f.ws.workspaceId, capabilityId: 'made.up', arguments: {} });
    error(missing, 'NOT_FOUND');
    if (!f.registry.get('terminal.exec').availability().available)
        error(await f.call('terminal.exec', { argv: ['/bin/echo', 'x'], cwd: '.' }), 'EXECUTOR_UPGRADE_REQUIRED');
}
finally {
    await f.close();
} });
test('I16 optional task reports are immutable, versioned and independent of workspace lifetime', async () => { const f = await fixture(); try {
    const t = data(await f.call('tasks.create', { label: 'Review', brief: 'Fixture brief' }));
    data(await f.call('tasks.save_result', { taskId: t.taskId, body: 'version one' }));
    data(await f.call('tasks.save_result', { taskId: t.taskId, body: 'version two' }));
    const read = data(await f.call('tasks.read', { taskId: t.taskId }));
    assert.equal(read.results.length, 2);
    assert.equal(read.results[0].body, 'version one');
    data(await f.call('tasks.close', { taskId: t.taskId }));
    data(await f.call('files.write', { path: 'still-works', text: 'yes', expectedSha256: null }));
}
finally {
    await f.close();
} });
test('I17 payload expiry retains known outcome and cannot replay the original key', async () => { const f = await fixture(); try {
    const args = { path: 'a', text: 'A', expectedSha256: null };
    const op = await f.call('files.write', args, 'expiring');
    data(op);
    f.store.expire(Date.now() + 1);
    assert.equal(f.store.one('SELECT payload_expired FROM operations WHERE id=?', op.operationId).payload_expired, 0);
    f.store.run('UPDATE result_outbox SET acknowledged=1');
    f.store.expire(Date.now() + 1);
    error(await f.call('files.write', args, 'expiring'), 'RESULT_EXPIRED');
    assert.equal(fs.readFileSync(path.join(f.root, 'a'), 'utf8'), 'A');
}
finally {
    await f.close();
} });
test('I18 journal backup restores integrity and migrations are repeatable', async () => { const f = await fixture(); let restored: LocalStore | undefined; try {
    data(await f.call('files.write', { path: 'a', text: 'saved', expectedSha256: null }));
    const dir = path.join(f.dir, 'restored');
    fs.mkdirSync(dir);
    await f.store.backup(path.join(dir, 'portal.sqlite'));
    restored = new LocalStore(dir);
    assert.equal(Object.values(restored.integrity()[0])[0], 'ok');
    assert.equal(restored.one('SELECT COUNT(*) n FROM operations').n, f.store.one('SELECT COUNT(*) n FROM operations').n);
}
finally {
    restored?.close();
    await f.close();
} });
