# Use Muse and Claude in the desktop Codex model picker

This Mac setup runs CLIProxyAPI on `127.0.0.1:8317`. It routes Muse Spark through
OpenRouter and reads the current Claude Code access token from this Mac's Keychain.
The tracked Codex config makes CLIProxyAPI the default provider and Claude Opus
5.5 the default model; Muse Spark, Claude Opus 5.5, and Claude Sonnet 4.6
appear in the picker.

## Set up another Mac

1. Install and sign in to Codex and Claude Code. Install Homebrew and `uv`.
2. Clone or pull dots into `~/Code/dots` as described in [INSTALL.md](../../INSTALL.md).
3. Run `python3 scripts/setup-cliproxy.py` from the repo. The script uses the
   OpenRouter key already stored for `codex -p muse`, or prompts for one and
   stores it in Keychain. It installs CLIProxyAPI, writes a local private proxy
   config, copies Claude Code's current access token, starts the service and
   token-sync job, and applies the tracked Codex config.
4. Restart the ChatGPT desktop app, then start a **new local Codex chat** and
   select Claude Opus 5.5 or Muse Spark. Existing chats retain the model provider
   they started with; switching their model alone can produce “model is not
   supported when using Codex with a ChatGPT account.”

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

The first command should show `cliproxyapi` started; the second should report
the Codex config current. If the token sync reports an expired token, open
Claude Code and let it refresh, then rerun the sync command. If the desktop app
still displays the ChatGPT-account error in a new chat, restart it and check
that `~/.codex/config.toml` has `model_provider = "cliproxyapi"`.
