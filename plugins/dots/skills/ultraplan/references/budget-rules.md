# Ultraplan Escalation Ladder

Ultraplan always produces a plan. This file sets how much rigor that takes: the
rung ladder, the gates that promote a run, and the caps that keep it bounded.
Use the smallest rung that preserves the core promise — a grounded, verified
plan — and let the promotion gates raise it when evidence demands.

## Rungs

Each rung is a strict superset of the one below. Higher rungs add independence
(separate agents instead of parent self-critique) and iterations (re-critique
the revised plan).

| Rung | Subagents | Loop | Use when |
|---|---:|---|---|
| `L0 Quick` | 0 | 1 self pass | Bare "plan this" on a small, clear task. Parent drafts, self-critiques against the lenses, verifies, and revises. |
| `L1 Grounded` | 1 (Researcher) | 1 pass | A knowledge gap materially changes the plan and independent grounding helps. Parent still drafts and self-critiques. |
| `L2 Stress-tested` | 1 (Critic) + parent Verifier; Researcher optional | 1 verified round | Explicit "ultra/deep/stress-test", or a non-trivial / higher-risk task. |
| `L3 Ultra` | Researcher + multiple diverse-lens Critics | Iterate until dry (round cap) | Explicit deep/ultra AND high-risk work. High-severity findings get multi-vote refutation. |

The parent/orchestrator never counts as a subagent. `L3` uses diverse-lens
critics (each owns a lens family) rather than identical critics.

## Setting the Entry Rung

Rung is set by **invocation verb AND task risk**, whichever is higher:

- Bare "plan this" -> `L0`, or `L1` when grounding is large.
- "ultra / ultra-plan / deeply plan / stress-test" -> floor of `L2`.
- High-risk work (shipping, schema/version, cross-module, irreversible) ->
  `L2`/`L3` regardless of verb.

Entry shape does not change the rung: a `New plan` and an `Existing plan` upgrade
both ride the same ladder.

## Promotion Gates

A run may raise its own rung mid-pass; it **never lowers it**. Promote and log
the trigger when:

- a confirmed *blocking* finding survives verification -> add a round (or a
  Critic), i.e. `L2` -> `L3` behavior;
- verification reveals cross-module ownership or competing plan shapes -> add a
  Rescope Designer;
- a task assumed trivial turns out entangled during grounding -> `L0` -> `L1`+;
- the active rung cannot resolve a confirmed finding within its loop -> escalate
  rather than ship it unaddressed.

Never downgrade below the explicit invocation signal. Every promotion is named
in the handoff with its triggering gate.

## Caps

So a run always terminates:

- Never exceed the `L3` topology: Researcher + diverse-lens Critics + optional
  Rescope Designer + parent Verifier.
- Round cap at `L3`: if the loop has not converged (zero new confirmed findings)
  by the cap, ship the best plan and name the unresolved tension as an open
  decision. Do not loop indefinitely.
- If no subagent mechanism exists, run the same roles sequentially in the parent
  and state that independence was reduced. Do not invent a multi-agent run.

## Scaling Heuristics

- The number of independent facts and competing plan shapes sets the rung, not
  plan length.
- If the task touches one or two files and the answer is obvious, stay at `L0`
  and say a heavier pass is overkill — but still produce the plan.
- Add a Critic when there is a draft worth attacking; add a second/third
  diverse-lens Critic only when breadth of failure modes justifies it.
- Add the Rescope Designer only when verified findings point to genuinely
  competing designs, cross-module ownership, or a serious overengineering
  collapse.

## Required Review Pressure

Every rung looks for:

- false or stale premises
- missing preconditions and sequencing gaps
- reuse traps where the plan builds what already exists (code lens set)
- ownership or layering violations (code lens set)
- missing producer/consumer pairs (code lens set)
- verification commands that do not prove behavior
- unneeded version, SDK, dependency, schema, or toolchain changes
- overengineering: abstractions, shims, frameworks, or broad refactors not
  required by the current goal

## Self-Check

Before handing off, confirm none of these failure modes slipped through:

- Always a plan: the run yielded a plan or upgraded plan, not an answer-only
  reply. Pure research/explanation belongs in another skill.
- No downgrade: an explicit "ultra/stress-test" invocation did not run below
  `L2`.
- Auto-promotion: a confirmed blocking finding at `L2` adds a round rather than
  shipping the plan unchanged, and the promotion is logged.
- False precondition: a plan says work has landed; evidence shows it has not. The
  plan must add an owning step.
- Reuse trap: a plan says "implement X"; a working owner exists. The plan must
  say "reuse" or "surface" that owner.
- Beta or unneeded dependency: a plan bumps a toolchain or SDK. The pass checks
  both availability and whether the feature truly requires it.
- Hidden coupling: a plan moves a file down a layer. The pass traces transitive
  references, not only imports in the moved file.
- Overengineering: a plan adds an abstraction, shim, generic schema, or broad
  refactor without a current producer, consumer, and proof path. The plan must
  remove, defer, or narrow it.
- Refutable finding: a plausible critique is wrong. Verification excludes it from
  plan edits and records it as refuted.
- Answerable-by-code question: if search, file reads, git, tests, or docs can
  answer it, the pass must not ask the user.
- No-op honesty: a mostly correct plan produces few or no confirmed findings
  instead of manufactured work.
