import { afterEach, describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TurnBroker } from "../src/adapters/chatgpt-web/turn-broker";

const sockets: string[] = [];
afterEach(async () => {
  await Promise.all(sockets.splice(0).map(path => TurnBroker.forSocket(path).close()));
});

describe("Portal dynamic tool bridge", () => {
  test("publishes only portal_tools and portal_call and invokes an exact live tool", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    const broker = TurnBroker.forSocket(socket);
    const token = await broker.register({
      cwd: process.cwd(),
      roots: [process.cwd()],
      writableRoots: [process.cwd()],
      sandboxPolicy: { type: "dangerFullAccess" },
      tools: [{
        name: "fixture_tool",
        description: "A dynamically supplied fixture tool",
        parameters: { type: "object", properties: { value: { type: "string" } } },
      }],
    }, 60_000);
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-tool-bridge-test", version: "1.0.0" });
    try {
      await client.connect(transport);
      const listed = await client.listTools();
      expect(listed.tools.map(tool => tool.name).sort()).toEqual(["portal_call", "portal_tools"]);

      const inventory = await client.callTool({
        name: "portal_tools",
        arguments: { turn_token: token, include_schema: true },
      });
      expect(inventory.structuredContent).toMatchObject({
        tools: [{ wire_name: "fixture_tool", kind: "function" }],
        total: 1,
      });

      const pending = client.callTool({
        name: "portal_call",
        arguments: { turn_token: token, wire_name: "fixture_tool", arguments: { value: "hello" } },
      });
      const [invocation] = await broker.nextToolBatch(token);
      expect(invocation).toMatchObject({ wireName: "fixture_tool", arguments: { value: "hello" } });
      broker.completeTool(token, invocation!.callId, {
        content: [{ type: "text", text: "world" }],
        structuredContent: { value: "world" },
        isError: false,
      });
      expect((await pending).structuredContent).toEqual({ value: "world" });
    } finally {
      await client.close();
    }
  });
});
