import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { SkillActivation, EvalRunSource, CaseRecord, TokenUsage } from "../models.ts";
import { appendJsonl, ensureDir, exists, parseSkillFrontmatter, unavailableTokenUsage, writeText } from "../project.ts";
import type { AppServerConfig, AppServerLine } from "./client.ts";
import { AppServerJsonClient, AppServerUnavailableError } from "./client.ts";
import { collectTurnEvents, type AppServerTraceLine, type Trajectory, type TrajectoryTurn } from "./trajectory.ts";

interface AppServerClientLike {
  request(method: string, params: unknown): Promise<Record<string, unknown>>;
  waitFor(predicate: (message: Record<string, unknown>) => boolean, timeoutMs: number): Promise<Record<string, unknown>>;
  eventCount(): number;
  eventsSince(index: number): Record<string, unknown>[];
  close(): void;
  flush?(): Promise<void>;
}

export interface AppServerCaseRunnerOptions {
  clientFactory?: (onLine: (line: AppServerLine) => Promise<void>) => AppServerClientLike;
  turnTimeoutMs?: number;
  maxCaseRespawns?: number;
}

export interface CaseRunInput {
  projectRoot: string;
  skillRoot?: string;
  skill_activation: SkillActivation;
  case: CaseRecord;
  runSource: EvalRunSource;
  runId: string;
  runRoot: string;
  appServer: AppServerConfig;
}

export interface CaseRunResult {
  execution_status: "completed" | "errored";
  token_usage: TokenUsage;
  final_path: string;
  rpc_path: string;
  trajectory_path: string;
  evidence_path: string;
  thread_id?: string;
  turn_ids: string[];
  error?: string;
}

export class AppServerCaseRunner {
  private client: AppServerClientLike | undefined;
  private readonly clientFactory: (onLine: (line: AppServerLine) => Promise<void>) => AppServerClientLike;
  private readonly turnTimeoutMs: number;
  private readonly maxCaseRespawns: number;
  private rpcPath: string | undefined;
  private rawTrace: AppServerTraceLine[] = [];

  constructor(options: AppServerCaseRunnerOptions = {}) {
    this.clientFactory = options.clientFactory || ((onLine) => new AppServerJsonClient(onLine));
    this.turnTimeoutMs = options.turnTimeoutMs || 120000;
    this.maxCaseRespawns = options.maxCaseRespawns ?? 1;
  }

  async run(input: CaseRunInput): Promise<CaseRunResult> {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await this.runOnce(input);
      } catch (error) {
        if (!(error instanceof AppServerUnavailableError) || attempt >= this.maxCaseRespawns) throw error;
        this.close();
      }
    }
  }

  private async runOnce(input: CaseRunInput): Promise<CaseRunResult> {
    if (input.skill_activation === "discoverable") {
      throw new Error("Discoverable skill activation requires an App Server availability-only skill API.");
    }
    const rawRoot = path.join(input.runRoot, "cases", input.case.folder);
    await ensureDir(rawRoot);
    const runtimeRoot = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-case-"));
    const forceSkill = input.skill_activation === "forced";
    const attachmentName = forceSkill && input.skillRoot ? await runtimeSkillName(input.skillRoot) : undefined;
    const workspaceRoots = await runtimeWorkspaceRoots(runtimeRoot, input.case.path);

    try {
      const rpcPath = path.join(rawRoot, "rpc.jsonl");
      const trajectoryPath = path.join(rawRoot, "trajectory.json");
      await this.client?.flush?.();
      this.rpcPath = rpcPath;
      this.rawTrace = [];
      const client = await this.ensureClient(input.appServer);

      const start = await client.request("thread/start", {
        cwd: runtimeRoot,
        runtimeWorkspaceRoots: workspaceRoots,
        approvalPolicy: "never",
        sandbox: "read-only",
        experimentalRawEvents: true,
        persistExtendedHistory: false,
        ephemeral: true,
        baseInstructions: forceSkill ? "You are executing a Meta Skill eval case. Follow the mounted skill payload exactly and answer the user's task." : "You are executing a Meta Skill eval case without an attached skill. Answer the user's task directly.",
        developerInstructions: [
          forceSkill ? "Use the skill mounted in this turn as the only runtime skill guidance." : "No skill is mounted for this case. Answer without skill-specific runtime guidance.",
          "The user messages are supplied directly. Solver-visible fixture files, when present, are mounted as read-only workspace roots.",
          forceSkill ? "Do not modify files. Produce the final answer that the skill would give the user." : "Do not modify files. Produce the final answer you would give without a skill."
        ].join("\n")
      });
      const thread = start.thread as { id?: string } | undefined;
      const threadId = thread?.id;
      if (!threadId) throw new Error("App Server thread/start response did not include thread.id");

      const turnIds: string[] = [];
      let final = "";
      const trajectory: Trajectory = { schema_version: 1, source: "codex_app_server", threadId, turns: [] };
      const turns = [{ content: input.case.task, source: "case.md#Task" }, ...input.case.turns.map((turn, index) => ({ content: turn.content, source: `case.md#Turn ${index + 2}` }))];
      for (const [index, turn] of turns.entries()) {
        const result = await runTurn(client, this.rawTrace, threadId, runtimeRoot, workspaceRoots, turn.content, index === 0 && forceSkill, this.turnTimeoutMs, attachmentName, input.skillRoot);
        trajectory.turns.push(result);
        final = result.finalText || final;
        turnIds.push(result.turnId);
      }
      await client.flush?.();
      const caseSummary = summarizeCaseUsage(trajectory.turns.at(-1));
      await writeText(path.join(rawRoot, "final.md"), final || "(no final assistant message captured)");
      await writeText(trajectoryPath, `${JSON.stringify(trajectory, null, 2)}\n`);

      return {
        execution_status: "completed",
        token_usage: caseSummary,
        final_path: path.join(rawRoot, "final.md"),
        rpc_path: rpcPath,
        trajectory_path: trajectoryPath,
        evidence_path: path.relative(input.runRoot, rawRoot),
        thread_id: threadId,
        turn_ids: turnIds
      };
    } finally {
      await fs.rm(runtimeRoot, { recursive: true, force: true });
    }
  }

  close(): void {
    this.client?.close();
    this.client = undefined;
  }

  private async ensureClient(appServer: AppServerConfig): Promise<AppServerClientLike> {
    if (!this.client) {
      this.client = this.clientFactory(async (line) => {
        if (!this.rpcPath) return;
        this.rawTrace.push({ direction: line.direction, message: line.message });
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
  rawTrace: AppServerTraceLine[],
  threadId: string,
  runtimeRoot: string,
  workspaceRoots: string[],
  content: string,
  includeSkill: boolean,
  turnTimeoutMs: number,
  attachmentName?: string,
  skillRoot?: string
): Promise<TrajectoryTurn> {
  const traceMark = rawTrace.length;
  const mark = client.eventCount();
  const input = [
    ...(includeSkill && attachmentName && skillRoot ? [{ type: "skill", name: attachmentName, path: skillRoot }] : []),
    { type: "text", text: content, text_elements: [] }
  ];
  const started = await client.request("turn/start", {
    threadId,
    input,
    cwd: runtimeRoot,
    runtimeWorkspaceRoots: workspaceRoots,
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
  await client.flush?.();
  const traceEvents = rawTrace.slice(traceMark);
  const hasServerMessages = traceEvents.some((event) => event.direction === "server" && event.message && typeof event.message === "object" && "method" in event.message);
  return collectTurnEvents(hasServerMessages ? traceEvents : client.eventsSince(mark), { threadId, turnId });
}

function summarizeCaseUsage(finalTurn?: TrajectoryTurn): TokenUsage {
  if (finalTurn?.tokenUsage.total_tokens !== null && finalTurn?.tokenUsage.total_tokens !== undefined) return finalTurn.tokenUsage;
  return unavailableTokenUsage("App Server completed without tokenUsage.total on the final turn.");
}

async function runtimeWorkspaceRoots(runtimeRoot: string, casePath: string): Promise<string[]> {
  const roots = [runtimeRoot];
  const fixtures = path.join(casePath, "fixtures");
  if (await exists(fixtures)) roots.push(fixtures);
  return roots;
}

async function runtimeSkillName(skillRoot: string): Promise<string> {
  const frontmatter = await parseSkillFrontmatter(path.join(skillRoot, "SKILL.md"));
  return frontmatter.name || path.basename(skillRoot);
}
