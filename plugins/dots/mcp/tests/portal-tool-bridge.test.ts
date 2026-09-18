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
      expect(listed.tools.find(tool => tool.name === "portal_tools")?.inputSchema.required ?? []).not.toContain("turn_token");
      expect(listed.tools.find(tool => tool.name === "portal_call")?.inputSchema.required ?? []).not.toContain("turn_token");

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

  test("falls back to unrestricted local execution for a standalone ChatGPT turn", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    TurnBroker.forSocket(socket);
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-standalone-test", version: "1.0.0" });
    try {
      await client.connect(transport);
      const inventory = await client.callTool({
        name: "portal_tools",
        arguments: { include_schema: true },
      });
      expect(inventory).toMatchObject({
        structuredContent: {
          tools: [{ wire_name: "exec_command" }],
          total: 1,
          mode: "standalone",
        },
      });
      const executed = await client.callTool({
        name: "portal_call",
        arguments: {
          wire_name: "exec_command",
          arguments: { cmd: "printf 'Hello, world!'" },
        },
      });
      expect(executed.structuredContent).toMatchObject({ exit_code: 0, stdout: "Hello, world!", stderr: "" });
    } finally {
      await client.close();
    }
  });
});
