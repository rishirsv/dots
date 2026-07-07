# One-Off Skill Checks

Read this when a Meta-Skill lane needs one inspectable prompt check of a skill
draft, source-derived skill, or proposed edit.

Use the evaluator CLI for behavioral evidence. Use child threads and subagents
for reading, research, and repair work; do not treat their outputs as eval
trials or measured skill behavior.

## Primary Path

Run a one-off check through the eval runner:

```sh
<meta-skill-root>/scripts/metaskill eval run --adhoc --task "<realistic prompt>" --skill <skill-dir> --json
```

An adhoc run uses the same staging and freezing pipeline as suite runs. It
creates run artifacts, records the run as adhoc, and leaves the verdict
`ungraded` because no graders are declared.

Promote a useful adhoc check by copying its case folder into
`.<skill-name>/cases/` and adding the case, graders, and expectations to
`evals.json`.

## When To Escalate

| User intent | Route |
|---|---|
| "Try this prompt once" | `eval run --adhoc` |
| "Try these few examples" | Create a tiny suite in `skill-evaluator` |
| "Optimize triggering" | `skill-evaluator` |
| "Benchmark it" or "track this over time" | `skill-benchmarker` |
| "Fix what failed" | `skill-doctor` |

Do not call an adhoc run release proof. It is one prompt, one candidate, and no
grader unless promoted into a suite.

## Natural Prompt Boundary

Use a prompt a real user would send. Do not include eval labels, candidate
labels, grader hints, expected answers, parent bookkeeping, or reporting
instructions in the measured prompt. If setup text is needed to make the task
possible, promote the case into a suite where setup, fixtures, and grader
metadata can stay outside `task.md`.

## Child Threads And Subagents

Use child threads or subagents for:

- reading source packs or long transcripts
- researching candidate causes
- trying a repair in an isolated worktree
- summarizing evidence for the parent

Do not use child-thread output as behavioral evidence. If a prompt result should
count, rerun it through `eval run --adhoc` or a proper suite so the runner
captures frozen inputs, evidence files, transcripts, and run metadata.

## Parent Flow

1. Pick one realistic prompt.
2. Run `eval run --adhoc`.
3. Inspect the run artifacts and classify the result as useful, failed,
   blocked, or too ambiguous.
4. Route source fixes to `skill-doctor`.
5. Promote the prompt to a suite case only when repeated or graded evidence is
   needed.

Keep the parent as the decision-maker. A one-off check is evidence for the next
step, not a release gate.
