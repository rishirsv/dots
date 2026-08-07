import { load, type CheerioAPI } from "cheerio/slim";
import type { AnyNode } from "domhandler";
import {
  REDDIT_ORIGIN,
  canonicalRedditUrl,
  commentPath,
  emptyFlags,
  normalizeNativeId,
  normalizeSubreddit,
  normalizeTimestamp,
  parseBooleanAttribute,
  parseNullableInteger,
  parseNullableNumber,
  postPath,
  validateRelativeRoute,
} from "./format.ts";
import type {
  ContinuationDescriptor,
  ParsedListing,
  ParsedRssFeed,
  ParsedThread,
  PostCollectionSurface,
  RedditComment,
  RedditPost,
} from "./types.ts";

export class ParseChangedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseChangedError";
  }
}

function firstAttr($: CheerioAPI, node: AnyNode, names: string[]): string | undefined {
  const element = $(node);
  for (const name of names) {
    const value = element.attr(name);
    if (value !== undefined && value.trim() !== "") return value.trim();
  }
  return undefined;
}

function firstText($: CheerioAPI, node: AnyNode, selectors: string[]): string | undefined {
  for (const selector of selectors) {
    const value = $(node).find(selector).first().text().trim();
    if (value) return value;
  }
  return undefined;
}

function firstHtml($: CheerioAPI, node: AnyNode, selectors: string[]): string | undefined {
  for (const selector of selectors) {
    const candidate = $(node).find(selector).first();
    if (candidate.length) return candidate.html() ?? candidate.text();
  }
  return undefined;
}

function htmlToText(html: string | undefined): string {
  if (!html) return "";
  const fragment = load(html);
  return fragment.root().text()
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function subredditFromPath(path: string | undefined): string | null {
  const match = path?.match(/\/r\/([^/]+)/i);
  return normalizeSubreddit(match?.[1]);
}

function externalHref(html: string | undefined, discussionUrl: string): string | null {
  if (!html) return null;
  const fragment = load(html);
  const hrefs = fragment("a[href]").map((_index, element) => fragment(element).attr("href")?.trim() ?? "").get();
  for (const href of hrefs) {
    try {
      const parsed = new URL(href, REDDIT_ORIGIN);
      if (["www.reddit.com", "reddit.com", "old.reddit.com", "redd.it"].includes(parsed.hostname.toLowerCase())) continue;
      return parsed.toString();
    } catch {
      continue;
    }
  }
  return discussionUrl && !discussionUrl.includes("/comments/") ? discussionUrl : null;
}

function flagsFrom($: CheerioAPI, node: AnyNode): ReturnType<typeof emptyFlags> {
  const attrTrue = (names: string[]) => names.some((name) => parseBooleanAttribute($(node).attr(name)));
  const classes = ($(node).attr("class") ?? "").toLowerCase().split(/\s+/);
  const hasClass = (...names: string[]) => names.some((name) => classes.includes(name));
  return {
    is_deleted: attrTrue(["is-deleted", "deleted", "data-deleted", "data-is-deleted"]) || hasClass("deleted"),
    is_removed: attrTrue(["is-removed", "removed", "data-removed", "data-is-removed"]) || hasClass("removed"),
    is_spoiler: attrTrue(["is-spoiler", "spoiler", "data-spoiler"]) || hasClass("spoiler"),
    is_nsfw: attrTrue(["is-nsfw", "nsfw", "over-18", "data-nsfw"]) || hasClass("over18", "nsfw"),
    is_locked: attrTrue(["is-locked", "locked", "data-locked"]) || hasClass("locked"),
    is_archived: attrTrue(["is-archived", "archived", "data-archived"]) || hasClass("archived"),
    is_quarantined: attrTrue(["is-quarantined", "quarantined", "data-quarantined"]) || hasClass("quarantine", "quarantined"),
    is_stickied: attrTrue(["is-stickied", "stickied", "pinned", "data-stickied"]) || hasClass("stickied", "pinned"),
    is_promoted: attrTrue(["is-promoted", "promoted", "is-ad", "data-promoted"]) || hasClass("promoted"),
  };
}

function postFromShreddit($: CheerioAPI, node: AnyNode, surface: "shreddit-post" | "shreddit-listing"): RedditPost | null {
  const id = normalizeNativeId(firstAttr($, node, ["thingid", "thing-id", "data-thing-id", "id", "post-id", "data-post-id"]), "t3");
  if (!id) return null;
  const permalink = firstAttr($, node, ["permalink", "post-permalink", "canonical-url", "data-permalink"]);
  const url = canonicalRedditUrl(permalink, postPath(id));
  const title = firstAttr($, node, ["post-title", "title", "data-title"])
    ?? firstText($, node, ["[slot='title']", "h1", "h2"])
    ?? "";
  const bodyHtml = firstAttr($, node, ["post-body", "body", "body-html", "data-body"])
    ?? firstHtml($, node, ["[id$='-post-rtjson-content']", "[id$='-rtjson-content']", "[slot='text-body']", "[slot='post-body']", "[slot='text']", ".md", "[data-testid='post-content']"]);
  const externalCandidate = firstAttr($, node, ["content-href", "outbound-url", "external-url", "data-url"]);
  const externalUrl = (() => {
    if (!externalCandidate) return null;
    try {
      const parsed = new URL(externalCandidate, REDDIT_ORIGIN);
      if (["www.reddit.com", "reddit.com", "old.reddit.com", "redd.it"].includes(parsed.hostname.toLowerCase())) return null;
      return parsed.toString();
    } catch {
      return null;
    }
  })();
  const subreddit = normalizeSubreddit(firstAttr($, node, ["subreddit-prefixed-name", "subreddit", "subreddit-name", "data-subreddit"]))
    ?? subredditFromPath(permalink);
  const author = firstAttr($, node, ["author", "author-name", "data-author"]);
  const flags = flagsFrom($, node);
  if (author === "[deleted]") flags.is_deleted = true;
  return {
    id,
    url,
    title,
    body: htmlToText(bodyHtml),
    external_url: externalUrl,
    timestamp: normalizeTimestamp(firstAttr($, node, ["created-timestamp", "created", "timestamp", "data-created", "data-timestamp"])),
    author: author && !["[deleted]", "[removed]"].includes(author) ? author.replace(/^\/?u\//, "") : null,
    subreddit,
    post_type: firstAttr($, node, ["post-type", "type", "data-post-type"]) ?? (externalUrl ? "link" : "self"),
    score: parseNullableInteger(firstAttr($, node, ["score", "post-score", "data-score"])),
    comment_count: parseNullableInteger(firstAttr($, node, ["comment-count", "comments-count", "number-of-comments", "data-comments-count"])),
    upvote_ratio: parseNullableNumber(firstAttr($, node, ["upvote-ratio", "upvote_ratio", "data-upvote-ratio"])),
    flags,
    collection_surface: surface,
  };
}

function postFromOldReddit($: CheerioAPI, node: AnyNode): RedditPost | null {
  const id = normalizeNativeId(firstAttr($, node, ["data-fullname", "data-thing-id", "thingid", "id"]), "t3");
  if (!id) return null;
  const permalink = firstAttr($, node, ["data-permalink", "data-url"]);
  const titleNode = $(node).find("a.title").first();
  const titleHref = titleNode.attr("href")?.trim();
  const url = canonicalRedditUrl(permalink, postPath(id));
  const externalCandidate = firstAttr($, node, ["data-url"]) ?? titleHref;
  const externalUrl = (() => {
    if (!externalCandidate) return null;
    try {
      const parsed = new URL(externalCandidate, REDDIT_ORIGIN);
      if (["www.reddit.com", "reddit.com", "old.reddit.com", "redd.it"].includes(parsed.hostname.toLowerCase())) return null;
      return parsed.toString();
    } catch {
      return null;
    }
  })();
  const author = firstAttr($, node, ["data-author"]) ?? firstText($, node, [".tagline .author"]);
  const bodyHtml = firstHtml($, node, [".usertext-body .md", ".usertext-body", ".expando .md"]);
  const flags = flagsFrom($, node);
  if (author === "[deleted]") flags.is_deleted = true;
  const body = htmlToText(bodyHtml);
  if (body === "[removed]") flags.is_removed = true;
  if (body === "[deleted]") flags.is_deleted = true;
  return {
    id,
    url,
    title: titleNode.text().trim(),
    body,
    external_url: externalUrl,
    timestamp: normalizeTimestamp(firstAttr($, node, ["data-timestamp"]) ?? $(node).find("time[data-timestamp]").first().attr("data-timestamp")),
    author: author && !["[deleted]", "[removed]"].includes(author) ? author.replace(/^\/?u\//, "") : null,
    subreddit: normalizeSubreddit(firstAttr($, node, ["data-subreddit", "data-subreddit-prefixed-name"])) ?? subredditFromPath(permalink),
    post_type: externalUrl ? "link" : "self",
    score: parseNullableInteger(firstAttr($, node, ["data-score"]) ?? firstText($, node, [".score"])),
    comment_count: parseNullableInteger(firstText($, node, ["a.comments"])),
    upvote_ratio: parseNullableNumber(firstAttr($, node, ["data-upvote-ratio"])),
    flags,
    collection_surface: "old-reddit-root",
  };
}

function commentFromShreddit($: CheerioAPI, node: AnyNode, postId: string, surface: "shreddit-thread" | "shreddit-comment-fragment"): RedditComment | null {
  const id = normalizeNativeId(firstAttr($, node, ["thingid", "thing-id", "data-thing-id", "id", "comment-id", "data-comment-id"]), "t1");
  if (!id) return null;
  const parentRaw = firstAttr($, node, ["parentid", "parent-id", "data-parent-id", "parent-thing-id"]);
  const parentId = normalizeNativeId(parentRaw, "t1") ?? normalizeNativeId(parentRaw, "t3");
  const permalink = firstAttr($, node, ["permalink", "comment-permalink", "canonical-url", "data-permalink"]);
  const bodyHtml = firstAttr($, node, ["comment-body", "body", "body-html", "data-body"])
    ?? firstHtml($, node, ["[id$='-comment-rtjson-content']", "[id$='-rtjson-content']", "[slot='comment']", "[slot='comment-body']", "[slot='body']", ".md", "[data-testid='comment']"]);
  const body = htmlToText(bodyHtml);
  const author = firstAttr($, node, ["author", "author-name", "data-author"]);
  const flags = flagsFrom($, node);
  if (author === "[deleted]") flags.is_deleted = true;
  if (body === "[removed]") flags.is_removed = true;
  if (body === "[deleted]") flags.is_deleted = true;
  return {
    id,
    url: canonicalRedditUrl(permalink, commentPath(postId, id)),
    post_id: postId,
    parent_id: parentId,
    depth: Math.max(0, parseNullableInteger(firstAttr($, node, ["depth", "comment-depth", "data-depth"])) ?? 0),
    body,
    timestamp: normalizeTimestamp(firstAttr($, node, ["created-timestamp", "created", "timestamp", "data-created", "data-timestamp"])),
    author: author && !["[deleted]", "[removed]"].includes(author) ? author.replace(/^\/?u\//, "") : null,
    score: parseNullableInteger(firstAttr($, node, ["score", "comment-score", "data-score"])),
    flags,
    collection_surface: surface,
  };
}

function continuationBody($: CheerioAPI, node: AnyNode): string | null {
  const explicit = firstAttr($, node, ["body", "data-body", "request-body", "data-request-body", "data-form-data", "data-payload"]);
  if (explicit) return explicit.slice(0, 16_384);
  const params = new URLSearchParams();
  const aliases: Array<[string, string[]]> = [
    ["children", ["children", "child-ids", "childids", "data-children", "data-child-ids"]],
    ["postId", ["post-id", "postid", "data-post-id", "data-postid"]],
    ["parentId", ["parent-id", "parentid", "data-parent-id"]],
    ["depth", ["depth", "data-depth"]],
    ["sort", ["sort", "data-sort"]],
    ["limit", ["limit", "data-limit"]],
  ];
  for (const [key, names] of aliases) {
    const value = firstAttr($, node, names);
    if (value) params.set(key, value);
  }
  $(node).find("input[name]").each((_index, input) => {
    const name = $(input).attr("name")?.trim();
    const value = $(input).attr("value")?.trim();
    if (name && value && name.length <= 80 && value.length <= 4_096) params.set(name, value);
  });
  const body = params.toString();
  return body || null;
}

function continuationDescriptors($: CheerioAPI, root: AnyNode): ContinuationDescriptor[] {
  const descriptors: ContinuationDescriptor[] = [];
  $(root).find("faceplate-partial").each((index, element) => {
    const source = firstAttr($, element, ["src", "data-src", "endpoint", "data-endpoint", "action"]);
    if (!source) return;
    let route: string;
    try {
      route = validateRelativeRoute(source, "comments");
    } catch {
      return;
    }
    const methodRaw = firstAttr($, element, ["method", "data-method"])?.toUpperCase();
    const method: "GET" | "POST" = methodRaw === "POST" ? "POST" : "GET";
    const nearest = $(element).closest("shreddit-comment").first();
    const parentNode = nearest.length ? nearest.get(0) : undefined;
    const parentId = parentNode
      ? normalizeNativeId(firstAttr($, parentNode, ["thingid", "thing-id", "data-thing-id", "id", "comment-id"]), "t1")
      : null;
    const depth = parentNode
      ? (parseNullableInteger(firstAttr($, parentNode, ["depth", "comment-depth", "data-depth"])) ?? 0) + 1
      : 0;
    descriptors.push({ method, route, body: method === "POST" ? continuationBody($, element) : null, parent_id: parentId, depth, order: index });
  });
  return descriptors;
}

export function parseRssFeed(xml: string): ParsedRssFeed {
  const document = load(xml, { xmlMode: true });
  const entries = document("entry");
  if (!entries.length) throw new ParseChangedError("Reddit RSS returned markup without Atom entries.");
  const posts: RedditPost[] = [];
  entries.each((_index, node) => {
    const idRaw = document(node).find("id").first().text().trim();
    const idFromUrl = idRaw.match(/\/comments\/([a-z0-9]+)/i)?.[1];
    const id = normalizeNativeId(idRaw, "t3") ?? normalizeNativeId(idFromUrl, "t3");
    if (!id) return;
    const link = document(node).find('link[rel="alternate"]').first().attr("href") ?? document(node).find("link").first().attr("href");
    const discussionUrl = canonicalRedditUrl(link, postPath(id));
    const contentElement = document(node).find("content").first();
    const summaryElement = document(node).find("summary").first();
    const contentHtml = contentElement.text() || contentElement.html() || summaryElement.text() || summaryElement.html() || "";
    const author = document(node).find("author name").first().text().trim().replace(/^\/?u\//, "");
    const externalUrl = externalHref(contentHtml, discussionUrl);
    posts.push({
      id,
      url: discussionUrl,
      title: document(node).find("title").first().text().trim(),
      body: htmlToText(contentHtml),
      external_url: externalUrl,
      timestamp: normalizeTimestamp(document(node).find("published").first().text().trim() || document(node).find("updated").first().text().trim()),
      author: author || null,
      subreddit: normalizeSubreddit(document(node).find("category").first().attr("term")) ?? subredditFromPath(discussionUrl),
      post_type: externalUrl ? "link" : "self",
      score: null,
      comment_count: null,
      upvote_ratio: null,
      flags: emptyFlags(),
      collection_surface: "rss-search",
    });
  });
  if (!posts.length) throw new ParseChangedError("Reddit RSS contained entries but no native post IDs.");
  return { posts };
}

export function parseOldRedditRootHtml(html: string): RedditPost {
  const document = load(html);
  const candidates = document("div.thing.link[data-fullname^='t3_'], div.thing[data-fullname^='t3_'], [data-fullname^='t3_']");
  for (const node of candidates.toArray()) {
    const post = postFromOldReddit(document, node);
    if (post) return post;
  }
  throw new ParseChangedError("old.reddit.com returned markup without a root post record.");
}

export function parseListingHtml(html: string): ParsedListing {
  const document = load(html);
  const postNodes = document("shreddit-post");
  if (!postNodes.length) throw new ParseChangedError("Reddit listing returned markup without shreddit-post records.");
  const posts = postNodes.map((_index, node) => postFromShreddit(document, node, "shreddit-listing")).get()
    .filter((post): post is RedditPost => Boolean(post));
  if (!posts.length) throw new ParseChangedError("Reddit listing contained shreddit-post markup without native IDs.");
  let nextRoute: string | null = null;
  document('faceplate-partial[slot="load-after"]').each((_index, node) => {
    if (nextRoute) return;
    const source = firstAttr(document, node, ["src", "data-src", "endpoint", "data-endpoint"]);
    if (!source) return;
    try {
      nextRoute = validateRelativeRoute(source, "listing");
    } catch {
      nextRoute = null;
    }
  });
  return { posts, next_route: nextRoute };
}

function parseThreadDocument(html: string, surface: "shreddit-thread" | "shreddit-comment-fragment", fallbackPostId?: string): ParsedThread {
  const document = load(html);
  const postNode = document("shreddit-post").first().get(0);
  const post = postNode ? postFromShreddit(document, postNode, "shreddit-post") : null;
  const root = document.root().get(0);
  const postId = post?.id
    ?? (root ? normalizeNativeId(firstAttr(document, root, ["post-id", "postid", "data-post-id", "thingid"]), "t3") : null)
    ?? fallbackPostId;
  const comments = postId
    ? document("shreddit-comment").map((_index, node) => commentFromShreddit(document, node, postId, surface)).get()
      .filter((comment): comment is RedditComment => Boolean(comment))
    : [];
  const continuations = root ? continuationDescriptors(document, root) : [];
  const hasCommentTree = document("shreddit-comment-tree, shreddit-comment-tree-stats").length > 0;
  if (!post && !comments.length && !continuations.length && !hasCommentTree) {
    throw new ParseChangedError("Reddit thread returned markup without a post, comments, or continuations.");
  }
  const treeNode = document("shreddit-comment-tree").first().get(0)
    ?? document("shreddit-comment-tree-stats").first().get(0);
  const totalComments = post?.comment_count
    ?? (treeNode ? parseNullableInteger(firstAttr(document, treeNode, ["totalcomments", "total-comments", "comment-count"])) : null);
  return { post, comments, continuations, total_comments: totalComments };
}

export function parseThreadHtml(html: string, postId?: string): ParsedThread {
  return parseThreadDocument(html, "shreddit-thread", postId);
}

export function parseCommentFragmentHtml(html: string, postId: string): ParsedThread {
  const parsed = parseThreadDocument(html, "shreddit-comment-fragment", postId);
  return { ...parsed, post: parsed.post, comments: parsed.comments.map((comment) => ({ ...comment, post_id: postId })) };
}
