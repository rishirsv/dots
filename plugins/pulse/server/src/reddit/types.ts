export type PulseErrorCode =
  | "upstream_http"
  | "rate_limited"
  | "parse_changed"
  | "not_found"
  | "invalid_token"
  | "continuation_expired"
  | "partial_result";

export interface PulseError {
  code: PulseErrorCode;
  message: string;
  status?: number;
  retryable?: boolean;
  surface?: string;
}

export interface RedditFlags {
  is_deleted: boolean;
  is_removed: boolean;
  is_spoiler: boolean;
  is_nsfw: boolean;
  is_locked: boolean;
  is_archived: boolean;
  is_quarantined: boolean;
  is_stickied: boolean;
  is_promoted: boolean;
}

export type PostCollectionSurface = "rss-search" | "old-reddit-root" | "shreddit-post" | "shreddit-listing";
export type CommentCollectionSurface = "shreddit-thread" | "shreddit-comment-fragment";

export interface RedditPost {
  id: string;
  url: string;
  title: string;
  body: string;
  external_url: string | null;
  timestamp: string | null;
  author: string | null;
  subreddit: string | null;
  post_type: string;
  score: number | null;
  comment_count: number | null;
  upvote_ratio: number | null;
  flags: RedditFlags;
  collection_surface: PostCollectionSurface;
}

export interface RedditComment {
  id: string;
  url: string;
  post_id: string;
  parent_id: string | null;
  depth: number;
  body: string;
  timestamp: string | null;
  author: string | null;
  score: number | null;
  flags: RedditFlags;
  collection_surface: CommentCollectionSurface;
}

export interface ContinuationDescriptor {
  method: "GET" | "POST";
  route: string;
  body: string | null;
  parent_id: string | null;
  depth: number;
  order: number;
}

export interface ParsedRssFeed {
  posts: RedditPost[];
}

export interface ParsedListing {
  posts: RedditPost[];
  next_route: string | null;
}

export interface ParsedThread {
  post: RedditPost | null;
  comments: RedditComment[];
  continuations: ContinuationDescriptor[];
  total_comments: number | null;
}

export type PaginationScope = "feed" | "shreddit-listing" | "thread-session" | "none";

export interface ResultMeta {
  result_count: number;
  retrieved_at: string;
  next_token: string | null;
  pagination_scope: PaginationScope;
  partial: boolean;
  cache: "hit" | "miss";
  upstream_requests: number;
}

export interface PulseEnvelope<T> {
  [key: string]: unknown;
  schema_version: "pulse-reddit/v1";
  data: T;
  meta: ResultMeta;
  errors: PulseError[];
}

export interface ClientResult<T> {
  data: T;
  errors: PulseError[];
  meta: Omit<ResultMeta, "result_count" | "retrieved_at">;
}

export interface ThreadResultData {
  post: RedditPost | null;
  comments: RedditComment[];
  total_comments: number;
  loaded_comments: number;
  expansions_used: number;
  next_token: string | null;
  completeness: "initial" | "expanded" | "exhausted" | "unknown";
  partial_reason: "more_available" | "caller_limit" | "upstream_error" | "declared_gap" | "exhausted";
}
