import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { mcpError, makeEnvelope, mcpResult } from "./result.ts";
import { errorFor, PulseOperationError, RedditClient, type RedditClientOptions } from "./reddit/client.ts";
import type { ClientResult, PulseEnvelope } from "./reddit/types.ts";

export const PULSE_VERSION = "1.0.0";

export function createPulseServer(options: RedditClientOptions = {}): McpServer {
  const client = new RedditClient(options);
  const server = new McpServer({ name: "pulse", version: PULSE_VERSION });

  const handle = <Args, T>(fn: (args: Args) => Promise<ClientResult<T>>) => async (args: Args) => {
    try {
      const result = await fn(args);
      return mcpResult(makeEnvelope(result.data, result.meta, result.errors));
    } catch (error) {
      const pulseError = errorFor(error, error instanceof PulseOperationError ? error.pulseError.surface ?? "pulse" : "pulse");
      const envelope: PulseEnvelope<unknown> = makeEnvelope(
        [],
        { next_token: null, pagination_scope: "none", partial: true, cache: "miss", upstream_requests: 0 },
        [pulseError]
      );
      return mcpError(envelope);
    }
  };

  server.tool(
    "reddit_search_posts",
    "Discover public Reddit posts through global and selected subreddit RSS feeds. Results are thin discovery records and intentionally partial.",
    {
      query: z.string().trim().min(1),
      subreddits: z.array(z.string().trim().min(2)).max(3).optional(),
      sort: z.enum(["relevance", "new", "top", "comments"]).optional(),
      time_filter: z.enum(["hour", "day", "week", "month", "year", "all"]).optional(),
      max_results: z.number().int().min(1).max(100).optional(),
    },
    handle((args) => client.searchPosts(args))
  );

  server.tool(
    "reddit_get_posts",
    "Hydrate selected public Reddit root posts by native ID or thread URL through old.reddit.com.",
    {
      ids: z.array(z.string().trim().min(1)).min(1).max(25),
    },
    handle((args) => client.getPosts(args.ids))
  );

  server.tool(
    "reddit_get_subreddit_posts",
    "Read a bounded subreddit listing from the public Shreddit community-more-posts surface.",
    {
      subreddit: z.string().trim().min(2),
      sort: z.enum(["hot", "new", "top"]).optional(),
      time_filter: z.enum(["hour", "day", "week", "month", "year", "all"]).optional(),
      max_results: z.number().int().min(1).max(100).optional(),
      next_token: z.string().optional(),
    },
    handle((args) => client.getSubredditPosts(args))
  );

  server.tool(
    "reddit_get_thread",
    "Read a public Reddit thread and bounded GET or POST Shreddit comment continuations.",
    {
      id_or_url: z.string().trim().min(1),
      sort: z.enum(["top", "new", "controversial"]).optional(),
      max_comments: z.number().int().min(1).max(500).optional(),
      max_depth: z.number().int().min(0).max(20).optional(),
      expansion_requests: z.number().int().min(0).max(5).optional(),
      next_token: z.string().optional(),
    },
    handle((args) => client.getThread(args))
  );

  return server;
}

async function main(): Promise<void> {
  const server = createPulseServer();
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
