# INSTALL.md

Copy the prompt below into Claude on the target Mac.

---

You are helping me fully reset and reinstall OpenAI Codex on this Mac using my `agent` repo as reference material.

Goal: delete the existing Codex app, Codex CLI, Codex configs, Codex caches, Codex plugins, and Codex skills; reinstall the Codex CLI fresh; clone my `agent` repo; install its Codex config; and run the Agent plugin sync.

Repo:

    https://github.com/rishirsv/agent.git

Important behavior:

- You are allowed to delete existing Codex app/config/cache/plugin/skill files.
- Do not delete unrelated OpenAI API keys, shell profiles, project repos, or non-Codex application data.
- Do not edit secrets into any repo file.
- Use macOS commands.
- Prefer explicit commands and explain what each destructive command will remove before running it.
- If a path does not exist, continue.

## Steps

1. Inspect current Codex state.

Run:

    which codex || true
    codex --version || true
    ls -la ~/.codex 2>/dev/null || true
    ls -la ~/.codex/plugins 2>/dev/null || true
    ls -la ~/.codex/skills 2>/dev/null || true
    ls -ld /Applications/Codex.app 2>/dev/null || true

2. Remove Codex app, CLI, and all Codex home data.

Remove only Codex-specific paths:

    rm -rf ~/.codex
    rm -rf /Applications/Codex.app
    rm -f /opt/homebrew/bin/codex
    rm -f /usr/local/bin/codex
    rm -rf /opt/homebrew/lib/node_modules/@openai/codex
    rm -rf /usr/local/lib/node_modules/@openai/codex

If `which codex` showed another path, inspect it first. Remove it only if it is clearly the Codex CLI.

3. Install Codex CLI fresh.

Use the current official install path. If Homebrew has a current Codex package, prefer it. Otherwise use npm:

    npm install -g @openai/codex

Then verify:

    which codex
    codex --version

4. Clone or update `agent`.

Use:

    mkdir -p ~/Code
    if [ -d ~/Code/agent/.git ]; then
      cd ~/Code/agent
      git pull --ff-only
    else
      git clone https://github.com/rishirsv/agent.git ~/Code/agent
      cd ~/Code/agent
    fi

5. Install the repo Codex config into the machine config.

Create `~/.codex` and copy the repo config:

    mkdir -p ~/.codex
    cp ~/Code/agent/.codex/config.toml ~/.codex/config.toml

Then inspect it:

    sed -n '1,220p' ~/.codex/config.toml

Expected important settings:

    approval_policy = "never"
    sandbox_mode = "danger-full-access"
    web_search = "live"

6. Sync and install the Agent plugins.

Run:

    cd ~/Code/agent
    scripts/sync-plugins.sh

This rebuilds the Codex and Claude plugin folders from `agent/` and `meta-skill/`, registers the public Agent marketplace from GitHub, installs `agent@agent`, refreshes local plugin caches, copies repo `global_instructions.md` to `~/.codex/AGENTS.md`, and symlinks `~/.claude/CLAUDE.md` to repo `global_instructions.md`.

7. Open Codex once so it initializes plugin/cache state.

Run:

    cd ~/Code/agent
    codex --help

If Codex requires login, run:

    codex login

Then restart Codex after login.

8. Verify the Agent repo state.

Check:

    test -f ~/Code/agent/README.md
    test -f ~/Code/agent/.codex/config.toml
    test -d ~/Code/agent/agent/skills
    test -d ~/Code/agent/plugins/codex/agent/skills
    test -d ~/Code/agent/plugins/claude/agent/skills
    test -f ~/Code/agent/.agents/plugins/marketplace.json
    test -f ~/Code/agent/.claude-plugin/marketplace.json
    test -f ~/.codex/AGENTS.md
    test -L ~/.claude/CLAUDE.md

9. Verify Codex config no longer enables the OpenAI-curated GitHub plugin.

Run:

    rg -n 'github@openai-curated|agent@agent|marketplaces.agent' ~/.codex/config.toml || true

Expected:

    [plugins."github@openai-curated"]
    enabled = false

Expected: `agent@agent` is enabled after `scripts/sync-plugins.sh`. If the GitHub plugin block is missing, that is acceptable. Do not enable it unless intentionally needed.

10. Final report.

Report:

- Codex CLI path and version.
- Whether `~/.codex/config.toml` was installed.
- Whether `agent` was cloned or updated.
- Confirm that the `agent` marketplace is registered.
- Confirm that `agent@agent` is enabled.
- Any login or restart still required.
