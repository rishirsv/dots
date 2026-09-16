import test from 'node:test';
import assert from 'node:assert/strict';
import { missingDependencies } from '../support/dependencies.js';
import { fixture } from '../support/fixture.js';
import { makeMcpServer } from '../../apps/mcp-local/src/server.js';
const missing = missingDependencies(['@modelcontextprotocol/sdk', 'zod']);
test('E05 official MCP SDK in-memory transport negotiates 17 tools, structured read, static skills and exact resources', { skip: missing.length ? 'Not exercised: MCP SDK / Zod are not installed' : false }, async () => { const f = await fixture(); const { Client } = await import('@modelcontextprotocol/sdk/client/index.js'); const { InMemoryTransport } = await import('@modelcontextprotocol/sdk/inMemory.js'); const { z } = await import('zod'); const [ct, st] = InMemoryTransport.createLinkedPair(); const server = await makeMcpServer(f.frontDoor.tools, (name, args) => f.frontDoor.call(f.actor, name, args), f.skills); const client = new Client({ name: 'portal-acceptance', version: '1' }, { capabilities: {} }); try {
    await server.connect(st);
    await client.connect(ct);
    assert.equal((await client.listTools()).tools.length, 17);
    f.put('hello.txt', 'MCP fixture');
    const r = await client.callTool({ name: 'read_file', arguments: { workspaceId: f.ws.workspaceId, path: 'hello.txt' } });
    assert.equal((r.structuredContent as { data: { text: string } }).data.text, 'MCP fixture');
    const skillList = await client.request({ method: 'skills/list', params: {} }, z.object({ skills: z.array(z.any()) }));
    assert.equal(skillList.skills.length, 5);
    const resource = await client.readResource({ uri: skillList.skills[0].uri });
    assert.ok('text' in resource.contents[0]);
    if ('text' in resource.contents[0])
        assert.match(resource.contents[0].text, /Portal|portal/);
}
finally {
    await client.close();
    await server.close();
    await f.close();
} });
