# AGENTS.md

## Metadata
- Owner: <team-or-role-or-unassigned>
- Status: active
- Last reviewed: YYYY-MM-DD
- Review cycle days: 30
- Source of truth: `AGENTS.md`
- Verification state: unverified
- Applies to: `/`

## Purpose

This file is the navigation layer for how agents and contributors work in this repo. Keep it short, operational, and easy to scan.

## Keep This File Short

- Target length: about 100-150 lines.
- Keep policy detail in dedicated docs.
- Link out instead of embedding long rule blocks.

## Layering and Precedence

- Root `AGENTS.md` sets global defaults.
- Nested `AGENTS.md` files may override or extend rules for subdirectories.
- If `CLAUDE.md` already exists, treat them as peer instruction sources and avoid contradictory guidance.

## Table of Contents

Use links that exist in this repo. If a doc is missing, mark it `not in this repo`.

- `AGENTS.md` - contributor and agent operating contract.
- `ARCHITECTURE.md` - system boundaries and invariants. (`not in this repo`)
- `TODOS.md` - priorities and queue. (`not in this repo`)
- `docs/README.md` - docs index. (`not in this repo`)
- `docs/ISSUES.md` - issue registry. (`not in this repo`)
- `docs/PLANS.md` - planning lifecycle rules. (`not in this repo`)

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
