import { randomBytes, createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { OAuthResourceServer, Principal } from '../../relay/src/auth.js';
import { RelayStore } from '../../../packages/storage/src/postgres.js';
import { sha, check, id } from '../../../packages/protocol/src/index.js';
export const escape = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
function page(title: string, body: string) { return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} · Portal</title><style>body{margin:0;background:#101719;color:#e9f1ec;font:16px/1.55 system-ui,sans-serif}main{max-width:1040px;margin:auto;padding:50px 24px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #364341;padding-bottom:22px;margin-bottom:36px}.brand{font-size:22px;font-weight:750;letter-spacing:-.6px}h1{font-size:34px;letter-spacing:-1px}h2{font-size:20px;margin-top:32px}.muted,small{color:#a8bab3}a{color:#b8edd8}table{width:100%;border-collapse:collapse;font-size:14px}td,th{text-align:left;padding:14px 8px;border-bottom:1px solid #364341;vertical-align:top}th{color:#a8bab3}.card{padding:24px;background:#1a2527;border:1px solid #364341;border-radius:16px;margin:18px 0}button{padding:11px 16px;border:0;border-radius:8px;background:#c5f4df;color:#0e2320;font:inherit;font-weight:650;cursor:pointer}.danger{background:#ffcebf;color:#441509}input{display:block;padding:12px;border:1px solid #58675f;border-radius:7px;background:#101719;color:#fff;font:inherit;margin:8px 0 20px}code{overflow-wrap:anywhere}.pill{display:inline-block;padding:3px 9px;border:1px solid #59776b;border-radius:20px;font-size:12px}</style><main><header><a class="brand" href="/owner">Portal</a><span class="muted">Owner control · No file contents</span></header>${body}<p class="muted">Local root grants remain authoritative. Relay connectivity does not prove executor readiness.</p></main></html>`; }
export async function ownerDashboard(req: IncomingMessage, res: ServerResponse, url: URL, body: any, auth: OAuthResourceServer, store: RelayStore, revoke: (account: string, device: string) => Promise<void>) {
    const cookie = (req.headers.cookie ?? '').split(';').map(x => x.trim()).find(x => x.startsWith('portal_owner='))?.slice(13);
    const session = cookie ? (await store.query('SELECT * FROM owner_sessions WHERE token_hash=$1 AND expires_at>now()', [sha(cookie)]))[0] : null;
    const send = (title: string, html: string) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(page(title, html)); };
    const redirect = (to: string) => { res.statusCode = 303; res.setHeader('Location', to); res.end(); };
    const secure = auth.config.testOnly ? '' : '; Secure';
    if (url.pathname === '/owner/login') {
        check(auth.config.ownerClientId && auth.config.authorizationEndpoint, 'CAPABILITY_UNAVAILABLE', 'Configure the owner OIDC client before using the dashboard');
        const token = randomBytes(32).toString('base64url'), state = randomBytes(32).toString('base64url'), verifier = randomBytes(32).toString('base64url'), nonce = randomBytes(32).toString('base64url'), csrf = randomBytes(32).toString('base64url');
        await store.query('INSERT INTO owner_sessions(token_hash,state_hash,pkce_verifier,nonce,csrf,expires_at) VALUES($1,$2,$3,$4,$5,now()+interval \'10 minutes\')', [sha(token), sha(state), verifier, nonce, csrf]);
        const authUrl = new URL(auth.config.authorizationEndpoint);
        for (const [k, v] of Object.entries({ client_id: auth.config.ownerClientId, response_type: 'code', redirect_uri: auth.config.publicOrigin + '/owner/callback', scope: 'openid profile portal:read portal:owner', audience: auth.config.audience, state, nonce, code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256' }))
            authUrl.searchParams.set(k, v);
        res.setHeader('Set-Cookie', `portal_owner=${token}; HttpOnly; SameSite=Lax; Path=/owner; Max-Age=600${secure}`);
        return redirect(authUrl.href);
    }
    if (url.pathname === '/owner/callback') {
        check(session && !session.account_id && sha(url.searchParams.get('state') ?? '') === session.state_hash, 'UNAUTHENTICATED', 'OIDC state is invalid');
        check(auth.config.tokenEndpoint && auth.config.ownerClientId, 'CAPABILITY_UNAVAILABLE', 'Owner OIDC configuration is incomplete');
        const form = new URLSearchParams({ grant_type: 'authorization_code', client_id: auth.config.ownerClientId, code: url.searchParams.get('code') ?? '', redirect_uri: auth.config.publicOrigin + '/owner/callback', code_verifier: session.pkce_verifier });
        if (auth.config.ownerClientSecret)
            form.set('client_secret', auth.config.ownerClientSecret);
        const tokenResponse = await fetch(auth.config.tokenEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form, signal: AbortSignal.timeout(10000) });
        check(tokenResponse.ok, 'UNAUTHENTICATED', 'OIDC token exchange failed');
        const tokens: any = await tokenResponse.json();
        const claims = await auth.verify(tokens.id_token, auth.config.ownerClientId);
        check(claims.nonce === session.nonce, 'UNAUTHENTICATED', 'OIDC nonce mismatch');
        const principal = await auth.principal('Bearer ' + tokens.access_token);
        auth.require(principal, 'portal:owner');
        check(principal.subject === claims.sub, 'UNAUTHENTICATED', 'ID token and access-token subjects differ');
        const token = randomBytes(32).toString('base64url');
        await store.tx(async (c) => { await c.query('DELETE FROM owner_sessions WHERE token_hash=$1', [session.token_hash]); await c.query('INSERT INTO owner_sessions(token_hash,account_id,csrf,expires_at,scopes) VALUES($1,$2,$3,now()+interval \'8 hours\',$4)', [sha(token), principal.accountId, randomBytes(32).toString('base64url'), JSON.stringify(principal.scopes)]); });
        res.setHeader('Set-Cookie', `portal_owner=${token}; HttpOnly; SameSite=Lax; Path=/owner; Max-Age=28800${secure}`);
        return redirect('/owner');
    }
    let principal: Principal;
    if (req.headers.authorization) {
        principal = await auth.principal(req.headers.authorization);
        auth.require(principal, 'portal:owner');
    }
    else {
        if (!session?.account_id)
            return send('Sign in', '<h1>Your computers. Your boundary.</h1><p class="muted">Sign in to link devices, inspect connectivity and revoke access.</p><p><a href="/owner/login">Sign in with your identity provider →</a></p>');
        principal = { accountId: session.account_id, subject: session.account_id, scopes: session.scopes };
        auth.require(principal, 'portal:owner');
        if (req.method === 'POST') {
            check(req.headers.origin === auth.config.publicOrigin, 'FORBIDDEN', 'Owner actions require the exact Origin');
            check(body.csrf === session.csrf, 'FORBIDDEN', 'CSRF token mismatch');
        }
    }
    const account = principal.accountId, csrf = session?.csrf ?? '', hidden = `<input type="hidden" name="csrf" value="${escape(csrf)}">`;
    if (url.pathname.startsWith('/owner/pair/')) {
        const pairingId = url.pathname.split('/').pop()!;
        const [intent] = await store.query('SELECT * FROM pairing_intents WHERE id=$1 AND expires_at>now()', [pairingId]);
        check(intent, 'NOT_FOUND', 'Pairing intent expired or missing');
        if (req.method === 'POST') {
            check(body.code === intent.code && body.fingerprint === intent.fingerprint, 'FORBIDDEN', 'Code/fingerprint do not match the local device');
            const result = await store.tx(async (c) => { const current = (await c.query('SELECT * FROM pairing_intents WHERE id=$1 FOR UPDATE', [pairingId])).rows[0]; check(current.state === 'pending' && new Date(current.expires_at).getTime() > Date.now(), 'FORBIDDEN', 'Pairing already consumed or expired'); const deviceId = id('dev'); await c.query('INSERT INTO devices(id,account_id,installation_id,label,credential_hash) VALUES($1,$2,$3,$4,$5)', [deviceId, account, current.installation_id, current.label, current.credential_hash]); await c.query("UPDATE pairing_intents SET state='approved',account_id=$1,device_id=$2 WHERE id=$3", [account, deviceId, pairingId]); return deviceId; });
            if (req.headers.authorization) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ approved: true, deviceId: result }));
                return;
            }
            return redirect('/owner');
        }
        return send('Link device', `<h1>Link ${escape(intent.label)}</h1><div class="card"><p>Account: <code>${escape(account)}</code></p><p>Fingerprint: <code>${escape(intent.fingerprint)}</code></p><p>Confirm the fingerprint and enter the code displayed by Portal on that Mac. This grants no filesystem roots.</p><form method="post">${hidden}<label>Local code<input name="code" autocomplete="off" required maxlength="12"></label><input type="hidden" name="fingerprint" value="${escape(intent.fingerprint)}"><button>Approve this device</button></form></div>`);
    }
    if (url.pathname.startsWith('/owner/revoke/') && req.method === 'POST') {
        check(body.confirm === 'REVOKE', 'INVALID_ARGUMENT', 'Explicit revoke confirmation required');
        await revoke(account, url.pathname.split('/').pop()!);
        return redirect('/owner');
    }
    if (url.pathname === '/owner/retention' && req.method === 'POST') {
        const days = Number(body.days);
        check(Number.isInteger(days) && days >= 1 && days <= 30, 'INVALID_ARGUMENT', 'Retention must be 1–30 days');
        await store.query('INSERT INTO owner_settings(account_id,retention_days) VALUES($1,$2) ON CONFLICT(account_id) DO UPDATE SET retention_days=excluded.retention_days', [account, days]);
        return redirect('/owner');
    }
    const devices = await store.query('SELECT id,label,revoked,last_heartbeat,connection_epoch,credential_generation,agent_version FROM devices WHERE account_id=$1 ORDER BY created_at', [account]), workspaces = await store.query('SELECT id,device_id,summary,updated_at FROM workspace_summaries WHERE account_id=$1', [account]), operations = await store.query('SELECT id,device_id,state,created_at,updated_at FROM operations WHERE account_id=$1 ORDER BY created_at DESC LIMIT 30', [account]);
    const rows = devices.map((d: any) => `<tr><td><strong>${escape(d.label)}</strong><br><small>${escape(d.id)}</small></td><td><span class="pill">${d.revoked ? 'Revoked' : d.last_heartbeat && Date.now() - new Date(d.last_heartbeat).getTime() < 45000 ? 'Heartbeat confirmed' : 'Offline / stale'}</span><br><small>${escape(d.last_heartbeat ?? 'No confirmed heartbeat')}</small></td><td>${escape(d.agent_version ?? 'Unknown')}<br><small>Generation ${escape(d.connection_epoch)}</small></td><td>${d.revoked ? '' : `<form method="post" action="/owner/revoke/${escape(d.id)}">${hidden}<input type="hidden" name="confirm" value="REVOKE"><button class="danger">Revoke device</button></form>`}</td></tr>`).join('');
    send('Devices', `<h1>Your device boundary</h1><p class="muted">Account <code>${escape(account)}</code>. No repository or document contents are shown here.</p><h2>Devices</h2>${devices.length ? `<table><tr><th>Device</th><th>Connection</th><th>Agent</th><th>Control</th></tr>${rows}</table>` : '<div class="card">No linked devices. Run <code>portal pair --relay ' + escape(auth.config.publicOrigin) + '</code> locally and confirm its fingerprint.</div>'}<h2>Workspaces</h2><div class="card">${workspaces.length ? workspaces.map((w: any) => `<p><code>${escape(w.id)}</code> · ${escape(w.summary.rootAlias)} · ${escape(w.summary.effectiveAccess)} · device ${escape(w.device_id)}</p>`).join('') : 'No workspace summaries yet.'}</div><h2>Recent outcomes</h2><table><tr><th>Operation</th><th>State</th><th>Observed</th></tr>${operations.map((o: any) => `<tr><td><code>${escape(o.id)}</code></td><td>${escape(o.state)}</td><td>${escape(o.updated_at)}</td></tr>`).join('')}</table><h2>Relay retention</h2><form method="post" action="/owner/retention">${hidden}<label>Days<input type="number" name="days" min="1" max="30" value="7"></label><button>Save retention</button></form>`);
}
