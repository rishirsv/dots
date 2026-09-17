import test from 'node:test';
import assert from 'node:assert/strict';
import { s, validate, safeJson, sha, requestHash, cursor, uncursor, PortalError, err } from '../../packages/protocol/src/index.js';
import { relative, overlaps } from '../../packages/core/src/rooted-fs.js';
import { Registry } from '../../packages/core/src/registry.js';
import { publicAddress } from '../../packages/capabilities/src/network/index.js';
import { glob } from '../../packages/capabilities/src/search/index.js';
import { fixture } from '../support/fixture.js';
test('U01 strict schemas reject unknown control fields, null, bad hashes, and oversized values', () => {
    const schema = s.object({ path: s.path(), expectedSha256: s.nullable(s.sha()) });
    validate(schema, { path: 'file.txt', expectedSha256: null });
    for (const value of [{ path: 'x', expectedSha256: 'bogus' }, { path: 'x', expectedSha256: null, sandbox: 'unsafe' }, null, {}])
        assert.throws(() => validate(schema, value));
    assert.throws(() => validate(s.string(3), 'éé'));
    assert.throws(() => validate(s.int(0, 10), 1.5));
    assert.throws(() => validate(s.key(), ''));
});
test('U02 control JSON cannot carry prototype keys, cycles, functions, nonfinite values or excessive depth', () => {
    for (const x of [JSON.parse('{"__proto__":{"admin":true}}'), { constructor: 'x' }, { n: NaN }, { f: () => 0 }])
        assert.throws(() => safeJson(x));
    const cycle: any = {};
    cycle.self = cycle;
    assert.throws(() => safeJson(cycle));
    let deep: any = null;
    for (let i = 0; i < 80; i++)
        deep = { next: deep };
    assert.throws(() => safeJson(deep));
    safeJson({ ordinary: ['file content', 3, true, null] });
});
test('U03 canonical hashes ignore object-key order, preserve argv boundaries and content bytes', () => {
    assert.equal(requestHash({ b: 2, a: 1 }), requestHash({ a: 1, b: 2 }));
    assert.notEqual(requestHash(['a b', 'c']), requestHash(['a', 'b c']));
    assert.notEqual(sha('x\r\n'), sha('x\n'));
});
test('U04 cursors are versioned and bounded', () => { const c = cursor({ offset: 42, jobId: 'a' }); assert.deepEqual(uncursor(c), { offset: 42, jobId: 'a' }); assert.throws(() => uncursor('bad')); assert.throws(() => uncursor(Buffer.from('{"v":2,"d":{}}').toString('base64url'))); });
test('U05 path boundaries reject absolute, traversal, NUL, ambiguous separators and normalization', () => {
    for (const p of ['../x', '/etc/passwd', 'a/../b', 'a//b', 'a\\b', 'a\0b', 'e\u0301.txt'])
        assert.throws(() => relative(p));
    assert.equal(relative('é.txt'), 'é.txt');
    assert.equal(relative('.'), '.');
    assert.equal(overlaps('/tmp/a', '/tmp/a/b'), true);
    assert.equal(overlaps('/tmp/a', '/tmp/ab'), false);
});
test('U06 registry revisions change on contracts, not timestamps or discovery', () => {
    const make = (description: string) => { const r = new Registry(); r.add({ id: 'x.read', family: 'files', effect: 'read', description, input: s.object({}), handler: () => ({}) }); return r; };
    assert.equal(make('a').revision(), make('b').revision());
    const r = make('a');
    assert.throws(() => r.get('missing'));
    assert.throws(() => r.add({ id: 'x.read', family: 'files', effect: 'read', description: 'duplicate', input: s.object({}), handler: () => ({}) }));
    assert.equal(r.discover('read', [])[0].available, false);
    assert.equal(r.describe(['x.read'])[0].sideEffects, 'read');
});
test('U07 public-address filter denies SSRF targets, mapped addresses and documentation networks', () => {
    for (const ip of ['127.0.0.1', '10.1.2.3', '169.254.169.254', '192.168.1.1', '172.16.0.1', '100.64.0.1', '0.0.0.0', '::1', 'fe80::1', 'fc00::1', '::ffff:127.0.0.1', '2001:db8::1', '2002:7f00:1::1'])
        assert.equal(publicAddress(ip), false, ip);
    assert.equal(publicAddress('1.1.1.1'), true);
    assert.equal(publicAddress('2606:4700:4700::1111'), true);
});
test('U08 bounded glob matching respects directory boundaries and double-star', () => { assert.equal(glob('**/*.swift', 'A.swift'), true); assert.equal(glob('**/*.swift', 'Sources/A.swift'), true); assert.equal(glob('*.swift', 'Sources/A.swift'), false); assert.equal(glob('a?.txt', 'ab.txt'), true); assert.equal(glob('**/*.swift', 'A.swift.bak'), false); });
test('U09 expected errors retain retry semantics and schema errors have their own code', () => { assert.equal(err(new PortalError('OUTCOME_UNKNOWN', 'uncertain', {}, 'after_status_check')).state, 'outcome_unknown'); try {
    validate(s.key(), '');
    assert.fail();
}
catch (e) {
    assert.equal(err(e).error?.code, 'INVALID_ARGUMENT');
} });
test('U10 exactly 17 direct tools and five static skill bundles; correct worst-case annotations', async () => {
    const f = await fixture();
    try {
        assert.equal(f.frontDoor.tools.length, 17);
        for (const n of ['run_code', 'invoke']) {
            const t = f.frontDoor.tools.find(t => t.name === n)!;
            assert.equal(t.annotations.readOnlyHint, false);
            assert.equal(t.annotations.openWorldHint, true);
        }
        assert.equal(f.frontDoor.tools.find(t => t.name === 'run_code_read')!.annotations.readOnlyHint, true);
        assert.equal(f.skills.builtins().length, 5);
        for (const cap of f.registry.all()) {
            assert.equal(cap.input.type, 'object');
            assert.ok(cap.output);
            assert.match(cap.revision, /^[a-f0-9]{64}$/);
        }
    }
    finally {
        await f.close();
    }
});
