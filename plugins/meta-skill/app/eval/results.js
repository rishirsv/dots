"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordCaseResult = recordCaseResult;
exports.attemptsInRun = attemptsInRun;
exports.classifyCaseStatus = classifyCaseStatus;
exports.runStatus = runStatus;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
async function recordCaseResult(runRoot, runId, item, runSource, executionStatus, evidencePath, error, failureClassification, verdict) {
    await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "results.jsonl"), (0, project_1.eventEnvelope)({
        type: "case_result",
        run_id: runId,
        case_id: item.id,
        source: "meta-skill eval run",
        payload: {
            run_source: runSource,
            execution_status: executionStatus,
            ...(verdict ? { verdict } : {}),
            case_folder: item.folder,
            evidence_path: evidencePath,
            failure_classification: failureClassification || null,
            error
        }
    }));
}
async function attemptsInRun(runRoot, caseFolder) {
    const caseRoot = node_path_1.default.join(runRoot, "cases", caseFolder);
    if (await (0, project_1.exists)(node_path_1.default.join(caseRoot, "final.md")))
        return [{ runSource: await runSourceFor(runRoot), evidencePath: node_path_1.default.join("cases", caseFolder) }];
    const attempts = [];
    // Legacy read-only support for old run evidence written before the case contract.
    const scenarioRoot = node_path_1.default.join(runRoot, "scenarios", caseFolder);
    for (const side of ["candidate", "release"]) {
        if (await (0, project_1.exists)(node_path_1.default.join(scenarioRoot, side)))
            attempts.push({ runSource: legacyRunSource(side), evidencePath: node_path_1.default.join("scenarios", caseFolder, side), legacySide: side });
    }
    return attempts.length ? attempts : [{ runSource: await runSourceFor(runRoot), evidencePath: node_path_1.default.join("cases", caseFolder) }];
}
async function runSourceFor(runRoot) {
    try {
        const run = JSON.parse(await node_fs_1.promises.readFile(node_path_1.default.join(runRoot, "run.json"), "utf8"));
        if (run.run_source?.kind)
            return run.run_source;
        if (typeof run.subject === "string")
            return legacyRunSource(run.subject);
        if (run.subject?.id)
            return legacyRunSource(String(run.subject.id));
    }
    catch {
        // Missing run.json is handled by the caller's evidence checks.
    }
    return { kind: "working_payload", label: "Working payload", skill_root: "../../../..", skill_activation: "forced" };
}
function legacyRunSource(value) {
    if (value === "release")
        return { kind: "legacy_side", label: "Legacy saved snapshot side", skill_root: "../../../versions/release/skill", skill_activation: "forced" };
    return { kind: "legacy_side", label: "Legacy working payload side", skill_root: "../../../..", skill_activation: "forced" };
}
function classifyCaseStatus(status) {
    return status === "failed" || status === "errored" ? "case_failed" : null;
}
function runStatus(hasFailures) {
    if (hasFailures)
        return "failed";
    return "completed";
}
