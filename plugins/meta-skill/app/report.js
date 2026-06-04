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
exports.renderEvalReportHtml = renderEvalReportHtml;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("./project");
const cases_1 = require("./eval/cases");
async function materializeEvalRunReport(runRoot, options = {}) {
    const report = await buildRunReport(runRoot);
    const jsonPath = node_path_1.default.join(runRoot, "report.json");
    await (0, project_1.writeJson)(jsonPath, report);
    const htmlPath = node_path_1.default.join(runRoot, "report.html");
    await (0, project_1.writeText)(htmlPath, renderEvalReportHtml(report));
    if (options.updateIndex !== false)
        await updateRunsIndex(node_path_1.default.dirname(runRoot));
    return { report: htmlPath, reportJson: jsonPath, runId: report.summary.run_id, data: report };
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
function toReportAppModel(report) {
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
            case_count: report.summary.case_count,
            attempt_count: report.summary.attempt_count,
            result_count: report.summary.result_count,
            no_verdict_count: report.summary.no_verdict_count,
            failure_classifications: report.summary.failure_classifications,
            evidence_counts: report.summary.evidence_counts,
            token_usage: normalizeRunTokenUsageSummary(report.summary.token_usage)
        },
        cases: report.cases.map((item) => toReportAppCase(report, item))
    };
}
function toReportAppCase(report, item) {
    const evidence = evidenceRowsForCase(report, item);
    return {
        id: item.id,
        folder: item.folder,
        title: item.title || item.folder,
        subtitle: caseSubtitle(item),
        status: item.status,
        execution_status: item.execution_status,
        verdict: item.verdict,
        no_verdict_recorded: item.no_verdict_recorded,
        evidence_basis: item.evidence_basis,
        criteria: criteriaRowsForCase(item),
        attempts: attemptsForCase(item),
        evidence,
        review_reasons: reviewReasonsForCase(item, evidence)
    };
}
function caseSubtitle(item) {
    return [item.type, item.topics.join(", ")].filter(Boolean).join(" / ") || item.folder;
}
function attemptsForCase(item) {
    return item.attempts
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
function rawLinksForAttempt(attempt) {
    if (!attempt.evidence_path)
        return [];
    return ["final.md", "turns.jsonl", "usage.json", "rpc.jsonl"].map((file) => ({ label: file, href: `${attempt.evidence_path}/${file}`.split(node_path_1.default.sep).join("/") }));
}
function criteriaRowsForCase(item) {
    const criteria = item.criteria;
    if (!criteria)
        return [];
    return [
        { label: "What it tests", value: criteria.what_it_tests || "" },
        { label: "Expected behavior", value: criteria.expected_behavior || "" },
        { label: "Assertions", value: criteria.assertions.join("\n") },
        { label: "Tests", value: criteria.tests.join(", ") },
        { label: "Judges", value: criteria.judges.join(", ") }
    ].filter((row) => row.value);
}
function evidenceRowsForCase(report, item) {
    const rows = [];
    for (const attempt of item.attempts) {
        if (attempt.failure_classification || attempt.error)
            rows.push({ type: attempt.run_source.label, status: attempt.verdict || attempt.execution_status, detail: attempt.failure_classification || attempt.error || "" });
    }
    for (const row of [...report.tests, ...report.judges, ...report.feedback]) {
        if (!eventMatchesCase(row, item))
            continue;
        rows.push({
            type: evidenceTypeLabel(String(row.type || row.source || "evidence")),
            status: String(row.payload?.status || row.payload?.label || "recorded"),
            detail: String(row.payload?.id || row.payload?.failure_classification || row.payload?.reason || row.payload?.message || row.source || "")
        });
    }
    return rows;
}
function eventMatchesCase(row, item) {
    const payload = row.payload || {};
    const candidates = [row.case_id, payload.case_id, payload.case_folder, payload.folder, payload.id].filter((value) => value !== undefined && value !== null).map(String);
    return candidates.includes(item.id) || candidates.includes(item.folder);
}
function reviewReasonsForCase(item, evidence) {
    const reasons = new Set();
    if (item.status === "failed")
        reasons.add("Failed case evidence needs attention first.");
    if (item.no_verdict_recorded)
        reasons.add("Execution completed; no deterministic test, judge, or human feedback verdict is recorded for this item.");
    for (const row of evidence) {
        if (row.status === "failed" || row.status === "unavailable")
            reasons.add(`${sentenceStatus(row.status)} evidence: ${sentenceStatus(row.detail || row.type)}`);
    }
    for (const attempt of item.attempts) {
        if (attempt.error)
            reasons.add(attempt.error);
        if (attempt.failure_classification)
            reasons.add(sentenceStatus(attempt.failure_classification));
    }
    return [...reasons];
}
function defaultSelectedCase(cases) {
    return cases.slice().sort((a, b) => statusRank(a.status) - statusRank(b.status))[0];
}
function statusRank(status) {
    if (status === "failed")
        return 0;
    if (status === "completed")
        return 1;
    if (status === "passed")
        return 2;
    return 3;
}
function renderEvalReportHtml(report) {
    const model = toReportAppModel(normalizeRunReportForRead(report));
    const selected = defaultSelectedCase(model.cases);
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
    .case-tools { display: grid; gap: 10px; padding: 18px 0 12px; }
    .case-tools h2 { display: flex; justify-content: space-between; font-size: 13px; }
    .search { width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); outline: none; }
    .search:focus, .filter:focus-visible, .case-row:focus-visible { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,.14); }
    .filters { display: flex; flex-wrap: wrap; gap: 6px; }
    .filter { min-height: 28px; padding: 3px 8px; border: 1px solid transparent; border-radius: 4px; background: transparent; color: var(--muted); cursor: pointer; }
    .filter[aria-pressed="true"] { border-color: var(--ink); color: var(--ink); }
    .case-list { display: grid; gap: 2px; margin-top: 6px; }
    .case-row { width: 100%; padding: 9px 8px; border: 1px solid transparent; border-radius: 4px; background: transparent; text-align: left; cursor: pointer; }
    .case-row[aria-current="true"] { background: var(--surface); border-color: transparent; box-shadow: inset 2px 0 0 var(--ink); }
    .case-row strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .case-row span { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; }
    .status { display: inline-flex; gap: 6px; align-items: center; font-size: 12px; color: var(--muted); }
    .dot { width: 7px; height: 7px; border-radius: 999px; background: var(--muted); }
    .failed .dot { background: var(--bad); } .completed .dot { background: var(--warn); } .passed .dot { background: var(--ok); }
    .case-head { display: grid; gap: 8px; padding-bottom: 22px; border-bottom: 1px solid var(--line); }
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
      <div class="run-select"><span class="muted">Run</span><strong>${escapeHtml(model.run.id)}</strong><span class="muted">${escapeHtml(sentenceStatus(model.run.status))} · ${model.summary.case_count} cases</span></div>
      <div class="case-tools">
        <h2>Cases <span class="muted" id="case-count">${model.cases.length}</span></h2>
        <input class="search" id="case-search" type="search" placeholder="Search cases" aria-label="Search cases">
        <div class="filters" id="filters">
          ${["all", "failed", "completed", "passed", "no_tokens"].map((filter) => `<button class="filter" type="button" data-filter="${filter}" aria-pressed="${filter === "all"}">${escapeHtml(filterLabel(filter))}</button>`).join("")}
        </div>
      </div>
      <div class="case-list" id="case-list">${renderCaseRail(model.cases, selected?.id)}</div>
      <p class="muted" style="margin-top:18px;">Forced-skill run: final-answer behavior only.</p>
    </div></aside>
    <main class="main" id="case-detail">${selected ? renderCaseDetail(selected, model) : '<p class="empty">No cases recorded.</p>'}</main>
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
function renderRunTokenSummary(summary) {
    const normalized = normalizeRunTokenUsageSummary(summary);
    if (!normalized.case_count)
        return '<p class="muted">No token usage recorded.</p>';
    return `<table>
    <thead><tr><th>Cases</th><th>Unavailable</th><th>Total Tokens</th><th>Input</th><th>Output</th></tr></thead>
    <tbody><tr><td>${normalized.case_count}</td><td>${normalized.unavailable_case_count}</td><td>${formatNullableNumber(normalized.total_tokens)}</td><td>${formatNullableNumber(normalized.input_tokens)}</td><td>${formatNullableNumber(normalized.output_tokens)}</td></tr></tbody>
  </table>
  <p class="muted">Token usage is measured telemetry and is not a readiness verdict.</p>`;
}
function renderCaseRail(cases, selectedId) {
    if (!cases.length)
        return '<p class="empty">No cases match this filter.</p>';
    return cases
        .map((item) => `<button class="case-row" type="button" data-case-id="${escapeHtml(item.id)}" aria-current="${item.id === selectedId}">
      <strong>${escapeHtml(item.id)} · ${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(sentenceStatus(item.status))} · ${escapeHtml(item.attempts.map((attempt) => attempt.label).join(", ") || "No output")}</span>
    </button>`)
        .join("");
}
function renderCaseDetail(item, model) {
    return `<div class="case-head">
    <span class="status ${escapeHtml(item.status)}"><span class="dot"></span>${escapeHtml(sentenceStatus(item.status))}</span>
    <h1>${escapeHtml(item.title)}</h1>
    <p class="muted">${escapeHtml(item.id)} · ${escapeHtml(item.subtitle)}</p>
  </div>
  <div class="fact-row">
    <div class="fact"><span>Run</span><strong>${escapeHtml(model.run.id)}</strong></div>
    <div class="fact"><span>Source</span><strong>${escapeHtml(model.run.run_source.label)}</strong></div>
    <div class="fact"><span>Evidence basis</span><strong>${escapeHtml(sentenceStatus(item.evidence_basis))}</strong></div>
    <div class="fact"><span>Execution</span><strong>${escapeHtml(sentenceStatus(item.execution_status))}</strong></div>
  </div>
  <section class="section">
    <h2>Review reasons</h2>
    ${item.review_reasons.length ? `<ul class="reason-list">${item.review_reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>` : '<p class="empty">No review reasons recorded.</p>'}
  </section>
  <section class="section">
    <h2>Final answer preview</h2>
    <div class="answers">${renderAttemptPreviews(item, model)}</div>
  </section>
  <section class="section">
    <h2>Evaluation evidence</h2>
    ${item.evidence.length ? `<table><thead><tr><th>Type</th><th>Status</th><th>Detail</th></tr></thead><tbody>${item.evidence.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(sentenceStatus(row.status))}</td><td>${escapeHtml(row.detail || "recorded")}</td></tr>`).join("")}</tbody></table>` : '<p class="empty">No confidently matched tests, judges, or feedback for this item.</p>'}
  </section>
  <section class="section">
    <h2>Criteria</h2>
    ${item.criteria.length ? `<table><tbody>${item.criteria.map((row) => `<tr><th>${escapeHtml(row.label)}</th><td>${escapeHtml(row.value)}</td></tr>`).join("")}</tbody></table>` : '<p class="empty">No criteria recorded.</p>'}
  </section>`;
}
function renderAttemptPreviews(item, model) {
    const fallback = { label: model.run.run_source.label, execution_status: "unknown", status: "unknown", final_preview: "No final output recorded.", source_kind: model.run.run_source.kind, raw_links: [] };
    return (item.attempts.length ? item.attempts : [fallback])
        .map((attempt) => {
        const problem = [attempt.failure_classification, attempt.error].filter(Boolean).join(" · ");
        return `<div class="answer"><h3><span>${escapeHtml(attempt.label)}</span> <span class="status ${escapeHtml(attempt.status)}"><span class="dot"></span>${escapeHtml(sentenceStatus(attempt.status))}</span></h3>${problem ? `<p class="muted">${escapeHtml(sentenceStatus(problem))}</p>` : ""}<pre>${escapeHtml(attempt.final_preview || "No final output recorded.")}</pre>${attempt.final_href ? `<p class="answer-actions"><a href="${escapeHtml(attempt.final_href)}">Open final</a></p>` : ""}</div>`;
    })
        .join("");
}
function renderMetadataRail(item, model) {
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
    ${item ? renderCaseTokenUsage(item) : '<p class="empty">No case selected.</p>'}
    ${renderRunTokenFootnote(model.summary.token_usage)}
  </section>
  <section class="rail-section">
    <h2>Raw evidence</h2>
    ${item ? renderRawLinks(item) : '<p class="empty">No case selected.</p>'}
  </section>`;
}
function renderCaseTokenUsage(item) {
    if (!item.attempts.length)
        return '<p class="empty">No token usage recorded.</p>';
    return `<table><thead><tr><th>Source</th><th>Total</th><th>Input</th><th>Output</th></tr></thead><tbody>${item.attempts
        .map((attempt) => {
        const usage = attempt.token_usage;
        return `<tr><td>${escapeHtml(attempt.label)}</td><td>${formatNullableNumber(usage?.total_tokens ?? null)}</td><td>${formatNullableNumber(usage?.input_tokens ?? null)}</td><td>${formatNullableNumber(usage?.output_tokens ?? null)}</td></tr>`;
    })
        .join("")}</tbody></table>`;
}
function renderRunTokenFootnote(summary) {
    return `<p class="muted rail-note">Token usage is measured telemetry, not a quality score. Unavailable cases: ${summary.unavailable_case_count}.</p>`;
}
function renderRawLinks(item) {
    const groups = item.attempts.filter((attempt) => attempt.raw_links.length);
    if (!groups.length)
        return '<p class="empty">No raw evidence links recorded.</p>';
    return `<div class="links">${groups
        .map((attempt) => `<div class="raw-group"><strong>${escapeHtml(attempt.label)}</strong><div class="raw-files">${attempt.raw_links.map((raw) => `<a href="${escapeHtml(raw.href)}">${escapeHtml(raw.label)}</a>`).join("")}</div></div>`)
        .join("")}</div>`;
}
function filterLabel(filter) {
    if (filter === "all")
        return "All";
    if (filter === "failed")
        return "Failed";
    if (filter === "completed")
        return "No verdict";
    if (filter === "passed")
        return "Passed";
    return "No tokens";
}
function sentenceStatus(value) {
    return value.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function evidenceTypeLabel(value) {
    if (value === "test_result")
        return "Deterministic test";
    if (value === "judge_result")
        return "Judge";
    if (value === "lint_summary")
        return "Lint summary";
    if (value === "lint_skipped")
        return "Lint skipped";
    if (value === "candidate")
        return "Legacy working payload side";
    if (value === "release")
        return "Legacy saved snapshot side";
    return sentenceStatus(value);
}
function escapeJsonForHtml(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
const REPORT_APP_JS = `
const data = JSON.parse(document.getElementById("report-data").textContent);
let selectedId = (data.cases.find((s) => s.status === "failed") || data.cases.find((s) => s.status === "completed") || data.cases[0] || {}).id;
let filter = "all";
const search = document.getElementById("case-search");
const list = document.getElementById("case-list");
const count = document.getElementById("case-count");
const detail = document.getElementById("case-detail");
const rail = document.getElementById("metadata-rail");
function esc(value) { return String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function label(value) { return String(value || "").replace(/_/g, " ").replace(/\\b\\w/g, (letter) => letter.toUpperCase()); }
function evidenceLabel(value) { return label(String(value || "").replace(/-/g, " ")); }
function number(value) { return Number.isInteger(value) ? String(value) : Number(value || 0).toFixed(1); }
function hasNoTokens(s) { return !s.attempts.some((a) => a.token_usage && a.token_usage.total_tokens !== null && !a.token_usage.unavailable_reason); }
function filtered() {
  const q = search.value.trim().toLowerCase();
  return data.cases.filter((s) => {
    const filterOk = filter === "all" || (filter === "no_tokens" ? hasNoTokens(s) : s.status === filter);
    const hay = [s.id, s.title, s.subtitle, s.status, s.attempts.map((a) => a.label).join(" ")].join(" ").toLowerCase();
    return filterOk && (!q || hay.includes(q));
  });
}
function renderList() {
  const rows = filtered();
  count.textContent = rows.length;
  list.innerHTML = rows.length ? rows.map((s) => '<button class="case-row" type="button" data-case-id="' + esc(s.id) + '" aria-current="' + (s.id === selectedId) + '"><strong>' + esc(s.id) + ' · ' + esc(s.title) + '</strong><span>' + esc(label(s.status)) + ' · ' + esc(s.attempts.map((a) => a.label).join(", ") || "No output") + '</span></button>').join("") : '<p class="empty">No cases match this filter.</p>';
  list.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { selectedId = button.dataset.caseId; render(); }));
}
function attemptBlocks(s) {
  const attempts = s.attempts.length ? s.attempts : [{ label: data.run.run_source.label, status: "unknown", final_preview: "No final output recorded.", raw_links: [] }];
  return attempts.map((a) => {
    const problem = [a.failure_classification, a.error].filter(Boolean).join(" · ");
    return '<div class="answer"><h3><span>' + esc(a.label) + '</span> <span class="status ' + esc(a.status) + '"><span class="dot"></span>' + esc(label(a.status)) + '</span></h3>' + (problem ? '<p class="muted">' + esc(evidenceLabel(problem)) + '</p>' : '') + '<pre>' + esc(a.final_preview || "No final output recorded.") + '</pre>' + (a.final_href ? '<p class="answer-actions"><a href="' + esc(a.final_href) + '">Open final</a></p>' : '') + '</div>';
  }).join("");
}
function renderDetail(s) {
  if (!s) return '<p class="empty">No cases recorded.</p>';
  const reasons = s.review_reasons.length ? '<ul class="reason-list">' + s.review_reasons.map((r) => '<li>' + esc(r) + '</li>').join("") + '</ul>' : '<p class="empty">No review reasons recorded.</p>';
  const evidence = s.evidence.length ? '<table><thead><tr><th>Type</th><th>Status</th><th>Detail</th></tr></thead><tbody>' + s.evidence.map((r) => '<tr><td>' + esc(evidenceLabel(r.type)) + '</td><td>' + esc(label(r.status)) + '</td><td>' + esc(evidenceLabel(r.detail || "recorded")) + '</td></tr>').join("") + '</tbody></table>' : '<p class="empty">No confidently matched tests, judges, or feedback for this item.</p>';
  const criteria = s.criteria.length ? '<table><tbody>' + s.criteria.map((r) => '<tr><th>' + esc(r.label) + '</th><td>' + esc(r.value) + '</td></tr>').join("") + '</tbody></table>' : '<p class="empty">No criteria recorded.</p>';
  return '<div class="case-head"><span class="status ' + esc(s.status) + '"><span class="dot"></span>' + esc(label(s.status)) + '</span><h1>' + esc(s.title) + '</h1><p class="muted">' + esc(s.id) + ' · ' + esc(s.subtitle) + '</p></div><div class="fact-row"><div class="fact"><span>Run</span><strong>' + esc(data.run.id) + '</strong></div><div class="fact"><span>Source</span><strong>' + esc(data.run.run_source.label) + '</strong></div><div class="fact"><span>Evidence basis</span><strong>' + esc(label(s.evidence_basis)) + '</strong></div><div class="fact"><span>Execution</span><strong>' + esc(label(s.execution_status)) + '</strong></div></div><section class="section"><h2>Review reasons</h2>' + reasons + '</section><section class="section"><h2>Final answer preview</h2><div class="answers">' + attemptBlocks(s) + '</div></section><section class="section"><h2>Evaluation evidence</h2>' + evidence + '</section><section class="section"><h2>Criteria</h2>' + criteria + '</section>';
}
function renderRail(s) {
  const tokenRows = s && s.attempts.length ? '<table><thead><tr><th>Source</th><th>Total</th><th>Input</th><th>Output</th></tr></thead><tbody>' + s.attempts.map((a) => '<tr><td>' + esc(a.label) + '</td><td>' + (a.token_usage && a.token_usage.total_tokens !== null ? number(a.token_usage.total_tokens) : "unavailable") + '</td><td>' + (a.token_usage && a.token_usage.input_tokens !== null ? number(a.token_usage.input_tokens) : "-") + '</td><td>' + (a.token_usage && a.token_usage.output_tokens !== null ? number(a.token_usage.output_tokens) : "-") + '</td></tr>').join("") + '</tbody></table>' : '<p class="empty">No token usage recorded.</p>';
  const raw = s ? s.attempts.filter((a) => a.raw_links.length).map((a) => '<div class="raw-group"><strong>' + esc(a.label) + '</strong><div class="raw-files">' + a.raw_links.map((r) => '<a href="' + esc(r.href) + '">' + esc(r.label) + '</a>').join("") + '</div></div>').join("") : "";
  const foot = 'Token usage is measured telemetry, not a quality score. Unavailable cases: ' + data.summary.token_usage.unavailable_case_count + '.';
  return '<section class="rail-section"><h2>Run details</h2><dl class="kv"><div><dt>Status</dt><dd>' + esc(label(data.run.status)) + '</dd></div><div><dt>Execution</dt><dd>' + esc(label(data.run.execution_status)) + '</dd></div><div><dt>Readiness</dt><dd>' + esc(label(data.run.readiness_status)) + '</dd></div><div><dt>Assessment</dt><dd>' + esc(data.run.assessment_status ? label(data.run.assessment_status) : "No verdict recorded") + '</dd></div><div><dt>Runner</dt><dd>' + esc([data.run.runner_backend, data.run.runner_mode].filter(Boolean).join(" / ") || "unknown") + '</dd></div></dl><p class="muted rail-note">' + esc(data.run.readiness_summary) + '</p></section><section class="rail-section"><h2>Token usage</h2>' + tokenRows + '<p class="muted rail-note">' + esc(foot) + '</p></section><section class="rail-section"><h2>Raw evidence</h2><div class="links">' + (raw || '<p class="empty">No raw evidence links recorded.</p>') + '</div></section>';
}
function render() {
  renderList();
  const item = data.cases.find((s) => s.id === selectedId) || data.cases[0];
  detail.innerHTML = renderDetail(item);
  rail.innerHTML = renderRail(item);
}
search.addEventListener("input", render);
document.getElementById("filters").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
  filter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  render();
}));
render();
`;
function renderCaseCard(item) {
    const criteria = item.criteria;
    return `<section class="case">
    <h3>${escapeHtml(item.id)} ${escapeHtml(item.title || item.folder)}</h3>
    <p class="muted">${escapeHtml([item.type, item.topics.join(", ")].filter(Boolean).join(" / "))}</p>
    <p><strong>Evidence basis:</strong> ${escapeHtml(item.evidence_basis)}</p>
    <p><strong>Capability:</strong> ${escapeHtml(item.capability || "not recorded")}</p>
    <p><strong>Expected behavior:</strong> ${escapeHtml(criteria?.expected_behavior || "not recorded")}</p>
    <table>
      <thead><tr><th>Assertions</th><th>Tests</th><th>Judges</th></tr></thead>
      <tbody><tr><td>${escapeHtml((criteria?.assertions || []).join("\n") || "none")}</td><td>${escapeHtml((criteria?.tests || []).join(", ") || "none")}</td><td>${escapeHtml((criteria?.judges || []).join(", ") || "none")}</td></tr></tbody>
    </table>
  </section>`;
}
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
async function readJsonl(target) {
    if (!(await (0, project_1.exists)(target)))
        return [];
    return (await node_fs_1.promises.readFile(target, "utf8"))
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}
function countBy(rows, keyFor) {
    const counts = {};
    for (const row of rows) {
        const key = keyFor(row);
        counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
}
function formatCounts(counts) {
    const entries = Object.entries(counts).sort();
    if (!entries.length)
        return "none";
    return entries.map(([key, value]) => `${escapeHtml(key)}: ${value}`).join("<br>");
}
function formatTestSummary(rows) {
    const results = rows.filter((row) => row.type === "test_result");
    const skipped = rows.filter((row) => row.type === "lint_skipped").length;
    const counts = countBy(results, (row) => String(row.payload?.status || "unknown"));
    const summary = formatCounts(counts);
    return `${summary}${skipped ? `<br>lint skipped: ${skipped}` : ""}`;
}
function formatJudgeSummary(rows) {
    return formatCounts(countBy(rows, (row) => String(row.payload?.status || "unknown")));
}
function formatFeedbackSummary(rows) {
    return formatCounts(countBy(rows, (row) => String(row.payload?.label || row.payload?.status || "unlabeled")));
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
function formatNullableNumber(value) {
    return value === null ? "unavailable" : formatNumber(value);
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
function link(relative, label) {
    if (!relative)
        return "";
    return `<a href="${escapeHtml(relative.split(node_path_1.default.sep).join("/"))}">${escapeHtml(label)}</a>`;
}
function renderEventTable(rows, columns) {
    if (!rows.length)
        return '<p class="muted">No rows recorded.</p>';
    return `<table><thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}<th>Summary</th></tr></thead><tbody>${rows
        .map((row) => {
        const payload = row.payload || {};
        const rowValues = row;
        return `<tr>${columns
            .map((column) => `<td>${escapeHtml(rowValues[column] ?? payload[column] ?? "")}</td>`)
            .join("")}<td><pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre></td></tr>`;
    })
        .join("\n")}</tbody></table>`;
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
