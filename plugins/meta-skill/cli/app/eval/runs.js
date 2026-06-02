"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFeedback = importFeedback;
exports.listRuns = listRuns;
exports.listRunSummaries = listRunSummaries;
exports.openRun = openRun;
exports.refreshRunEvidence = refreshRunEvidence;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
const report_1 = require("../report");
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
    const refreshed = await refreshRunEvidence(root, runId);
    return { rows, report: refreshed.report };
}
async function listRuns(project) {
    const rows = await listRunSummaries(project);
    return rows.map((row) => row.run_id);
}
async function listRunSummaries(project, options = {}) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const p = (0, project_1.projectPaths)(root);
    if (!(await (0, project_1.exists)(p.runs)))
        return [];
    const index = await ensureRunsIndex(p.runs);
    let rows = [...index.runs].sort((a, b) => String(a.run_id).localeCompare(String(b.run_id)));
    if (options.status)
        rows = rows.filter((row) => row.status === options.status || row.assessment_status === options.status || row.readiness_status === options.status);
    if (options.limit !== undefined)
        rows = rows.slice(Math.max(0, rows.length - options.limit));
    return rows;
}
async function openRun(project, runId) {
    const runs = await listRunSummaries(project);
    const selected = runId || runs[runs.length - 1]?.run_id;
    if (!selected)
        throw new project_1.CliError("no eval runs found; run `meta-skill eval run <project>` first");
    const root = await (0, project_1.requirePortableSkill)(project);
    return refreshRunEvidence(root, selected);
}
async function refreshRunEvidence(project, runId) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const runRoot = node_path_1.default.join((0, project_1.projectPaths)(root).runs, runId);
    if (!(await (0, project_1.exists)(runRoot)))
        throw new project_1.CliError(`run does not exist: ${runId}`);
    if (!(await (0, project_1.exists)(node_path_1.default.join(runRoot, "run.json"))))
        throw new project_1.CliError(`run is missing run.json: ${runId}`);
    const report = await (0, report_1.writeEvalReport)(runRoot);
    const reportJson = node_path_1.default.join(runRoot, "report.json");
    const data = await (0, project_1.readJson)(reportJson);
    return { report, reportJson, runId, data };
}
async function ensureRunsIndex(runsRoot) {
    const indexPath = node_path_1.default.join(runsRoot, "index.json");
    if (await (0, project_1.exists)(indexPath))
        return (0, project_1.readJson)(indexPath);
    if (!(await (0, project_1.exists)(runsRoot)))
        return { schema_version: 1, updated_at: new Date(0).toISOString(), runs: [] };
    const dirs = (await node_fs_1.promises.readdir(runsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    for (const dir of dirs) {
        const runRoot = node_path_1.default.join(runsRoot, dir.name);
        if ((await (0, project_1.exists)(node_path_1.default.join(runRoot, "run.json"))) && !(await (0, project_1.exists)(node_path_1.default.join(runRoot, "report.json")))) {
            await (0, report_1.writeEvalReport)(runRoot);
        }
    }
    return (0, report_1.updateRunsIndex)(runsRoot);
}
