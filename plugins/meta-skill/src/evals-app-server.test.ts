import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import type { EvalRunInput, EvalRunResult } from "./app-server/runner.ts";
import type { TokenUsage } from "./models.ts";
import { runEval } from "./evals.ts";
import { createSkill } from "./skills.ts";
import { ensureDir, exists, readText, writeText } from "./project.ts";

describe("eval evidence hard cut", () => {
  it("writes only the hard-cut per-eval evidence files", async () => {
    const project = await fixtureProject("fact-run");
    await writeCase(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      evalRunner: evalRunner()
    });

    assert.equal(await exists(path.join(result.runRoot, "facts.jsonl")), false);
    assert.equal(await exists(path.join(result.runRoot, "payload", "SKILL.md")), true);
    assert.equal(await exists(path.join(result.runRoot, "evals", "R1-basic", "eval.md")), true);
    assert.equal(await exists(path.join(result.runRoot, "evals", "R1-basic", "rpc.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "evals", "R1-basic", "transcript.json")), true);
    assert.equal(await exists(path.join(result.runRoot, "evals", "R1-basic", "response.md")), true);

    assert.deepEqual(result.evals, ["R1-basic"]);
    const transcript = JSON.parse(await readText(path.join(result.runRoot, "evals", "R1-basic", "transcript.json")));
    assert.equal((transcript.turns[0].tokenUsage as TokenUsage).total_tokens, 2);
  });
});

function evalRunner() {
  return {
    async run(input: EvalRunInput): Promise<EvalRunResult> {
      const evalRoot = path.join(input.runRoot, "evals", input.eval.folder);
      await ensureDir(evalRoot);
      await writeText(path.join(evalRoot, "rpc.jsonl"), JSON.stringify({ direction: "server", message: { ok: true } }));
      await writeText(
        path.join(evalRoot, "transcript.json"),
        `${JSON.stringify({
          source: "codex_app_server",
          threadId: "thread",
          turns: [
            {
              threadId: "thread",
              turnId: "turn",
              status: "completed",
              finalText: "Final answer.",
              tokenUsage: tokenUsageEvidence(1, 1, 2),
              items: [],
              approvals: [],
              unknownMethods: []
            }
          ]
        })}\n`
      );
      await writeText(path.join(evalRoot, "response.md"), "Final answer.");
      return {
        execution_status: "completed",
        token_usage: tokenUsageEvidence(1, 1, 2),
        response_path: path.join(evalRoot, "response.md"),
        rpc_path: path.join(evalRoot, "rpc.jsonl"),
        transcript_path: path.join(evalRoot, "transcript.json"),
        evidence_path: path.join("evals", input.eval.folder),
        turn_ids: ["turn"]
      };
    },
    close() {}
  };
}

async function fixtureProject(slug: string): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-"));
  const target = path.join(root, slug);
  await createSkill({
    target,
    project: true,
    slug,
    title: slug,
    description: `Use when testing ${slug}; not for unrelated tasks.`,
    job: "Handle the task."
  });
  return target;
}

async function writeCase(project: string): Promise<void> {
  const evalRoot = path.join(project, ".meta-skill", "evals", "R1-basic");
  await ensureDir(evalRoot);
  await writeText(
    path.join(evalRoot, "eval.md"),
    `---
title: Basic
criteria:
  expected_behavior: Answer directly.
  assertions:
    - Answers.
  tests: []
---

## Task

Answer directly.
`
  );
}

function tokenUsageEvidence(input: number, output: number, total: number): TokenUsage {
  return { input_tokens: input, output_tokens: output, total_tokens: total, cached_input_tokens: null, reasoning_tokens: null, model_context_window: null, unavailable_reason: null };
}
