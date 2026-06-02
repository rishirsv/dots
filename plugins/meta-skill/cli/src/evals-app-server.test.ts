import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { AppServerUnavailableError } from "./app-server/client";
import type { ScenarioRunInput, ScenarioRunResult } from "./app-server/runner";
import { runEval } from "./evals";
import { packageProject } from "./package";
import { exists, readJson, readText, writeJson, writeText } from "./project";
import { createSkill } from "./skills";
import { releaseProject } from "./versions";

type JsonlRow = Record<string, unknown> & { type?: string; payload?: Record<string, unknown> };

describe("App Server eval orchestration", () => {
  it("records read-only runner metadata and closes the scenario runner", async () => {
    const project = await fixtureProject("eval-app-server-metadata");
    await writeScenario(project);
    let closed = false;
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      scenarioRunner: {
        async run(input) {
          const sideRoot = path.join(input.runRoot, "scenarios", input.scenario.folder, input.side);
          await fs.mkdir(sideRoot, { recursive: true });
          await writeText(path.join(sideRoot, "final.md"), "ok");
          await writeText(path.join(sideRoot, "rpc.jsonl"), "");
          await writeJson(path.join(sideRoot, "thread.json"), { schema_version: 1, thread_id: "thread", turn_ids: ["turn-1"], status: "completed" });
          return {
            status: "needs_review",
            token_usage: {
              input_tokens: { available: true, value: 1 },
              output_tokens: { available: true, value: 2 },
              total_tokens: { available: true, value: 3 }
            },
            final_path: path.join(sideRoot, "final.md"),
            evidence_path: path.join("scenarios", input.scenario.folder, input.side)
          };
        },
        close() {
          closed = true;
        }
      }
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, "needs_review");
    assert.equal(result.manualReviewRequired, true);
    assert.equal(closed, true);
    const run = await readJson<{
      status: string;
      ok: boolean;
      manual_review_required: boolean;
      failure_classifications: string[];
      runner: { sandbox: string; approval_policy: string; network_access: boolean; backend: string; protocol: string };
    }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.status, "needs_review");
    assert.equal(run.ok, false);
    assert.equal(run.manual_review_required, true);
    assert.deepEqual(run.failure_classifications, []);
    assert.equal(run.runner.backend, "app_server");
    assert.equal(run.runner.protocol, "generated-ts");
    assert.equal(run.runner.sandbox, "read-only");
    assert.equal(run.runner.approval_policy, "never");
    assert.equal(run.runner.network_access, false);
    const tests = await readText(path.join(result.runRoot, "tests.jsonl"));
    assert.match(tests, /"type":"lint_skipped"/);
    const completed = (await readJsonl(path.join(result.runRoot, "events.jsonl"))).find((row) => row.type === "run_completed");
    assert.equal(completed?.payload?.status, "needs_review");
    assert.equal(completed?.payload?.manual_review_required, true);
    assert.deepEqual(completed?.payload?.failure_classifications, []);
    const report = await readText(result.report);
    assert.match(report, /unresolved; not pass proof/);
    assert.match(report, /Fixture final|ok/);
    assert.match(report, /lint skipped/);
  });

  it("classifies App Server scenario failures without reporting a false green", async () => {
    const project = await fixtureProject("eval-app-server-failure");
    await writeScenario(project);
    let closed = false;
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      scenarioRunner: {
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
    assert.equal(await exists(path.join(result.runRoot, "scenarios", "R1-basic", "candidate")), false);
    const run = await readJson<{ status: string; ok: boolean; failure_classifications: string[] }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.status, "failed");
    assert.equal(run.ok, false);
    assert.deepEqual(run.failure_classifications, ["app_server_unavailable"]);
    const results = await readJsonl(path.join(result.runRoot, "results.jsonl"));
    assert.equal(results[0]?.payload?.status, "errored");
    assert.equal(results[0]?.payload?.failure_classification, "app_server_unavailable");
    const events = await readText(path.join(result.runRoot, "events.jsonl"));
    assert.match(events, /"type":"scenario_side_failed"/);
    assert.match(events, /"failure_classification":"app_server_unavailable"/);
    assert.match(events, /"available":false/);
  });

  it("classifies failed scenario results separately from harness failures", async () => {
    const project = await fixtureProject("eval-scenario-failed");
    await writeScenario(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      scenarioRunner: scenarioRunner("failed", "Scenario assertions failed.")
    });

    assert.equal(result.ok, false);
    const run = await readJson<{ status: string; failure_classifications: string[] }>(path.join(result.runRoot, "run.json"));
    assert.equal(run.status, "failed");
    assert.deepEqual(run.failure_classifications, ["scenario_failed"]);
    const results = await readJsonl(path.join(result.runRoot, "results.jsonl"));
    assert.equal(results[0]?.payload?.status, "failed");
    assert.equal(results[0]?.payload?.failure_classification, "scenario_failed");
    assert.equal(results[0]?.payload?.error, "Scenario assertions failed.");
  });

  it("marks runs failed when deterministic checks or judges fail", async () => {
    const project = await fixtureProject("eval-failure-status");
    await writeScenario(project);
    await writeJson(path.join(project, ".meta-skill", "tests", "manifest.json"), {
      schema_version: 1,
      tests: [{ id: "failing-eval", kind: "eval", command: "node -e \"process.exit(1)\"" }]
    });

    const result = await runEval({
      project,
      selector: {},
      withJudges: true,
      scenarioRunner: scenarioRunner("passed"),
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
    assert.match(report, /Judge Details/);
  });

  it("passes run-scoped environment variables to eval tests", async () => {
    const project = await fixtureProject("eval-env-vars");
    await writeScenario(project);
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
      scenarioRunner: scenarioRunner("passed")
    });

    assert.equal(result.ok, true);
    const proof = await readJson<{ runId: string; projectRoot: string }>(path.join(result.runRoot, "env-proof.json"));
    assert.equal(proof.runId, result.runId);
    assert.equal(proof.projectRoot, project);
  });

  it("covers release, release comparison, and release packaging without packaging .meta-skill", async () => {
    const project = await fixtureProject("release-e2e");
    await writeScenario(project);
    const release = await releaseProject(project);
    assert.equal(await exists(path.join(release.releaseRoot, "skill", ".meta-skill")), false);

    const result = await runEval({
      project,
      selector: {},
      compare: "release",
      noLint: true,
      scenarioRunner: scenarioRunner("passed")
    });

    assert.equal(result.ok, true);
    assert.equal(await exists(path.join(result.runRoot, "scenarios", "R1-basic", "candidate", "final.md")), true);
    assert.equal(await exists(path.join(result.runRoot, "scenarios", "R1-basic", "release", "final.md")), true);
    const outDir = path.join(path.dirname(project), "release-pkg");
    const packaged = await packageProject({ project, source: "release", outDir });
    assert.equal(await exists(path.join(packaged.artifact, "SKILL.md")), true);
    assert.equal(await exists(path.join(packaged.artifact, ".meta-skill")), false);
  });
});

function scenarioRunner(status: ScenarioRunResult["status"], error?: string) {
  return {
    async run(input: ScenarioRunInput): Promise<ScenarioRunResult> {
      const sideRoot = path.join(input.runRoot, "scenarios", input.scenario.folder, input.side);
      await fs.mkdir(path.join(sideRoot, "stage", "skill"), { recursive: true });
      await writeText(path.join(sideRoot, "stage", "skill", "SKILL.md"), "fixture");
      await writeText(path.join(sideRoot, "final.md"), "Fixture final.");
      await writeText(path.join(sideRoot, "turns.jsonl"), "");
      await writeJson(path.join(sideRoot, "thread.json"), { schema_version: 1, thread_id: "fixture", turn_ids: ["turn"], status: "completed" });
      await writeText(path.join(sideRoot, "rpc.jsonl"), "");
      return {
        status,
        token_usage: {
          input_tokens: { available: true, value: 1 },
          output_tokens: { available: true, value: 1 },
          total_tokens: { available: true, value: 2 }
        },
        final_path: path.join(sideRoot, "final.md"),
        evidence_path: path.join("scenarios", input.scenario.folder, input.side),
        error
      };
    },
    close() {}
  };
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

async function writeScenario(project: string): Promise<void> {
  const scenario = path.join(project, ".meta-skill", "evals", "scenarios", "R1-basic");
  await fs.mkdir(scenario, { recursive: true });
  await writeText(path.join(scenario, "task.md"), "Do the eval task.");
  await writeJson(path.join(scenario, "scenario.json"), {
    schema_version: 1,
    id: "R1",
    family: "regression",
    type: "behavior",
    title: "Basic behavior",
    topics: ["smoke"],
    include: [],
    setup: [],
    metadata: {}
  });
  await writeJson(path.join(scenario, "criteria.json"), {
    schema_version: 1,
    what_it_tests: "Basic behavior",
    expected_behavior: "The skill should answer directly.",
    assertions: ["Answers directly."],
    tests: [],
    judges: []
  });
}

async function readJsonl(target: string): Promise<JsonlRow[]> {
  return (await readText(target))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}
