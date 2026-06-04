import { promises as fs } from "node:fs";
import path from "node:path";
import type { ScenarioCriteria, ScenarioMetadata, ScenarioRecord } from "../models";
import { CliError, createWorkbench, ensureDir, exists, projectPaths, readJson, readText, requirePortableSkill, writeJson, writeText } from "../project";
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

  const selected = selectScenarios(records, selector);
  if (selector.scenario?.length && !selected.length) throw new CliError("no scenarios selected");
  return selected;
}

export async function writeRunScenarioSnapshots(runRoot: string, scenarios: ScenarioRecord[]): Promise<void> {
  for (const scenario of scenarios) {
    const snapshot = path.join(runRoot, "snapshots", scenario.folder);
    await ensureDir(snapshot);
    await writeText(path.join(snapshot, "task.md"), scenario.task);
    await writeJson(path.join(snapshot, "scenario.json"), scenario.metadata);
    await writeJson(path.join(snapshot, "criteria.json"), scenario.criteria);
    if (scenario.turns.length) await writeJson(path.join(snapshot, "turns.json"), scenario.turns);
    const capability = path.join(scenario.path, "capability.txt");
    if (await exists(capability)) await writeText(path.join(snapshot, "capability.txt"), await readText(capability));
    await writeJson(path.join(snapshot, "snapshot.json"), {
      schema_version: 1,
      scenario_id: scenario.id,
      scenario_folder: scenario.folder,
      evidence_basis: "run_snapshot",
      source_path: scenario.path
    });
  }
}

export async function loadRunScenarioSnapshots(project: string, runRoot: string, selector: EvalSelector = {}): Promise<ScenarioRecord[]> {
  const root = await requirePortableSkill(project);
  const snapshots = path.join(runRoot, "snapshots");
  if (!(await exists(snapshots))) {
    const current = await loadScenarios(root, selector);
    return current.map((scenario) => ({ ...scenario, evidence_basis: "legacy_current_project" }));
  }

  const dirs = (await fs.readdir(snapshots, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  const records: ScenarioRecord[] = [];
  for (const dirent of dirs) {
    const scenarioPath = path.join(snapshots, dirent.name);
    const metadata = await readJson<ScenarioMetadata>(path.join(scenarioPath, "scenario.json"));
    const criteria = await readJson<ScenarioCriteria>(path.join(scenarioPath, "criteria.json"));
    const task = await readText(path.join(scenarioPath, "task.md"));
    const turns = (await exists(path.join(scenarioPath, "turns.json"))) ? await readJson<Array<{ content: string }>>(path.join(scenarioPath, "turns.json")) : [];
    records.push({ folder: dirent.name, id: metadata.id, path: scenarioPath, metadata, criteria, task, turns, evidence_basis: "run_snapshot", snapshot_path: scenarioPath });
  }

  const selected = selectScenarios(records, selector);
  if (selector.scenario?.length && !selected.length) throw new CliError("no scenarios selected");
  return selected;
}

function selectScenarios(records: ScenarioRecord[], selector: EvalSelector): ScenarioRecord[] {
  return records.filter((scenario) => {
    if (selector.scenario?.length) {
      const wanted = new Set(selector.scenario);
      if (!wanted.has(scenario.id) && !wanted.has(scenario.folder)) return false;
    }
    if (selector.type) {
      const prefix = scenario.id.charAt(0);
      if (prefix !== selector.type) return false;
    }
    if (selector.topic?.length) {
      const topics = new Set(scenario.metadata.topics || []);
      if (!selector.topic.some((topic) => topics.has(topic))) return false;
    }
    return true;
  });
}
