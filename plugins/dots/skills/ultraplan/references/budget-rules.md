# Ultraplan Budget Rules

Use the smallest mode that preserves the core promise: repo-grounded planning
for new plans, and independent critique plus refutation for existing plans.

## Modes

| Mode | Subagents | Use when | Default caps |
|---|---:|---|---|
| `Standard Plan` | 0 | There is no existing plan to upgrade. | Main agent grounds, checks reuse, checks overengineering, and writes one plan. |
| `Standard Plan + Explorer` | 1 | No existing plan, but repo exploration is large enough that a separate read-only mapper will materially improve quality. | One read-only exploration brief; parent writes the plan. |
| `Capped Ultra Plan` | 2 | Existing plan needs upgrade, stress test, or deep review. | Mapper + adversarial reviewer; parent verifies and synthesizes. |
| `Capped Ultra Plan Plus` | 3 | Existing plan has verified findings that imply competing plan shapes or major overengineering risk. | Add one rescope designer; parent still validates and writes final artifacts. |
| `Dry Map` | 0-1 | The user wants likely risk/fan-out before upgrading. | Map assumptions, risks, and recommended route only. |

Do not use more than three subagents. The parent/orchestrator does not count as
a subagent.

## Scaling Heuristics

- Existing-plan upgrades default to two subagents because independence is the
  point of Ultra Plan.
- New-plan creation defaults to no subagents because there is no base artifact
  to adversarially compare.
- The number of independent facts and competing plan shapes sets the budget,
  not plan length.
- If the plan touches one or two files and the answer is obvious, explain that
  Ultraplan is overkill and either do a standard plan or a dry map.
- Add the third subagent only when verified findings point to genuinely
  competing designs, cross-module ownership, or a serious overengineering
  collapse/re-scope decision.
- If no subagent mechanism exists, run the same roles sequentially and state
  that independence was reduced. Do not invent a multi-agent run.

## Required Review Pressure

Every route should look for:

- false or stale premises
- missing preconditions and sequencing gaps
- reuse traps where the plan builds what already exists
- ownership or layering violations
- missing producer/consumer pairs
- verification commands that do not prove behavior
- unneeded version, SDK, dependency, schema, or toolchain changes
- overengineering: abstractions, shims, frameworks, or broad refactors not
  required by the current goal

## Black-Box Checks

Use these as smoke tests for future changes to the skill:

- False precondition: a plan says work has landed; repo evidence shows it has
  not. The upgraded plan must add an owning step.
- Reuse trap: a plan says "implement X"; repo has a working owner. The upgraded
  plan must say "reuse" or "surface" that owner.
- Beta or unneeded dependency: a plan bumps a toolchain or SDK. The pass must
  check both availability and whether the feature truly requires it.
- Hidden coupling: a plan moves a file down a layer. The pass must trace
  transitive references, not only imports in the moved file.
- Overengineering: a plan adds an abstraction, compatibility shim, generic
  schema, or broad refactor without a current producer, consumer, and proof
  path. The upgraded plan must remove, defer, or narrow it.
- Refutable finding: a plausible critique is wrong. Verification must exclude
  it from plan edits and record it as refuted.
- Answerable-by-code question: if search, file reads, git, tests, or docs can
  answer it, the pass must not ask the user.
- No-op honesty: a mostly correct plan should produce few or no confirmed
  findings instead of manufactured work.
