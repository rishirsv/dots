import type {
  SearchPostsParams,
  TimelineParams,
  XApiErrorBody,
  XListResponse,
  XPost,
  XRateLimit,
  XUser,
} from "./types.ts";
import { VERSION } from "./version.ts";

const API_BASE = "https://api.x.com/2";

const TWEET_FIELDS = [
  "id",
  "text",
  "created_at",
  "author_id",
  "conversation_id",
  "in_reply_to_user_id",
  "referenced_tweets",
  "public_metrics",
  "lang",
  "entities",
  "attachments",
  "possibly_sensitive",
  "note_tweet",
  "edit_history_tweet_ids",
  "reply_settings",
].join(",");

const USER_FIELDS = [
  "id",
  "name",
  "username",
  "description",
  "created_at",
  "public_metrics",
  "verified",
  "verified_type",
  "profile_image_url",
  "location",
  "url",
  "protected",
  "pinned_tweet_id",
].join(",");

const MEDIA_FIELDS = [
  "media_key",
  "type",
  "url",
  "preview_image_url",
  "alt_text",
  "duration_ms",
  "height",
  "width",
  "public_metrics",
].join(",");

const POST_EXPANSIONS = [
  "author_id",
  "attachments.media_keys",
  "referenced_tweets.id",
  "referenced_tweets.id.author_id",
  "in_reply_to_user_id",
  "entities.mentions.username",
].join(",");

const POST_LIST_FIELDS = {
  "tweet.fields": TWEET_FIELDS,
  "user.fields": USER_FIELDS,
  "media.fields": MEDIA_FIELDS,
  expansions: POST_EXPANSIONS,
};

/** Builds a query string, skipping undefined values. */
function buildQuery(params: Record<string, string | undefined>): URLSearchParams {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, value);
  }
  return query;
}

function assertBatchSize(values: string[], label: string): void {
  if (values.length === 0) {
    throw new Error(`At least one ${label} is required.`);
  }
  if (values.length > 100) {
    throw new Error(`Lookup is limited to 100 ${label}s per request.`);
  }
}

export class XApiError extends Error {
  readonly status: number;
  readonly title?: string;
  readonly detail?: string;
  readonly rateLimit?: XRateLimit;
  readonly body?: unknown;

  constructor(message: string, options: { status: number; title?: string; detail?: string; rateLimit?: XRateLimit; body?: unknown }) {
    super(message);
    this.name = "XApiError";
    this.status = options.status;
    this.title = options.title;
    this.detail = options.detail;
    this.rateLimit = options.rateLimit;
    this.body = options.body;
  }
}

export interface XClientOptions {
  bearerToken: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

export class XClient {
  private readonly bearerToken: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: XClientOptions) {
    this.bearerToken = options.bearerToken;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? `x-search-mcp/${VERSION}`;
  }

  searchPosts(params: SearchPostsParams): Promise<XListResponse<XPost>> {
    const query = buildQuery({
      ...POST_LIST_FIELDS,
      query: params.query,
      max_results: String(clampMaxResults(params.max_results, 10, 100, 10)),
      next_token: params.next_token,
      since_id: params.since_id,
      until_id: params.until_id,
      start_time: params.start_time,
      end_time: params.end_time,
      sort_order: params.sort_order,
    });
    return this.get(`/tweets/search/recent?${query}`);
  }

  getPosts(ids: string[]): Promise<XListResponse<XPost>> {
    assertBatchSize(ids, "post ID");
    const query = buildQuery({ ...POST_LIST_FIELDS, ids: ids.join(",") });
    return this.get(`/tweets?${query}`);
  }

  getUserByUsername(username: string): Promise<XListResponse<XUser>> {
    const query = buildQuery({ "user.fields": USER_FIELDS });
    return this.get(`/users/by/username/${encodeURIComponent(username)}?${query}`);
  }

  getUsersByUsernames(usernames: string[]): Promise<XListResponse<XUser>> {
    assertBatchSize(usernames, "username");
    const query = buildQuery({ usernames: usernames.join(","), "user.fields": USER_FIELDS });
    return this.get(`/users/by?${query}`);
  }

  getUsersByIds(ids: string[]): Promise<XListResponse<XUser>> {
    assertBatchSize(ids, "user ID");
    const query = buildQuery({ ids: ids.join(","), "user.fields": USER_FIELDS });
    return this.get(`/users?${query}`);
  }

  getUserPosts(userId: string, params: TimelineParams = {}): Promise<XListResponse<XPost>> {
    return this.getTimeline(`/users/${encodeURIComponent(userId)}/tweets`, params);
  }

  getUserMentions(userId: string, params: TimelineParams = {}): Promise<XListResponse<XPost>> {
    return this.getTimeline(`/users/${encodeURIComponent(userId)}/mentions`, params);
  }

  getQuotePosts(postId: string, params: { max_results?: number; next_token?: string } = {}): Promise<XListResponse<XPost>> {
    const query = buildQuery({
      ...POST_LIST_FIELDS,
      max_results: String(clampMaxResults(params.max_results, 10, 100, 10)),
      pagination_token: params.next_token,
    });
    return this.get(`/tweets/${encodeURIComponent(postId)}/quote_tweets?${query}`);
  }

  searchSpaces(params: { query: string; max_results?: number; state?: "live" | "scheduled" | "all" }): Promise<unknown> {
    const query = buildQuery({
      query: params.query,
      "space.fields": [
        "id",
        "title",
        "state",
        "created_at",
        "started_at",
        "scheduled_start",
        "ended_at",
        "lang",
        "is_ticketed",
        "host_ids",
        "speaker_ids",
        "participant_count",
        "subscriber_count",
        "topic_ids",
      ].join(","),
      "user.fields": USER_FIELDS,
      expansions: ["host_ids", "speaker_ids", "creator_id", "invited_user_ids", "topic_ids"].join(","),
      state: params.state,
      max_results: params.max_results ? String(clampMaxResults(params.max_results, 1, 100, 10)) : undefined,
    });
    return this.get(`/spaces/search?${query}`);
  }

  getUsage(): Promise<unknown> {
    return this.get("/usage/tweets");
  }

  private getTimeline(path: string, params: TimelineParams): Promise<XListResponse<XPost>> {
    const query = buildQuery({
      ...POST_LIST_FIELDS,
      max_results: String(clampMaxResults(params.max_results, 5, 100, 10)),
      pagination_token: params.next_token,
      since_id: params.since_id,
      until_id: params.until_id,
      start_time: params.start_time,
      end_time: params.end_time,
      exclude: params.exclude?.length ? params.exclude.join(",") : undefined,
    });
    return this.get(`${path}?${query}`);
  }

  private async get<T>(path: string): Promise<T> {
    const response = await this.fetchImpl(`${API_BASE}${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        "User-Agent": this.userAgent,
      },
    });

    const rateLimit: XRateLimit = {
      limit: response.headers.get("x-rate-limit-limit") ?? undefined,
      remaining: response.headers.get("x-rate-limit-remaining") ?? undefined,
      reset: response.headers.get("x-rate-limit-reset") ?? undefined,
    };

    let body: unknown = undefined;
    const text = await response.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!response.ok) {
      const errorBody = (typeof body === "object" && body ? body : {}) as XApiErrorBody;
      const nested = errorBody.errors?.[0];
      const title = errorBody.title ?? nested?.title;
      const detail = errorBody.detail ?? nested?.detail ?? nested?.message;
      throw new XApiError(formatApiError(response.status, title, detail, rateLimit), {
        status: response.status,
        title,
        detail,
        rateLimit,
        body,
      });
    }

    return body as T;
  }
}

export function resolveBearerToken(env: NodeJS.ProcessEnv = process.env): string | undefined {
  return firstNonEmpty(env.X_BEARER_TOKEN, env.BEARER_TOKEN, env.TWITTER_BEARER_TOKEN, env.X_API_BEARER_TOKEN);
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return undefined;
}

function clampMaxResults(value: number | undefined, min: number, max: number, fallback: number): number {
  if (value === undefined || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function formatApiError(status: number, title?: string, detail?: string, rateLimit?: XRateLimit): string {
  const parts = [`X API request failed (${status})`];
  if (title) parts.push(title);
  if (detail) parts.push(detail);
  if (status === 401 || status === 403) {
    parts.push("Check that X_BEARER_TOKEN is valid and that this endpoint is included in your API plan.");
  }
  if (status === 429) {
    const reset = rateLimit?.reset ? ` Rate limit resets at unix ${rateLimit.reset}.` : "";
    parts.push(`Rate limited.${reset} Wait and retry, or reduce search/timeline volume.`);
  }
  return parts.join(" — ");
}
