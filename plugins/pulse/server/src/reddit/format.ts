import type { RedditFlags } from "./types.ts";

export const REDDIT_ORIGIN = "https://www.reddit.com";
export const OLD_REDDIT_ORIGIN = "https://old.reddit.com";
const PUBLIC_REDDIT_HOSTS = new Set(["www.reddit.com", "reddit.com", "old.reddit.com", "redd.it"]);

export function validateRelativeRoute(value: string, kind: "listing" | "comments"): string {
  const trimmed = value.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\") || trimmed.includes("#")) {
    throw new Error("Continuation route must be a nonempty Reddit-relative URL.");
  }
  const parsed = new URL(trimmed, REDDIT_ORIGIN);
  if (parsed.origin !== REDDIT_ORIGIN || parsed.username || parsed.password) {
    throw new Error("Continuation route must stay on www.reddit.com.");
  }
  const validPath = kind === "listing"
    ? /^\/svc\/shreddit\/community-more-posts\/(hot|new|top)\/?$/.test(parsed.pathname)
    : /^\/svc\/shreddit\/more-comments\/(?:(?:r\/)?[a-z0-9_]{2,40}\/t3_[a-z0-9]+\/?)?$/i.test(parsed.pathname);
  if (!validPath) throw new Error("Continuation route is not a supported Reddit Shreddit route.");
  const pathname = parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
  return `${pathname}${parsed.search}`;
}

export function validateRedditUrl(value: string): string {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" || !PUBLIC_REDDIT_HOSTS.has(parsed.hostname.toLowerCase()) || parsed.username || parsed.password) {
    throw new Error("Reddit request URL must use a public Reddit HTTPS host.");
  }
  parsed.hash = "";
  return parsed.toString();
}

export function emptyFlags(): RedditFlags {
  return {
    is_deleted: false,
    is_removed: false,
    is_spoiler: false,
    is_nsfw: false,
    is_locked: false,
    is_archived: false,
    is_quarantined: false,
    is_stickied: false,
    is_promoted: false,
  };
}

export function normalizeNativeId(value: string | undefined, prefix: "t1" | "t3"): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (new RegExp(`^${prefix}_[a-z0-9]+$`, "i").test(trimmed)) return trimmed.toLowerCase();
  if (/^[a-z0-9]+$/i.test(trimmed)) return `${prefix}_${trimmed.toLowerCase()}`;
  return null;
}

export function parseNullableNumber(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") return null;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseNullableInteger(value: string | undefined): number | null {
  const parsed = parseNullableNumber(value);
  return parsed === null ? null : Math.trunc(parsed);
}

export function parseBooleanAttribute(value: string | undefined): boolean {
  if (value === undefined) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "" || !["0", "false", "no", "null", "undefined"].includes(normalized);
}

export function normalizeTimestamp(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
    const numeric = Number(trimmed);
    const milliseconds = numeric >= 100_000_000_000 ? numeric : numeric * 1_000;
    const date = new Date(milliseconds);
    return Number.isNaN(date.getTime()) ? trimmed : date.toISOString();
  }
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? trimmed : date.toISOString();
}

export function canonicalRedditUrl(value: string | undefined, fallbackPath = "/"): string {
  const candidate = value?.trim() || fallbackPath;
  try {
    const parsed = new URL(candidate, REDDIT_ORIGIN);
    if (!PUBLIC_REDDIT_HOSTS.has(parsed.hostname.toLowerCase())) return `${REDDIT_ORIGIN}${fallbackPath}`;
    parsed.protocol = "https:";
    parsed.hostname = "www.reddit.com";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return `${REDDIT_ORIGIN}${fallbackPath}`;
  }
}

export function normalizeSubreddit(value: string | undefined): string | null {
  const trimmed = value?.trim().replace(/^r\//i, "").replace(/^\/+|\/+$/g, "");
  if (!trimmed || !/^[A-Za-z0-9_]{2,40}$/.test(trimmed)) return null;
  return trimmed;
}

export function postPath(id: string): string {
  return `/comments/${id.replace(/^t3_/i, "")}/`;
}

export function oldRedditPostUrl(id: string): string {
  return `${OLD_REDDIT_ORIGIN}${postPath(id)}`;
}

export function commentPath(postId: string, commentId: string): string {
  return `/comments/${postId.replace(/^t3_/i, "")}/comment/${commentId.replace(/^t1_/i, "")}/`;
}

export function parsePostReference(value: string): { id: string; path: string } {
  const trimmed = value.trim();
  const bare = normalizeNativeId(trimmed, "t3");
  if (bare) return { id: bare, path: postPath(bare) };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`Could not parse a Reddit post ID from "${value}".`);
  }
  if (!PUBLIC_REDDIT_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new Error(`Reddit post URL must use a public Reddit host: "${value}".`);
  }
  const match = parsed.pathname.match(/\/comments\/([a-z0-9]+)/i) ?? parsed.pathname.match(/^\/([a-z0-9]+)\/?$/i);
  const id = normalizeNativeId(match?.[1], "t3");
  if (!id) throw new Error(`Could not parse a Reddit post ID from "${value}".`);
  return { id, path: postPath(id) };
}
