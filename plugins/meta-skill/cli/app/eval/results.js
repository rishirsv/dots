"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordScenarioResult = recordScenarioResult;
exports.sidesInRun = sidesInRun;
exports.classifyScenarioStatus = classifyScenarioStatus;
exports.runStatus = runStatus;
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
async function recordScenarioResult(runRoot, runId, scenario, side, status, tokenUsage, evidencePath, error, failureClassification) {
    await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "results.jsonl"), (0, project_1.eventEnvelope)({
        type: "scenario_result",
        run_id: runId,
        scenario_id: scenario.id,
        side,
        source: "meta-skill eval run",
        payload: {
            status,
            scenario_folder: scenario.folder,
            evidence_path: evidencePath,
            token_usage: tokenUsage,
            failure_classification: failureClassification || null,
            error
        }
    }));
}
async function sidesInRun(runRoot, scenarioFolder) {
    const scenarioRoot = node_path_1.default.join(runRoot, "scenarios", scenarioFolder);
    const sides = [];
    for (const side of ["candidate", "release"]) {
        if (await (0, project_1.exists)(node_path_1.default.join(scenarioRoot, side)))
            sides.push(side);
    }
    return sides.length ? sides : ["candidate"];
}
function classifyScenarioStatus(status) {
    return status === "failed" || status === "errored" ? "scenario_failed" : null;
}
function runStatus(ok, scenarioStatuses) {
    if (!ok)
        return "failed";
    return scenarioStatuses.has("needs_review") ? "needs_review" : "passed";
}
