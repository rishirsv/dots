import {
  BudgetExceededError,
  RequestBudget,
  RequestController,
  RedditTransportError,
  ThreadSessionStore,
  type Clock,
  type FetchRequest,
  type ThreadSession,
} from "./cache.ts";
import {
  REDDIT_ORIGIN,
  normalizeSubreddit,
  oldRedditPostUrl,
  parsePostReference,
  validateRedditUrl,
  validateRelativeRoute,
} from "./format.ts";
import {
  ParseChangedError,
  parseCommentFragmentHtml,
  parseListingHtml,
  parseOldRedditRootHtml,
  parseRssFeed,
  parseThreadHtml,
} from "./parse.ts";
import { ContinuationTokenError, TokenCodec, type ListingTokenContext, type ThreadTokenContext } from "./tokens.ts";
import type {
  ClientResult,
  ContinuationDescriptor,
  PulseError,
  RedditComment,
  RedditPost,
  ThreadResultData,
} from "./types.ts";

export interface SearchPostsArgs {
  query: string;
  subreddits?: string[];
  sort?: "relevance" | "new" | "top" | "comments";
  time_filter?: "hour" | "day" | "week" | "month" | "year" | "all";
  max_results?: number;
}

export interface GetSubredditPostsArgs {
  subreddit: string;
  sort?: "hot" | "new" | "top";
  time_filter?: "hour" | "day" | "week" | "month" | "year" | "all";
  max_results?: number;
  next_token?: string;
}

export interface GetThreadArgs {
  id_or_url: string;
  sort?: "top" | "new" | "controversial";
  max_comments?: number;
  max_depth?: number;
  expansion_requests?: number;
  next_token?: string;
}

export interface RedditClientOptions {
  fetchImpl?: typeof fetch;
  clock?: Clock;
  tokenSecret?: string | Uint8Array;
}

export class PulseOperationError extends Error {
  constructor(readonly pulseError: PulseError) {
    super(pulseError.message);
    this.name = "PulseOperationError";
  }
}

class UpstreamStatusError extends Error {
  constructor(readonly status: number, readonly url: string) {
    super(`Reddit returned HTTP ${status} for ${url}.`);
    this.name = "UpstreamStatusError";
  }
}

function defaultNumber(value: number | undefined, fallback: number): number {
  return value === undefined ? fallback : Math.trunc(value);
}

function cacheState(values: Array<"hit" | "miss">): "hit" | "miss" {
  return values.length > 0 && values.every((value) => value === "hit") ? "hit" : "miss";
}

function resultMeta(
  nextToken: string | null,
  paginationScope: "feed" | "shreddit-listing" | "thread-session" | "none",
  partial: boolean,
  cacheValues: Array<"hit" | "miss">,
  budget: RequestBudget
): ClientResult<unknown>["meta"] {
  return {
    next_token: nextToken,
    pagination_scope: paginationScope,
    partial,
    cache: cacheState(cacheValues),
    upstream_requests: budget.requests,
  };
}

export function errorFor(error: unknown, surface: string): PulseError {
  if (error instanceof PulseOperationError) return { ...error.pulseError, surface: error.pulseError.surface ?? surface };
  if (error instanceof ContinuationTokenError) return { code: error.code, message: error.message, surface };
  if (error instanceof ParseChangedError) return { code: "parse_changed", message: error.message, surface };
  if (error instanceof BudgetExceededError) return { code: "partial_result", message: error.message, retryable: true, surface };
  if (error instanceof UpstreamStatusError) {
    if (error.status === 404) return { code: "not_found", message: error.message, status: error.status, surface };
    if (error.status === 403 || error.status === 429) {
      return { code: "rate_limited", message: error.message, status: error.status, retryable: true, surface };
    }
    return { code: "upstream_http", message: error.message, status: error.status, retryable: error.status >= 500, surface };
  }
  if (error instanceof RedditTransportError) {
    if (error.status === 403 || error.status === 429) {
      return { code: "rate_limited", message: error.message, status: error.status, retryable: true, surface };
    }
    return { code: "upstream_http", message: error.message, status: error.status, retryable: error.retryable, surface };
  }
  return { code: "upstream_http", message: error instanceof Error ? error.message : String(error), retryable: true, surface };
}

function withPartialError(errors: PulseError[], hasData: boolean): PulseError[] {
  if (hasData && errors.length > 0 && !errors.some((error) => error.code === "partial_result")) {
    return [...errors, { code: "partial_result", message: "Some Reddit sources or expansions could not be loaded." }];
  }
  return errors;
}

function continuationKey(item: ContinuationDescriptor): string {
  return `${item.method} ${item.route} ${item.body ?? ""}`;
}

function addFrontier(session: ThreadSession, additions: ContinuationDescriptor[]): void {
  const queued = new Set(session.frontier.map(continuationKey));
  for (const addition of additions) {
    if (!addition.route || addition.depth > session.max_depth) {
      session.limit_reached = session.limit_reached || addition.depth > session.max_depth;
      continue;
    }
    const key = continuationKey(addition);
    if (queued.has(key) || session.visited.has(key)) continue;
    queued.add(key);
    session.frontier.push(addition);
  }
  session.frontier.sort((left, right) => {
    const leftGroup = left.parent_id ? 1 : 0;
    const rightGroup = right.parent_id ? 1 : 0;
    return leftGroup - rightGroup || left.depth - right.depth || left.order - right.order;
  });
}

async function mapConcurrent<T, R>(values: T[], limit: number, fn: (value: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;
  const worker = async () => {
    while (true) {
      const index = cursor++;
      if (index >= values.length) return;
      results[index] = await fn(values[index]!);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => worker()));
  return results;
}

function routeIdentity(route: string): string {
  const parsed = new URL(route, REDDIT_ORIGIN);
  parsed.searchParams.sort();
  return `${parsed.pathname}${parsed.search}`;
}

export class RedditClient {
  private readonly clock: Clock;
  private readonly controller: RequestController;
  private readonly tokens: TokenCodec;
  private readonly sessions: ThreadSessionStore;

  constructor(options: RedditClientOptions = {}) {
    this.clock = options.clock ?? { now: () => Date.now(), sleep: (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)) };
    this.controller = new RequestController({ fetchImpl: options.fetchImpl, clock: this.clock });
    this.tokens = new TokenCodec(options.tokenSecret);
    this.sessions = new ThreadSessionStore(this.clock);
  }

  async searchPosts(args: SearchPostsArgs): Promise<ClientResult<RedditPost[]>> {
    const budget = new RequestBudget(this.clock);
    const sort = args.sort ?? "relevance";
    const timeFilter = args.time_filter ?? "all";
    const maxResults = defaultNumber(args.max_results, 25);
    const query = args.query.trim();
    const subreddits = (args.subreddits ?? []).map((value) => normalizeSubreddit(value));
    if (!query) throw new PulseOperationError({ code: "parse_changed", message: "Reddit search query cannot be empty." });
    if (subreddits.some((value) => !value)) {
      throw new PulseOperationError({ code: "parse_changed", message: "Subreddit names must be 2-40 letters, numbers, or underscores." });
    }
    const routes = [
      this.searchRoute(query, sort, timeFilter),
      ...subreddits.slice(0, 3).map((subreddit) => this.searchRoute(query, sort, timeFilter, subreddit!)),
    ];
    const posts: RedditPost[] = [];
    const seen = new Set<string>();
    const errors: PulseError[] = [];
    const caches: Array<"hit" | "miss"> = [];
    for (const route of routes) {
      try {
        const fetched = await this.fetchRoute(route, budget, 180_000);
        caches.push(fetched.cache);
        for (const post of parseRssFeed(fetched.text).posts) {
          if (seen.has(post.id)) continue;
          seen.add(post.id);
          if (posts.length < maxResults) posts.push(post);
        }
      } catch (error) {
        errors.push(errorFor(error, "rss-search"));
      }
    }
    return {
      data: posts,
      errors: withPartialError(errors, posts.length > 0),
      meta: resultMeta(null, "feed", true, caches, budget),
    };
  }

  async getPosts(ids: string[]): Promise<ClientResult<RedditPost[]>> {
    const budget = new RequestBudget(this.clock);
    const references = [...new Set(ids.map((value) => value.trim()))].map((value) => {
      try {
        return { reference: value, parsed: parsePostReference(value) };
      } catch (error) {
        return { reference: value, error };
      }
    });
    const posts: RedditPost[] = [];
    const errors: PulseError[] = references
      .filter((item): item is { reference: string; error: unknown } => "error" in item)
      .map((item) => ({ code: "not_found", message: item.error instanceof Error ? item.error.message : String(item.error), surface: "old-reddit-root" }));
    const valid = references.filter((item): item is { reference: string; parsed: { id: string; path: string } } => "parsed" in item);
    const caches: Array<"hit" | "miss"> = [];
    const loaded = await mapConcurrent(valid.slice(0, 25), 2, async (item) => {
      try {
        const fetched = await this.fetchRoute(oldRedditPostUrl(item.parsed.id), budget, 120_000);
        caches.push(fetched.cache);
        return { post: parseOldRedditRootHtml(fetched.text), error: null };
      } catch (error) {
        return { post: null, error: errorFor(error, "old-reddit-root") };
      }
    });
    for (const item of loaded) {
      if (item.post) posts.push(item.post);
      if (item.error) errors.push(item.error);
    }
    return {
      data: posts,
      errors: withPartialError(errors, posts.length > 0),
      meta: resultMeta(null, "none", errors.length > 0, caches, budget),
    };
  }

  async getSubredditPosts(args: GetSubredditPostsArgs): Promise<ClientResult<RedditPost[]>> {
    const budget = new RequestBudget(this.clock);
    const subreddit = normalizeSubreddit(args.subreddit);
    if (!subreddit) throw new PulseOperationError({ code: "not_found", message: "Invalid subreddit name." });
    const sort = args.sort ?? "hot";
    const timeFilter = args.time_filter ?? "all";
    const maxResults = defaultNumber(args.max_results, 25);
    const context: ListingTokenContext = { subreddit, sort, time_filter: timeFilter };
    let route: string;
    try {
      route = args.next_token !== undefined
        ? this.tokens.decodeListing(args.next_token, context, this.clock.now()).route
        : this.listingRoute(subreddit, sort, timeFilter, maxResults);
    } catch (error) {
      throw new PulseOperationError(errorFor(error, "shreddit-listing"));
    }
    try {
      const fetched = await this.fetchRoute(route, budget, sort === "top" ? 600_000 : 60_000);
      const parsed = parseListingHtml(fetched.text);
      const safeNextRoute = parsed.next_route && routeIdentity(parsed.next_route) !== routeIdentity(route) ? parsed.next_route : null;
      const nextToken = safeNextRoute ? this.tokens.encodeListing(safeNextRoute, context, this.clock.now()) : null;
      return {
        data: parsed.posts.slice(0, maxResults),
        errors: [],
        meta: resultMeta(nextToken, "shreddit-listing", Boolean(nextToken), [fetched.cache], budget),
      };
    } catch (error) {
      return {
        data: [],
        errors: [errorFor(error, "shreddit-listing")],
        meta: resultMeta(null, "shreddit-listing", true, [], budget),
      };
    }
  }

  async getThread(args: GetThreadArgs): Promise<ClientResult<ThreadResultData>> {
    const budget = new RequestBudget(this.clock);
    const reference = (() => {
      try {
        return parsePostReference(args.id_or_url);
      } catch (error) {
        throw new PulseOperationError({ code: "not_found", message: error instanceof Error ? error.message : String(error), surface: "shreddit-thread" });
      }
    })();
    const sort = args.sort ?? "top";
    const maxComments = defaultNumber(args.max_comments, 50);
    const maxDepth = defaultNumber(args.max_depth, 6);
    const expansionRequests = defaultNumber(args.expansion_requests, 1);
    if (args.next_token !== undefined && expansionRequests === 0) {
      throw new PulseOperationError({
        code: "invalid_token",
        message: "Thread continuation calls require at least one expansion request.",
        surface: "thread-session",
      });
    }
    const context: ThreadTokenContext = { root_id: reference.id, sort, max_comments: maxComments, max_depth: maxDepth };
    const errors: PulseError[] = [];
    const caches: Array<"hit" | "miss"> = [];
    let session: ThreadSession | null = null;
    let initial = false;
    let beforeComments = new Set<string>();

    if (args.next_token !== undefined) {
      try {
        const decoded = this.tokens.decodeThread(args.next_token, context, this.clock.now());
        session = this.sessions.get(decoded.session_id);
        if (!session) throw new ContinuationTokenError("Thread traversal session has expired.", "continuation_expired");
        beforeComments = new Set(session.comments.keys());
      } catch (error) {
        throw new PulseOperationError(errorFor(error, "thread-session"));
      }
    } else {
      initial = true;
      try {
        const commentsRoute = `/svc/shreddit/comments/r/all/${reference.id}?sort=${encodeURIComponent(sort)}`;
        const fetched = await this.fetchRoute(commentsRoute, budget, 120_000);
        caches.push(fetched.cache);
        const parsed = parseThreadHtml(fetched.text, reference.id);
        let rootPost = parsed.post;
        try {
          const rootFetched = await this.fetchRoute(oldRedditPostUrl(reference.id), budget, 120_000);
          caches.push(rootFetched.cache);
          rootPost = parseOldRedditRootHtml(rootFetched.text);
        } catch (error) {
          errors.push(errorFor(error, "old-reddit-root"));
        }
        session = this.sessions.create({
          root_id: reference.id,
          post: rootPost,
          comments: new Map<string, RedditComment>(),
          frontier: [],
          visited: new Set<string>(),
          total_comments: parsed.total_comments,
          expansions_used: 0,
          max_comments: maxComments,
          max_depth: maxDepth,
          sort,
          limit_reached: false,
        });
        this.addComments(session, parsed.comments);
        addFrontier(session, parsed.continuations);
      } catch (error) {
        throw new PulseOperationError(errorFor(error, "shreddit-thread"));
      }
    }

    if (!session) throw new PulseOperationError({ code: "upstream_http", message: "Thread session could not be created.", surface: "thread-session" });

    const expansionLimit = Math.max(0, Math.min(5, expansionRequests));
    let expansionsThisCall = 0;
    while (session.frontier.length > 0 && expansionsThisCall < expansionLimit && session.comments.size < maxComments) {
      const descriptor = session.frontier.shift()!;
      const key = continuationKey(descriptor);
      if (session.visited.has(key)) continue;
      try {
        const safeRoute = validateRelativeRoute(descriptor.route, "comments");
        const request: FetchRequest = { method: descriptor.method, body: descriptor.method === "POST" ? descriptor.body ?? "" : null };
        const fetched = await this.fetchRoute(safeRoute, budget, 600_000, request);
        caches.push(fetched.cache);
        session.visited.add(key);
        const parsed = parseCommentFragmentHtml(fetched.text, reference.id);
        this.addComments(session, parsed.comments);
        addFrontier(session, parsed.continuations);
        session.expansions_used += 1;
        expansionsThisCall += 1;
        this.sessions.touch(session);
      } catch (error) {
        session.frontier.unshift(descriptor);
        errors.push(errorFor(error, "shreddit-comment-fragment"));
        break;
      }
    }

    if (session.comments.size >= maxComments && session.frontier.length > 0) session.limit_reached = true;
    this.sessions.touch(session);
    const allComments = [...session.comments.values()];
    const returnedComments = allComments.filter((comment) => !beforeComments.has(comment.id)).slice(0, maxComments);
    const canContinue = session.frontier.length > 0 && !session.limit_reached;
    const nextToken = canContinue ? this.tokens.encodeThread(session.id, context, this.clock.now()) : null;
    const declaredGap = session.total_comments !== null && session.total_comments > allComments.length;
    const completeness: ThreadResultData["completeness"] = errors.length > 0 || declaredGap || session.limit_reached
      ? "unknown"
      : session.frontier.length === 0
        ? "exhausted"
        : session.expansions_used === 0
          ? "initial"
          : "expanded";
    const partialReason: ThreadResultData["partial_reason"] = errors.length > 0
      ? "upstream_error"
      : session.limit_reached
        ? "caller_limit"
        : declaredGap
          ? "declared_gap"
          : nextToken
            ? "more_available"
            : "exhausted";
    const partial = errors.length > 0 || declaredGap || session.limit_reached || Boolean(nextToken) || completeness !== "exhausted";
    const data: ThreadResultData = {
      post: session.post,
      comments: returnedComments,
      total_comments: session.total_comments ?? allComments.length,
      loaded_comments: allComments.length,
      expansions_used: session.expansions_used,
      next_token: nextToken,
      completeness,
      partial_reason: partialReason,
    };
    return {
      data,
      errors: withPartialError(errors, returnedComments.length > 0 || Boolean(data.post)),
      meta: resultMeta(nextToken, "thread-session", partial, caches, budget),
    };
  }

  private addComments(session: ThreadSession, comments: RedditComment[]): void {
    for (const comment of comments) {
      if (comment.depth > session.max_depth) {
        session.limit_reached = true;
        continue;
      }
      if (session.comments.has(comment.id)) continue;
      if (session.comments.size >= session.max_comments) {
        session.limit_reached = true;
        continue;
      }
      session.comments.set(comment.id, comment);
    }
  }

  private async fetchRoute(
    route: string,
    budget: RequestBudget,
    ttlMilliseconds: number,
    request: FetchRequest = {}
  ): Promise<{ text: string; cache: "hit" | "miss" }> {
    const url = route.startsWith("http") ? validateRedditUrl(route) : `${REDDIT_ORIGIN}${route}`;
    const fetched = await this.controller.fetchText(url, budget, ttlMilliseconds, request);
    if (!fetched.response.ok) throw new UpstreamStatusError(fetched.response.status, url);
    return { text: fetched.response.text, cache: fetched.cache };
  }

  private searchRoute(query: string, sort: string, timeFilter: string, subreddit?: string): string {
    const params = new URLSearchParams({ q: query, sort, t: timeFilter });
    return `${subreddit ? `/r/${subreddit}` : ""}/search.rss?${params.toString()}`;
  }

  private listingRoute(subreddit: string, sort: string, timeFilter: string, limit: number): string {
    const params = new URLSearchParams({ name: subreddit, t: timeFilter, limit: String(limit) });
    return `/svc/shreddit/community-more-posts/${sort}/?${params.toString()}`;
  }
}
