import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { validateRelativeRoute } from "./format.ts";

export interface ListingTokenContext {
  subreddit: string;
  sort: string;
  time_filter: string;
}

export interface ThreadTokenContext {
  root_id: string;
  sort: string;
  max_comments: number;
  max_depth: number;
}

interface ListingPayload extends ListingTokenContext {
  version: 1;
  tool: "reddit_get_subreddit_posts";
  kind: "listing";
  route: string;
  expires_at: number;
}

interface ThreadPayload extends ThreadTokenContext {
  version: 1;
  tool: "reddit_get_thread";
  kind: "thread";
  session_id: string;
  expires_at: number;
}

export class ContinuationTokenError extends Error {
  constructor(
    message: string,
    readonly code: "invalid_token" | "continuation_expired"
  ) {
    super(message);
    this.name = "ContinuationTokenError";
  }
}

export class TokenCodec {
  private readonly secret: Buffer;

  constructor(secret?: string | Uint8Array) {
    this.secret = typeof secret === "string" ? Buffer.from(secret) : Buffer.from(secret ?? randomBytes(32));
  }

  encodeListing(route: string, context: ListingTokenContext, now: number, ttlMilliseconds = 10 * 60_000): string {
    const safeRoute = validateRelativeRoute(route, "listing");
    if (!safeRoute) throw new ContinuationTokenError("Listing continuation route is empty.", "invalid_token");
    return this.encode({
      version: 1,
      tool: "reddit_get_subreddit_posts",
      kind: "listing",
      route: safeRoute,
      ...context,
      expires_at: now + ttlMilliseconds,
    } satisfies ListingPayload);
  }

  decodeListing(token: string, expected: ListingTokenContext, now: number): { route: string } {
    const payload = this.decode<ListingPayload>(token, "listing");
    if (payload.expires_at <= now) throw new ContinuationTokenError("Listing continuation has expired.", "continuation_expired");
    if (
      payload.tool !== "reddit_get_subreddit_posts" ||
      payload.subreddit !== expected.subreddit ||
      payload.sort !== expected.sort ||
      payload.time_filter !== expected.time_filter
    ) {
      throw new ContinuationTokenError("Listing continuation belongs to a different tool or request context.", "invalid_token");
    }
    try {
      return { route: validateRelativeRoute(payload.route, "listing") };
    } catch {
      throw new ContinuationTokenError("Listing continuation contains an unsafe route.", "invalid_token");
    }
  }

  encodeThread(sessionId: string, context: ThreadTokenContext, now: number, ttlMilliseconds = 10 * 60_000): string {
    return this.encode({
      version: 1,
      tool: "reddit_get_thread",
      kind: "thread",
      session_id: sessionId,
      ...context,
      expires_at: now + ttlMilliseconds,
    } satisfies ThreadPayload);
  }

  decodeThread(token: string, expected: ThreadTokenContext, now: number): { session_id: string } {
    const payload = this.decode<ThreadPayload>(token, "thread");
    if (payload.expires_at <= now) throw new ContinuationTokenError("Thread continuation has expired.", "continuation_expired");
    if (
      payload.tool !== "reddit_get_thread" ||
      payload.root_id !== expected.root_id ||
      payload.sort !== expected.sort ||
      payload.max_comments !== expected.max_comments ||
      payload.max_depth !== expected.max_depth
    ) {
      throw new ContinuationTokenError("Thread continuation belongs to a different tool or request context.", "invalid_token");
    }
    if (!/^[a-z0-9-]{8,96}$/.test(payload.session_id)) {
      throw new ContinuationTokenError("Thread continuation session is malformed.", "invalid_token");
    }
    return { session_id: payload.session_id };
  }

  private encode(payload: object): string {
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${body}.${this.sign(body)}`;
  }

  private decode<T extends { version: number; kind: string }>(token: string, expectedKind: string): T {
    if (typeof token !== "string" || token.length < 20 || token.length > 4_096) {
      throw new ContinuationTokenError("Continuation token is malformed.", "invalid_token");
    }
    const parts = token.split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1] || !this.sameSignature(parts[1], this.sign(parts[0]))) {
      throw new ContinuationTokenError("Continuation token signature is invalid.", "invalid_token");
    }
    let payload: T;
    try {
      payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")) as T;
    } catch {
      throw new ContinuationTokenError("Continuation token payload is malformed.", "invalid_token");
    }
    if (!payload || typeof payload !== "object" || payload.version !== 1 || payload.kind !== expectedKind) {
      throw new ContinuationTokenError("Continuation token has an unsupported context.", "invalid_token");
    }
    return payload;
  }

  private sign(body: string): string {
    return createHmac("sha256", this.secret).update(body).digest("base64url");
  }

  private sameSignature(left: string, right: string): boolean {
    const leftBytes = Buffer.from(left);
    const rightBytes = Buffer.from(right);
    return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
  }
}
