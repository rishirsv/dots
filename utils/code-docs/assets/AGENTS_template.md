---
name: agents
description: Repo guidelines and workflow instructions for agents and contributors.
---

# Repository Guidelines

<1–2 sentences: what this repo is and how to work in it safely.>

## Scope

- In scope: <what changes are OK>
- Out of scope: <what not to change>

## Project Structure & Modules

```text
<repo>/
  docs/                      # documentation
  src/                       # main code
```

## Build, Test, and Development Commands

Run commands from:

```bash
cd <path>
```

| Purpose | Command | Notes |
|---|---|---|
| Install | `<cmd>` | <package manager / setup notes> |
| Dev | `<cmd>` | <how to run locally> |
| Tests | `<cmd>` | <what it runs> |
| Lint (optional) | `<cmd>` | <when to run> |
| Build (optional) | `<cmd>` | <when to run> |

## Workflow (Spec → Plan → Execute → Review)

- Spec: `docs/product-specs/<feature-slug>-spec.md`
- Plan: `docs/exec-plans/active/<feature-slug>-plan.md`
- Execute: implement the plan and update task checkboxes
- Complete: move plan to `docs/exec-plans/completed/<feature-slug>-plan.md` when user determines done
- Review notes (optional): `docs/exec-plans/completed/<feature-slug>-implementation-notes.md`

## Defaults

- Prefer minimal diffs unless asked for a rewrite.
- Match existing repo conventions (paths, naming, tone).
- Include verification steps (commands + expected output) for any doc that instructs actions.

## Safety boundaries

- <Don’t-touch zones (generated files, prod data, etc.)>

## Verification

<How to validate changes in this repo (commands + expected results).>
