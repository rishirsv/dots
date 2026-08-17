# Install

Install every repo-owned plugin and machine config on a Mac from the canonical
checkout at `~/Code/dots`.

## Prerequisites

Put `git`, `python3`, `zsh`, `codex`, and `claude` on `PATH`. Authenticate Codex
and Claude before syncing plugins.

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

2. Preview every config change. Resolve unexpected replacements before
   continuing.

   ```sh
   scripts/sync-configs.sh --dry-run --all
   ```

3. Apply every config and refresh every repo-owned plugin.

   ```sh
   scripts/sync-configs.sh --all
   scripts/sync-plugins.sh --all
   ```

4. Confirm that every config target is current and both plugin hosts can load
   their inventories.

   ```sh
   scripts/sync-configs.sh --status --all
   codex plugin list
   claude plugin list
   ```

Installation is complete when all three commands exit successfully and new
Codex tasks show **Dots** in the permissions picker.

## Boundaries

- Config sync creates timestamped backups before replacing existing files.
- Codex config sync validates the complete result with the installed Codex
  strict schema before writing either Codex home, then selects the documented
  `Dots` permission profile in ChatGPT's local desktop state.
- If Codex permission state must change while ChatGPT is running, quit ChatGPT
  and rerun `scripts/sync-configs.sh --codex`.
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

Run `scripts/sync-configs.sh --help` or `scripts/sync-plugins.sh --help` only
when a scoped sync or source capture is required.
