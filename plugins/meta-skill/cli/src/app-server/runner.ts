import { promises as fs } from "node:fs";
import path from "node:path";
import type { ScenarioRecord, TokenUsage } from "../models";
import { appendJsonl, copyPortablePayload, ensureDir, parseSkillFrontmatter, readText, unavailableTokenUsage, writeJson, writeText } from "../project";
import type { AppServerConfig, AppServerLine } from "./client";
import { AppServerJsonClient } from "./client";

interface AppServerClientLike {
  request(method: string, params: unknown): Promise<Record<string, unknown>>;
  waitFor(predicate: (message: Record<string, unknown>) => boolean, timeoutMs: number): Promise<Record<string, unknown>>;
  eventCount(): number;
  eventsSince(index: number): Record<string, unknown>[];
  close(): void;
  flush?(): Promise<void>;
}

export interface AppServerScenarioRunnerOptions {
  clientFactory?: (onLine: (line: AppServerLine) => Promise<void>) => AppServerClientLike;
  turnTimeoutMs?: number;
}

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
  private client: AppServerClientLike | undefined;
  private readonly clientFactory: (onLine: (line: AppServerLine) => Promise<void>) => AppServerClientLike;
  private readonly turnTimeoutMs: number;
  private rpcPath: string | undefined;

  constructor(options: AppServerScenarioRunnerOptions = {}) {
    this.clientFactory = options.clientFactory || ((onLine) => new AppServerJsonClient(onLine));
    this.turnTimeoutMs = options.turnTimeoutMs || 120000;
  }

  async run(input: ScenarioRunInput): Promise<ScenarioRunResult> {
    const rawRoot = path.join(input.runRoot, "scenarios", input.scenario.folder, input.side);
    await ensureDir(rawRoot);
    await ensureDir(path.join(rawRoot, "artifacts"));
    const stageRoot = path.join(rawRoot, "stage");
    await stageWorkspace(input, stageRoot);
    const attachmentName = await runtimeSkillName(input.skillRoot);

    const rpcPath = path.join(rawRoot, "rpc.jsonl");
    await this.client?.flush?.();
    this.rpcPath = rpcPath;
    const client = await this.ensureClient(input.appServer);

    const start = await client.request("thread/start", {
      cwd: stageRoot,
      runtimeWorkspaceRoots: [stageRoot],
      approvalPolicy: "never",
      sandbox: "read-only",
      experimentalRawEvents: true,
      persistExtendedHistory: false,
      ephemeral: true,
      baseInstructions: "You are executing a Meta Skill scenario. Follow the staged skill payload exactly and answer the user's task.",
      developerInstructions: [
        "Use the skill mounted in this turn as the only runtime skill guidance.",
        "Treat stage/scenario/task.md as the first user request and stage/scenario/turns.json as follow-up user turns.",
        "Do not modify files. Produce the final answer that the skill would give the user."
      ].join("\n")
    });
    const thread = start.thread as { id?: string } | undefined;
    const threadId = thread?.id;
    if (!threadId) throw new Error("App Server thread/start response did not include thread.id");

    const turnRecords: Array<{ role: "user" | "assistant"; index: number; source: string; content: string; status: string; turn_id?: string }> = [];
    let tokenUsage: TokenUsage = unavailableTokenUsage("App Server completed without token metrics.");
    let final = "";
    const turns = [{ content: input.scenario.task, source: "task.md" }, ...input.scenario.turns.map((turn) => ({ content: turn.content, source: "turns.json" }))];
    for (const [index, turn] of turns.entries()) {
      turnRecords.push({ role: "user", index, source: turn.source, content: turn.content, status: "sent" });
      const result = await runTurn(client, threadId, stageRoot, input.scenario, turn.content, index === 0, this.turnTimeoutMs, attachmentName);
      final = result.final || final;
      tokenUsage = result.tokenUsage || tokenUsage;
      turnRecords.push({ role: "assistant", index, source: "app-server", content: result.final, status: "completed", turn_id: result.turnId });
    }
    await client.flush?.();

    await writeJson(path.join(rawRoot, "thread.json"), {
      schema_version: 1,
      thread_id: threadId,
      turn_ids: turnRecords.filter((row) => row.role === "assistant").map((row) => row.turn_id),
      parent_thread_id: null,
      forked_from_id: null,
      resume_from_id: null,
      app_server: input.appServer,
      status: "completed",
      error: null
    });
    await writeText(path.join(rawRoot, "turns.jsonl"), turnRecords.map((row) => JSON.stringify(row)).join("\n"));
    await writeText(path.join(rawRoot, "final.md"), final || "(no final assistant message captured)");

    return {
      status: "needs_review",
      token_usage: tokenUsage,
      final_path: path.join(rawRoot, "final.md"),
      evidence_path: path.relative(input.runRoot, rawRoot)
    };
  }

  close(): void {
    this.client?.close();
    this.client = undefined;
  }

  private async ensureClient(appServer: AppServerConfig): Promise<AppServerClientLike> {
    if (!this.client) {
      this.client = this.clientFactory(async (line) => {
        if (!this.rpcPath) return;
        await appendJsonl(this.rpcPath, {
          schema_version: 1,
          direction: line.direction,
          message: line.message
        });
      });
      if (this.client instanceof AppServerJsonClient) await this.client.connect(appServer);
    }
    return this.client;
  }
}

async function runTurn(
  client: AppServerClientLike,
  threadId: string,
  stageRoot: string,
  scenario: ScenarioRecord,
  content: string,
  includeSkill: boolean,
  turnTimeoutMs: number,
  attachmentName: string
): Promise<{ turnId: string; final: string; tokenUsage?: TokenUsage }> {
  const mark = client.eventCount();
  const input = [
    ...(includeSkill ? [{ type: "skill", name: attachmentName, path: path.join(stageRoot, "skill") }] : []),
    { type: "text", text: content, text_elements: [] }
  ];
  const started = await client.request("turn/start", {
    threadId,
    input,
    cwd: stageRoot,
    runtimeWorkspaceRoots: [stageRoot],
    approvalPolicy: "never",
    sandboxPolicy: { type: "readOnly", networkAccess: false }
  });
  const turn = started.turn as { id?: string } | undefined;
  const turnId = turn?.id;
  if (!turnId) throw new Error("App Server turn/start response did not include turn.id");

  await client.waitFor(
    (message) => message.method === "turn/completed" && (message.params as { threadId?: string; turn?: { id?: string } } | undefined)?.threadId === threadId && (message.params as { turn?: { id?: string } } | undefined)?.turn?.id === turnId,
    turnTimeoutMs
  );
  const events = client.eventsSince(mark);
  const final = events
    .filter((message) => message.method === "item/agentMessage/delta" && (message.params as { threadId?: string; turnId?: string } | undefined)?.threadId === threadId && (message.params as { turnId?: string } | undefined)?.turnId === turnId)
    .map((message) => String((message.params as { delta?: string }).delta || ""))
    .join("");
  const tokenEvent = [...events]
    .reverse()
    .find((message) => message.method === "thread/tokenUsage/updated" && (message.params as { threadId?: string; turnId?: string } | undefined)?.threadId === threadId && (message.params as { turnId?: string } | undefined)?.turnId === turnId);
  return { turnId, final, tokenUsage: tokenEvent ? toTokenUsage((tokenEvent.params as { tokenUsage?: { last?: unknown; total?: unknown } }).tokenUsage?.last) : undefined };
}

function toTokenUsage(raw: unknown): TokenUsage {
  const metrics = raw as { inputTokens?: number; outputTokens?: number; totalTokens?: number } | undefined;
  if (!metrics) return unavailableTokenUsage("App Server token metrics were unavailable.");
  return {
    input_tokens: { available: true, value: Number(metrics.inputTokens || 0) },
    output_tokens: { available: true, value: Number(metrics.outputTokens || 0) },
    total_tokens: { available: true, value: Number(metrics.totalTokens || 0) }
  };
}

async function stageWorkspace(input: ScenarioRunInput, stageRoot: string): Promise<void> {
  await fs.rm(stageRoot, { recursive: true, force: true });
  await ensureDir(stageRoot);
  await copyPortablePayload(input.skillRoot, path.join(stageRoot, "skill"));
  await ensureDir(path.join(stageRoot, "scenario"));
  for (const name of ["task.md", "scenario.json", "turns.json", "capability.txt"]) {
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

async function runtimeSkillName(skillRoot: string): Promise<string> {
  const frontmatter = await parseSkillFrontmatter(path.join(skillRoot, "SKILL.md"));
  return frontmatter.name || path.basename(skillRoot);
}
