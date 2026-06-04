"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEval = runEval;
const node_path_1 = __importDefault(require("node:path"));
const client_1 = require("../app-server/client");
const runner_1 = require("../app-server/runner");
const lint_1 = require("../lint");
const project_1 = require("../project");
const judge_1 = require("./judge");
const results_1 = require("./results");
const cases_1 = require("./cases");
const runs_1 = require("./runs");
async function runEval(options) {
    if (options.appServerEndpoint) {
        throw new project_1.CliError("--app-server-endpoint is not supported yet; omit it to use the managed stdio App Server", 2);
    }
    const root = await (0, project_1.requirePortableSkill)(options.project);
    const p = (0, project_1.projectPaths)(root);
    if (!(await (0, project_1.exists)(p.evalManifest)))
        throw new project_1.CliError("eval workbench is missing; run `meta-skill eval init <project>` first");
    const preflight = await (0, lint_1.lintProject)(root, { executeTests: false });
    if (preflight.failures.length) {
        throw new project_1.CliError(`lint failed before eval run:\n${preflight.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
    }
    const cases = await (0, cases_1.loadCases)(root, options.selector);
    if (!cases.length)
        throw new project_1.CliError("no cases selected");
    const runSourceKind = options.runSource || "working_payload";
    const runSourceConfig = evalRunSourceConfig(runSourceKind, root, p.releaseSkill);
    if (runSourceKind === "snapshot_payload") {
        if (!(await (0, project_1.exists)(node_path_1.default.join(p.releaseSkill, "SKILL.md")))) {
            throw new project_1.CliError("`--snapshot` requires .meta-skill/versions/release/skill/SKILL.md; run `meta-skill release <project>` first");
        }
    }
    const runId = await (0, project_1.nextSequencedId)(p.runs, options.label || runSourceConfig.defaultLabel);
    const runRoot = node_path_1.default.join(p.runs, runId);
    await (0, project_1.ensureDir)(runRoot);
    for (const file of ["events.jsonl", "results.jsonl", "tests.jsonl", "grades.jsonl", "feedback.jsonl"]) {
        await (0, project_1.touch)(node_path_1.default.join(runRoot, file));
    }
    const appServer = await (0, client_1.appServerConfig)(options.appServerEndpoint);
    const runnerVersion = await (0, client_1.codexVersion)();
    const runJson = {
        schema_version: 1,
        run_id: runId,
        created_at: (0, project_1.utcNow)(),
        status: "running",
        label: options.label || null,
        suite: "default",
        cases_path: "../../cases",
        cases: { selection: cases.map((item) => item.folder) },
        run_source: runSourceConfig.runSource,
        runner: {
            backend: "app_server",
            app_server: appServer,
            codex_version: runnerVersion,
            protocol: "generated-ts",
            sandbox: "read-only",
            approval_policy: "never",
            network_access: false,
            timeout_ms: 120000
        },
        orchestration: {
            mode: "thread_per_case",
            turn_count: null
        }
    };
    await (0, project_1.writeJson)(node_path_1.default.join(runRoot, "run.json"), runJson);
    await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "events.jsonl"), (0, project_1.eventEnvelope)({ type: "run_started", run_id: runId, source: "meta-skill eval run", payload: runJson }));
    await (0, cases_1.writeRunCaseSnapshots)(runRoot, cases);
    const runner = options.caseRunner || new runner_1.AppServerCaseRunner();
    let hasFailures = false;
    const failureClassifications = new Set();
    try {
        for (const item of cases) {
            await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "events.jsonl"), (0, project_1.eventEnvelope)({ type: "case_started", run_id: runId, case_id: item.id, source: "meta-skill eval run", payload: { folder: item.folder, run_source: runSourceConfig.runSource } }));
            try {
                const result = await runner.run({ projectRoot: root, skillRoot: runSourceConfig.skillRoot, skill_activation: runSourceConfig.runSource.skill_activation, case: item, runSource: runSourceConfig.runSource, runId, runRoot, appServer });
                const classification = (0, results_1.classifyCaseStatus)(result.verdict || result.execution_status);
                if (classification) {
                    hasFailures = true;
                    failureClassifications.add(classification);
                }
                await (0, results_1.recordCaseResult)(runRoot, runId, item, runSourceConfig.runSource, result.execution_status, result.evidence_path, result.error, classification, result.verdict);
            }
            catch (error) {
                hasFailures = true;
                const message = error instanceof client_1.AppServerUnavailableError || error instanceof Error ? error.message : String(error);
                const classification = error instanceof client_1.AppServerUnavailableError ? "app_server_unavailable" : "harness_unavailable";
                failureClassifications.add(classification);
                const evidencePath = (0, project_1.relativePath)(runRoot, node_path_1.default.join(runRoot, "cases", item.folder));
                const tokenUsage = (0, project_1.unavailableTokenUsage)("App Server execution failed before token metrics were available.");
                const caseRoot = node_path_1.default.join(runRoot, "cases", item.folder);
                await (0, project_1.ensureDir)(caseRoot);
                await (0, project_1.writeJson)(node_path_1.default.join(caseRoot, "usage.json"), tokenUsage);
                await (0, results_1.recordCaseResult)(runRoot, runId, item, runSourceConfig.runSource, "errored", evidencePath, message, classification);
                await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "events.jsonl"), (0, project_1.eventEnvelope)({ type: "case_failed", run_id: runId, case_id: item.id, source: "app_server", payload: { run_source: runSourceConfig.runSource, error: message, failure_classification: classification } }));
            }
        }
    }
    finally {
        runner.close();
    }
    if (!options.noLint) {
        const lint = await (0, lint_1.lintProject)(root, { runId });
        if (!lint.ok) {
            hasFailures = true;
            failureClassifications.add("lint_test_failure");
        }
    }
    else {
        await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "tests.jsonl"), (0, project_1.eventEnvelope)({ type: "lint_skipped", run_id: runId, source: "meta-skill eval run", payload: { reason: "--no-lint" } }));
    }
    if (options.withJudges) {
        const judges = await (options.judgeRunner || judge_1.judgeRun)({ project: root, runId, allJudges: true, allCases: true });
        if (!judges.ok)
            hasFailures = true;
        for (const classification of judges.failureClassifications || [])
            failureClassifications.add(classification);
        if (!judges.ok && !(judges.failureClassifications || []).length)
            failureClassifications.add("judge_failure");
    }
    const status = (0, results_1.runStatus)(hasFailures);
    const ok = status === "completed";
    const sortedFailureClassifications = [...failureClassifications].sort();
    const finalRunJson = {
        ...runJson,
        status,
        completed_at: (0, project_1.utcNow)(),
        ok,
        failure_classifications: sortedFailureClassifications
    };
    await (0, project_1.writeJson)(node_path_1.default.join(runRoot, "run.json"), finalRunJson);
    await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "events.jsonl"), (0, project_1.eventEnvelope)({ type: "run_completed", run_id: runId, source: "meta-skill eval run", payload: { ok, status, failure_classifications: finalRunJson.failure_classifications } }));
    const { report } = await (0, runs_1.refreshRunEvidence)(root, runId);
    return { runId, runRoot, report, ok, status, failureClassifications: sortedFailureClassifications };
}
function evalRunSourceConfig(kind, projectRoot, releaseSkill) {
    if (kind === "snapshot_payload") {
        return { skillRoot: releaseSkill, runSource: { kind, label: "Saved snapshot payload", skill_root: "../../../versions/release/skill", skill_activation: "forced" }, defaultLabel: "saved-snapshot" };
    }
    if (kind === "no_skill") {
        return { runSource: { kind, label: "No skill", skill_root: null, skill_activation: "none" }, defaultLabel: "no-skill" };
    }
    return { skillRoot: projectRoot, runSource: { kind: "working_payload", label: "Working payload", skill_root: "../../../..", skill_activation: "forced" }, defaultLabel: "working-payload" };
}
