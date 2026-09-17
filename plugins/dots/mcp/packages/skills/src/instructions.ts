import { Registry } from '../../core/src/registry.js';
import { relative } from '../../core/src/rooted-fs.js';
import { s, PortalError } from '../../protocol/src/index.js';
export function addInstructions(r: Registry) { r.add({ id: 'instructions.read_for_path', description: 'Read authorized AGENTS.md instructions from root to the target directory, with specificity and source hashes. Never execute hooks.', family: 'instructions', effect: 'read', input: s.object({ path: s.path() }), handler: (c, a) => { const p = relative(a.path), segments = p === '.' ? [] : p.split('/'), instructions: any[] = []; const candidates = ['AGENTS.md']; let prefix = ''; for (const seg of segments.slice(0, -1)) {
        prefix = prefix ? prefix + '/' + seg : seg;
        candidates.push(prefix + '/AGENTS.md');
    } for (const candidate of candidates) {
        try {
            const snap = c.fs.read(candidate, 65536);
            instructions.push({ path: candidate, sha256: snap.sha256, text: new TextDecoder('utf8', { fatal: true }).decode(snap.bytes), specificity: instructions.length });
        }
        catch (e) {
            if (!(e instanceof PortalError && e.code === 'NOT_FOUND'))
                throw e;
        }
    } return { instructions, executedHooks: false }; } }); }
