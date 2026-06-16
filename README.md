# Dots

Source repo for Rishi's personal plugins, agent workflows, and machine
configuration.

## Source Map

Edit durable source here:

- `plugins/`: source for each maintained plugin.
- `configs/`: source copies of Codex, Claude, VS Code, Ghostty, and Zsh configs.
- `AGENTS.md`: repo instructions for agents working in this checkout.
- `scripts/`: small helper entrypoints that are still source-owned.

Generated output lives under ignored `dist/`.

## Plugin Source

Each plugin lives under `plugins/<plugin-name>/`.

```text
plugins/
├─ catalog.json
├─ dots/
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

`plugins/catalog.json` is the source catalog. Generate vendor packages with:

```sh
scripts/package-plugins.sh
```

The script rebuilds:

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

Install or refresh Codex plugins from the generated `dots` marketplace with the
Codex plugin CLI:

```sh
codex plugin add dots@dots
codex plugin add meta-skill@dots
```

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

Sync selected config sources with:

```sh
scripts/sync-configs.sh --dry-run --all
scripts/sync-configs.sh --codex
scripts/sync-configs.sh --claude
```

Review the dry-run before applying a scoped sync. The script backs up existing
targets before replacing them.

Keep source config portable. Stable project roots may live in
`configs/codex/config.toml`; dated throwaway workspaces, caches, auth, session
state, and machine-local shell secrets should stay out of Git. Zsh secrets and
local shell overrides belong in `~/.zshrc.local`, not `configs/zsh/`.

## Validation

Before committing plugin or config changes:

```sh
scripts/package-plugins.sh
scripts/sync-configs.sh --dry-run --codex --claude
```

For Meta-Skill changes, also run:

```sh
plugins/meta-skill/scripts/metaskill validate <skill-dir> --json
```
