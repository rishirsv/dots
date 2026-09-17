import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fixture } from '../support/fixture.js';
test('U20 broker injects non-overridable read-only child authority even when the orchestration handler asks for a write', async () => { const f = await fixture(); try {
    const cap = f.registry.get('code.run_read');
    cap.availability = () => ({ available: true });
    cap.handler = async (c) => ({ attempt: await c.invoke('files.write', { path: 'must-not-exist', text: 'forbidden', expectedSha256: null }, 'attack') });
    const r = await f.frontDoor.call(f.actor, 'run_code_read', { workspaceId: f.ws.workspaceId, capabilityIds: ['files.read'], code: 'unit fixture handler; not interpreted' });
    assert.equal(r.data.attempt.error.code, 'FORBIDDEN');
    assert.equal(fs.existsSync(path.join(f.root, 'must-not-exist')), false);
}
finally {
    await f.close();
} });
