import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, it } from "node:test";
import { harvestCodexSession, parseCodexSession } from "./harvest.ts";
import { renderCodexRunView } from "./view.ts";
import { readText, writeJson, writeText } from "../project.ts";

const execFileAsync = promisify(execFile);

describe("Codex session harvest", () => {
  it("normalizes a Codex session JSONL into turns and final text", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-codex-session-"));
    const sessionPath = path.join(root, "rollout-2026-06-06T00-00-00-thread-123.jsonl");
    await writeFixtureSession(sessionPath, root);

    const session = await parseCodexSession(sessionPath);

    assert.equal(session.meta.id, "thread-123");
    assert.equal(session.meta.cwd, root);
    assert.match(session.finalText, /meta_skill_child_result/);
    assert.deepEqual(
      session.turns.map((turn) => [turn.role, turn.item_type, turn.tool_call_name, turn.final_answer]),
      [
        ["user", "message", null, false],
        ["assistant", "message", null, false],
        ["assistant", "function_call", "exec_command", false],
        ["tool", "function_call_output", "call-tool", false],
        ["assistant", "message", null, true]
      ]
    );
    assert.equal(session.turns[2].tool_call_arguments && typeof session.turns[2].tool_call_arguments, "object");
    assert.match(session.turns[3].tool_output_summary || "", /command output/);
  });

  it("writes attempt evidence and parsed child result beside existing run evidence", async () => {
    const project = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-project-"));
    const worktree = await fixtureGitCheckout();
    const sessionPath = path.join(project, "rollout-2026-06-06T00-00-00-thread-123.jsonl");
    await writeFixtureSession(sessionPath, worktree);

    const result = await harvestCodexSession({
      project,
      sessionPath,
      runId: "001-codex-parent-demo",
      attemptId: "attempt-a",
      evalId: "demo-eval",
      parentThreadId: "parent-001",
      parentReview: "Parent saw enough evidence to keep iterating."
    });

    const attemptRoot = result.attemptRoot;
    const manifest = JSON.parse(await readText(path.join(attemptRoot, "manifest.json")));
    assert.equal(manifest.parent_decision, "partial");
    assert.equal(manifest.child_result_path, "child-result.json");
    assert.match(await readText(path.join(attemptRoot, "turns.jsonl")), /meta_skill_child_result/);
    assert.match(await readText(path.join(attemptRoot, "transcript.md")), /## assistant final/);
    assert.match(await readText(path.join(attemptRoot, "final.md")), /meta_skill_child_result/);
    assert.match(await readText(path.join(attemptRoot, "child-result.json")), /recommended_next_action/);
    assert.match(await readText(path.join(attemptRoot, "parent-summary.md")), /Decision recommendation: partial/);
    assert.match(await readText(path.join(attemptRoot, "worktree.json")), /changed.txt/);
    assert.match(await readText(path.join(attemptRoot, "git-status.txt")), /changed.txt/);
    assert.match(await readText(path.join(attemptRoot, "diff.patch")), /new evidence/);
    assert.match(await readText(path.join(attemptRoot, "visible-files.txt")), /changed.txt/);
    assert.match(await readText(path.join(attemptRoot, "parent-review.md")), /keep iterating/);
    assert.equal(await exists(path.join(attemptRoot, "rpc.jsonl")), false);

    const run = JSON.parse(await readText(path.join(project, ".meta-skill", "runs", "001-codex-parent-demo", "run.json")));
    assert.equal(run.attempts[0].attempt_id, "attempt-a");
    assert.equal(run.attempts[0].child_decision_recommendation, "partial");

    const view = await renderCodexRunView(project, "001-codex-parent-demo");
    assert.match(view, /Attempt: attempt-a/);
    assert.match(view, /Child thread: thread-123/);
    assert.match(view, /focused tests passed/);
  });

  it("can locate a session by thread id under a Codex sessions root", async () => {
    const project = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-project-"));
    const sessionRoot = path.join(project, "sessions", "2026", "06", "06");
    const sessionPath = path.join(sessionRoot, "rollout-2026-06-06T00-00-00-thread-abc.jsonl");
    await writeFixtureSession(sessionPath, project, "thread-abc");

    const result = await harvestCodexSession({
      project,
      sessionRoot: path.join(project, "sessions"),
      threadId: "thread-abc",
      runId: "001-thread-id",
      attemptId: "thread-abc"
    });

    assert.equal(JSON.parse(await readText(result.manifestPath)).thread_id, "thread-abc");
  });
});

async function writeFixtureSession(sessionPath: string, cwd: string, threadId = "thread-123"): Promise<void> {
  const turnId = "turn-1";
  const finalAnswer = `{
  "meta_skill_child_result": {
    "run_id": "001-codex-parent-demo",
    "attempt_id": "attempt-a",
    "status": "completed",
    "decision_recommendation": "partial",
    "changed_files": ["plugins/meta-skill/src/codex-session/harvest.ts", "plugins/meta-skill/src/codex-session/child-result.ts"],
    "validation": [{"command": "node --test src/codex-session/*.test.ts", "outcome": "passed", "notes": "focused tests passed"}],
    "evidence_paths": [".meta-skill/runs/001-codex-parent-demo/attempts/attempt-a"],
    "risks": ["fixture session only"],
    "recommended_next_action": "inspect the harvested parent summary"
  }
}

Human summary from child.`;
  const lines = [
    {
      timestamp: "2026-06-06T00:00:00.000Z",
      type: "session_meta",
      payload: { id: threadId, timestamp: "2026-06-06T00:00:00.000Z", cwd, model_provider: "openai" }
    },
    {
      timestamp: "2026-06-06T00:00:01.000Z",
      type: "turn_context",
      payload: { turn_id: turnId, cwd, model: "gpt-5.5", effort: "medium" }
    },
    {
      timestamp: "2026-06-06T00:00:02.000Z",
      type: "response_item",
      payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Please inspect this fixture." }] }
    },
    {
      timestamp: "2026-06-06T00:00:03.000Z",
      type: "response_item",
      payload: { type: "message", role: "assistant", content: [{ type: "output_text", text: "I will inspect the fixture." }], phase: "commentary" }
    },
    {
      timestamp: "2026-06-06T00:00:04.000Z",
      type: "response_item",
      payload: { type: "function_call", name: "exec_command", arguments: JSON.stringify({ cmd: "cat changed.txt" }), call_id: "call-tool" }
    },
    {
      timestamp: "2026-06-06T00:00:05.000Z",
      type: "response_item",
      payload: { type: "function_call_output", call_id: "call-tool", output: "command output\nnew evidence\n" }
    },
    {
      timestamp: "2026-06-06T00:00:06.000Z",
      type: "response_item",
      payload: { type: "message", role: "assistant", content: [{ type: "output_text", text: finalAnswer }], phase: "final_answer" }
    },
    {
      timestamp: "2026-06-06T00:00:07.000Z",
      type: "task_complete",
      payload: { turn_id: turnId, last_agent_message: finalAnswer }
    }
  ];
  await writeText(sessionPath, lines.map((line) => JSON.stringify(line)).join("\n"));
}

async function fixtureGitCheckout(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-git-"));
  await execFileAsync("git", ["init"], { cwd: root });
  await writeText(path.join(root, "changed.txt"), "old evidence\n");
  await execFileAsync("git", ["add", "changed.txt"], { cwd: root });
  await execFileAsync("git", ["-c", "user.name=Test User", "-c", "user.email=test@example.com", "commit", "-m", "seed"], { cwd: root });
  await writeText(path.join(root, "changed.txt"), "new evidence\n");
  await writeJson(path.join(root, "untracked.json"), { ok: true });
  return root;
}

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
