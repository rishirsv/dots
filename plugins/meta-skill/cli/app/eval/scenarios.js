"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEvals = initEvals;
exports.loadScenarios = loadScenarios;
exports.writeRunScenarioSnapshots = writeRunScenarioSnapshots;
exports.loadRunScenarioSnapshots = loadRunScenarioSnapshots;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
async function initEvals(project) {
    const root = await (0, project_1.requirePortableSkill)(project);
    await (0, project_1.createWorkbench)(root);
    const warnings = [];
    const p = (0, project_1.projectPaths)(root);
    const scenarios = (await (0, project_1.exists)(p.scenarios)) ? (await node_fs_1.promises.readdir(p.scenarios, { withFileTypes: true })).filter((entry) => entry.isDirectory()) : [];
    if (!scenarios.length)
        warnings.push("No scenarios exist yet. Add .meta-skill/evals/scenarios/<ID-slug>/ with task.md, scenario.json, and criteria.json.");
    return { path: p.evals, warnings };
}
async function loadScenarios(project, selector = {}) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const p = (0, project_1.projectPaths)(root);
    if (!(await (0, project_1.exists)(p.scenarios)))
        return [];
    const dirs = (await node_fs_1.promises.readdir(p.scenarios, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    const records = [];
    for (const dirent of dirs) {
        const scenarioPath = node_path_1.default.join(p.scenarios, dirent.name);
        const metadata = await (0, project_1.readJson)(node_path_1.default.join(scenarioPath, "scenario.json"));
        const criteria = await (0, project_1.readJson)(node_path_1.default.join(scenarioPath, "criteria.json"));
        const task = await (0, project_1.readText)(node_path_1.default.join(scenarioPath, "task.md"));
        const turns = (await (0, project_1.exists)(node_path_1.default.join(scenarioPath, "turns.json"))) ? await (0, project_1.readJson)(node_path_1.default.join(scenarioPath, "turns.json")) : [];
        records.push({ folder: dirent.name, id: metadata.id, path: scenarioPath, metadata, criteria, task, turns });
    }
    const selected = selectScenarios(records, selector);
    if (selector.scenario?.length && !selected.length)
        throw new project_1.CliError("no scenarios selected");
    return selected;
}
async function writeRunScenarioSnapshots(runRoot, scenarios) {
    for (const scenario of scenarios) {
        const snapshot = node_path_1.default.join(runRoot, "snapshots", scenario.folder);
        await (0, project_1.ensureDir)(snapshot);
        await (0, project_1.writeText)(node_path_1.default.join(snapshot, "task.md"), scenario.task);
        await (0, project_1.writeJson)(node_path_1.default.join(snapshot, "scenario.json"), scenario.metadata);
        await (0, project_1.writeJson)(node_path_1.default.join(snapshot, "criteria.json"), scenario.criteria);
        if (scenario.turns.length)
            await (0, project_1.writeJson)(node_path_1.default.join(snapshot, "turns.json"), scenario.turns);
        const capability = node_path_1.default.join(scenario.path, "capability.txt");
        if (await (0, project_1.exists)(capability))
            await (0, project_1.writeText)(node_path_1.default.join(snapshot, "capability.txt"), await (0, project_1.readText)(capability));
        await (0, project_1.writeJson)(node_path_1.default.join(snapshot, "snapshot.json"), {
            schema_version: 1,
            scenario_id: scenario.id,
            scenario_folder: scenario.folder,
            evidence_basis: "run_snapshot",
            source_path: scenario.path
        });
    }
}
async function loadRunScenarioSnapshots(project, runRoot, selector = {}) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const snapshots = node_path_1.default.join(runRoot, "snapshots");
    if (!(await (0, project_1.exists)(snapshots))) {
        const current = await loadScenarios(root, selector);
        return current.map((scenario) => ({ ...scenario, evidence_basis: "legacy_current_project" }));
    }
    const dirs = (await node_fs_1.promises.readdir(snapshots, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    const records = [];
    for (const dirent of dirs) {
        const scenarioPath = node_path_1.default.join(snapshots, dirent.name);
        const metadata = await (0, project_1.readJson)(node_path_1.default.join(scenarioPath, "scenario.json"));
        const criteria = await (0, project_1.readJson)(node_path_1.default.join(scenarioPath, "criteria.json"));
        const task = await (0, project_1.readText)(node_path_1.default.join(scenarioPath, "task.md"));
        const turns = (await (0, project_1.exists)(node_path_1.default.join(scenarioPath, "turns.json"))) ? await (0, project_1.readJson)(node_path_1.default.join(scenarioPath, "turns.json")) : [];
        records.push({ folder: dirent.name, id: metadata.id, path: scenarioPath, metadata, criteria, task, turns, evidence_basis: "run_snapshot", snapshot_path: scenarioPath });
    }
    const selected = selectScenarios(records, selector);
    if (selector.scenario?.length && !selected.length)
        throw new project_1.CliError("no scenarios selected");
    return selected;
}
function selectScenarios(records, selector) {
    return records.filter((scenario) => {
        if (selector.scenario?.length) {
            const wanted = new Set(selector.scenario);
            if (!wanted.has(scenario.id) && !wanted.has(scenario.folder))
                return false;
        }
        if (selector.family) {
            const prefix = scenario.id.charAt(0);
            if (prefix !== selector.family)
                return false;
        }
        if (selector.topic?.length) {
            const topics = new Set(scenario.metadata.topics || []);
            if (!selector.topic.some((topic) => topics.has(topic)))
                return false;
        }
        return true;
    });
}
