# INSTALL.md

This repo is being reorganized into a source-first dotfiles and plugin repo.
The old install flow that ran `scripts/sync-plugins.sh` no longer applies.

## Current Manual Bootstrap

1. Clone the repo.

```sh
mkdir -p ~/Code
git clone https://github.com/rishirsv/dots.git ~/Code/dots
```

2. Review source config snapshots.

```sh
cd ~/Code/dots
find configs -maxdepth 3 -type f | sort
```

3. Review plugin source.

```sh
find plugins -maxdepth 3 -type f | sort
```

4. Do not run the removed sync scripts.

The next install flow should be designed around:

- packaging `plugins/<name>` into ignored `dist/codex` and `dist/claude`
- validating vendor packages
- installing local marketplaces from generated `dist`
- syncing selected config files from `configs/` to machine targets
- keeping shell secrets in local files such as `~/.zshrc.local`

## Open Question

The repo now has the source layout, but the new sync/install contract is still
deliberately undecided. Decide which config files should be copied, symlinked,
or kept machine-local before using this repo to update another computer.
