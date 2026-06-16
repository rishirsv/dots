# Ultraplan Budget Rules

Use the smallest mode that preserves the core promise: upgrade the plan only
after repo-grounded critique and refutation.

## Modes

| Mode | Agents | Use when | Default caps |
|---|---:|---|---|
| `Lean Ultraplan` | 0-1 | Most explicit Ultraplan requests, normal repo plans, medium changes where one context can hold the plan and evidence. | Raise up to 8 findings, verify top 3-5, synthesize one re-scope. |
| `Focused Ultraplan` | 2-3 | Cross-module or risky plans where independent challenge is useful but full fan-out is too expensive. | Mapper/critic, verifier, optional designer; verify up to 5 findings. |
| `Full Ultraplan` | many | Broad architecture refactors, high-risk backend/API/infra migrations, toolchain/SDK shifts, or expensive plans with many independent facts. | Full six-lens critique, per-finding verify, three designs, judge. |
| `Dry-run map` | 0 | The user wants likely risk/fan-out before upgrading. | Map assumptions and recommended mode only. |

## Scaling Heuristics

- The number of independent facts to check sets the budget, not plan length.
- If one context can hold the plan and repo evidence, stay Lean.
- If the plan touches 1-2 files and the answer is obvious, explain that
  Ultraplan is overkill and either run a dry map or act outside this skill.
- Escalate to Focused when a second reader would likely catch a real blind spot:
  module boundary changes, unfamiliar ownership, toolchain changes, persisted
  data, or unclear testability.
- Escalate to Full only when a bad plan would waste substantial implementation
  time or create release, data, API, or architecture risk.

## Lean Defaults

1. Ground the plan with targeted `rg`, file reads, git, tests, and docs.
2. Run one bundled critique across all six lenses.
3. Select only the strongest plan-changing findings before verification.
4. Verify blocking/high findings first; skip low findings unless they change the
   plan materially.
5. Use a fresh verification pass: re-read files and re-run commands instead of
   trusting the critique notes.
6. Default to `minimal-correct` with `reuse-maximal` pressure.
7. Produce one upgraded plan and one changelog. Do not include raw transcripts or
   losing alternatives in the plan body.

## Escalation Signals

Escalate when the Lean pass finds:

- multiple plausible blockers from different repo areas
- a false done-state that changes the first implementation step
- a version, SDK, migration, schema, or dependency posture that must be settled
- a proposed move across layers with transitive references to trace
- several "implement X" steps where existing owners may already exist
- verification commands that fail before testing the actual behavior
- product, privacy, release, or ownership decisions that the repo cannot answer

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
- Refutable finding: a plausible critique is wrong. Verification must exclude
  it from plan edits and record it as refuted.
- Answerable-by-code question: if `rg`, file reads, git, tests, or docs can
  answer it, the pass must not ask the user.
- No-op honesty: a mostly correct plan should produce few or no confirmed
  findings instead of manufactured work.
