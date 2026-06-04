import path from "node:path";
import { AppServerUnavailableError, appServerConfig, codexVersion } from "../app-server/client";
import { AppServerCaseRunner } from "../app-server/runner";
import { lintProject } from "../lint";
import {
  CliError,
  appendJsonl,
  ensureDir,
  eventEnvelope,
  exists,
  nextSequencedId,
  projectPaths,
  relativePath,
  requirePortableSkill,
  touch,
  unavailableTokenUsage,
  utcNow,
  writeJson
} from "../project";
import { judgeRun } from "./judge";
import { classifyCaseStatus, recordCaseResult, runStatus } from "./results";
import { loadCases, writeRunCaseSnapshots } from "./cases";
import { refreshRunEvidence } from "./runs";
import type { EvalRunOptions, RunFailureClassification } from "./types";
import type { EvalRunSource, EvalRunSourceKind } from "../models";

export async function runEval(options: EvalRunOptions): Promise<{ runId: string; runRoot: string; report: string; ok: boolean; status: "completed" | "failed"; failureClassifications: RunFailureClassification[] }> {
  if (options.appServerEndpoint) {
    throw new CliError("--app-server-endpoint is not supported yet; omit it to use the managed stdio App Server", 2);
  }

  const root = await requirePortableSkill(options.project);
  const p = projectPaths(root);
  if (!(await exists(p.evalManifest))) throw new CliError("eval workbench is missing; run `meta-skill eval init <project>` first");

  const preflight = await lintProject(root, { executeTests: false });
  if (preflight.failures.length) {
    throw new CliError(`lint failed before eval run:\n${preflight.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
  }

  const cases = await loadCases(root, options.selector);
  if (!cases.length) throw new CliError("no cases selected");

  const runSourceKind = options.runSource || "working_payload";
  const runSourceConfig = evalRunSourceConfig(runSourceKind, root, p.releaseSkill);
  if (runSourceKind === "snapshot_payload") {
    if (!(await exists(path.join(p.releaseSkill, "SKILL.md")))) {
      throw new CliError("`--snapshot` requires .meta-skill/versions/release/skill/SKILL.md; run `meta-skill release <project>` first");
    }
  }

  const runId = await nextSequencedId(p.runs, options.label || runSourceConfig.defaultLabel);
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
    status: "running",
    label: options.label || null,
    suite: "default",
    cases_path: "../../cases",
    cases: { selection: cases.map((item) => item.folder) },
    run_source: runSourceConfig.runSource,
    runner: {
      backend: "app_server",
      app_server: appServer,
      codex_version: runnerVersion,
      protocol: "generated-ts",
      sandbox: "read-only",
      approval_policy: "never",
      network_access: false,
      timeout_ms: 120000
    },
    orchestration: {
      mode: "thread_per_case",
      turn_count: null
    }
  };
  await writeJson(path.join(runRoot, "run.json"), runJson);
  await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "run_started", run_id: runId, source: "meta-skill eval run", payload: runJson }));
  await writeRunCaseSnapshots(runRoot, cases);

  const runner = options.caseRunner || new AppServerCaseRunner();
  let hasFailures = false;
  const failureClassifications = new Set<RunFailureClassification>();
  try {
    for (const item of cases) {
      await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "case_started", run_id: runId, case_id: item.id, source: "meta-skill eval run", payload: { folder: item.folder, run_source: runSourceConfig.runSource } }));
      try {
        const result = await runner.run({ projectRoot: root, skillRoot: runSourceConfig.skillRoot, skill_activation: runSourceConfig.runSource.skill_activation, case: item, runSource: runSourceConfig.runSource, runId, runRoot, appServer });
        const classification = classifyCaseStatus(result.verdict || result.execution_status);
        if (classification) {
          hasFailures = true;
          failureClassifications.add(classification);
        }
        await recordCaseResult(runRoot, runId, item, runSourceConfig.runSource, result.execution_status, result.evidence_path, result.error, classification, result.verdict);
      } catch (error) {
        hasFailures = true;
        const message = error instanceof AppServerUnavailableError || error instanceof Error ? error.message : String(error);
        const classification: RunFailureClassification = error instanceof AppServerUnavailableError ? "app_server_unavailable" : "harness_unavailable";
        failureClassifications.add(classification);
        const evidencePath = relativePath(runRoot, path.join(runRoot, "cases", item.folder));
        const tokenUsage = unavailableTokenUsage("App Server execution failed before token metrics were available.");
        const caseRoot = path.join(runRoot, "cases", item.folder);
        await ensureDir(caseRoot);
        await writeJson(path.join(caseRoot, "usage.json"), tokenUsage);
        await recordCaseResult(runRoot, runId, item, runSourceConfig.runSource, "errored", evidencePath, message, classification);
        await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "case_failed", run_id: runId, case_id: item.id, source: "app_server", payload: { run_source: runSourceConfig.runSource, error: message, failure_classification: classification } }));
      }
    }
  } finally {
    runner.close();
  }

  if (!options.noLint) {
    const lint = await lintProject(root, { runId });
    if (!lint.ok) {
      hasFailures = true;
      failureClassifications.add("lint_test_failure");
    }
  } else {
    await appendJsonl(path.join(runRoot, "tests.jsonl"), eventEnvelope({ type: "lint_skipped", run_id: runId, source: "meta-skill eval run", payload: { reason: "--no-lint" } }));
  }

  if (options.withJudges) {
    const judges = await (options.judgeRunner || judgeRun)({ project: root, runId, allJudges: true, allCases: true });
    if (!judges.ok) hasFailures = true;
    for (const classification of judges.failureClassifications || []) failureClassifications.add(classification);
    if (!judges.ok && !(judges.failureClassifications || []).length) failureClassifications.add("judge_failure");
  }

  const status = runStatus(hasFailures);
  const ok = status === "completed";
  const sortedFailureClassifications = [...failureClassifications].sort();
  const finalRunJson = {
    ...runJson,
    status,
    completed_at: utcNow(),
    ok,
    failure_classifications: sortedFailureClassifications
  };
  await writeJson(path.join(runRoot, "run.json"), finalRunJson);
  await appendJsonl(path.join(runRoot, "events.jsonl"), eventEnvelope({ type: "run_completed", run_id: runId, source: "meta-skill eval run", payload: { ok, status, failure_classifications: finalRunJson.failure_classifications } }));
  const { report } = await refreshRunEvidence(root, runId);
  return { runId, runRoot, report, ok, status, failureClassifications: sortedFailureClassifications };
}

function evalRunSourceConfig(kind: EvalRunSourceKind, projectRoot: string, releaseSkill: string): { skillRoot?: string; runSource: EvalRunSource; defaultLabel: string } {
  if (kind === "snapshot_payload") {
    return { skillRoot: releaseSkill, runSource: { kind, label: "Saved snapshot payload", skill_root: "../../../versions/release/skill", skill_activation: "forced" }, defaultLabel: "saved-snapshot" };
  }
  if (kind === "no_skill") {
    return { runSource: { kind, label: "No skill", skill_root: null, skill_activation: "none" }, defaultLabel: "no-skill" };
  }
  return { skillRoot: projectRoot, runSource: { kind: "working_payload", label: "Working payload", skill_root: "../../../..", skill_activation: "forced" }, defaultLabel: "working-payload" };
}
