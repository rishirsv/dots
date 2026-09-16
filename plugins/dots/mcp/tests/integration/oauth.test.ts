import test from 'node:test';
import assert from 'node:assert/strict';
import { missingDependencies } from '../support/dependencies.js';
import { startTestIssuer } from '../support/oidc-issuer.js';
import { OAuthResourceServer } from '../../apps/relay/src/auth.js';
const missing = missingDependencies(['jose']);
test('E01 actual JOSE verifier rejects wrong issuer, audience, expiry, signature and absent scope', { skip: missing.length ? 'Not exercised: ' + missing.join(',') + ' is not installed' : false }, async () => { const issuer = await startTestIssuer({ enabled: true }); try {
    const store = { account: async (_issuer: string, subject: string) => 'account:' + subject };
    const auth = new OAuthResourceServer({ issuer: issuer.origin, audience: 'portal-test', jwksUri: issuer.origin + '/jwks', publicOrigin: 'http://127.0.0.1:8787', testOnly: true }, store as any);
    assert.equal((await auth.principal('Bearer ' + issuer.issue('alice'))).accountId, 'account:alice');
    for (const override of [{ iss: 'https://wrong.invalid' }, { aud: 'other' }, { exp: 1 }, { nbf: Math.floor(Date.now() / 1000) + 3600 }])
        await assert.rejects(auth.principal('Bearer ' + issuer.issue('alice', override)));
    await assert.rejects(auth.principal('Bearer ' + issuer.issue('alice').slice(0, -20) + 'AAAAAAAAAAAAAAAAAAAA'));
    const restricted = await auth.principal('Bearer ' + issuer.issue('bob', { scope: 'portal:read' }));
    assert.throws(() => auth.require(restricted, 'portal:write'));
}
finally {
    await issuer.close();
} });
