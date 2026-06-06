import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { AppServerUnavailableError, appServerConfig } from "../app-server/client.ts";
import { AppServerEvalRunner } from "../app-server/runner.ts";
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
import { loadEvals } from "./evals.ts";
import type { EvalRunner, EvalRunOptions } from "./types.ts";
import type { EvalRecord, EvalRunSource, EvalRunSourceKind } from "../models.ts";

interface EvalRunEvalSummary {
  id: string;
  folder: string;
  title: string;
  execution_status: "completed" | "errored";
  response_path?: string;
  rpc_path?: string;
  transcript_path?: string;
  task_path?: string;
  criteria_path: string;
  criteria_sha256: string;
  scoring_status: "review_required" | "unavailable";
  score: number | null;
  max_score: number;
  token_usage?: unknown;
  error?: string;
}

export async function runEval(options: EvalRunOptions): Promise<{ runId: string; runRoot: string; ok: boolean; errors: string[]; evals: string[]; payload: ReturnType<typeof payloadMetadata> | null; results: EvalRunEvalSummary[] }> {
  const root = await requirePortableSkill(options.project);
  const p = projectPaths(root);
  if (!(await exists(p.evals))) throw new CliError("eval workbench is missing; run `meta-skill project init <project>` first");
  const concurrency = evalConcurrency(options.concurrency);
  if (concurrency > 1 && options.evalRunner && !options.evalRunnerFactory) {
    throw new CliError("parallel eval runs require evalRunnerFactory when injecting a runner");
  }

  const preflight = await lintProject(root, { executeTests: false, evalSelector: options.selector });
  if (preflight.failures.length) {
    throw new CliError(`lint failed before run:\n${preflight.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
  }

  const evals = await loadEvals(root, options.selector);
  if (!evals.length) throw new CliError("no evals selected");

  const runSourceKind = options.runSource || "working_payload";
  const runSourceConfig = evalRunSourceConfig(runSourceKind);
  const runId = await nextSequencedId(p.runs, options.label || runSourceConfig.defaultLabel);
  const runRoot = path.join(p.runs, runId);
  await ensureDir(runRoot);
  const appServer = await appServerConfig();
  const payload = runSourceKind === "working_payload" ? payloadMetadata(runRoot, root) : null;

  if (runSourceKind === "working_payload") {
    await copyPortablePayload(root, path.join(runRoot, "payload"));
  }

  const evalSummaries = new Array<EvalRunEvalSummary>(evals.length);
  const completedEvals = new Array<string>(evals.length);
  try {
    await runBounded(evals, concurrency, async (item, index) => {
      evalSummaries[index] = await runSingleEval({
        item,
        root,
        runRoot,
        runId,
        runSourceKind,
        runSource: runSourceConfig.runSource,
        appServer,
        options
      });
      completedEvals[index] = item.folder;
    });
  } finally {
    if (options.evalRunner) options.evalRunner.close();
  }
  const errors = evalSummaries.flatMap((item) => (item.error ? [item.error] : []));

  if (!options.noLint) {
    const lint = await lintProject(root, { evalSelector: options.selector });
    if (!lint.ok) errors.push("lint checks recorded non-passing observations");
  }

  return { runId, runRoot, ok: errors.length === 0, errors, evals: completedEvals, payload, results: evalSummaries };
}

async function runSingleEval(input: { item: EvalRecord; root: string; runRoot: string; runId: string; runSourceKind: EvalRunSourceKind; runSource: EvalRunSource; appServer: Awaited<ReturnType<typeof appServerConfig>>; options: EvalRunOptions }): Promise<EvalRunEvalSummary> {
  const { item, root, runRoot, runId, runSourceKind, runSource, appServer, options } = input;
  const evalRoot = path.join(runRoot, "cases", item.folder);
  const criteriaPath = path.join(item.path, "criteria.json");
  const criteriaSha256 = await fileSha256(criteriaPath);
  await ensureDir(evalRoot);
  await fs.copyFile(path.join(item.path, "task.md"), path.join(evalRoot, "task.md"));
  const fixtures = path.join(item.path, "fixtures");
  if (await exists(fixtures)) await fs.cp(fixtures, path.join(evalRoot, "fixtures"), { recursive: true });

  const runner = createEvalRunner(options);
  try {
    const skillRoot = runSourceKind === "working_payload" ? path.join(runRoot, "payload") : undefined;
    const runResult = await runner.instance.run({ projectRoot: root, skillRoot, skill_activation: runSource.skill_activation, eval: { ...item, path: evalRoot }, runSource, runId, runRoot, appServer });
    return {
      id: item.id,
      folder: item.folder,
      title: item.metadata.title,
      execution_status: runResult.execution_status,
      task_path: path.join("cases", item.folder, "task.md"),
      criteria_path: path.relative(root, criteriaPath),
      criteria_sha256: criteriaSha256,
      response_path: path.relative(runRoot, runResult.response_path),
      rpc_path: path.relative(runRoot, runResult.rpc_path),
      transcript_path: path.relative(runRoot, runResult.transcript_path),
      scoring_status: "review_required",
      score: null,
      max_score: rubricMaxScore(item.criteria.criteria),
      token_usage: runResult.token_usage
    };
  } catch (error) {
    const message = error instanceof AppServerUnavailableError || error instanceof Error ? error.message : String(error);
    return {
      id: item.id,
      folder: item.folder,
      title: item.metadata.title,
      execution_status: "errored",
      task_path: path.join("cases", item.folder, "task.md"),
      criteria_path: path.relative(root, criteriaPath),
      criteria_sha256: criteriaSha256,
      scoring_status: "unavailable",
      score: null,
      max_score: rubricMaxScore(item.criteria.criteria),
      error: message
    };
  } finally {
    if (runner.closeAfterRun) runner.instance.close();
  }
}

function createEvalRunner(options: EvalRunOptions): { instance: EvalRunner; closeAfterRun: boolean } {
  if (options.evalRunnerFactory) return { instance: options.evalRunnerFactory(), closeAfterRun: true };
  if (options.evalRunner) return { instance: options.evalRunner, closeAfterRun: false };
  return {
    instance: new AppServerEvalRunner({
      turnTimeoutMs: options.turnTimeoutMs,
      maxTraceEvents: options.traceBufferEvents
    }),
    closeAfterRun: true
  };
}

async function runBounded<T>(items: T[], concurrency: number, task: (item: T, index: number) => Promise<void>): Promise<void> {
  let next = 0;
  const workerCount = Math.min(concurrency, items.length);
  const workers = Array.from({ length: workerCount }, async () => {
    for (;;) {
      const index = next;
      next += 1;
      if (index >= items.length) return;
      await task(items[index], index);
    }
  });
  await Promise.all(workers);
}

function evalConcurrency(value: number | undefined): number {
  if (value === undefined) return 1;
  if (!Number.isInteger(value) || value <= 0) throw new CliError("--concurrency must be a positive integer");
  return value;
}

function evalRunSourceConfig(kind: EvalRunSourceKind): { runSource: EvalRunSource; defaultLabel: string } {
  if (kind === "no_skill") {
    return { runSource: { kind, label: "No skill", skill_root: null, skill_activation: "none" }, defaultLabel: "no-skill" };
  }
  return { runSource: { kind: "working_payload", label: "Working payload", skill_root: "payload", skill_activation: "forced" }, defaultLabel: "working-payload" };
}

function payloadMetadata(runRoot: string, sourceRoot: string): { skill_root: string; skill_md: string; skill_root_abs: string; skill_md_abs: string; source_root_abs: string } {
  const skillRootAbs = path.join(runRoot, "payload");
  return {
    skill_root: "payload",
    skill_md: "payload/SKILL.md",
    skill_root_abs: skillRootAbs,
    skill_md_abs: path.join(skillRootAbs, "SKILL.md"),
    source_root_abs: sourceRoot
  };
}

function rubricMaxScore(criteria: Array<{ max_score?: number }>): number {
  return criteria.reduce((total, criterion) => total + (criterion.max_score ?? 1), 0);
}

async function fileSha256(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return createHash("sha256").update(content).digest("hex");
}
