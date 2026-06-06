import type { TokenUsage } from "../models.ts";
import { unavailableTokenUsage } from "../project.ts";
import type { TranscriptTurn } from "./transcript.ts";

export function tokenUsageFromAppServer(params: Record<string, unknown>, turnId: string): TokenUsage {
  const tokenUsage = objectValue(params.tokenUsage);
  const modelContextWindow = numberOrNull(params.modelContextWindow);
  const total = objectValue(tokenUsage.total);
  if (!Object.keys(total).length) return unavailableTokenUsage(`App Server tokenUsage.total was unavailable for turn ${turnId}.`);
  const input = numberOrNull(total.inputTokens);
  const output = numberOrNull(total.outputTokens);
  const totalTokens = numberOrNull(total.totalTokens);
  const unavailableReason = input === null || output === null || totalTokens === null ? `App Server cumulative token metrics were unavailable for turn ${turnId}.` : null;
  return {
    input_tokens: input,
    output_tokens: output,
    total_tokens: totalTokens,
    cached_input_tokens: numberOrNull(total.cachedInputTokens),
    reasoning_tokens: numberOrNull(total.reasoningOutputTokens),
    model_context_window: modelContextWindow,
    unavailable_reason: unavailableReason
  };
}

export function summarizeEvalUsage(finalTurn?: Pick<TranscriptTurn, "tokenUsage">): TokenUsage {
  if (finalTurn?.tokenUsage.total_tokens !== null && finalTurn?.tokenUsage.total_tokens !== undefined) return finalTurn.tokenUsage;
  return unavailableTokenUsage("App Server completed without tokenUsage.total on the final turn.");
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
