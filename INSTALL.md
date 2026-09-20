# Onboard a Mac

Use this checklist to install Dots on a new Mac or refresh an existing one.
Plugin installation is separate from machine configuration. The files under
`configs/` contain personal, opinionated defaults, so inspect them before
applying them.

## Prepare the Mac

Put `git`, `python3`, and `zsh` on `PATH`. Install and sign in to Codex, Claude
Code, or both. Claude plugin sync also requires `node` on `PATH`.

Install and open each app whose configuration you plan to restore. The current
config targets are Codex, a second Codex profile, Claude Code, VS Code, Ghostty,
Tinycast, Wispr Flow with Logi Options+, Starship, and Zsh. Tinycast onboarding
also expects its Coffee extension to be installed. The Wispr and Logitech
repair requires `jq` and `sqlite3` and expects both apps to have created their
local settings.

## Get the repository

Create the canonical checkout or update it:

```sh
if [[ -d ~/Code/dots/.git ]]; then
  git -C ~/Code/dots pull --ff-only
else
  mkdir -p ~/Code
  git clone https://github.com/rishirsv/dots.git ~/Code/dots
fi
cd ~/Code/dots
```

## Install the plugins

Sync each installed host:

```sh
scripts/sync-plugins.sh --codex
scripts/sync-plugins.sh --claude
```

Use only the command for the host installed on the Mac. Codex sync also
refreshes the second profile at `~/.codex-personal` when that directory exists.
Claude sessions that were already open require `/reload-plugins` or a restart.

For ChatGPT access to local files, follow the optional
[dots-tunnel setup](plugins/dots/scripts/dots-tunnel/README.md#local-setup).
Plugin installation alone does not start a tunnel or authorize any folder.

## Restore machine configuration

Choose the targets needed on this Mac. Run `scripts/sync-configs.sh --help` to
see the authoritative target list.

Preview the selected targets first, inspect every proposed replacement, and
then apply the same target list. For example:

```sh
scripts/sync-configs.sh --dry-run --codex --claude --vscode --ghostty --starship --zsh
scripts/sync-configs.sh           --codex --claude --vscode --ghostty --starship --zsh
```

On a personal Mac with every destination app installed and initialized, use the
complete profile:

```sh
scripts/sync-configs.sh --dry-run --all
scripts/sync-configs.sh --all
```

Config sync creates timestamped backups before replacing existing files. It
does not copy secrets, authentication state, sessions, caches, clipboard
contents, AI conversations, or macOS privacy grants. Keep secrets and
machine-local shell overrides in `~/.zshrc.local`.

## Finish per-machine setup

Complete the settings that macOS and individual apps do not allow Dots to
restore:

1. Grant the required Screen Recording, Accessibility, and Computer Use app
   permissions in macOS System Settings.
2. Opt in to Computer History on this Mac. If collection later stops, use
   **Settings > Computer history > Resume**.
3. Confirm Tinycast has Coffee installed before applying its config.
4. Follow [`configs/logi-options-plus/shortcuts.md`](configs/logi-options-plus/shortcuts.md)
   for the remaining device assignments and end-to-end Wispr checks.
5. Restore account-specific app settings and sign-ins from their original
   services rather than copying local application data.

Dots enables the Computer Use helper's undocumented
`ComputerUseAllowForbiddenTargets` default so it can target ChatGPT, Codex, and
terminal-class apps. Config sync fails if an installed helper no longer ships
that override. ChatGPT's startup surface remains app runtime state and is not a
documented Codex config key.

## Verify the onboarding

Check the same config targets that were applied, then confirm each installed
plugin host can load its inventory:

```sh
scripts/sync-configs.sh --status --codex --claude --vscode --ghostty --starship --zsh
codex plugin list
claude plugin list
```

Use `scripts/sync-configs.sh --status --all` after applying the complete
profile. Onboarding is complete when the status command and the relevant plugin
inventory commands exit successfully, followed by the manual checks above.
