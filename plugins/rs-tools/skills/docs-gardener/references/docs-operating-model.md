# Docs Operating Model

## Purpose

This reference describes the target operating model for a maintainable, agent-usable documentation system.

Use it when a task touches documentation architecture, canonical ownership, tracker design, or repo-wide docs cleanup.

## Core model

- documentation is part of the repo's operational system, not passive prose
- each concern has one canonical owner doc
- the docs graph should stay coherent after every change
- actionable repo problems should live in one canonical work tracker
- duplicate registries and overlapping guidance should be collapsed, not preserved

## Recommended canonical structure

At the repo root:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `TODOS.md`
- `WORK-TRACKER.md`

Within `docs/`:

- `docs/README.md`
- policy and reference docs
- `docs/product-specs/*`
- `docs/project-specs/*`
- `docs/logic/*`
- `docs/exec-plans/active/*`
- `docs/exec-plans/completed/*`
- `docs/research/*`
- `docs/artifacts/*`

Adapt to the repo if it already has an established canonical structure, but do not create parallel registries or duplicate owner docs.

## Unified work tracking

`WORK-TRACKER.md` is the recommended single backlog for:

- bugs
- tech debt
- docs debt
- contract gaps
- reliability gaps
- follow-up cleanup

Use simple fields such as `type`, `severity`, and `status` to classify work inside the one tracker. Do not split those concerns into separate files.

## Hard-cut behavior

- update the canonical doc instead of creating a sibling
- replace stale paths instead of preserving aliases
- delete superseded docs once inbound references are updated
- avoid compatibility notes unless the user explicitly asks for transition support

## Exec plans vs work tracker

The work tracker is intake and prioritization memory.

Exec plans are execution memory.

Once work is accepted, the tracker should link to the plan and keep only a concise summary, next step, and verification path.
