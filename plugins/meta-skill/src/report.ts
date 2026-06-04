import { promises as fs } from "node:fs";
import path from "node:path";
import type { EvalRunSource, EventEnvelope, LegacyEvalSide, RunIndex, RunIndexRow, RunReadiness, RunReport, RunReportAttempt, RunReportCase, RunTokenUsageSummary, TokenUsage, TokenUsageEvidence } from "./models";
import { exists, readJson, readText, utcNow, writeJson, writeText } from "./project";
import { readCase } from "./eval/cases";

export async function materializeEvalRunReport(runRoot: string, options: { updateIndex?: boolean } = {}): Promise<{ report: string; reportJson: string; runId: string; data: RunReport }> {
  const report = await buildRunReport(runRoot);
  const jsonPath = path.join(runRoot, "report.json");
  await writeJson(jsonPath, report);
  if (options.updateIndex !== false) await updateRunsIndex(path.dirname(runRoot));
  return { report: jsonPath, reportJson: jsonPath, runId: report.summary.run_id, data: report };
}

export async function writeEvalReport(runRoot: string): Promise<string> {
  return (await materializeEvalRunReport(runRoot)).report;
}

export async function buildRunReport(runRoot: string): Promise<RunReport> {
  const runJson = await readJson<Record<string, unknown>>(path.join(runRoot, "run.json"));
  const caseRows = (await readJsonl(path.join(runRoot, "results.jsonl"))).filter((row) => row.type === "case_result");
  const testRows = (await readJsonl(path.join(runRoot, "tests.jsonl"))).filter((row) => row.type === "test_result" || row.type === "lint_summary" || row.type === "lint_skipped") as EventEnvelope[];
  const judgeRows = (await readJsonl(path.join(runRoot, "grades.jsonl"))).filter((row) => row.type === "judge_result") as EventEnvelope[];
  const feedbackRows = (await readJsonl(path.join(runRoot, "feedback.jsonl"))) as EventEnvelope[];
  const byFolder = new Map<string, EventEnvelope[]>();
  for (const row of caseRows as EventEnvelope[]) {
    const folder = String(row.payload?.case_folder || row.case_id || "unknown");
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder)?.push(row);
  }

  const cases: RunReportCase[] = [];
  for (const [folder, rows] of [...byFolder.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const snapshot = await readCaseSnapshot(runRoot, folder);
    const caseId = snapshot?.id || String(rows[0]?.case_id || folder.split("-")[0]);
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
    const verdict = verdictForCaseEvidence(caseId, folder, attempts, testRows, judgeRows, feedbackRows);
    const executionStatus = caseExecutionStatus(attempts);
    const status = caseStatus(executionStatus, verdict);
    cases.push({
      id: caseId,
      folder,
      title: snapshot?.metadata?.title,
      type: snapshot?.type,
      topics: snapshot?.metadata?.topics || [],
      capability: snapshot?.metadata?.capability || null,
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

  const failureClassifications = derivedFailureClassifications(runJson, testRows, judgeRows, caseRows as EventEnvelope[]);
  const noVerdictCount = cases.reduce((sum, item) => sum + (item.no_verdict_recorded ? 1 : 0), 0);
  const counts = evidenceCounts(testRows, judgeRows, feedbackRows);
  const tokenUsage = countTokenUsage(cases);
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
      case_count: cases.length,
      attempt_count: cases.reduce((sum, item) => sum + item.attempts.length, 0),
      result_count: caseRows.length,
      run_source: runSource,
      failure_classifications: failureClassifications,
      execution_status: executionStatus,
      ...(assessmentStatus ? { assessment_status: assessmentStatus } : {}),
      no_verdict_count: noVerdictCount,
      evidence_counts: counts,
      token_usage: tokenUsage
    },
    cases,
    tests: testRows,
    judges: judgeRows,
    feedback: feedbackRows,
    readiness
  };
}

function derivedFailureClassifications(runJson: Record<string, unknown>, tests: EventEnvelope[], judges: EventEnvelope[], cases: EventEnvelope[]): string[] {
  const failures = new Set(Array.isArray(runJson.failure_classifications) ? runJson.failure_classifications.map(String) : []);
  for (const row of cases) {
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

async function readCaseSnapshot(
  runRoot: string,
  folder: string
): Promise<
  | {
      basis: "run_snapshot";
      id: string;
      type: string;
      metadata: {
        title?: string;
        topics?: string[];
        capability?: string;
        metadata?: Record<string, unknown>;
      };
      criteria: {
        what_it_tests?: string;
        expected_behavior?: string;
        assertions?: string[];
        tests?: string[];
        judges?: Array<{ id: string }>;
      };
    }
  | undefined
> {
  const snapshot = path.join(runRoot, "snapshots", folder);
  if (!(await exists(path.join(snapshot, "item.md")))) return undefined;
  const item = await readCase(snapshot, folder);
  return {
    basis: "run_snapshot",
    id: item.id,
    type: item.type,
    metadata: item.metadata,
    criteria: item.criteria
  };
}

function caseExecutionStatus(attempts: RunReportAttempt[]): "completed" | "errored" | "unknown" {
  if (attempts.some((attempt) => attempt.execution_status === "errored")) return "errored";
  if (attempts.some((attempt) => attempt.execution_status === "completed")) return "completed";
  return "unknown";
}

function caseStatus(executionStatus: string, verdict?: "passed" | "failed"): string {
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

function countTokenUsage(cases: RunReportCase[]): RunTokenUsageSummary {
  const attempts = cases.flatMap((item) => item.attempts.map((attempt) => ({ item, attempt })));
  const available = attempts.filter(({ attempt }) => attempt.token_usage?.total_tokens !== null && attempt.token_usage?.total_tokens !== undefined && !attempt.token_usage.unavailable_reason);
  const unavailable = attempts.filter(({ attempt }) => !attempt.token_usage || attempt.token_usage.total_tokens === null || attempt.token_usage.unavailable_reason);
  return {
    input_tokens: sumNullable(available.map(({ attempt }) => attempt.token_usage?.input_tokens ?? null)),
    output_tokens: sumNullable(available.map(({ attempt }) => attempt.token_usage?.output_tokens ?? null)),
    total_tokens: sumNullable(available.map(({ attempt }) => attempt.token_usage?.total_tokens ?? null)),
    case_count: cases.length,
    unavailable_case_count: unavailable.length
  };
}

async function readAttemptTokenUsage(runRoot: string, evidencePath: string): Promise<TokenUsage | undefined> {
  const usagePath = evidencePath ? path.join(runRoot, evidencePath, "usage.json") : "";
  if (usagePath && (await exists(usagePath))) {
    const evidence = await readJson<TokenUsageEvidence>(usagePath);
    return normalizeTokenUsage(evidence);
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
  return {
    input_tokens: nullableNumber(object.input_tokens),
    output_tokens: nullableNumber(object.output_tokens),
    total_tokens: nullableNumber(object.total_tokens),
    case_count: numberFrom(object.case_count),
    unavailable_case_count: numberFrom(object.unavailable_case_count)
  };
}

function normalizeRunSource(value: unknown, legacySide?: LegacyEvalSide): EvalRunSource {
  const object = objectValue(value);
  if (typeof object.kind === "string") {
    return {
      kind: object.kind,
      label: typeof object.label === "string" ? object.label : sentenceStatus(object.kind),
      skill_root: typeof object.skill_root === "string" || object.skill_root === null ? object.skill_root : undefined,
      skill_activation: normalizeSkillActivation(object.skill_activation)
    };
  }
  if (legacySide === "release") return { kind: "legacy_side", label: "Legacy saved snapshot side", skill_root: "../../../versions/release/skill", skill_activation: "forced" };
  return { kind: legacySide ? "legacy_side" : "working_payload", label: legacySide ? "Legacy working payload side" : "Working payload", skill_root: "../../../..", skill_activation: "forced" };
}

function normalizeSkillActivation(value: unknown): EvalRunSource["skill_activation"] {
  return value === "none" || value === "discoverable" ? value : "forced";
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

function verdictForCaseEvidence(caseId: string, folder: string, attempts: RunReportAttempt[], tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): "passed" | "failed" | undefined {
  if (attempts.some((attempt) => attempt.execution_status === "errored")) return "failed";
  if (attempts.some((attempt) => attempt.verdict === "failed")) return "failed";
  if (caseEvidenceRows(caseId, folder, tests, judges, feedback).some((row) => evidenceStatus(row) === "failed")) return "failed";
  if (attempts.some((attempt) => attempt.verdict === "passed")) return "passed";
  if (caseEvidenceRows(caseId, folder, tests, judges, feedback).some((row) => evidenceStatus(row) === "passed")) return "passed";
  return undefined;
}

function caseEvidenceRows(caseId: string, folder: string, tests: EventEnvelope[], judges: EventEnvelope[], feedback: EventEnvelope[]): EventEnvelope[] {
  return [...tests, ...judges, ...feedback].filter((row) => eventMatchesCaseKeys(row, caseId, folder));
}

function eventMatchesCaseKeys(row: EventEnvelope, caseId: string, folder: string): boolean {
  const payload = row.payload || {};
  const candidates = [row.case_id, payload.case_id, payload.case_folder, payload.folder, payload.id].filter((value) => value !== undefined && value !== null).map(String);
  return candidates.includes(caseId) || candidates.includes(folder);
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
    case_count: normalized.summary.case_count,
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
    case_count: Array.isArray((run.cases as { selection?: unknown[] } | undefined)?.selection) ? ((run.cases as { selection: unknown[] }).selection || []).length : 0,
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
    case_count: numberFrom(row.case_count),
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
  const cases = Array.isArray(report.cases) ? report.cases.map(normalizeRunReportCaseForRead) : [];
  const failureClassifications = Array.isArray(summary.failure_classifications) ? summary.failure_classifications.map(String) : [];
  const status = String(summary.status || run.status || "unknown");
  const noVerdictCount = summary.no_verdict_count !== undefined ? numberFrom(summary.no_verdict_count) : summary.unresolved_count !== undefined ? numberFrom(summary.unresolved_count) : cases.reduce((sum, item) => sum + (item.no_verdict_recorded ? 1 : 0), 0);
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
      case_count: summary.case_count !== undefined ? numberFrom(summary.case_count) : cases.length,
      attempt_count: summary.attempt_count !== undefined ? numberFrom(summary.attempt_count) : cases.reduce((sum, item) => sum + item.attempts.length, 0),
      result_count: numberFrom(summary.result_count),
      run_source: normalizeRunSource(summary.run_source),
      failure_classifications: failureClassifications,
      execution_status: String(summary.execution_status || runExecutionStatus(status)) as RunReport["summary"]["execution_status"],
      ...(assessmentStatus ? { assessment_status: assessmentStatus } : {}),
      no_verdict_count: noVerdictCount,
      evidence_counts: evidenceCountSummary,
      token_usage: normalizeRunTokenUsageSummary(summary.token_usage)
    },
    cases,
    tests: Array.isArray(report.tests) ? report.tests : [],
    judges: Array.isArray(report.judges) ? report.judges : [],
    feedback: Array.isArray(report.feedback) ? report.feedback : [],
    readiness
  };
}

function normalizeRunReportCaseForRead(value: unknown): RunReportCase {
  const item = objectValue(value);
  const rawAttempts = Array.isArray(item.attempts) ? item.attempts : Array.isArray(item.sides) ? item.sides : [];
  const attempts = rawAttempts.map(normalizeRunReportAttemptForRead);
  const verdict = item.verdict === "passed" || item.verdict === "failed" ? (String(item.verdict) as "passed" | "failed") : attempts.find((attempt) => attempt.verdict)?.verdict;
  const executionStatus = String(item.execution_status || caseExecutionStatus(attempts));
  const status = String(item.status || caseStatus(executionStatus, verdict));
  return {
    id: String(item.id || item.folder || "unknown"),
    folder: String(item.folder || item.id || "unknown"),
    title: item.title ? String(item.title) : undefined,
    type: item.type ? String(item.type) : undefined,
    topics: Array.isArray(item.topics) ? item.topics.map(String) : [],
    capability: (item.capability as string | null | undefined) || null,
    criteria: normalizeCaseCriteriaForRead(item.criteria),
    metadata: objectValue(item.metadata),
    evidence_basis: ["run_snapshot", "legacy_current_project", "unavailable"].includes(String(item.evidence_basis)) ? (String(item.evidence_basis) as RunReportCase["evidence_basis"]) : "unavailable",
    attempts,
    status,
    execution_status: executionStatus,
    ...(verdict ? { verdict } : {}),
    no_verdict_recorded: item.no_verdict_recorded !== undefined ? Boolean(item.no_verdict_recorded) : Boolean(item.unresolved) || status === "needs_review" || attempts.some((attempt) => !attempt.verdict && attempt.execution_status === "completed")
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

function normalizeCaseCriteriaForRead(value: unknown): RunReportCase["criteria"] {
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

function sentenceStatus(value: string): string {
  return value.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function readJsonl(target: string): Promise<Array<Record<string, any>>> {
  if (!(await exists(target))) return [];
  return (await fs.readFile(target, "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function sumNullable(values: Array<number | null>): number | null {
  const finite = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!finite.length) return null;
  return finite.reduce((sum, value) => sum + value, 0);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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
