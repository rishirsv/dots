import fs from 'node:fs';
import path from 'node:path';
import { Registry } from '../../../core/src/registry.js';
import type { CapabilityContext } from '../../../core/src/types.js';
import { LocalStore } from '../../../storage/src/local.js';
import { s, id, sha, check, cursor, uncursor } from '../../../protocol/src/index.js';
export function putArtifact(store: LocalStore, workspaceId: string, accountId: string, bytes: Buffer, mimeType: string) { const artifactId = id('artifact'), dest = path.join(store.dir, 'artifacts', artifactId); const fd = fs.openSync(dest, 'wx', 0o600); try {
    fs.writeFileSync(fd, bytes);
    fs.fsyncSync(fd);
}
finally {
    fs.closeSync(fd);
} const digest = sha(bytes); store.run('INSERT INTO artifacts(id,workspace_id,account_id,path,sha256,bytes,mime_type,created_at,expires_at) VALUES(?,?,?,?,?,?,?,?,?)', artifactId, workspaceId, accountId, dest, digest, bytes.length, mimeType, Date.now(), Date.now() + 7 * 86400000); return { id: artifactId, mimeType, bytes: bytes.length, sha256: digest, uri: `portal-artifact://${workspaceId}/${artifactId}` }; }
export function getArtifact(c: CapabilityContext, artifactId: string) { const a = c.store.one('SELECT * FROM artifacts WHERE id=? AND workspace_id=? AND account_id=?', artifactId, c.workspace.id, c.actor.accountId); check(a, 'NOT_FOUND', 'Artifact not found in this workspace'); check(a.pinned || a.expires_at > Date.now(), 'RESULT_EXPIRED', 'Artifact retention expired'); return a; }
export function addArtifacts(r: Registry) { r.add({ id: 'artifacts.get', description: 'Read an authorized artifact by independent bounded byte cursor. Offsets are zero-based.', input: s.object({ artifactId: s.key(), cursor: s.nullable(s.string(4096)), maxBytes: s.int(1, 65536) }, ['artifactId']), effect: 'read', family: 'artifacts', handler: (c, a) => { const v = getArtifact(c, a.artifactId), cur = uncursor(a.cursor); check(!cur || (cur.artifactId === v.id && Number.isSafeInteger(cur.offset) && cur.offset >= 0), 'INVALID_ARGUMENT', 'Cursor does not belong to artifact'); const start = cur?.offset ?? 0, limit = Math.min(a.maxBytes ?? 65536, Math.max(0, v.bytes - start)), fd = fs.openSync(v.path, 'r'); const bytes = Buffer.alloc(limit); try {
        fs.readSync(fd, bytes, 0, bytes.length, start);
    }
    finally {
        fs.closeSync(fd);
    } return { artifactId: v.id, mimeType: v.mime_type, sha256: v.sha256, totalBytes: v.bytes, startByte: start, endByte: start + bytes.length, base64: bytes.toString('base64'), nextCursor: start + bytes.length < v.bytes ? cursor({ artifactId: v.id, offset: start + bytes.length }) : null }; } }); }
