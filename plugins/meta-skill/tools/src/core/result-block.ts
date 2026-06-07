import type { ChildResult } from "./schemas.ts";
import { extractAssistantMessages, extractTextFromMessage } from "./transcript-export.ts";
import type { ThreadExport } from "./transcript-export.ts";

const RESULT_KEY = "codex_thread_result";
const FENCED_JSON = /```(?:json)?\s*([\s\S]*?)\s*```/gi;

export interface ExtractedResult {
  result: ChildResult | undefined;
  missingFields: Set<string>;
}

export function missingKeysFromResult(result: ChildResult, runId: string, taskId: string): Set<string> {
  const output = new Set<string>();
  if (!runId) {
    output.add("run_id");
  }
  if (!taskId) {
    output.add("task_id");
  }
  for (const key of ["attempt_id", "thread_id", "status", "summary"]) {
    if (!result[key as keyof ChildResult]) {
      output.add(key);
    }
  }
  return output;
}

export function extractResultFromExport(exportData: ThreadExport, fallbackRunId: string, taskId: string): ExtractedResult {
  const candidates = extractAssistantMessages(exportData.messages);
  for (let i = candidates.length - 1; i >= 0; i -= 1) {
    const message = candidates[i] as Record<string, unknown>;
    const text = extractTextFromMessage(message);
    if (!text) {
      continue;
    }

    const candidate = parseResultFromText(text);
    if (candidate.result) {
      const runId = candidate.result.run_id || fallbackRunId;
      const finalTask = candidate.result.task_id || taskId;
      return {
        result: candidate.result,
        missingFields: missingKeysFromResult(candidate.result, runId || "", finalTask || ""),
      };
    }
  }

  return {
    result: undefined,
    missingFields: new Set(["codex_thread_result"]),
  };
}

function parseResultFromText(text: string): { result: ChildResult | undefined } {
  const direct = safeJsonParse<unknown>(text);
  const directPick = pickCodexResult(direct);
  if (directPick) {
    return { result: directPick };
  }

  for (const block of text.matchAll(FENCED_JSON)) {
    const blockText = String(block[1] ?? "");
    const parsed = safeJsonParse<unknown>(blockText);
    const picked = pickCodexResult(parsed);
    if (picked) {
      return { result: picked };
    }
  }

  const markerIndex = text.indexOf(`"${RESULT_KEY}"`);
  if (markerIndex === -1) {
    return { result: undefined };
  }

  const start = text.lastIndexOf("{", markerIndex);
  if (start === -1) {
    return { result: undefined };
  }

  const parsed = parseBalancedJson(text, start);
  return {
    result: pickCodexResult(parsed),
  };
}

function safeJsonParse<T>(text: string): T | undefined {
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

function pickCodexResult(payload: unknown): ChildResult | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const obj = payload as Record<string, unknown>;
  const result = obj[RESULT_KEY];
  if (result && typeof result === "object") {
    const candidate = result as Record<string, unknown>;
    const schemaVersion = candidate.schema_version;
    if (typeof schemaVersion === "number") {
      return sanitizeChildResult(candidate);
    }
  }
  if (typeof obj.schema_version === "number" && typeof obj.task_id === "string" && typeof obj.attempt_id === "string") {
    return sanitizeChildResult(obj);
  }
  return undefined;
}

function sanitizeChildResult(raw: Record<string, unknown>): ChildResult {
  const schemaVersion = typeof raw.schema_version === "number" ? raw.schema_version : undefined;
  return {
    schema_version: schemaVersion,
    run_id: typeof raw.run_id === "string" ? raw.run_id : undefined,
    task_id: typeof raw.task_id === "string" ? raw.task_id : undefined,
    attempt_id: typeof raw.attempt_id === "string" ? raw.attempt_id : undefined,
    thread_id: typeof raw.thread_id === "string" ? raw.thread_id : undefined,
    status: typeof raw.status === "string" ? raw.status : "completed",
    summary: typeof raw.summary === "string" ? raw.summary : undefined,
  };
}

function parseBalancedJson(text: string, start: number): unknown | undefined {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const current = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (inString) {
      if (current === "\\") {
        escaped = true;
      } else if (current === '"') {
        inString = false;
      }
      continue;
    }
    if (current === '"') {
      inString = true;
      continue;
    }
    if (current === "{") {
      depth += 1;
    } else if (current === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = text.slice(start, index + 1);
        return safeJsonParse<unknown>(candidate);
      }
    }
  }
  return undefined;
}
