# Agent

Source repo for Rishi's personal Agent and Meta-Skill plugin builds, plus repo-managed local Codex and Claude agent instructions.

## Source Map

Day to day, edit these source surfaces:

- `agent/`: source for Agent plugin assets and skills.
- `meta-skill/`: source for the `meta-skill` plugin.
- `.codex/agents/`: source Codex custom agents for this machine.
- `AGENTS.md`: repo/workspace instructions for working in this checkout.
- `global_instructions.md`: global assistant instructions installed into Codex and Claude.
- `scripts/`: build, sync, and hook utilities.

Generated output lives here:

- `plugins/codex/`
- `plugins/claude/`
- `.agents/plugins/marketplace.json`
- `.claude-plugin/marketplace.json`

Local installed output lives under `~/.codex/` and `~/.claude/`.

## Structure

```text
agent/
├─ AGENTS.md
├─ README.md
├─ INSTALL.md
├─ global_instructions.md
├─ .agents/
│  └─ plugins/
│     └─ marketplace.json
├─ .claude-plugin/
│  └─ marketplace.json
├─ .codex/
│  ├─ config.toml
│  ├─ hooks.json
│  ├─ hooks/
│  │  └─ pre_commit_sync_local_agents.py
│  └─ agents/
│     └─ <agent>.toml
├─ agent/
│  ├─ assets/
│  │  ├─ icon.png
│  │  └─ logo.png
│  └─ skills/
│     └─ <skill-name>/
│        ├─ SKILL.md
│        └─ ...
├─ meta-skill/
│  ├─ references/
│  ├─ skills/
│  │  └─ <skill-name>/
│  └─ src/
├─ plugins/
│  ├─ codex/
│  │  ├─ agent/
│  │  └─ meta-skill/
│  └─ claude/
│     ├─ agent/
│     └─ meta-skill/
└─ scripts/
   ├─ sync-local-agents.sh
   └─ sync-plugins.sh
```

- `agent/skills/`: Agent plugin skills, packaged into `plugins/{codex,claude}/agent/skills/`. This is intentionally narrow; today it contains `yeet`.
- `agent/assets/`: canonical Agent Codex plugin assets, packaged into `plugins/codex/agent/assets/`.
- `meta-skill/`: standalone Meta-Skill plugin source. The sync script packages `skills/`, `references/`, and `src/` into `plugins/{codex,claude}/meta-skill/`.
- `.codex/agents/`: canonical local Codex agent definitions. `scripts/sync-local-agents.sh` copies these to `~/.codex/agents/` and generates Claude agent Markdown under `~/.claude/agents/`.
- `.codex/hooks.json` and `.codex/hooks/`: project-local Codex hooks. The pre-commit sync hook runs before Codex executes relevant `git commit` commands.
- `global_instructions.md`: copied to `~/.codex/AGENTS.md` and symlinked from `~/.claude/CLAUDE.md`.
- `plugins/`: generated plugin packages. Do not hand-edit these files.

## Sync

After plugin source changes, run:

```sh
scripts/sync-plugins.sh
```

This rebuilds generated plugin packages, manifests, marketplace files, plugin installs, and local plugin caches. It also removes any old managed direct Desktop skill copies under `~/.codex/skills/`. It calls `scripts/sync-local-agents.sh` so local instructions stay current.

After local instruction or agent changes, run:

```sh
scripts/sync-local-agents.sh
```

This updates:

- `~/.codex/AGENTS.md`
- `~/.claude/CLAUDE.md`
- `~/.codex/agents/`
- `~/.claude/agents/`

When Codex runs a `git commit` command, the project-local Codex hook checks whether the commit touches `global_instructions.md` or `.codex/agents/`. If it does, the hook runs `scripts/sync-local-agents.sh` before the commit proceeds. Review and trust the hook from Codex with `/hooks` after changing this repo's hooks.

## Repo Codex Config

This repo keeps its Codex config in `.codex/config.toml`.

User-specific secrets, auth, and machine-wide defaults should stay in `~/.codex/config.toml`.

Codex repo instructions stay in root `AGENTS.md`; they do not move into `.codex/`. Codex project subagents use `.codex/agents/*.toml`, not `.agents/`.
