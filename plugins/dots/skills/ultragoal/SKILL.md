---
name: ultragoal
description: "Designs and runs durable Codex goals for long-running objectives that need persistence, recovery, verifiers, approval gates, and completion proof. Explicit-only skill invoked via ultragoal, or a request to set, start, activate, review, or manage a goal; not for one-off tasks or ordinary planning, which belong to ultraplan."
---

# Ultra-Goal

Design and run durable Codex goals for objectives that need persistence,
recovery, iteration, and proof. A good goal has an observable finish line, a
verifier that can fail, and durable state Codex can recover after
interruptions.

Do not activate a goal from vague planning language. Activate only when the
user explicitly asks to start, set, activate, create, or run a goal.

## Modes

- **Design:** research and return a goal brief. Do not call `create_goal`.
- **Critique:** inspect an existing goal or draft and tighten it against the
  quality bar below.
- **Activate:** design and critique the goal, then call `create_goal` as the
  final step.
- **Review/Resume:** the user asks to review, check on, or continue goals. See
  Reviewing Goals below.

When the user explicitly invokes this skill for a concrete work objective and
asks Codex to build, complete, run, pursue, or "do it," treat the request as
Activate by default. Stay in Design only when the user asks to draft, discuss,
or critique a goal without starting it.

## Quality Bar

Before activation, the objective and durable state must answer:

- **Done state:** what concrete thing will be true when the goal is complete.
- **Evidence:** what command, artifact, screenshot, workflow, metric, or
  readback proves completion.
- **Threshold:** what binary or quantitative bar separates success from
  partial progress.
- **Scope bounds:** what files, systems, surfaces, or decisions are in and
  out.
- **Stop condition:** when Codex should stop and ask instead of continuing.

Reject or rewrite goals like "make progress," "improve X," or "keep
investigating" unless sharpened into a verifiable end state. Call `get_goal`
before `create_goal` so Codex does not create a duplicate or conflicting goal;
if an active goal already matches the intent, continue from it instead.

## Durable State

Keep the active goal objective short and put durable operating state under the
current workspace or project root:

- `.agents/goals/<slug>/goal.md`: stable finish line, baseline, constraints,
  non-goals, primary verifier, completion proof, and blocker criteria.
- `.agents/goals/<slug>/progress.md`: living log of attempts, evidence,
  status, and next action.

`goal.md` is the stable contract; `progress.md` is the mutable execution log.
Do not duplicate content between them. Derive `<slug>` once as a short
kebab-case name and reuse it when resuming or steering the same goal. This
split is what lets a durable goal survive Codex's ~4,000-character objective
cap.

## Verification And Anti-Cheating

Name the primary verifier — the strongest independent check of success on the
surface where the outcome actually matters — and the exact completion proof
before activating. If success depends on rendered UI, browser or app state,
or another real surface, verify there directly (see
[visual-proof](../../references/visual-proof.md)); never accept Codex's
self-report as evidence.

Never weaken a verifier, benchmark, or scope to make a goal pass. Name any
irreversible, public, shared, or costly action as needing separate user
approval before Codex takes it.

## Activate

Write or update the durable state files, call `get_goal`, then call
`create_goal` only when no active goal already covers the same objective.
`create_goal` is the final action of activation; do not call it early, and do
not merely say a goal should be set.

Use a compact objective:

```text
Complete and verify the objective in <workspace>/.agents/goals/<slug>/goal.md
by executing and maintaining <workspace>/.agents/goals/<slug>/progress.md.
Read and maintain both files throughout the work.
```

After `create_goal`, report a compact summary: fit, exact objective,
verifier, and activation state.

## Reviewing Goals

When the user asks to review goals or resumes work, enumerate active goals
via goal state and each goal's `progress.md`. Classify each as progressing,
blocked-needs-decision, or stale-close-it. Drive exactly one goal to a next
action rather than surveying all of them. Keep `progress.md` current as work
happens, and mark a goal complete only when the stated completion proof in
`goal.md` is actually satisfied.
