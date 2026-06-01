import path from "node:path";
import type { ScenarioRecord } from "../models";
import { appendJsonl, eventEnvelope, exists } from "../project";
import type { RunFailureClassification } from "./types";

export async function recordScenarioResult(
  runRoot: string,
  runId: string,
  scenario: ScenarioRecord,
  side: "candidate" | "release",
  status: string,
  tokenUsage: unknown,
  evidencePath: string,
  error?: string,
  failureClassification?: RunFailureClassification | null
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
        failure_classification: failureClassification || null,
        error
      }
    })
  );
}

export async function sidesInRun(runRoot: string, scenarioFolder: string): Promise<Array<"candidate" | "release">> {
  const scenarioRoot = path.join(runRoot, "scenarios", scenarioFolder);
  const sides: Array<"candidate" | "release"> = [];
  for (const side of ["candidate", "release"] as const) {
    if (await exists(path.join(scenarioRoot, side))) sides.push(side);
  }
  return sides.length ? sides : ["candidate"];
}

export function classifyScenarioStatus(status: string): RunFailureClassification | null {
  return status === "failed" || status === "errored" ? "scenario_failed" : null;
}

export function runStatus(ok: boolean, scenarioStatuses: Set<string>): "passed" | "needs_review" | "failed" {
  if (!ok) return "failed";
  return scenarioStatuses.has("needs_review") ? "needs_review" : "passed";
}
