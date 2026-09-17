import path from 'node:path';
import fs from 'node:fs';
import { s, check, sha, cursor, uncursor, PortalError, id, requestHash } from '../../../protocol/src/index.js';
import { Registry } from '../../../core/src/registry.js';
import type { CapabilityContext } from '../../../core/src/types.js';
import { relative } from '../../../core/src/rooted-fs.js';
import { treeManifest, copyTree, removeTree } from './tree.js';
const output = { type: 'object', additionalProperties: true };
const readFields = { path: s.path(), startLine: s.int(1), maxLines: s.int(1, 5000), startByte: s.int(), maxBytes: s.int(1, 65536), tailLines: s.int(1, 5000), expectedSha256: s.sha() };
function read(c: CapabilityContext, a: any) {
    check(!(a.startByte !== undefined && (a.startLine !== undefined || a.tailLines !== undefined)), 'INVALID_ARGUMENT', 'Choose byte or line ranges, not both');
    if (a.startByte !== undefined) {
        const snap = c.fs.range(a.path, a.startByte, a.maxBytes ?? 65536, a.expectedSha256);
        let text: string | undefined;
        try {
            text = new TextDecoder('utf-8', { fatal: true }).decode(snap.bytes);
        }
        catch { }
        return { ...snap, bytes: undefined, text, base64: text === undefined ? snap.bytes.toString('base64') : undefined, byteCount: snap.bytes.length, truncated: snap.endByte < snap.size, nextCursor: snap.endByte < snap.size ? cursor({ path: a.path, sha256: snap.sha256, startByte: snap.endByte }) : undefined };
    }
    const snap = c.fs.read(a.path, 16 * 1024 * 1024);
    if (a.expectedSha256)
        check(a.expectedSha256 === snap.sha256, 'SOURCE_CHANGED', 'Source changed');
    let text: string;
    try {
        text = new TextDecoder('utf-8', { fatal: true }).decode(snap.bytes);
    }
    catch {
        throw new PortalError('UNSUPPORTED_FORMAT', 'Binary data requires a byte-range read');
    }
    check(!text.includes('\0'), 'UNSUPPORTED_FORMAT', 'NUL-containing file requires byte-range read');
    const lines = text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
    const start = a.tailLines ? Math.max(0, lines.length - a.tailLines) : (a.startLine ?? 1) - 1;
    const count = a.tailLines ?? a.maxLines ?? 200;
    let chosen = '', end = start;
    for (const line of lines.slice(start, start + count)) {
        if (Buffer.byteLength(chosen + line) > 65536)
            break;
        chosen += line;
        end++;
    }
    check(end > start || start >= lines.length, 'LIMIT_EXCEEDED', 'A single line exceeds 64 KiB; request bytes');
    return { path: snap.path, sha256: snap.sha256, size: snap.size, text: chosen, startLine: start + 1, endLine: end, totalLines: lines.length, truncated: end < lines.length, nextCursor: end < lines.length ? cursor({ path: a.path, sha256: snap.sha256, startLine: end + 1 }) : undefined };
}
export function addFiles(r: Registry) {
    const add = (id: string, description: string, input: any, effect: any, handler: any, approval = false) => r.add({ id, description, input, output, effect, family: 'files', handler, approval });
    add('files.manifest', 'Inspect a bounded directory tree manifest before an explicit recursive copy, move or approved removal.', s.object({ path: s.path() }), 'read', (c: CapabilityContext, a: any) => treeManifest(c, a.path));
    add('files.stat', 'Inspect one authorized file or directory.', s.object({ path: s.path() }), 'read', (c: CapabilityContext, a: any) => c.fs.stat(a.path));
    add('files.list', 'Paginated directory listing with source-identity cursor.', s.object({ path: s.path(), cursor: s.nullable(s.string(4096)), limit: s.int(1, 1000), hidden: s.bool() }, ['path']), 'read', (c: CapabilityContext, a: any) => {
        const entries = c.fs.list(a.path).filter(x => a.hidden || !x.name.startsWith('.'));
        const digest = requestHash(entries);
        const cur = uncursor(a.cursor);
        if (cur)
            check(cur.path === relative(a.path) && cur.sha256 === digest, 'SOURCE_CHANGED', 'Directory changed between pages');
        const n = cur?.offset ?? 0, limit = a.limit ?? 100;
        return { entries: entries.slice(n, n + limit), snapshotSha256: digest, complete: n + limit >= entries.length, nextCursor: n + limit < entries.length ? cursor({ path: relative(a.path), sha256: digest, offset: n + limit }) : undefined };
    });
    add('files.read', 'Exact UTF-8 line or byte range. Lines are 1-based; bytes are 0-based.', s.object(readFields, ['path']), 'read', read);
    add('files.tail', 'Read a bounded final line range.', s.object({ path: s.path(), tailLines: s.int(1, 5000), expectedSha256: s.sha() }, ['path', 'tailLines']), 'read', read);
    add('files.read_many', 'Bounded snapshots with independent per-file errors.', s.object({ files: s.array(s.object(readFields, ['path']), 20, 1) }), 'read', (c: CapabilityContext, a: any) => ({ items: a.files.map((x: any) => { try {
            return read(c, x);
        }
        catch (e) {
            return { path: x.path, error: e instanceof PortalError ? { code: e.code, message: e.message } : { code: 'IO_ERROR' } };
        } }) }));
    for (const mode of ['write', 'append'])
        add('files.' + mode, `${mode === 'append' ? 'Deduplicated append' : 'Guarded replace or create'} with explicit SHA or absence precondition.`, s.object({ path: s.path(), text: s.string(524288), expectedSha256: s.nullable(s.sha()) }), 'write', (c: CapabilityContext, a: any) => {
            let bytes = Buffer.from(a.text);
            if (mode === 'append') {
                check(a.expectedSha256 !== null, 'INVALID_ARGUMENT', 'Append requires an existing source hash');
                const old = c.fs.read(a.path);
                check(old.sha256 === a.expectedSha256, 'WRITE_CONFLICT', 'Append source changed');
                bytes = Buffer.concat([old.bytes, bytes]);
            }
            return c.fs.write(a.path, bytes, a.expectedSha256, c.store, c.operationId);
        });
    add('files.replace', 'Exact search/replace; replacement count must match, never fuzzy-write.', s.object({ path: s.path(), expectedSha256: s.sha(), oldText: { ...s.string(262144), minLength: 1 }, newText: s.string(262144), expectedReplacements: s.int(1, 10000) }), 'write', (c: CapabilityContext, a: any) => {
        const old = c.fs.read(a.path, 16 * 1024 * 1024);
        check(old.sha256 === a.expectedSha256, 'WRITE_CONFLICT', 'Source changed');
        const text = new TextDecoder('utf-8', { fatal: true }).decode(old.bytes), parts = text.split(a.oldText);
        check(parts.length - 1 === a.expectedReplacements, 'WRITE_CONFLICT', 'Exact replacement count differs', { actual: parts.length - 1, expected: a.expectedReplacements });
        return { ...c.fs.write(a.path, Buffer.from(parts.join(a.newText)), a.expectedSha256, c.store, c.operationId), replacements: parts.length - 1 };
    });
    add('files.mkdir', 'Create an absent directory; optional bounded parents.', s.object({ path: s.path(), recursive: s.bool(), expectedAbsent: { const: true } }, ['path', 'expectedAbsent']), 'write', (c: CapabilityContext, a: any) => {
        const p = relative(a.path, false);
        if (!a.recursive)
            return c.fs.mkdir(p);
        const made = [];
        let part = '';
        for (const seg of p.split('/')) {
            part = part ? part + '/' + seg : seg;
            try {
                const st = c.fs.stat(part);
                check(st.type === 'directory', 'WRITE_CONFLICT', 'Parent is not directory');
                check(part !== p, 'WRITE_CONFLICT', 'Target already exists');
            }
            catch (e) {
                if (e instanceof PortalError && e.code === 'NOT_FOUND')
                    made.push(c.fs.mkdir(part));
                else
                    throw e;
            }
        }
        return { created: made };
    });
    for (const mode of ['copy', 'move'])
        add('files.' + mode, `Guarded file or explicitly recursive directory ${mode}; directory SHA is from files.manifest. Source and destination remain in the workspace.`, s.object({ source: s.path(), destination: s.path(), expectedSourceSha256: s.sha(), expectedDestinationSha256: s.nullable(s.sha()), recursive: s.bool() }, ['source', 'destination', 'expectedSourceSha256', 'expectedDestinationSha256']), 'write', (c: CapabilityContext, a: any) => {
            if (c.fs.stat(a.source).type === 'directory')
                return copyTree(c, a, mode === 'move');
            check(a.source !== a.destination, 'INVALID_ARGUMENT', 'Source and destination must differ');
            const src = c.fs.read(a.source);
            check(src.sha256 === a.expectedSourceSha256, 'WRITE_CONFLICT', 'Source changed');
            const written = c.fs.write(a.destination, src.bytes, a.expectedDestinationSha256, c.store, c.operationId);
            return { ...written, source: a.source, ...(mode === 'move' ? { removal: c.fs.remove(a.source, a.expectedSourceSha256, c.store, c.operationId) } : {}) };
        });
    add('files.remove', 'Remove an explicitly approved file or bounded directory tree, preserving per-file recovery copies. Directory hash comes from files.manifest.', s.object({ path: s.path(), expectedSha256: s.sha(), recursive: s.bool() }, ['path', 'expectedSha256']), 'write', (c: CapabilityContext, a: any) => { if (c.fs.stat(a.path).type === 'directory') {
        check(a.recursive === true, 'INVALID_ARGUMENT', 'Directory removal requires recursive:true');
        return removeTree(c, a.path, a.expectedSha256);
    } return c.fs.remove(a.path, a.expectedSha256, c.store, c.operationId); }, true);
    add('files.apply_patch', 'Codex-style add/update/delete/move with SHA preconditions and per-file receipts.', s.object({ patch: s.string(524288), expectedSha256: s.record(s.nullable(s.sha()), 100) }), 'write', applyPatch);
    add('files.stage_start', 'Begin a bounded large-file upload; no destination mutation until commit.', s.object({ path: s.path(), expectedSha256: s.nullable(s.sha()), outputSha256: s.sha(), totalBytes: s.int(0, 104857600) }), 'write', (c: CapabilityContext, a: any) => {
        relative(a.path, false);
        check(c.fs.hash(a.path) === a.expectedSha256, 'WRITE_CONFLICT', 'Destination precondition failed');
        const upload = id('upload'), stage = path.join(c.store.dir, 'staging', upload);
        fs.writeFileSync(stage, '', { flag: 'wx', mode: 0o600 });
        c.store.run('INSERT INTO uploads(id,workspace_id,path,expected_sha,expected_output_sha,total_bytes,stage_path,state,created_at) VALUES(?,?,?,?,?,?,?,?,?)', upload, c.workspace.id, a.path, a.expectedSha256, a.outputSha256, a.totalBytes, stage, 'open', Date.now());
        return { uploadId: upload, totalBytes: a.totalBytes };
    });
    add('files.stage_chunk', 'Append a chunk at its exact byte offset with a chunk hash.', s.object({ uploadId: s.key(), offset: s.int(), base64: s.string(350000), sha256: s.sha() }), 'write', (c: CapabilityContext, a: any) => {
        const u = c.store.one('SELECT * FROM uploads WHERE id=? AND workspace_id=?', a.uploadId, c.workspace.id);
        check(u && u.state === 'open', 'NOT_FOUND', 'Open upload not found');
        const bytes = Buffer.from(a.base64, 'base64');
        check(sha(bytes) === a.sha256, 'WRITE_CONFLICT', 'Chunk hash mismatch');
        check(a.offset === u.committed_bytes && a.offset + bytes.length <= u.total_bytes, 'WRITE_CONFLICT', 'Chunk offset/length mismatch');
        const fd = fs.openSync(u.stage_path, 'r+');
        try {
            fs.writeSync(fd, bytes, 0, bytes.length, a.offset);
            fs.fsyncSync(fd);
        }
        finally {
            fs.closeSync(fd);
        }
        c.store.run('UPDATE uploads SET committed_bytes=? WHERE id=?', a.offset + bytes.length, u.id);
        return { uploadId: u.id, committedBytes: a.offset + bytes.length };
    });
    add('files.stage_commit', 'Verify staged bytes and atomically publish with the original precondition.', s.object({ uploadId: s.key() }), 'write', (c: CapabilityContext, a: any) => { const u = c.store.one('SELECT * FROM uploads WHERE id=? AND workspace_id=?', a.uploadId, c.workspace.id); check(u && u.state === 'open', 'NOT_FOUND', 'Open upload not found'); check(u.total_bytes === u.committed_bytes, 'WRITE_CONFLICT', 'Upload is incomplete'); const bytes = fs.readFileSync(u.stage_path); check(sha(bytes) === u.expected_output_sha, 'WRITE_CONFLICT', 'Final hash mismatch'); const receipt = c.fs.write(u.path, bytes, u.expected_sha, c.store, c.operationId); c.store.run("UPDATE uploads SET state='committed' WHERE id=?", u.id); fs.unlinkSync(u.stage_path); return receipt; });
}
function applyPatch(c: CapabilityContext, a: any) {
    const lines = a.patch.replace(/\r\n/g, '\n').split('\n');
    check(lines[0] === '*** Begin Patch', 'INVALID_ARGUMENT', 'Patch must begin with marker');
    let i = 1;
    const edits: any[] = [];
    const targets = new Set<string>();
    while (i < lines.length && lines[i] !== '*** End Patch') {
        const header = /^\*\*\* (Add|Update|Delete) File: (.+)$/.exec(lines[i++]);
        check(header, 'INVALID_ARGUMENT', 'Expected file header');
        const kind = header[1], p = relative(header[2], false);
        check(!targets.has(p), 'INVALID_ARGUMENT', 'Duplicate patch path');
        targets.add(p);
        check(Object.hasOwn(a.expectedSha256, p), 'INVALID_ARGUMENT', 'Every patch file needs an explicit hash or absence precondition');
        const expected = a.expectedSha256[p];
        check(c.fs.hash(p) === expected, 'WRITE_CONFLICT', 'Patch source precondition failed', { path: p });
        let destination: string | undefined;
        if (lines[i]?.startsWith('*** Move to: ')) {
            destination = relative(lines[i++].slice(13), false);
            check(Object.hasOwn(a.expectedSha256, destination), 'INVALID_ARGUMENT', 'Move needs destination absence/hash');
            check(c.fs.hash(destination) === a.expectedSha256[destination], 'WRITE_CONFLICT', 'Move collision');
        }
        const body: string[] = [];
        while (i < lines.length && !lines[i].startsWith('*** '))
            body.push(lines[i++]);
        if (kind === 'Delete') {
            check(expected !== null, 'WRITE_CONFLICT', 'Cannot delete absent source');
            edits.push({ kind, p, expected });
            continue;
        }
        if (kind === 'Add') {
            check(expected === null, 'WRITE_CONFLICT', 'Add requires absence');
            check(body.filter(x => x !== '').every(x => x.startsWith('+')), 'INVALID_ARGUMENT', 'Add lines start with +');
            edits.push({ kind, p, expected, text: body.filter(x => x !== '').map(x => x.slice(1)).join('\n') + '\n' });
            continue;
        }
        check(expected !== null, 'WRITE_CONFLICT', 'Update requires existing SHA');
        let text = c.fs.read(p).bytes.toString('utf8');
        const crlf = text.includes('\r\n');
        let working = text.replace(/\r\n/g, '\n');
        let hunk: string[] = [];
        const flush = () => { if (!hunk.length)
            return; const old = hunk.filter(x => x[0] === ' ' || x[0] === '-').map(x => x.slice(1)).join('\n'), next = hunk.filter(x => x[0] === ' ' || x[0] === '+').map(x => x.slice(1)).join('\n'); check(old.length > 0, 'INVALID_ARGUMENT', 'Update hunk needs context'); const parts = working.split(old); check(parts.length === 2, 'WRITE_CONFLICT', 'Patch hunk must match exactly once', { path: p, matches: parts.length - 1 }); working = parts.join(next); hunk = []; };
        for (const line of body) {
            if (line.startsWith('@@'))
                flush();
            else if (line === '\\ No newline at end of file')
                continue;
            else if (line === '')
                continue;
            else {
                check(' +-'.includes(line[0]), 'INVALID_ARGUMENT', 'Invalid patch line');
                hunk.push(line);
            }
        }
        flush();
        edits.push({ kind, p, expected, destination, text: crlf ? working.replace(/\n/g, '\r\n') : working });
    }
    check(lines[i] === '*** End Patch', 'INVALID_ARGUMENT', 'Missing patch end');
    const receipts: any[] = [];
    for (const edit of edits) {
        try {
            if (edit.kind === 'Delete') { // Destructive patch deletion follows exactly the same approval broker check.
                receipts.push(c.fs.remove(edit.p, edit.expected, c.store, c.operationId));
            }
            else {
                receipts.push(c.fs.write(edit.destination ?? edit.p, Buffer.from(edit.text), edit.destination ? a.expectedSha256[edit.destination] : edit.expected, c.store, c.operationId));
                if (edit.destination)
                    receipts.push(c.fs.remove(edit.p, edit.expected, c.store, c.operationId));
            }
        }
        catch (e) {
            throw new PortalError(e instanceof PortalError ? e.code : 'IO_ERROR', e instanceof Error ? e.message : 'Patch failed', { partialEffects: receipts.length > 0, receipts, failedPath: edit.p });
        }
    }
    return { files: receipts, partialEffects: false, atomicAcrossFiles: false };
}
