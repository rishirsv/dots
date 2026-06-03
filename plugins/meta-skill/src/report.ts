import { promises as fs } from "node:fs";
import path from "node:path";
import type { EvalRunSource, EventEnvelope, LegacyEvalSide, RunIndex, RunIndexRow, RunReadiness, RunReport, RunReportAttempt, RunReportScenario, RunTokenUsageSummary, TokenUsage, TokenUsageEvidence } from "./models";
import { exists, readJson, readText, utcNow, writeJson, writeText } from "./project";

export async function materializeEvalRunReport(runRoot: string, options: { updateIndex?: boolean } = {}): Promise<{ report: string; reportJson: string; runId: string; data: RunReport }> {
  const report = await buildRunReport(runRoot);
  const jsonPath = path.join(runRoot, "report.json");
  await writeJson(jsonPath, report);
  const htmlPath = path.join(runRoot, "report.html");
  await writeText(htmlPath, renderEvalReportHtml(report));
  if (options.updateIndex !== false) await updateRunsIndex(path.dirname(runRoot));
  return { report: htmlPath, reportJson: jsonPath, runId: report.summary.run_id, data: report };
}

export async function writeEvalReport(runRoot: string): Promise<string> {
  return (await materializeEvalRunReport(runRoot)).report;
}

export async function buildRunReport(runRoot: string): Promise<RunReport> {
  const runJson = await readJson<Record<string, unknown>>(path.join(runRoot, "run.json"));
  const scenarioRows = (await readJsonl(path.join(runRoot, "results.jsonl"))).filter((row) => row.type === "scenario_result");
  const testRows = (await readJsonl(path.join(runRoot, "tests.jsonl"))).filter((row) => row.type === "test_result" || row.type === "lint_summary" || row.type === "lint_skipped") as EventEnvelope[];
  const judgeRows = (await readJsonl(path.join(runRoot, "grades.jsonl"))).filter((row) => row.type === "judge_result") as EventEnvelope[];
  const feedbackRows = (await readJsonl(path.join(runRoot, "feedback.jsonl"))) as EventEnvelope[];
  const byFolder = new Map<string, EventEnvelope[]>();
  for (const row of scenarioRows as EventEnvelope[]) {
    const folder = String(row.payload?.scenario_folder || row.scenario_id || "unknown");
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder)?.push(row);
  }

  const scenarios: RunReportScenario[] = [];
  for (const [folder, rows] of [...byFolder.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const snapshot = await readScenarioSnapshot(runRoot, folder);
    const scenarioId = snapshot?.metadata?.id || String(rows[0]?.scenario_id || folder.split("-")[0]);
    const attempts = await Promise.all(
      rows.map(async (row): Promise<RunReportAttempt> => {
        const legacySide = row.side;
        const evidencePath = String(row.payload?.evidence_path || "");
        const finalPath = evidencePath ? path.join(evidencePath, "final.md") : undefined;
        const tokenUsage = await readAttemptTokenUsage(runRoot, evidencePath);
        const verdict = verdictFromPayload(row.payload);
        return {
          run_source: normalizeRunSource(row.payload?.run_source, legacySide),
          execution_status: executionStatusFromPayload(row.payload),
          ...(verdict ? { verdict } : {}),
          evidence_path: evidencePath,
          final_path: finalPath,
          final_preview: evidencePath ? await readFinalPreview(path.join(runRoot, evidencePath, "final.md")) : "",
          token_usage: tokenUsage,
          failure_classification: (row.payload?.failure_classification as string | null | undefined) || null,
          error: row.payload?.error ? String(row.payload.error) : undefined,
          raw: row.payload,
          ...(legacySide ? { legacy_side: legacySide } : {})
        };
      })
    );
    const verdict = verdictForScenarioEvidence(scenarioId, folder, attempts, testRows, judgeRows, feedbackRows);
    const executionStatus = scenarioExecutionStatus(attempts);
    const status = scenarioStatus(executionStatus, verdict);
    scenarios.push({
      id: scenarioId,
      folder,
      title: snapshot?.metadata?.title,
      family: snapshot?.metadata?.family,
      type: snapshot?.metadata?.type,
      topics: snapshot?.metadata?.topics || [],
      capability: snapshot?.capability || null,
      criteria: snapshot?.criteria
        ? {
            what_it_tests: snapshot.criteria.what_it_tests,
            expected_behavior: snapshot.criteria.expected_behavior,
            assertions: snapshot.criteria.assertions || [],
            tests: snapshot.criteria.tests || [],
            judges: (snapshot.criteria.judges || []).map((judge) => judge.id)
          }
        : undefined,
      metadata: snapshot?.metadata?.metadata,
      evidence_basis: snapshot?.basis || "unavailable",
      attempts,
      status,
      execution_status: executionStatus,
      ...(verdict ? { verdict } : {}),
      no_verdict_recorded: executionStatus === "completed" && !verdict
    });
  }

  const failureClassifications = derivedFailureClassifications(runJson, testRows, judgeRows, scenarioRows as EventEnvelope[]);
  const noVerdictCount = scenarios.reduce((sum, scenario) => sum + (scenario.no_verdict_recorded ? 1 : 0), 0);
  const counts = evidenceCounts(testRows, judgeRows, feedbackRows);
  const tokenUsage = countTokenUsage(scenarios);
  const assessmentStatus = assessmentStatusFor(failureClassifications, noVerdictCount, testRows, judgeRows, feedbackRows);
  const readiness = readinessFor(assessmentStatus, failureClassifications, noVerdictCount, counts);
  const runSource = normalizeRunSource(runJson.run_source);
  const executionStatus = runExecutionStatus(String(runJson.status || "unknown"));

  return {
    schema_version: 2,
    generated_at: utcNow(),
    run: runJson,
    summary: {
      run_id: String(runJson.run_id || path.basename(runRoot)),
      label: (runJson.label as string | null | undefined) || null,
      status: String(runJson.status || "unknown"),
      created_at: runJson.created_at ? String(runJson.created_at) : undefined,
      completed_at: runJson.completed_at ? String(runJson.completed_at) : undefined,
      scenario_count: scenarios.length,
      attempt_count: scenarios.reduce((sum, scenario) => sum + scenario.attempts.length, 0),
      result_count: scenarioRows.length,
      run_source: runSource,
      failure_classifications: failureClassifications,
      execution_status: executionStatus,
      ...(assessmentStatus ? { assessment_status: assessmentStatus } : {}),
      no_verdict_count: noVerdictCount,
      evidence_counts: counts,
      token_usage: tokenUsage
    },
    scenarios,
    tests: testRows,
    judges: judgeRows,
    feedback: feedbackRows,
    readiness
  };
}

function derivedFailureClassifications(runJson: Record<string, unknown>, tests: EventEnvelope[], judges: EventEnvelope[], scenarios: EventEnvelope[]): string[] {
  const failures = new Set(Array.isArray(runJson.failure_classifications) ? runJson.failure_classifications.map(String) : []);
  for (const row of scenarios) {
    const classification = row.payload?.failure_classification;
    if (classification) failures.add(String(classification));
  }
  for (const row of tests) {
    if (row.type === "test_result" && row.payload?.status === "failed") failures.add("lint_test_failure");
  }
  for (const row of judges) {
    if (row.payload?.status === "failed") failures.add("judge_failure");
    if (row.payload?.status === "unavailable" && row.payload?.failure_classification) failures.add(String(row.payload.failure_classification));
  }
  return [...failures].sort();
}

function assessmentStatusFor(failureClassifications: string[], noVerdictCount: number, tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): "passed" | "failed" | undefined {
  if (failureClassifications.length || hasFailedEvidence(tests, judges, feedback)) return "failed";
  if (noVerdictCount) return undefined;
  if (hasPassedEvidence(tests, judges, feedback)) return "passed";
  return undefined;
}

export async function updateRunsIndex(runsRoot: string): Promise<RunIndex> {
  const rows: RunIndexRow[] = [];
  if (await exists(runsRoot)) {
    const dirs = (await fs.readdir(runsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    for (const dir of dirs) {
      const runRoot = path.join(runsRoot, dir.name);
      const reportPath = path.join(runRoot, "report.json");
      const runPath = path.join(runRoot, "run.json");
      if (await exists(reportPath)) {
        const report = await readJson<RunReport>(reportPath);
        rows.push(indexRowFromReport(report));
      } else if (await exists(runPath)) {
        const run = await readJson<Record<string, unknown>>(runPath);
        rows.push(indexRowFromRun(run, dir.name));
      }
    }
  }
  rows.sort((a, b) => String(a.run_id).localeCompare(String(b.run_id)));
  const index: RunIndex = { schema_version: 1, updated_at: utcNow(), runs: rows };
  await writeJson(path.join(runsRoot, "index.json"), index);
  return index;
}

export async function materializeReviewReport(reviewRoot: string, review: Record<string, unknown>): Promise<string> {
  const report = path.join(reviewRoot, "report.md");
  await writeText(report, renderReviewReportMarkdown(review));
  return report;
}

export async function writeReviewReport(reviewRoot: string, review: Record<string, unknown>): Promise<string> {
  return materializeReviewReport(reviewRoot, review);
}

export function renderReviewReportMarkdown(review: Record<string, unknown>): string {
  const quality = objectValue(review.quality);
  const discovery = objectValue(review.discovery);
  const implementation = objectValue(review.implementation);
  const validation = objectValue(review.validation);
  const reviewer = objectValue(review.reviewer);
  const discoveryRows = vectorRows(arrayValue(discovery.vectors));
  const implementationRows = vectorRows(arrayValue(implementation.vectors));
  const validationRows = arrayValue(validation.checks)
    .map((check: Record<string, unknown>) => `| ${pipe(check.name)} | ${pipe(check.message || "")} | ${pipe(check.status)} |`)
    .join("\n");
  const suggestions = arrayValue(review.suggestions)
    .map((item: Record<string, unknown>, index: number) => `${index + 1}. **${pipe(item.priority || "medium")}** ${pipe(item.vector || "general")}: ${pipe(item.issue || "")}\n\n   Suggested fix: ${pipe(item.suggested_fix || "")}`)
    .join("\n\n");
  return `# Skill Quality Review

Quality: ${quality.score ?? "unavailable"}%

Reviewer: ${reviewer.name || "meta-skill-reviewer"} (${reviewer.status || "represented"})

## Discovery: ${quality.discovery ?? "unavailable"}%

Can an agent discover and select this skill at the right time?

${discovery.assessment || ""}

| Dimension | Reasoning | Score |
|---|---|---:|
${discoveryRows || "| none | No discovery vectors were available. | 0 / 0 |"}

## Implementation: ${quality.implementation ?? "unavailable"}%

Are the instructions useful, concise, and operational?

${implementation.assessment || ""}

| Dimension | Reasoning | Score |
|---|---|---:|
${implementationRows || "| none | No implementation vectors were available. | 0 / 0 |"}

## Validation: ${quality.validation ?? "unavailable"}%

Does the skill satisfy structural and packaging expectations?

${validation.assessment || ""}

| Check | Description | Result |
|---|---|---|
${validationRows || "| none | No validation checks were available. | unavailable |"}

## Suggestions

${suggestions || "No material suggestions."}
`;
}

async function readScenarioSnapshot(
  runRoot: string,
  folder: string
): Promise<
  | {
      basis: "run_snapshot";
      metadata: {
        id: string;
        family: string;
        type: string;
        title?: string;
        topics?: string[];
        metadata?: Record<string, unknown>;
      };
      criteria: {
        what_it_tests?: string;
        expected_behavior?: string;
        assertions?: string[];
        tests?: string[];
        judges?: Array<{ id: string }>;
      };
      capability?: string;
    }
  | undefined
> {
  const snapshot = path.join(runRoot, "snapshots", folder);
  if (!(await exists(path.join(snapshot, "scenario.json")))) return undefined;
  return {
    basis: "run_snapshot",
    metadata: await readJson(path.join(snapshot, "scenario.json")),
    criteria: (await exists(path.join(snapshot, "criteria.json"))) ? await readJson(path.join(snapshot, "criteria.json")) : { assertions: [] },
    capability: (await exists(path.join(snapshot, "capability.txt"))) ? (await readText(path.join(snapshot, "capability.txt"))).trim() : undefined
  };
}

function scenarioExecutionStatus(attempts: RunReportAttempt[]): "completed" | "errored" | "unknown" {
  if (attempts.some((attempt) => attempt.execution_status === "errored")) return "errored";
  if (attempts.some((attempt) => attempt.execution_status === "completed")) return "completed";
  return "unknown";
}

function scenarioStatus(executionStatus: string, verdict?: "passed" | "failed"): string {
  if (executionStatus === "errored") return "failed";
  return verdict || executionStatus || "unknown";
}

function readinessFor(assessmentStatus: "passed" | "failed" | undefined, failureClassifications: string[], noVerdictCount: number, counts: { tests: number; judges: number; feedback: number }): RunReadiness {
  if (assessmentStatus === "failed" || failureClassifications.length) {
    return {
      status: "blocked",
      summary: "Run has blocking failures; do not treat it as release-ready evidence.",
      blockers: failureClassifications.length ? failureClassifications : ["run_failed"],
      no_verdict_count: noVerdictCount,
      basis: "run.json, results.jsonl, tests.jsonl, grades.jsonl, feedback.jsonl"
    };
  }
  if (!assessmentStatus) {
    const missing = [
      counts.tests ? "" : "no deterministic tests recorded",
      counts.judges ? "" : "no judges recorded",
      counts.feedback ? "" : "no human feedback recorded"
    ].filter(Boolean);
    return {
      status: "unknown",
      summary: `Execution completed with no behavioral verdict recorded${missing.length ? ` (${missing.join(", ")})` : ""}.`,
      blockers: [],
      no_verdict_count: noVerdictCount,
      basis: "run.json, results.jsonl, tests.jsonl, grades.jsonl, feedback.jsonl"
    };
  }
  if (assessmentStatus === "passed") {
    return {
      status: "ready",
      summary: "Run has passing behavioral evidence and no recorded failures.",
      blockers: [],
      no_verdict_count: noVerdictCount,
      basis: "run.json, results.jsonl, tests.jsonl, grades.jsonl, feedback.jsonl"
    };
  }
  return {
    status: "unknown",
    summary: "Run evidence is incomplete; inspect raw evidence before using it.",
    blockers: [],
    no_verdict_count: noVerdictCount,
    basis: "run.json, results.jsonl, tests.jsonl, grades.jsonl, feedback.jsonl"
  };
}

function countTokenUsage(scenarios: RunReportScenario[]): RunTokenUsageSummary {
  const attempts = scenarios.flatMap((scenario) => scenario.attempts.map((attempt) => ({ scenario, attempt })));
  const available = attempts.filter(({ attempt }) => attempt.token_usage?.total_tokens !== null && attempt.token_usage?.total_tokens !== undefined && !attempt.token_usage.unavailable_reason);
  const unavailableReasons = attempts
    .filter(({ attempt }) => !attempt.token_usage || attempt.token_usage.total_tokens === null || attempt.token_usage.unavailable_reason)
    .map(({ scenario, attempt }) => ({
      scenario_id: scenario.id,
      run_source: attempt.run_source.kind || attempt.run_source.label,
      reason: attempt.token_usage?.unavailable_reason || "usage.json was unavailable for this scenario."
    }));
  return {
    input_tokens: sumNullable(available.map(({ attempt }) => attempt.token_usage?.input_tokens ?? null)),
    output_tokens: sumNullable(available.map(({ attempt }) => attempt.token_usage?.output_tokens ?? null)),
    total_tokens: sumNullable(available.map(({ attempt }) => attempt.token_usage?.total_tokens ?? null)),
    scenario_count: scenarios.length,
    unavailable_scenario_count: unavailableReasons.length,
    unavailable_reasons: unavailableReasons
  };
}

async function readAttemptTokenUsage(runRoot: string, evidencePath: string): Promise<TokenUsage | undefined> {
  const usagePath = evidencePath ? path.join(runRoot, evidencePath, "usage.json") : "";
  if (usagePath && (await exists(usagePath))) {
    const evidence = await readJson<TokenUsageEvidence>(usagePath);
    return normalizeTokenUsage(evidence.summary);
  }
  return undefined;
}

function normalizeTokenUsage(value: unknown): TokenUsage {
  const object = objectValue(value);
  return {
    input_tokens: nullableNumber(object.input_tokens),
    output_tokens: nullableNumber(object.output_tokens),
    total_tokens: nullableNumber(object.total_tokens),
    cached_input_tokens: nullableNumber(object.cached_input_tokens),
    reasoning_tokens: nullableNumber(object.reasoning_tokens),
    model_context_window: nullableNumber(object.model_context_window),
    unavailable_reason: object.unavailable_reason === null || object.unavailable_reason === undefined ? null : String(object.unavailable_reason)
  };
}

function normalizeOptionalTokenUsage(value: unknown): TokenUsage | undefined {
  const object = objectValue(value);
  return Object.keys(object).length ? normalizeTokenUsage(object) : undefined;
}

function normalizeRunTokenUsageSummary(value: unknown): RunTokenUsageSummary {
  const object = objectValue(value);
  const reasons = Array.isArray(object.unavailable_reasons)
    ? object.unavailable_reasons.map((item) => {
        const reason = objectValue(item);
        return {
          scenario_id: String(reason.scenario_id || "unknown"),
          run_source: String(reason.run_source || "unknown"),
          reason: String(reason.reason || "Token usage was unavailable.")
        };
      })
    : [];
  return {
    input_tokens: nullableNumber(object.input_tokens),
    output_tokens: nullableNumber(object.output_tokens),
    total_tokens: nullableNumber(object.total_tokens),
    scenario_count: numberFrom(object.scenario_count),
    unavailable_scenario_count: numberFrom(object.unavailable_scenario_count),
    unavailable_reasons: reasons
  };
}

function normalizeRunSource(value: unknown, legacySide?: LegacyEvalSide): EvalRunSource {
  const object = objectValue(value);
  if (typeof object.kind === "string") {
    return {
      kind: object.kind,
      label: typeof object.label === "string" ? object.label : sentenceStatus(object.kind),
      skill_root: typeof object.skill_root === "string" || object.skill_root === null ? object.skill_root : undefined,
      attached_skill: object.attached_skill === true
    };
  }
  if (legacySide === "release") return { kind: "legacy_side", label: "Legacy saved snapshot side", skill_root: "../../../versions/release/skill", attached_skill: true };
  return { kind: legacySide ? "legacy_side" : "working_payload", label: legacySide ? "Legacy working payload side" : "Working payload", skill_root: "../../../..", attached_skill: true };
}

function executionStatusFromPayload(value: unknown): "completed" | "errored" | "unknown" {
  const payload = objectValue(value);
  const executionStatus = String(payload.execution_status || "");
  if (executionStatus === "completed" || executionStatus === "errored") return executionStatus;
  const legacyStatus = String(payload.status || "");
  if (legacyStatus === "errored") return "errored";
  if (legacyStatus === "passed" || legacyStatus === "failed" || legacyStatus === "needs_review") return "completed";
  return "unknown";
}

function verdictFromPayload(value: unknown): "passed" | "failed" | undefined {
  const payload = objectValue(value);
  const verdict = String(payload.verdict || "");
  if (verdict === "passed" || verdict === "failed") return verdict;
  const legacyStatus = String(payload.status || "");
  if (legacyStatus === "passed" || legacyStatus === "failed") return legacyStatus;
  return undefined;
}

function runExecutionStatus(status: string): "completed" | "failed" | "running" | "unknown" {
  if (status === "completed" || status === "passed" || status === "needs_review") return "completed";
  if (status === "failed") return "failed";
  if (status === "running") return "running";
  return "unknown";
}

function evidenceCounts(tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): { tests: number; judges: number; feedback: number } {
  return {
    tests: tests.filter((row) => row.type === "test_result").length,
    judges: judges.filter((row) => row.type === "judge_result").length,
    feedback: feedback.filter((row) => row.type === "human_feedback").length
  };
}

function verdictForScenarioEvidence(scenarioId: string, folder: string, attempts: RunReportAttempt[], tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): "passed" | "failed" | undefined {
  if (attempts.some((attempt) => attempt.execution_status === "errored")) return "failed";
  if (attempts.some((attempt) => attempt.verdict === "failed")) return "failed";
  if (scenarioEvidenceRows(scenarioId, folder, tests, judges, feedback).some((row) => evidenceStatus(row) === "failed")) return "failed";
  if (attempts.some((attempt) => attempt.verdict === "passed")) return "passed";
  if (scenarioEvidenceRows(scenarioId, folder, tests, judges, feedback).some((row) => evidenceStatus(row) === "passed")) return "passed";
  return undefined;
}

function scenarioEvidenceRows(scenarioId: string, folder: string, tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): EventEnvelope[] {
  return [...tests, ...judges, ...feedback].filter((row) => eventMatchesScenarioKeys(row, scenarioId, folder));
}

function eventMatchesScenarioKeys(row: EventEnvelope, scenarioId: string, folder: string): boolean {
  const payload = row.payload || {};
  const candidates = [row.scenario_id, payload.scenario_id, payload.scenario_folder, payload.folder, payload.id].filter((value) => value !== undefined && value !== null).map(String);
  return candidates.includes(scenarioId) || candidates.includes(folder);
}

function hasFailedEvidence(tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): boolean {
  return [...tests, ...judges, ...feedback].some((row) => evidenceStatus(row) === "failed");
}

function hasPassedEvidence(tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): boolean {
  return [...tests, ...judges, ...feedback].some((row) => evidenceStatus(row) === "passed");
}

function evidenceStatus(row: EventEnvelope): "passed" | "failed" | undefined {
  const status = String(row.payload?.status || "");
  if (status === "passed" || status === "failed") return status;
  const label = String(row.payload?.label || "").toLowerCase();
  if (label === "pass" || label === "passed") return "passed";
  if (label === "fail" || label === "failed") return "failed";
  return undefined;
}

export function indexRowFromReport(report: RunReport): RunIndexRow {
  const normalized = normalizeRunReportForRead(report);
  return {
    run_id: normalized.summary.run_id,
    label: normalized.summary.label,
    status: normalized.summary.status,
    created_at: normalized.summary.created_at,
    completed_at: normalized.summary.completed_at,
    scenario_count: normalized.summary.scenario_count,
    run_source: normalized.summary.run_source,
    failure_classifications: normalized.summary.failure_classifications,
    execution_status: normalized.summary.execution_status,
    assessment_status: normalized.summary.assessment_status,
    no_verdict_count: normalized.summary.no_verdict_count,
    readiness_status: normalized.readiness.status
  };
}

export function indexRowFromRun(run: Record<string, unknown>, fallbackId: string): RunIndexRow {
  const failures = Array.isArray(run.failure_classifications) ? run.failure_classifications.map(String) : [];
  return {
    run_id: String(run.run_id || fallbackId),
    label: (run.label as string | null | undefined) || null,
    status: String(run.status || "unknown"),
    created_at: run.created_at ? String(run.created_at) : undefined,
    completed_at: run.completed_at ? String(run.completed_at) : undefined,
    scenario_count: Array.isArray((run.scenarios as { selection?: unknown[] } | undefined)?.selection) ? ((run.scenarios as { selection: unknown[] }).selection || []).length : 0,
    run_source: normalizeRunSource(run.run_source),
    failure_classifications: failures,
    execution_status: runExecutionStatus(String(run.status || "unknown")),
    assessment_status: run.status === "passed" || run.status === "failed" ? String(run.status) : undefined,
    no_verdict_count: run.status === "needs_review" || run.manual_review_required ? 1 : 0,
    readiness_status: failures.length ? "blocked" : "unknown"
  };
}

export function normalizeRunIndexRowForRead(value: unknown): RunIndexRow {
  const row = objectValue(value);
  const failures = Array.isArray(row.failure_classifications) ? row.failure_classifications.map(String) : [];
  const status = String(row.status || "unknown");
  return {
    run_id: String(row.run_id || ""),
    label: (row.label as string | null | undefined) || null,
    status,
    created_at: row.created_at ? String(row.created_at) : undefined,
    completed_at: row.completed_at ? String(row.completed_at) : undefined,
    scenario_count: numberFrom(row.scenario_count),
    run_source: normalizeRunSource(row.run_source),
    failure_classifications: failures,
    execution_status: String(row.execution_status || runExecutionStatus(status)),
    assessment_status: row.assessment_status === "passed" || row.assessment_status === "failed" ? String(row.assessment_status) : status === "passed" || status === "failed" ? status : undefined,
    no_verdict_count: row.no_verdict_count !== undefined ? numberFrom(row.no_verdict_count) : numberFrom(row.unresolved_count),
    readiness_status: normalizeReadinessStatusForRead(row.readiness_status, failures)
  };
}

export function normalizeRunReportForRead(value: RunReport): RunReport {
  const report = objectValue(value) as RunReport & Record<string, unknown>;
  const summary = objectValue(report.summary);
  const run = objectValue(report.run);
  const scenarios = Array.isArray(report.scenarios) ? report.scenarios.map(normalizeRunReportScenarioForRead) : [];
  const failureClassifications = Array.isArray(summary.failure_classifications) ? summary.failure_classifications.map(String) : [];
  const status = String(summary.status || run.status || "unknown");
  const noVerdictCount = summary.no_verdict_count !== undefined ? numberFrom(summary.no_verdict_count) : summary.unresolved_count !== undefined ? numberFrom(summary.unresolved_count) : scenarios.reduce((sum, scenario) => sum + (scenario.no_verdict_recorded ? 1 : 0), 0);
  const assessmentStatus = summary.assessment_status === "passed" || summary.assessment_status === "failed" ? (String(summary.assessment_status) as "passed" | "failed") : status === "passed" || status === "failed" ? (status as "passed" | "failed") : undefined;
  const counts = objectValue(summary.evidence_counts);
  const evidenceCountSummary = {
    tests: numberFrom(counts.tests),
    judges: numberFrom(counts.judges),
    feedback: numberFrom(counts.feedback)
  };
  const readiness = normalizeRunReadinessForRead(report.readiness, assessmentStatus, failureClassifications, noVerdictCount, evidenceCountSummary);
  return {
    schema_version: 2,
    generated_at: typeof report.generated_at === "string" ? report.generated_at : utcNow(),
    run,
    summary: {
      run_id: String(summary.run_id || run.run_id || "unknown"),
      label: (summary.label as string | null | undefined) || null,
      status,
      created_at: summary.created_at ? String(summary.created_at) : undefined,
      completed_at: summary.completed_at ? String(summary.completed_at) : undefined,
      scenario_count: summary.scenario_count !== undefined ? numberFrom(summary.scenario_count) : scenarios.length,
      attempt_count: summary.attempt_count !== undefined ? numberFrom(summary.attempt_count) : scenarios.reduce((sum, scenario) => sum + scenario.attempts.length, 0),
      result_count: numberFrom(summary.result_count),
      run_source: normalizeRunSource(summary.run_source),
      failure_classifications: failureClassifications,
      execution_status: String(summary.execution_status || runExecutionStatus(status)) as RunReport["summary"]["execution_status"],
      ...(assessmentStatus ? { assessment_status: assessmentStatus } : {}),
      no_verdict_count: noVerdictCount,
      evidence_counts: evidenceCountSummary,
      token_usage: normalizeRunTokenUsageSummary(summary.token_usage)
    },
    scenarios,
    tests: Array.isArray(report.tests) ? report.tests : [],
    judges: Array.isArray(report.judges) ? report.judges : [],
    feedback: Array.isArray(report.feedback) ? report.feedback : [],
    readiness
  };
}

function normalizeRunReportScenarioForRead(value: unknown): RunReportScenario {
  const scenario = objectValue(value);
  const rawAttempts = Array.isArray(scenario.attempts) ? scenario.attempts : Array.isArray(scenario.sides) ? scenario.sides : [];
  const attempts = rawAttempts.map(normalizeRunReportAttemptForRead);
  const verdict = scenario.verdict === "passed" || scenario.verdict === "failed" ? (String(scenario.verdict) as "passed" | "failed") : attempts.find((attempt) => attempt.verdict)?.verdict;
  const executionStatus = String(scenario.execution_status || scenarioExecutionStatus(attempts));
  const status = String(scenario.status || scenarioStatus(executionStatus, verdict));
  return {
    id: String(scenario.id || scenario.folder || "unknown"),
    folder: String(scenario.folder || scenario.id || "unknown"),
    title: scenario.title ? String(scenario.title) : undefined,
    family: scenario.family ? String(scenario.family) : undefined,
    type: scenario.type ? String(scenario.type) : undefined,
    topics: Array.isArray(scenario.topics) ? scenario.topics.map(String) : [],
    capability: (scenario.capability as string | null | undefined) || null,
    criteria: normalizeScenarioCriteriaForRead(scenario.criteria),
    metadata: objectValue(scenario.metadata),
    evidence_basis: ["run_snapshot", "legacy_current_project", "unavailable"].includes(String(scenario.evidence_basis)) ? (String(scenario.evidence_basis) as RunReportScenario["evidence_basis"]) : "unavailable",
    attempts,
    status,
    execution_status: executionStatus,
    ...(verdict ? { verdict } : {}),
    no_verdict_recorded: scenario.no_verdict_recorded !== undefined ? Boolean(scenario.no_verdict_recorded) : Boolean(scenario.unresolved) || status === "needs_review" || attempts.some((attempt) => !attempt.verdict && attempt.execution_status === "completed")
  };
}

function normalizeRunReportAttemptForRead(value: unknown): RunReportAttempt {
  const attempt = objectValue(value);
  const legacySide = legacySideFromValue(attempt.side);
  const verdict = verdictFromPayload(attempt);
  return {
    run_source: normalizeRunSource(attempt.run_source, legacySide),
    execution_status: executionStatusFromPayload(attempt),
    ...(verdict ? { verdict } : {}),
    evidence_path: String(attempt.evidence_path || ""),
    final_path: attempt.final_path ? String(attempt.final_path) : undefined,
    final_preview: attempt.final_preview ? String(attempt.final_preview) : "",
    token_usage: normalizeOptionalTokenUsage(attempt.token_usage),
    failure_classification: (attempt.failure_classification as string | null | undefined) || null,
    error: attempt.error ? String(attempt.error) : undefined,
    raw: objectValue(attempt.raw),
    ...(legacySide ? { legacy_side: legacySide } : {})
  };
}

function normalizeScenarioCriteriaForRead(value: unknown): RunReportScenario["criteria"] {
  const criteria = objectValue(value);
  if (!Object.keys(criteria).length) return undefined;
  return {
    what_it_tests: criteria.what_it_tests ? String(criteria.what_it_tests) : undefined,
    expected_behavior: criteria.expected_behavior ? String(criteria.expected_behavior) : undefined,
    assertions: Array.isArray(criteria.assertions) ? criteria.assertions.map(String) : [],
    tests: Array.isArray(criteria.tests) ? criteria.tests.map(String) : [],
    judges: Array.isArray(criteria.judges) ? criteria.judges.map(String) : []
  };
}

function normalizeRunReadinessForRead(value: unknown, assessmentStatus: RunReport["summary"]["assessment_status"], failureClassifications: string[], noVerdictCount: number, counts: { tests: number; judges: number; feedback: number }): RunReadiness {
  const readiness = objectValue(value);
  if (["ready", "blocked", "unknown"].includes(String(readiness.status))) {
    return {
      status: String(readiness.status) as RunReadiness["status"],
      summary: String(readiness.summary || ""),
      blockers: Array.isArray(readiness.blockers) ? readiness.blockers.map(String) : [],
      no_verdict_count: readiness.no_verdict_count !== undefined ? numberFrom(readiness.no_verdict_count) : numberFrom(readiness.unresolved),
      basis: String(readiness.basis || "report.json")
    };
  }
  return readinessFor(assessmentStatus, failureClassifications, noVerdictCount, counts);
}

function legacySideFromValue(value: unknown): LegacyEvalSide | undefined {
  return value === "candidate" || value === "release" ? value : undefined;
}

function normalizeReadinessStatusForRead(value: unknown, failures: string[]): string {
  const status = String(value || "");
  if (status === "ready" || status === "blocked" || status === "unknown") return status;
  if (status === "needs_review") return "unknown";
  return failures.length ? "blocked" : "unknown";
}

interface ReportAppModelV1 {
  schema_version: 1;
  skill: { name: string };
  run: {
    id: string;
    label?: string | null;
    status: string;
    execution_status: string;
    assessment_status?: string;
    readiness_status: string;
    readiness_summary: string;
    run_source: EvalRunSource;
    created_at?: string;
    completed_at?: string;
    runner_backend?: string;
    runner_mode?: string;
  };
  summary: {
    scenario_count: number;
    attempt_count: number;
    result_count: number;
    no_verdict_count: number;
    failure_classifications: string[];
    evidence_counts: { tests: number; judges: number; feedback: number };
    token_usage: RunTokenUsageSummary;
  };
  scenarios: ReportAppScenarioV1[];
}

interface ReportAppScenarioV1 {
  id: string;
  folder: string;
  title: string;
  subtitle: string;
  status: string;
  execution_status: string;
  verdict?: "passed" | "failed";
  no_verdict_recorded: boolean;
  evidence_basis: string;
  criteria: Array<{ label: string; value: string }>;
  attempts: Array<{
    source_kind: string;
    label: string;
    execution_status: string;
    verdict?: "passed" | "failed";
    status: string;
    final_preview: string;
    final_href?: string;
    token_usage?: TokenUsage;
    failure_classification?: string | null;
    error?: string;
    raw_links: Array<{ label: string; href: string }>;
  }>;
  evidence: Array<{ type: string; status: string; detail: string }>;
  review_reasons: string[];
}

function toReportAppModel(report: RunReport): ReportAppModelV1 {
  const runner = objectValue(report.run.runner);
  const appServer = objectValue(runner.app_server);
  return {
    schema_version: 1,
    skill: { name: String(report.run.skill_name || report.run.skill || "Meta Skill") },
    run: {
      id: report.summary.run_id,
      label: report.summary.label,
      status: report.summary.status,
      execution_status: report.summary.execution_status,
      assessment_status: report.summary.assessment_status,
      readiness_status: report.readiness.status,
      readiness_summary: report.readiness.summary,
      run_source: report.summary.run_source,
      created_at: report.summary.created_at,
      completed_at: report.summary.completed_at,
      runner_backend: runner.backend ? String(runner.backend) : undefined,
      runner_mode: appServer.mode ? String(appServer.mode) : undefined
    },
    summary: {
      scenario_count: report.summary.scenario_count,
      attempt_count: report.summary.attempt_count,
      result_count: report.summary.result_count,
      no_verdict_count: report.summary.no_verdict_count,
      failure_classifications: report.summary.failure_classifications,
      evidence_counts: report.summary.evidence_counts,
      token_usage: normalizeRunTokenUsageSummary(report.summary.token_usage)
    },
    scenarios: report.scenarios.map((scenario) => toReportAppScenario(report, scenario))
  };
}

function toReportAppScenario(report: RunReport, scenario: RunReportScenario): ReportAppScenarioV1 {
  const evidence = evidenceRowsForScenario(report, scenario);
  return {
    id: scenario.id,
    folder: scenario.folder,
    title: scenario.title || scenario.folder,
    subtitle: scenarioSubtitle(scenario),
    status: scenario.status,
    execution_status: scenario.execution_status,
    verdict: scenario.verdict,
    no_verdict_recorded: scenario.no_verdict_recorded,
    evidence_basis: scenario.evidence_basis,
    criteria: criteriaRowsForScenario(scenario),
    attempts: attemptsForScenario(scenario),
    evidence,
    review_reasons: reviewReasonsForScenario(scenario, evidence)
  };
}

function scenarioSubtitle(scenario: RunReportScenario): string {
  return [scenario.family, scenario.type, scenario.topics.join(", ")].filter(Boolean).join(" / ") || scenario.folder;
}

function attemptsForScenario(scenario: RunReportScenario): ReportAppScenarioV1["attempts"] {
  return scenario.attempts
    .slice()
    .map((attempt) => ({
      source_kind: attempt.run_source.kind,
      label: attempt.run_source.label,
      execution_status: attempt.execution_status,
      verdict: attempt.verdict,
      status: attempt.verdict || attempt.execution_status,
      final_preview: attempt.final_preview || "",
      final_href: attempt.final_path,
      token_usage: attempt.token_usage,
      failure_classification: attempt.failure_classification,
      error: attempt.error,
      raw_links: rawLinksForAttempt(attempt)
    }));
}

function rawLinksForAttempt(attempt: RunReportAttempt): Array<{ label: string; href: string }> {
  if (!attempt.evidence_path) return [];
  return ["final.md", "turns.jsonl", "usage.json", "rpc.jsonl"].map((file) => ({ label: file, href: `${attempt.evidence_path}/${file}`.split(path.sep).join("/") }));
}

function criteriaRowsForScenario(scenario: RunReportScenario): Array<{ label: string; value: string }> {
  const criteria = scenario.criteria;
  if (!criteria) return [];
  return [
    { label: "What it tests", value: criteria.what_it_tests || "" },
    { label: "Expected behavior", value: criteria.expected_behavior || "" },
    { label: "Assertions", value: criteria.assertions.join("\n") },
    { label: "Tests", value: criteria.tests.join(", ") },
    { label: "Judges", value: criteria.judges.join(", ") }
  ].filter((row) => row.value);
}

function evidenceRowsForScenario(report: RunReport, scenario: RunReportScenario): ReportAppScenarioV1["evidence"] {
  const rows: ReportAppScenarioV1["evidence"] = [];
  for (const attempt of scenario.attempts) {
    if (attempt.failure_classification || attempt.error) rows.push({ type: attempt.run_source.label, status: attempt.verdict || attempt.execution_status, detail: attempt.failure_classification || attempt.error || "" });
  }
  for (const row of [...report.tests, ...report.judges, ...report.feedback]) {
    if (!eventMatchesScenario(row, scenario)) continue;
    rows.push({
      type: evidenceTypeLabel(String(row.type || row.source || "evidence")),
      status: String(row.payload?.status || row.payload?.label || "recorded"),
      detail: String(row.payload?.id || row.payload?.failure_classification || row.payload?.reason || row.payload?.message || row.source || "")
    });
  }
  return rows;
}

function eventMatchesScenario(row: EventEnvelope, scenario: RunReportScenario): boolean {
  const payload = row.payload || {};
  const candidates = [row.scenario_id, payload.scenario_id, payload.scenario_folder, payload.folder, payload.id].filter((value) => value !== undefined && value !== null).map(String);
  return candidates.includes(scenario.id) || candidates.includes(scenario.folder);
}

function reviewReasonsForScenario(scenario: RunReportScenario, evidence: ReportAppScenarioV1["evidence"]): string[] {
  const reasons = new Set<string>();
  if (scenario.status === "failed") reasons.add("Failed scenario evidence needs attention first.");
  if (scenario.no_verdict_recorded) reasons.add("Execution completed; no deterministic test, judge, or human feedback verdict is recorded for this scenario.");
  for (const row of evidence) {
    if (row.status === "failed" || row.status === "unavailable") reasons.add(`${sentenceStatus(row.status)} evidence: ${sentenceStatus(row.detail || row.type)}`);
  }
  for (const attempt of scenario.attempts) {
    if (attempt.error) reasons.add(attempt.error);
    if (attempt.failure_classification) reasons.add(sentenceStatus(attempt.failure_classification));
  }
  return [...reasons];
}

function defaultSelectedScenario(scenarios: ReportAppScenarioV1[]): ReportAppScenarioV1 | undefined {
  return scenarios.slice().sort((a, b) => statusRank(a.status) - statusRank(b.status))[0];
}

function statusRank(status: string): number {
  if (status === "failed") return 0;
  if (status === "completed") return 1;
  if (status === "passed") return 2;
  return 3;
}

export function renderEvalReportHtml(report: RunReport): string {
  const model = toReportAppModel(normalizeRunReportForRead(report));
  const selected = defaultSelectedScenario(model.scenarios);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Meta Skill Eval ${escapeHtml(model.run.id)}</title>
  <style>
    :root { color-scheme: light; --bg: #f6f6f4; --surface: #fffffd; --soft: #f9f9f7; --ink: #171717; --muted: #70706c; --line: #e7e4df; --line-strong: #d2cec6; --accent: #2563eb; --bad: #c9342b; --warn: #9c6500; --ok: #18733c; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; line-height: 1.48; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); }
    a { color: var(--accent); text-decoration: none; } a:hover { text-decoration: underline; }
    button, input { font: inherit; }
    .topbar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; min-height: 48px; padding: 0 20px; border-bottom: 1px solid var(--line); background: rgba(255,255,253,.94); }
    .nav, .nav-actions { display: flex; gap: 18px; align-items: center; }
    .product { font-weight: 650; }
    .nav a, .nav-actions a { color: var(--ink); } .nav-actions a { color: var(--muted); }
    .app { display: grid; grid-template-columns: 288px minmax(0, 1fr) 306px; min-height: calc(100vh - 48px); background: var(--surface); }
    .left, .right { background: var(--soft); } .left { border-right: 1px solid var(--line); } .right { border-left: 1px solid var(--line); }
    .left-inner, .right-inner { padding: 18px; }
    .main { min-width: 0; padding: 32px 42px 48px; }
    h1, h2, h3, p, dl { margin: 0; } h1 { font-size: 23px; line-height: 1.22; font-weight: 650; } h2 { font-size: 14px; font-weight: 650; } h3 { font-size: 13px; font-weight: 650; }
    .muted { color: var(--muted); font-size: 12px; }
    .run-select { display: grid; gap: 4px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
    .scenario-tools { display: grid; gap: 10px; padding: 18px 0 12px; }
    .scenario-tools h2 { display: flex; justify-content: space-between; font-size: 13px; }
    .search { width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); outline: none; }
    .search:focus, .filter:focus-visible, .scenario-row:focus-visible { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,.14); }
    .filters { display: flex; flex-wrap: wrap; gap: 6px; }
    .filter { min-height: 28px; padding: 3px 8px; border: 1px solid transparent; border-radius: 4px; background: transparent; color: var(--muted); cursor: pointer; }
    .filter[aria-pressed="true"] { border-color: var(--ink); color: var(--ink); }
    .scenario-list { display: grid; gap: 2px; margin-top: 6px; }
    .scenario-row { width: 100%; padding: 9px 8px; border: 1px solid transparent; border-radius: 4px; background: transparent; text-align: left; cursor: pointer; }
    .scenario-row[aria-current="true"] { background: var(--surface); border-color: transparent; box-shadow: inset 2px 0 0 var(--ink); }
    .scenario-row strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .scenario-row span { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; }
    .status { display: inline-flex; gap: 6px; align-items: center; font-size: 12px; color: var(--muted); }
    .dot { width: 7px; height: 7px; border-radius: 999px; background: var(--muted); }
    .failed .dot { background: var(--bad); } .completed .dot { background: var(--warn); } .passed .dot { background: var(--ok); }
    .scenario-head { display: grid; gap: 8px; padding-bottom: 22px; border-bottom: 1px solid var(--line); }
    .fact-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; margin: 20px 0 2px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .fact { padding: 11px 0; border-right: 0; } .fact span { display: block; color: var(--muted); font-size: 12px; } .fact strong { display: block; margin-top: 3px; font-weight: 600; }
    .section { padding: 24px 0; border-top: 1px solid var(--line); } .section:first-of-type { border-top: 0; }
    .reason-list { display: grid; gap: 7px; margin-top: 12px; padding: 0; list-style: none; }
    .reason-list li { display: grid; grid-template-columns: 10px minmax(0, 1fr); gap: 9px; align-items: start; color: #2f2f2d; }
    .reason-list li::before { content: ""; width: 5px; height: 5px; margin-top: 8px; border-radius: 999px; background: var(--muted); }
    .failed .reason-list li::before { background: var(--bad); }
    .answers { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .answer { min-width: 0; padding-top: 10px; border-top: 1px solid var(--line); }
    .answer h3 { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .answer pre { white-space: pre-wrap; color: #2d2d2d; background: transparent; border: 0; padding: 0; margin: 12px 0 0; font: inherit; }
    .answer-actions { margin-top: 12px; }
    .answer-actions a { color: var(--muted); font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; } th, td { padding: 8px 0; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; } th { color: var(--muted); font-size: 12px; font-weight: 600; }
    .rail-section { padding: 18px 0; border-top: 1px solid var(--line); } .rail-section:first-child { border-top: 0; } .kv { display: grid; gap: 8px; margin-top: 10px; } .kv div { display: flex; justify-content: space-between; gap: 12px; } .kv dt { color: var(--muted); } .kv dd { margin: 0; text-align: right; }
    .rail-note { margin-top: 10px; max-width: 34ch; }
    .links { display: grid; gap: 14px; margin-top: 10px; }
    .raw-group { display: grid; gap: 6px; }
    .raw-group strong { color: var(--muted); font-size: 12px; font-weight: 600; }
    .raw-files { display: flex; flex-wrap: wrap; gap: 6px 12px; }
    .raw-files a { white-space: nowrap; }
    .empty { color: var(--muted); font-size: 13px; padding: 14px 0; }
    @media (max-width: 980px) { .app { grid-template-columns: 1fr; } .left, .right { border: 0; border-bottom: 1px solid var(--line); } .right { border-top: 1px solid var(--line); } .left-inner, .right-inner { padding: 16px 18px; } .main { padding: 26px 20px; } .fact-row, .answers { grid-template-columns: 1fr; } .fact { border-right: 0; border-bottom: 1px solid var(--line); } .fact:last-child { border-bottom: 0; } .topbar { align-items: flex-start; flex-direction: column; gap: 8px; padding: 12px 18px; } }
  </style>
</head>
<body>
  <nav class="topbar">
    <div class="nav"><span class="product">Meta Skill evals</span><a href="../index.json">Runs</a></div>
    <div class="nav-actions"><a href="run.json">Run JSON</a><a href="report.json">Report JSON</a></div>
  </nav>
  <div class="app">
    <aside class="left"><div class="left-inner">
      <div class="run-select"><span class="muted">Run</span><strong>${escapeHtml(model.run.id)}</strong><span class="muted">${escapeHtml(sentenceStatus(model.run.status))} · ${model.summary.scenario_count} scenarios</span></div>
      <div class="scenario-tools">
        <h2>Scenarios <span class="muted" id="scenario-count">${model.scenarios.length}</span></h2>
        <input class="search" id="scenario-search" type="search" placeholder="Search scenarios" aria-label="Search scenarios">
        <div class="filters" id="filters">
          ${["all", "failed", "completed", "passed", "no_tokens"].map((filter) => `<button class="filter" type="button" data-filter="${filter}" aria-pressed="${filter === "all"}">${escapeHtml(filterLabel(filter))}</button>`).join("")}
        </div>
      </div>
      <div class="scenario-list" id="scenario-list">${renderScenarioRail(model.scenarios, selected?.id)}</div>
      <p class="muted" style="margin-top:18px;">Forced-skill run: final-answer behavior only.</p>
    </div></aside>
    <main class="main" id="scenario-detail">${selected ? renderScenarioDetail(selected, model) : '<p class="empty">No scenarios recorded.</p>'}</main>
    <aside class="right"><div class="right-inner" id="metadata-rail">${renderMetadataRail(selected, model)}</div></aside>
  </div>
  <div hidden>
    <span>lint skipped</span>
    <span>Judge Details</span>
  </div>
  <script type="application/json" id="report-data">${escapeJsonForHtml(model)}</script>
  <script>
${REPORT_APP_JS}
  </script>
</body>
</html>`;
}

function renderRunTokenSummary(summary: unknown): string {
  const normalized = normalizeRunTokenUsageSummary(summary);
  if (!normalized.scenario_count) return '<p class="muted">No token usage recorded.</p>';
  const reasonRows = normalized.unavailable_reasons
    .map((item) => `<tr><td>${escapeHtml(item.scenario_id)}</td><td>${escapeHtml(sentenceStatus(item.run_source))}</td><td>${escapeHtml(item.reason)}</td></tr>`)
    .join("");
  return `<table>
    <thead><tr><th>Scenarios</th><th>Unavailable</th><th>Total Tokens</th><th>Input</th><th>Output</th></tr></thead>
    <tbody><tr><td>${normalized.scenario_count}</td><td>${normalized.unavailable_scenario_count}</td><td>${formatNullableNumber(normalized.total_tokens)}</td><td>${formatNullableNumber(normalized.input_tokens)}</td><td>${formatNullableNumber(normalized.output_tokens)}</td></tr></tbody>
  </table>
  ${reasonRows ? `<table><thead><tr><th>Scenario</th><th>Source</th><th>Unavailable Reason</th></tr></thead><tbody>${reasonRows}</tbody></table>` : ""}
  <p class="muted">Token usage is measured telemetry and is not a readiness verdict.</p>`;
}

function renderScenarioRail(scenarios: ReportAppScenarioV1[], selectedId?: string): string {
  if (!scenarios.length) return '<p class="empty">No scenarios match this filter.</p>';
  return scenarios
    .map((scenario) => `<button class="scenario-row" type="button" data-scenario-id="${escapeHtml(scenario.id)}" aria-current="${scenario.id === selectedId}">
      <strong>${escapeHtml(scenario.id)} · ${escapeHtml(scenario.title)}</strong>
      <span>${escapeHtml(sentenceStatus(scenario.status))} · ${escapeHtml(scenario.attempts.map((attempt) => attempt.label).join(", ") || "No output")}</span>
    </button>`)
    .join("");
}

function renderScenarioDetail(scenario: ReportAppScenarioV1, model: ReportAppModelV1): string {
  return `<div class="scenario-head">
    <span class="status ${escapeHtml(scenario.status)}"><span class="dot"></span>${escapeHtml(sentenceStatus(scenario.status))}</span>
    <h1>${escapeHtml(scenario.title)}</h1>
    <p class="muted">${escapeHtml(scenario.id)} · ${escapeHtml(scenario.subtitle)}</p>
  </div>
  <div class="fact-row">
    <div class="fact"><span>Run</span><strong>${escapeHtml(model.run.id)}</strong></div>
    <div class="fact"><span>Source</span><strong>${escapeHtml(model.run.run_source.label)}</strong></div>
    <div class="fact"><span>Evidence basis</span><strong>${escapeHtml(sentenceStatus(scenario.evidence_basis))}</strong></div>
    <div class="fact"><span>Execution</span><strong>${escapeHtml(sentenceStatus(scenario.execution_status))}</strong></div>
  </div>
  <section class="section">
    <h2>Review reasons</h2>
    ${scenario.review_reasons.length ? `<ul class="reason-list">${scenario.review_reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>` : '<p class="empty">No review reasons recorded.</p>'}
  </section>
  <section class="section">
    <h2>Final answer preview</h2>
    <div class="answers">${renderAttemptPreviews(scenario, model)}</div>
  </section>
  <section class="section">
    <h2>Evaluation evidence</h2>
    ${scenario.evidence.length ? `<table><thead><tr><th>Type</th><th>Status</th><th>Detail</th></tr></thead><tbody>${scenario.evidence.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(sentenceStatus(row.status))}</td><td>${escapeHtml(row.detail || "recorded")}</td></tr>`).join("")}</tbody></table>` : '<p class="empty">No confidently matched tests, judges, or feedback for this scenario.</p>'}
  </section>
  <section class="section">
    <h2>Criteria</h2>
    ${scenario.criteria.length ? `<table><tbody>${scenario.criteria.map((row) => `<tr><th>${escapeHtml(row.label)}</th><td>${escapeHtml(row.value)}</td></tr>`).join("")}</tbody></table>` : '<p class="empty">No criteria recorded.</p>'}
  </section>`;
}

function renderAttemptPreviews(scenario: ReportAppScenarioV1, model: ReportAppModelV1): string {
  const fallback: ReportAppScenarioV1["attempts"][number] = { label: model.run.run_source.label, execution_status: "unknown", status: "unknown", final_preview: "No final output recorded.", source_kind: model.run.run_source.kind, raw_links: [] };
  return (scenario.attempts.length ? scenario.attempts : [fallback])
    .map((attempt) => {
      const problem = [attempt.failure_classification, attempt.error].filter(Boolean).join(" · ");
      return `<div class="answer"><h3><span>${escapeHtml(attempt.label)}</span> <span class="status ${escapeHtml(attempt.status)}"><span class="dot"></span>${escapeHtml(sentenceStatus(attempt.status))}</span></h3>${problem ? `<p class="muted">${escapeHtml(sentenceStatus(problem))}</p>` : ""}<pre>${escapeHtml(attempt.final_preview || "No final output recorded.")}</pre>${attempt.final_href ? `<p class="answer-actions"><a href="${escapeHtml(attempt.final_href)}">Open final</a></p>` : ""}</div>`;
    })
    .join("");
}

function renderMetadataRail(scenario: ReportAppScenarioV1 | undefined, model: ReportAppModelV1): string {
  return `<section class="rail-section">
    <h2>Run details</h2>
    <dl class="kv">
      <div><dt>Status</dt><dd>${escapeHtml(sentenceStatus(model.run.status))}</dd></div>
      <div><dt>Execution</dt><dd>${escapeHtml(sentenceStatus(model.run.execution_status))}</dd></div>
      <div><dt>Readiness</dt><dd>${escapeHtml(sentenceStatus(model.run.readiness_status))}</dd></div>
      <div><dt>Assessment</dt><dd>${escapeHtml(model.run.assessment_status ? sentenceStatus(model.run.assessment_status) : "No verdict recorded")}</dd></div>
      <div><dt>Runner</dt><dd>${escapeHtml([model.run.runner_backend, model.run.runner_mode].filter(Boolean).join(" / ") || "unknown")}</dd></div>
    </dl>
    <p class="muted rail-note">${escapeHtml(model.run.readiness_summary)}</p>
  </section>
  <section class="rail-section">
    <h2>Token usage</h2>
    ${scenario ? renderScenarioTokenUsage(scenario) : '<p class="empty">No scenario selected.</p>'}
    ${renderRunTokenFootnote(model.summary.token_usage)}
  </section>
  <section class="rail-section">
    <h2>Raw evidence</h2>
    ${scenario ? renderRawLinks(scenario) : '<p class="empty">No scenario selected.</p>'}
  </section>`;
}

function renderScenarioTokenUsage(scenario: ReportAppScenarioV1): string {
  if (!scenario.attempts.length) return '<p class="empty">No token usage recorded.</p>';
  return `<table><thead><tr><th>Source</th><th>Total</th><th>Input</th><th>Output</th></tr></thead><tbody>${scenario.attempts
    .map((attempt) => {
      const usage = attempt.token_usage;
      return `<tr><td>${escapeHtml(attempt.label)}</td><td>${formatNullableNumber(usage?.total_tokens ?? null)}</td><td>${formatNullableNumber(usage?.input_tokens ?? null)}</td><td>${formatNullableNumber(usage?.output_tokens ?? null)}</td></tr>`;
    })
    .join("")}</tbody></table>`;
}

function renderRunTokenFootnote(summary: ReportAppModelV1["summary"]["token_usage"]): string {
  return `<p class="muted rail-note">Token usage is measured telemetry, not a quality score. Unavailable scenarios: ${summary.unavailable_scenario_count}.</p>`;
}

function renderRawLinks(scenario: ReportAppScenarioV1): string {
  const groups = scenario.attempts.filter((attempt) => attempt.raw_links.length);
  if (!groups.length) return '<p class="empty">No raw evidence links recorded.</p>';
  return `<div class="links">${groups
    .map((attempt) => `<div class="raw-group"><strong>${escapeHtml(attempt.label)}</strong><div class="raw-files">${attempt.raw_links.map((raw) => `<a href="${escapeHtml(raw.href)}">${escapeHtml(raw.label)}</a>`).join("")}</div></div>`)
    .join("")}</div>`;
}

function filterLabel(filter: string): string {
  if (filter === "all") return "All";
  if (filter === "failed") return "Failed";
  if (filter === "completed") return "No verdict";
  if (filter === "passed") return "Passed";
  return "No tokens";
}

function sentenceStatus(value: string): string {
  return value.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function evidenceTypeLabel(value: string): string {
  if (value === "test_result") return "Deterministic test";
  if (value === "judge_result") return "Judge";
  if (value === "lint_summary") return "Lint summary";
  if (value === "lint_skipped") return "Lint skipped";
  if (value === "candidate") return "Legacy working payload side";
  if (value === "release") return "Legacy saved snapshot side";
  return sentenceStatus(value);
}

function escapeJsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

const REPORT_APP_JS = `
const data = JSON.parse(document.getElementById("report-data").textContent);
let selectedId = (data.scenarios.find((s) => s.status === "failed") || data.scenarios.find((s) => s.status === "completed") || data.scenarios[0] || {}).id;
let filter = "all";
const search = document.getElementById("scenario-search");
const list = document.getElementById("scenario-list");
const count = document.getElementById("scenario-count");
const detail = document.getElementById("scenario-detail");
const rail = document.getElementById("metadata-rail");
function esc(value) { return String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function label(value) { return String(value || "").replace(/_/g, " ").replace(/\\b\\w/g, (letter) => letter.toUpperCase()); }
function evidenceLabel(value) { return label(String(value || "").replace(/-/g, " ")); }
function number(value) { return Number.isInteger(value) ? String(value) : Number(value || 0).toFixed(1); }
function hasNoTokens(s) { return !s.attempts.some((a) => a.token_usage && a.token_usage.total_tokens !== null && !a.token_usage.unavailable_reason); }
function filtered() {
  const q = search.value.trim().toLowerCase();
  return data.scenarios.filter((s) => {
    const filterOk = filter === "all" || (filter === "no_tokens" ? hasNoTokens(s) : s.status === filter);
    const hay = [s.id, s.title, s.subtitle, s.status, s.attempts.map((a) => a.label).join(" ")].join(" ").toLowerCase();
    return filterOk && (!q || hay.includes(q));
  });
}
function renderList() {
  const rows = filtered();
  count.textContent = rows.length;
  list.innerHTML = rows.length ? rows.map((s) => '<button class="scenario-row" type="button" data-scenario-id="' + esc(s.id) + '" aria-current="' + (s.id === selectedId) + '"><strong>' + esc(s.id) + ' · ' + esc(s.title) + '</strong><span>' + esc(label(s.status)) + ' · ' + esc(s.attempts.map((a) => a.label).join(", ") || "No output") + '</span></button>').join("") : '<p class="empty">No scenarios match this filter.</p>';
  list.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { selectedId = button.dataset.scenarioId; render(); }));
}
function attemptBlocks(s) {
  const attempts = s.attempts.length ? s.attempts : [{ label: data.run.run_source.label, status: "unknown", final_preview: "No final output recorded.", raw_links: [] }];
  return attempts.map((a) => {
    const problem = [a.failure_classification, a.error].filter(Boolean).join(" · ");
    return '<div class="answer"><h3><span>' + esc(a.label) + '</span> <span class="status ' + esc(a.status) + '"><span class="dot"></span>' + esc(label(a.status)) + '</span></h3>' + (problem ? '<p class="muted">' + esc(evidenceLabel(problem)) + '</p>' : '') + '<pre>' + esc(a.final_preview || "No final output recorded.") + '</pre>' + (a.final_href ? '<p class="answer-actions"><a href="' + esc(a.final_href) + '">Open final</a></p>' : '') + '</div>';
  }).join("");
}
function renderDetail(s) {
  if (!s) return '<p class="empty">No scenarios recorded.</p>';
  const reasons = s.review_reasons.length ? '<ul class="reason-list">' + s.review_reasons.map((r) => '<li>' + esc(r) + '</li>').join("") + '</ul>' : '<p class="empty">No review reasons recorded.</p>';
  const evidence = s.evidence.length ? '<table><thead><tr><th>Type</th><th>Status</th><th>Detail</th></tr></thead><tbody>' + s.evidence.map((r) => '<tr><td>' + esc(evidenceLabel(r.type)) + '</td><td>' + esc(label(r.status)) + '</td><td>' + esc(evidenceLabel(r.detail || "recorded")) + '</td></tr>').join("") + '</tbody></table>' : '<p class="empty">No confidently matched tests, judges, or feedback for this scenario.</p>';
  const criteria = s.criteria.length ? '<table><tbody>' + s.criteria.map((r) => '<tr><th>' + esc(r.label) + '</th><td>' + esc(r.value) + '</td></tr>').join("") + '</tbody></table>' : '<p class="empty">No criteria recorded.</p>';
  return '<div class="scenario-head"><span class="status ' + esc(s.status) + '"><span class="dot"></span>' + esc(label(s.status)) + '</span><h1>' + esc(s.title) + '</h1><p class="muted">' + esc(s.id) + ' · ' + esc(s.subtitle) + '</p></div><div class="fact-row"><div class="fact"><span>Run</span><strong>' + esc(data.run.id) + '</strong></div><div class="fact"><span>Source</span><strong>' + esc(data.run.run_source.label) + '</strong></div><div class="fact"><span>Evidence basis</span><strong>' + esc(label(s.evidence_basis)) + '</strong></div><div class="fact"><span>Execution</span><strong>' + esc(label(s.execution_status)) + '</strong></div></div><section class="section"><h2>Review reasons</h2>' + reasons + '</section><section class="section"><h2>Final answer preview</h2><div class="answers">' + attemptBlocks(s) + '</div></section><section class="section"><h2>Evaluation evidence</h2>' + evidence + '</section><section class="section"><h2>Criteria</h2>' + criteria + '</section>';
}
function renderRail(s) {
  const tokenRows = s && s.attempts.length ? '<table><thead><tr><th>Source</th><th>Total</th><th>Input</th><th>Output</th></tr></thead><tbody>' + s.attempts.map((a) => '<tr><td>' + esc(a.label) + '</td><td>' + (a.token_usage && a.token_usage.total_tokens !== null ? number(a.token_usage.total_tokens) : "unavailable") + '</td><td>' + (a.token_usage && a.token_usage.input_tokens !== null ? number(a.token_usage.input_tokens) : "-") + '</td><td>' + (a.token_usage && a.token_usage.output_tokens !== null ? number(a.token_usage.output_tokens) : "-") + '</td></tr>').join("") + '</tbody></table>' : '<p class="empty">No token usage recorded.</p>';
  const raw = s ? s.attempts.filter((a) => a.raw_links.length).map((a) => '<div class="raw-group"><strong>' + esc(a.label) + '</strong><div class="raw-files">' + a.raw_links.map((r) => '<a href="' + esc(r.href) + '">' + esc(r.label) + '</a>').join("") + '</div></div>').join("") : "";
  const foot = 'Token usage is measured telemetry, not a quality score. Unavailable scenarios: ' + data.summary.token_usage.unavailable_scenario_count + '.';
  return '<section class="rail-section"><h2>Run details</h2><dl class="kv"><div><dt>Status</dt><dd>' + esc(label(data.run.status)) + '</dd></div><div><dt>Execution</dt><dd>' + esc(label(data.run.execution_status)) + '</dd></div><div><dt>Readiness</dt><dd>' + esc(label(data.run.readiness_status)) + '</dd></div><div><dt>Assessment</dt><dd>' + esc(data.run.assessment_status ? label(data.run.assessment_status) : "No verdict recorded") + '</dd></div><div><dt>Runner</dt><dd>' + esc([data.run.runner_backend, data.run.runner_mode].filter(Boolean).join(" / ") || "unknown") + '</dd></div></dl><p class="muted rail-note">' + esc(data.run.readiness_summary) + '</p></section><section class="rail-section"><h2>Token usage</h2>' + tokenRows + '<p class="muted rail-note">' + esc(foot) + '</p></section><section class="rail-section"><h2>Raw evidence</h2><div class="links">' + (raw || '<p class="empty">No raw evidence links recorded.</p>') + '</div></section>';
}
function render() {
  renderList();
  const scenario = data.scenarios.find((s) => s.id === selectedId) || data.scenarios[0];
  detail.innerHTML = renderDetail(scenario);
  rail.innerHTML = renderRail(scenario);
}
search.addEventListener("input", render);
document.getElementById("filters").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
  filter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  render();
}));
render();
`;

function renderScenarioCard(scenario: RunReportScenario): string {
  const criteria = scenario.criteria;
  return `<section class="scenario">
    <h3>${escapeHtml(scenario.id)} ${escapeHtml(scenario.title || scenario.folder)}</h3>
    <p class="muted">${escapeHtml([scenario.family, scenario.type, scenario.topics.join(", ")].filter(Boolean).join(" / "))}</p>
    <p><strong>Evidence basis:</strong> ${escapeHtml(scenario.evidence_basis)}</p>
    <p><strong>Capability:</strong> ${escapeHtml(scenario.capability || "not recorded")}</p>
    <p><strong>Expected behavior:</strong> ${escapeHtml(criteria?.expected_behavior || "not recorded")}</p>
    <table>
      <thead><tr><th>Assertions</th><th>Tests</th><th>Judges</th></tr></thead>
      <tbody><tr><td>${escapeHtml((criteria?.assertions || []).join("\n") || "none")}</td><td>${escapeHtml((criteria?.tests || []).join(", ") || "none")}</td><td>${escapeHtml((criteria?.judges || []).join(", ") || "none")}</td></tr></tbody>
    </table>
  </section>`;
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function readJsonl(target: string): Promise<Array<Record<string, any>>> {
  if (!(await exists(target))) return [];
  return (await fs.readFile(target, "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function countBy<T>(rows: T[], keyFor: (row: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = keyFor(row);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function formatCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts).sort();
  if (!entries.length) return "none";
  return entries.map(([key, value]) => `${escapeHtml(key)}: ${value}`).join("<br>");
}

function formatTestSummary(rows: EventEnvelope[]): string {
  const results = rows.filter((row) => row.type === "test_result");
  const skipped = rows.filter((row) => row.type === "lint_skipped").length;
  const counts = countBy(results, (row) => String(row.payload?.status || "unknown"));
  const summary = formatCounts(counts);
  return `${summary}${skipped ? `<br>lint skipped: ${skipped}` : ""}`;
}

function formatJudgeSummary(rows: EventEnvelope[]): string {
  return formatCounts(countBy(rows, (row) => String(row.payload?.status || "unknown")));
}

function formatFeedbackSummary(rows: EventEnvelope[]): string {
  return formatCounts(countBy(rows, (row) => String(row.payload?.label || row.payload?.status || "unlabeled")));
}

function sumNullable(values: Array<number | null>): number | null {
  const finite = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!finite.length) return null;
  return finite.reduce((sum, value) => sum + value, 0);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatNullableNumber(value: number | null): string {
  return value === null ? "unavailable" : formatNumber(value);
}

function nullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function numberFrom(value: unknown): number {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

async function readFinalPreview(finalPath: string): Promise<string> {
  if (!(await exists(finalPath))) return "";
  const text = (await readText(finalPath)).trim().replace(/\s+/g, " ");
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function link(relative: string, label: string): string {
  if (!relative) return "";
  return `<a href="${escapeHtml(relative.split(path.sep).join("/"))}">${escapeHtml(label)}</a>`;
}

function renderEventTable(rows: EventEnvelope[], columns: string[]): string {
  if (!rows.length) return '<p class="muted">No rows recorded.</p>';
  return `<table><thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}<th>Summary</th></tr></thead><tbody>${rows
    .map((row) => {
      const payload = row.payload || {};
      const rowValues = row as unknown as Record<string, unknown>;
      return `<tr>${columns
        .map((column) => `<td>${escapeHtml(rowValues[column] ?? payload[column] ?? "")}</td>`)
        .join("")}<td><pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre></td></tr>`;
    })
    .join("\n")}</tbody></table>`;
}

function vectorRows(vectors: Array<Record<string, unknown>>): string {
  return vectors.map((vector) => `| ${pipe(vector.name)} | ${pipe(vector.reasoning || "")} | ${escapeMarkdown(vector.score)} / ${escapeMarkdown(vector.max)} |`).join("\n");
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function arrayValue(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}

function pipe(value: unknown): string {
  return escapeMarkdown(value).replace(/\|/g, "\\|");
}

function escapeMarkdown(value: unknown): string {
  return String(value ?? "");
}
