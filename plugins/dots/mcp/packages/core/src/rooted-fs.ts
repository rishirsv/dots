import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { check, PortalError, sha, id } from '../../protocol/src/index.js';
import { LocalStore } from '../../storage/src/local.js';
const require = createRequire(import.meta.url);
interface NativeFs {
    openRoot(path: string): number;
    openDir(fd: number, path: string): number;
    openFile(fd: number, name: string, create: boolean): number;
    stat(fd: number, name: string): any;
    list(fd: number): string[];
    rename(a: number, b: string, c: number, d: string): void;
    unlink(fd: number, name: string, directory: boolean): void;
    mkdir(fd: number, name: string): void;
    lock(fd: number): void;
}
export const native: NativeFs = require(path.resolve(import.meta.dirname, '../../../../native/rooted-fs/build/rooted.node'));
export function relative(p: string, allowRoot = true): string {
    check(typeof p === 'string' && p.length > 0 && Buffer.byteLength(p) <= 4096, 'INVALID_ARGUMENT', 'Invalid path length');
    check(!p.includes('\0') && !p.includes('\\') && !path.isAbsolute(p), 'PATH_OUTSIDE_GRANT', 'Only root-relative paths are permitted');
    check(!p.split('/').some(x => x === '..' || x === '' || x !== x.normalize('NFC')), 'PATH_OUTSIDE_GRANT', 'Traversal, empty segments and non-NFC path ambiguity are rejected');
    const normalized = path.posix.normalize(p);
    check(allowRoot || normalized !== '.', 'FORBIDDEN', 'Root mutation is forbidden');
    return normalized;
}
export const overlaps = (a: string, b: string) => a === b || a.startsWith(b + path.sep) || b.startsWith(a + path.sep);
function mapError(e: any): never { if (e instanceof PortalError)
    throw e; if (e.errno === 40 || e.errno === 62 || e.code === 'ELOOP')
    throw new PortalError('SYMLINK_REJECTED', 'Symlinked path rejected'); if (e.errno === 2 || e.code === 'ENOENT')
    throw new PortalError('NOT_FOUND', 'Path does not exist'); if (e.errno === 17 || e.code === 'EEXIST')
    throw new PortalError('WRITE_CONFLICT', 'Destination exists'); throw new PortalError('IO_ERROR', e.message ?? 'Filesystem operation failed'); }
export class RootedFs {
    readonly fd: number;
    constructor(public root: string, public protectedRoots: string[] = [], expected?: {
        dev: string;
        ino: string;
    }) {
        check(!protectedRoots.some(x => overlaps(root, x)), 'PATH_OUTSIDE_GRANT', 'A grant cannot contain or overlap Portal control state or protected credentials');
        try {
            this.fd = native.openRoot(root);
            const st = fs.fstatSync(this.fd);
            if (expected)
                check(String(st.dev) === expected.dev && String(st.ino) === expected.ino, 'GRANT_CHANGED', 'Granted root has been replaced; re-authorize locally');
        }
        catch (e) {
            mapError(e);
        }
    }
    private parent(p: string, write = false): {
        fd: number;
        name: string;
        path: string;
    } {
        p = relative(p, false);
        if (write)
            check(!p.split('/').some(x => x === '.git' || x === '.portal'), 'FORBIDDEN', 'Repository administration/control paths are not writable');
        try {
            return { fd: native.openDir(this.fd, path.posix.dirname(p)), name: path.posix.basename(p), path: p };
        }
        catch (e) {
            return mapError(e);
        }
    }
    close() { fs.closeSync(this.fd); }
    stat(p: string) { p = relative(p); if (p === '.') {
        const st = fs.fstatSync(this.fd);
        return { path: p, type: 'directory', size: st.size, dev: st.dev, ino: st.ino, mtimeMs: st.mtimeMs, nlink: st.nlink };
    } const par = this.parent(p); try {
        return { path: p, ...native.stat(par.fd, par.name) };
    }
    catch (e) {
        return mapError(e);
    }
    finally {
        fs.closeSync(par.fd);
    } }
    list(p = '.'): {
        path: string;
        name: string;
        type: string;
        [key: string]: unknown;
    }[] { p = relative(p); let fd: number | undefined; try {
        fd = native.openDir(this.fd, p);
        return native.list(fd).sort((a: string, b: string) => Buffer.compare(Buffer.from(a), Buffer.from(b))).map((name: string) => ({ name, path: p === '.' ? name : p + '/' + name, ...native.stat(fd!, name) }));
    }
    catch (e) {
        return mapError(e);
    }
    finally {
        if (fd !== undefined)
            fs.closeSync(fd);
    } }
    read(p: string, maxBytes = 100 * 1024 * 1024): {
        path: string;
        bytes: Buffer;
        sha256: string;
        size: number;
    } {
        const par = this.parent(p);
        let fd: number | undefined;
        try {
            fd = native.openFile(par.fd, par.name, false);
            const before = fs.fstatSync(fd, { bigint: true });
            check(before.size <= BigInt(maxBytes), 'LIMIT_EXCEEDED', 'File exceeds snapshot byte limit; use range reads');
            const bytes = fs.readFileSync(fd);
            const after = fs.fstatSync(fd, { bigint: true });
            check(before.size === after.size && before.mtimeNs === after.mtimeNs && before.ctimeNs === after.ctimeNs, 'SOURCE_CHANGED', 'Source changed during snapshot');
            return { path: par.path, bytes, sha256: sha(bytes), size: bytes.length };
        }
        catch (e) {
            return mapError(e);
        }
        finally {
            if (fd !== undefined)
                fs.closeSync(fd);
            fs.closeSync(par.fd);
        }
    }
    range(p: string, start: number, max: number, expected?: string) {
        const par = this.parent(p);
        let fd: number | undefined;
        try {
            fd = native.openFile(par.fd, par.name, false);
            const before = fs.fstatSync(fd, { bigint: true });
            check(start >= 0 && max <= 65536, 'INVALID_ARGUMENT', 'Invalid byte range');
            const hash = createHash('sha256'), buf = Buffer.alloc(65536), chunks: Buffer[] = [];
            let offset = 0, n = 0;
            const deadline = performance.now() + 30000;
            while ((n = fs.readSync(fd, buf, 0, buf.length, null)) > 0) {
                check(performance.now() < deadline, 'LIMIT_EXCEEDED', 'Snapshot hashing deadline exceeded');
                hash.update(buf.subarray(0, n));
                if (offset + n > start && offset < start + max)
                    chunks.push(Buffer.from(buf.subarray(Math.max(0, start - offset), Math.min(n, start + max - offset))));
                offset += n;
            }
            const after = fs.fstatSync(fd, { bigint: true });
            check(before.size === after.size && before.mtimeNs === after.mtimeNs && before.ctimeNs === after.ctimeNs, 'SOURCE_CHANGED', 'Source changed during read');
            const digest = hash.digest('hex');
            if (expected)
                check(digest === expected, 'SOURCE_CHANGED', 'Source hash changed');
            return { path: par.path, sha256: digest, bytes: Buffer.concat(chunks), size: offset, startByte: start, endByte: Math.min(start + max, offset) };
        }
        catch (e) {
            return mapError(e);
        }
        finally {
            if (fd !== undefined)
                fs.closeSync(fd);
            fs.closeSync(par.fd);
        }
    }
    hash(p: string): string | null { try {
        return this.range(p, 0, 0).sha256;
    }
    catch (e) {
        if (e instanceof PortalError && e.code === 'NOT_FOUND')
            return null;
        throw e;
    } }
    write(p: string, bytes: Buffer, expected: string | null, store: LocalStore, operationId: string) {
        check(bytes.length <= 100 * 1024 * 1024, 'LIMIT_EXCEEDED', 'Write exceeds 100 MiB');
        const par = this.parent(p, true), commit = id('commit'), temp = `.portal-stage-${commit}`;
        let fd: number | undefined;
        const after = sha(bytes);
        try {
            const before = this.hash(p);
            check(before === expected, 'WRITE_CONFLICT', 'Source hash/absence precondition failed', { path: p, expected, actual: before });
            fd = native.openFile(par.fd, temp, true);
            fs.writeFileSync(fd!, bytes);
            fs.fsyncSync(fd!);
            fs.closeSync(fd!);
            fd = undefined;
            store.run('INSERT INTO file_commits VALUES(?,?,?,?,?,?,?,?,?)', commit, operationId, this.root, p, before, after, path.posix.join(path.posix.dirname(p), temp), 'prepared', JSON.stringify({ bytes: bytes.length }));
            store.event(operationId, 'file_prepared', { commit, path: p, before, after });
            check(this.hash(p) === expected, 'WRITE_CONFLICT', 'Source changed immediately before commit', { path: p });
            native.rename(par.fd, temp, par.fd, par.name);
            fs.fsyncSync(par.fd);
            store.tx(() => { store.run("UPDATE file_commits SET state='committed' WHERE id=?", commit); store.event(operationId, 'file_committed', { commit, path: p, before, after }); });
            return { path: p, beforeSha256: before, sha256: after, bytes: bytes.length, commitId: commit, operationId };
        }
        catch (e) {
            try {
                native.unlink(par.fd, temp, false);
            }
            catch { }
            mapError(e);
        }
        finally {
            if (fd !== undefined)
                fs.closeSync(fd);
            fs.closeSync(par.fd);
        }
    }
    mkdir(p: string) { const par = this.parent(p, true); try {
        native.mkdir(par.fd, par.name);
        fs.fsyncSync(par.fd);
        return { path: p, created: true };
    }
    catch (e) {
        return mapError(e);
    }
    finally {
        fs.closeSync(par.fd);
    } }
    remove(p: string, expected: string, store: LocalStore, operationId: string) {
        const snap = this.read(p);
        check(snap.sha256 === expected, 'WRITE_CONFLICT', 'Removal source changed');
        const recovery = path.join(store.dir, 'recovery', id('removed'));
        const fd = fs.openSync(recovery, 'wx', 0o600);
        try {
            fs.writeFileSync(fd, snap.bytes);
            fs.fsyncSync(fd);
        }
        finally {
            fs.closeSync(fd);
        }
        const par = this.parent(p, true);
        try {
            check(this.hash(p) === expected, 'WRITE_CONFLICT', 'Removal source changed');
            const commit = id('commit');
            store.run('INSERT INTO file_commits VALUES(?,?,?,?,?,?,?,?,?)', commit, operationId, this.root, p, expected, null, recovery, 'prepared', JSON.stringify({ recoveryPolicy: 'Protected recovery copy retained with operation metadata' }));
            native.unlink(par.fd, par.name, false);
            fs.fsyncSync(par.fd);
            store.run("UPDATE file_commits SET state='committed' WHERE id=?", commit);
            return { path: p, removed: true, beforeSha256: expected, commitId: commit, recoveryId: path.basename(recovery) };
        }
        catch (e) {
            return mapError(e);
        }
        finally {
            fs.closeSync(par.fd);
        }
    }
    rmdir(p: string) { const par = this.parent(p, true); try {
        native.unlink(par.fd, par.name, true);
        fs.fsyncSync(par.fd);
    }
    catch (e) {
        return mapError(e);
    }
    finally {
        fs.closeSync(par.fd);
    } }
}
