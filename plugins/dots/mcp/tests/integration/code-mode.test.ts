import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fixture, data } from '../support/fixture.js';
import { missingDependencies, until } from '../support/dependencies.js';
const missing = missingDependencies(['quickjs-emscripten']);
const options = { skip: missing.length ? 'Not exercised: QuickJS WASM dependency is not installed' : false };
async function program(f: any, code: string, capabilityIds: string[], readonly = true, key = 'program') { const result = await f.frontDoor.call(f.actor, readonly ? 'run_code_read' : 'run_code', { workspaceId: f.ws.workspaceId, code, capabilityIds, limits: { wallMs: 1200, maxCalls: 20 }, ...(readonly ? {} : { writerEpoch: f.ws.writerEpoch, idempotencyKey: key }) }); data(result); return until(() => f.broker.getOperation(f.actor, { operationId: result.operationId }), r => !['accepted', 'running', 'queued'].includes(r.state ?? ''), 10000); }
test('E02 real QuickJS composes authorized reads without Node host globals', options, async () => { const f = await fixture(); try {
    f.put('hello.txt', 'Hello Portal');
    const r = await program(f, 'const a = await portal.files.read({path:"hello.txt"}); return {text:a.text, host:typeof process, loader:typeof require, network:typeof fetch};', ['files.read']);
    assert.equal(r.state, 'succeeded', JSON.stringify(r));
    assert.deepEqual(r.data.returned, { text: 'Hello Portal', host: 'undefined', loader: 'undefined', network: 'undefined' });
}
finally {
    await f.close();
} });
test('E03 real QuickJS interrupts infinite code and rejects read-mode mutations', options, async () => { const f = await fixture(); try {
    assert.equal((await program(f, 'while(true) {}', [])).state, 'failed');
    const denied = await f.frontDoor.call(f.actor, 'run_code_read', { workspaceId: f.ws.workspaceId, code: 'return 1;', capabilityIds: ['files.write'] });
    assert.equal(denied.error?.code, 'FORBIDDEN');
}
finally {
    await f.close();
} });
test('E04 code failure preserves first-write receipt and identical parent retry does not rerun', options, async () => { const f = await fixture(); try {
    const code = 'await portal.files.write({path:"effect.txt",text:"once",expectedSha256:null,stepKey:"write-one"}); throw new Error("second step failed");';
    const r = await program(f, code, ['files.write'], false, 'parent-once');
    assert.equal(r.state, 'failed');
    assert.equal(r.error.details.partialEffects, true);
    assert.equal(fs.readFileSync(path.join(f.root, 'effect.txt'), 'utf8'), 'once');
    const again = await f.frontDoor.call(f.actor, 'run_code', { workspaceId: f.ws.workspaceId, writerEpoch: f.ws.writerEpoch, idempotencyKey: 'parent-once', code, capabilityIds: ['files.write'], limits: { wallMs: 1200, maxCalls: 20 } });
    assert.equal(again.operationId, r.operationId);
    assert.equal(f.store.one("SELECT COUNT(*) n FROM operations WHERE capability='files.write'").n, 1);
}
finally {
    await f.close();
} });
