import type { PulseEnvelope, PulseError, ResultMeta } from "./reddit/types.ts";

export const SCHEMA_VERSION = "pulse-reddit/v1" as const;

function countResults(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === "object" && "comments" in data && Array.isArray((data as { comments?: unknown }).comments)) {
    return ((data as { comments: unknown[] }).comments).length;
  }
  return data === null || data === undefined ? 0 : 1;
}

export function makeEnvelope<T>(
  data: T,
  meta: Omit<ResultMeta, "result_count" | "retrieved_at"> & Partial<Pick<ResultMeta, "result_count" | "retrieved_at">>,
  errors: PulseError[] = []
): PulseEnvelope<T> {
  return {
    schema_version: SCHEMA_VERSION,
    data,
    meta: {
      result_count: meta.result_count ?? countResults(data),
      retrieved_at: meta.retrieved_at ?? new Date().toISOString(),
      next_token: meta.next_token,
      pagination_scope: meta.pagination_scope,
      partial: meta.partial,
      cache: meta.cache,
      upstream_requests: meta.upstream_requests,
    },
    errors,
  };
}

export function mcpResult<T>(envelope: PulseEnvelope<T>) {
  return {
    structuredContent: envelope,
    content: [{ type: "text" as const, text: JSON.stringify(envelope, null, 2) }],
  };
}

export function mcpError<T>(envelope: PulseEnvelope<T>) {
  return {
    isError: true,
    structuredContent: envelope,
    content: [{ type: "text" as const, text: JSON.stringify(envelope, null, 2) }],
  };
}
