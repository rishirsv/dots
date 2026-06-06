# AGENTS.md

## Purpose

This file is the operating contract for agents and contributors in this repo. Keep it short, concrete, and easy to scan.

## Keep This File Short

- Target length: 80-120 lines.
- Hard cap: 150 lines.
- Link to deeper docs instead of embedding long rule blocks.
- Remove stale, duplicate, or low-value guidance when adding new rules.

## Layering And Precedence

- Root `AGENTS.md` sets repo-wide defaults.
- Nested `AGENTS.md` files may override or extend rules for their subtree.
- More specific instructions override broader instructions when they conflict.
- Avoid competing instruction files for the same scope.

## Edit Surface

- In scope: `<source paths agents may edit>`
- Out of scope: `<generated files, secrets, production data, regulated surfaces>`

## Safety Boundaries

- Do not touch: `<paths or systems>`
- Do not commit: `<secrets, generated artifacts, local config>`
- Ask or stop when: `<material risk or missing permission>`

## Verifiable Loop

Run concrete checks before handoff and iterate until they pass.

| Purpose | Command | Expected signal |
|---|---|---|
| Build | `<command>` | No build errors |
| Test | `<command>` | Tests pass |
| Lint | `<command>` | No lint violations |

## Workflow

- Read the request and identify affected files.
- Prefer minimal diffs.
- Ground decisions in repo evidence.
- Update docs and validation when commands or paths change.
- Record assumptions when evidence is missing.
