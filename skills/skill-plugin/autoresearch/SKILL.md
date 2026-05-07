---
name: autoresearch
description: Use when a concrete task has a real verifier and you want a bounded baseline, verify, and keep-or-discard loop instead of unstructured iteration.
---

# Autoresearch

Run a verified task loop.

Default to the fastest honest path. Open a deeper loop only when the task earns it.

## Reference Files

Read these files only when they are needed:

| File | When to read it |
|---|---|
| [references/task-fit-rubric.md](references/task-fit-rubric.md) | Read before deciding whether the task should enter an autoresearch loop at all. |
| [references/core-loop.md](references/core-loop.md) | Read before starting the first baseline run. |
| [references/verify-design.md](references/verify-design.md) | Read before defining metrics, binary checks, or composite completion checks. |
| [references/guard-patterns.md](references/guard-patterns.md) | Read when a task needs safety rails or regression protection. |
| [references/stop-rules.md](references/stop-rules.md) | Read when deciding whether to continue, stop, or summarize a plateau. |
| [references/run-review.md](references/run-review.md) | Read when the user wants a visual review surface for recent benchmark runs or needs to refresh the static site. |
| [assets/session-template.md](assets/session-template.md) | Copy into `.autoresearch/session.md` when the task needs a persistent loop. |
| [assets/verify-template.md](assets/verify-template.md) | Copy into `.autoresearch/verify.md` during setup. |
| [assets/config-template.json](assets/config-template.json) | Copy into `.autoresearch/config.json` during setup. |

## Core Rules

- Start by deciding whether the task fits autoresearch.
- Refuse to force a loop onto a task with no honest verification path.
- Collect the goal, output path, primary verifier, and stop condition before changing anything.
- Default to fast mode when the task is one artifact plus one clear verifier.
- Escalate to deep mode only after a failed fast pass, ambiguous verification, meaningful guard risk, or explicit user request.
- Use git as memory when the task lives in a git repo.
- Make one focused change per iteration.
- Keep the success contract stable once the baseline is established.
- Use guards for regression prevention, not as a replacement for the main objective.
- Store generated session state in the target project, not in this skill bundle.
- Stop once the verified result is good enough, blocked, or plateaued.

## Workflow

### Phase 1: Fit And Mode

1. Confirm the task has a concrete outcome, bounded scope, and a real verification path. Use [references/task-fit-rubric.md](references/task-fit-rubric.md) when fit is unclear.
2. Write down:
   - the goal
   - the output path or final artifact
   - the in-scope and out-of-scope surfaces
   - the primary verifier
   - any guards
   - the stop condition
3. Pick mode:
   - `fast`: one implementation pass plus verification
   - `deep`: `.autoresearch/`, baseline, iterations, and guards
4. If the task is a poor fit, route it toward research, planning, review, or direct implementation instead.

### Phase 2: Fast Path

1. Do the task once.
2. Run the primary verifier.
3. If it passes and no new guard risk appears, stop with a concise summary.
4. If it fails, is ambiguous, or needs multi-step tuning, escalate to deep mode.

### Phase 3: Deep Setup

1. Create `.autoresearch/` only now.
2. Copy:
   - [assets/session-template.md](assets/session-template.md) -> `.autoresearch/session.md`
   - [assets/verify-template.md](assets/verify-template.md) -> `.autoresearch/verify.md`
   - [assets/config-template.json](assets/config-template.json) -> `.autoresearch/config.json`
3. If git is available, record the branch and current commit, then read recent `git log` and the last relevant diff.
4. Establish a baseline before making another change.

### Phase 4: Iterate

For each iteration:

1. Read `.autoresearch/session.md`, `.autoresearch/verify.md`, recent results, and recent git history.
2. Pick one next move.
3. Make one bounded change.
4. Run the primary verification path.
5. If the task did not improve or complete, revert or discard and log the lesson.
6. If the task improved, run guard checks.
7. Keep the change only if the guards still pass.
8. Log the result and update the working theory in `session.md`.
9. Default cap: stop after 2 serious iterations unless the user explicitly asks for deeper exploration or the evidence says one more pass is clearly worthwhile.

### Phase 5: Finish

1. Stop when the task is complete, blocked, or plateaued under [references/stop-rules.md](references/stop-rules.md).
2. Write a short final summary with:
   - what changed
   - what verification proved
   - what remains risky or blocked
3. If the user wants a visual review surface for benchmarked runs, refresh the static run-review site using [references/run-review.md](references/run-review.md).

## Sub-Agent Guidance

Use sub-agents only when they materially improve coverage.

Good roles:

- `context scout`
- `verify designer`
- `independent reviewer`
- `sidecar implementor` for disjoint non-blocking work

Do not delegate the final keep or discard call for every iteration.

## Anti-Patterns

- Starting the loop before the verify path is real.
- Opening a deep loop for a simple one-pass task.
- Rewriting the success contract every time the current idea loses.
- Running forever by default.
- Making several unrelated edits in one pass.
- Keeping a win that breaks a guard.
- Routing every hard task into autoresearch even when another skill is the better fit.
