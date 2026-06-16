# INSTALL.md

Bootstrap this source-first dotfiles and plugin repo on a local machine.

## Bootstrap

1. Clone the repo.

```sh
mkdir -p ~/Code
git clone https://github.com/rishirsv/dots.git ~/Code/dots
cd ~/Code/dots
```

2. Generate plugin packages.

```sh
scripts/package-plugins.sh
```

3. Register or refresh the local Codex marketplace if needed.

```sh
codex plugin marketplace list
```

The desired marketplace entry is:

```text
dots  /Users/rishi/Code/dots/dist/codex
```

If it is missing, add the generated marketplace:

```sh
codex plugin marketplace add /Users/rishi/Code/dots/dist/codex
```

4. Install the local plugins.

```sh
codex plugin add dots@dots
codex plugin add meta-skill@dots
```

5. Review and apply config syncs.

```sh
scripts/sync-configs.sh --dry-run --codex --claude
scripts/sync-configs.sh --codex --claude
```

Run broader syncs only after reviewing the dry-run:

```sh
scripts/sync-configs.sh --dry-run --all
```

## Notes

- Edit plugin source under `plugins/`; do not edit generated `dist/` packages or
  installed plugin caches by hand.
- Keep generated vendor packages under ignored `dist/`.
- Keep secrets and machine-local shell overrides in local files such as
  `~/.zshrc.local`.
- Source config should stay portable. Do not add dated throwaway project paths,
  auth state, session state, or caches to `configs/`.
