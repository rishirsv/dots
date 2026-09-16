import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { sha, check, PortalError, id, err, safeJson } from '../../protocol/src/index.js';
// Keep IPC discovery independent of the environment that launched each Portal
// process. In particular, macOS gives shell processes a TMPDIR that Codex's
// MCP launcher does not inherit, which otherwise splits one installation into
// two unreachable runtime directories.
const IPC_ROOT = process.platform === 'win32' ? os.tmpdir() : '/tmp';
export function runtimeDir(stateDir: string) { const p = path.join(IPC_ROOT, `portal-${process.getuid?.() ?? 'user'}-${sha(stateDir).slice(0, 12)}`); if (!fs.existsSync(p))
    fs.mkdirSync(p, { mode: 0o700 }); const st = fs.lstatSync(p); check(st.isDirectory() && !st.isSymbolicLink() && (process.getuid === undefined || st.uid === process.getuid()), 'FORBIDDEN', 'Unsafe runtime directory ownership'); fs.chmodSync(p, 0o700); return p; }
export function secretFile(p: string) { try {
    const st = fs.lstatSync(p);
    check(st.isFile() && !st.isSymbolicLink() && (st.mode & 0o077) === 0, 'FORBIDDEN', 'Unsafe IPC secret permissions');
    return fs.readFileSync(p, 'utf8');
}
catch (e) {
    if ((e as any).code !== 'ENOENT')
        throw e;
    const s = randomBytes(32).toString('base64url');
    fs.writeFileSync(p, s, { flag: 'wx', mode: 0o600 });
    return s;
} }
export function sameSecret(a: unknown, b: string) { if (typeof a !== 'string')
    return false; const av = Buffer.from(a), bv = Buffer.from(b); return av.length === bv.length && timingSafeEqual(av, bv); }
export async function serveIpc(socketPath: string, secret: string, handler: (method: string, args: any) => Promise<any> | any) {
    // Caller must already own the installation's OS lock; stale sockets are removed only after that lock.
    try {
        fs.unlinkSync(socketPath);
    }
    catch (e) {
        if ((e as any).code !== 'ENOENT')
            throw e;
    }
    const connections = new Set<net.Socket>();
    const server = net.createServer({ allowHalfOpen: true }, socket => { connections.add(socket); let bytes = Buffer.alloc(0), busy = false; socket.setTimeout(35000, () => socket.destroy()); socket.on('error', () => { }); socket.on('close', () => connections.delete(socket)); socket.on('data', (chunk: Buffer) => { if (busy) {
        socket.destroy();
        return;
    } bytes = Buffer.concat([bytes, chunk]); if (bytes.length > 1048576) {
        socket.destroy();
        return;
    } const newline = bytes.indexOf(10); if (newline < 0)
        return; busy = true; socket.pause(); void (async () => { let request: any; try {
        check(newline === bytes.length - 1, 'INVALID_ARGUMENT', 'Exactly one IPC request is permitted per connection');
        request = JSON.parse(bytes.subarray(0, newline).toString('utf8'));
        safeJson(request);
        check(sameSecret(request.token, secret), 'UNAUTHENTICATED', 'Invalid local control authentication');
        check(typeof request.method === 'string', 'INVALID_ARGUMENT', 'Missing method');
        const result = await handler(request.method, request.arguments ?? {});
        const response = JSON.stringify({ id: request.id, result });
        check(Buffer.byteLength(response) <= 8 * 1024 * 1024, 'LIMIT_EXCEEDED', 'IPC response is too large');
        socket.end(response + '\n');
    }
    catch (e) {
        socket.end(JSON.stringify({ id: request?.id, result: err(e) }) + '\n');
    } })(); }); });
    await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(socketPath, () => { fs.chmodSync(socketPath, 0o600); resolve(); }); });
    return { server, close: async () => { for (const c of connections)
            c.destroy(); await new Promise<void>(r => server.close(() => r())); try {
            fs.unlinkSync(socketPath);
        }
        catch { } } };
}
export function callIpc(socketPath: string, token: string, method: string, args: any, timeoutMs = 35000): Promise<any> { return new Promise((resolve, reject) => { const request = { id: id('ipc'), token, method, arguments: args }; const encoded = JSON.stringify(request) + '\n'; check(Buffer.byteLength(encoded) <= 1048576, 'LIMIT_EXCEEDED', 'IPC request too large'); const socket = net.connect(socketPath), chunks: Buffer[] = []; let bytes = 0, settled = false; const finish = (e: any, v?: any) => { if (settled)
    return; settled = true; socket.destroy(); e ? reject(e) : resolve(v); }; socket.setTimeout(timeoutMs, () => finish(new PortalError('DEVICE_OFFLINE', 'Local IPC response timed out', {}, 'after_status_check'))); socket.once('error', e => finish(e)); socket.once('connect', () => socket.end(encoded)); socket.on('data', (b: Buffer) => { bytes += b.length; if (bytes > 8 * 1024 * 1024) {
    finish(new PortalError('LIMIT_EXCEEDED', 'IPC result too large'));
    return;
} chunks.push(b); }); socket.once('end', () => { try {
    const v = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    check(v.id === request.id, 'INVALID_ARGUMENT', 'IPC response identity mismatch');
    finish(null, v.result);
}
catch (e) {
    finish(e);
} }); }); }
