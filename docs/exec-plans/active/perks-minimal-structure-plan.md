# Perks Minimal Structure Plan

## Purpose

Determine the minimal durable structure for the Perks repo after the Codex plugin announcements, including whether Perks needs a marketplace, how it should sync across machines, and which folders can be removed or moved out of the active repo.

Current direction from Rishi: kill the existing plugin for now and remake it new after planning and audit. The repo should not expose an active Perks plugin or marketplace until the new shape is intentionally designed.

## Phase Outcomes

1. Research: current OpenAI Codex plugin, marketplace, CLI, and skill guidance is summarized from live sources; Claude plugin/settings compatibility is checked from current docs or examples.
2. Repo audit: every top-level and major nested folder is classified as essential, optional, archive/reference, generated, or removable.
3. Recommendation: Perks has a clear target layout and cross-machine sync story with the fewest moving pieces.
4. Cleanup: once the target is clear, remove or move folders that are not needed and update docs/configs.
5. Validation: plugin manifests, marketplace/config, symlinks, and skill discovery paths still work.

## Implementation Checklist

- [ ] 1.0 Research current platform guidance
  - [ ] 1.1 Review OpenAI Codex plugin and skill docs, including today's announcement trail if available.
  - [ ] 1.2 Review current Codex CLI plugin commands and install/sync behavior.
  - [ ] 1.3 Review Claude plugin and settings structure enough to decide what compatibility files are worth keeping.
  - [ ] 1.4 Validation for 1.0: cite sources and separate confirmed facts from inference.
- [ ] 2.0 Audit the repo tree
  - [ ] 2.1 Inventory all top-level folders and hidden config folders.
  - [ ] 2.2 Inventory active plugin contents under `plugins/perks`.
  - [ ] 2.3 Inventory loose `skills/`, `references/`, `configs/`, and `docs/` folders.
  - [ ] 2.4 Validation for 2.0: every folder has a disposition and reason.
- [ ] 3.0 Choose target structure and sync model
  - [ ] 3.1 Decide whether `.agents/plugins/marketplace.json` is required, optional, or removable for single-plugin Perks.
  - [ ] 3.2 Decide whether Claude files should stay, be symlinked, or be removed.
  - [ ] 3.3 Define cross-machine auto-sync: Git source, install/update command, cache refresh, and global config handling.
  - [ ] 3.4 Validation for 3.0: target structure maps cleanly to official docs and local CLI behavior.
- [ ] 4.0 Kill current plugin and document paused state
  - [x] 4.1 Remove the current `plugins/perks` bundle.
  - [x] 4.2 Remove active Codex and Claude marketplace files.
  - [x] 4.3 Remove repo-local config that registers/enables `perks@perks`.
  - [x] 4.4 Remove stale local `rs-tools` plugin cache.
  - [ ] 4.5 Validation for 4.0: Codex sees no Perks marketplace/plugin and repo docs say the plugin is paused.
- [ ] 5.0 Prune and document final minimal repo
  - [ ] 5.1 Remove or move unnecessary folders only after the audit supports it.
  - [ ] 5.2 Update README/INSTALL/AGENTS/config docs to describe the minimal structure.
  - [ ] 5.3 Validation for 5.0: stale-path scan, plugin validation if a plugin exists, and clean git diff review.

## Validation

- `codex --version`
- `codex plugin --help`
- `codex plugin marketplace --help`
- `python3 /Users/rishi/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/perks`
- `python3 /Users/rishi/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/perks/skills/perks`
- `python3 -m json.tool .agents/plugins/marketplace.json`
- `python3 -m json.tool plugins/perks/.codex-plugin/plugin.json`
- `find . -maxdepth 3 -type d | sort`
- `rg -n 'rs-tools|plugins/rs-tools|Code/rs-tools|rs-tools@rs-tools|marketplaces.rs-tools' --hidden --glob '!.git/**'`

## Decision Log

- The existing Perks plugin is intentionally removed before deeper pruning so the audit is not biased toward preserving the old bundle.
- Claude plugin metadata should not be symlinked while the new plugin shape is undecided.

## Surprises/Discoveries

- `codex plugin marketplace add rishirsv/perks --ref main --sparse .agents/plugins --sparse plugins/perks` creates a Git marketplace config with `source_type = "git"`, `source = "https://github.com/rishirsv/perks.git"`, `ref = "main"`, and sparse paths. This is likely the future cross-machine sync base if Perks remains a Codex plugin.
- Codex plugin validation currently requires a non-empty `version` in `.codex-plugin/plugin.json`, while Claude docs recommend omitting plugin versions for fast-moving internal plugins that should update on every commit. That means shared/symlinked Codex and Claude manifests create an update-behavior tradeoff.

## Completion Notes

- Pending.
