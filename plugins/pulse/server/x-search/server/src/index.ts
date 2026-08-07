import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { XApiError, XClient, resolveBearerToken } from "./client.ts";
import { formatPostList, formatUserList, sortPostsChronologically } from "./format.ts";
import { looksLikeUserId, parsePostId, parsePostIds, parseUsername } from "./parse.ts";
import { VERSION } from "./version.ts";

const server = new McpServer({
  name: "x-search",
  version: VERSION,
});

function getClient(): XClient {
  const bearerToken = resolveBearerToken();
  if (!bearerToken) {
    throw new Error(
      "Missing X bearer token. Set the X_BEARER_TOKEN environment variable for this MCP server. Create an app-only token at https://developer.x.com/en/portal/dashboard."
    );
  }
  return new XClient({ bearerToken });
}

/** Wraps a tool body: the resolved value becomes the JSON result, thrown errors become error results. */
function handle<Args>(fn: (args: Args) => Promise<unknown> | unknown) {
  return async (args: Args) => {
    try {
      return jsonResult(await fn(args));
    } catch (error) {
      return errorResult(error);
    }
  };
}

function jsonResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
  };
}

function errorResult(error: unknown) {
  if (error instanceof XApiError) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: error.message,
              status: error.status,
              title: error.title,
              detail: error.detail,
              rate_limit: error.rateLimit,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  const message = error instanceof Error ? error.message : String(error);
  return {
    isError: true,
    content: [{ type: "text" as const, text: JSON.stringify({ error: message }, null, 2) }],
  };
}

async function resolveUserId(client: XClient, usernameOrId: string): Promise<string> {
  if (looksLikeUserId(usernameOrId)) {
    return usernameOrId.trim();
  }
  const username = parseUsername(usernameOrId);
  const response = await client.getUserByUsername(username);
  const user = Array.isArray(response.data) ? response.data[0] : response.data;
  if (!user?.id) {
    throw new Error(`User @${username} was not found.`);
  }
  return user.id;
}

server.tool(
  "search_posts",
  "Search public posts from the last 7 days. Supports X query operators such as from:user, lang:en, is:reply, is:retweet, has:media, conversation_id:ID, url:example.com, and quoted phrases.",
  {
    query: z.string().min(1).describe("X recent-search query. Example: from:openai -is:retweet lang:en"),
    max_results: z.number().int().min(10).max(100).optional().describe("Number of posts to return (10-100). Defaults to 10."),
    next_token: z.string().optional().describe("Pagination token from a previous search_posts response."),
    sort_order: z.enum(["recency", "relevancy"]).optional().describe("recency (default) or relevancy"),
    start_time: z.string().optional().describe("ISO 8601 lower bound, e.g. 2026-08-01T00:00:00Z"),
    end_time: z.string().optional().describe("ISO 8601 upper bound"),
    since_id: z.string().optional().describe("Return posts newer than this post ID"),
    until_id: z.string().optional().describe("Return posts older than this post ID"),
  },
  handle(async (args) => formatPostList(await getClient().searchPosts(args)))
);

server.tool(
  "get_posts",
  "Look up one or more posts by ID or by x.com / twitter.com status URL.",
  {
    ids: z
      .array(z.string().min(1))
      .min(1)
      .max(100)
      .describe("Post IDs or status URLs, e.g. 1234567890 or https://x.com/user/status/1234567890"),
  },
  handle(async ({ ids }) => formatPostList(await getClient().getPosts(parsePostIds(ids))))
);

server.tool(
  "get_user",
  "Look up a single X user by username (with or without @) or numeric user ID.",
  {
    username_or_id: z.string().min(1).describe("Username such as openai or @openai, or a numeric user ID"),
  },
  handle(async ({ username_or_id }) => {
    const client = getClient();
    const result = looksLikeUserId(username_or_id)
      ? await client.getUsersByIds([username_or_id.trim()])
      : await client.getUserByUsername(parseUsername(username_or_id));
    return formatUserList(result);
  })
);

server.tool(
  "get_users",
  "Look up multiple X users by username or numeric user ID.",
  {
    usernames: z.array(z.string().min(1)).max(100).optional().describe("Usernames, with or without @"),
    ids: z.array(z.string().min(1)).max(100).optional().describe("Numeric user IDs"),
  },
  handle(async ({ usernames, ids }) => {
    if (!usernames?.length && !ids?.length) {
      throw new Error("Provide at least one username or user ID.");
    }
    const client = getClient();
    const results = await Promise.all([
      ...(usernames?.length ? [client.getUsersByUsernames(usernames.map(parseUsername))] : []),
      ...(ids?.length ? [client.getUsersByIds(ids)] : []),
    ]);
    const errors = results.flatMap((result) => result.errors ?? []);
    return {
      data: results.flatMap((result) => formatUserList(result).data),
      errors: errors.length ? errors : undefined,
    };
  })
);

server.tool(
  "get_user_posts",
  "Get recent posts authored by a user. Accepts a username or numeric user ID. This is not the authenticated home timeline.",
  {
    username_or_id: z.string().min(1).describe("Username or numeric user ID"),
    max_results: z.number().int().min(5).max(100).optional().describe("Number of posts to return (5-100). Defaults to 10."),
    next_token: z.string().optional().describe("Pagination token from a previous get_user_posts response."),
    exclude_replies: z.boolean().optional().describe("If true, omit replies"),
    exclude_reposts: z.boolean().optional().describe("If true, omit reposts"),
    start_time: z.string().optional().describe("ISO 8601 lower bound"),
    end_time: z.string().optional().describe("ISO 8601 upper bound"),
    since_id: z.string().optional(),
    until_id: z.string().optional(),
  },
  handle(async ({ username_or_id, exclude_replies, exclude_reposts, ...params }) => {
    const client = getClient();
    const userId = await resolveUserId(client, username_or_id);
    const exclude: Array<"replies" | "retweets"> = [
      ...(exclude_replies ? (["replies"] as const) : []),
      ...(exclude_reposts ? (["retweets"] as const) : []),
    ];
    return formatPostList(
      await client.getUserPosts(userId, { ...params, exclude: exclude.length ? exclude : undefined })
    );
  })
);

server.tool(
  "get_user_mentions",
  "Get recent posts that mention a user. Accepts a username or numeric user ID.",
  {
    username_or_id: z.string().min(1).describe("Username or numeric user ID"),
    max_results: z.number().int().min(5).max(100).optional(),
    next_token: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    since_id: z.string().optional(),
    until_id: z.string().optional(),
  },
  handle(async ({ username_or_id, ...params }) => {
    const client = getClient();
    const userId = await resolveUserId(client, username_or_id);
    return formatPostList(await client.getUserMentions(userId, params));
  })
);

server.tool(
  "get_thread",
  "Fetch a reply thread for a post ID or status URL. Resolves conversation_id, then searches recent posts in that thread.",
  {
    id_or_url: z.string().min(1).describe("Post ID or x.com / twitter.com status URL"),
    max_results: z.number().int().min(10).max(100).optional().describe("Max thread posts to return (10-100). Defaults to 50."),
  },
  handle(async ({ id_or_url, max_results }) => {
    const client = getClient();
    const postId = parsePostId(id_or_url);
    const lookup = await client.getPosts([postId]);
    const root = Array.isArray(lookup.data) ? lookup.data[0] : lookup.data;
    if (!root) {
      throw new Error(`Post ${postId} was not found or is not available on your API plan.`);
    }
    const conversationId = root.conversation_id ?? postId;
    const search = await client.searchPosts({
      query: `conversation_id:${conversationId}`,
      max_results: max_results ?? 50,
      sort_order: "recency",
    });
    const formatted = formatPostList(search);
    formatted.data = sortPostsChronologically(formatted.data);
    return {
      conversation_id: conversationId,
      root_post_id: postId,
      ...formatted,
    };
  })
);

server.tool(
  "get_quote_posts",
  "List recent quote posts of a given post.",
  {
    id_or_url: z.string().min(1).describe("Original post ID or status URL"),
    max_results: z.number().int().min(10).max(100).optional(),
    next_token: z.string().optional(),
  },
  handle(async ({ id_or_url, ...params }) =>
    formatPostList(await getClient().getQuotePosts(parsePostId(id_or_url), params))
  )
);

server.tool(
  "search_spaces",
  "Search X Spaces by keyword. Filter by live, scheduled, or all. Availability depends on the X API plan.",
  {
    query: z.string().min(1).describe("Keyword query for Spaces"),
    state: z.enum(["live", "scheduled", "all"]).optional().describe("Filter by Space state. Defaults to all live+scheduled depending on API defaults."),
    max_results: z.number().int().min(1).max(100).optional(),
  },
  handle((args) => getClient().searchSpaces(args))
);

server.tool(
  "get_api_usage",
  "Show recent project usage for post reads. Check this before broad searches if monthly quota is a concern.",
  handle(() => getClient().getUsage())
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
