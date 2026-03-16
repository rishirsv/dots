# AGENTS.md

## Purpose

This file is the navigation layer for how agents and contributors work in this repo. Keep it short, operational, and easy to scan.

## Keep This File Short

- Target length: about 80-120 lines.
- Hard cap: 150 lines. If a new rule is important enough to add, remove or compress something else.
- Keep policy detail in dedicated docs.
- Link out instead of embedding long rule blocks.
- Rewrite and prune regularly; do not grow this file by accumulation.

## Layering and Precedence

- Root `AGENTS.md` sets global defaults.
- Nested `AGENTS.md` files may override or extend rules for subdirectories.
- Avoid overlapping instruction files that compete with this one.

## Table of Contents

Include only links that actually exist in this repo.

- `AGENTS.md` - contributor and agent operating contract.
- `ARCHITECTURE.md` - system boundaries and invariants.
- `TODOS.md` - priorities and queue.
- `WORK-TRACKER.md` - unified operational backlog.
- `docs/README.md` - docs index.
- `docs/PLANS.md` - planning lifecycle rules.

## Maintenance Rules

- On every edit, remove stale, duplicate, or low-value guidance instead of only appending.
- Update commands, paths, linked docs, and validation steps whenever they change.
- Collapse repeated rules into one clearer rule.
- Keep instructions concrete, imperative, and easy to scan.
- If a rule is no longer enforced in code or process, delete it.

## Scope

- In scope: <what changes are acceptable>
- Out of scope: <what to avoid>

## Safety Boundaries

- Do not touch: <generated files / secrets / production data / regulated surfaces>

## Verifiable Loop

Run concrete checks before handoff and iterate until they pass.

| Purpose | Command     | Expected signal    |
| ------- | ----------- | ------------------ |
| Build   | `<command>` | No build errors    |
| Test    | `<command>` | Tests pass         |
| Lint    | `<command>` | No lint violations |

## Workflow

- Read request and identify affected files.
- Prefer minimal diffs.
- Ground decisions in repo evidence.
- Record assumptions when evidence is missing.
