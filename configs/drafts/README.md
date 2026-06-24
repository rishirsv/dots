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

Privacy rule: this repo may be public. Keep this library in `guides_only` mode.
Do not commit raw or cleaned Outlook, iMessage, Slack, Teams, or client corpus
references here unless the repo has been made private and the references were
explicitly approved for sync.
