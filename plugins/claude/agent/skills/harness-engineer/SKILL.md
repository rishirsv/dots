---
name: harness-engineer
description: "Use when the user asks to prepare, audit, or improve the scaffolding for long-running agent work: repo command maps, verification maps, setup/init scripts, progress ledgers, acceptance criteria, browser/dev-server checks, or codifying repeated mistakes into durable controls; not for ordinary implementation, local-only commits, PR publication, skill authoring, or broad docs cleanup."
---

# Harness Engineer

Build or improve the harness around a coding task so agents can work, pause,
resume, verify, and learn from mistakes without losing the plot.

## References

- Read [control-taxonomy.md](references/control-taxonomy.md) when deciding
  whether a finding belongs in instructions, docs, scripts, tests, hooks,
  review, or another control surface.
- Read [long-running-state.md](references/long-running-state.md) for init,
  audit, progress-ledger, resumability, browser/dev-server, and acceptance
  criteria patterns.
- Read [codify-lessons.md](references/codify-lessons.md) when the user says a
  mistake should be remembered, codified, added to `AGENTS.md`, or prevented for
  future agents.

## Runtime Assets

- Use [harness-plan-template.md](assets/harness-plan-template.md) as the default
  shape for a harness plan or audit when the repo has no stronger local format.
- Use [progress-ledger-template.md](assets/progress-ledger-template.md) when a
  task needs resumable state and the repo has no existing ledger format.

## Scripts

- Run `python3 scripts/harness_snapshot.py --root <repo>` during init or audit
  when command, instruction, planning, CI, test, or browser-tooling discovery
  would reduce guesswork. The script prints a Markdown snapshot; a nonzero exit
  means the root path was invalid or unreadable.
- Run `python3 scripts/check_harness_links.py <files...>` after editing harness
  docs, plans, ledgers, or instruction files. With no file arguments, it scans
  common Markdown surfaces in the current repo. Exit code `1` means at least one
  local link target is missing.

Resolve `scripts/...` paths relative to this skill directory, not the target
repository. If the runtime exposes the installed skill path differently, locate
the script in the `harness-engineer/scripts/` payload and run it from there.

Treat script output as evidence to inspect, not as the final answer. If a script
misses a repo-specific command or convention, prefer the repo's actual files.

## Modes

Use the mode that matches the user's intent. If the prompt includes more than
one mode, sequence them in the order below.

| Mode | Use when | Output |
|---|---|---|
| `init` | Starting a substantial task, setting up a new repo track, or preparing future agents before implementation. | Harness plan, command map, verification map, progress location, acceptance criteria, and open decisions. |
| `audit` | Reviewing an existing repo or task harness for stale, missing, or weak controls. | Findings ordered by impact, with evidence and recommended control changes. |
| `codify` | A mistake, review comment, repeated failure, or user correction should become durable. | Routing decision: instruction, doc, skill, script/test/hook, memory, plan, or no durable change. |

## Operating Rules

- Preserve the user's requested mode. If the user asks for planning, audit, or a
  proposal, do not edit source files unless they explicitly ask.
- Discover local conventions before choosing artifact paths. Prefer an existing
  plan, docs, progress, or task folder when the repo clearly has one; otherwise
  propose a conventional location such as `.plans/` without treating it as
  universal.
- Keep `AGENTS.md` and similar entrypoint instruction files map-like. Put detail
  in the closest durable source of truth when detail would make the entrypoint
  stale or noisy.
- Prefer mechanical controls for repeatable failures. If a rule can be enforced
  by a test, hook, linter, script, typecheck, CI job, or link check, recommend
  that before adding more prose.
- Ask before external writes, destructive edits, publishing, installing,
  syncing, changing global/user-level instructions, or starting long-running
  services that may affect the user's machine.
- Do not invent commands, ports, setup steps, CI jobs, or browser checks. Mark
  unknowns as open decisions or verify them from files.

## Init Workflow

1. Read the user's goal, repo instructions, README or equivalent entry docs,
   existing plans, package/tool config, CI config, and any task-specific files
   the user named.
2. Run `scripts/harness_snapshot.py` when the repo is large, unfamiliar, or has
   unclear commands.
3. Identify the artifact location by convention:
   - existing `.plans/`, `plans/`, `docs/plans/`, or task docs
   - existing progress or status files near the task
   - user-specified path
   - otherwise propose a lightweight plan path and ask only if writing there
     would matter
4. Produce a harness plan using the template or the repo's format. Include:
   - task objective and non-goals
   - repo constraints and instruction surfaces
   - command map for setup, lint, test, build, typecheck, dev server, and CI
   - verification map with cheap checks first and deeper checks for risky paths
   - browser/dev-server checks for UI work, including how to confirm a rendered
     screen is nonblank and correctly framed
   - acceptance criteria stated as observable outcomes
   - progress ledger location and update cadence
   - handoff notes for future agents
   - open decisions and missing evidence
5. If implementation will start in the same turn, tell the user the harness
   summary first, then proceed only within the requested scope.

## Audit Workflow

1. Inspect the existing instruction, docs, scripts, tests, CI, plan, and progress
   surfaces.
2. Run `scripts/harness_snapshot.py` if the command or verification map is not
   obvious. Run `scripts/check_harness_links.py` when stale Markdown links are a
   plausible risk.
3. Evaluate the harness with [control-taxonomy.md](references/control-taxonomy.md)
   and [long-running-state.md](references/long-running-state.md).
4. Report findings in priority order:
   - evidence: file, command, or observed gap
   - risk: what future agents may get wrong
   - recommended control: docs, instructions, plan, script, test, hook, CI,
     review, or no change
   - write gate: whether user approval is needed before applying it
5. Include a positive-null result when the harness is adequate for the requested
   task. Do not manufacture findings.

## Codify Workflow

1. Restate the lesson narrowly: what failed, when it applies, and what future
   behavior should change.
2. Read [codify-lessons.md](references/codify-lessons.md) and choose the least
   noisy durable surface:
   - instruction entrypoint for repo-wide agent behavior
   - nested instruction file for a subtree-local rule
   - README or docs for human-facing setup and workflow knowledge
   - skill guidance for portable recurring agent behavior
   - script, test, hook, linter, typecheck, or CI for enforceable checks
   - plan or progress ledger for task-local state
   - memory only for stable user preference or cross-repo personal context
   - no durable change for one-off, obsolete, or already-covered failures
3. Check for conflicts, stale instructions, and overbroad wording before
   proposing text.
4. If editing is approved, make the smallest durable change and run any relevant
   deterministic checks, including link checks for Markdown.
5. Report what changed, why that surface was chosen, and what remains unguarded.

## Completion Check

Before final delivery, confirm:

- The mode matched the user's request.
- Artifact paths follow discovered repo conventions or are presented as
  proposals.
- Commands and checks are sourced from files or clearly marked as unknown.
- Durable lessons are routed to the right control surface.
- Any scripts run are reported with their outcome.
- External writes, destructive actions, syncs, installs, publishes, and commits
  were not performed without explicit approval.
