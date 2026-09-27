# Use Muse and Claude in the desktop Codex model picker

This Mac setup runs CLIProxyAPI on `127.0.0.1:8317`. It routes Muse Spark through
OpenRouter and reads the current Claude Code access token from this Mac's Keychain.
Codex uses one model provider per chat. Dots keeps native OpenAI as the default
for GPT models and Fast mode; switch to CLIProxyAPI before starting a Claude or
Muse chat.

## Set up another Mac

1. Install and sign in to Codex and Claude Code. Install Homebrew and `uv`.
2. Clone or pull dots into `~/Code/dots` as described in [INSTALL.md](../../INSTALL.md).
3. Run `python3 scripts/setup-cliproxy.py` from the repo. The script uses the
   OpenRouter key already stored for `codex -p muse`, or prompts for one and
   stores it in Keychain. It installs CLIProxyAPI, writes a local private proxy
   config, copies Claude Code's current access token, starts the service and
   token-sync job, and applies the tracked Codex config.
4. Choose the provider for the next chat, then restart the desktop app if it
   still shows the previous provider's models:

   ```sh
   uv run --script scripts/select-codex-provider.py proxy
   # or: uv run --script scripts/select-codex-provider.py openai --fast
   ```

   Proxy mode lists Muse Spark, Claude Opus 5.5, and Claude Sonnet 4.6. Native
   OpenAI mode lists GPT models. Start a **new local Codex chat** after switching;
   existing chats retain the provider they started with.

The desktop model picker cannot route a GPT selection to native OpenAI while
CLIProxyAPI is selected. Doing so produces `unknown provider for model
gpt-6-astra`. Fast mode is a [ChatGPT credit feature for supported GPT
models](https://learn.chatgpt.com/docs/agent-configuration/speed); the `--fast`
switch enables it for native OpenAI and uses more credits. CLIProxyAPI's
Responses endpoint may echo `service_tier: fast`, but that does not establish
faster Claude or Muse processing, so the proxy catalog does not advertise Fast.

The OpenRouter key, CLIProxyAPI client key, and Claude access token stay on each
Mac. The repo contains no credentials. The proxy binds only to loopback. The
Claude sync job checks Keychain every five minutes but cannot refresh Claude
Code's token itself. Run Claude Code when its token expires. The sync file never
copies Claude Code's refresh token.

Anthropic [describes subscription access as intended for its native apps and
recommends API keys for third-party tools](https://support.claude.com/en/articles/13189465-log-in-to-your-claude-account).
This Claude OAuth route is technically functional but may be unsupported or
charged to usage credits. Use a Claude Console API key for a supported
third-party arrangement.

## Check or repair

```sh
brew services list
scripts/sync-configs.sh --status --codex
python3 scripts/cliproxy-sync-claude-token.py
```

The first command should show `cliproxyapi` started. The Codex config reports
current while native OpenAI is selected; proxy mode intentionally differs from
the tracked default. If the token sync reports an expired token, open
Claude Code and let it refresh, then rerun the sync command. If the desktop app
still displays the ChatGPT-account error in a new Claude/Muse chat, restart it
and check that `~/.codex/config.toml` has `model_provider = "cliproxyapi"`.
