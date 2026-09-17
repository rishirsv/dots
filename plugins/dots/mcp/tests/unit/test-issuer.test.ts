import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { startTestIssuer } from '../support/oidc-issuer.js';
test('U18 test issuer refuses implicit enablement and production startup', async () => { await assert.rejects(startTestIssuer({ enabled: false })); const old = process.env.NODE_ENV; process.env.NODE_ENV = 'production'; try {
    await assert.rejects(startTestIssuer({ enabled: true }));
}
finally {
    if (old === undefined)
        delete process.env.NODE_ENV;
    else
        process.env.NODE_ENV = old;
} });
test('U19 real fixture OIDC server enforces exact redirect and one-use PKCE authorization codes', async () => { const redirect = 'http://127.0.0.1:9999/owner/callback', issuer = await startTestIssuer({ enabled: true, redirects: [redirect] }); try {
    const meta: any = await (await fetch(issuer.origin + '/.well-known/openid-configuration')).json();
    assert.deepEqual(meta.code_challenge_methods_supported, ['S256']);
    const verifier = randomBytes(32).toString('base64url');
    const u = new URL(issuer.origin + '/authorize');
    for (const [k, v] of Object.entries({ client_id: 'portal-test-owner', response_type: 'code', redirect_uri: redirect, subject: 'alice', state: 'test-state', nonce: 'test-nonce', code_challenge_method: 'S256', code_challenge: createHash('sha256').update(verifier).digest('base64url') }))
        u.searchParams.set(k, v);
    const auth = await fetch(u, { redirect: 'manual' });
    assert.equal(auth.status, 302);
    const back = new URL(auth.headers.get('location')!);
    assert.equal(back.searchParams.get('state'), 'test-state');
    const body = new URLSearchParams({ grant_type: 'authorization_code', client_id: 'portal-test-owner', redirect_uri: redirect, code: back.searchParams.get('code')!, code_verifier: 'incorrect' });
    assert.equal((await fetch(issuer.origin + '/token', { method: 'POST', body })).status, 400);
    body.set('code_verifier', verifier);
    const response = await fetch(issuer.origin + '/token', { method: 'POST', body });
    assert.equal(response.status, 200);
    const tokens: any = await response.json();
    assert.equal(JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64url').toString()).nonce, 'test-nonce');
    assert.equal((await fetch(issuer.origin + '/token', { method: 'POST', body })).status, 400);
    u.searchParams.set('redirect_uri', 'https://untrusted.example/callback');
    assert.equal((await fetch(u, { redirect: 'manual' })).status, 400);
}
finally {
    await issuer.close();
} });
