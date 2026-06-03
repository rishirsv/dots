import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import type { ScenarioRunInput, ScenarioRunResult } from "./app-server/runner";
import type { RunReport, TokenUsageSummary } from "./models";
import { openRun, runEval } from "./evals";
import { renderEvalReportHtml } from "./report";
import { buildMetaSkillReport, listRunSummariesForReport, renderReportMarkdown } from "./reporting";
import { exists, writeJson, writeText } from "./project";
import { createSkill } from "./skills";

describe("central reporting service", () => {
  it("builds read-only project reports without materializing missing eval artifacts", async () => {
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
      scenarioRunner: scenarioRunner("needs_review")
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
      scenarioRunner: scenarioRunner("needs_review")
    });

    const report = await buildMetaSkillReport({ project, view: "status", runId: result.runId, executeLint: false });
    const status = renderReportMarkdown(report, "status");
    const evalView = renderReportMarkdown(report, "eval");

    assert.match(status, /Meta Skill Report: report-render/);
    assert.match(status, /Recommended Next Step/);
    assert.match(evalView, new RegExp(`Meta Skill Eval ${result.runId}`));
    assert.match(evalView, /unresolved; not pass proof/);
  });

  it("renders legacy v1 token availability counts without throwing", () => {
    const report = {
      schema_version: 1,
      generated_at: "2026-06-02T00:00:00.000Z",
      run: { runner: { backend: "app_server", app_server: { mode: "managed" } } },
      summary: {
        run_id: "legacy-run",
        label: null,
        status: "needs_review",
        scenario_count: 1,
        side_count: 1,
        result_count: 1,
        comparison_mode: "none",
        manual_review_required: true,
        failure_classifications: [],
        assessment_status: "needs_review",
        unresolved_count: 1,
        token_usage: { available: 2, unavailable: 1 }
      },
      scenarios: [
        {
          id: "R1",
          folder: "R1-legacy",
          title: "Legacy",
          topics: [],
          evidence_basis: "run_snapshot",
          sides: [
            {
              side: "candidate",
              status: "needs_review",
              evidence_path: "scenarios/R1-legacy/candidate",
              final_path: "scenarios/R1-legacy/candidate/final.md",
              final_preview: "Fixture final.",
              token_usage: {
                input_tokens: { available: true, value: 1 },
                output_tokens: { available: true, value: 2 },
                total_tokens: { available: true, value: 3 }
              }
            }
          ],
          status: "needs_review",
          unresolved: true
        }
      ],
      tests: [],
      judges: [],
      feedback: [],
      comparisons: [],
      artifacts: [],
      readiness: {
        status: "needs_review",
        summary: "Legacy report fixture.",
        blockers: [],
        unresolved: 1,
        basis: "report.json"
      }
    } as unknown as RunReport;

    const html = renderEvalReportHtml(report);

    assert.match(html, /Legacy availability counts: 2 available, 1 unavailable/);
    assert.match(html, /<td>3<\/td>/);
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
    assert.match(html, /Needs review is unresolved evidence, not pass proof/);
    assert.match(html, /Forced-skill run: final-answer behavior only/);
    assert.match(html, /Candidate failed answer/);
    assert.match(html, /Release passed answer/);
    assert.match(html, /<td>Candidate<\/td><td>30<\/td>/);
    assert.match(html, /<td>Release<\/td><td>70<\/td>/);
    assert.match(html, /href="scenarios\/R2-failed\/candidate\/final\.md"/);
    assert.match(html, /href="scenarios\/R2-failed\/candidate\/turns\.jsonl"/);
    assert.match(html, /href="scenarios\/R2-failed\/candidate\/usage\.json"/);
    assert.match(html, /href="scenarios\/R2-failed\/candidate\/rpc\.jsonl"/);
    assert.doesNotMatch(html, /Artifact section/i);
  });

  it("renders candidate-only reports without a release attempt", () => {
    const report = reportFixture();
    report.summary.comparison_mode = "none";
    report.scenarios = [report.scenarios[2]];
    report.comparisons = [report.comparisons[2]];

    const html = renderEvalReportHtml(report);

    assert.match(html, /Candidate passed answer/);
    assert.doesNotMatch(html, /No release attempt in this run/);
  });
});

function reportFixture(): RunReport {
  const candidateFailed = tokenSummary(10, 20, 30);
  const releasePassed = tokenSummary(30, 40, 70);
  const candidatePassed = tokenSummary(3, 4, 7);
  return {
    schema_version: 2,
    generated_at: "2026-06-03T00:00:00.000Z",
    run: { skill_name: "fixture-skill", runner: { backend: "app_server", app_server: { mode: "managed" } } },
    summary: {
      run_id: "app-run",
      label: "fixture",
      status: "needs_review",
      scenario_count: 3,
      side_count: 4,
      result_count: 4,
      comparison_mode: "release",
      manual_review_required: true,
      failure_classifications: ["scenario_failure"],
      assessment_status: "failed",
      unresolved_count: 1,
      token_usage: { by_side: { candidate: candidateFailed, release: releasePassed }, availability_counts: { available: 3, unavailable: 1 } }
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
        sides: [{ side: "candidate", status: "needs_review", evidence_path: "scenarios/R1-review/candidate", final_path: "scenarios/R1-review/candidate/final.md", final_preview: "Candidate review answer.", token_usage: undefined }],
        status: "needs_review",
        unresolved: true
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
        sides: [
          { side: "candidate", status: "failed", evidence_path: "scenarios/R2-failed/candidate", final_path: "scenarios/R2-failed/candidate/final.md", final_preview: "Candidate failed answer.", token_usage: candidateFailed, failure_classification: "scenario_failure" },
          { side: "release", status: "passed", evidence_path: "scenarios/R2-failed/release", final_path: "scenarios/R2-failed/release/final.md", final_preview: "Release passed answer.", token_usage: releasePassed }
        ],
        status: "failed",
        unresolved: false
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
        sides: [{ side: "candidate", status: "passed", evidence_path: "scenarios/R3-passed/candidate", final_path: "scenarios/R3-passed/candidate/final.md", final_preview: "Candidate passed answer.", token_usage: candidatePassed }],
        status: "passed",
        unresolved: false
      }
    ],
    tests: [{ schema_version: 1, type: "test_result", run_id: "app-run", scenario_id: "R2", side: "candidate", created_at: "now", source: "fixture", payload: { scenario_id: "R2", status: "failed", id: "check" } }],
    judges: [{ schema_version: 1, type: "judge_result", run_id: "app-run", scenario_id: "R2", side: "candidate", created_at: "now", source: "fixture", payload: { scenario_id: "R2", status: "failed", failure_classification: "judge_failure" } }],
    feedback: [],
    comparisons: [
      { scenario_id: "R1", scenario_folder: "R1-review", kind: "none", classification: "not_comparable", candidate_status: "needs_review" },
      { scenario_id: "R2", scenario_folder: "R2-failed", kind: "release", classification: "candidate_regresses", candidate_status: "failed", release_status: "passed" },
      { scenario_id: "R3", scenario_folder: "R3-passed", kind: "none", classification: "not_comparable", candidate_status: "passed" }
    ],
    artifacts: [],
    readiness: { status: "blocked", summary: "Run has blocking failures.", blockers: ["scenario_failure"], unresolved: 1, basis: "report.json" }
  };
}

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
        token_usage: tokenSummary(1, 1, 2),
        final_path: path.join(sideRoot, "final.md"),
        evidence_path: path.join("scenarios", input.scenario.folder, input.side),
        error
      };
    },
    close() {}
  };
}

function tokenSummary(input: number, output: number, total: number): TokenUsageSummary {
  return {
    availability: "present",
    sample_unit: "scenario_side",
    sample_count: 1,
    unavailable_count: 0,
    input_tokens: { total: input, average: input, min: input, max: input },
    output_tokens: { total: output, average: output, min: output, max: output },
    total_tokens: { total, average: total, min: total, max: total },
    unavailable_reasons: []
  };
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
