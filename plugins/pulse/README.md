# Pulse

![Pulse icon](assets/icon.svg)

Pulse is a read-only Agent Plugin for current social signal from X and Reddit.
Installing `pulse@dots` starts both bundled MCP capabilities and provides one
`pulse` skill that routes work between them.

## X tools

Pulse packages the complete upstream `x-search` plugin at commit
`ff3620be60686feba2ac851962352217bbc91105` without modifying its files. Its
read-only X API v2 tools include post search and lookup, users, timelines,
mentions, threads, quote posts, Spaces, and API usage. Set `X_BEARER_TOKEN` in
the environment used to launch the plugin; the bundled upstream
[README](server/x-search/README.md) documents accepted fallback variable names
and X API access requirements.

## Reddit tools

| Tool | Purpose |
| --- | --- |
| `reddit_search_posts` | Discover thin post records from RSS feeds |
| `reddit_get_posts` | Hydrate selected root posts through old.reddit.com |
| `reddit_get_subreddit_posts` | Read a Shreddit subreddit listing with continuation |
| `reddit_get_thread` | Read a Shreddit thread and bounded comment continuations |

The server uses public RSS, old.reddit.com root-post pages, and Shreddit HTML.
It preserves native IDs and links, parses live `thingId` and body attributes,
supports GET and POST comment continuations, and returns structured partialness
when budgets, limits, rate limits, or markup changes constrain coverage.

Pulse does not include credentials, posting, voting, moderation, private Reddit
data, or the legacy embedded collector. Its X and Reddit servers are separate
processes inside the same installed plugin.

Bundled dependency licenses are recorded in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
