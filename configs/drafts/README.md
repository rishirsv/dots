# Drafts Style Library

This folder is the repo-managed Drafts style guide source.

`scripts/sync-configs.sh --drafts-styles` installs this style library into:

- `~/.codex/skill-state/drafts/styles`
- `~/.codex-personal/skill-state/drafts/styles`

The repo-managed Zsh config also exports:

```sh
DRAFTS_STYLE_HOME="$HOME/Code/dots/configs/drafts/styles"
```

That makes shell-launched Drafts use this repo copy directly while the sync
target keeps default and personal Codex homes populated for tools that do not
inherit the shell environment.

Keep this folder to reusable `style.md` guide files, per-style `references/`,
and the minimal `style-library.json` lookup index. Do not add separate evidence
audits, extraction ledgers, source corpora, or message/archive exports here.
