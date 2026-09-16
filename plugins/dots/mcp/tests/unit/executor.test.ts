import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ALLOWED_RPC, CodexClient, safeEnvironment, sandboxPolicy, executorAvailability } from '../../packages/codex-adapter/src/index.js';
import { fixture } from '../support/fixture.js';
test('U14 only execution and read-only discovery RPCs are admitted, never inference or unsandboxed spawn', () => { const client = new CodexClient('/not-launched', {}); for (const method of ['turn/start', 'review/start', 'thread/shellCommand', 'process/spawn', 'account/login/start', 'config/value/write', 'thread/start']) {
    assert.equal(ALLOWED_RPC.has(method), false);
    assert.throws(() => client.call(method, {}), /allowlist/);
} assert.equal(ALLOWED_RPC.has('command/exec'), true); });
test('U15 executor environment excludes credentials, loader hooks and model-controlled toolchain paths', () => { const env = safeEnvironment({ TERM: 'xterm-256color' }, '/scratch'); assert.equal(env.HOME, '/scratch'); assert.equal(env.TERM, 'xterm-256color'); for (const key of ['OPENAI_API_KEY', 'LD_PRELOAD', 'DYLD_INSERT_LIBRARIES', 'PATH', 'SDKROOT', 'SWIFT_EXEC', 'NODE_OPTIONS'])
    assert.throws(() => safeEnvironment({ [key]: 'bad' }, '/scratch')); assert.equal(Object.hasOwn(env, 'OPENAI_API_KEY'), false); });
test('U16 sandbox profile is an explicit restricted-root contract, never danger-full-access', () => { const r = sandboxPolicy('/work', '/scratch', ['/toolchain'], false, true); assert.equal(r.type, 'readOnly'); assert.equal(r.networkAccess, false); assert.deepEqual(r.access?.readableRoots, ['/work', '/scratch', '/toolchain']); const w = sandboxPolicy('/work', '/scratch', [], true, false); assert.equal(w.type, 'workspaceWrite'); assert.equal(w.readOnlyAccess?.type, 'restricted'); assert.equal(w.excludeSlashTmp, true); });
test('U17 missing, mismatched or false qualification evidence cannot enable terminal execution', async () => { const f = await fixture(); try {
    assert.equal(executorAvailability(f.state).available, false);
    fs.writeFileSync(path.join(f.state, 'codex-qualification.json'), JSON.stringify({ qualified: true, binary: '/bin/true', binarySha256: '0'.repeat(64), platform: process.platform, arch: process.arch, probes: {} }));
    assert.equal(executorAvailability(f.state).available, false);
}
finally {
    await f.close();
} });
