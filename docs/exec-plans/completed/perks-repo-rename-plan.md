# Perks Repo Rename Plan

## Purpose

Rename Rishi's personal Codex plugin repo and installable plugin from `rs-tools` to `perks`, with user-facing display name `Perks`. The outcome should make the repo feel like a coherent personal bundle of Codex abilities while keeping plugin installation and local development easy to understand.

## Phase Outcomes

1. Research and sync: the repo is up to date, and the folder structure is checked against OpenAI's current plugin and skill guidance.
2. Source migration: the installable plugin folder, manifests, marketplace entry, docs, and config references use `perks`.
3. Structure cleanup: the Codex marketplace is treated as canonical, with Claude compatibility clearly separated from active Codex source-of-truth paths.
4. Remote rename: GitHub repo and local checkout path/remote are renamed to `perks`.
5. Verification: JSON/config files parse, skill/plugin paths exist, git status is clean or intentionally changed, and GitHub reports `rishirsv/perks`.

## Implementation Checklist

- [x] 1.0 Sync and research
  - [x] 1.1 Fast-forward local `main` from `origin/main`.
  - [x] 1.2 Inspect current marketplace, plugin manifests, and repo docs.
  - [x] 1.3 Review OpenAI plugin and skill docs for canonical structure.
  - [x] 1.4 Validation for 1.0: note source guidance and current repo drift.
- [x] 2.0 Rename plugin source to Perks
  - [x] 2.1 Move `plugins/rs-tools` to `plugins/perks`.
  - [x] 2.2 Update `.codex-plugin/plugin.json` with `name: perks` and `displayName: Perks`.
  - [x] 2.3 Update bundled `perks` skill text to describe the Perks repo/plugin.
  - [x] 2.4 Validation for 2.0: plugin manifest parses and `plugins/perks/skills` is intact.
- [x] 3.0 Consolidate marketplace and documentation structure
  - [x] 3.1 Update `.agents/plugins/marketplace.json` to canonical Perks metadata.
  - [x] 3.2 Reclassify `.claude-plugin/marketplace.json` as Claude compatibility metadata.
  - [x] 3.3 Update README, AGENTS, INSTALL, TODO, and config references from `rs-tools` to `perks`.
  - [x] 3.4 Validation for 3.0: repo search has no stale active `plugins/rs-tools`, `rs-tools@rs-tools`, or GitHub URL references outside historical docs.
- [x] 4.0 Rename repo locally and remotely
  - [x] 4.1 Commit the migration in the current checkout.
  - [x] 4.2 Push to GitHub.
  - [x] 4.3 Rename GitHub repo from `rishirsv/rs-tools` to `rishirsv/perks`.
  - [x] 4.4 Rename local checkout folder from `rs-tools` to `perks` and update `origin`.
  - [x] 4.5 Validation for 4.0: `gh repo view rishirsv/perks` succeeds and local `git remote -v` points at `perks`.

## Validation

- `git -C /Users/rishi/Code/rs-tools status --short --branch` before rename and equivalent under `/Users/rishi/Code/perks` after rename.
- `python3 -m json.tool .agents/plugins/marketplace.json`
- `python3 -m json.tool plugins/perks/.codex-plugin/plugin.json`
- `python3 -m json.tool .claude-plugin/marketplace.json`
- `find plugins/perks/skills -maxdepth 2 -name SKILL.md | sort`
- `rg -n 'rs-tools|RS Tools|plugins/rs-tools|rishirsv/rs-tools|rs-tools@rs-tools|marketplaces.rs-tools'` and review remaining matches for historical-only context.
- `gh repo view rishirsv/perks --json name,nameWithOwner,url,defaultBranchRef`

## Decision Log

- Use OpenAI's documented plugin structure as the target shape: each plugin has `.codex-plugin/plugin.json` plus optional top-level `skills/`, `hooks/`, `assets/`, `.mcp.json`, and `.app.json`.
- Keep `.agents/plugins/marketplace.json` as the canonical Codex marketplace because OpenAI's plugin creator guidance treats repo/team marketplace files under `.agents/plugins/marketplace.json` as the manual wiring point.
- Keep Claude marketplace files only as compatibility metadata rather than an equal source of truth for Codex.
- Symlink `plugins/perks/.claude-plugin/plugin.json` to `plugins/perks/.codex-plugin/plugin.json` to avoid duplicate package metadata. Do not symlink the root marketplace files because their schemas differ.

## Surprises/Discoveries

- OpenAI's `openai/skills` repo is skill-catalog-only and organizes skills under `skills/.system`, `skills/.curated`, and `skills/.experimental`.
- OpenAI's Codex plugin docs and the built-in plugin creator sample are more relevant to plugin repo structure than `openai/skills`, because plugins are the distribution unit for reusable skills and apps.

## Completion Notes

- Shipped: renamed the GitHub repo to `rishirsv/perks`, moved the local checkout to `/Users/rishi/Code/perks`, renamed the installable plugin to `perks`, set display name to `Perks`, and updated repo docs/configs.
- Shipped: kept `.agents/plugins/marketplace.json` as the canonical Codex marketplace, documented `.claude-plugin/marketplace.json` as compatibility metadata, and symlinked `plugins/perks/.claude-plugin/plugin.json` to the Codex plugin manifest.
- Validation passed: plugin validator, `perks` skill quick validation, JSON parsing, stale-reference scan, GitHub repo readback, and clean working tree after the final plan commit.
