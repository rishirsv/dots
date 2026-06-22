---
name: harness-engineer
description: "Assess or improve repo-scoped controls that let future agents understand, run, validate, resume, and safely finish work with less human handholding. Use for AGENTS.md maps, command maps, task state, setup scripts, validation checks, CI/test hooks, source/generated routing, and repo harness audits. Do not use for ordinary feature work, broad docs cleanup, PR publication, global memory mining, or skill authoring."
---

# Harness Engineer

Make one repository easier for future agents to operate. Choose the smallest
durable repo control that reduces guesswork, preserves existing strengths, or
gives agents better feedback.

## Boundary

Use this skill for repo-scoped controls.

Use `self-improve` instead when the job is to mine sessions, memories, prior
conversations, global instructions, or repeated personal patterns. This skill
may implement a repo-scoped control after `self-improve` identifies one.

## Load Only As Needed

- Read [assessment-lenses.md](references/assessment-lenses.md) for broad or deep
  repo readiness assessment.
- Read [control-matrix.md](references/control-matrix.md) before deciding where a
  finding, repeated failure, or requested rule belongs.
- Read [task-state.md](references/task-state.md) for long-running task
  preparation, progress ledgers, command maps, verification maps,
  browser/runtime checks, and resume handoffs.
- Read [codex-thread-evidence.md](references/codex-thread-evidence.md) when a
  repo-scoped control depends on evidence from prior Codex threads or memories.
- Use [assessment-template.md](assets/assessment-template.md) only when a formal
  saved assessment is needed and the repo has no format.
- Use [task-state-template.md](assets/task-state-template.md) only when preparing
  a resumable task and the repo has no plan or ledger format.

## Scripts

Resolve scripts relative to this skill directory.

- Run `python3 scripts/harness_snapshot.py --root <repo>` when instruction,
  command, CI, test, setup, or browser-tool discovery would reduce guesswork.
  Use `--json` when structured output helps. Nonzero means the root is invalid
  or unreadable.
- Run `python3 scripts/check_harness_links.py --root <repo> <files...>` after
  editing Markdown instructions, docs, plans, or ledgers. Exit `1` means at
  least one local link target is missing.

Script output is evidence, not a substitute for reading source-of-truth files.

## Modes

### assess

Default for requests like "is this repo agent-ready?", "review the harness",
"what would reduce handholding?", or "audit future-agent usability."

Do not edit files unless explicitly asked.

Steps:

1. Read the repo entrypoints and local instructions.
2. Discover command, setup, test, CI, docs, plan, and generated-file surfaces.
3. Run `harness_snapshot.py` if it will reduce manual discovery.
4. Read [assessment-lenses.md](references/assessment-lenses.md).
5. Report strengths first, then prioritized gaps.

Output:

- Repo operating map.
- Existing strengths.
- Findings by priority.
- For each finding: evidence, risk, recommended control surface, smallest useful
  change, and validation signal.
- Open questions only when they block safe action.

### prepare

Use when starting or structuring a long, multi-step, multi-agent,
browser-facing, or resumable task.

Steps:

1. Read the user objective, repo instructions, existing plans, command surfaces,
   validation surfaces, and relevant source maps.
2. Read [task-state.md](references/task-state.md).
3. Reuse the repo's existing plan or ledger location. If none exists, propose a
   non-durable task file under `.plans/`.
4. Create or update task state with objective, constraints, non-goals, approval
   gates, command map, verification map, acceptance criteria, progress,
   blockers, and next step.
5. If implementation is also requested, summarize the prepared state before
   making code or control changes.

Output:

- Task-state path or proposed path.
- Objective and acceptance criteria.
- Command and verification maps.
- Current progress and next step.
- Known risks, blockers, and approval gates.

### control

Use when the user selects a harness improvement, asks to codify a repo lesson,
requests an `AGENTS.md` patch, wants a command map/setup script/check, or asks
to fix a harness gap.

Steps:

1. Anchor to the selected finding, lesson, or requested control.
2. Read [codex-thread-evidence.md](references/codex-thread-evidence.md) first
   if the control depends on prior thread or memory evidence.
3. Read [control-matrix.md](references/control-matrix.md).
4. Choose the narrowest durable surface that reaches future agents.
5. Prefer mechanical controls for repeated or checkable failures.
6. Propose first unless the user already asked for edits.
7. Edit the source-of-truth surface, not generated copies.
8. Run the cheapest reliable deterministic validation.
9. Report changed files, validation, remaining risk, and any follow-up control
   that should stay separate.

Output:

- Control chosen and why.
- Files changed or exact patch proposed.
- Validation run and result.
- Remaining unguarded failure modes.
- Clear stop point.

## Operating Rules

- Preserve requested depth: assessment and proposal are not approval to edit.
- Start from local repo conventions; do not impose a generic structure.
- Keep root `AGENTS.md` map-like: source/generated boundaries, required
  commands, approval gates, and links to deeper truth.
- Put subtree-specific instructions in the closest applicable instruction file.
- Put human setup and workflow detail in README, CONTRIBUTING, docs, or
  runbooks.
- Put task-local state in the repo's existing plan/ledger location, or in
  ignored `.plans/` if no convention exists.
- Put deterministic failures in tests, linters, hooks, scripts, schema checks,
  generated-file checks, or CI.
- Do not invent commands, ports, package managers, CI jobs, browser routes, or
  generated-file workflows. Mark unverified guesses as candidates.
- Use Codex session evidence only to support repo-scoped controls. For broad
  pattern mining, personal preferences, memory updates, global instructions, or
  skill changes, route to `self-improve`.
- Ask before external writes, destructive edits, publishing, installing
  dependencies, syncing config targets, editing global/user instructions, or
  leaving long-running services active.
- If validation is skipped, state why and what exact check should be run later.

## Completion Check

Before finishing, confirm:

- The chosen control is repo-scoped.
- The control has one source of truth.
- Root instructions remain short and navigational.
- Repeated or checkable failures have a mechanical guard when practical.
- Links and referenced paths are valid or clearly marked proposed.
- Validation evidence is reported.
