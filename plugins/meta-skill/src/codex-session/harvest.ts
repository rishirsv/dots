import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { parseChildResultBlock, renderChildResultSummary, type ChildResult } from "./child-result.ts";
import { CliError, ensureDir, exists, readText, relativePath, utcNow, writeJson, writeText } from "../project.ts";

const execFileAsync = promisify(execFile);
const TOOL_OUTPUT_SUMMARY_LIMIT = 1200;

export type ParentDecision = "accepted" | "rejected" | "partial" | "review-required" | "follow-up" | "errored";
export type IsolationBackend = "git-worktree" | "scratch-copy" | "local-thread" | "unknown";

export interface HarvestOptions {
  project: string;
  runId: string;
  attemptId: string;
  evalId?: string;
  threadId?: string;
  parentThreadId?: string;
  sessionPath?: string;
  sessionRoot?: string;
  isolationBackend?: IsolationBackend;
  decision?: ParentDecision;
  parentReview?: string;
}

export interface HarvestResult {
  runRoot: string;
  attemptRoot: string;
  manifestPath: string;
  finalPath: string;
  turnsPath: string;
  transcriptPath: string;
  worktreePath: string;
  gitStatusPath: string;
  diffPath: string;
  childResultPath: string | null;
  parentSummaryPath: string;
  finalText: string;
  childResult: ChildResult | null;
  turnCount: number;
  itemCount: number;
}

export interface CodexSession {
  meta: Record<string, unknown>;
  turns: NormalizedTurn[];
  finalText: string;
  rawText: string;
}

export interface NormalizedTurn {
  timestamp: string | null;
  turn_id: string;
  role: "user" | "assistant" | "tool" | "system";
  item_type: string;
  message_text: string | null;
  tool_call_name: string | null;
  tool_call_arguments: unknown;
  tool_output_summary: string | null;
  final_answer: boolean;
}

export async function harvestCodexSession(options: HarvestOptions): Promise<HarvestResult> {
  if (!options.runId) throw new CliError("harvest requires --run <run-id>", 2);
  if (!options.attemptId) throw new CliError("harvest requires --attempt <attempt-id>", 2);
  if (!options.sessionPath && !options.threadId) throw new CliError("harvest requires --session <path> or --thread <thread-id>", 2);

  const projectRoot = path.resolve(options.project);
  const sessionPath = options.sessionPath ? path.resolve(options.sessionPath) : await findCodexSessionPath(options.threadId!, options.sessionRoot);
  const session = await parseCodexSession(sessionPath);
  const sessionThreadId = stringValue(session.meta.id);
  const threadId = options.threadId || sessionThreadId;
  if (options.threadId && sessionThreadId && options.threadId !== sessionThreadId) {
    throw new CliError(`session id ${sessionThreadId} does not match requested thread ${options.threadId}`);
  }

  const runRoot = path.join(projectRoot, ".meta-skill", "runs", options.runId);
  const attemptRoot = path.join(runRoot, "attempts", options.attemptId);
  await ensureDir(attemptRoot);

  const childCwd = stringValue(session.meta.cwd) || projectRoot;
  const worktree = await collectWorktreeMetadata(childCwd, options.isolationBackend || inferIsolationBackend(childCwd));
  const finalText = session.finalText || "(final answer unavailable in Codex session evidence)";
  const prompt = firstUserMessage(session.turns) || "(user prompt unavailable in normalized Codex evidence)";
  const parentReview = options.parentReview || "Parent review not recorded by harvest prototype.";
  const parsedChildResult = parseChildResultBlock(finalText);
  const childResult = parsedChildResult?.result || null;
  const parentDecision = options.decision || childResult?.decision_recommendation || "review-required";

  await writeText(path.join(attemptRoot, "prompt.md"), prompt);
  await writeText(path.join(attemptRoot, "visible-files.txt"), await visibleFiles(childCwd));
  await writeText(path.join(attemptRoot, "transcript.jsonl"), session.rawText);
  await writeJsonl(path.join(attemptRoot, "turns.jsonl"), session.turns);
  await writeText(path.join(attemptRoot, "transcript.md"), renderTranscriptMarkdown(session.turns));
  await writeText(path.join(attemptRoot, "final.md"), finalText);
  await writeJson(path.join(attemptRoot, "worktree.json"), worktree);
  await writeText(path.join(attemptRoot, "git-status.txt"), worktree.git_status || "(git status unavailable)");
  await writeText(path.join(attemptRoot, "diff.patch"), worktree.diff || "");
  await writeText(path.join(attemptRoot, "parent-review.md"), parentReview);
  if (childResult) {
    await writeJson(path.join(attemptRoot, "child-result.json"), childResult);
  }
  await writeText(path.join(attemptRoot, "parent-summary.md"), renderAttemptSummary({
    runId: options.runId,
    attemptId: options.attemptId,
    threadId,
    evidencePath: relativePath(projectRoot, attemptRoot),
    childResult,
    parentDecision,
    changedPaths: worktree.changed_paths
  }));
  await writeJson(path.join(attemptRoot, "manifest.json"), {
    attempt_id: options.attemptId,
    eval_id: options.evalId || null,
    thread_id: threadId,
    parent_thread_id: options.parentThreadId || null,
    thread_title: null,
    source_session_jsonl_path: sessionPath,
    capture_time: utcNow(),
    child_cwd: childCwd,
    isolation_backend: worktree.isolation_backend,
    model: stringValue(session.meta.model) || stringValue(session.meta.model_provider) || null,
    effort: stringValue(session.meta.effort),
    agent_role: null,
    edited_files: worktree.changed_paths.length > 0,
    parent_decision: parentDecision,
    child_result_path: childResult ? "child-result.json" : null,
    child_status: childResult?.status || null,
    child_decision_recommendation: childResult?.decision_recommendation || null
  });
  await writeRunJson(runRoot, {
    run_id: options.runId,
    project_root: projectRoot,
    parent_thread_id: options.parentThreadId || null,
    isolation_backend: worktree.isolation_backend,
    attempts: [
      {
        attempt_id: options.attemptId,
        eval_id: options.evalId || null,
        thread_id: threadId,
        evidence_path: relativePath(runRoot, attemptRoot),
        parent_decision: parentDecision,
        child_status: childResult?.status || null,
        child_decision_recommendation: childResult?.decision_recommendation || null
      }
    ]
  });

  return {
    runRoot,
    attemptRoot,
    manifestPath: path.join(attemptRoot, "manifest.json"),
    finalPath: path.join(attemptRoot, "final.md"),
    turnsPath: path.join(attemptRoot, "turns.jsonl"),
    transcriptPath: path.join(attemptRoot, "transcript.jsonl"),
    worktreePath: path.join(attemptRoot, "worktree.json"),
    gitStatusPath: path.join(attemptRoot, "git-status.txt"),
    diffPath: path.join(attemptRoot, "diff.patch"),
    childResultPath: childResult ? path.join(attemptRoot, "child-result.json") : null,
    parentSummaryPath: path.join(attemptRoot, "parent-summary.md"),
    finalText,
    childResult,
    turnCount: new Set(session.turns.map((turn) => turn.turn_id)).size,
    itemCount: session.turns.length
  };
}

export async function parseCodexSession(sessionPath: string): Promise<CodexSession> {
  const rawText = await readText(sessionPath);
  const lines = rawText.split(/\n/).filter((line) => line.trim().length > 0);
  const turns: NormalizedTurn[] = [];
  const meta: Record<string, unknown> = {};
  let currentTurnId = "session";
  let seenTurnContext = false;
  let finalText = "";

  for (const line of lines) {
    const record = jsonRecord(line);
    const timestamp = stringValue(record.timestamp);
    const type = stringValue(record.type);
    const payload = objectValue(record.payload);
    if (type === "session_meta") {
      Object.assign(meta, objectValue(record.payload));
      continue;
    }
    if (type === "turn_context") {
      seenTurnContext = true;
      currentTurnId = stringValue(payload.turn_id) || currentTurnId;
      if (typeof payload.cwd === "string" && !meta.cwd) meta.cwd = payload.cwd;
      if (typeof payload.model === "string") meta.model = payload.model;
      if (typeof payload.effort === "string") meta.effort = payload.effort;
      continue;
    }
    if (type === "task_complete") {
      const taskFinal = stringValue(payload.last_agent_message);
      if (taskFinal) finalText = taskFinal;
      continue;
    }
    if (type !== "response_item") continue;
    if (!seenTurnContext) continue;

    const itemType = stringValue(payload.type);
    if (itemType === "message") {
      const role = roleValue(payload.role);
      if (role === "system") continue;
      const text = messageText(payload.content);
      const isFinal = role === "assistant" && stringValue(payload.phase) === "final_answer";
      if (isFinal && text) finalText = text;
      if (text) {
        turns.push({
          timestamp,
          turn_id: currentTurnId,
          role,
          item_type: itemType,
          message_text: text,
          tool_call_name: null,
          tool_call_arguments: null,
          tool_output_summary: null,
          final_answer: isFinal
        });
      }
      continue;
    }
    if (itemType === "function_call") {
      turns.push({
        timestamp,
        turn_id: currentTurnId,
        role: "assistant",
        item_type: itemType,
        message_text: null,
        tool_call_name: toolName(payload),
        tool_call_arguments: parseMaybeJson(payload.arguments),
        tool_output_summary: null,
        final_answer: false
      });
      continue;
    }
    if (itemType === "function_call_output") {
      turns.push({
        timestamp,
        turn_id: currentTurnId,
        role: "tool",
        item_type: itemType,
        message_text: null,
        tool_call_name: stringValue(payload.call_id),
        tool_call_arguments: null,
        tool_output_summary: summarizeToolOutput(payload.output),
        final_answer: false
      });
    }
  }

  return { meta, turns, finalText, rawText };
}

export async function findCodexSessionPath(threadId: string, sessionRoot = path.join(os.homedir(), ".codex", "sessions")): Promise<string> {
  const direct = await findByName(sessionRoot, threadId);
  if (direct) return direct;
  throw new CliError(`could not find Codex session JSONL for thread ${threadId} under ${sessionRoot}`);
}

async function findByName(root: string, threadId: string): Promise<string | null> {
  if (!(await exists(root))) return null;
  for (const dirent of await fs.readdir(root, { withFileTypes: true })) {
    const child = path.join(root, dirent.name);
    if (dirent.isDirectory()) {
      const found = await findByName(child, threadId);
      if (found) return found;
    } else if (dirent.isFile() && dirent.name.endsWith(".jsonl") && dirent.name.includes(threadId)) {
      return child;
    }
  }
  return null;
}

async function collectWorktreeMetadata(cwd: string, isolationBackend: IsolationBackend) {
  const git = await gitInfo(cwd);
  const changedPaths = git.status
    .split(/\n/)
    .map((line) => line.slice(3).trim())
    .filter(Boolean);
  return {
    cwd,
    repo_root: git.root,
    git_pointer: await gitPointer(cwd),
    branch: git.branch,
    head: git.head,
    dirty: git.status.trim().length > 0,
    changed_paths: changedPaths,
    preserved: true,
    disposable: false,
    isolation_backend: isolationBackend,
    git_status: git.status,
    diff: git.diff
  };
}

async function gitInfo(cwd: string): Promise<{ root: string | null; branch: string | null; head: string | null; status: string; diff: string }> {
  try {
    const root = (await execFileAsync("git", ["rev-parse", "--show-toplevel"], { cwd })).stdout.trim() || null;
    const branch = (await execFileAsync("git", ["branch", "--show-current"], { cwd })).stdout.trim() || null;
    const head = (await execFileAsync("git", ["rev-parse", "HEAD"], { cwd })).stdout.trim() || null;
    const status = (await execFileAsync("git", ["status", "--short"], { cwd })).stdout;
    const diff = (await execFileAsync("git", ["diff", "--binary"], { cwd, maxBuffer: 20 * 1024 * 1024 })).stdout;
    return { root, branch, head, status, diff };
  } catch {
    return { root: null, branch: null, head: null, status: "", diff: "" };
  }
}

async function gitPointer(cwd: string): Promise<string | null> {
  try {
    return (await fs.readFile(path.join(cwd, ".git"), "utf8")).trim();
  } catch {
    return null;
  }
}

function inferIsolationBackend(cwd: string): IsolationBackend {
  return cwd.includes(`${path.sep}.codex${path.sep}worktrees${path.sep}`) ? "git-worktree" : "local-thread";
}

async function visibleFiles(cwd: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd, maxBuffer: 10 * 1024 * 1024 });
    return stdout.trim() || "(no visible files reported by git)";
  } catch {
    return "Visible files unavailable: child cwd is not a Git checkout or could not be read.";
  }
}

async function writeJsonl(target: string, values: unknown[]): Promise<void> {
  await writeText(target, values.map((value) => JSON.stringify(value)).join("\n"));
}

async function writeRunJson(runRoot: string, next: Record<string, unknown>): Promise<void> {
  const target = path.join(runRoot, "run.json");
  const existing = (await exists(target)) ? JSON.parse(await readText(target)) as Record<string, unknown> : {};
  const attempts = [...arrayValue(existing.attempts), ...arrayValue(next.attempts)];
  const deduped = new Map<string, unknown>();
  for (const attempt of attempts) {
    const key = stringValue(objectValue(attempt).attempt_id) || JSON.stringify(attempt);
    deduped.set(key, attempt);
  }
  await writeJson(target, { ...existing, ...next, attempts: [...deduped.values()] });
}

function firstUserMessage(turns: NormalizedTurn[]): string | null {
  return turns.find((turn) => turn.role === "user" && turn.message_text)?.message_text || null;
}

function renderTranscriptMarkdown(turns: NormalizedTurn[]): string {
  return turns
    .map((turn) => {
      const label = turn.final_answer ? `${turn.role} final` : turn.role;
      const body = turn.message_text || turn.tool_output_summary || (turn.tool_call_name ? `tool call: ${turn.tool_call_name}` : "");
      return `## ${label} (${turn.turn_id})\n\n${body}`;
    })
    .join("\n\n");
}

function renderAttemptSummary(input: {
  runId: string;
  attemptId: string;
  threadId: string | null;
  evidencePath: string;
  childResult: ChildResult | null;
  parentDecision: ParentDecision;
  changedPaths: string[];
}): string {
  if (input.childResult) {
    return `${renderChildResultSummary(input.childResult)}
## Parent Harvest

- Thread: ${input.threadId || "(unknown)"}
- Evidence path: ${input.evidencePath}
- Parent decision: ${input.parentDecision}
`;
  }

  const changedFiles = input.changedPaths.length ? input.changedPaths.map((file) => `- ${file}`).join("\n") : "- none";
  return `# Child Result

- Run: ${input.runId}
- Attempt: ${input.attemptId}
- Thread: ${input.threadId || "(unknown)"}
- Decision recommendation: review-required
- Evidence path: ${input.evidencePath}

## Changed Files

${changedFiles}

## Parent Harvest

No structured child result block was found in the final response.
`;
}

function jsonRecord(line: string): Record<string, unknown> {
  try {
    return objectValue(JSON.parse(line));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new CliError(`invalid Codex session JSONL line (${detail})`);
  }
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length ? value : null;
}

function roleValue(value: unknown): NormalizedTurn["role"] {
  return value === "user" || value === "assistant" || value === "tool" ? value : "system";
}

function messageText(content: unknown): string | null {
  const chunks = arrayValue(content)
    .map((item) => stringValue(objectValue(item).text))
    .filter((text): text is string => Boolean(text));
  return chunks.join("\n\n") || null;
}

function toolName(payload: Record<string, unknown>): string | null {
  const namespace = stringValue(payload.namespace);
  const name = stringValue(payload.name);
  return namespace && name ? `${namespace}.${name}` : name;
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value ?? null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function summarizeToolOutput(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > TOOL_OUTPUT_SUMMARY_LIMIT ? `${text.slice(0, TOOL_OUTPUT_SUMMARY_LIMIT)}\n[truncated]` : text;
}
