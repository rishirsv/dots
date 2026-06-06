import type { TokenUsage } from "../models.ts";
import { unavailableTokenUsage } from "../project.ts";
import { tokenUsageFromAppServer } from "./evidence.ts";
import type { AppServerTraceLine } from "./trace.ts";

export interface Transcript {
  source: "codex_app_server";
  threadId: string;
  turns: TranscriptTurn[];
}

export interface TranscriptTurn {
  threadId: string;
  turnId: string;
  status: string | null;
  finalText: string;
  tokenUsage: TokenUsage;
  items: TranscriptItem[];
  approvals: TranscriptApproval[];
  unknownMethods: string[];
}

export interface TranscriptItem {
  id: string | null;
  type: string;
  status?: string | null;
  method?: string;
  command?: string | null;
  cwd?: string | null;
  output?: string | null;
  exitCode?: number | null;
  durationMs?: number | null;
  changes?: unknown[];
  server?: string | null;
  tool?: string | null;
  arguments?: unknown;
  result?: unknown;
  error?: unknown;
  text?: string;
  raw?: unknown;
}

export interface TranscriptApproval {
  requestId: string | null;
  method: string;
  itemId: string | null;
  approvalId: string | null;
  status: "requested" | "responded" | "resolved";
  decision?: unknown;
  command?: unknown;
  cwd?: string | null;
  sandboxRelevant: boolean;
}

export interface TranscriptSummary {
  turn_count: number;
  item_count: number;
  command_executions: number;
  file_changes: number;
  tool_calls: number;
  approval_requests: number;
  unknown_methods: string[];
}

export function collectTranscript(events: unknown[], selector: { threadId: string; turnId: string }): TranscriptTurn {
  const itemById = new Map<string, TranscriptItem>();
  const anonymousItems: TranscriptItem[] = [];
  const approvals = new Map<string, TranscriptApproval>();
  const unknownMethods = new Set<string>();
  const finalDeltas: string[] = [];
  let completedFinalText: string | undefined;
  let status: string | null = null;
  let tokenUsage: TokenUsage | undefined;

  for (const event of events) {
    const envelope = envelopeFrom(event);
    const message = envelope.message;
    if (!message || typeof message !== "object" || Array.isArray(message)) continue;
    const record = message as Record<string, unknown>;
    const method = stringValue(record.method);
    if (!method) {
      pairApprovalResponse(approvals, envelope, record);
      continue;
    }
    const params = objectValue(record.params);
    const eventScope = classifyEventScope(method, params, selector);
    if (eventScope !== "selectedTurn") continue;

    if (method === "item/agentMessage/delta") {
      const delta = stringValue(params.delta);
      if (delta) finalDeltas.push(delta);
      continue;
    }

    if (method === "thread/tokenUsage/updated") {
      tokenUsage = tokenUsageFromAppServer(params, selector.turnId);
      continue;
    }

    if (method === "turn/completed") {
      status = turnStatus(params);
      continue;
    }

    if (isApprovalRequest(method)) {
      const requestId = idValue(record.id);
      const approval = approvalFrom(method, requestId, params);
      approvals.set(approvalKey(requestId, approval.approvalId, method), approval);
      continue;
    }

    if (method === "serverRequest/resolved") {
      const requestId = idValue(params.requestId) || idValue(params.id) || idValue(record.id);
      const key = findApprovalKey(approvals, requestId, idValue(params.approvalId));
      if (key) approvals.set(key, { ...approvals.get(key)!, status: "resolved" });
      continue;
    }

    if (method === "item/started" || method === "item/completed") {
      const item = itemFrom(params.item, method);
      if (!item) continue;
      if (item.type === "agentMessage") completedFinalText = agentMessageText(item.raw) || item.text || completedFinalText;
      upsertItem(itemById, anonymousItems, item);
      continue;
    }

    const deltaItem = deltaItemFrom(method, params);
    if (deltaItem) {
      upsertItem(itemById, anonymousItems, deltaItem);
      continue;
    }

    if (method.startsWith("item/") || method.startsWith("turn/") || method.startsWith("thread/")) unknownMethods.add(method);
  }

  return {
    threadId: selector.threadId,
    turnId: selector.turnId,
    status,
    finalText: completedFinalText || finalDeltas.join(""),
    tokenUsage: tokenUsage || unavailableTokenUsage(`App Server completed without tokenUsage.total for turn ${selector.turnId}.`),
    items: [...itemById.values(), ...anonymousItems],
    approvals: [...approvals.values()],
    unknownMethods: [...unknownMethods].sort()
  };
}

export function summarizeTranscript(transcript: Transcript): TranscriptSummary {
  const items = transcript.turns.flatMap((turn) => turn.items);
  const unknown = new Set(transcript.turns.flatMap((turn) => turn.unknownMethods));
  return {
    turn_count: transcript.turns.length,
    item_count: items.length,
    command_executions: items.filter((item) => item.type === "commandExecution").length,
    file_changes: items.filter((item) => item.type === "fileChange").length,
    tool_calls: items.filter((item) => item.type === "mcpToolCall" || item.type === "dynamicToolCall" || item.type === "collabAgentToolCall" || item.type === "collabToolCall").length,
    approval_requests: transcript.turns.reduce((sum, turn) => sum + turn.approvals.length, 0),
    unknown_methods: [...unknown].sort()
  };
}

export function formatTranscriptSummary(summary: TranscriptSummary): string {
  const parts = [
    `${summary.turn_count} turn${summary.turn_count === 1 ? "" : "s"}`,
    `${summary.item_count} item${summary.item_count === 1 ? "" : "s"}`,
    `${summary.command_executions} command${summary.command_executions === 1 ? "" : "s"}`,
    `${summary.file_changes} file change${summary.file_changes === 1 ? "" : "s"}`,
    `${summary.tool_calls} tool call${summary.tool_calls === 1 ? "" : "s"}`,
    `${summary.approval_requests} approval${summary.approval_requests === 1 ? "" : "s"}`
  ];
  if (summary.unknown_methods.length) parts.push(`${summary.unknown_methods.length} unknown method${summary.unknown_methods.length === 1 ? "" : "s"}`);
  return parts.join(", ");
}

function envelopeFrom(event: unknown): AppServerTraceLine {
  const object = objectValue(event);
  if ("message" in object) return { direction: directionValue(object.direction), message: object.message };
  return { message: event };
}

type EventScope = "selectedTurn" | "otherTurn" | "thread" | "unscoped" | "unknown";

function classifyEventScope(method: string, params: Record<string, unknown>, selector: { threadId: string; turnId: string }): EventScope {
  if (isIntentionallyThreadScoped(method)) {
    const threadId = stringValue(params.threadId);
    if (!threadId) return "unscoped";
    return threadId === selector.threadId ? "thread" : "unknown";
  }

  if (isTurnScoped(method)) {
    const threadId = stringValue(params.threadId);
    const turnId = turnIdFrom(params);
    if (!threadId || !turnId) return "unscoped";
    if (threadId !== selector.threadId || turnId !== selector.turnId) return "otherTurn";
    return "selectedTurn";
  }

  return "unknown";
}

function isTurnScoped(method: string): boolean {
  return method.startsWith("item/") || method.startsWith("turn/") || method === "thread/tokenUsage/updated" || method === "serverRequest/resolved" || isApprovalRequest(method);
}

function isIntentionallyThreadScoped(_method: string): boolean {
  return false;
}

function turnIdFrom(params: Record<string, unknown>): string | null {
  return stringValue(params.turnId) || stringValue(objectValue(params.turn).id);
}

function turnStatus(params: Record<string, unknown>): string | null {
  return stringValue(objectValue(params.turn).status) || stringValue(params.status) || "completed";
}

function itemFrom(raw: unknown, method: string): TranscriptItem | undefined {
  const item = objectValue(raw);
  const type = stringValue(item.type);
  if (!type) return undefined;
  const base: TranscriptItem = {
    id: idValue(item.id),
    type,
    status: stringValue(item.status),
    method,
    raw
  };
  if (type === "agentMessage") return { ...base, text: agentMessageText(raw) || "" };
  if (type === "commandExecution") {
    return {
      ...base,
      command: stringValue(item.command),
      cwd: stringValue(item.cwd),
      output: stringValue(item.aggregatedOutput),
      exitCode: numberOrNull(item.exitCode),
      durationMs: numberOrNull(item.durationMs)
    };
  }
  if (type === "fileChange") return { ...base, changes: Array.isArray(item.changes) ? item.changes : [] };
  if (type === "mcpToolCall" || type === "dynamicToolCall" || type === "collabAgentToolCall" || type === "collabToolCall") {
    return {
      ...base,
      server: stringValue(item.server),
      tool: stringValue(item.tool) || stringValue(item.name),
      arguments: item.arguments,
      result: item.result,
      error: item.error,
      durationMs: numberOrNull(item.durationMs)
    };
  }
  return base;
}

function deltaItemFrom(method: string, params: Record<string, unknown>): TranscriptItem | undefined {
  const itemId = idValue(params.itemId);
  if (method === "item/commandExecution/outputDelta" || method === "item/commandExecution/terminalInteraction") {
    return { id: itemId, type: "commandExecution", method, output: stringValue(params.delta) || stringValue(params.output) || "" };
  }
  if (method === "item/fileChange/outputDelta") {
    return { id: itemId, type: "fileChange", method, output: stringValue(params.delta) || stringValue(params.output) || "" };
  }
  if (method === "item/plan/delta" || method === "turn/plan/updated") return { id: itemId, type: "plan", method, text: stringValue(params.delta) || stringValue(params.plan) || "" };
  if (method === "item/reasoning/delta") return { id: itemId, type: "reasoning", method, text: stringValue(params.delta) || "" };
  return undefined;
}

function upsertItem(items: Map<string, TranscriptItem>, anonymousItems: TranscriptItem[], next: TranscriptItem): void {
  if (!next.id) {
    anonymousItems.push(next);
    return;
  }
  const current = items.get(next.id);
  if (!current) {
    items.set(next.id, next);
    return;
  }
  items.set(next.id, {
    ...current,
    ...withoutUndefined(next),
    output: next.method === "item/completed" && next.output !== undefined ? next.output : [current.output, next.output].filter(Boolean).join("")
  });
}

function approvalFrom(method: string, requestId: string | null, params: Record<string, unknown>): TranscriptApproval {
  return {
    requestId,
    method,
    itemId: idValue(params.itemId),
    approvalId: idValue(params.approvalId),
    status: "requested",
    command: params.command,
    cwd: stringValue(params.cwd),
    sandboxRelevant: method === "item/commandExecution/requestApproval" || method === "item/fileChange/requestApproval" || method === "item/permissions/requestApproval"
  };
}

function pairApprovalResponse(approvals: Map<string, TranscriptApproval>, envelope: AppServerTraceLine, message: Record<string, unknown>): void {
  const id = idValue(message.id);
  if (!id || envelope.direction !== "client") return;
  const key = findApprovalKey(approvals, id, null);
  if (!key) return;
  const approval = approvals.get(key) as TranscriptApproval;
  approvals.set(key, { ...approval, status: "responded", decision: objectValue(message.result).decision || objectValue(message.params).decision || message.result });
}

function isApprovalRequest(method: string): boolean {
  return method === "item/commandExecution/requestApproval" || method === "item/fileChange/requestApproval" || method === "item/permissions/requestApproval" || method === "item/tool/requestUserInput" || method === "mcpServer/elicitation/request";
}

function approvalKey(requestId: string | null, approvalId: string | null, method: string): string {
  return requestId || approvalId || method;
}

function findApprovalKey(approvals: Map<string, TranscriptApproval>, requestId: string | null, approvalId: string | null): string | undefined {
  for (const [key, approval] of approvals) {
    if (requestId && approval.requestId === requestId) return key;
    if (approvalId && approval.approvalId === approvalId) return key;
  }
  return undefined;
}

function agentMessageText(raw: unknown): string | undefined {
  const item = objectValue(raw);
  return stringValue(item.text) || stringValue(item.message) || stringValue(item.content) || undefined;
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function idValue(value: unknown): string | null {
  return typeof value === "string" || typeof value === "number" ? String(value) : null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function directionValue(value: unknown): AppServerTraceLine["direction"] | undefined {
  return value === "client" || value === "server" || value === "stderr" ? value : undefined;
}

function withoutUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
}
