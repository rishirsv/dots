"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEvals = initEvals;
exports.loadScenarios = loadScenarios;
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
    const selected = records.filter((scenario) => {
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
    if (selector.scenario?.length && !selected.length)
        throw new project_1.CliError("no scenarios selected");
    return selected;
}
