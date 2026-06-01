import { promises as fs } from "node:fs";
import path from "node:path";
import type { ScenarioRecord, TokenUsage } from "../models";
import { appendJsonl, copyPortablePayload, ensureDir, eventEnvelope, readText, unavailableTokenUsage, writeJson, writeText } from "../project";
import type { AppServerConfig } from "./client";
import { AppServerUnavailableError } from "./client";
import type { ClientRequest } from "./protocol";

export interface ScenarioRunInput {
  projectRoot: string;
  skillRoot: string;
  scenario: ScenarioRecord;
  side: "candidate" | "release";
  runId: string;
  runRoot: string;
  appServer: AppServerConfig;
}

export interface ScenarioRunResult {
  status: "passed" | "failed" | "needs_review" | "errored";
  token_usage: TokenUsage;
  final_path: string;
  evidence_path: string;
  error?: string;
}

export class AppServerScenarioRunner {
  async run(input: ScenarioRunInput): Promise<ScenarioRunResult> {
    const rawRoot = path.join(input.runRoot, "scenarios", input.scenario.folder, input.side);
    await ensureDir(rawRoot);
    await ensureDir(path.join(rawRoot, "artifacts"));
    await stageWorkspace(input, path.join(rawRoot, "stage"));

    const reason =
      "Codex App Server generated TypeScript protocol types are vendored, but the request/notification client is not wired yet. " +
      "This v1 hard-cut path intentionally fails fast instead of falling back to codex exec.";
    const tokenUsage = unavailableTokenUsage("App Server execution did not complete; exact token usage is unavailable.");
    await appendJsonl(
      path.join(rawRoot, "rpc.jsonl"),
      {
        schema_version: 1,
        type: "app_server_unavailable",
        app_server: input.appServer,
        protocol_request_type: "ClientRequest",
        reason
      }
    );
    await writeJson(path.join(rawRoot, "thread.json"), {
      schema_version: 1,
      thread_id: null,
      turn_ids: [],
      parent_thread_id: null,
      forked_from_id: null,
      resume_from_id: null,
      app_server: input.appServer,
      status: "errored",
      error: reason
    });
    await writeText(
      path.join(rawRoot, "turns.jsonl"),
      [
        JSON.stringify({ role: "user", index: 0, source: "task.md", content: input.scenario.task, status: "not_executed" }),
        ...input.scenario.turns.map((turn, index) =>
          JSON.stringify({ role: "user", index: index + 1, source: "turns.json", content: turn.content, status: "not_executed" })
        )
      ].join("\n")
    );
    await writeText(path.join(rawRoot, "final.md"), `# App Server Execution Unavailable\n\n${reason}\n`);

    const _protocolCompileProof: ClientRequest | null = null;
    void _protocolCompileProof;
    throw new AppServerUnavailableError(reason);
  }
}

async function stageWorkspace(input: ScenarioRunInput, stageRoot: string): Promise<void> {
  await fs.rm(stageRoot, { recursive: true, force: true });
  await ensureDir(stageRoot);
  await copyPortablePayload(input.skillRoot, path.join(stageRoot, "skill"));
  await ensureDir(path.join(stageRoot, "scenario"));
  for (const name of ["task.md", "criteria.json", "scenario.json", "turns.json", "capability.txt"]) {
    const source = path.join(input.scenario.path, name);
    try {
      await fs.copyFile(source, path.join(stageRoot, "scenario", name));
    } catch {
      // Optional scenario files are simply absent from the staged workspace.
    }
  }
  const resources = path.join(input.scenario.path, "resources");
  try {
    await fs.cp(resources, path.join(stageRoot, "scenario", "resources"), { recursive: true });
  } catch {
    // Scenario resources are optional.
  }
  await writeText(
    path.join(stageRoot, "HARNESS.md"),
    `# Meta Skill App Server Harness\n\nRun ${input.runId}, scenario ${input.scenario.id}, side ${input.side}.\n`
  );
}
