import path from 'node:path';
import type { CapabilityContext } from '../../../core/src/types.js';
import { relative } from '../../../core/src/rooted-fs.js';
import { check, PortalError, id, requestHash } from '../../../protocol/src/index.js';
export interface TreeEntry {
    path: string;
    type: 'file' | 'directory';
    bytes: number;
    sha256?: string;
}
/** A bounded, explicit manifest. Nothing follows symlinks or expands outside its root. */
export function treeManifest(c: CapabilityContext, source: string) {
    const root = relative(source, false);
    check(c.fs.stat(root).type === 'directory', 'INVALID_ARGUMENT', 'A directory manifest requires a directory');
    const entries: TreeEntry[] = [{ path: root, type: 'directory', bytes: 0 }], stack = [root];
    let bytes = 0;
    while (stack.length) {
        const dir = stack.pop()!;
        check(!c.signal.aborted, 'CANCEL_REQUESTED', 'Tree inspection cancelled');
        for (const entry of c.fs.list(dir)) {
            check(entries.length < 1000, 'LIMIT_EXCEEDED', 'Recursive operations are limited to 1,000 entries');
            check(entry.path.split('/').length - root.split('/').length <= 24, 'LIMIT_EXCEEDED', 'Tree depth exceeds 24 levels');
            check(entry.type === 'file' || entry.type === 'directory', 'SYMLINK_REJECTED', 'Tree manifests reject symlinks and special files');
            if (entry.type === 'directory') {
                entries.push({ path: entry.path, type: 'directory', bytes: 0 });
                stack.push(entry.path);
            }
            else {
                const snap = c.fs.read(entry.path, 32 * 1024 * 1024);
                bytes += snap.size;
                check(bytes <= 100 * 1024 * 1024, 'LIMIT_EXCEEDED', 'Tree contents exceed 100 MiB');
                entries.push({ path: entry.path, type: 'file', bytes: snap.size, sha256: snap.sha256 });
            }
        }
    }
    entries.sort((a, b) => Buffer.compare(Buffer.from(a.path), Buffer.from(b.path)));
    return { path: root, sha256: requestHash(entries), entries, totalBytes: bytes, totalEntries: entries.length };
}
function directory(c: CapabilityContext, p: string, remove = false) { const commitId = id('commit'); c.store.run('INSERT INTO file_commits VALUES(?,?,?,?,?,?,?,?,?)', commitId, c.operationId, c.workspace.root, p, null, null, null, 'prepared', JSON.stringify({ kind: 'directory', action: remove ? 'remove' : 'create' })); if (remove)
    c.fs.rmdir(p);
else
    c.fs.mkdir(p); c.store.run("UPDATE file_commits SET state='committed' WHERE id=?", commitId); return { path: p, commitId, kind: 'directory', action: remove ? 'remove' : 'create' }; }
export function removeTree(c: CapabilityContext, p: string, expected: string) { const manifest = treeManifest(c, p); check(manifest.sha256 === expected, 'WRITE_CONFLICT', 'Directory manifest changed; inspect it again before removal'); c.store.event(c.operationId, 'tree_manifest', { action: 'remove', manifest }); const receipts: any[] = []; for (const entry of manifest.entries.filter(e => e.type === 'file')) {
    check(!c.signal.aborted, 'CANCEL_REQUESTED', 'Recursive removal cancelled');
    receipts.push(c.fs.remove(entry.path, entry.sha256!, c.store, c.operationId));
} for (const entry of manifest.entries.filter(e => e.type === 'directory').sort((a, b) => b.path.split('/').length - a.path.split('/').length || b.path.localeCompare(a.path)))
    receipts.push(directory(c, entry.path, true)); return { path: p, removed: true, manifest, receipts, recoveryPolicy: 'Each removed file has a protected recovery copy referenced by its durable receipt. Recreate directories from this manifest. No external effects are rolled back.' }; }
export function copyTree(c: CapabilityContext, a: any, move: boolean) {
    check(a.recursive === true, 'INVALID_ARGUMENT', 'Directory copy/move requires recursive:true and its manifest SHA');
    const source = relative(a.source, false), destination = relative(a.destination, false);
    check(!destination.startsWith(source + '/') && !source.startsWith(destination + '/') && source !== destination, 'INVALID_ARGUMENT', 'Source and destination trees cannot overlap');
    check(a.expectedDestinationSha256 === null, 'WRITE_CONFLICT', 'Recursive destination must be absent; tree merging is not implicit');
    try {
        c.fs.stat(destination);
        throw new PortalError('WRITE_CONFLICT', 'Recursive destination already exists');
    }
    catch (e) {
        if (!(e instanceof PortalError && e.code === 'NOT_FOUND'))
            throw e;
    }
    const manifest = treeManifest(c, source);
    check(manifest.sha256 === a.expectedSourceSha256, 'WRITE_CONFLICT', 'Source directory manifest changed');
    c.store.event(c.operationId, 'tree_manifest', { action: move ? 'move' : 'copy', manifest, destination });
    const receipts: any[] = [];
    const dest = (p: string) => destination + p.slice(source.length);
    for (const entry of manifest.entries.filter(e => e.type === 'directory').sort((a, b) => a.path.split('/').length - b.path.split('/').length || a.path.localeCompare(b.path)))
        receipts.push(directory(c, dest(entry.path)));
    for (const entry of manifest.entries.filter(e => e.type === 'file')) {
        check(!c.signal.aborted, 'CANCEL_REQUESTED', 'Recursive copy cancelled');
        const snap = c.fs.read(entry.path, 32 * 1024 * 1024);
        check(snap.sha256 === entry.sha256, 'WRITE_CONFLICT', 'Source changed during recursive copy', { path: entry.path });
        receipts.push(c.fs.write(dest(entry.path), snap.bytes, null, c.store, c.operationId));
    }
    check(treeManifest(c, source).sha256 === manifest.sha256, 'SOURCE_CHANGED', 'Source subtree changed during copy; destination contains the recorded partial/snapshot results');
    return { source, destination, manifest, receipts, ...(move ? { removal: removeTree(c, source, manifest.sha256) } : {}) };
}
