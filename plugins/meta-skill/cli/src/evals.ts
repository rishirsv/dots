import { promises as fs } from "node:fs";
import path from "node:path";
import type { EventEnvelope, ScenarioCriteria, ScenarioMetadata, ScenarioRecord } from "./models";
import { AppServerUnavailableError, appServerConfig, codexVersion } from "./app-server/client";
import { AppServerScenarioRunner } from "./app-server/runner";
import { lintProject } from "./lint";
import {
  CliError,
  appendJsonl,
  createWorkbench,
  ensureDir,
  eventEnvelope,
  exists,
  nextSequencedId,
  projectPaths,
  readJson,
  readText,
  relativePath,
  requirePortableSkill,
  touch,
  unavailableTokenUsage,
  utcNow,
  writeJson,
  writeText
} from "./project";
import { writeEvalReport } from "./report";

export interface EvalSelector {
  scenario?: string[];
  family?: string;
  topic?: string[];
}

export async function initEvals(project: string): Promise<{ path: string; warnings: string[] }> {
  const root = await requirePortableSkill(project);
  await createWorkbench(root);
  const warnings: string[] = [];
  const p = projectPaths(root);
  const scenarios = (await exists(p.scenarios)) ? (await fs.readdir(p.scenarios, { withFileTypes: true })).filter((entry) => entry.isDirectory()) : [];
  if (!scenarios.length) warnings.push("No scenarios exist yet. Add .meta-skill/evals/scenarios/<ID-slug>/ with task.md, scenario.json, and criteria.json.");
  return { path: p.evals, warnings };
}

export interface EvalRunOptions {
  project: string;
  selector: EvalSelector;
  label?: string;
  compare?: "release";
  withJudges?: boolean;
  noLint?: boolean;
  appServerEndpoint?: string;
}

export async function runEval(options: EvalRunOptions): Promise<{ runId: string; runRoot: string; report: string; ok: boolean }> {
  const root = await requirePortableSkill(options.project);
  const p = projectPaths(root);
  if (!(await exists(p.evalManifest))) throw new CliError("eval workbench is missing; run `meta-skill eval init <project>` first");

  const preflight = await lintProject(root, { executeTests: false });
  if (preflight.failures.length) {
    throw new CliError(`lint failed before eval run:\n${preflight.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
  }

  const scenarios = await loadScenarios(root, options.selector);
  if (!scenarios.length) throw new CliError("no scenarios selected");

  const sides: Array<"candidate" | "release"> = ["candidate"];
  if (options.compare === "release") {
    if (!(await exists(path.join(p.releaseSkill, "SKILL.md")))) {
      throw new CliError("`--compare release` requires .meta-skill/versions/release/skill/SKILL.md; run `meta-skill release <project>` first");
    }
    sides.push("release");
  }

  const runId = await nextSequencedId(p.runs, options.label || (options.compare === "release" ? "release-compare" : "initial-candidate"));
  const runRoot = path.join(p.runs, runId);
  await ensureDir(runRoot);
  for (const file of ["events.jsonl", "results.jsonl", "tests.jsonl", "grades.jsonl", "feedback.jsonl"]) {
    await touch(path.join(runRoot, file));
  }

  const appServer = await appServerConfig(options.appServerEndpoint);
  const runnerVersion = await codexVersion();
  const runJson = {
    schema_version: 1,
    run_id: runId,
    created_at: utcNow(),
    label: options.label || null,
    suite: "default",
    scenarios_path: "../../scenarios",
    scenarios: { selection: scenarios.map((scenario) => scenario.folder) },
    sides: sides.map((side) =>
      side === "candidate"
        ? { id: "candidate", kind: "working_tree", skill_root: "../../../.." }
        : { id: "release", kind: "version", skill_root: "../../../versions/release/skill" }
    ),
    runner: {
      backend: "app_server",
      app_server: appServer,
      codex_version: runnerVersion,
      protocol: "generated-ts",
      sandbox: "workspace-write",
      timeout_ms: 120000
    },
    orchestration: {
      mode: "thread_per_scenario_side",
      turn_count: null
    }
  };
  await writeJson(path.join(runRoot, "run.json"), runJson);
  await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "run_started", run_id: runId, source: "meta-skill eval run", payload: runJson }));

  const runner = new AppServerScenarioRunner();
  let ok = true;
  for (const scenario of scenarios) {
    for (const side of sides) {
      const skillRoot = side === "candidate" ? root : p.releaseSkill;
      await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "scenario_side_started", run_id: runId, scenario_id: scenario.id, side, source: "meta-skill eval run", payload: { folder: scenario.folder } }));
      try {
        const result = await runner.run({ projectRoot: root, skillRoot, scenario, side, runId, runRoot, appServer });
        await recordScenarioResult(runRoot, runId, scenario, side, result.status, result.token_usage, result.evidence_path);
      } catch (error) {
        ok = false;
        const message = error instanceof AppServerUnavailableError || error instanceof Error ? error.message : String(error);
        const evidencePath = relativePath(runRoot, path.join(runRoot, "scenarios", scenario.folder, side));
        const tokenUsage = unavailableTokenUsage("App Server execution failed before token metrics were available.");
        await recordScenarioResult(runRoot, runId, scenario, side, "errored", tokenUsage, evidencePath, message);
        await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "scenario_side_failed", run_id: runId, scenario_id: scenario.id, side, source: "app_server", payload: { error: message, token_usage: tokenUsage } }));
      }
    }
  }

  if (!options.noLint) {
    await lintProject(root, { runId });
  } else {
    await appendJsonl(path.join(runRoot, "tests.jsonl"), eventEnvelope({ type: "lint_skipped", run_id: runId, source: "meta-skill eval run", payload: { reason: "--no-lint" } }));
  }

  if (options.withJudges) {
    await judgeRun({ project: root, runId, allJudges: true, allScenarios: true });
  }

  await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "run_completed", run_id: runId, source: "meta-skill eval run", payload: { ok } }));
  const report = await writeEvalReport(runRoot);
  return { runId, runRoot, report, ok };
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

  return records.filter((scenario) => {
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
}

export interface JudgeOptions {
  project: string;
  runId: string;
  judge?: string;
  allJudges?: boolean;
  scenario?: string;
  allScenarios?: boolean;
}

export async function judgeRun(options: JudgeOptions): Promise<{ annotations: number; ok: boolean }> {
  const root = await requirePortableSkill(options.project);
  const p = projectPaths(root);
  const runRoot = path.join(p.runs, options.runId);
  if (!(await exists(runRoot))) throw new CliError(`run does not exist: ${options.runId}`);
  if (!options.judge && !options.allJudges) throw new CliError("eval judge requires --judge <id> or --all-judges", 2);
  if (!options.scenario && !options.allScenarios) throw new CliError("eval judge requires --scenario <id> or --all-scenarios", 2);

  const scenarios = await loadScenarios(root, options.allScenarios ? {} : { scenario: [options.scenario as string] });
  let annotations = 0;
  let ok = true;
  for (const scenario of scenarios) {
    const judgeIds = options.allJudges ? (scenario.criteria.judges || []).map((judge) => judge.id) : [options.judge as string];
    for (const judgeId of judgeIds) {
      if (!(await exists(path.join(p.judges, `${judgeId}.md`)))) throw new CliError(`judge does not exist: ${judgeId}`);
      for (const side of await sidesInRun(runRoot, scenario.folder)) {
        ok = false;
        await appendJsonl(
          path.join(runRoot, "grades.jsonl"),
          eventEnvelope({
            type: "judge_result",
            run_id: options.runId,
            scenario_id: scenario.id,
            side,
            source: judgeId,
            payload: {
              judge_id: judgeId,
              status: "unavailable",
              reason: "LLM judge execution is intentionally explicit and App Server-backed; judge scoring client is not wired in this hard cut."
            }
          })
        );
        annotations += 1;
      }
    }
  }
  return { annotations, ok };
}

export async function importFeedback(project: string, runId: string, feedbackFile: string): Promise<{ rows: number }> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  const runRoot = path.join(p.runs, runId);
  if (!(await exists(runRoot))) throw new CliError(`run does not exist: ${runId}`);
  const input = await readText(path.resolve(feedbackFile));
  let rows = 0;
  for (const line of input.split(/\r?\n/).filter(Boolean)) {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(line) as Record<string, unknown>;
    } catch {
      throw new CliError(`invalid feedback JSONL row: ${line.slice(0, 120)}`);
    }
    const envelope: EventEnvelope =
      parsed.schema_version === 1 && typeof parsed.type === "string"
        ? (parsed as unknown as EventEnvelope)
        : eventEnvelope({ type: "human_feedback", run_id: runId, source: String(parsed.source || "feedback-import"), payload: parsed });
    await appendJsonl(path.join(runRoot, "feedback.jsonl"), envelope);
    rows += 1;
  }
  return { rows };
}

export async function listRuns(project: string): Promise<string[]> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  if (!(await exists(p.runs))) return [];
  const dirs = (await fs.readdir(p.runs, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  return dirs.sort();
}

export async function openRun(project: string, runId?: string): Promise<{ report: string; runId: string }> {
  const runs = await listRuns(project);
  const selected = runId || runs[runs.length - 1];
  if (!selected) throw new CliError("no eval runs found; run `meta-skill eval run <project>` first");
  const root = await requirePortableSkill(project);
  const report = path.join(projectPaths(root).runs, selected, "report.html");
  if (!(await exists(report))) throw new CliError(`report does not exist: ${report}`);
  return { report, runId: selected };
}

async function recordScenarioResult(
  runRoot: string,
  runId: string,
  scenario: ScenarioRecord,
  side: "candidate" | "release",
  status: string,
  tokenUsage: unknown,
  evidencePath: string,
  error?: string
): Promise<void> {
  await appendJsonl(
    path.join(runRoot, "results.jsonl"),
    eventEnvelope({
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
        error
      }
    })
  );
}

async function sidesInRun(runRoot: string, scenarioFolder: string): Promise<Array<"candidate" | "release">> {
  const scenarioRoot = path.join(runRoot, "scenarios", scenarioFolder);
  const sides: Array<"candidate" | "release"> = [];
  for (const side of ["candidate", "release"] as const) {
    if (await exists(path.join(scenarioRoot, side))) sides.push(side);
  }
  return sides.length ? sides : ["candidate"];
}
