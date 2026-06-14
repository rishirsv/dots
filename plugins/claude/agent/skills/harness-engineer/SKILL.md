---
name: harness-engineer
description: "Use when assessing a repository or project for agent-readiness and harness-engineering opportunities, then planning or executing improvements such as repo maps, command maps, validation harnesses, progress ledgers, feedback loops, observability, AGENTS.md routing, setup/init scripts, browser/dev-server checks, or codifying repeated mistakes into durable controls; not for ordinary implementation, local-only commits, PR publication, skill authoring, or broad docs cleanup."
---

# Harness Engineer

Assess the harness around a project, then help improve it when the user wants
action. A good run identifies where agents still need human handholding, maps
the target harness state, and turns selected opportunities into plans, docs,
scripts, tests, or instruction updates.

## References

- Read [assessment-lenses.md](references/assessment-lenses.md) before broad repo
  or project assessment.
- Read [control-taxonomy.md](references/control-taxonomy.md) when deciding
  whether a finding belongs in instructions, docs, scripts, tests, hooks,
  review, or another control surface.
- Read [long-running-state.md](references/long-running-state.md) for init,
  audit, progress-ledger, resumability, browser/dev-server, and acceptance
  criteria patterns.
- Read [downstream-artifacts.md](references/downstream-artifacts.md) before
  creating a follow-up plan, architecture map, command map, AGENTS.md patch, or
  implementation sequence from an assessment.
- Read [codify-lessons.md](references/codify-lessons.md) when the user says a
  mistake should be remembered, codified, added to `AGENTS.md`, or prevented for
  future agents.

## Runtime Assets

- Use [assessment-report-template.md](assets/assessment-report-template.md) as
  the default report shape for broad assessments when the repo has no stronger
  local format.
- Use [harness-plan-template.md](assets/harness-plan-template.md) as the default
  shape for an execution plan or focused audit when the repo has no stronger
  local format.
- Use [progress-ledger-template.md](assets/progress-ledger-template.md) when a
  task needs resumable state and the repo has no existing ledger format.

## Scripts

- Run `python3 scripts/harness_snapshot.py --root <repo>` during assess, init,
  or audit when command, instruction, planning, CI, test, language-tooling, or
  browser-tooling discovery would reduce guesswork. The script prints a
  Markdown snapshot; a nonzero exit means the root path was invalid or
  unreadable.
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

Default to `assess` when the user asks whether a repo is agent-ready, asks for
harness engineering generally, or has not named a concrete edit. Use execution
modes when the user asks to build, apply, implement, repair, or codify a
specific harness improvement.

| Mode | Use when | Output |
|---|---|---|
| `assess` | Reviewing a repo/project for agent-readiness, harness opportunities, strengths, and gaps. | Assessment report with current state, target state, evidence, priority bands, and downstream options. |
| `init` | Starting a substantial task, setting up a new repo track, or preparing future agents before implementation. | Harness plan, command map, verification map, progress location, acceptance criteria, and open decisions. |
| `audit` | Inspecting an existing harness surface, plan, docs set, command map, or validation loop for stale or weak controls. | Findings ordered by impact, with evidence and recommended control changes. |
| `execute` | User selected an assessment opportunity or asked to implement harness improvements. | Smallest useful patch or plan-backed change, with validation evidence. |
| `codify` | A mistake, review comment, repeated failure, or user correction should become durable. | Routing decision: instruction, doc, skill, script/test/hook, memory, plan, or no durable change. |

If a prompt includes multiple modes, sequence them as `assess -> init/audit ->
execute/codify`. Keep assessment and execution visibly separate so the user can
approve scope before durable changes.

## Operating Rules

- Preserve the user's requested depth. If the user asks for an assessment,
  report, audit, or proposal, do not edit source files unless they explicitly
  ask for execution.
- Start with existing strengths as well as gaps. Future agents need to preserve
  harnesses that already work.
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

## Assess Workflow

1. Read the repo entry surfaces first: instructions, README, package/workspace
   files, docs indexes, architecture docs, planning docs, CI config, scripts,
   tests, and any local agent/skill/plugin guidance.
2. Run `scripts/harness_snapshot.py` when it would speed up the initial map.
3. If the assessment is broad and subagents are available and appropriate, split
   read-mostly slices by repo knowledge, runtime/validation, architecture
   boundaries, agent workflow, or entropy control. Give each subagent a narrow
   slice and ask for evidence, opportunities, non-opportunities, and confidence.
4. Read [assessment-lenses.md](references/assessment-lenses.md). Compare current
   state to target harness state for each meaningful opportunity.
5. Produce the assessment using the repo's report convention or the template.
   Include:
   - executive summary
   - repo map
   - existing harness strengths
   - current readiness across the main lenses
   - highest-leverage opportunities with priority bands
   - future-state harness architecture
   - recommended next artifacts
   - agent handoff notes, inspected commands, areas not inspected, and open
     questions
6. Stop after the report unless the user asked for execution. Offer the most
   useful next artifact or implementation grain.

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

1. Inspect the existing instruction, docs, scripts, tests, CI, plan, progress,
   runtime evidence, or control surface named by the user.
2. Run `scripts/harness_snapshot.py` if the command or verification map is not
   obvious. Run `scripts/check_harness_links.py` when stale Markdown links are a
   plausible risk.
3. Evaluate the surface with [assessment-lenses.md](references/assessment-lenses.md),
   [control-taxonomy.md](references/control-taxonomy.md), and
   [long-running-state.md](references/long-running-state.md).
4. Report findings in priority order:
   - evidence: file, command, or observed gap
   - risk: what future agents may get wrong
   - target harness state
   - recommended control: docs, instructions, plan, script, test, hook, CI,
     review, or no change
   - write gate: whether user approval is needed before applying it
5. Include existing strengths and a positive-null result when the harness is
   adequate for the requested task. Do not manufacture findings.

## Execute Workflow

1. Anchor execution to an assessment opportunity, user-selected artifact, or
   specific harness gap. If none exists, perform a focused assess or init pass
   before editing.
2. Read [downstream-artifacts.md](references/downstream-artifacts.md) and choose
   the smallest useful artifact or patch:
   - plan or progress ledger
   - command map or setup/init script
   - architecture map or docs pointer
   - AGENTS.md routing update
   - validation script, test, hook, linter, or CI check
   - browser/dev-server check documentation
3. Edit source-of-truth files, not generated copies, unless the repo's build
   process requires generated outputs after source edits.
4. Run targeted validation:
   - link check for Markdown
   - syntax/smoke test for new scripts
   - repo-specific validation from the command map
   - sync/build command required by local instructions
5. Report changed controls, validation evidence, remaining manual checks, and
   any follow-up that should become a separate plan or PR.

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
- Assessment findings include strengths, current state, target state, evidence,
  priority, and downstream options.
- Execution changes trace back to an assessment finding, user-selected artifact,
  or specific harness gap.
- Artifact paths follow discovered repo conventions or are presented as
  proposals.
- Commands and checks are sourced from files or clearly marked as unknown.
- Durable lessons are routed to the right control surface.
- Any scripts run are reported with their outcome.
- External writes, destructive actions, syncs, installs, publishes, and commits
  were not performed without explicit approval.
