# Dots

Source repo for Rishi's personal plugins, agent workflows, and machine
configuration.

## Source Map

Edit durable source here:

- `plugins/`: source for each maintained plugin.
- `configs/`: source copies of Codex, Claude, VS Code, Ghostty, and Zsh configs.
- `AGENTS.md`: repo instructions for agents working in this checkout.
- `scripts/`: small helper entrypoints that are still source-owned.

Generated output should live under `dist/` and stay out of Git.

## Plugin Source

Each plugin lives under `plugins/<plugin-name>/`.

```text
plugins/
├─ catalog.json
├─ agent/
│  ├─ plugin.json
│  ├─ package.ignore
│  ├─ assets/
│  └─ skills/
└─ meta-skill/
   ├─ plugin.json
   ├─ package.ignore
   ├─ assets/
   ├─ references/
   ├─ skills/
   ├─ src/
   └─ tests/
```

`plugins/catalog.json` is the source catalog. A future packaging script should
use it to generate vendor-specific marketplace files rather than hand-editing
marketplace output.

Expected generated output:

```text
dist/
├─ codex/
│  ├─ .agents/plugins/marketplace.json
│  └─ plugins/<plugin>/.codex-plugin/plugin.json
└─ claude/
   ├─ .claude-plugin/marketplace.json
   └─ plugins/<plugin>/.claude-plugin/plugin.json
```

Codex and Claude use different package conventions, so generated manifests and
marketplaces should remain vendor-specific:

- Codex plugin packages use `.codex-plugin/plugin.json`.
- Claude plugin packages use `.claude-plugin/plugin.json`.
- Codex repo marketplaces use `.agents/plugins/marketplace.json`.
- Claude marketplaces use `.claude-plugin/marketplace.json`.

## Config Source

Machine config source copies live under `configs/`.

```text
configs/
├─ claude/
├─ codex/
├─ ghostty/
├─ vscode/
└─ zsh/
```

These are currently snapshots, not automatically installed outputs. Some
captured files include machine-local state, especially `configs/codex/config.toml`.
Before reintroducing sync automation, split portable config from runtime state
such as timestamps, cache paths, trust hashes, and per-machine project entries.
Secrets belong in local files outside Git, such as `~/.zshrc.local`.

## Current Sync Status

The previous sync scripts were removed during the repo restructure. For now:

- Edit plugin source under `plugins/`.
- Do not edit generated vendor packages by hand.
- Generate vendor packages with `scripts/package-plugins.sh`.
- Keep generated packages under ignored `dist/`.
- Treat `configs/` as source snapshots until a new sync contract is designed.

Before adding new sync automation, decide which files are portable source,
which files are machine-local state, and which targets should be copied versus
symlinked.
