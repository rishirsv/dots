# Agent

Source repo for Rishi's personal Desktop skills and Codex/Claude plugin builds.

## Edit Surface

Day to day, only edit:

- `skills/`: active agent skills (source for the `agent` plugin).
- `meta-skill/`: source for the standalone `meta-skill` plugin — `docs/` and `skills/`.
- `.codex/agents/`: source Codex custom agents; the sync script also converts these into Claude agents.
- `plugins/codex/agent/assets/`: editable Codex plugin icon assets.
- `AGENTS.md`: compact system guidance shared by this repo, Codex, and Claude.

Then run:

```sh
scripts/sync-plugins.sh
```

Everything else exists to install, package, sync, or stage those surfaces.

## Structure

This repo keeps editable skills out of plugin packages. Skills install as
managed Codex Desktop skills under `~/.codex/skills/`; plugin packages only
carry host-specific agent and plugin metadata.
Do not collapse the generated packages into a single `plugins/<plugin-name>/`
folder: Codex and Claude use different plugin manifests, marketplace shapes, and
agent formats. Codex plugin assets are the exception: they live directly in the
Codex plugin package because the Codex manifest references them from that root.

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
├─ skills/
│  └─ <skill-name>/
│     ├─ SKILL.md
│     └─ ...
│
├─ meta-skill/
│  ├─ docs/
│  │  └─ ARCHITECTURE.md
│  └─ skills/
│     └─ <skill-name>/
│
├─ plugins/
│  ├─ codex/
│  │  ├─ agent/
│  │  │  ├─ .codex-plugin/
│  │  │  │  └─ plugin.json
│  │  │  ├─ agents/
│  │  │  └─ assets/
│  │  └─ meta-skill/
│  │     ├─ .codex-plugin/
│  │     │  └─ plugin.json
│  │     └─ skills/
│  │
│  ├─ claude/
│  │  ├─ agent/
│  │  │  ├─ .claude-plugin/
│  │  │  │  └─ plugin.json
│  │  │  └─ agents/
│  │  └─ meta-skill/
│  │     ├─ .claude-plugin/
│  │     │  └─ plugin.json
│  │     └─ skills/
│  │
└─ scripts/
   └─ sync-plugins.sh
```

- `skills/`: canonical Agent skills, packaged into the `agent` plugin.
- `meta-skill/`: source for the standalone `meta-skill` plugin (`docs/ARCHITECTURE.md` plus `skills/`, one directory per skill). The sync script packages it into `plugins/{codex,claude}/meta-skill/`. A plugin with no skills yet is scaffolded on disk but held out of the marketplaces until it gains its first skill.
- `.codex/agents/`: canonical Codex custom agent definitions. The sync script converts these into Claude agent files.
- `plugins/codex/agent/assets/`: editable Codex plugin icon assets.
- `plugins/codex/agent/`: Codex plugin package with `.codex-plugin/plugin.json`; `agents/` is refreshed from `.codex/agents/`.
- `plugins/claude/agent/`: generated Claude plugin package with `.claude-plugin/plugin.json`.
- `plugins/{codex,claude}/meta-skill/`: generated `meta-skill` plugin packages (skills only; no subagents).
- `.agents/plugins/marketplace.json`: Codex marketplace index (lists every registered plugin).
- `.claude-plugin/marketplace.json`: Claude marketplace index (lists every registered plugin).
- `AGENTS.md`: compact system guidance shared by this repo, Codex, and Claude.
- `.codex/config.toml`: repo-local Codex config for working in this repo.
- `scripts/sync-plugins.sh`: installs Desktop skills, refreshes plugin agent folders, validates manifests, registers/install plugins, and refreshes local caches.

## Sync

After any change under `skills/`, `meta-skill/`, `.codex/agents/`, `plugins/codex/agent/assets/`, or `AGENTS.md`, run:

```sh
scripts/sync-plugins.sh
```

The script updates:

- Managed Desktop skills under `~/.codex/skills/`
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
