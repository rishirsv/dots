# Perks

Planning repo for Rishi's next personal Codex and Claude plugin bundle.

The previous `perks` plugin has been removed while the repo is audited and redesigned. There is intentionally no active installable plugin or marketplace in this repo right now.

## Structure

- `skills/`: loose reusable skills while drafting or before plugin packaging.
- `plugins/`: future installable plugin packages. This folder is intentionally empty or absent until the new Perks plugin is designed.
- `.codex/config.toml`: repo-local Codex config for working in this repo.
- `configs/`: reusable agent and prompt configuration.
- `references/`: external examples, archived candidate skills, and source material.
- `TODO.md`: improvement backlog for future skill rebuilds.

## Current State

No plugin is active.

The next Perks plugin should be rebuilt from the audit in `docs/exec-plans/active/perks-minimal-structure-plan.md`, using only the workflows that are worth keeping.

## References

Reference folders are not installed as active skills. They exist to guide future skill rebuilds and KPMG/deck work:

- `references/oai/`: OAI artifact package, OAI skills, and presentation references.
- `references/candidates/`: archived skills to mine while rebuilding coding and design workflows.
- `references/system/`: installed system skills kept as design references.
- `references/anthropic/`: Anthropic knowledge-work and financial-services plugin examples.

## Repo Codex Config

This repo keeps its Codex config in `.codex/config.toml`.

That file does not register or enable a Perks plugin while the redesign is in progress. User-specific secrets, auth, and machine-wide defaults should stay in `~/.codex/config.toml`.
