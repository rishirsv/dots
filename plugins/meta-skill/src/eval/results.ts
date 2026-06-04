import { promises as fs } from "node:fs";
import path from "node:path";
import type { EvalRunSource, LegacyEvalSide, CaseRecord } from "../models";
import { appendJsonl, eventEnvelope, exists } from "../project";
import type { RunFailureClassification } from "./types";

export async function recordCaseResult(
  runRoot: string,
  runId: string,
  item: CaseRecord,
  runSource: EvalRunSource,
  executionStatus: string,
  evidencePath: string,
  error?: string,
  failureClassification?: RunFailureClassification | null,
  verdict?: "passed" | "failed"
): Promise<void> {
  await appendJsonl(
    path.join(runRoot, "results.jsonl"),
    eventEnvelope({
      type: "case_result",
      run_id: runId,
      case_id: item.id,
      source: "meta-skill eval run",
      payload: {
        run_source: runSource,
        execution_status: executionStatus,
        ...(verdict ? { verdict } : {}),
        case_folder: item.folder,
        evidence_path: evidencePath,
        failure_classification: failureClassification || null,
        error
      }
    })
  );
}

export async function attemptsInRun(runRoot: string, caseFolder: string): Promise<Array<{ runSource: EvalRunSource; evidencePath: string; legacySide?: LegacyEvalSide }>> {
  const caseRoot = path.join(runRoot, "cases", caseFolder);
  if (await exists(path.join(caseRoot, "final.md"))) return [{ runSource: await runSourceFor(runRoot), evidencePath: path.join("cases", caseFolder) }];
  const attempts: Array<{ runSource: EvalRunSource; evidencePath: string; legacySide?: LegacyEvalSide }> = [];
  // Legacy read-only support for old run evidence written before the case contract.
  const scenarioRoot = path.join(runRoot, "scenarios", caseFolder);
  for (const side of ["candidate", "release"] as const) {
    if (await exists(path.join(scenarioRoot, side))) attempts.push({ runSource: legacyRunSource(side), evidencePath: path.join("scenarios", caseFolder, side), legacySide: side });
  }
  return attempts.length ? attempts : [{ runSource: await runSourceFor(runRoot), evidencePath: path.join("cases", caseFolder) }];
}

async function runSourceFor(runRoot: string): Promise<EvalRunSource> {
  try {
    const run = JSON.parse(await fs.readFile(path.join(runRoot, "run.json"), "utf8")) as { run_source?: EvalRunSource; subject?: { id?: string } | string };
    if (run.run_source?.kind) return run.run_source;
    if (typeof run.subject === "string") return legacyRunSource(run.subject);
    if (run.subject?.id) return legacyRunSource(String(run.subject.id));
  } catch {
    // Missing run.json is handled by the caller's evidence checks.
  }
  return { kind: "working_payload", label: "Working payload", skill_root: "../../../..", skill_activation: "forced" };
}

function legacyRunSource(value: string): EvalRunSource {
  if (value === "release") return { kind: "legacy_side", label: "Legacy saved snapshot side", skill_root: "../../../versions/release/skill", skill_activation: "forced" };
  return { kind: "legacy_side", label: "Legacy working payload side", skill_root: "../../../..", skill_activation: "forced" };
}

export function classifyCaseStatus(status: string): RunFailureClassification | null {
  return status === "failed" || status === "errored" ? "case_failed" : null;
}

export function runStatus(hasFailures: boolean): "completed" | "failed" {
  if (hasFailures) return "failed";
  return "completed";
}
