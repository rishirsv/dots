import { test, expect } from 'vitest';
import { z } from 'zod';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { defineTool, jsonReply, openMcpEndpoint } from '../src/mcp.js';

test('real MCP HTTP initialization, discovery, call, validation, and shutdown', async () => {
  let calls = 0;
  const endpoint = await openMcpEndpoint({
    tools: [defineTool('echo', 'Test the real MCP path', z.object({ value: z.string() }).strict(), { readOnly: true }, async ({ value }) => jsonReply({ value }))],
    instructions: 'Test server', dispatch: (tool, input) => tool.execute(input), onToolCall: () => { calls++; },
  });
  const client = new Client({ name: 'oracle-mcp-test', version: '1' });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(endpoint.url)));
    expect(calls).toBe(0);
    expect((await client.listTools()).tools.map(tool => tool.name)).toEqual(['echo']);
    const reply = await client.callTool({ name: 'echo', arguments: { value: 'round-trip' } });
    expect(reply.structuredContent).toEqual({ value: 'round-trip' });
    expect(calls).toBe(1);
    const wrongPath = await fetch(endpoint.url + 'wrong', { method: 'POST', headers: {'content-type':'application/json'}, body: '{}' });
    expect(wrongPath.status).toBe(404);
  } finally { await client.close(); await endpoint.close(); }
  await expect(fetch(endpoint.url)).rejects.toThrow();
});
