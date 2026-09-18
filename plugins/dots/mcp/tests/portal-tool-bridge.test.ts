import { afterEach, describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TurnBroker } from "../src/adapters/chatgpt-web/turn-broker";
import { CHATGPT_CONNECTOR_NAME } from "../src/config";

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
      expect(client.getServerVersion()).toMatchObject({ name: CHATGPT_CONNECTOR_NAME });
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
        mode: "bound",
      });

      const malformed = await client.callTool({
        name: "portal_call",
        arguments: { turn_token: token, wire_name: "fixture_tool", arguments: { value: 42 } },
      });
      expect(malformed.isError).toBe(true);
      await expect(broker.nextToolBatch(token, AbortSignal.timeout(25))).rejects.toThrow();

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
      expect((await pending).structuredContent).toEqual({ value: "world", mode: "bound" });
    } finally {
      await client.close();
    }
  });

  test("selects direct execution when a ChatGPT turn omits its token", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    TurnBroker.forSocket(socket);
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-direct-test", version: "1.0.0" });
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
          mode: "direct",
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

  test("does not execute locally when an explicit token cannot be claimed", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-invalid-token-test", version: "1.0.0" });
    try {
      await client.connect(transport);
      const discovered = await client.callTool({
        name: "portal_tools",
        arguments: { turn_token: "invalid-turn-token-123456" },
      });
      expect(discovered.isError).toBe(true);
      expect(JSON.stringify(discovered)).not.toContain("exec_command");
      const executed = await client.callTool({
        name: "portal_call",
        arguments: {
          turn_token: "invalid-turn-token-123456",
          wire_name: "exec_command",
          arguments: { cmd: "printf PORTAL_INVALID_TOKEN_EXECUTED" },
        },
      });
      expect(executed.isError).toBe(true);
      expect(JSON.stringify(executed)).not.toContain("PORTAL_INVALID_TOKEN_EXECUTED");
    } finally {
      await client.close();
    }
  });

  test("rejects direct arguments that violate the advertised command schema", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-argument-contract-test", version: "1.0.0" });
    try {
      await client.connect(transport);
      const malformed = await client.callTool({
        name: "portal_call",
        arguments: {
          wire_name: "exec_command",
          arguments: {
            cmd: "printf PORTAL_MALFORMED_ARGUMENT_EXECUTED",
            unexpected: true,
          },
        },
      });
      expect(malformed.isError).toBe(true);
      expect(JSON.stringify(malformed)).toContain("advertised schema");
      expect(JSON.stringify(malformed)).not.toContain("PORTAL_MALFORMED_ARGUMENT_EXECUTED");
    } finally {
      await client.close();
    }
  });

  test("reports direct command timeout as a non-retryable started operation", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-direct-timeout-test", version: "1.0.0" });
    try {
      await client.connect(transport);
      const timedOut = await client.callTool({
        name: "portal_call",
        arguments: {
          wire_name: "exec_command",
          arguments: { cmd: "sleep 1", timeout_ms: 25 },
        },
      });
      expect(timedOut).toMatchObject({
        isError: true,
        structuredContent: {
          mode: "direct",
          code: "portal_direct_timeout",
          started: true,
          retryable: false,
        },
      });
    } finally {
      await client.close();
    }
  });

  test("treats invalid, revoked, and expired explicit tokens as terminal binding errors", async () => {
    const cases: Array<"invalid" | "revoked" | "expired"> = ["invalid", "revoked", "expired"];
    for (const state of cases) {
      const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
      sockets.push(socket);
      const broker = TurnBroker.forSocket(socket);
      await broker.listen();
      const transport = new StdioClientTransport({
        command: process.execPath,
        args: ["src/cli.ts", "mcp", "--broker-socket", socket],
        cwd: process.cwd(),
        stderr: "pipe",
      });
      const client = new Client({ name: `portal-${state}-token-test`, version: "1.0.0" });
      try {
        await client.connect(transport);
        const token = state === "invalid"
          ? "invalid-turn-token-123456"
          : await broker.register({
            cwd: process.cwd(),
            roots: [process.cwd()],
            writableRoots: [process.cwd()],
            sandboxPolicy: { type: "dangerFullAccess" },
            tools: [],
          }, state === "expired" ? 1 : 60_000);
        if (state === "revoked") broker.revoke(token);
        if (state === "expired") await Bun.sleep(10);
        const executed = await client.callTool({
          name: "portal_call",
          arguments: {
            turn_token: token,
            wire_name: "exec_command",
            arguments: { cmd: "printf PORTAL_TERMINAL_BINDING_ERROR_EXECUTED" },
          },
        });
        expect(executed.isError).toBe(true);
        expect(JSON.stringify(executed)).not.toContain("PORTAL_TERMINAL_BINDING_ERROR_EXECUTED");
      } finally {
        await client.close();
      }
    }
  });

  test("cancelling a direct operation does not poison the MCP process", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-direct-cancellation-test", version: "1.0.0" });
    try {
      await client.connect(transport);
      const controller = new AbortController();
      const pending = client.callTool({
        name: "portal_call",
        arguments: {
          wire_name: "exec_command",
          arguments: { cmd: "sleep 1" },
        },
      }, undefined, { signal: controller.signal });
      await Bun.sleep(25);
      controller.abort();
      await expect(pending).rejects.toThrow();
      const listed = await client.callTool({
        name: "portal_tools",
        arguments: {},
      });
      expect(listed).toMatchObject({ structuredContent: { mode: "direct" } });
    } finally {
      await client.close();
    }
  });

  test("retires a timed-out bound invocation so a retry cannot queue a second call", async () => {
    const socket = join(tmpdir(), `p-${process.pid}-${crypto.randomUUID().slice(0, 8)}.sock`);
    sockets.push(socket);
    const broker = TurnBroker.forSocket(socket);
    await broker.listen();
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["src/cli.ts", "mcp", "--broker-socket", socket],
      cwd: process.cwd(),
      stderr: "pipe",
    });
    const client = new Client({ name: "portal-bound-timeout-retry-test", version: "1.0.0" });
    try {
      await client.connect(transport);
      const token = await broker.register({
        cwd: process.cwd(),
        roots: [process.cwd()],
        writableRoots: [process.cwd()],
        sandboxPolicy: { type: "dangerFullAccess" },
        tools: [{
          name: "slow_side_effect",
          description: "A deliberately uncompleted fixture operation",
          parameters: { type: "object", additionalProperties: false },
        }],
      }, 200);
      const timedOut = await client.callTool({
        name: "portal_call",
        arguments: {
          turn_token: token,
          wire_name: "slow_side_effect",
          arguments: {},
        },
      });
      expect(timedOut).toMatchObject({
        isError: true,
        structuredContent: {
          mode: "bound",
          code: "codex_tool_timeout",
          started: "unknown",
          retryable: false,
        },
      });
      const retry = await client.callTool({
        name: "portal_call",
        arguments: {
          turn_token: token,
          wire_name: "slow_side_effect",
          arguments: {},
        },
      });
      expect(retry.isError).toBe(true);
      await expect(broker.nextToolBatch(token, AbortSignal.timeout(25))).rejects.toThrow();
    } finally {
      await client.close();
    }
  });
});
