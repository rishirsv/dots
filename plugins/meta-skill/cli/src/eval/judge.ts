import path from "node:path";
import type { ScenarioRecord } from "../models";
import { AppServerJsonClient, AppServerUnavailableError, appServerConfig } from "../app-server/client";
import { CliError, appendJsonl, eventEnvelope, exists, projectPaths, readText, relativePath, requirePortableSkill } from "../project";
import { loadScenarios } from "./scenarios";
import { sidesInRun } from "./results";
import type { JudgeOptions, JudgeRunResult, RunFailureClassification } from "./types";

export async function judgeRun(options: JudgeOptions): Promise<JudgeRunResult> {
  const root = await requirePortableSkill(options.project);
  const p = projectPaths(root);
  const runRoot = path.join(p.runs, options.runId);
  if (!(await exists(runRoot))) throw new CliError(`run does not exist: ${options.runId}`);
  if (!options.judge && !options.allJudges) throw new CliError("eval judge requires --judge <id> or --all-judges", 2);
  if (!options.scenario && !options.allScenarios) throw new CliError("eval judge requires --scenario <id> or --all-scenarios", 2);

  const scenarios = await loadScenarios(root, options.allScenarios ? {} : { scenario: [options.scenario as string] });
  let annotations = 0;
  let ok = true;
  const failureClassifications = new Set<RunFailureClassification>();
  const appServer = await appServerConfig();
  const judgeClient = new AppServerJsonClient(async (line) => {
    await appendJsonl(path.join(runRoot, "grades.rpc.jsonl"), {
      schema_version: 1,
      direction: line.direction,
      message: line.message
    });
  });
  try {
    await judgeClient.connect(appServer);
    for (const scenario of scenarios) {
      const judgeIds = options.allJudges ? (scenario.criteria.judges || []).map((judge) => judge.id) : [options.judge as string];
      for (const judgeId of judgeIds) {
        const judgePath = path.join(p.judges, `${judgeId}.md`);
        if (!(await exists(judgePath))) throw new CliError(`judge does not exist: ${judgeId}`);
        const judgePrompt = await readText(judgePath);
        const threshold = (scenario.criteria.judges || []).find((judge) => judge.id === judgeId)?.threshold;
        for (const side of await sidesInRun(runRoot, scenario.folder)) {
          const finalPath = path.join(runRoot, "scenarios", scenario.folder, side, "final.md");
          if (!(await exists(finalPath))) {
            ok = false;
            failureClassifications.add("harness_unavailable");
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
                  failure_classification: "harness_unavailable",
                  reason: `missing scenario final evidence: ${relativePath(runRoot, finalPath)}`
                }
              })
            );
            annotations += 1;
            continue;
          }
          const final = await readText(finalPath);
          const result = await runJudge(judgeClient, root, judgeId, judgePrompt, scenario, side, final);
          const passed = judgePassed(result, threshold);
          ok = ok && passed;
          if (!passed) failureClassifications.add("judge_failure");
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
                status: passed ? "passed" : "failed",
                failure_classification: passed ? null : "judge_failure",
                threshold: threshold || null,
                result
              }
            })
          );
          annotations += 1;
        }
      }
    }
  } catch (error) {
    ok = false;
    const message = error instanceof Error ? error.message : String(error);
    const classification: RunFailureClassification = error instanceof AppServerUnavailableError ? "app_server_unavailable" : "judge_failure";
    failureClassifications.add(classification);
    for (const scenario of scenarios) {
      const judgeIds = options.allJudges ? (scenario.criteria.judges || []).map((judge) => judge.id) : [options.judge as string];
      for (const judgeId of judgeIds) {
        for (const side of await sidesInRun(runRoot, scenario.folder)) {
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
                failure_classification: classification,
                reason: message
              }
            })
          );
          annotations += 1;
        }
      }
    }
  } finally {
    await judgeClient.flush();
    judgeClient.close();
  }
  return { annotations, ok, failureClassifications: [...failureClassifications].sort() };
}

async function runJudge(
  client: AppServerJsonClient,
  projectRoot: string,
  judgeId: string,
  judgePrompt: string,
  scenario: ScenarioRecord,
  side: "candidate" | "release",
  final: string
): Promise<Record<string, unknown>> {
  const start = await client.request("thread/start", {
    cwd: projectRoot,
    runtimeWorkspaceRoots: [projectRoot],
    approvalPolicy: "never",
    sandbox: "read-only",
    experimentalRawEvents: false,
    persistExtendedHistory: false,
    ephemeral: true,
    baseInstructions: "You are a strict Meta Skill eval judge. Return only JSON.",
    developerInstructions: "Evaluate the saved scenario evidence against the judge prompt. Do not use tools."
  });
  const threadId = (start.thread as { id?: string } | undefined)?.id;
  if (!threadId) throw new Error("judge thread/start response did not include thread.id");
  const mark = client.eventCount();
  const prompt = [
    "# Judge Prompt",
    judgePrompt,
    "# Scenario",
    JSON.stringify({ id: scenario.id, folder: scenario.folder, side, metadata: scenario.metadata, criteria: scenario.criteria }, null, 2),
    "# Candidate Final",
    final,
    "# Required Output",
    'Return compact JSON with: {"overall": number from 1 to 5, "pass": boolean, "rationale": string, "dimensions": object}.'
  ].join("\n\n");
  const turn = await client.request("turn/start", {
    threadId,
    input: [{ type: "text", text: prompt, text_elements: [] }],
    cwd: projectRoot,
    runtimeWorkspaceRoots: [projectRoot],
    approvalPolicy: "never",
    sandboxPolicy: { type: "readOnly", networkAccess: false }
  });
  const turnId = (turn.turn as { id?: string } | undefined)?.id;
  if (!turnId) throw new Error("judge turn/start response did not include turn.id");
  await client.waitFor(
    (message) => message.method === "turn/completed" && (message.params as { threadId?: string; turn?: { id?: string } } | undefined)?.threadId === threadId && (message.params as { turn?: { id?: string } } | undefined)?.turn?.id === turnId,
    120000
  );
  const text = client
    .eventsSince(mark)
    .filter((message) => message.method === "item/agentMessage/delta" && (message.params as { turnId?: string } | undefined)?.turnId === turnId)
    .map((message) => String((message.params as { delta?: string }).delta || ""))
    .join("")
    .trim();
  return parseJudgeJson(text);
}

function parseJudgeJson(text: string): Record<string, unknown> {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const raw = fenced ? fenced[1] : text;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return { overall: 0, pass: false, rationale: text || "Judge returned no parseable JSON.", dimensions: {} };
  }
}

function judgePassed(result: Record<string, unknown>, threshold?: { overall_min?: number; dimensions?: Record<string, number> }): boolean {
  if (typeof result.pass === "boolean") return result.pass;
  const overall = typeof result.overall === "number" ? result.overall : 0;
  if (threshold?.overall_min !== undefined) return overall >= threshold.overall_min;
  return overall >= 3;
}
