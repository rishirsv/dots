import fs from 'node:fs';
import path from 'node:path';
import { LocalStore } from '../../storage/src/local.js';
import { RootedFs, relative } from '../../core/src/rooted-fs.js';
import { Registry } from '../../core/src/registry.js';
import { sha, requestHash, check, PortalError, cursor, uncursor } from '../../protocol/src/index.js';
export interface Bundle {
    id: string;
    name: string;
    description: string;
    source: string;
    digest: string;
    frontmatter: Record<string, any>;
    resources: Map<string, Buffer>;
    manifest: {
        uri: string;
        frontmatter: Record<string, any>;
        resources: {
            uri: string;
            digest: string;
        }[];
    };
    requiredCapabilities: string[];
}
export function frontmatter(text: string) {
    check(text.startsWith('---\n') || text.startsWith('---\r\n'), 'INVALID_ARGUMENT', 'SKILL.md needs frontmatter');
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    let end = lines.indexOf('---', 1);
    check(end > 0 && end < 200, 'INVALID_ARGUMENT', 'Unclosed or excessive skill frontmatter');
    const out: Record<string, any> = {};
    for (let i = 1; i < end; i++) {
        const line = lines[i];
        if (!line.trim() || line.trimStart().startsWith('#'))
            continue;
        const m = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
        check(m, 'INVALID_ARGUMENT', 'Only scalar, flow-array and block-string skill frontmatter is supported; nested YAML is rejected');
        check(!Object.hasOwn(out, m[1]), 'INVALID_ARGUMENT', 'Duplicate frontmatter field');
        let v = m[2];
        if (v === '>' || v === '|' || v === '>-' || v === '|-') {
            const block: string[] = [];
            while (i + 1 < end && /^\s+/.test(lines[i + 1]))
                block.push(lines[++i].trimStart());
            out[m[1]] = block.join(v.startsWith('>') ? ' ' : '\n');
        }
        else if (v.startsWith('[') || v.startsWith('"')) {
            out[m[1]] = JSON.parse(v);
        }
        else if (v.startsWith("'") && v.endsWith("'")) {
            out[m[1]] = v.slice(1, -1).replaceAll("''", "'");
        }
        else {
            check(!/[&*!{}]/.test(v), 'INVALID_ARGUMENT', 'YAML aliases, tags and mapping syntax are not accepted');
            out[m[1]] = v;
        }
    }
    check(typeof out.name === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(out.name), 'INVALID_ARGUMENT', 'Invalid skill name');
    check(typeof out.description === 'string' && out.description.length > 0, 'INVALID_ARGUMENT', 'Missing skill description');
    return out;
}
function mime(name: string) { return /\.(md|txt|ts|js|py|json|sh|swift|yaml|yml)$/.test(name) ? 'text/plain' : 'application/octet-stream'; }
export function readBundle(root: string, folder: string, namespace: string): Bundle {
    const rooted = new RootedFs(root);
    try {
        const resources = new Map<string, Buffer>();
        const stack = [folder];
        let total = 0;
        while (stack.length) {
            const dir = stack.pop()!;
            for (const e of rooted.list(dir)) {
                check(e.type !== 'symlink' && e.type !== 'special', 'SYMLINK_REJECTED', 'Skill resources cannot be symlinks or special files');
                if (e.type === 'directory') {
                    stack.push(e.path);
                    continue;
                }
                check(resources.size < 100, 'LIMIT_EXCEEDED', 'Skill has more than 100 resources');
                const snap = rooted.read(e.path, 1048576);
                total += snap.size;
                check(total <= 5 * 1024 * 1024, 'LIMIT_EXCEEDED', 'Skill bundle exceeds 5 MiB');
                const rel = e.path.slice(folder.length + 1);
                relative(rel, false);
                resources.set(rel, snap.bytes);
            }
        }
        const body = resources.get('SKILL.md');
        check(body && body.length <= 262144, 'INVALID_ARGUMENT', 'Skill requires SKILL.md below 256 KiB');
        const fm = frontmatter(new TextDecoder('utf8', { fatal: true }).decode(body));
        const id = namespace + ':' + fm.name;
        const base = namespace === 'builtin' ? `skill://portal/${fm.name}/` : `skill://portal-local/${encodeURIComponent(namespace)}/${fm.name}/`;
        const manifest = { uri: base + 'SKILL.md', frontmatter: fm, resources: [...resources].sort(([a], [b]) => a.localeCompare(b)).map(([p, b]) => ({ uri: base + p, digest: 'sha256:' + sha(b) })) };
        return { id, name: fm.name, description: fm.description, source: namespace, digest: requestHash(manifest), frontmatter: fm, resources, manifest, requiredCapabilities: Array.isArray(fm.capabilities) ? fm.capabilities : [] };
    }
    finally {
        rooted.close();
    }
}
export class SkillCatalogue {
    constructor(public store: LocalStore, public registry: Registry, public builtinRoot = path.resolve(import.meta.dirname, '../../../..', 'skills')) { }
    builtins() { const entries = fs.readdirSync(this.builtinRoot, { withFileTypes: true }).filter(x => x.isDirectory()).sort((a, b) => a.name.localeCompare(b.name)); check(entries.length === 5, 'CAPABILITY_CHANGED', 'A Portal release must contain exactly five bundled skills'); return entries.map(e => readBundle(this.builtinRoot, e.name, 'builtin')); }
    catalogue(grantId?: string) {
        const bundles = this.builtins();
        const errors: any[] = [];
        for (const root of this.store.all('SELECT * FROM skill_roots WHERE enabled=1')) {
            if (root.grant_id && root.grant_id !== grantId)
                continue;
            try {
                const rooted = new RootedFs(root.path);
                const entries = rooted.list('.');
                rooted.close();
                check(entries.length <= 1000, 'LIMIT_EXCEEDED', 'Skill root has too many entries');
                for (const e of entries.filter(x => x.type === 'directory')) {
                    try {
                        const b = readBundle(root.path, e.name, root.alias);
                        check(!bundles.some(x => x.id === b.id), 'INVALID_ARGUMENT', 'Duplicate skill name in the same namespace');
                        bundles.push(b);
                    }
                    catch (error) {
                        errors.push({ source: root.alias, entry: e.name, reason: error instanceof Error ? error.message : 'Invalid bundle' });
                    }
                }
            }
            catch (error) {
                errors.push({ source: root.alias, reason: error instanceof Error ? error.message : 'Root unavailable' });
            }
        }
        for (const b of bundles) {
            this.store.run('INSERT OR IGNORE INTO skill_snapshots(id,digest,manifest,content,created_at) VALUES(?,?,?,?,?)', b.id, b.digest, JSON.stringify(b.manifest), JSON.stringify(Object.fromEntries([...b.resources].map(([p, v]) => [p, v.toString('base64')]))), Date.now());
        }
        return { bundles, errors };
    }
    summary(b: Bundle) { return { id: b.id, name: b.name, description: b.description, source: b.source, version: b.frontmatter.version ?? b.digest, sha256: b.digest, kind: 'skill', requiredCapabilities: b.requiredCapabilities, missingDependencies: b.requiredCapabilities.filter(id => { try {
            return !this.registry.get(id).availability().available;
        }
        catch {
            return true;
        } }) }; }
    discover(query: string, grantId?: string) { const { bundles, errors } = this.catalogue(grantId); const words = query.toLowerCase().split(/\W+/).filter(Boolean); return { skills: bundles.map(b => ({ ...this.summary(b), score: words.reduce((n, w) => n + (b.name.includes(w) ? 4 : (b.description.toLowerCase().includes(w) ? 1 : 0)), 0) })).filter(x => !words.length || x.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)), errors }; }
    load(skillId: string, grantId?: string, expectedHash?: string, reference = 'SKILL.md') { relative(reference, false); const b = this.catalogue(grantId).bundles.find(b => b.id === skillId); check(b, 'NOT_FOUND', 'Skill not found in approved roots'); if (expectedHash)
        check(expectedHash === b.digest, 'SKILL_CHANGED', 'Skill changed since the requested snapshot', { sha256: b.digest }); const bytes = b.resources.get(reference); check(bytes, 'NOT_FOUND', 'Reference is not in this bundle'); const type = mime(reference); return { ...this.summary(b), reference, resourceSha256: sha(bytes), provenance: { namespace: b.source, bundleDigest: b.digest }, manifest: b.manifest.resources, mimeType: type, ...(type === 'text/plain' ? { text: new TextDecoder('utf8', { fatal: true }).decode(bytes) } : { blob: bytes.toString('base64') }), scriptsExecuted: false }; }
    staticList(cursorValue?: string) { const b = this.builtins(), cur = uncursor(cursorValue); check(!cur || (cur.kind === 'static-skills' && Number.isSafeInteger(cur.offset) && cur.offset >= 0), 'INVALID_ARGUMENT', 'Invalid skills cursor'); const offset = cur?.offset ?? 0; return { skills: b.slice(offset, offset + 5).map(b => b.manifest), ...(offset + 5 < b.length ? { nextCursor: cursor({ kind: 'static-skills', offset: offset + 5 }) } : {}) }; }
    staticGet(uri: string) { const b = this.builtins().find(b => b.manifest.uri === uri); check(b, 'NOT_FOUND', 'Public release skill not found'); return { skill: b.manifest }; }
    resource(uri: string) { for (const b of this.builtins()) {
        const r = b.manifest.resources.find(r => r.uri === uri);
        if (!r)
            continue;
        const rel = uri.slice(b.manifest.uri.lastIndexOf('/') + 1);
        const bytes = b.resources.get(rel)!;
        check('sha256:' + sha(bytes) === r.digest, 'SOURCE_CHANGED', 'Skill resource hash mismatch');
        const type = mime(rel);
        return { contents: [{ uri, mimeType: type, ...(type === 'text/plain' ? { text: bytes.toString('utf8') } : { blob: bytes.toString('base64') }) }] };
    } throw new PortalError('NOT_FOUND', 'Public resource is not in the five release bundles'); }
}
