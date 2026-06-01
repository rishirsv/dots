"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFeedback = importFeedback;
exports.listRuns = listRuns;
exports.openRun = openRun;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
async function importFeedback(project, runId, feedbackFile) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const p = (0, project_1.projectPaths)(root);
    const runRoot = node_path_1.default.join(p.runs, runId);
    if (!(await (0, project_1.exists)(runRoot)))
        throw new project_1.CliError(`run does not exist: ${runId}`);
    const input = await (0, project_1.readText)(node_path_1.default.resolve(feedbackFile));
    let rows = 0;
    for (const line of input.split(/\r?\n/).filter(Boolean)) {
        let parsed;
        try {
            parsed = JSON.parse(line);
        }
        catch {
            throw new project_1.CliError(`invalid feedback JSONL row: ${line.slice(0, 120)}`);
        }
        const envelope = parsed.schema_version === 1 && typeof parsed.type === "string"
            ? parsed
            : (0, project_1.eventEnvelope)({ type: "human_feedback", run_id: runId, source: String(parsed.source || "feedback-import"), payload: parsed });
        await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "feedback.jsonl"), envelope);
        rows += 1;
    }
    return { rows };
}
async function listRuns(project) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const p = (0, project_1.projectPaths)(root);
    if (!(await (0, project_1.exists)(p.runs)))
        return [];
    const dirs = (await node_fs_1.promises.readdir(p.runs, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    return dirs.sort();
}
async function openRun(project, runId) {
    const runs = await listRuns(project);
    const selected = runId || runs[runs.length - 1];
    if (!selected)
        throw new project_1.CliError("no eval runs found; run `meta-skill eval run <project>` first");
    const root = await (0, project_1.requirePortableSkill)(project);
    const report = node_path_1.default.join((0, project_1.projectPaths)(root).runs, selected, "report.html");
    if (!(await (0, project_1.exists)(report)))
        throw new project_1.CliError(`report does not exist: ${report}`);
    return { report, runId: selected };
}
