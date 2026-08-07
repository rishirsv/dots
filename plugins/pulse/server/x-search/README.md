# x-search

Search and read public X (Twitter) content from your agent. This plugin packages a read-only MCP server for the X API v2, plus a skill that teaches the agent when and how to use each tool. It follows the [Agent Plugins Specification v1.0.0](https://github.com/agentplugins/agent-plugins-spec).

Read-only means exactly that: the server can search and fetch, but it cannot post, like, repost, follow, or send DMs.

## Tools

| Tool | What it does |
| --- | --- |
| `search_posts` | Search recent posts (last 7 days) with full X query operators |
| `get_posts` | Fetch one or more posts by URL or ID |
| `get_user` / `get_users` | Look up profiles, bios, and follower counts |
| `get_user_posts` | Latest posts from an account |
| `get_user_mentions` | Posts that mention an account |
| `get_thread` | The full reply thread for a post |
| `get_quote_posts` | Quote posts of a post |
| `search_spaces` | Live or scheduled Spaces |
| `get_api_usage` | Remaining project quota |

## Prerequisites

1. **Node.js 20 or newer.** The MCP server runs with `node`; the client resolves it from your platform's executable search path.
2. **An X API bearer token.** See [Authentication](#authentication) below.

## Authentication

The plugin authenticates to the X API with an app-only **bearer token**:

1. Open the [X Developer Portal](https://developer.x.com/en/portal/dashboard) and sign in.
2. Create or select a Project and App.
3. In the app's **Keys and tokens** tab, copy (or generate) the **Bearer Token**.

The free tier works for basic reads; `search_posts` requires the Basic tier or higher. The token grants read-only, app-level access - it is not tied to your personal account and cannot post on your behalf.

The MCP server reads the token from its environment at startup. It checks `X_BEARER_TOKEN` first, then falls back to `BEARER_TOKEN`, `TWITTER_BEARER_TOKEN`, and `X_API_BEARER_TOKEN`. Agent Plugins v1 defines no portable secret mechanism and forbids embedding credentials in `mcp.json`, so how you supply the variable depends on your client:

- **Client secret or environment configuration (preferred).** If your client lets you set environment variables for a plugin's MCP servers, set `X_BEARER_TOKEN` there. The token stays out of files.
- **Ambient environment.** Export the variable in the environment your client launches from:

  ```sh
  export X_BEARER_TOKEN="your-token-here"
  ```

  Add it to your shell profile (`~/.zshrc`, `~/.bashrc`) to persist it. Clients are allowed to sanitize the subprocess environment, so confirm yours passes ambient variables through.

## Enable the plugin

These steps work in any client that supports Agent Plugins v1.

### 1. Install the plugin directory

Clone this repository, then copy the `plugins/x-search` directory to wherever your client loads plugins from (check its documentation). The directory containing `plugin.json` is the plugin root.

```sh
git clone https://github.com/mattppal/agent-plugins.git
cp -R agent-plugins/plugins/x-search <your-client-plugins-dir>/x-search
```

During development, a symlink works too and picks up changes without re-copying:

```sh
ln -s "$(pwd)/agent-plugins/plugins/x-search" <your-client-plugins-dir>/x-search
```

The server bundle is checked in at `server/dist/index.js`, so there is no install or build step. To rebuild from source:

```sh
cd plugins/x-search/server
npm ci
npm run build
```

### 2. Let the client load it

Once the client sees the plugin root, it reads `plugin.json`, loads the skill from `skills/x/SKILL.md`, and starts the MCP server declared in `mcp.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "x-search": {
      "type": "stdio",
      "command": "node",
      "args": ["${PLUGIN_ROOT}/server/dist/index.js"]
    }
  }
}
```

The client expands `${PLUGIN_ROOT}` to the plugin's absolute path, so the configuration works from any install location.

### 3. Provide your bearer token

Follow [Authentication](#authentication) to create a token and make `X_BEARER_TOKEN` available to the MCP server.

### 4. Verify it works

Ask your agent something like:

> Search X for recent posts about "agent plugins"

If the token is missing or invalid, every tool returns an error explaining what to set. You can also smoke-test the server directly from the plugin root:

```sh
X_BEARER_TOKEN="your-token-here" node server/dist/index.js
```

The process waits silently for MCP messages on stdin; exiting immediately with an error indicates a problem.

## Troubleshooting

- **"Missing X bearer token"**: the server started without `X_BEARER_TOKEN` in its environment. See [Authentication](#authentication).
- **401 Unauthorized**: the token is invalid or was regenerated. Copy a fresh Bearer Token from the Developer Portal.
- **403 Forbidden on search**: your API access tier does not include recent search. Upgrade the project in the Developer Portal.
- **429 Too Many Requests**: you hit a rate limit. Error responses include the reset time; `get_api_usage` shows remaining quota.

## Layout

```text
plugins/x-search/
├── plugin.json        # Agent Plugins manifest
├── mcp.json           # MCP server configuration (stdio)
├── skills/
│   └── x/
│       └── SKILL.md   # Usage guidance for the agent
├── server/
│   ├── dist/index.js  # Bundled server (checked in, ready to run)
│   └── src/           # TypeScript source
├── LICENSE
└── README.md
```

## License

MIT
