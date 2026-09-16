import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fixture, data, error } from '../support/fixture.js';
import { sha } from '../../packages/protocol/src/index.js';
for (const phase of ['before-accept', 'after-accept', 'after-intent', 'after-rename', 'after-result'])
    test('C01 ' + phase + ': real SIGKILL preserves either evidence or explicit uncertainty without replay', async () => {
        const f = await fixture();
        try {
            f.put('target', 'A');
            const child = spawnSync(process.execPath, [path.join(import.meta.dirname, '../support/crash-child.js'), f.state, phase], { encoding: 'utf8', timeout: 10000 });
            assert.equal(child.signal, 'SIGKILL', child.stderr);
            f.broker.reconcileOperations();
            const record = f.store.one("SELECT * FROM operations WHERE idempotency_key='crash-append'");
            const request = { path: 'target', text: 'B', expectedSha256: sha('A') };
            if (phase === 'before-accept') {
                assert.equal(record, undefined);
                data(await f.call('files.append', request, 'crash-append'));
                assert.equal(fs.readFileSync(path.join(f.root, 'target'), 'utf8'), 'AB');
            }
            else if (phase === 'after-accept') {
                assert.equal(record.state, 'failed');
                error(await f.call('files.append', request, 'crash-append'), 'INTERRUPTED_BEFORE_DISPATCH');
                assert.equal(fs.readFileSync(path.join(f.root, 'target'), 'utf8'), 'A');
            }
            else if (phase === 'after-intent') {
                assert.equal(record.state, 'outcome_unknown');
                error(await f.call('files.append', request, 'crash-append'), 'OUTCOME_UNKNOWN');
                assert.equal(fs.readFileSync(path.join(f.root, 'target'), 'utf8'), 'A');
            }
            else {
                assert.equal(record.state, 'succeeded');
                data(await f.call('files.append', request, 'crash-append'));
                assert.equal(fs.readFileSync(path.join(f.root, 'target'), 'utf8'), 'AB');
            }
        }
        finally {
            await f.close();
        }
    });
test('C02 changed external bytes during crash reconciliation remain unknown, never overwritten', async () => { const f = await fixture(); try {
    f.put('target', 'A');
    spawnSync(process.execPath, [path.join(import.meta.dirname, '../support/crash-child.js'), f.state, 'after-rename'], { timeout: 10000 });
    f.put('target', 'external edit');
    f.broker.reconcileOperations();
    const op = f.store.one("SELECT * FROM operations WHERE idempotency_key='crash-append'");
    assert.equal(op.state, 'outcome_unknown');
    assert.equal(fs.readFileSync(path.join(f.root, 'target'), 'utf8'), 'external edit');
}
finally {
    await f.close();
} });
