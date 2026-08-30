# Install

Install Dots on a Mac from a local checkout. Machine configuration is optional
and should be reviewed before use.

## Prerequisites

Put `git`, `python3`, and `zsh` on `PATH`. Install and authenticate the plugin
host you plan to use: Codex, Claude Code, or both.

## Install or update

1. Create or update the checkout.

   ```sh
   if [[ -d ~/Code/dots/.git ]]; then
     git -C ~/Code/dots pull --ff-only
   else
     mkdir -p ~/Code
     git clone https://github.com/rishirsv/dots.git ~/Code/dots
   fi
   cd ~/Code/dots
   ```

2. Install the plugin for one or both hosts.

   ```sh
   scripts/sync-plugins.sh --codex
   scripts/sync-plugins.sh --claude
   ```

3. Confirm that the selected host can load the plugin.

   ```sh
   codex plugin list
   claude plugin list
   ```

Installation is complete when the relevant commands exit successfully.

## Optional machine configuration

The files under `configs/` are opinionated defaults, not plugin requirements.
Preview a specific target before applying it:

```sh
scripts/sync-configs.sh --dry-run --claude
scripts/sync-configs.sh --claude
```

Run `scripts/sync-configs.sh --help` for available targets. Use `--all` only
after reviewing every source under `configs/`.

## Boundaries

- Config sync creates timestamped backups before replacing existing files.
- Codex config sync validates the complete result with the installed Codex
  strict schema before writing either Codex home. Permissions come directly
  from `config.toml`; sync does not modify ChatGPT's local desktop state.
- Computer History is not a `config.toml` setting. Its plugin and Memories are
  enabled by Dots, but each Mac still requires the app's Computer History
  opt-in. If collection stops, use **Settings > Computer history > Resume**.
- macOS Screen Recording, Accessibility, Computer Use app approvals, and
  Computer History consent remain per-machine choices.
- Dots enables the Computer Use helper's undocumented
  `ComputerUseAllowForbiddenTargets` default so it can target ChatGPT, Codex,
  and terminal-class apps. Config sync fails if an installed helper no longer
  ships that override; it never writes the key into `config.toml`.
- ChatGPT's startup surface is app runtime state, not a documented Codex config
  key; Dots does not write it.
- Keep secrets and machine-local shell overrides in `~/.zshrc.local`.

Run `scripts/sync-plugins.sh --help` for host-specific plugin updates.
