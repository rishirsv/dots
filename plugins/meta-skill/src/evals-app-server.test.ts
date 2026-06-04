import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { AppServerUnavailableError } from "./app-server/client";
import type { CaseRunInput, CaseRunResult } from "./app-server/runner";
import type { TokenUsage } from "./models";
import { importFeedback, judgeRun, listRunSummaries, openRun, runEval } from "./evals";
import { judgePassed } from "./eval/judge";
import { packageProject } from "./package";
import { exists, readJson, readText, writeJson, writeText } from "./project";
import { createSkill } from "./skills";
import { releaseProject } from "./versions";

type JsonlRow = Record<string, unknown> & { type?: string; payload?: Record<string, unknown> };

describe("App Server eval orchestration", () => {
  it("records read-only runner metadata and closes the case runner", async () => {
    const project = await fixtureProject("eval-app-server-metadata");
    await writeCase(project);
    let closed = false;
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      caseRunner: {
        async run(input) {
          const caseRoot = path.join(input.runRoot, "cases", input.case.folder);
          await fs.mkdir(caseRoot, { recursive: true });
            await writeText(path.join(caseRoot, "final.md"), "ok");
            await writeText(path.join(caseRoot, "rpc.jsonl"), "");
            await writeJson(path.join(caseRoot, "thread.json"), { schema_version: 1, thread_id: "thread", turn_ids: ["turn-1"], status: "completed" });
            await writeJson(path.join(caseRoot, "usage.json"), tokenUsageEvidence(1, 2, 3));
            return {
            execution_status: "completed",
            token_usage: tokenSummary(1, 2, 3),
            final_path: path.join(caseRoot, "final.md"),
            evidence_path: path.join("cases", input.case.folder)
          };
        },
        close() {
          closed = true;
        }
      }
    });

    assert.equal(result.ok, true);
    assert.equal(result.status, "completed");
    assert.equal(closed, true);
    const run = await readJson<{
      status: string;
      ok: boolean;
      failure_classifications: string[];
      runner: { sandbox: string; approval_policy: string; network_access: boolean; backend: string; protocol: string };
    }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.status, "completed");
    assert.equal(run.ok, true);
    assert.deepEqual(run.failure_classifications, []);
    assert.equal(run.runner.backend, "app_server");
    assert.equal(run.runner.protocol, "generated-ts");
    assert.equal(run.runner.sandbox, "read-only");
    assert.equal(run.runner.approval_policy, "never");
    assert.equal(run.runner.network_access, false);
    const tests = await readText(path.join(result.runRoot, "tests.jsonl"));
    assert.match(tests, /"type":"lint_skipped"/);
    const completed = (await readJsonl(path.join(result.runRoot, "events.jsonl"))).find((row) => row.type === "run_completed");
    assert.equal(completed?.payload?.status, "completed");
    assert.deepEqual(completed?.payload?.failure_classifications, []);
    const normalized = await readJson<{ summary: { run_id: string; status: string; no_verdict_count: number }; cases: Array<{ attempts: Array<{ final_preview: string }> }>; tests: JsonlRow[]; readiness: { status: string; summary: string } }>(result.report);
    assert.equal(normalized.summary.run_id, result.runId);
    assert.equal(normalized.summary.status, "completed");
    assert.equal(normalized.summary.no_verdict_count, 1);
    assert.equal(normalized.cases.length, 1);
    assert.equal(normalized.readiness.status, "unknown");
    assert.match(normalized.readiness.summary, /no behavioral verdict recorded/);
    assert.match(normalized.cases[0]?.attempts[0]?.final_preview || "", /Fixture final|ok/);
    assert.equal(normalized.tests.some((row) => row.type === "lint_skipped"), true);
    const index = await readJson<{ runs: Array<{ run_id: string; status: string; readiness_status: string }> }>(path.join(path.dirname(result.runRoot), "index.json"));
    assert.deepEqual(index.runs.map((row) => [row.run_id, row.status, row.readiness_status]), [[result.runId, "completed", "unknown"]]);
    const opened = await openRun(project, result.runId);
    assert.equal(opened.data.summary.run_id, result.runId);
    const listed = await listRunSummaries(project);
    assert.equal(listed.at(-1)?.run_id, result.runId);
  });

  it("classifies App Server case failures without reporting a false green", async () => {
    const project = await fixtureProject("eval-app-server-failure");
    await writeCase(project);
    let closed = false;
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      caseRunner: {
        async run() {
          throw new AppServerUnavailableError("App Server process exited");
        },
        close() {
          closed = true;
        }
      }
    });

    assert.equal(result.ok, false);
    assert.equal(closed, true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "R1-basic", "final.md")), false);
    const run = await readJson<{ status: string; ok: boolean; failure_classifications: string[] }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.status, "failed");
    assert.equal(run.ok, false);
    assert.deepEqual(run.failure_classifications, ["app_server_unavailable"]);
    const results = await readJsonl(path.join(result.runRoot, "results.jsonl"));
    assert.equal(results[0]?.payload?.execution_status, "errored");
    assert.equal(results[0]?.payload?.failure_classification, "app_server_unavailable");
    const events = await readText(path.join(result.runRoot, "events.jsonl"));
    assert.match(events, /"type":"case_failed"/);
    assert.match(events, /"failure_classification":"app_server_unavailable"/);
    const usage = await readJson<{ total_tokens: number | null; unavailable_reason: string | null }>(path.join(result.runRoot, "cases", "R1-basic", "usage.json"));
    assert.equal(usage.total_tokens, null);
    assert.equal(usage.unavailable_reason, "App Server execution failed before token metrics were available.");
  });

  it("classifies failed case results separately from harness failures", async () => {
    const project = await fixtureProject("eval-case-failed");
    await writeCase(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      caseRunner: caseRunner("failed", "Case assertions failed.")
    });

    assert.equal(result.ok, false);
    const run = await readJson<{ status: string; failure_classifications: string[] }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.status, "failed");
    assert.deepEqual(run.failure_classifications, ["case_failed"]);
    const results = await readJsonl(path.join(result.runRoot, "results.jsonl"));
    assert.equal(results[0]?.payload?.execution_status, "completed");
    assert.equal(results[0]?.payload?.verdict, "failed");
    assert.equal(results[0]?.payload?.failure_classification, "case_failed");
    assert.equal(results[0]?.payload?.error, "Case assertions failed.");
  });

  it("runs unassisted cases without attaching a skill", async () => {
    const project = await fixtureProject("eval-no-skill");
    await writeCase(project);
    let sawNoSkill = false;
    const result = await runEval({
      project,
      selector: {},
      runSource: "no_skill",
      noLint: true,
      caseRunner: {
        async run(input) {
          sawNoSkill = input.skill_activation === "none" && !input.skillRoot && input.runSource.kind === "no_skill";
          const caseRoot = path.join(input.runRoot, "cases", input.case.folder);
          await fs.mkdir(caseRoot, { recursive: true });
          await writeText(path.join(caseRoot, "final.md"), "Unassisted final.");
          await writeText(path.join(caseRoot, "rpc.jsonl"), "");
          await writeJson(path.join(caseRoot, "thread.json"), { schema_version: 1, thread_id: "thread", turn_ids: ["turn"], status: "completed" });
          await writeJson(path.join(caseRoot, "usage.json"), tokenUsageEvidence(1, 1, 2));
          return {
            execution_status: "completed",
            token_usage: tokenSummary(1, 1, 2),
            final_path: path.join(caseRoot, "final.md"),
            evidence_path: path.join("cases", input.case.folder)
          };
        },
        close() {}
      }
    });

    assert.equal(result.ok, true);
    assert.equal(sawNoSkill, true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "R1-basic", "stage")), false);
    const run = await readJson<{ run_source: { kind: string; skill_activation: string } }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.run_source.kind, "no_skill");
    assert.equal(run.run_source.skill_activation, "none");
  });

  it("marks runs failed when deterministic checks or judges fail", async () => {
    const project = await fixtureProject("eval-failure-status");
    await writeCase(project);
    await writeJson(path.join(project, ".meta-skill", "tests", "manifest.json"), {
      schema_version: 1,
      tests: [{ id: "failing-eval", kind: "eval", command: "node -e \"process.exit(1)\"" }]
    });

    const result = await runEval({
      project,
      selector: {},
      withJudges: true,
      caseRunner: caseRunner("passed"),
      async judgeRunner() {
        return { annotations: 1, ok: false, failureClassifications: ["judge_failure"] };
      }
    });

    assert.equal(result.ok, false);
    const run = await readJson<{ status: string; ok: boolean; failure_classifications: string[] }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.status, "failed");
    assert.equal(run.ok, false);
    assert.deepEqual(run.failure_classifications, ["judge_failure", "lint_test_failure"]);
    const tests = await readText(path.join(result.runRoot, "tests.jsonl"));
    assert.match(tests, /"status":"failed"/);
    const report = await readText(result.report);
    assert.match(report, /lint_test_failure/);
    assert.match(report, /judge_failure/);
  });

  it("enforces judge thresholds before trusting pass and refreshes normalized reports", async () => {
    const project = await fixtureProject("eval-judge-threshold");
    await writeCase(project, {
      judges: [{ id: "final-answer-quality", threshold: { overall_min: 4 } }]
    });
    await writeText(
      path.join(project, ".meta-skill", "evals", "judges", "final-answer-quality.md"),
      `---\nid: final-answer-quality\ntype: rubric\nscale: 1-5\n---\n\n# Final Answer Quality\n\n## Output\n\nReturn JSON.\n\n## Calibration Example\n\nGood output scores 5.\n`
    );

    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      caseRunner: caseRunner("passed")
    });
    await writeCase(project, { judges: [{ id: "final-answer-quality", threshold: { overall_min: 1 } }], expectedBehavior: "Changed after the run.", assertion: "Changed." });

    const judged = await judgeRun({
      project,
      runId: result.runId,
      allJudges: true,
      allCases: true,
      async judgeExecutor() {
        return { overall: 3, pass: true, rationale: "Looks okay.", dimensions: {} };
      }
    });

    assert.equal(judged.ok, false);
    assert.deepEqual(judged.failureClassifications, ["judge_failure"]);
    assert.equal(judgePassed({ overall: 3, pass: true }, { overall_min: 4 }), false);
    const grades = await readJsonl(path.join(result.runRoot, "grades.jsonl"));
    assert.equal(grades.at(-1)?.payload?.status, "failed");
    assert.equal((grades.at(-1)?.payload?.threshold as { overall_min?: number })?.overall_min, 4);
    assert.equal(grades.at(-1)?.payload?.evidence_basis, "run_snapshot");
    const normalized = await readJson<{ summary: { assessment_status: string; failure_classifications: string[] }; judges: JsonlRow[]; readiness: { status: string } }>(path.join(result.runRoot, "report.json"));
    assert.equal(normalized.summary.assessment_status, "failed");
    assert.deepEqual(normalized.summary.failure_classifications, ["judge_failure"]);
    assert.equal(normalized.judges.at(-1)?.payload?.status, "failed");
    assert.equal(normalized.readiness.status, "blocked");
    const report = await readText(result.report);
    assert.match(report, /judge_failure/);
  });

  it("refreshes normalized report and run index after feedback import", async () => {
    const project = await fixtureProject("eval-feedback-refresh");
    await writeCase(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      caseRunner: caseRunner("passed")
    });
    const feedback = path.join(path.dirname(project), "feedback.jsonl");
    await writeText(feedback, JSON.stringify({ case_id: "R1", source: "reviewer", label: "fail", note: "Missing source grounding." }));

    const imported = await importFeedback(project, result.runId, feedback);

    assert.equal(imported.rows, 1);
    const normalized = await readJson<{ feedback: JsonlRow[] }>(path.join(result.runRoot, "report.json"));
    assert.equal(normalized.feedback.length, 1);
    assert.equal(normalized.feedback[0].payload?.label, "fail");
    const index = await readJson<{ runs: Array<{ run_id: string }> }>(path.join(path.dirname(result.runRoot), "index.json"));
    assert.equal(index.runs.some((row) => row.run_id === result.runId), true);
  });

  it("passes run-scoped environment variables to eval tests", async () => {
    const project = await fixtureProject("eval-env-vars");
    await writeCase(project);
    await writeJson(path.join(project, ".meta-skill", "tests", "manifest.json"), {
      schema_version: 1,
      tests: [
        {
          id: "run-env",
          kind: "eval",
          command:
            "node -e \"const fs=require('fs'); const path=require('path'); if (!process.env.META_SKILL_RUN_ID || !process.env.META_SKILL_RUN_ROOT || !process.env.META_SKILL_PROJECT_ROOT) process.exit(1); fs.writeFileSync(path.join(process.env.META_SKILL_RUN_ROOT, 'env-proof.json'), JSON.stringify({runId: process.env.META_SKILL_RUN_ID, projectRoot: process.env.META_SKILL_PROJECT_ROOT}));\""
        }
      ]
    });

    const result = await runEval({
      project,
      selector: {},
      caseRunner: caseRunner("passed")
    });

    assert.equal(result.ok, true);
    const proof = await readJson<{ runId: string; projectRoot: string }>(path.join(result.runRoot, "env-proof.json"));
    assert.equal(proof.runId, result.runId);
    assert.equal(proof.projectRoot, project);
  });

  it("runs a saved snapshot payload and packages it without packaging .meta-skill", async () => {
    const project = await fixtureProject("snapshot-e2e");
    await writeCase(project);
    const release = await releaseProject(project);
    assert.equal(await exists(path.join(release.releaseRoot, "skill", ".meta-skill")), false);

    const result = await runEval({
      project,
      selector: {},
      runSource: "snapshot_payload",
      noLint: true,
      caseRunner: caseRunner("passed")
    });

    assert.equal(result.ok, true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "R1-basic", "final.md")), true);
    const run = await readJson<{ run_source: { kind: string; label: string } }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.run_source.kind, "snapshot_payload");
    assert.equal(run.run_source.label, "Saved snapshot payload");
    const outDir = path.join(path.dirname(project), "release-pkg");
    const packaged = await packageProject({ project, source: "release", outDir });
    assert.equal(await exists(path.join(packaged.artifact, "SKILL.md")), true);
    assert.equal(await exists(path.join(packaged.artifact, ".meta-skill")), false);
  });
});

function caseRunner(verdict: CaseRunResult["verdict"], error?: string) {
  return {
    async run(input: CaseRunInput): Promise<CaseRunResult> {
      const caseRoot = path.join(input.runRoot, "cases", input.case.folder);
      await fs.mkdir(caseRoot, { recursive: true });
      await writeText(path.join(caseRoot, "final.md"), "Fixture final.");
      await writeText(path.join(caseRoot, "turns.jsonl"), "");
      await writeJson(path.join(caseRoot, "thread.json"), { schema_version: 1, thread_id: "fixture", turn_ids: ["turn"], status: "completed" });
      await writeText(path.join(caseRoot, "rpc.jsonl"), "");
      await writeJson(path.join(caseRoot, "usage.json"), tokenUsageEvidence(1, 1, 2));
      return {
        execution_status: "completed",
        ...(verdict ? { verdict } : {}),
        token_usage: tokenSummary(1, 1, 2),
        final_path: path.join(caseRoot, "final.md"),
        evidence_path: path.join("cases", input.case.folder),
        error
      };
    },
    close() {}
  };
}

function tokenSummary(input: number, output: number, total: number): TokenUsage {
  return {
    input_tokens: input,
    output_tokens: output,
    total_tokens: total,
    cached_input_tokens: null,
    reasoning_tokens: null,
    model_context_window: null,
    unavailable_reason: null
  };
}

function tokenUsageEvidence(input: number, output: number, total: number) {
  return tokenSummary(input, output, total);
}

async function fixtureProject(slug: string): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-eval-"));
  const project = path.join(root, slug);
  await createSkill({
    target: project,
    slug,
    description: `Use when testing ${slug}; not for publishing.`,
    project: true
  });
  return project;
}

async function writeCase(
  project: string,
  options: {
    judges?: Array<{
      id: string;
      threshold?: {
        overall_min?: number;
        dimensions?: Record<string, number>;
      };
    }>;
    expectedBehavior?: string;
    assertion?: string;
  } = {}
): Promise<void> {
  const item = path.join(project, ".meta-skill", "evals", "cases", "R1-basic");
  await fs.mkdir(item, { recursive: true });
  await writeText(
    path.join(item, "case.md"),
    `---
title: Basic behavior
topics:
  - smoke
criteria:
  what_it_tests: Basic behavior
  expected_behavior: ${options.expectedBehavior || "The skill should answer directly."}
  assertions:
    - ${options.assertion || "Answers directly."}
  tests: []
  judges:${(options.judges || []).length ? `\n${(options.judges || []).map((judge) => `    - id: ${judge.id}${judge.threshold?.overall_min !== undefined ? `\n      threshold:\n        overall_min: ${judge.threshold.overall_min}` : ""}`).join("\n")}` : " []"}
---

## Task

Do the eval task.
`
  );
}

async function readJsonl(target: string): Promise<JsonlRow[]> {
  return (await readText(target))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}
