import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import type { ScenarioRunInput, ScenarioRunResult } from "./app-server/runner";
import type { RunReport, TokenUsage } from "./models";
import { openRun, runEval } from "./evals";
import { buildRunReport, renderEvalReportHtml } from "./report";
import { buildMetaSkillReport, listRunSummariesForReport, renderReportMarkdown, renderRunListMarkdown } from "./reporting";
import { exists, writeJson, writeText } from "./project";
import { createSkill } from "./skills";

describe("central reporting service", () => {
  it("builds read-only project reports without materializing missing eval reports", async () => {
    const project = await fixtureProject("report-read-only");
    await writeScenario(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      scenarioRunner: scenarioRunner("passed")
    });
    await fs.rm(path.join(result.runRoot, "report.json"));
    await fs.rm(path.join(result.runRoot, "report.html"));
    await fs.rm(path.join(path.dirname(result.runRoot), "index.json"));

    const report = await buildMetaSkillReport({ project, view: "status", executeLint: false });

    assert.equal(report.summary.latest_run_id, result.runId);
    assert.equal(report.evidence.latest_eval_run?.report.summary.run_id, result.runId);
    assert.equal(await exists(path.join(result.runRoot, "report.json")), false);
    assert.equal(await exists(path.join(result.runRoot, "report.html")), false);
    assert.equal(await exists(path.join(path.dirname(result.runRoot), "index.json")), false);
  });

  it("keeps old eval open behavior as a shared-service materialized read", async () => {
    const project = await fixtureProject("report-open-compat");
    await writeScenario(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      scenarioRunner: scenarioRunner(undefined)
    });
    await fs.rm(path.join(result.runRoot, "report.json"));
    await fs.rm(path.join(result.runRoot, "report.html"));
    await fs.rm(path.join(path.dirname(result.runRoot), "index.json"));

    const opened = await openRun(project, result.runId);
    const rows = await listRunSummariesForReport(project, {}, "read");

    assert.equal(opened.data.summary.run_id, result.runId);
    assert.equal(await exists(path.join(result.runRoot, "report.json")), true);
    assert.equal(await exists(path.join(result.runRoot, "report.html")), true);
    assert.equal(rows.at(-1)?.run_id, result.runId);
  });

  it("renders status and eval views from the same report model", async () => {
    const project = await fixtureProject("report-render");
    await writeScenario(project);
    const result = await runEval({
      project,
      selector: {},
      noLint: true,
      scenarioRunner: scenarioRunner(undefined)
    });

    const report = await buildMetaSkillReport({ project, view: "status", runId: result.runId, executeLint: false });
    const status = renderReportMarkdown(report, "status");
    const evalView = renderReportMarkdown(report, "eval");

    assert.match(status, /Meta Skill Report: report-render/);
    assert.match(status, /Recommended Next Step/);
    assert.match(evalView, new RegExp(`Meta Skill Eval ${result.runId}`));
    assert.match(evalView, /no verdict recorded/);
  });

  it("does not mark mixed assessed and unassessed runs ready", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-mixed-verdict-"));
    const runRoot = path.join(root, "001-mixed");
    await fs.mkdir(runRoot, { recursive: true });
    await writeJson(path.join(runRoot, "run.json"), {
      schema_version: 1,
      run_id: "001-mixed",
      status: "completed",
      failure_classifications: []
    });
    await writeText(
      path.join(runRoot, "results.jsonl"),
      [
        jsonlEvent("scenario_result", "001-mixed", "R1", { scenario_folder: "R1-passed", execution_status: "completed", evidence_path: "scenarios/R1-passed" }),
        jsonlEvent("scenario_result", "001-mixed", "R2", { scenario_folder: "R2-unassessed", execution_status: "completed", evidence_path: "scenarios/R2-unassessed" })
      ].join("\n")
    );
    await writeText(path.join(runRoot, "tests.jsonl"), `${jsonlEvent("test_result", "001-mixed", "R1", { scenario_id: "R1", status: "passed", id: "scenario-pass" })}\n`);
    await writeText(path.join(runRoot, "grades.jsonl"), "");
    await writeText(path.join(runRoot, "feedback.jsonl"), "");

    const report = await buildRunReport(runRoot);

    assert.equal(report.summary.no_verdict_count, 1);
    assert.equal(report.summary.assessment_status, undefined);
    assert.equal(report.readiness.status, "unknown");
  });

  it("normalizes legacy side-shaped reports and indexes in read mode", async () => {
    const project = await fixtureProject("report-legacy-side-read");
    const runsRoot = path.join(project, ".meta-skill", "evals", "runs");
    const runRoot = path.join(runsRoot, "001-legacy");
    await fs.mkdir(runRoot, { recursive: true });
    await writeJson(path.join(runRoot, "run.json"), { run_id: "001-legacy", status: "needs_review", manual_review_required: true });
    await writeJson(path.join(runRoot, "report.json"), {
      schema_version: 2,
      generated_at: "2026-06-02T00:00:00.000Z",
      run: { run_id: "001-legacy", status: "needs_review", manual_review_required: true },
      summary: {
        run_id: "001-legacy",
        label: null,
        status: "needs_review",
        scenario_count: 1,
        side_count: 2,
        result_count: 2,
        comparison_mode: "release",
        manual_review_required: true,
        failure_classifications: [],
        assessment_status: "needs_review",
        unresolved_count: 1
      },
      scenarios: [
        {
          id: "R1",
          folder: "R1-legacy",
          title: "Legacy report",
          topics: [],
          evidence_basis: "legacy_current_project",
          sides: [
            { side: "candidate", status: "needs_review", evidence_path: "scenarios/R1-legacy/candidate", final_preview: "Old working payload output." },
            { side: "release", status: "passed", evidence_path: "scenarios/R1-legacy/release", final_preview: "Old saved snapshot output." }
          ],
          status: "needs_review",
          unresolved: true
        }
      ],
      tests: [],
      judges: [],
      feedback: [],
      comparisons: [],
      artifacts: [{ scenario_id: "R1", path: "scenarios/R1-legacy/candidate/artifacts/old.txt", kind: "file" }],
      readiness: { status: "needs_review", summary: "Legacy report.", blockers: [], unresolved: 1, basis: "report.json" }
    });
    await writeJson(path.join(runsRoot, "index.json"), {
      schema_version: 1,
      updated_at: "2026-06-02T00:00:00.000Z",
      runs: [
        {
          run_id: "001-legacy",
          label: null,
          status: "needs_review",
          scenario_count: 1,
          comparison_mode: "release",
          manual_review_required: true,
          failure_classifications: [],
          assessment_status: "needs_review",
          unresolved_count: 1,
          readiness_status: "needs_review"
        }
      ]
    });

    const runs = await listRunSummariesForReport(project, {}, "read");
    const listMarkdown = renderRunListMarkdown(runs);
    const report = await buildMetaSkillReport({ project, view: "eval", runId: "001-legacy", executeLint: false });
    const evalMarkdown = renderReportMarkdown(report, "eval");
    const html = renderEvalReportHtml(report.evidence.latest_eval_run?.report as RunReport);

    assert.match(listMarkdown, /Working payload/);
    assert.match(evalMarkdown, /Legacy working payload side \/ completed/);
    assert.match(evalMarkdown, /Legacy saved snapshot side \/ passed/);
    assert.match(html, /Old working payload output/);
    assert.match(html, /Old saved snapshot output/);
  });

  it("renders the eval report app shell and selects failed scenarios first", () => {
    const html = renderEvalReportHtml(reportFixture());

    assert.match(html, /Meta Skill evals/);
    assert.match(html, /Scenarios/);
    assert.match(html, /Final answer preview/);
    assert.match(html, /Evaluation evidence/);
    assert.match(html, /Token usage/);
    assert.match(html, /Raw evidence/);
    assert.match(html, /data-scenario-id="R2" aria-current="true"/);
    assert.match(html, /no deterministic test, judge, or human feedback verdict is recorded/);
    assert.match(html, /Forced-skill run: final-answer behavior only/);
    assert.match(html, /Working payload failed answer/);
    assert.match(html, /<td>Working payload<\/td><td>30<\/td>/);
    assert.match(html, /href="scenarios\/R2-failed\/final\.md"/);
    assert.match(html, /href="scenarios\/R2-failed\/turns\.jsonl"/);
    assert.match(html, /href="scenarios\/R2-failed\/usage\.json"/);
    assert.match(html, /href="scenarios\/R2-failed\/rpc\.jsonl"/);
    assert.doesNotMatch(html, /Artifact section/i);
  });

  it("renders one-source reports without extra attempts", () => {
    const report = reportFixture();
    report.scenarios = [report.scenarios[2]];

    const html = renderEvalReportHtml(report);

    assert.match(html, /Working payload passed answer/);
    assert.doesNotMatch(html, /No saved snapshot attempt in this run/);
  });
});

function reportFixture(): RunReport {
  const workingSource = { kind: "working_payload", label: "Working payload", skill_root: "../../../..", attached_skill: true } as const;
  const failedUsage = tokenSummary(10, 20, 30);
  const passedUsage = tokenSummary(3, 4, 7);
  return {
    schema_version: 2,
    generated_at: "2026-06-03T00:00:00.000Z",
    run: { skill_name: "fixture-skill", runner: { backend: "app_server", app_server: { mode: "managed" } } },
    summary: {
      run_id: "app-run",
      label: "fixture",
      status: "completed",
      scenario_count: 3,
      attempt_count: 3,
      result_count: 3,
      run_source: workingSource,
      failure_classifications: ["scenario_failure"],
      execution_status: "completed",
      assessment_status: "failed",
      no_verdict_count: 1,
      evidence_counts: { tests: 1, judges: 1, feedback: 0 },
      token_usage: {
        input_tokens: 13,
        output_tokens: 24,
        total_tokens: 37,
        scenario_count: 3,
        unavailable_scenario_count: 1,
        unavailable_reasons: [{ scenario_id: "R1", run_source: "working_payload", reason: "usage.json was unavailable for this scenario." }]
      }
    },
    scenarios: [
      {
        id: "R1",
        folder: "R1-review",
        title: "Review case",
        family: "regression",
        type: "behavior",
        topics: ["review"],
        evidence_basis: "run_snapshot",
        criteria: { what_it_tests: "Review", expected_behavior: "Review expected.", assertions: ["Review assertion."], tests: [], judges: [] },
        attempts: [{ run_source: workingSource, execution_status: "completed", evidence_path: "scenarios/R1-review", final_path: "scenarios/R1-review/final.md", final_preview: "Working payload review answer.", token_usage: undefined }],
        status: "completed",
        execution_status: "completed",
        no_verdict_recorded: true
      },
      {
        id: "R2",
        folder: "R2-failed",
        title: "Failed case",
        family: "regression",
        type: "behavior",
        topics: ["failure"],
        evidence_basis: "run_snapshot",
        criteria: { what_it_tests: "Failure", expected_behavior: "Pass the check.", assertions: ["No failure."], tests: ["check"], judges: ["judge"] },
        attempts: [{ run_source: workingSource, execution_status: "completed", verdict: "failed", evidence_path: "scenarios/R2-failed", final_path: "scenarios/R2-failed/final.md", final_preview: "Working payload failed answer.", token_usage: failedUsage, failure_classification: "scenario_failure" }],
        status: "failed",
        execution_status: "completed",
        verdict: "failed",
        no_verdict_recorded: false
      },
      {
        id: "R3",
        folder: "R3-passed",
        title: "Passed case",
        family: "regression",
        type: "behavior",
        topics: ["pass"],
        evidence_basis: "run_snapshot",
        criteria: { expected_behavior: "Pass.", assertions: [], tests: [], judges: [] },
        attempts: [{ run_source: workingSource, execution_status: "completed", verdict: "passed", evidence_path: "scenarios/R3-passed", final_path: "scenarios/R3-passed/final.md", final_preview: "Working payload passed answer.", token_usage: passedUsage }],
        status: "passed",
        execution_status: "completed",
        verdict: "passed",
        no_verdict_recorded: false
      }
    ],
    tests: [{ schema_version: 1, type: "test_result", run_id: "app-run", scenario_id: "R2", created_at: "now", source: "fixture", payload: { scenario_id: "R2", status: "failed", id: "check" } }],
    judges: [{ schema_version: 1, type: "judge_result", run_id: "app-run", scenario_id: "R2", created_at: "now", source: "fixture", payload: { scenario_id: "R2", status: "failed", failure_classification: "judge_failure" } }],
    feedback: [],
    readiness: { status: "blocked", summary: "Run has blocking failures.", blockers: ["scenario_failure"], no_verdict_count: 1, basis: "report.json" }
  };
}

function scenarioRunner(verdict: ScenarioRunResult["verdict"], error?: string) {
  return {
    async run(input: ScenarioRunInput): Promise<ScenarioRunResult> {
      const scenarioRoot = path.join(input.runRoot, "scenarios", input.scenario.folder);
      await fs.mkdir(path.join(scenarioRoot, "stage", "skill"), { recursive: true });
      await writeText(path.join(scenarioRoot, "stage", "skill", "SKILL.md"), "fixture");
      await writeText(path.join(scenarioRoot, "final.md"), "Fixture final.");
      await writeText(path.join(scenarioRoot, "turns.jsonl"), "");
      await writeJson(path.join(scenarioRoot, "thread.json"), { schema_version: 1, thread_id: "fixture", turn_ids: ["turn"], status: "completed" });
      await writeText(path.join(scenarioRoot, "rpc.jsonl"), "");
      await writeJson(path.join(scenarioRoot, "usage.json"), tokenUsageEvidence(1, 1, 2));
      return {
        execution_status: "completed",
        ...(verdict ? { verdict } : {}),
        token_usage: tokenSummary(1, 1, 2),
        final_path: path.join(scenarioRoot, "final.md"),
        evidence_path: path.join("scenarios", input.scenario.folder),
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
  const summary = tokenSummary(input, output, total);
  return { schema_version: 1, source_event: "thread/tokenUsage/updated", summary, turns: [] };
}

function jsonlEvent(type: string, runId: string, scenarioId: string, payload: Record<string, unknown>): string {
  return JSON.stringify({
    schema_version: 1,
    type,
    run_id: runId,
    scenario_id: scenarioId,
    created_at: "2026-06-03T00:00:00.000Z",
    source: "fixture",
    payload
  });
}

async function fixtureProject(slug: string): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-reporting-"));
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
