import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectTurnEvidence, summarizeTurnEvidence, type TurnEvidence } from "./turn-evidence.ts";

describe("collectTurnEvidence", () => {
  it("collects final text, completion, and token usage for the selected turn", () => {
    const turn = collectTurnEvidence(
      [
        event("item/agentMessage/delta", { threadId: "wrong", turnId: "turn-1", delta: "ignore" }),
        event("item/agentMessage/delta", { threadId: "thread-1", turnId: "wrong", delta: "ignore" }),
        event("item/agentMessage/delta", { threadId: "thread-1", turnId: "turn-1", delta: "hello " }),
        event("item/agentMessage/delta", { threadId: "thread-1", turnId: "turn-1", delta: "world" }),
        event("thread/tokenUsage/updated", {
          threadId: "thread-1",
          turnId: "turn-1",
          tokenUsage: { total: { inputTokens: 3, outputTokens: 4, totalTokens: 7, cachedInputTokens: 1, reasoningOutputTokens: 2 } },
          modelContextWindow: 100
        }),
        event("turn/completed", { threadId: "thread-1", turn: { id: "turn-1", status: "completed" } })
      ],
      { threadId: "thread-1", turnId: "turn-1" }
    );

    assert.equal(turn.finalText, "hello world");
    assert.equal(turn.status, "completed");
    assert.equal(turn.tokenUsage.total_tokens, 7);
    assert.equal(turn.tokenUsage.cached_input_tokens, 1);
    assert.equal(turn.tokenUsage.reasoning_tokens, 2);
  });

  it("uses completed agent message text when observed", () => {
    const turn = collectTurnEvidence(
      [
        event("item/agentMessage/delta", { threadId: "thread-1", turnId: "turn-1", delta: "draft" }),
        event("item/completed", { threadId: "thread-1", turnId: "turn-1", item: { id: "msg-1", type: "agentMessage", text: "final" } })
      ],
      { threadId: "thread-1", turnId: "turn-1" }
    );

    assert.equal(turn.finalText, "final");
    assert.deepEqual(turn.items.map((item) => item.type), ["agentMessage"]);
  });

  it("requires explicit matching thread and turn attribution", () => {
    const turn = collectTurnEvidence(
      [
        event("item/agentMessage/delta", { threadId: "thread-1", delta: "missing turn final" }),
        event("item/agentMessage/delta", { turnId: "turn-1", delta: "missing thread final" }),
        event("item/agentMessage/delta", { threadId: "thread-2", turnId: "turn-1", delta: "wrong thread final" }),
        event("item/agentMessage/delta", { threadId: "thread-1", turnId: "turn-2", delta: "wrong turn final" }),
        event("item/agentMessage/delta", { threadId: "thread-1", turnId: "turn-1", delta: "selected final" }),
        event("thread/tokenUsage/updated", { threadId: "thread-1", tokenUsage: { total: { inputTokens: 99, outputTokens: 99, totalTokens: 198 } } }),
        event("thread/tokenUsage/updated", { threadId: "thread-1", turnId: "turn-2", tokenUsage: { total: { inputTokens: 50, outputTokens: 50, totalTokens: 100 } } }),
        event("thread/tokenUsage/updated", { threadId: "thread-1", turnId: "turn-1", tokenUsage: { total: { inputTokens: 1, outputTokens: 2, totalTokens: 3 } } }),
        event("item/completed", { threadId: "thread-1", item: { id: "missing-turn-item", type: "commandExecution", command: "missing" } }),
        event("item/completed", { threadId: "thread-1", turnId: "turn-2", item: { id: "wrong-turn-item", type: "commandExecution", command: "wrong" } }),
        trace("server", { id: "wrong-approval", method: "item/commandExecution/requestApproval", params: { threadId: "thread-1", turnId: "turn-2", itemId: "cmd-wrong", approvalId: "approval-wrong", command: ["wrong"] } }),
        trace("client", { id: "wrong-approval", result: { decision: "approved" } }),
        trace("server", { id: "selected-approval", method: "item/commandExecution/requestApproval", params: { threadId: "thread-1", turnId: "turn-1", itemId: "cmd-1", approvalId: "approval-1", command: ["ok"] } }),
        trace("client", { id: "selected-approval", result: { decision: "approved" } }),
        event("item/completed", { threadId: "thread-1", turnId: "turn-1", item: { id: "selected-item", type: "commandExecution", command: "ok", aggregatedOutput: "done" } }),
        event("item/newFamily/delta", { threadId: "thread-1", value: true }),
        event("turn/completed", { threadId: "thread-1", turn: { id: "turn-2", status: "wrong-turn" } }),
        event("turn/completed", { threadId: "thread-1", status: "missing-turn" }),
        event("turn/completed", { threadId: "thread-1", turn: { id: "turn-1", status: "completed" } })
      ],
      { threadId: "thread-1", turnId: "turn-1" }
    );

    assert.equal(turn.finalText, "selected final");
    assert.equal(turn.status, "completed");
    assert.equal(turn.tokenUsage.total_tokens, 3);
    assert.deepEqual(turn.items.map((item) => item.id), ["selected-item"]);
    assert.deepEqual(turn.approvals.map((approval) => approval.requestId), ["selected-approval"]);
    assert.deepEqual(turn.unknownMethods, []);
  });

  it("records unavailable token evidence when the token event is missing", () => {
    const turn = collectTurnEvidence([event("turn/completed", { threadId: "thread-1", turn: { id: "turn-1" } })], { threadId: "thread-1", turnId: "turn-1" });

    assert.equal(turn.tokenUsage.total_tokens, null);
    assert.match(turn.tokenUsage.unavailable_reason || "", /without tokenUsage\.total/);
  });

  it("captures command, file, and tool item lifecycles", () => {
    const turn = collectTurnEvidence(
      [
        event("item/started", { threadId: "thread-1", turnId: "turn-1", item: { id: "cmd-1", type: "commandExecution", command: "ls", cwd: "/tmp", status: "running" } }),
        event("item/commandExecution/outputDelta", { threadId: "thread-1", turnId: "turn-1", itemId: "cmd-1", delta: "a.txt\n" }),
        event("item/completed", { threadId: "thread-1", turnId: "turn-1", item: { id: "cmd-1", type: "commandExecution", command: "ls", cwd: "/tmp", aggregatedOutput: "a.txt\n", exitCode: 0, durationMs: 12, status: "completed" } }),
        event("item/completed", { threadId: "thread-1", turnId: "turn-1", item: { id: "file-1", type: "fileChange", status: "completed", changes: [{ path: "a.txt", kind: "create" }] } }),
        event("item/completed", { threadId: "thread-1", turnId: "turn-1", item: { id: "tool-1", type: "mcpToolCall", server: "demo", tool: "lookup", arguments: { q: "x" }, result: { ok: true }, status: "completed" } })
      ],
      { threadId: "thread-1", turnId: "turn-1" }
    );

    const command = turn.items.find((item) => item.type === "commandExecution");
    assert.equal(command?.command, "ls");
    assert.equal(command?.output, "a.txt\n");
    assert.equal(command?.exitCode, 0);
    assert.equal(turn.items.find((item) => item.type === "fileChange")?.changes?.length, 1);
    assert.equal(turn.items.find((item) => item.type === "mcpToolCall")?.tool, "lookup");
  });

  it("captures approval request and resolution lifecycle from raw JSON-RPC direction", () => {
    const turn = collectTurnEvidence(
      [
        trace("server", { id: "approval-req-1", method: "item/commandExecution/requestApproval", params: { threadId: "thread-1", turnId: "turn-1", itemId: "cmd-1", approvalId: "approval-1", command: ["rm", "x"], cwd: "/tmp" } }),
        trace("client", { id: "approval-req-1", result: { decision: "approved" } }),
        trace("server", { method: "serverRequest/resolved", params: { threadId: "thread-1", turnId: "turn-1", requestId: "approval-req-1" } })
      ],
      { threadId: "thread-1", turnId: "turn-1" }
    );

    assert.equal(turn.approvals.length, 1);
    assert.equal(turn.approvals[0].status, "resolved");
    assert.equal(turn.approvals[0].sandboxRelevant, true);
  });

  it("preserves unknown observed App Server methods", () => {
    const turn = collectTurnEvidence([event("item/newFamily/delta", { threadId: "thread-1", turnId: "turn-1", value: true })], { threadId: "thread-1", turnId: "turn-1" });

    assert.deepEqual(turn.unknownMethods, ["item/newFamily/delta"]);
  });

  it("summarizes turn evidence without writing another fact file", () => {
    const turnEvidence: TurnEvidence = {
      source: "codex_app_server",
      threadId: "thread-1",
      turns: [
        {
          threadId: "thread-1",
          turnId: "turn-1",
          status: "completed",
          finalText: "done",
          tokenUsage: { input_tokens: 1, output_tokens: 1, total_tokens: 2, unavailable_reason: null },
          items: [{ id: "cmd-1", type: "commandExecution" }],
          approvals: [],
          unknownMethods: []
        }
      ]
    };

    assert.deepEqual(summarizeTurnEvidence(turnEvidence), {
      turn_count: 1,
      item_count: 1,
      command_executions: 1,
      file_changes: 0,
      tool_calls: 0,
      approval_requests: 0,
      unknown_methods: []
    });
  });
});

function event(method: string, params: Record<string, unknown>): Record<string, unknown> {
  return { method, params };
}

function trace(direction: "client" | "server", message: Record<string, unknown>): Record<string, unknown> {
  return { direction, message };
}
