import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fixture, data, error } from '../support/fixture.js';
import { sha, sleep } from '../../packages/protocol/src/index.js';
async function done(f: any, searchId: string) { for (let i = 0; i < 100; i++) {
    const p = data(await f.call('search.read', { searchId, waitMs: 50, maxResults: 200 }));
    if (p.complete)
        return p;
    await sleep(10);
} throw new Error('Search did not terminate'); }
test('I19 search is durable, ignores ignored/hidden files, and supplies exact evidence', async () => { const f = await fixture(); try {
    f.put('Sources/A.swift', 'prefix\nHealthObservationWindow\nlast');
    f.put('ignored/x.swift', 'HealthObservationWindow');
    f.put('.hidden.swift', 'HealthObservationWindow');
    f.put('.gitignore', 'ignored/\n');
    f.put('binary', Buffer.from([0, 1, 2]));
    const started = data(await f.call('search.start', { path: '.', pattern: 'HealthObservationWindow', kind: 'literal', fileGlob: '**/*.swift', contextLines: 1 }));
    const p = await done(f, started.searchId);
    assert.equal(p.matches.length, 1);
    assert.equal(p.matches[0].path, 'Sources/A.swift');
    assert.equal(p.matches[0].line, 2);
    assert.equal(p.matches[0].sha256, sha('prefix\nHealthObservationWindow\nlast'));
    assert.equal(f.store.one('SELECT state FROM searches WHERE id=?', started.searchId).state, 'succeeded');
    assert.deepEqual(data(await f.call('search.read', { searchId: started.searchId })).matches, p.matches);
}
finally {
    await f.close();
} });
test('I20 invalid regex is a typed error; valid regex runs in its bounded worker', async () => { const f = await fixture(); try {
    error(await f.call('search.start', { path: '.', pattern: '[', kind: 'regex' }), 'INVALID_ARGUMENT');
    f.put('x.txt', 'abc123\nno');
    const start = data(await f.call('search.start', { path: '.', pattern: 'abc\\d+', kind: 'regex' }));
    const p = await done(f, start.searchId);
    assert.equal(p.matches[0].line, 1);
}
finally {
    await f.close();
} });
test('I21 concurrent searches and cancellation are separately scoped', async () => { const f = await fixture(); try {
    for (let i = 0; i < 20; i++)
        f.put('dir' + i + '/a.txt', 'alpha beta');
    const a = data(await f.call('search.start', { path: '.', pattern: 'alpha', kind: 'literal' }));
    const b = data(await f.call('search.start', { path: '.', pattern: 'beta', kind: 'literal' }));
    data(await f.call('search.cancel', { searchId: a.searchId }));
    const br = await done(f, b.searchId);
    const ar = await done(f, a.searchId);
    assert.equal(br.matches.length, 20);
    assert.equal(ar.state, 'cancelled');
}
finally {
    await f.close();
} });
test('I22 static skill hashes are byte-accurate and exclude approved private skills', async () => { const f = await fixture(); try {
    const dir = path.join(f.dir, 'private');
    fs.mkdirSync(path.join(dir, 'portal'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'portal', 'SKILL.md'), '---\nname: portal\ndescription: Private fixture instructions\n---\nNever execute on load.');
    fs.writeFileSync(path.join(dir, 'portal', 'reference.md'), 'private reference');
    f.store.run('INSERT INTO skill_roots(alias,path,grant_id) VALUES(?,?,?)', 'owner', dir, f.ws.grantId);
    const found = f.skills.discover('portal', f.ws.grantId);
    assert.ok(found.skills.some((x: any) => x.id === 'owner:portal'));
    const list = f.skills.staticList();
    assert.equal(list.skills.length, 5);
    for (const skill of list.skills) {
        assert.equal(skill.uri.includes('owner'), false);
        assert.deepEqual(f.skills.staticGet(skill.uri).skill, skill);
        for (const resource of skill.resources) {
            const content: any = f.skills.resource(resource.uri).contents[0];
            assert.equal(resource.digest, 'sha256:' + sha(content.text !== undefined ? Buffer.from(content.text) : Buffer.from(content.blob, 'base64')));
        }
    }
}
finally {
    await f.close();
} });
test('I23 live skill/reference loading reports provenance and changed versions without executing scripts', async () => { const f = await fixture(); try {
    const dir = path.join(f.dir, 'skills'), bundle = path.join(dir, 'swift');
    fs.mkdirSync(bundle, { recursive: true });
    const skill = '---\nname: swift\ndescription: Swift fixture\n---\nUse this guide as data.';
    fs.writeFileSync(path.join(bundle, 'SKILL.md'), skill);
    fs.writeFileSync(path.join(bundle, 'note.md'), 'Actual reference');
    fs.writeFileSync(path.join(bundle, 'script.sh'), 'touch NEVER_EXECUTE');
    f.store.run('INSERT INTO skill_roots(alias,path,grant_id) VALUES(?,?,?)', 'team', dir, f.ws.grantId);
    const loaded = f.skills.load('team:swift', f.ws.grantId);
    assert.ok(JSON.stringify(loaded).includes('Use this guide as data.'));
    const ref = f.skills.load('team:swift', f.ws.grantId, undefined, 'note.md');
    assert.ok(JSON.stringify(ref).includes('Actual reference'));
    assert.equal(fs.existsSync(path.join(bundle, 'NEVER_EXECUTE')), false);
    assert.throws(() => f.skills.load('team:swift', f.ws.grantId, undefined, '../secret'));
    fs.appendFileSync(path.join(bundle, 'SKILL.md'), '\nChanged');
    assert.throws(() => f.skills.load('team:swift', f.ws.grantId, loaded.provenance.bundleDigest));
}
finally {
    await f.close();
} });
test('I24 repository instructions stay inert and show path specificity', async () => { const f = await fixture(); try {
    f.put('AGENTS.md', 'Root instructions');
    f.put('Sources/AGENTS.md', 'Source instructions');
    f.put('Sources/A.swift', 'x');
    const result = data(await f.call('instructions.read_for_path', { path: 'Sources/A.swift' }));
    const text = JSON.stringify(result);
    assert.ok(text.includes('Root instructions'));
    assert.ok(text.includes('Source instructions'));
}
finally {
    await f.close();
} });
