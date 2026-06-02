import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { AppServerJsonClient, appServerConfig, codexVersion } from "./client";

describe("live App Server smoke", () => {
  it("runs a managed stdio thread and turn", { skip: process.env.META_SKILL_LIVE_APP_SERVER !== "1" }, async (t) => {
    if (!(await codexVersion())) {
      t.skip("codex CLI is unavailable in this environment");
      return;
    }

    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-live-app-server-"));
    const trace: Array<{ direction: string; message: unknown }> = [];
    const client = new AppServerJsonClient((line) => {
      trace.push(line);
    });
    await client.connect(await appServerConfig());
    let contractStarted = false;
    try {
      try {
        const auth = await client.request("getAuthStatus", { includeToken: false, refreshToken: false });
        if ((auth as { requiresOpenaiAuth?: boolean }).requiresOpenaiAuth === true || (auth as { authMethod?: unknown }).authMethod == null) {
          t.skip("codex app-server is unauthenticated");
          return;
        }
      } catch (error) {
        t.diagnostic(error instanceof Error ? error.message : String(error));
        t.skip("codex app-server auth preflight is unavailable");
        return;
      }

      const start = await client.request("thread/start", {
        cwd,
        runtimeWorkspaceRoots: [cwd],
        approvalPolicy: "never",
        sandbox: "read-only",
        experimentalRawEvents: true,
        persistExtendedHistory: false,
        ephemeral: true
      });
      const threadId = (start.thread as { id?: string } | undefined)?.id;
      assert.equal(typeof threadId, "string");
      contractStarted = true;

      const mark = client.eventCount();
      const turn = await client.request("turn/start", {
        threadId,
        input: [{ type: "text", text: "Reply exactly: OK", text_elements: [] }],
        cwd,
        runtimeWorkspaceRoots: [cwd],
        approvalPolicy: "never",
        sandboxPolicy: { type: "readOnly", networkAccess: false }
      });
      const turnId = (turn.turn as { id?: string } | undefined)?.id;
      assert.equal(typeof turnId, "string");
      await client.waitFor((message) => message.method === "turn/completed" && (message.params as { threadId?: string; turn?: { id?: string } } | undefined)?.threadId === threadId && (message.params as { turn?: { id?: string } } | undefined)?.turn?.id === turnId, 120000);
      const events = client.eventsSince(mark);

      assert.equal(events.some((message) => message.method === "item/agentMessage/delta" && (message.params as { turnId?: string } | undefined)?.turnId === turnId), true);
      assert.equal(events.some((message) => message.method === "turn/completed"), true);
      assert.equal(trace.some((line) => line.direction === "client" && (line.message as { method?: string }).method === "initialized"), true);
      assert.equal(trace.some((line) => line.direction === "client" && (line.message as { method?: string; params?: { sandboxPolicy?: unknown } }).method === "turn/start"), true);

      const resume = await client.request("thread/resume", {
        threadId,
        excludeTurns: true,
        persistExtendedHistory: false,
        cwd,
        runtimeWorkspaceRoots: [cwd],
        approvalPolicy: "never",
        sandbox: "read-only"
      });
      assert.equal((resume.thread as { id?: string } | undefined)?.id, threadId);
    } finally {
      await client.flush();
      client.close();
    }
    assert.equal(contractStarted, true);
  });
});
