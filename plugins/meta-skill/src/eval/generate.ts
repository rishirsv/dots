import path from "node:path";
import { ensureDir, exists, projectPaths, readText, requirePortableSkill, slugify, writeText } from "../project.ts";
import { listEvalFolders } from "./discovery.ts";

interface ScenarioSeed {
  scenario: string;
  phaseFocus: string;
  capability: string;
  userTaskShape: string;
  baselineRisk: string;
  expectedSkillLift: string;
  dimensionsExercised: string;
  sourceBasis: string;
}

export interface GenerateEvalsResult {
  scenariosPath: string;
  created: string[];
  skipped: string[];
}

const SCENARIO_COLUMNS = [
  "scenario",
  "phase focus",
  "capability",
  "user task shape",
  "baseline risk",
  "expected skill lift",
  "dimensions exercised",
  "source basis"
];

export async function generateEvalsFromScenarios(project: string): Promise<GenerateEvalsResult> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  const scenariosPath = p.evalScenarios;
  const text = await readText(scenariosPath);
  const seeds = parseScenarioPlan(text).filter((seed) => !isPlaceholder(seed.scenario));
  const existing = await listEvalFolders(p.evals);
  const existingSlugs = new Set(existing.map((folder) => folder.replace(/^[RFG]\d+-/, "")));
  const created: string[] = [];
  const skipped: string[] = [];
  let next = nextEvalNumber(existing);

  await ensureDir(p.evals);
  for (const seed of seeds) {
    const slug = slugify(seed.scenario, "eval").slice(0, 60);
    if (existingSlugs.has(slug)) {
      skipped.push(seed.scenario);
      continue;
    }
    const id = `${evalTypeCode(seed)}${next}`;
    next += 1;
    const folder = `${id}-${slug}`;
    const target = path.join(p.evals, folder, "eval.md");
    await writeText(target, evalDraft(seed));
    existingSlugs.add(slug);
    created.push(folder);
  }

  return { scenariosPath, created, skipped };
}

function parseScenarioPlan(text: string): ScenarioSeed[] {
  const lines = text.split(/\r?\n/);
  const seeds: ScenarioSeed[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const header = splitTableRow(lines[index]).map(normalizeHeader);
    if (!sameColumns(header, SCENARIO_COLUMNS)) continue;
    index += 2;
    while (index < lines.length) {
      const cells = splitTableRow(lines[index]);
      if (!cells.length) break;
      if (cells.length < SCENARIO_COLUMNS.length) break;
      seeds.push({
        scenario: cells[0],
        phaseFocus: cells[1],
        capability: cells[2],
        userTaskShape: cells[3],
        baselineRisk: cells[4],
        expectedSkillLift: cells[5],
        dimensionsExercised: cells[6],
        sourceBasis: cells[7]
      });
      index += 1;
    }
  }
  return seeds;
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return [];
  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ");
}

function sameColumns(actual: string[], expected: string[]): boolean {
  return expected.every((column, index) => actual[index] === column);
}

function isPlaceholder(value: string): boolean {
  return !value.trim() || /^<.*>$/.test(value.trim());
}

function nextEvalNumber(folders: string[]): number {
  return folders.reduce((max, folder) => {
    const match = /^[RFG](\d+)-/.exec(folder);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
}

function evalTypeCode(seed: ScenarioSeed): "R" | "F" | "G" {
  const text = `${seed.scenario} ${seed.phaseFocus} ${seed.baselineRisk} ${seed.userTaskShape}`.toLowerCase();
  if (/\bgate|trigger|boundary|approval|refusal|no-op|non-use\b/.test(text)) return "G";
  if (/\bfailure|mistake|risk|miss|counterexample|avoid\b/.test(text)) return "F";
  return "R";
}

function yamlString(value: string): string {
  return JSON.stringify(value || "");
}

function evalDraft(seed: ScenarioSeed): string {
  const expected = seed.expectedSkillLift || `The skill improves the ${seed.capability || seed.scenario} workflow.`;
  const assertions = [
    seed.capability ? `Addresses capability: ${seed.capability}` : "",
    seed.dimensionsExercised ? `Exercises dimensions: ${seed.dimensionsExercised}` : "",
    seed.baselineRisk ? `Avoids baseline risk: ${seed.baselineRisk}` : "",
    seed.sourceBasis ? `Grounds behavior in source basis: ${seed.sourceBasis}` : ""
  ].filter(Boolean);
  return `---
title: ${yamlString(seed.scenario)}
topics:
  - ${yamlString(slugify(seed.phaseFocus || "implementation", "implementation"))}
capability: ${yamlString(seed.capability)}
metadata:
  generated_from: ".meta-skill/eval-scenarios.md"
  phase_focus: ${yamlString(seed.phaseFocus)}
  baseline_risk: ${yamlString(seed.baselineRisk)}
  expected_skill_lift: ${yamlString(seed.expectedSkillLift)}
  dimensions_exercised: ${yamlString(seed.dimensionsExercised)}
  source_basis: ${yamlString(seed.sourceBasis)}
criteria:
  what_it_tests: ${yamlString(seed.scenario)}
  expected_behavior: ${yamlString(expected)}
  assertions:
${assertions.map((assertion) => `    - ${yamlString(assertion)}`).join("\n") || "    - \"Refine this generated assertion before running.\""}
  tests: []
---

## Task

Draft this eval from the high-level scenario plan before running it.

Scenario: ${seed.scenario}

User task shape: ${seed.userTaskShape || "(fill in the solver-visible task)"}

Expected skill lift: ${expected}
`;
}
