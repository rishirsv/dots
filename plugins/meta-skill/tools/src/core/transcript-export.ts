import { parseJsonOrJsonl } from "./jsonl.ts";
import { readFileSync } from "node:fs";

export interface ThreadExport {
  thread_id?: string;
  messages: Record<string, unknown>[];
  metadata: Record<string, unknown>;
}

const THREAD_ID_KEYS = ["thread_id", "threadId", "id"] as const;
const MESSAGE_FIELDS = ["messages", "turns", "events", "entries", "transcript", "items"] as const;
const TEXT_FIELDS = ["text", "content", "output", "body", "message", "details", "result"] as const;

export function loadThreadExport(filePath: string): ThreadExport {
  const raw = readFileSync(filePath, "utf8");
  const objects = parseJsonOrJsonl(raw);
  if (!objects.length) {
    throw new Error(`thread export "${filePath}" is empty`);
  }

  const messages: Record<string, unknown>[] = [];
  let threadId: string | undefined;
  const metadata: Record<string, unknown> = { source_path: filePath };

  for (const item of objects) {
    if (!item || typeof item !== "object") {
      throw new Error(`thread export "${filePath}" contains non-object entry`);
    }

    const obj = item as Record<string, unknown>;
    messages.push(...extractMessages(obj));

    if (!threadId) {
      threadId = extractThreadId(obj);
    }

    for (const [key, value] of Object.entries(obj)) {
      if (["task_id", "attempt_id", "thread_id", "status"].includes(key)) {
        if (typeof value === "string" && value.trim()) {
          metadata[key] = value;
        }
      }
    }
  }

  if (!threadId) {
    for (const item of objects) {
      const maybe = extractThreadId(item as Record<string, unknown>);
      if (maybe) {
        threadId = maybe;
        break;
      }
    }
  }

  if (messages.length === 0) {
    throw new Error(`thread export "${filePath}" has no supported messages`);
  }
  if (!messages.some((message) => extractTextFromMessage(message))) {
    throw new Error(`thread export "${filePath}" has no supported text-bearing messages`);
  }

  return { thread_id: threadId, messages, metadata };
}

function extractThreadId(payload: Record<string, unknown>): string | undefined {
  for (const key of THREAD_ID_KEYS) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  const thread = payload.thread;
  if (thread && typeof thread === "object") {
    return extractThreadId(thread as Record<string, unknown>);
  }
  return undefined;
}

function extractMessages(payload: Record<string, unknown>): Record<string, unknown>[] {
  for (const field of MESSAGE_FIELDS) {
    const value = payload[field];
    if (Array.isArray(value)) {
      if (field === "turns") {
        return value.flatMap((entry) => extractTurnMessages(entry));
      }
      return value.filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null);
    }
  }
  return [];
}

function extractTurnMessages(turn: unknown): Record<string, unknown>[] {
  if (!turn || typeof turn !== "object") {
    return [];
  }
  const items = (turn as Record<string, unknown>).items;
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null);
}

export function extractTextFromMessage(message: Record<string, unknown>): string {
  if (typeof message === "string") {
    return message;
  }
  if (typeof message !== "object" || message === null) {
    return "";
  }

  for (const key of TEXT_FIELDS) {
    const value = message[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  for (const value of Object.values(message)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const text = extractTextFromMessage(
          typeof item === "string" ? { text: item } : (item as Record<string, unknown>),
        );
        if (text) {
          return text;
        }
      }
    }
  }

  return "";
}

export function extractRole(message: Record<string, unknown>): string {
  return String(message.role || message.author || message.actor || message.type || "")
    .replace(/[_-]/g, "")
    .toLowerCase();
}

export function extractAssistantMessages(messages: Record<string, unknown>[]): Record<string, unknown>[] {
  const assistant = messages.filter((item) => {
    const role = extractRole(item);
    return role === "assistant" || role === "assistantmessage" || role === "agentmessage" || role === "model";
  });
  return assistant.length > 0 ? assistant : messages.slice(-1);
}
