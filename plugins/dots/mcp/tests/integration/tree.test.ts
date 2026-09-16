import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fixture, data, error } from '../support/fixture.js';
function tree(f: any) { f.put('tree/a.txt', 'A'); f.put('tree/deep/b.txt', 'B'); fs.mkdirSync(path.join(f.root, 'tree/empty')); }
test('I26 recursive copy and move preserve nested files and empty directories with explicit manifest preconditions', async () => { const f = await fixture(); try {
    tree(f);
    const m = data(await f.call('files.manifest', { path: 'tree' }));
    const a = { source: 'tree', destination: 'copy', expectedSourceSha256: m.sha256, expectedDestinationSha256: null, recursive: true };
    const first = await f.call('files.copy', a, 'copy-once');
    data(first);
    assert.equal((await f.call('files.copy', a, 'copy-once')).operationId, first.operationId);
    assert.equal(fs.readFileSync(path.join(f.root, 'copy/deep/b.txt'), 'utf8'), 'B');
    assert.ok(fs.statSync(path.join(f.root, 'copy/empty')).isDirectory());
    const moved = data(await f.call('files.move', { ...a, destination: 'moved' }));
    assert.equal(moved.removal.removed, true);
    assert.ok(!fs.existsSync(path.join(f.root, 'tree')));
    assert.equal(fs.readFileSync(path.join(f.root, 'moved/a.txt'), 'utf8'), 'A');
}
finally {
    await f.close();
} });
test('I27 changed subtree, existing destination, symlink and overlapping recursive paths fail without deleting sources', async () => { const f = await fixture(); try {
    tree(f);
    const m = data(await f.call('files.manifest', { path: 'tree' }));
    f.put('tree/new.txt', 'new');
    const a = { source: 'tree', destination: 'copy', expectedSourceSha256: m.sha256, expectedDestinationSha256: null, recursive: true };
    error(await f.call('files.copy', a), 'WRITE_CONFLICT');
    assert.ok(!fs.existsSync(path.join(f.root, 'copy')));
    error(await f.call('files.copy', { ...a, destination: 'tree/inside' }), 'INVALID_ARGUMENT');
    fs.symlinkSync('/etc/passwd', path.join(f.root, 'tree/link'));
    error(await f.call('files.manifest', { path: 'tree' }), 'SYMLINK_REJECTED');
}
finally {
    await f.close();
} });
test('I28 recursive remove requires exact owner approval and returns per-file protected recovery receipts', async () => { const f = await fixture(); try {
    tree(f);
    const m = data(await f.call('files.manifest', { path: 'tree' }));
    const a = { path: 'tree', expectedSha256: m.sha256, recursive: true };
    const pending = await f.call('files.remove', a);
    error(pending, 'APPROVAL_REQUIRED');
    assert.ok(fs.existsSync(path.join(f.root, 'tree')));
    f.broker.approve(pending.error!.details!.approvalId as string);
    const r = data(await f.call('files.remove', a));
    assert.equal(r.removed, true);
    assert.ok(!fs.existsSync(path.join(f.root, 'tree')));
    assert.equal(r.receipts.filter((x: any) => x.recoveryId).length, 2);
    for (const receipt of r.receipts.filter((x: any) => x.recoveryId))
        assert.ok(fs.existsSync(path.join(f.state, 'recovery', receipt.recoveryId)));
}
finally {
    await f.close();
} });
