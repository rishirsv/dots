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

## Install Portal

Portal is an optional local bridge included in the Dots repository. It keeps a
Codex task as the authoritative conversation while ChatGPT Web Pro performs the
model turn and the originating Codex task executes its tools.

From the checkout, install the package's pinned Bun version (currently 1.4.0),
build the relocatable runtime, and install it for the current user:

```sh
cd plugins/dots/mcp
bun install --frozen-lockfile --ignore-scripts
bun run build
./scripts/install.sh
export PATH="$HOME/.local/bin:$PATH"
```

Start Portal with an OpenAI tunnel id and a Tunnels Read+Use runtime key:

```sh
portal start --tunnel-id ID --runtime-key-file /absolute/path/to/key
portal status
```

The first start opens the dedicated Chrome login flow when needed and prints the
one remaining account-level connector step when ChatGPT has not yet been
connected to the tunnel. Create/select the connector with the exact name
**Portal** and allow the actions required by this local bridge. Portal installs
its reversible Codex route only after its local runtime and tunnel are ready.

Use `portal login` to refresh ChatGPT authentication, `portal stop` to restore
the previous Codex route and stop Portal, and `portal uninstall` to remove the
integration while preserving private login/application data. Pass
`--purge-data` only when that private data should also be deleted.

For a Codex-originated task, enter follow-ups in Codex. The Chrome window Portal
opens is an execution surface, not a second synchronized task editor. A direct
ChatGPT conversation that invokes `@Portal` is a separate workflow; continue
that conversation in ChatGPT.

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
