import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export function missingDependencies(names: string[]) { return names.filter(name => { try {
    // The MCP SDK intentionally exposes transport-specific entry points but
    // does not ship a root runtime index in every supported release.
    require.resolve(name === '@modelcontextprotocol/sdk' ? `${name}/server/index.js` : name);
    return false;
}
catch {
    return true;
} }); }
export async function until<T>(fn: () => Promise<T> | T, predicate: (value: T) => boolean, ms = 15000): Promise<T> { const deadline = performance.now() + ms; let result: T; do {
    result = await fn();
    if (predicate(result))
        return result;
    await new Promise(r => setTimeout(r, 80));
} while (performance.now() < deadline); throw new Error('Condition not satisfied within ' + ms + ' ms; last result ' + JSON.stringify(result!)); }
