# Use Muse and Claude in the desktop Codex model picker

This Mac setup runs a local image guard on `127.0.0.1:8317` in front of
CLIProxyAPI on `127.0.0.1:8318`. It routes GPT through your
ChatGPT Codex sign-in, Muse through OpenRouter, and Claude through the current
Claude Code access token in this Mac's Keychain. One CLIProxyAPI provider and one
model catalog put the available GPT, Claude, and Muse models in the desktop
picker. The desktop Fast control is absent in this custom-provider picker.

## Set up another Mac

1. Install and sign in to Codex and Claude Code. Install Homebrew and `uv`.
2. Clone or pull dots into `~/Code/dots` as described in [INSTALL.md](../../INSTALL.md).
3. Run `python3 scripts/setup-cliproxy.py` from the repo. The script uses the
   OpenRouter key already stored for `codex -p muse`, or prompts for one and
   stores it in Keychain. It installs CLIProxyAPI, writes a local private proxy
   config, copies Claude Code's current access token, starts the service and
   token-sync job and image guard, and asks you to complete a ChatGPT Codex device sign-in for
   CLIProxyAPI if it has not signed in already. Its OAuth record stays on this
   Mac.
4. Restart the desktop app, start a **new local Codex chat**, and choose a
   model in the picker. Existing chats retain the provider they started with.

The picker lists the current seven GPT, six Muse, and twelve working Claude models
from the tracked catalog. Five older Claude IDs still appear in CLIProxyAPI's
discovery response but return 404 from Claude, so the picker omits them. When a provider adds or retires models, update that
catalog and the Muse routes in `scripts/setup-cliproxy.py` together. The model
catalog marks eligible GPT models as Fast-capable, but the desktop app does not
show its Fast control for this custom CLIProxyAPI provider. The proxy's upstream
ChatGPT login does not change the desktop provider from CLIProxyAPI to native
OpenAI. [Codex Fast mode](https://learn.chatgpt.com/docs/agent-configuration/speed)
is a ChatGPT credit feature; CLIProxyAPI also accepts a priority tier for GPT,
but a successful response does not prove it received faster processing. To use
the documented native ChatGPT Fast control, run
`uv run --script scripts/select-codex-provider.py openai --fast` and start a new
chat. Run `uv run --script scripts/select-codex-provider.py proxy` to restore
the combined GPT, Claude, and Muse picker for new chats.

The OpenRouter key, CLIProxyAPI client key, Claude access token, and ChatGPT
OAuth record stay on each Mac. The repo contains no credentials. The proxy binds only to loopback. The
Claude sync job checks Keychain every five minutes but cannot refresh Claude
Code's token itself. Run Claude Code when its token expires. The sync file never
copies Claude Code's refresh token.

The image guard caps base64 images in Claude requests at 2,000 pixels per edge.
Anthropic applies this limit to every image in a request with more than 20 images,
including images from earlier turns. This allows an existing image-heavy Claude
chat to continue without changing its provider or deleting its history. The guard
passes GPT and Muse request bodies through unchanged.

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

The first command should show `cliproxyapi` started. The Codex config should
report current. If the token sync reports an expired token, open
Claude Code and let it refresh, then rerun the sync command. If the desktop app
still displays the ChatGPT-account error in a new Claude/Muse chat, restart it
and check that `~/.codex/config.toml` has `model_provider = "cliproxyapi"`.
