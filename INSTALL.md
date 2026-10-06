# Onboard a Mac

Use this checklist to install Dots on a new Mac or refresh an existing one.
Plugin installation is separate from machine configuration. The files under
`configs/` contain personal, opinionated defaults, so inspect them before
applying them.

## Prepare the Mac

Put `git`, `python3`, `uv`, and `zsh` on `PATH`. Install and sign in to Codex,
Claude Code, or both. Claude plugin sync also requires `node` on `PATH`. Config
sync uses `uv` to run its pinned TOML dependency without modifying system
Python.

Install and open each app whose configuration you plan to restore. Declarative
config targets cover Codex, a second Codex profile, Claude Code, VS Code,
Ghostty, Starship, and Zsh. Separate setup commands cover Computer Use,
Tinycast, and Wispr Flow with Logi Options+. Tinycast onboarding expects its
Coffee extension to be installed. The Wispr and Logitech repair requires `jq`
and `sqlite3` and expects both apps to have created their local settings.

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

Choose one Codex source for the account signed in on this Mac:

```sh
# Personal account with Dots and Drafts installed in ChatGPT:
scripts/sync-plugins.sh --codex --source cloud

# Work account without those cloud installations:
scripts/sync-plugins.sh --codex --source local
```

Cloud mode uses the same account plugins on web and desktop. It verifies that
Codex can load their skills before removing local Dots/Drafts packages. Local
mode installs from this repository and disables the cloud copies only in that
local profile. It preserves account-wide cloud installations.

The choice is saved in `~/.codex/dots-plugin-source`, or under `CODEX_HOME`
when set. Later plugin and config syncs preserve it. Profiles without a saved
choice default to local. Codex sync also refreshes `~/.codex-personal` when
present, using that profile's own choice. To select its source explicitly:

```sh
CODEX_HOME="$HOME/.codex-personal" scripts/sync-plugins.sh --codex --source local
```

After choosing, run `scripts/sync-plugins.sh --codex` for later refreshes. Sync
fails if Codex loads duplicates or cannot load the selected plugins. Check the
desktop skill picker after changing source; an existing app server can retain
old skills until the desktop app restarts.

For Claude, run `scripts/sync-plugins.sh --claude`. Existing Claude sessions
require `/reload-plugins` or a restart.

Local sync does not publish cloud releases. Use the cloud release procedure
below to publish Dots from the same repository source.

## Release cloud plugins

Dots is a standalone skills plugin. Tunnel is a separate app with its own
connection and release process. Dots packages contain no `.app.json` binding or
`apps` declaration. Keep Git as the source for local and cloud releases.
Personal profiles select cloud; Enterprise profiles select local. A source
selection controls the local loader, not cloud publication or account sign-in.

The personal Dots backend ID is `plugins_6ac41e50a2588191b45ece5c4a5ed1c3`.
Use Plugin Creator's supported tools without ChatGPT web login:

1. Read `get_plugin_files` with that exact ID. Follow inventory pagination and
   inspect the manifest, scope, and current release. Preserve personal scope
   and the existing audience. A display name or `name@marketplace` key is not
   a backend ID.
2. Finish the source changes and bump the three Dots manifests together. Run
   `python3 scripts/verify.py --full` for the release. Commit only the release
   changes, then package `plugins/dots/` from that commit, including hidden compatibility manifests, as one
   `dots/` directory in a ZIP outside the source directory. Include skills,
   scripts, references, agents, and assets; exclude secrets, caches, and
   untracked development files. Do not package another task's uncommitted edits.
3. Call `update_plugin` with the exact backend ID, the archive's absolute local
   path as `archive`, and the observed release as `expected_release_id`.
   If the release changed, reread and reconcile before retrying. Do not create
   a replacement plugin. The update overlays files and cannot delete them;
   identify retired files still present rather than claiming ZIP omission
   removed them.
4. Read back the returned release. Compare the complete expected skill inventory,
   changed content, and metadata with the source. Open the cloud listing and
   desktop plugin card to confirm the logo and composer icon render. Packaged
   image files alone do not prove that the listing uses them; report branding
   verification as pending if either surface shows a fallback icon.
   Installing or publishing the
   skills does not start Tunnel or authorize folders.
5. Refresh the desktop plugin inventory and verify a fresh loader uses the
   selected source without duplicates. The current `verify-codex-skills.py`
   checks availability and known duplicates, not complete release contents.
   Report cloud publication separately from desktop verification. Restart only
   after active chats finish if desktop retains stale skills.

Tunnel keeps app ID `asdk_app_6aaf4ad66f108191b548c1a6a1012373`. Its legacy
canonical plugin ID is `plugin_asdk_app_6aaf4ad66f108191b548c1a6a1012373`.
Plugin Creator rejects that app-backed identity. Use the app's owning release
process for Tunnel updates; never package Dots skills into it again. On
2026-10-05, a one-time web upload replaced that package with Tunnel 1.0.6,
containing the app binding and no skills. The existing connection was preserved.
Ordinary standalone Dots updates now use Plugin Creator tools. Keep Tunnel
enabled independently of the Dots/Drafts skill-source policies.

If a supported publisher or read-back is unavailable, report that step as
pending. Archive creation, local cache refresh, and local skill availability
alone do not prove cloud publication. Do not edit installed caches or switch
another profile's source to complete a release.

## Optional local file access

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

To apply every declarative file target, use:

```sh
scripts/sync-configs.sh --dry-run --all
scripts/sync-configs.sh --all
```

Config sync creates timestamped backups before replacing existing files. It
does not copy secrets, authentication state, sessions, caches, clipboard
contents, AI conversations, or macOS privacy grants. Keep secrets and
machine-local shell overrides in `~/.zshrc.local`.

Application-specific setup is deliberately separate because it changes macOS
defaults, app databases, or running processes. Preview and apply only the setup
you need:

```sh
python3 scripts/sync-codex-computer-use.py apply --dry-run
python3 scripts/sync-codex-computer-use.py apply

python3 scripts/sync-tinycast-config.py apply --config configs/tinycast/settings.json --dry-run
python3 scripts/sync-tinycast-config.py apply --config configs/tinycast/settings.json

scripts/repair-wispr-logitech-shortcut.sh --dry-run
scripts/repair-wispr-logitech-shortcut.sh
```

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

The optional Computer Use command enables the helper's undocumented
`ComputerUseAllowForbiddenTargets` default so it can target ChatGPT, Codex, and
terminal-class apps. It fails if an installed helper no longer ships that
override. ChatGPT's startup surface remains app runtime state and is not a
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
