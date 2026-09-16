/** Test-only issuer. No passwords, production accounts, or persistent signing keys. */
import http from 'node:http';
import { generateKeyPairSync, randomBytes, sign, createHash } from 'node:crypto';
import { check } from '../../packages/protocol/src/index.js';
export const TEST_SCOPES = 'portal:read portal:write portal:exec portal:documents portal:network portal:owner';
export async function startTestIssuer(options: {
    enabled: boolean;
    port?: number;
    redirects?: string[];
    audience?: string;
}) {
    check(options.enabled && process.env.NODE_ENV !== 'production', 'FORBIDDEN', 'Test issuer must be explicitly enabled outside production');
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'portal-fixture-key', use: 'sig', alg: 'RS256' };
    let origin = '';
    const codes = new Map<string, any>();
    const issue = (subject = 'alice', overrides: Record<string, any> = {}) => { check(['alice', 'bob'].includes(subject), 'FORBIDDEN', 'Only fixture identities are available'); const now = Math.floor(Date.now() / 1000); const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: jwk.kid, typ: 'JWT' })).toString('base64url'); const payload = Buffer.from(JSON.stringify({ iss: origin, sub: subject, aud: options.audience ?? 'portal-test', iat: now, nbf: now - 1, exp: now + 600, scope: TEST_SCOPES, ...overrides })).toString('base64url'); const signing = header + '.' + payload; return signing + '.' + sign('RSA-SHA256', Buffer.from(signing), privateKey).toString('base64url'); };
    const server = http.createServer(async (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        const json = (value: any, status = 200) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
        try {
            const url = new URL(req.url ?? '/', origin);
            if (url.pathname === '/jwks')
                return json({ keys: [jwk] });
            if (url.pathname === '/.well-known/openid-configuration')
                return json({ issuer: origin, authorization_endpoint: origin + '/authorize', token_endpoint: origin + '/token', jwks_uri: origin + '/jwks', response_types_supported: ['code'], subject_types_supported: ['public'], id_token_signing_alg_values_supported: ['RS256'], code_challenge_methods_supported: ['S256'], authorization_response_iss_parameter_supported: true });
            if (url.pathname === '/authorize') {
                const a = Object.fromEntries(url.searchParams);
                check(a.client_id === 'portal-test-owner' && a.response_type === 'code' && a.code_challenge_method === 'S256' && /^[A-Za-z0-9_-]{43}$/.test(a.code_challenge ?? ''), 'FORBIDDEN', 'Unsupported fixture client or PKCE');
                check((options.redirects ?? []).includes(a.redirect_uri), 'FORBIDDEN', 'Redirect URI is not registered');
                if (!a.subject) {
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<h1>Portal TEST issuer</h1><p>Disposable fixture identities only. Never deploy this issuer publicly.</p>' + ['alice', 'bob'].map(subject => { const next = new URL(url); next.searchParams.set('subject', subject); return `<p><a href="${next.pathname + next.search.replaceAll('&', '&amp;')}">Use ${subject}</a></p>`; }).join(''));
                    return;
                }
                check(['alice', 'bob'].includes(a.subject), 'FORBIDDEN', 'Unknown fixture identity');
                check(codes.size < 1000, 'OVERLOADED', 'Fixture code limit');
                const code = randomBytes(24).toString('base64url');
                codes.set(code, { ...a, expires: Date.now() + 300000 });
                const back = new URL(a.redirect_uri);
                back.searchParams.set('code', code);
                back.searchParams.set('state', a.state ?? '');
                back.searchParams.set('iss', origin);
                res.statusCode = 302;
                res.setHeader('Location', back.href);
                res.end();
                return;
            }
            if (req.method === 'POST' && url.pathname === '/token') {
                let text = '';
                for await (const bytes of req) {
                    text += bytes;
                    check(text.length <= 16384, 'LIMIT_EXCEEDED', 'Fixture request too large');
                }
                const form = new URLSearchParams(text), code = form.get('code') ?? '', record = codes.get(code);
                check(record && record.expires > Date.now(), 'UNAUTHENTICATED', 'Code expired or consumed');
                check(form.get('grant_type') === 'authorization_code' && form.get('client_id') === record.client_id && form.get('redirect_uri') === record.redirect_uri && createHash('sha256').update(form.get('code_verifier') ?? '').digest('base64url') === record.code_challenge, 'UNAUTHENTICATED', 'PKCE or client binding failed');
                codes.delete(code);
                return json({ access_token: issue(record.subject), id_token: issue(record.subject, { aud: record.client_id, nonce: record.nonce }), token_type: 'Bearer', expires_in: 600 });
            }
            json({ error: 'not_found' }, 404);
        }
        catch (e) {
            json({ error: (e as any).code ?? 'invalid_request', message: (e as any).message }, 400);
        }
    });
    await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(options.port ?? 0, '127.0.0.1', resolve); });
    origin = 'http://127.0.0.1:' + (server.address() as any).port;
    return { origin, issue, jwks: { keys: [jwk] }, close: async () => { server.closeAllConnections(); await new Promise<void>(r => server.close(() => r())); } };
}
if (import.meta.url === new URL('file://' + process.argv[1]).href) {
    const issuer = await startTestIssuer({ enabled: process.env.PORTAL_TEST_ISSUER === '1', port: Number(process.env.PORT ?? 8790), audience: process.env.OAUTH_AUDIENCE ?? 'portal-test', redirects: (process.env.TEST_REDIRECTS ?? 'http://127.0.0.1:8787/owner/callback').split(',') });
    console.log('Portal TEST issuer: ' + issuer.origin);
    process.on('SIGTERM', () => void issuer.close());
}
