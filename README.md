# Agent

Source repo for Rishi's personal agent skills and Codex/Claude plugin builds.

## Edit Surface

Day to day, only edit:

- `skills/`: active agent skills.
- `.codex/agents/`: source Codex custom agents; the sync script also converts these into Claude agents.
- `assets/agent/`: source plugin icon assets.
- `AGENTS.md`: compact system guidance shared by this repo, Codex, and Claude.

Then run:

```sh
scripts/sync-plugins.sh
```

Everything else exists to package, install, sync, or stage those two surfaces.

## Structure

This repo keeps editable sources separate from host-specific plugin packages.
Do not collapse the generated packages into a single `plugins/<plugin-name>/`
folder: Codex and Claude use different plugin manifests, marketplace shapes, and
agent formats.

```text
agent/
├─ AGENTS.md
├─ README.md
├─ INSTALL.md
├─ .agents/
│  └─ plugins/
│     └─ marketplace.json
│
├─ .claude-plugin/
│  └─ marketplace.json
│
├─ .codex/
│  ├─ config.toml
│  └─ agents/
│     └─ <agent>.toml
│
├─ assets/
│  └─ agent/
│     ├─ icon.png
│     └─ logo.png
│
├─ skills/
│  └─ <skill-name>/
│     ├─ SKILL.md
│     └─ ...
│
├─ plugins/
│  ├─ codex/
│  │  └─ agent/
│  │     ├─ .codex-plugin/
│  │     │  └─ plugin.json
│  │     ├─ skills/
│  │     ├─ agents/
│  │     └─ assets/
│  │
│  ├─ claude/
│  │  └─ agent/
│  │     ├─ .claude-plugin/
│  │     │  └─ plugin.json
│  │     ├─ skills/
│  │     └─ agents/
│  │
│  └─ meta-skill/
│     ├─ .codex-plugin/
│     │  └─ plugin.json
│     ├─ skills/
│     ├─ assets/
│     └─ ...
│
└─ scripts/
   └─ sync-plugins.sh
```

- `skills/`: canonical agent skills. This is the source folder to edit.
- `.codex/agents/`: canonical Codex custom agent definitions. The sync script converts these into Claude agent files.
- `assets/agent/`: canonical plugin icon assets copied into the Codex package.
- `plugins/codex/agent/`: generated Codex plugin package with `.codex-plugin/plugin.json`.
- `plugins/claude/agent/`: generated Claude plugin package with `.claude-plugin/plugin.json`.
- `plugins/meta-skill/`: separate Codex plugin package for Meta Skill.
- `.agents/plugins/marketplace.json`: Codex marketplace index.
- `.claude-plugin/marketplace.json`: Claude marketplace index.
- `AGENTS.md`: compact system guidance shared by this repo, Codex, and Claude.
- `.codex/config.toml`: repo-local Codex config for working in this repo.
- `scripts/sync-plugins.sh`: rebuilds plugin folders from `skills/`, validates manifests, registers/install plugins, and refreshes local caches.

## Sync

After any change under `skills/`, `.codex/agents/`, `assets/agent/`, or `AGENTS.md`, run:

```sh
scripts/sync-plugins.sh
```

The script updates:

- `plugins/codex/agent/skills/`
- `plugins/claude/agent/skills/`
- `plugins/codex/agent/agents/`
- `plugins/claude/agent/agents/`
- Codex marketplace/install state
- Claude marketplace/install state
- `~/.codex/AGENTS.md` by copying repo `AGENTS.md`
- `~/.codex/agents/` with repo-managed Codex agents
- `~/.claude/CLAUDE.md` by symlinking to repo `AGENTS.md`
- `~/.claude/agents/` with generated Claude agents
- Local plugin caches under `~/.codex/plugins/cache/agent/agent/0.1.0` and `~/.claude/plugins/cache/agent/agent/0.1.0`

## Repo Codex Config

This repo keeps its Codex config in `.codex/config.toml`.

User-specific secrets, auth, and machine-wide defaults should stay in `~/.codex/config.toml`.

Codex instructions stay in root `AGENTS.md`; they do not move into `.codex/`. Codex project subagents use `.codex/agents/*.toml`, not `.agents/`.

Claude project subagents use `.claude/agents/*.md`. Claude plugin subagents should live under `agents/` at the plugin root.
