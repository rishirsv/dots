import { promises as fs } from "node:fs";
import path from "node:path";
import { AppServerUnavailableError, appServerConfig } from "../app-server/client.ts";
import { AppServerCaseRunner } from "../app-server/runner.ts";
import { lintProject } from "../lint.ts";
import {
  CliError,
  copyPortablePayload,
  ensureDir,
  exists,
  nextSequencedId,
  projectPaths,
  requirePortableSkill
} from "../project.ts";
import { loadCases } from "./cases.ts";
import type { EvalRunOptions } from "./types.ts";
import type { EvalRunSource, EvalRunSourceKind } from "../models.ts";

export async function runEval(options: EvalRunOptions): Promise<{ runId: string; runRoot: string; ok: boolean; errors: string[]; cases: string[] }> {
  if (options.appServerEndpoint) {
    throw new CliError("--app-server-endpoint is not supported yet; omit it to use the managed stdio App Server", 2);
  }

  const root = await requirePortableSkill(options.project);
  const p = projectPaths(root);
  if (!(await exists(p.cases))) throw new CliError("case workbench is missing; run `meta-skill project init <project>` first");

  const preflight = await lintProject(root, { executeTests: false });
  if (preflight.failures.length) {
    throw new CliError(`lint failed before run:\n${preflight.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
  }

  const cases = await loadCases(root, options.selector);
  if (!cases.length) throw new CliError("no cases selected");

  const runSourceKind = options.runSource || "working_payload";
  const runSourceConfig = evalRunSourceConfig(runSourceKind);
  const runId = await nextSequencedId(p.runs, options.label || runSourceConfig.defaultLabel);
  const runRoot = path.join(p.runs, runId);
  await ensureDir(runRoot);
  const appServer = await appServerConfig(options.appServerEndpoint);

  if (runSourceKind === "working_payload") {
    await copyPortablePayload(root, path.join(runRoot, "payload"));
  }

  const runner = options.caseRunner || new AppServerCaseRunner();
  const errors: string[] = [];
  const completedCases: string[] = [];
  try {
    for (const item of cases) {
      const caseRoot = path.join(runRoot, "cases", item.folder);
      await ensureDir(caseRoot);
      await fs.copyFile(path.join(item.path, "case.md"), path.join(caseRoot, "case.md"));
      try {
        const skillRoot = runSourceKind === "working_payload" ? path.join(runRoot, "payload") : undefined;
        await runner.run({ projectRoot: root, skillRoot, skill_activation: runSourceConfig.runSource.skill_activation, case: { ...item, path: caseRoot }, runSource: runSourceConfig.runSource, runId, runRoot, appServer });
      } catch (error) {
        const message = error instanceof AppServerUnavailableError || error instanceof Error ? error.message : String(error);
        errors.push(message);
      }
      completedCases.push(item.folder);
    }
  } finally {
    runner.close();
  }

  if (!options.noLint) {
    const lint = await lintProject(root);
    if (!lint.ok) errors.push("lint checks recorded non-passing observations");
  }

  return { runId, runRoot, ok: errors.length === 0, errors, cases: completedCases };
}

function evalRunSourceConfig(kind: EvalRunSourceKind): { runSource: EvalRunSource; defaultLabel: string } {
  if (kind === "no_skill") {
    return { runSource: { kind, label: "No skill", skill_root: null, skill_activation: "none" }, defaultLabel: "no-skill" };
  }
  return { runSource: { kind: "working_payload", label: "Working payload", skill_root: "payload", skill_activation: "forced" }, defaultLabel: "working-payload" };
}
