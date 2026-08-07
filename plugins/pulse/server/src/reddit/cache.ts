import { randomBytes } from "node:crypto";
import type { ContinuationDescriptor, RedditComment, RedditPost } from "./types.ts";

export interface Clock {
  now(): number;
  sleep(milliseconds: number): Promise<void>;
}

export const systemClock: Clock = {
  now: () => Date.now(),
  sleep: (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
};

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TtlLruCache<T> {
  private readonly entries = new Map<string, CacheEntry<T>>();

  constructor(private readonly maxEntries = 128, private readonly clock: Clock = systemClock) {}

  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.clock.now()) {
      this.entries.delete(key);
      return undefined;
    }
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlMilliseconds: number): void {
    this.entries.delete(key);
    this.entries.set(key, { value, expiresAt: this.clock.now() + Math.max(1, ttlMilliseconds) });
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }
}

export class RequestBudget {
  requests = 0;
  readonly startedAt: number;

  constructor(
    private readonly clock: Clock = systemClock,
    readonly maxRequests = 15,
    readonly maxMilliseconds = 30_000
  ) {
    this.startedAt = clock.now();
  }

  get remainingMilliseconds(): number {
    return Math.max(0, this.maxMilliseconds - (this.clock.now() - this.startedAt));
  }

  consume(): void {
    if (this.requests >= this.maxRequests) throw new BudgetExceededError("Reddit request budget exhausted.");
    this.ensureTime();
    this.requests += 1;
  }

  ensureTime(): void {
    if (this.remainingMilliseconds <= 0) throw new BudgetExceededError("Reddit tool-call wall-clock budget exhausted.");
  }
}

export class BudgetExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BudgetExceededError";
  }
}

export interface UpstreamResponse {
  url: string;
  status: number;
  headers: Record<string, string>;
  text: string;
  ok: boolean;
}

export class RedditTransportError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly retryable = false
  ) {
    super(message);
    this.name = "RedditTransportError";
  }
}

export interface FetchRequest {
  method?: "GET" | "POST";
  body?: string | null;
}

export interface FetchTextResult {
  response: UpstreamResponse;
  cache: "hit" | "miss";
}

function normalizeUrl(value: string): string {
  const parsed = new URL(value);
  parsed.hash = "";
  parsed.searchParams.sort();
  return parsed.toString();
}

class Semaphore {
  private available: number;
  private readonly waiters: Array<() => void> = [];

  constructor(size: number) {
    this.available = size;
  }

  async acquire(): Promise<() => void> {
    if (this.available > 0) {
      this.available -= 1;
      return () => this.release();
    }
    await new Promise<void>((resolve) => this.waiters.push(resolve));
    this.available -= 1;
    return () => this.release();
  }

  private release(): void {
    this.available += 1;
    this.waiters.shift()?.();
  }
}

export interface RequestControllerOptions {
  fetchImpl?: typeof fetch;
  clock?: Clock;
  random?: () => number;
  userAgent?: string;
}

export class RequestController {
  private readonly fetchImpl: typeof fetch;
  private readonly clock: Clock;
  private readonly random: () => number;
  private readonly userAgent: string;
  private readonly cache: TtlLruCache<UpstreamResponse>;
  private readonly inFlight = new Map<string, Promise<UpstreamResponse>>();
  private readonly semaphore = new Semaphore(2);
  private tokens = 2;
  private lastRefill: number;
  private readonly failedOperations: number[] = [];
  private breakerOpenUntil = 0;

  constructor(options: RequestControllerOptions = {}) {
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.clock = options.clock ?? systemClock;
    this.random = options.random ?? Math.random;
    this.userAgent = options.userAgent
      ?? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
    this.cache = new TtlLruCache<UpstreamResponse>(256, this.clock);
    this.lastRefill = this.clock.now();
  }

  async fetchText(url: string, budget: RequestBudget, ttlMilliseconds: number, request: FetchRequest = {}): Promise<FetchTextResult> {
    const method = request.method ?? "GET";
    const body = request.body ?? null;
    const key = `${method} ${normalizeUrl(url)} ${body ?? ""}`;
    const cached = this.cache.get(key);
    if (cached) return { response: cached, cache: "hit" };

    const existing = this.inFlight.get(key);
    if (existing) return { response: await existing, cache: "hit" };

    const operation = this.fetchWithControl(url, budget, { method, body });
    this.inFlight.set(key, operation);
    try {
      const response = await operation;
      this.cache.set(key, response, response.ok ? ttlMilliseconds : 20_000);
      return { response, cache: "miss" };
    } finally {
      this.inFlight.delete(key);
    }
  }

  private async fetchWithControl(url: string, budget: RequestBudget, request: Required<FetchRequest>): Promise<UpstreamResponse> {
    if (this.clock.now() < this.breakerOpenUntil) {
      throw new RedditTransportError("Reddit host circuit breaker is open after repeated access failures.", 429, true);
    }

    let attempt = 0;
    let finalResponse: UpstreamResponse;
    while (true) {
      budget.consume();
      await this.takeRateToken(budget);
      const release = await this.semaphore.acquire();
      try {
        finalResponse = await this.fetchOnce(url, budget, request);
      } finally {
        release();
      }
      const retryableStatus = finalResponse.status === 429 || (finalResponse.status >= 500 && finalResponse.status <= 599);
      if (retryableStatus && attempt < 2 && budget.remainingMilliseconds > 0) {
        const delay = Math.min(2_000, 200 * 2 ** attempt + Math.floor(this.random() * 100));
        attempt += 1;
        await this.clock.sleep(delay);
        continue;
      }
      break;
    }

    if (finalResponse.status === 403 || finalResponse.status === 429) {
      this.recordFailedOperation();
    }
    return finalResponse;
  }

  private async fetchOnce(url: string, budget: RequestBudget, request: Required<FetchRequest>): Promise<UpstreamResponse> {
    budget.ensureTime();
    const controller = new AbortController();
    const timeout = Math.max(1, Math.min(30_000, budget.remainingMilliseconds));
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const headers: Record<string, string> = {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": this.userAgent,
      };
      if (request.method === "POST") headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      const response = await this.fetchImpl(url, {
        method: request.method,
        headers,
        body: request.method === "POST" ? request.body ?? "" : undefined,
        signal: controller.signal,
      });
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      return { url, status: response.status, headers: responseHeaders, text: await response.text(), ok: response.ok };
    } catch (error) {
      const message = error instanceof Error && error.name === "AbortError"
        ? "Reddit request timed out."
        : `Reddit request failed: ${error instanceof Error ? error.message : String(error)}`;
      throw new RedditTransportError(message, undefined, true);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async takeRateToken(budget: RequestBudget): Promise<void> {
    while (true) {
      budget.ensureTime();
      const now = this.clock.now();
      const elapsed = Math.max(0, now - this.lastRefill);
      this.tokens = Math.min(2, this.tokens + elapsed / 1_000);
      this.lastRefill = now;
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }
      await this.clock.sleep(Math.min(250, Math.max(1, Math.ceil((1 - this.tokens) * 1_000))));
    }
  }

  private recordFailedOperation(): void {
    const now = this.clock.now();
    this.failedOperations.push(now);
    while (this.failedOperations.length && now - this.failedOperations[0]! > 30_000) this.failedOperations.shift();
    if (this.failedOperations.length >= 3) {
      this.breakerOpenUntil = now + 10_000;
      this.failedOperations.length = 0;
    }
  }
}

export interface ThreadSession {
  id: string;
  root_id: string;
  post: RedditPost | null;
  comments: Map<string, RedditComment>;
  frontier: ContinuationDescriptor[];
  visited: Set<string>;
  total_comments: number | null;
  expansions_used: number;
  max_comments: number;
  max_depth: number;
  sort: string;
  limit_reached: boolean;
  expires_at: number;
}

export class ThreadSessionStore {
  private readonly sessions = new Map<string, ThreadSession>();

  constructor(
    private readonly clock: Clock = systemClock,
    private readonly ttlMilliseconds = 10 * 60_000,
    private readonly maxSessions = 128
  ) {}

  create(value: Omit<ThreadSession, "id" | "expires_at">): ThreadSession {
    this.prune();
    while (this.sessions.size >= this.maxSessions) {
      const oldest = this.sessions.keys().next().value;
      if (oldest === undefined) break;
      this.sessions.delete(oldest);
    }
    const id = `${this.clock.now().toString(36)}-${randomBytes(10).toString("hex")}`;
    const session = { ...value, id, expires_at: this.clock.now() + this.ttlMilliseconds };
    this.sessions.set(id, session);
    return session;
  }

  get(id: string): ThreadSession | null {
    const session = this.sessions.get(id);
    if (!session) return null;
    if (session.expires_at <= this.clock.now()) {
      this.sessions.delete(id);
      return null;
    }
    session.expires_at = this.clock.now() + this.ttlMilliseconds;
    return session;
  }

  touch(session: ThreadSession): void {
    session.expires_at = this.clock.now() + this.ttlMilliseconds;
    this.sessions.delete(session.id);
    this.sessions.set(session.id, session);
  }

  private prune(): void {
    const now = this.clock.now();
    for (const [id, session] of this.sessions) {
      if (session.expires_at <= now) this.sessions.delete(id);
    }
  }
}
