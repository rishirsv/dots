import { check, requestHash, Schema, declaration, Obj } from '../../protocol/src/index.js';
import type { Capability } from './types.js';
export class Registry {
    private caps = new Map<string, Capability>();
    add(value: Omit<Capability, 'revision' | 'availability' | 'output' | 'dependencies'> & Partial<Pick<Capability, 'availability' | 'output' | 'dependencies'>>) {
        check(!this.caps.has(value.id), 'INVALID_ARGUMENT', 'Duplicate capability');
        const output = value.output ?? { type: 'object', additionalProperties: true };
        const cap = { ...value, output, dependencies: value.dependencies ?? [], availability: value.availability ?? (() => ({ available: true })), revision: requestHash({ id: value.id, input: value.input, output, effect: value.effect, dependencies: value.dependencies ?? [], contract: 1 }) };
        this.caps.set(cap.id, cap);
        return cap;
    }
    get(id: string) { const cap = this.caps.get(id); check(cap, 'NOT_FOUND', 'Unknown capability', { capabilityId: id, route: 'discover' }); return cap; }
    all() { return [...this.caps.values()].sort((a, b) => a.id.localeCompare(b.id)); }
    revision() { return requestHash(this.all().map(x => [x.id, x.revision])); }
    describe(ids: string[]) { check(ids.length <= 8, 'LIMIT_EXCEEDED', 'Describe at most eight capabilities'); const data = ids.map(id => { const c = this.get(id); return { id: c.id, description: c.description, revision: c.revision, inputSchema: c.input, outputSchema: c.output, typescript: `${c.id}(args: ${declaration(c.input)}): Promise<${declaration(c.output)}>`, sideEffects: c.effect, requiredPermissions: [c.family, c.effect], dependencies: c.dependencies, ...c.availability(), examples: c.examples ?? [] }; }); check(Buffer.byteLength(JSON.stringify(data)) <= 32768, 'LIMIT_EXCEEDED', 'Description exceeds 32 KiB; request fewer IDs'); return data; }
    discover(query: string, permissions: string[]) { const words = query.toLowerCase().split(/\W+/).filter(Boolean); return this.all().map(c => { const hay = (c.id + ' ' + c.description).toLowerCase(); const score = words.reduce((n, w) => n + (c.id.includes(w) ? 4 : hay.includes(w) ? 1 : 0), 0); const permit = permissions.includes(c.family) || permissions.includes('*'); return { id: c.id, description: c.description, revision: c.revision, kind: 'capability', permissions: [c.family, c.effect], ...c.availability(), ...(permit ? {} : { available: false, reason: 'FORBIDDEN: capability family is not granted' }), score }; }).filter(c => !words.length || c.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)); }
}
