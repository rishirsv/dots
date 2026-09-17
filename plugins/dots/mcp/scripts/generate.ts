import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApplication } from '../packages/core/src/application.js';
import { declaration, sha } from '../packages/protocol/src/index.js';
const root = path.resolve(import.meta.dirname, '../..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-manifest-'));
const app = createApplication(path.join(scratch, 'state'));
const write = (name: string, data: any) => { const file = path.join(root, 'manifests', name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n'); };
try {
    const caps = app.registry.all().map(c => ({ id: c.id, description: c.description, family: c.family, effect: c.effect, revision: c.revision, inputSchema: c.input, outputSchema: c.output, dependencies: c.dependencies, examples: c.examples ?? [] }));
    write('tools.json', { schemaVersion: 1, server: 'portal', version: '0.1.0', tools: app.frontDoor.tools });
    write('capabilities.json', { schemaVersion: 1, revision: app.registry.revision(), capabilities: caps });
    const resources: Record<string, any> = {};
    const bundles = app.skills.builtins();
    for (const bundle of bundles)
        for (const r of bundle.manifest.resources)
            resources[r.uri] = app.skills.resource(r.uri).contents[0];
    write('skills.json', { extension: 'io.modelcontextprotocol/skills', skills: bundles.map(b => b.manifest), resources });
    const families = new Map<string, string[]>();
    for (const c of app.registry.all()) {
        const [family, ...method] = c.id.split('.');
        const rows = families.get(family) ?? [];
        rows.push(`    ${JSON.stringify(method.join('.'))}(args: ${declaration(c.input)}${c.effect === 'read' ? '' : ' & { stepKey: string }'}): Promise<${declaration(c.output)}>;`);
        families.set(family, rows);
    }
    // Dotted nested method names are indexed by the literal registry ID in this companion interface.
    write('capabilities.d.ts', '// Generated input contracts. Runtime examples use portal.family.method.\nexport interface CapabilityCalls {\n' + app.registry.all().map(c => `  ${JSON.stringify(c.id)}(args: ${declaration(c.input)}${c.effect === 'read' ? '' : ' & { stepKey: string }'}): Promise<${declaration(c.output)}>;`).join('\n') + '\n}\n');
    write('mcp.local.json', { mcpServers: { portal: { command: 'portal', args: ['mcp', '--stdio'] } } });
    write('mcp.relay.template.json', { mcpServers: { portal: { url: 'https://YOUR-OWNED-HOST/mcp', authorization: 'OAuth provider configuration required; do not insert credentials into this template' } } });
    write('plugin.template.json', { name: 'portal', display_name: 'Portal', description: 'Use permission-scoped files, documents, skills and durable jobs on an explicitly authorized Mac. No second model.', version: '0.1.0', mcp: { url: 'https://YOUR-OWNED-HOST/mcp' }, skills: bundles.map(b => ({ name: b.name, path: `skills/${b.name}/SKILL.md` })), provisioningRequired: true });
    const digests: Record<string, string> = {};
    for (const name of fs.readdirSync(path.join(root, 'manifests')).sort()) {
        if (name === 'SHA256SUMS.json')
            continue;
        const file = path.join(root, 'manifests', name);
        if (fs.statSync(file).isFile())
            digests[name] = sha(fs.readFileSync(file));
    }
    write('SHA256SUMS.json', digests);
    console.log(JSON.stringify({ tools: app.frontDoor.tools.length, capabilities: caps.length, skills: bundles.length, resources: Object.keys(resources).length, registryRevision: app.registry.revision() }, null, 2));
}
finally {
    app.store.close();
    fs.rmSync(scratch, { recursive: true, force: true });
}
