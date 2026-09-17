import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { Registry } from '../../../core/src/registry.js';
import { RootedFs, relative } from '../../../core/src/rooted-fs.js';
import type { CapabilityContext } from '../../../core/src/types.js';
import { s, id, check, PortalError, cursor, uncursor } from '../../../protocol/src/index.js';
// Linear-space glob matcher avoids executing user-supplied glob text as a regular expression.
export function glob(pattern: string, value: string): boolean { const memo = new Map<string, boolean>(); const match = (i: number, j: number): boolean => { const key = i + ':' + j; if (memo.has(key))
    return memo.get(key)!; let out = false; if (i === pattern.length)
    out = j === value.length;
else if (pattern[i] === '*') {
    const deep = pattern[i + 1] === '*', next = i + (deep ? 2 : 1);
    out = match(next, j) || (deep && pattern[next] === '/' && match(next + 1, j)) || (j < value.length && (deep || value[j] !== '/') && match(i, j + 1));
}
else
    out = j < value.length && (pattern[i] === '?' ? value[j] !== '/' : pattern[i] === value[j]) && match(i + 1, j + 1); memo.set(key, out); return out; }; return match(0, 0); }
function regexIndices(pattern: string, lines: string[], caseSensitive: boolean, limit: number): Promise<number[]> { return new Promise((resolve, reject) => { const worker = new Worker(new URL('./regex-worker.js', import.meta.url), { resourceLimits: { maxOldGenerationSizeMb: 32, stackSizeMb: 2 } }); const timer = setTimeout(() => { void worker.terminate(); reject(new PortalError('LIMIT_EXCEEDED', 'Regex execution exceeded 250 ms per file')); }, 250); worker.once('error', e => { clearTimeout(timer); reject(e); }); worker.once('message', m => { clearTimeout(timer); void worker.terminate(); m.error ? reject(new PortalError('INVALID_ARGUMENT', m.error)) : resolve(m.indices); }); worker.postMessage({ pattern, lines, flags: caseSensitive ? '' : 'i', limit }); }); }
export function addSearch(r: Registry) {
    const active = new Map<string, AbortController>();
    const page = (c: CapabilityContext, a: any) => { const row = c.store.one('SELECT * FROM searches WHERE id=? AND workspace_id=?', a.searchId, c.workspace.id); check(row, 'NOT_FOUND', 'Search not found in this workspace'); const cur = uncursor(a.cursor); check(!cur || (cur.searchId === row.id && Number.isSafeInteger(cur.offset) && cur.offset >= 0), 'INVALID_ARGUMENT', 'Invalid search cursor'); const all = JSON.parse(row.matches), offset = cur?.offset ?? 0, end = Math.min(all.length, offset + (a.maxResults ?? 100)); return { searchId: row.id, state: row.state, complete: !['running', 'accepted'].includes(row.state), matches: all.slice(offset, end), errors: JSON.parse(row.errors), truncated: !!row.truncated, nextCursor: end < all.length || row.state === 'running' ? cursor({ searchId: row.id, offset: end }) : null }; };
    r.add({ id: 'search.start', description: 'Start a persistent filename, literal, or regex search. Office parsing requires documents=true and an explicit file glob.', family: 'search', effect: 'read', input: s.object({ path: s.path(), pattern: s.string(1000), kind: s.enum('filename', 'literal', 'regex'), fileGlob: s.string(200), caseSensitive: s.bool(), contextLines: s.int(0, 6), hidden: s.bool(), respectIgnore: s.bool(), documents: s.bool(), maxResults: s.int(1, 2000) }, ['path', 'pattern', 'kind']), handler: async (c, a) => {
            relative(a.path);
            if (a.kind === 'regex')
                await regexIndices(a.pattern, [], a.caseSensitive ?? true, 1);
            check(!a.documents || !!a.fileGlob, 'INVALID_ARGUMENT', 'Document search needs an explicit fileGlob');
            const searchId = id('search'), abort = new AbortController();
            active.set(searchId, abort);
            c.store.run('INSERT INTO searches VALUES(?,?,?,?,?,?,?,?,?)', searchId, c.workspace.id, c.operationId, JSON.stringify(a), 'running', '[]', '[]', 0, Date.now());
            const run = async () => {
                let rooted: RootedFs | undefined;
                const matches: any[] = [], errors: any[] = [];
                let truncated = false, visited = 0;
                const limit = a.maxResults ?? 100;
                const save = (state: string) => c.store.run('UPDATE searches SET state=?,matches=?,errors=?,truncated=? WHERE id=?', state, JSON.stringify(matches), JSON.stringify(errors), truncated ? 1 : 0, searchId);
                try {
                    rooted = new RootedFs(c.workspace.root, [], { dev: c.grant.dev, ino: c.grant.ino });
                    const stack: [
                        string,
                        {
                            base: string;
                            pattern: string;
                            neg: boolean;
                            directory: boolean;
                        }[]
                    ][] = [[a.path, []]];
                    while (stack.length && !abort.signal.aborted && matches.length < limit) {
                        const [dir, inherited] = stack.pop()!;
                        check(c.store.one('SELECT revoked,revision,expires_at FROM grants WHERE id=?', c.grant.id)?.revoked === 0, 'GRANT_EXPIRED', 'Grant revoked during search');
                        const rules = [...inherited];
                        if (a.respectIgnore !== false) {
                            try {
                                const text = rooted.read(dir === '.' ? '.gitignore' : dir + '/.gitignore', 65536).bytes.toString('utf8');
                                for (let line of text.split(/\r?\n/)) {
                                    if (!line || line.startsWith('#'))
                                        continue;
                                    const neg = line.startsWith('!');
                                    if (neg)
                                        line = line.slice(1);
                                    const directory = line.endsWith('/');
                                    rules.push({ base: dir === '.' ? '' : dir + '/', pattern: line.replace(/^\//, '').replace(/\/$/, ''), neg, directory });
                                }
                            }
                            catch (e) {
                                if (!(e instanceof PortalError && e.code === 'NOT_FOUND'))
                                    errors.push({ path: dir, code: 'IGNORE_UNREADABLE' });
                            }
                        }
                        let entries;
                        try {
                            entries = rooted.list(dir);
                        }
                        catch (e) {
                            errors.push({ path: dir, code: e instanceof PortalError ? e.code : 'IO_ERROR' });
                            continue;
                        }
                        for (const e of entries) {
                            if (++visited > 50000) {
                                truncated = true;
                                stack.length = 0;
                                break;
                            }
                            if (e.name === '.git' || e.name.startsWith('.portal-stage-'))
                                continue;
                            if (!a.hidden && e.name.startsWith('.'))
                                continue;
                            if (e.type === 'symlink' || e.type === 'special')
                                continue;
                            let ignored = false;
                            for (const rule of rules) {
                                if (!e.path.startsWith(rule.base))
                                    continue;
                                const local = e.path.slice(rule.base.length);
                                if ((!rule.directory || e.type === 'directory') && (rule.pattern.includes('/') ? glob(rule.pattern, local) : local.split('/').some(x => glob(rule.pattern, x))))
                                    ignored = !rule.neg;
                            }
                            if (ignored && a.respectIgnore !== false)
                                continue;
                            if (e.type === 'directory') {
                                stack.push([e.path, rules]);
                                continue;
                            }
                            if (a.fileGlob && !glob(a.fileGlob, e.path))
                                continue;
                            try {
                                if (a.kind === 'filename') {
                                    const name = a.caseSensitive === false ? e.path.toLowerCase() : e.path, pattern = a.caseSensitive === false ? a.pattern.toLowerCase() : a.pattern;
                                    if (name.includes(pattern))
                                        matches.push({ path: e.path, type: 'filename' });
                                }
                                else {
                                    let snap;
                                    try {
                                        snap = rooted.read(e.path, 8 * 1024 * 1024);
                                    }
                                    catch (e) {
                                        throw e;
                                    }
                                    let text: string;
                                    const ext = path.extname(e.path).toLowerCase();
                                    if (['.docx', '.xlsx', '.xlsm'].includes(ext)) {
                                        if (!a.documents)
                                            continue;
                                        const { documentText } = await import('../documents/index.js');
                                        text = await documentText(snap.bytes, ext, c.signal);
                                    }
                                    else {
                                        if (snap.bytes.includes(0))
                                            continue;
                                        try {
                                            text = new TextDecoder('utf8', { fatal: true }).decode(snap.bytes);
                                        }
                                        catch {
                                            continue;
                                        }
                                    }
                                    const lines = text.split(/\r?\n/);
                                    let indices: number[];
                                    if (a.kind === 'regex')
                                        indices = await regexIndices(a.pattern, lines, a.caseSensitive !== false, limit - matches.length);
                                    else {
                                        indices = [];
                                        const needle = a.caseSensitive === false ? a.pattern.toLowerCase() : a.pattern;
                                        for (let i = 0; i < lines.length && indices.length < limit - matches.length; i++)
                                            if ((a.caseSensitive === false ? lines[i].toLowerCase() : lines[i]).includes(needle))
                                                indices.push(i);
                                    }
                                    for (const n of indices)
                                        matches.push({ path: e.path, line: n + 1, text: lines[n].slice(0, 2000), sha256: snap.sha256, ...(a.contextLines ? { context: lines.slice(Math.max(0, n - a.contextLines), n + a.contextLines + 1).map((text, i) => ({ line: Math.max(0, n - a.contextLines) + i + 1, text: text.slice(0, 2000) })) } : {}) });
                                }
                            }
                            catch (error) {
                                errors.push({ path: e.path, code: error instanceof PortalError ? error.code : 'PARSER_FAILED', message: error instanceof Error ? error.message : 'Search error' });
                            }
                            if (matches.length >= limit) {
                                truncated = true;
                                break;
                            }
                        }
                        save('running');
                        await new Promise<void>(resolve => setImmediate(resolve));
                    }
                    save(abort.signal.aborted ? 'cancelled' : 'succeeded');
                }
                catch (error) {
                    errors.push({ code: error instanceof PortalError ? error.code : 'IO_ERROR', message: error instanceof Error ? error.message : 'Search failed' });
                    save('failed');
                }
                finally {
                    rooted?.close();
                    active.delete(searchId);
                }
            };
            setImmediate(() => void run());
            return { searchId, complete: false, matches: [], nextCursor: cursor({ searchId, offset: 0 }) };
        } });
    r.add({ id: 'search.read', description: 'Read a persistent search page without consuming another reader cursor.', family: 'search', effect: 'read', input: s.object({ searchId: s.key(), cursor: s.nullable(s.string(4096)), maxResults: s.int(1, 200), waitMs: s.int(0, 10000) }, ['searchId']), handler: async (c, a) => { const end = performance.now() + (a.waitMs ?? 0); let result = page(c, a); while (!result.complete && !result.matches.length && performance.now() < end) {
            await new Promise(r => setTimeout(r, 50));
            result = page(c, a);
        } return result; } });
    r.add({ id: 'search.cancel', description: 'Cancel only this search; partial results remain available.', family: 'search', effect: 'control', input: s.object({ searchId: s.key() }), handler: (c, a) => { page(c, a); active.get(a.searchId)?.abort(); c.store.run("UPDATE searches SET state='cancelled' WHERE id=? AND workspace_id=?", a.searchId, c.workspace.id); return { searchId: a.searchId, cancelRequested: true }; } });
    r.add({ id: 'search.list', description: 'List this workspace search jobs, including recovered partial results.', family: 'search', effect: 'read', input: s.object({}), handler: c => ({ searches: c.store.all('SELECT id,state,truncated,created_at FROM searches WHERE workspace_id=? ORDER BY created_at DESC LIMIT 100', c.workspace.id) }) });
}
