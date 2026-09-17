import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fixture, seedJob } from '../support/fixture.js';
import { OutputSpool } from '../../packages/capabilities/src/terminal/spool.js';
test('U11 two output readers see identical immutable pages and separate stdout/stderr', async () => { const f = await fixture(); try {
    const j = seedJob(f), spool = new OutputSpool(f.store);
    spool.append(j.jobId, 'stdout', Buffer.from('hello'));
    spool.append(j.jobId, 'stderr', Buffer.from('error'));
    const a = spool.read(f.ws.workspaceId, j.jobId, null, 5), b = spool.read(f.ws.workspaceId, j.jobId, null, 5);
    assert.deepEqual(a, b);
    assert.equal(a.chunks[0].text, 'hello');
    const c = spool.read(f.ws.workspaceId, j.jobId, a.nextCursor, 5);
    assert.equal(c.chunks[0].stream, 'stderr');
    assert.equal(c.chunks[0].startOffset, 5);
    assert.equal(c.chunks[0].text, 'error');
}
finally {
    await f.close();
} });
test('U12 quota eviction preserves absolute offsets and reports explicit gaps', async () => { const f = await fixture(); try {
    const j = seedJob(f), spool = new OutputSpool(f.store, 65536, 131072);
    spool.append(j.jobId, 'stdout', Buffer.alloc(196608, 65));
    const p = spool.read(f.ws.workspaceId, j.jobId, null, 65536);
    assert.equal(p.committedEndOffset, 196608);
    assert.equal(p.retainedStartOffset, 131072);
    assert.deepEqual(p.omittedRanges, [{ startOffset: 0, endOffset: 131072, reason: 'retention-quota' }]);
    assert.equal(p.chunks[0].startOffset, 131072);
    assert.equal(f.store.one('SELECT SUM(end_offset-start_offset) n FROM job_output_segments WHERE evicted=0').n, 65536);
}
finally {
    await f.close();
} });
test('U13 cursor ownership, split UTF-8 and corrupted output are handled explicitly', async () => { const f = await fixture(); try {
    const a = seedJob(f, 'job_a'), b = seedJob(f, 'job_b'), spool = new OutputSpool(f.store);
    spool.append(a.jobId, 'stdout', Buffer.from('é'));
    const p = spool.read(f.ws.workspaceId, a.jobId, null, 1);
    assert.equal(p.chunks[0].encoding, 'base64');
    assert.throws(() => spool.read(f.ws.workspaceId, b.jobId, p.nextCursor, 1));
    const seg = f.store.one('SELECT path FROM job_output_segments WHERE job_id=?', a.jobId);
    fs.writeFileSync(seg.path, 'corrupted');
    assert.equal(spool.read(f.ws.workspaceId, a.jobId).omittedRanges[0].reason, 'segment-unavailable');
}
finally {
    await f.close();
} });
