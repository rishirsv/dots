---
name: docs-gardener
description: Keep documentation aligned with code and repo structure. Use when updating canonical docs, docs indexes, specs, work trackers, or repairing drift between docs and implementation.
---

# Docs Gardener

## Overview

Use this skill when documentation work should be treated as repository maintenance, not just writing. It inspects code and docs together, updates the affected documentation graph, and keeps the repo aligned to one canonical documentation system.

This is a hard-cut docs skill:

- one canonical owner doc per concern
- one canonical work tracker instead of split issue/debt registries
- no duplicate docs or compatibility stubs unless the user explicitly asks for transition support
- no half-updated documentation graphs

## Use This Skill When

Use this skill for:

- creating or revising root operating docs such as `AGENTS.md`, `ARCHITECTURE.md`, `TODOS.md`, and `WORK-TRACKER.md`
- updating docs indexes, policy docs, specs, logic docs, or research notes
- simplifying documentation architecture
- consolidating overlapping docs into one canonical source
- repairing stale links, broken references, outdated paths, or drift between code and docs
- updating docs after product, routing, schema, or workflow changes
- auditing whether the repo is understandable and actionable for future agents
- recording newly discovered actionable documentation or contract gaps in `WORK-TRACKER.md`

## Do Not Use This Skill When

Do not use this skill for:

- feature implementation that primarily changes source code rather than docs
- general brainstorming that does not require repo doc changes
- one-off prose polishing when no repo context or cross-doc maintenance is needed
- writing parallel legacy docs to preserve old structures

## Core Principles

- Treat docs as operational infrastructure, not passive prose.
- Keep one canonical source per concern.
- Prefer deleting duplicate docs over keeping parallel versions.
- Keep `docs/DESIGN.md` visual-system-only and `docs/FRONTEND.md` runtime/behavior-only; do not let either become a shadow copy of the other.
- Record actionable repo problems in `WORK-TRACKER.md`, not in separate issue/debt files.
- Ground implementation-derived docs in repository evidence; do not guess.
- Update linked docs, indexes, and references in the same pass when they are affected.
- Fail fast on missing canonical structure. Do not revive retired paths as compatibility shims.

## Optional Explorer Subagents

If fast explorer subagents are available and the task touches a large doc graph, you may use one or two for discovery only.

Recommended split:

- subagent 1: inventory canonical owner docs, overlaps, and stale guidance
- subagent 2: inventory broken links, stale paths, and doc graph fallout

Rules:

- use no more than two
- use them for exploration, not editing
- continue solo if subagents are unavailable
- synthesize the findings into one canonical decision before editing

## Workflow

### 1. Discover the current state

- Read the relevant code, docs, and agent instructions before writing.
- Identify the canonical owner doc for the topic.
- Search for overlapping docs, stale links, broken references, and old path mentions.
- Decide whether the task is:
  - create
  - update
  - consolidate
  - replace
  - audit

Read only the relevant bundled references:

- For repo architecture and doc ownership: `references/docs-operating-model.md`
- For task flow and consolidation behavior: `references/docs-maintenance-workflows.md`
- For verification and done criteria: `references/docs-verification.md`
- For strict `AGENTS.md` upkeep: `references/agents-maintenance.md`
- For template choice: `references/template-selection.md`

### 2. Choose the canonical output

- If a canonical doc already exists, update it instead of creating a sibling.
- If two docs overlap, merge into one canonical doc and delete the weaker one.
- If a user asks for a new durable repo document, place it in the canonical location instead of inventing a new bucket.
- If the task surfaces actionable work, add or update a `WORK-TRACKER.md` entry using the bundled template.

### 3. Apply the change as a graph update

When you edit one doc, also update anything directly affected:

- docs index entries
- path references
- cross-links
- tracker references
- plan/spec references when a canonical path changes

Do not leave the doc graph half-updated.

### 4. Verify the result

- Check that links and file references still resolve.
- Confirm the chosen canonical path matches repo policy.
- Confirm any new or changed tracker entries have clear next steps.
- Confirm no active guidance still points to retired paths.

Use `references/docs-verification.md` for the exact checklist.

## Capability Guide

### Unified work tracking

This skill owns the repo's operational backlog structure.

- Use `assets/WORK-TRACKER_template.md` to create the root tracker.
- Use `assets/work-tracker-entry_template.md` for new entries.
- Keep one backlog for bugs, tech debt, docs debt, contract gaps, and reliability gaps.
- Distinguish kinds of work with the `type` field, not separate files.

### Canonical doc consolidation

When multiple docs cover the same concern:

1. Choose the canonical owner.
2. Merge the useful content.
3. Update inbound references.
4. Delete the superseded file in the same change when possible.

### Documentation architecture changes

For repo-wide doc-structure changes:

- update root policy docs first
- update the docs index second
- replace the content and references third
- remove retired paths last, in the same change when possible

### Agent-readiness and docs health audits

This skill should leave the repo easier for the next agent to understand.

Audit for:

- missing canonical owner docs
- stale path references
- broken markdown links
- duplicated guidance
- ambiguous canonical ownership
- tracker entries with no next step or verification path

### `AGENTS.md` maintenance

Treat `AGENTS.md` as a compact operating contract, not a changelog.

- keep it short and aggressively pruned
- update commands, paths, and linked docs whenever they change
- remove stale or duplicated rules instead of appending
- prefer one clear rule over multiple variants

Use `references/agents-maintenance.md` when creating or revising `AGENTS.md`.

## Templates And Reuse

Use the bundled templates for new architecture work and new durable docs. The full template inventory is selected through `references/template-selection.md`.

For established doc families that already exist in the repo, preserve the existing local structure and tone unless the task is explicitly to re-template or simplify them.

## Example Triggers

- "Use $docs-gardener to replace the issue registry and debt tracker with one root-level work tracker."
- "Use $docs-gardener to update the docs after this routing change and repair any stale links."
- "Use $docs-gardener to audit whether this repo's docs are usable for future agents."
- "Use $docs-gardener to consolidate overlapping product specs and remove the duplicate."

## Deliverable Expectations

When you finish a task with this skill:

- name the canonical files changed
- note any deleted or consolidated docs
- state what verification was performed
- call out any remaining unresolved doc gaps and add them to `WORK-TRACKER.md` when appropriate
