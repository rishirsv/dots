import { promises as fs } from "node:fs";
import path from "node:path";
import type { ScenarioCriteria, ScenarioMetadata, ScenarioRecord } from "../models";
import { CliError, createWorkbench, exists, projectPaths, readJson, readText, requirePortableSkill } from "../project";
import type { EvalSelector } from "./types";

export async function initEvals(project: string): Promise<{ path: string; warnings: string[] }> {
  const root = await requirePortableSkill(project);
  await createWorkbench(root);
  const warnings: string[] = [];
  const p = projectPaths(root);
  const scenarios = (await exists(p.scenarios)) ? (await fs.readdir(p.scenarios, { withFileTypes: true })).filter((entry) => entry.isDirectory()) : [];
  if (!scenarios.length) warnings.push("No scenarios exist yet. Add .meta-skill/evals/scenarios/<ID-slug>/ with task.md, scenario.json, and criteria.json.");
  return { path: p.evals, warnings };
}

export async function loadScenarios(project: string, selector: EvalSelector = {}): Promise<ScenarioRecord[]> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  if (!(await exists(p.scenarios))) return [];
  const dirs = (await fs.readdir(p.scenarios, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  const records: ScenarioRecord[] = [];
  for (const dirent of dirs) {
    const scenarioPath = path.join(p.scenarios, dirent.name);
    const metadata = await readJson<ScenarioMetadata>(path.join(scenarioPath, "scenario.json"));
    const criteria = await readJson<ScenarioCriteria>(path.join(scenarioPath, "criteria.json"));
    const task = await readText(path.join(scenarioPath, "task.md"));
    const turns = (await exists(path.join(scenarioPath, "turns.json"))) ? await readJson<Array<{ content: string }>>(path.join(scenarioPath, "turns.json")) : [];
    records.push({ folder: dirent.name, id: metadata.id, path: scenarioPath, metadata, criteria, task, turns });
  }

  const selected = records.filter((scenario) => {
    if (selector.scenario?.length) {
      const wanted = new Set(selector.scenario);
      if (!wanted.has(scenario.id) && !wanted.has(scenario.folder)) return false;
    }
    if (selector.family) {
      const prefix = scenario.id.charAt(0);
      if (prefix !== selector.family) return false;
    }
    if (selector.topic?.length) {
      const topics = new Set(scenario.metadata.topics || []);
      if (!selector.topic.some((topic) => topics.has(topic))) return false;
    }
    return true;
  });

  if (selector.scenario?.length && !selected.length) throw new CliError("no scenarios selected");
  return selected;
}
