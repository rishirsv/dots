import dns from 'node:dns/promises';
import https from 'node:https';
import net from 'node:net';
import { Registry } from '../../../core/src/registry.js';
import { s, check, PortalError } from '../../../protocol/src/index.js';
import { putArtifact } from '../artifacts/index.js';
export function publicAddress(address: string) { if (net.isIP(address) === 4) {
    const p = address.split('.').map(Number), [a, b] = p;
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || b === 2)) || (a === 100 && b >= 64 && b <= 127) || (a === 198 && (b === 18 || b === 19 || b === 51)) || (a === 203 && b === 0 && p[2] === 113));
} if (net.isIP(address) === 6) {
    const v = address.toLowerCase();
    return /^[23][0-9a-f]{0,3}:/.test(v) && !v.startsWith('2001:db8:') && !v.startsWith('2001:0:') && !v.startsWith('2001::') && !v.startsWith('2002:') && !v.includes('.');
} return false; }
export async function fetchPublic(raw: string, maxBytes = 10 * 1024 * 1024, signal?: AbortSignal, redirects = 0, deadline = performance.now() + 30000): Promise<{
    bytes: Buffer;
    mimeType: string;
    url: string;
    status: number;
}> { check(performance.now() < deadline, 'LIMIT_EXCEEDED', 'URL fetch wall deadline exceeded'); signal = AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(Math.max(1, Math.ceil(deadline - performance.now())))]); const u = new URL(raw); check(u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443'), 'FORBIDDEN', 'Only public HTTPS URLs on port 443 are permitted'); check(redirects <= 5, 'LIMIT_EXCEEDED', 'Too many redirects'); const hostname = u.hostname.replace(/^\[|\]$/g, ''); const addresses = await Promise.race([dns.lookup(hostname, { all: true, verbatim: true }), new Promise<never>((_, reject) => setTimeout(() => reject(new PortalError('LIMIT_EXCEEDED', 'DNS lookup deadline exceeded')), 5000).unref())]); check(addresses.length > 0 && addresses.every(a => publicAddress(a.address)), 'FORBIDDEN', 'URL resolves to a non-public or mixed public/private address'); const selected = addresses[0]; return new Promise((resolve, reject) => { const chunks: Buffer[] = []; let total = 0; const req = https.request(u, { method: 'GET', agent: false, headers: { 'Accept-Encoding': 'identity', 'User-Agent': 'Portal/0.1' }, lookup: ((_hostname: any, options: any, cb: any) => options?.all ? cb(null, [selected]) : cb(null, selected.address, selected.family)) as any, timeout: 10000, signal }, res => { const status = res.statusCode ?? 0; if ([301, 302, 303, 307, 308].includes(status)) {
    res.resume();
    if (!res.headers.location) {
        reject(new PortalError('IO_ERROR', 'Redirect has no location'));
        return;
    }
    fetchPublic(new URL(res.headers.location!, u).href, maxBytes, signal, redirects + 1, deadline).then(resolve, reject);
    return;
} if (res.headers['content-encoding'] && res.headers['content-encoding'] !== 'identity') {
    req.destroy(new PortalError('FORBIDDEN', 'Compressed responses are refused to bound decompression'));
    return;
} res.on('data', (b: Buffer) => { total += b.length; if (total > maxBytes) {
    req.destroy(new PortalError('LIMIT_EXCEEDED', 'URL body exceeds byte limit'));
    return;
} chunks.push(b); }); res.once('end', () => resolve({ bytes: Buffer.concat(chunks), mimeType: String(res.headers['content-type'] ?? 'application/octet-stream').split(';')[0], url: u.href, status })); res.once('error', reject); }); req.once('timeout', () => req.destroy(new PortalError('LIMIT_EXCEEDED', 'HTTPS response deadline exceeded'))); req.once('error', reject); req.end(); }); }
export function addNetwork(r: Registry) { r.add({ id: 'network.fetch', description: 'Explicitly granted public HTTPS fetch; resolved addresses are pinned per redirect, credentials and private networks are rejected.', family: 'network', effect: 'network', input: s.object({ url: s.string(8192), maxBytes: s.int(1, 10485760) }, ['url']), handler: async (c, a) => { const result = await fetchPublic(a.url, a.maxBytes, c.signal); return { url: result.url, status: result.status, artifact: putArtifact(c.store, c.workspace.id, c.actor.accountId, result.bytes, result.mimeType) }; } }); }
