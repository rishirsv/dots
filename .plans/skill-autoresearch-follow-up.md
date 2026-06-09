# Skill Autoresearch Follow-Up Plan

## Purpose

Capture the future `skill-autoresearch` worker shape without building it in the
eval workbench V1. Autoresearch should generate candidate branches, evaluate
them with the existing suite model, and propose a gated winner for human
approval.

The user-facing model stays consultant-friendly:

```text
Try improvements -> watch progress -> see best gated result -> approve
```

## Locked Dependencies

Autoresearch depends on the eval workbench authoring model:

- `.meta-skill/evals.json` owns all metadata.
- `cases/<case-id>/task.md` contains visible solver bytes only.
- case folders hold hidden rubric, expected output, and validator content.
- candidates are branch/worktree-backed.
- trials are individual case/candidate executions.
- `runs/<run-id>/` owns progress, events, results, grades, and candidate output
  artifacts.

## Workflow

1. Read `evals.json`.
2. Select train/dev cases for editing feedback.
3. Hold out validation/test cases the editor child does not see.
4. Create a candidate branch and worktree, such as
   `meta-skill/<suite-id>/attempt-1`.
5. Ask an editor child to make the smallest candidate edit inside that worktree.
6. Compute `payload_digest` from the staged `skill/` payload tree.
7. Run candidate trials with `codex_exec`.
8. Store raw per-trial streams under `runs/<run-id>/events/<trial-id>.jsonl`.
9. Derive compact status into `runs/<run-id>/progress.jsonl`.
10. Grade trial outputs with code validators, model judges, and human labels
    where available.
11. Evaluate promising candidates on held-out splits.
12. Reject candidates that fail deterministic gates, regressions, or held-out
    performance.
13. Present the gated-best candidate as an improvement proposal.
14. Apply or merge only after human approval.

## Gates

Best result means gated best, not raw-highest score.

A candidate may be proposed only when:

- deterministic checks pass
- held-out split performance is acceptable
- no required regression gate fails
- the candidate changed the payload when a change was expected
- source changes are contained to the approved candidate branch/worktree
- human approval is present before applying to source

## Data Model Notes

Do not add a top-level `.meta-skill/candidates/` registry for V1. Autoresearch
can create candidate branches and record candidate performance in each run.

Use these fields in `run.json`:

```json
{
  "candidate": "attempt-1",
  "display": "Attempt 1",
  "branch": "meta-skill/client-email/attempt-1",
  "commit": "abc123",
  "worktree": "/Users/rishi/.codex/worktrees/...",
  "payload_digest": "sha256:..."
}
```

Use `trial_id` for one execution:

```text
client-email.attempt-1.t3
```

`runs/<run-id>/candidates/<candidate>/` stores output artifacts only. It must not
store source copies.

## Runner Notes

Default to `codex_exec` for autoresearch trials. Use `docs/codex-exec/README.md`
and `docs/codex-exec/json-events.md` before implementation.

- Use `--json` for per-trial event streams.
- Use `--output-last-message <file>` for solver outputs.
- Do not use `--output-schema` for solver trials.
- Use `--output-schema` for judge children and editor/reporting children.
- Use `--ephemeral` only when resume or check-in history is not needed.

## Non-Goals

- No frontier dashboard in V1.
- No remote sandbox orchestration in V1.
- No automatic source application.
- No candidate version registry separate from git branches and run records.
- No metadata outside `evals.json`.
