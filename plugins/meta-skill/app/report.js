"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.materializeEvalRunReport = materializeEvalRunReport;
exports.writeEvalReport = writeEvalReport;
exports.buildRunReport = buildRunReport;
exports.updateRunsIndex = updateRunsIndex;
exports.materializeReviewReport = materializeReviewReport;
exports.writeReviewReport = writeReviewReport;
exports.renderReviewReportMarkdown = renderReviewReportMarkdown;
exports.indexRowFromReport = indexRowFromReport;
exports.indexRowFromRun = indexRowFromRun;
exports.normalizeRunIndexRowForRead = normalizeRunIndexRowForRead;
exports.normalizeRunReportForRead = normalizeRunReportForRead;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("./project");
const cases_1 = require("./eval/cases");
async function materializeEvalRunReport(runRoot, options = {}) {
    const report = await buildRunReport(runRoot);
    const jsonPath = node_path_1.default.join(runRoot, "report.json");
    await (0, project_1.writeJson)(jsonPath, report);
    if (options.updateIndex !== false)
        await updateRunsIndex(node_path_1.default.dirname(runRoot));
    return { report: jsonPath, reportJson: jsonPath, runId: report.summary.run_id, data: report };
}
async function writeEvalReport(runRoot) {
    return (await materializeEvalRunReport(runRoot)).report;
}
async function buildRunReport(runRoot) {
    const runJson = await (0, project_1.readJson)(node_path_1.default.join(runRoot, "run.json"));
    const caseRows = (await readJsonl(node_path_1.default.join(runRoot, "results.jsonl"))).filter((row) => row.type === "case_result");
    const testRows = (await readJsonl(node_path_1.default.join(runRoot, "tests.jsonl"))).filter((row) => row.type === "test_result" || row.type === "lint_summary" || row.type === "lint_skipped");
    const judgeRows = (await readJsonl(node_path_1.default.join(runRoot, "grades.jsonl"))).filter((row) => row.type === "judge_result");
    const feedbackRows = (await readJsonl(node_path_1.default.join(runRoot, "feedback.jsonl")));
    const byFolder = new Map();
    for (const row of caseRows) {
        const folder = String(row.payload?.case_folder || row.case_id || "unknown");
        if (!byFolder.has(folder))
            byFolder.set(folder, []);
        byFolder.get(folder)?.push(row);
    }
    const cases = [];
    for (const [folder, rows] of [...byFolder.entries()].sort(([a], [b]) => a.localeCompare(b))) {
        const snapshot = await readCaseSnapshot(runRoot, folder);
        const caseId = snapshot?.id || String(rows[0]?.case_id || folder.split("-")[0]);
        const attempts = await Promise.all(rows.map(async (row) => {
            const legacySide = row.side;
            const evidencePath = String(row.payload?.evidence_path || "");
            const finalPath = evidencePath ? node_path_1.default.join(evidencePath, "final.md") : undefined;
            const tokenUsage = await readAttemptTokenUsage(runRoot, evidencePath);
            const verdict = verdictFromPayload(row.payload);
            return {
                run_source: normalizeRunSource(row.payload?.run_source, legacySide),
                execution_status: executionStatusFromPayload(row.payload),
                ...(verdict ? { verdict } : {}),
                evidence_path: evidencePath,
                final_path: finalPath,
                final_preview: evidencePath ? await readFinalPreview(node_path_1.default.join(runRoot, evidencePath, "final.md")) : "",
                token_usage: tokenUsage,
                failure_classification: row.payload?.failure_classification || null,
                error: row.payload?.error ? String(row.payload.error) : undefined,
                raw: row.payload,
                ...(legacySide ? { legacy_side: legacySide } : {})
            };
        }));
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
    const failureClassifications = derivedFailureClassifications(runJson, testRows, judgeRows, caseRows);
    const noVerdictCount = cases.reduce((sum, item) => sum + (item.no_verdict_recorded ? 1 : 0), 0);
    const counts = evidenceCounts(testRows, judgeRows, feedbackRows);
    const tokenUsage = countTokenUsage(cases);
    const assessmentStatus = assessmentStatusFor(failureClassifications, noVerdictCount, testRows, judgeRows, feedbackRows);
    const readiness = readinessFor(assessmentStatus, failureClassifications, noVerdictCount, counts);
    const runSource = normalizeRunSource(runJson.run_source);
    const executionStatus = runExecutionStatus(String(runJson.status || "unknown"));
    return {
        schema_version: 2,
        generated_at: (0, project_1.utcNow)(),
        run: runJson,
        summary: {
            run_id: String(runJson.run_id || node_path_1.default.basename(runRoot)),
            label: runJson.label || null,
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
function derivedFailureClassifications(runJson, tests, judges, cases) {
    const failures = new Set(Array.isArray(runJson.failure_classifications) ? runJson.failure_classifications.map(String) : []);
    for (const row of cases) {
        const classification = row.payload?.failure_classification;
        if (classification)
            failures.add(String(classification));
    }
    for (const row of tests) {
        if (row.type === "test_result" && row.payload?.status === "failed")
            failures.add("lint_test_failure");
    }
    for (const row of judges) {
        if (row.payload?.status === "failed")
            failures.add("judge_failure");
        if (row.payload?.status === "unavailable" && row.payload?.failure_classification)
            failures.add(String(row.payload.failure_classification));
    }
    return [...failures].sort();
}
function assessmentStatusFor(failureClassifications, noVerdictCount, tests, judges, feedback) {
    if (failureClassifications.length || hasFailedEvidence(tests, judges, feedback))
        return "failed";
    if (noVerdictCount)
        return undefined;
    if (hasPassedEvidence(tests, judges, feedback))
        return "passed";
    return undefined;
}
async function updateRunsIndex(runsRoot) {
    const rows = [];
    if (await (0, project_1.exists)(runsRoot)) {
        const dirs = (await node_fs_1.promises.readdir(runsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
        for (const dir of dirs) {
            const runRoot = node_path_1.default.join(runsRoot, dir.name);
            const reportPath = node_path_1.default.join(runRoot, "report.json");
            const runPath = node_path_1.default.join(runRoot, "run.json");
            if (await (0, project_1.exists)(reportPath)) {
                const report = await (0, project_1.readJson)(reportPath);
                rows.push(indexRowFromReport(report));
            }
            else if (await (0, project_1.exists)(runPath)) {
                const run = await (0, project_1.readJson)(runPath);
                rows.push(indexRowFromRun(run, dir.name));
            }
        }
    }
    rows.sort((a, b) => String(a.run_id).localeCompare(String(b.run_id)));
    const index = { schema_version: 1, updated_at: (0, project_1.utcNow)(), runs: rows };
    await (0, project_1.writeJson)(node_path_1.default.join(runsRoot, "index.json"), index);
    return index;
}
async function materializeReviewReport(reviewRoot, review) {
    const report = node_path_1.default.join(reviewRoot, "report.md");
    await (0, project_1.writeText)(report, renderReviewReportMarkdown(review));
    return report;
}
async function writeReviewReport(reviewRoot, review) {
    return materializeReviewReport(reviewRoot, review);
}
function renderReviewReportMarkdown(review) {
    const quality = objectValue(review.quality);
    const discovery = objectValue(review.discovery);
    const implementation = objectValue(review.implementation);
    const validation = objectValue(review.validation);
    const reviewer = objectValue(review.reviewer);
    const discoveryRows = vectorRows(arrayValue(discovery.vectors));
    const implementationRows = vectorRows(arrayValue(implementation.vectors));
    const validationRows = arrayValue(validation.checks)
        .map((check) => `| ${pipe(check.name)} | ${pipe(check.message || "")} | ${pipe(check.status)} |`)
        .join("\n");
    const suggestions = arrayValue(review.suggestions)
        .map((item, index) => `${index + 1}. **${pipe(item.priority || "medium")}** ${pipe(item.vector || "general")}: ${pipe(item.issue || "")}\n\n   Suggested fix: ${pipe(item.suggested_fix || "")}`)
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
async function readCaseSnapshot(runRoot, folder) {
    const snapshot = node_path_1.default.join(runRoot, "snapshots", folder);
    if (!(await (0, project_1.exists)(node_path_1.default.join(snapshot, "item.md"))))
        return undefined;
    const item = await (0, cases_1.readCase)(snapshot, folder);
    return {
        basis: "run_snapshot",
        id: item.id,
        type: item.type,
        metadata: item.metadata,
        criteria: item.criteria
    };
}
function caseExecutionStatus(attempts) {
    if (attempts.some((attempt) => attempt.execution_status === "errored"))
        return "errored";
    if (attempts.some((attempt) => attempt.execution_status === "completed"))
        return "completed";
    return "unknown";
}
function caseStatus(executionStatus, verdict) {
    if (executionStatus === "errored")
        return "failed";
    return verdict || executionStatus || "unknown";
}
function readinessFor(assessmentStatus, failureClassifications, noVerdictCount, counts) {
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
function countTokenUsage(cases) {
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
async function readAttemptTokenUsage(runRoot, evidencePath) {
    const usagePath = evidencePath ? node_path_1.default.join(runRoot, evidencePath, "usage.json") : "";
    if (usagePath && (await (0, project_1.exists)(usagePath))) {
        const evidence = await (0, project_1.readJson)(usagePath);
        return normalizeTokenUsage(evidence);
    }
    return undefined;
}
function normalizeTokenUsage(value) {
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
function normalizeOptionalTokenUsage(value) {
    const object = objectValue(value);
    return Object.keys(object).length ? normalizeTokenUsage(object) : undefined;
}
function normalizeRunTokenUsageSummary(value) {
    const object = objectValue(value);
    return {
        input_tokens: nullableNumber(object.input_tokens),
        output_tokens: nullableNumber(object.output_tokens),
        total_tokens: nullableNumber(object.total_tokens),
        case_count: numberFrom(object.case_count),
        unavailable_case_count: numberFrom(object.unavailable_case_count)
    };
}
function normalizeRunSource(value, legacySide) {
    const object = objectValue(value);
    if (typeof object.kind === "string") {
        return {
            kind: object.kind,
            label: typeof object.label === "string" ? object.label : sentenceStatus(object.kind),
            skill_root: typeof object.skill_root === "string" || object.skill_root === null ? object.skill_root : undefined,
            skill_activation: normalizeSkillActivation(object.skill_activation)
        };
    }
    if (legacySide === "release")
        return { kind: "legacy_side", label: "Legacy saved snapshot side", skill_root: "../../../versions/release/skill", skill_activation: "forced" };
    return { kind: legacySide ? "legacy_side" : "working_payload", label: legacySide ? "Legacy working payload side" : "Working payload", skill_root: "../../../..", skill_activation: "forced" };
}
function normalizeSkillActivation(value) {
    return value === "none" || value === "discoverable" ? value : "forced";
}
function executionStatusFromPayload(value) {
    const payload = objectValue(value);
    const executionStatus = String(payload.execution_status || "");
    if (executionStatus === "completed" || executionStatus === "errored")
        return executionStatus;
    const legacyStatus = String(payload.status || "");
    if (legacyStatus === "errored")
        return "errored";
    if (legacyStatus === "passed" || legacyStatus === "failed" || legacyStatus === "needs_review")
        return "completed";
    return "unknown";
}
function verdictFromPayload(value) {
    const payload = objectValue(value);
    const verdict = String(payload.verdict || "");
    if (verdict === "passed" || verdict === "failed")
        return verdict;
    const legacyStatus = String(payload.status || "");
    if (legacyStatus === "passed" || legacyStatus === "failed")
        return legacyStatus;
    return undefined;
}
function runExecutionStatus(status) {
    if (status === "completed" || status === "passed" || status === "needs_review")
        return "completed";
    if (status === "failed")
        return "failed";
    if (status === "running")
        return "running";
    return "unknown";
}
function evidenceCounts(tests, judges, feedback) {
    return {
        tests: tests.filter((row) => row.type === "test_result").length,
        judges: judges.filter((row) => row.type === "judge_result").length,
        feedback: feedback.filter((row) => row.type === "human_feedback").length
    };
}
function verdictForCaseEvidence(caseId, folder, attempts, tests, judges, feedback) {
    if (attempts.some((attempt) => attempt.execution_status === "errored"))
        return "failed";
    if (attempts.some((attempt) => attempt.verdict === "failed"))
        return "failed";
    if (caseEvidenceRows(caseId, folder, tests, judges, feedback).some((row) => evidenceStatus(row) === "failed"))
        return "failed";
    if (attempts.some((attempt) => attempt.verdict === "passed"))
        return "passed";
    if (caseEvidenceRows(caseId, folder, tests, judges, feedback).some((row) => evidenceStatus(row) === "passed"))
        return "passed";
    return undefined;
}
function caseEvidenceRows(caseId, folder, tests, judges, feedback) {
    return [...tests, ...judges, ...feedback].filter((row) => eventMatchesCaseKeys(row, caseId, folder));
}
function eventMatchesCaseKeys(row, caseId, folder) {
    const payload = row.payload || {};
    const candidates = [row.case_id, payload.case_id, payload.case_folder, payload.folder, payload.id].filter((value) => value !== undefined && value !== null).map(String);
    return candidates.includes(caseId) || candidates.includes(folder);
}
function hasFailedEvidence(tests, judges, feedback) {
    return [...tests, ...judges, ...feedback].some((row) => evidenceStatus(row) === "failed");
}
function hasPassedEvidence(tests, judges, feedback) {
    return [...tests, ...judges, ...feedback].some((row) => evidenceStatus(row) === "passed");
}
function evidenceStatus(row) {
    const status = String(row.payload?.status || "");
    if (status === "passed" || status === "failed")
        return status;
    const label = String(row.payload?.label || "").toLowerCase();
    if (label === "pass" || label === "passed")
        return "passed";
    if (label === "fail" || label === "failed")
        return "failed";
    return undefined;
}
function indexRowFromReport(report) {
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
function indexRowFromRun(run, fallbackId) {
    const failures = Array.isArray(run.failure_classifications) ? run.failure_classifications.map(String) : [];
    return {
        run_id: String(run.run_id || fallbackId),
        label: run.label || null,
        status: String(run.status || "unknown"),
        created_at: run.created_at ? String(run.created_at) : undefined,
        completed_at: run.completed_at ? String(run.completed_at) : undefined,
        case_count: Array.isArray(run.cases?.selection) ? (run.cases.selection || []).length : 0,
        run_source: normalizeRunSource(run.run_source),
        failure_classifications: failures,
        execution_status: runExecutionStatus(String(run.status || "unknown")),
        assessment_status: run.status === "passed" || run.status === "failed" ? String(run.status) : undefined,
        no_verdict_count: run.status === "needs_review" || run.manual_review_required ? 1 : 0,
        readiness_status: failures.length ? "blocked" : "unknown"
    };
}
function normalizeRunIndexRowForRead(value) {
    const row = objectValue(value);
    const failures = Array.isArray(row.failure_classifications) ? row.failure_classifications.map(String) : [];
    const status = String(row.status || "unknown");
    return {
        run_id: String(row.run_id || ""),
        label: row.label || null,
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
function normalizeRunReportForRead(value) {
    const report = objectValue(value);
    const summary = objectValue(report.summary);
    const run = objectValue(report.run);
    const cases = Array.isArray(report.cases) ? report.cases.map(normalizeRunReportCaseForRead) : [];
    const failureClassifications = Array.isArray(summary.failure_classifications) ? summary.failure_classifications.map(String) : [];
    const status = String(summary.status || run.status || "unknown");
    const noVerdictCount = summary.no_verdict_count !== undefined ? numberFrom(summary.no_verdict_count) : summary.unresolved_count !== undefined ? numberFrom(summary.unresolved_count) : cases.reduce((sum, item) => sum + (item.no_verdict_recorded ? 1 : 0), 0);
    const assessmentStatus = summary.assessment_status === "passed" || summary.assessment_status === "failed" ? String(summary.assessment_status) : status === "passed" || status === "failed" ? status : undefined;
    const counts = objectValue(summary.evidence_counts);
    const evidenceCountSummary = {
        tests: numberFrom(counts.tests),
        judges: numberFrom(counts.judges),
        feedback: numberFrom(counts.feedback)
    };
    const readiness = normalizeRunReadinessForRead(report.readiness, assessmentStatus, failureClassifications, noVerdictCount, evidenceCountSummary);
    return {
        schema_version: 2,
        generated_at: typeof report.generated_at === "string" ? report.generated_at : (0, project_1.utcNow)(),
        run,
        summary: {
            run_id: String(summary.run_id || run.run_id || "unknown"),
            label: summary.label || null,
            status,
            created_at: summary.created_at ? String(summary.created_at) : undefined,
            completed_at: summary.completed_at ? String(summary.completed_at) : undefined,
            case_count: summary.case_count !== undefined ? numberFrom(summary.case_count) : cases.length,
            attempt_count: summary.attempt_count !== undefined ? numberFrom(summary.attempt_count) : cases.reduce((sum, item) => sum + item.attempts.length, 0),
            result_count: numberFrom(summary.result_count),
            run_source: normalizeRunSource(summary.run_source),
            failure_classifications: failureClassifications,
            execution_status: String(summary.execution_status || runExecutionStatus(status)),
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
function normalizeRunReportCaseForRead(value) {
    const item = objectValue(value);
    const rawAttempts = Array.isArray(item.attempts) ? item.attempts : Array.isArray(item.sides) ? item.sides : [];
    const attempts = rawAttempts.map(normalizeRunReportAttemptForRead);
    const verdict = item.verdict === "passed" || item.verdict === "failed" ? String(item.verdict) : attempts.find((attempt) => attempt.verdict)?.verdict;
    const executionStatus = String(item.execution_status || caseExecutionStatus(attempts));
    const status = String(item.status || caseStatus(executionStatus, verdict));
    return {
        id: String(item.id || item.folder || "unknown"),
        folder: String(item.folder || item.id || "unknown"),
        title: item.title ? String(item.title) : undefined,
        type: item.type ? String(item.type) : undefined,
        topics: Array.isArray(item.topics) ? item.topics.map(String) : [],
        capability: item.capability || null,
        criteria: normalizeCaseCriteriaForRead(item.criteria),
        metadata: objectValue(item.metadata),
        evidence_basis: ["run_snapshot", "legacy_current_project", "unavailable"].includes(String(item.evidence_basis)) ? String(item.evidence_basis) : "unavailable",
        attempts,
        status,
        execution_status: executionStatus,
        ...(verdict ? { verdict } : {}),
        no_verdict_recorded: item.no_verdict_recorded !== undefined ? Boolean(item.no_verdict_recorded) : Boolean(item.unresolved) || status === "needs_review" || attempts.some((attempt) => !attempt.verdict && attempt.execution_status === "completed")
    };
}
function normalizeRunReportAttemptForRead(value) {
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
        failure_classification: attempt.failure_classification || null,
        error: attempt.error ? String(attempt.error) : undefined,
        raw: objectValue(attempt.raw),
        ...(legacySide ? { legacy_side: legacySide } : {})
    };
}
function normalizeCaseCriteriaForRead(value) {
    const criteria = objectValue(value);
    if (!Object.keys(criteria).length)
        return undefined;
    return {
        what_it_tests: criteria.what_it_tests ? String(criteria.what_it_tests) : undefined,
        expected_behavior: criteria.expected_behavior ? String(criteria.expected_behavior) : undefined,
        assertions: Array.isArray(criteria.assertions) ? criteria.assertions.map(String) : [],
        tests: Array.isArray(criteria.tests) ? criteria.tests.map(String) : [],
        judges: Array.isArray(criteria.judges) ? criteria.judges.map(String) : []
    };
}
function normalizeRunReadinessForRead(value, assessmentStatus, failureClassifications, noVerdictCount, counts) {
    const readiness = objectValue(value);
    if (["ready", "blocked", "unknown"].includes(String(readiness.status))) {
        return {
            status: String(readiness.status),
            summary: String(readiness.summary || ""),
            blockers: Array.isArray(readiness.blockers) ? readiness.blockers.map(String) : [],
            no_verdict_count: readiness.no_verdict_count !== undefined ? numberFrom(readiness.no_verdict_count) : numberFrom(readiness.unresolved),
            basis: String(readiness.basis || "report.json")
        };
    }
    return readinessFor(assessmentStatus, failureClassifications, noVerdictCount, counts);
}
function legacySideFromValue(value) {
    return value === "candidate" || value === "release" ? value : undefined;
}
function normalizeReadinessStatusForRead(value, failures) {
    const status = String(value || "");
    if (status === "ready" || status === "blocked" || status === "unknown")
        return status;
    if (status === "needs_review")
        return "unknown";
    return failures.length ? "blocked" : "unknown";
}
function sentenceStatus(value) {
    return value.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
async function readJsonl(target) {
    if (!(await (0, project_1.exists)(target)))
        return [];
    return (await node_fs_1.promises.readFile(target, "utf8"))
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}
function sumNullable(values) {
    const finite = values.filter((value) => typeof value === "number" && Number.isFinite(value));
    if (!finite.length)
        return null;
    return finite.reduce((sum, value) => sum + value, 0);
}
function formatNumber(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
function nullableNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function numberFrom(value) {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number : 0;
}
async function readFinalPreview(finalPath) {
    if (!(await (0, project_1.exists)(finalPath)))
        return "";
    const text = (await (0, project_1.readText)(finalPath)).trim().replace(/\s+/g, " ");
    return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}
function vectorRows(vectors) {
    return vectors.map((vector) => `| ${pipe(vector.name)} | ${pipe(vector.reasoning || "")} | ${escapeMarkdown(vector.score)} / ${escapeMarkdown(vector.max)} |`).join("\n");
}
function objectValue(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function arrayValue(value) {
    return Array.isArray(value) ? value.filter((item) => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}
function pipe(value) {
    return escapeMarkdown(value).replace(/\|/g, "\\|");
}
function escapeMarkdown(value) {
    return String(value ?? "");
}
