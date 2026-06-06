import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { describe, it } from "node:test";
import type { EvalRunInput, EvalRunResult } from "./app-server/runner.ts";
import type { TokenUsage } from "./models.ts";
import { runEval } from "./evals.ts";
import { createSkill } from "./skills.ts";
import { ensureDir, exists, readText, writeJson, writeText } from "./project.ts";

describe("eval evidence hard cut", () => {
  it("writes only the hard-cut per-eval evidence files", async () => {
    const project = await fixtureProject("fact-run");
    await writeEval(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      evalRunner: evalRunner()
    });

    assert.equal(await exists(path.join(result.runRoot, "facts.jsonl")), false);
    assert.equal(await exists(path.join(result.runRoot, "run.json")), false);
    assert.equal(await exists(path.join(result.runRoot, "summary.md")), false);
    assert.equal(await exists(path.join(result.runRoot, "payload", "SKILL.md")), true);
    assert.equal(await exists(path.join(result.runRoot, "payload", "skill-under-test.json")), false);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "task.md")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "criteria.json")), false);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "fixtures", "input.txt")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "rpc.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "transcript.json")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "response.md")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "scores.json")), false);

    assert.deepEqual(result.evals, ["basic"]);
    assert.equal(result.payload?.skill_md, "payload/SKILL.md");
    assert.equal(result.results[0].folder, "basic");
    assert.equal(result.results[0].criteria_path, path.join(".meta-skill", "evals", "basic", "criteria.json"));
    assert.match(result.results[0].criteria_sha256, /^[a-f0-9]{64}$/);
    assert.equal(result.results[0].scoring_status, "review_required");
    assert.equal(result.results[0].max_score, 3);
    const transcript = JSON.parse(await readText(path.join(result.runRoot, "cases", "basic", "transcript.json")));
    assert.equal((transcript.turns[0].tokenUsage as TokenUsage).total_tokens, 2);
  });

  it("runs a selected eval without parsing unrelated draft eval folders", async () => {
    const project = await fixtureProject("selected-run");
    await writeEval(project);
    await ensureDir(path.join(project, ".meta-skill", "evals", "draft-broken"));

    const result = await runEval({
      project,
      selector: { eval: ["basic"] },
      noLint: true,
      evalRunner: evalRunner()
    });

    assert.deepEqual(result.evals, ["basic"]);
    assert.equal(await exists(path.join(result.runRoot, "cases", "basic", "response.md")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "draft-broken")), false);
  });

  it("keeps parallel eval results ordered while isolating per-case runners and evidence", async () => {
    const project = await fixtureProject("parallel-run");
    await writeEval(project, "alpha");
    await writeEval(project, "beta");
    await writeEval(project, "gamma");
    const state = {
      active: 0,
      maxActive: 0,
      nextRunnerId: 0,
      runnerIdsByFolder: new Map<string, number>(),
      closedRunnerIds: [] as number[]
    };

    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      concurrency: 2,
      evalRunnerFactory: () => parallelEvalRunner(state)
    });

    assert.deepEqual(result.evals, ["alpha", "beta", "gamma"]);
    assert.deepEqual(result.results.map((item) => item.folder), ["alpha", "beta", "gamma"]);
    assert.equal(state.maxActive, 2);
    assert.equal(new Set(state.runnerIdsByFolder.values()).size, 3);
    assert.deepEqual(state.closedRunnerIds.sort((a, b) => a - b), [1, 2, 3]);
    for (const folder of ["alpha", "beta", "gamma"]) {
      const caseRoot = path.join(result.runRoot, "cases", folder);
      assert.equal((await readText(path.join(caseRoot, "fixtures", "input.txt"))).trimEnd(), `Fixture text for ${folder}.`);
      assert.match(await readText(path.join(caseRoot, "response.md")), new RegExp(`Runner ${state.runnerIdsByFolder.get(folder)} answered ${folder}`));
      assert.equal(result.results.find((item) => item.folder === folder)?.response_path, path.join("cases", folder, "response.md"));
    }
  });
});

function evalRunner() {
  return {
    async run(input: EvalRunInput): Promise<EvalRunResult> {
      const evalRoot = path.join(input.runRoot, "cases", input.eval.folder);
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
        evidence_path: path.join("cases", input.eval.folder),
        turn_ids: ["turn"]
      };
    },
    close() {}
  };
}

function parallelEvalRunner(state: { active: number; maxActive: number; nextRunnerId: number; runnerIdsByFolder: Map<string, number>; closedRunnerIds: number[] }) {
  const runnerId = ++state.nextRunnerId;
  return {
    async run(input: EvalRunInput): Promise<EvalRunResult> {
      state.active += 1;
      state.maxActive = Math.max(state.maxActive, state.active);
      state.runnerIdsByFolder.set(input.eval.folder, runnerId);
      try {
        const evalRoot = path.join(input.runRoot, "cases", input.eval.folder);
        assert.equal(input.eval.path, evalRoot);
        assert.equal((await readText(path.join(evalRoot, "fixtures", "input.txt"))).trimEnd(), `Fixture text for ${input.eval.folder}.`);
        await delay(input.eval.folder === "alpha" ? 40 : 1);
        await ensureDir(evalRoot);
        await writeText(path.join(evalRoot, "rpc.jsonl"), JSON.stringify({ direction: "server", message: { runnerId, folder: input.eval.folder } }));
        await writeText(
          path.join(evalRoot, "transcript.json"),
          `${JSON.stringify({
            source: "codex_app_server",
            threadId: `thread-${runnerId}`,
            turns: [
              {
                threadId: `thread-${runnerId}`,
                turnId: `turn-${runnerId}`,
                status: "completed",
                finalText: `Runner ${runnerId} answered ${input.eval.folder}.`,
                tokenUsage: tokenUsageEvidence(1, 1, 2),
                items: [],
                approvals: [],
                unknownMethods: []
              }
            ]
          })}\n`
        );
        await writeText(path.join(evalRoot, "response.md"), `Runner ${runnerId} answered ${input.eval.folder}.`);
        return {
          execution_status: "completed",
          token_usage: tokenUsageEvidence(1, 1, 2),
          response_path: path.join(evalRoot, "response.md"),
          rpc_path: path.join(evalRoot, "rpc.jsonl"),
          transcript_path: path.join(evalRoot, "transcript.json"),
          evidence_path: path.join("cases", input.eval.folder),
          turn_ids: [`turn-${runnerId}`]
        };
      } finally {
        state.active -= 1;
      }
    },
    close() {
      state.closedRunnerIds.push(runnerId);
    }
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

async function writeEval(project: string, folder = "basic"): Promise<void> {
  const evalRoot = path.join(project, ".meta-skill", "evals", folder);
  await ensureDir(evalRoot);
  await writeText(path.join(evalRoot, "fixtures", "input.txt"), `Fixture text for ${folder}.`);
  await writeText(
    path.join(evalRoot, "task.md"),
    `# ${folder}

## Problem Description

The user needs a direct answer.

## Output Specification

Return a concise direct answer.

## Task

Answer directly for ${folder}.
`
  );
  await writeJson(
    path.join(evalRoot, "criteria.json"),
    {
      fixtures: [{ path: "fixtures/input.txt", description: "Input text" }],
      tests: [],
      metadata: {},
      criteria: [
        { criterion: "Specific answer", phase: "Quality", dimension: "Specificity", question: "Is the response specific?", evidence: "response" },
        { criterion: "Answers directly", phase: "Implementation", dimension: "Actionability", question: "Does the response answer directly?", evidence: "response" },
        { criterion: "Valid structure", phase: "Validation", dimension: "Structural correctness", question: "Is the response structurally valid?", evidence: "response" }
      ]
    }
  );
}

function tokenUsageEvidence(input: number, output: number, total: number): TokenUsage {
  return { input_tokens: input, output_tokens: output, total_tokens: total, cached_input_tokens: null, reasoning_tokens: null, model_context_window: null, unavailable_reason: null };
}
