# Skill Trial Runs

Read this when a Meta-Skill lane needs an inspectable trial of a skill draft,
source-derived skill, or candidate improvement. A trial run is a bounded test of
realistic behavior. It may use a Codex child thread, a worktree-backed child
thread, or a local/manual run.

This is not the full evaluation process. Escalate to `skill-evaluator` when the
user needs multi-scenario measurement, baseline comparison, variance, trigger
optimization, or publish-readiness.

Terminology: in full evals, a **candidate** is the thing under test (`current`,
`attempt-1`), and a **trial** is one execution of one case under one candidate.
"Attempt 1" is user-facing display text for a candidate only. Do not use
`attempt_id` internally; use `trial_id` for one execution.

## User Experience

Offer testing in tiers:

| User intent | Use |
|---|---|
| "Just make the skill" | Build, lint, and validate locally. Offer a trial only when the skill is fragile or source-derived. |
| "Try it once", "test this prompt", or "run a sanity check" | Run one skill trial. |
| "Try these few examples" or "iterate until this feels right" | Run a small trial set and revise between iterations. |
| "Make sure this is good", "benchmark it", or "optimize triggering" | Route to `skill-evaluator`. |

Explain the lightweight path in user-facing language: "I can run a trial on one
realistic prompt in a separate worktree, then use the result as evidence before
changing the source skill."

Do not create, fork, or message Codex threads unless the user asked for testing,
iteration, a child thread, or a worktree-backed trial.

## Trial Types

### Quick Trial

Use when one realistic prompt can catch likely activation, resource, or
runtime-contract failures.

- Best for a new skill after deterministic checks pass.
- Best for `skill-doctor` when a candidate fix should be tried before parent-side
  edits are applied.
- Not release proof.

### Trial Set

Use when the user wants a small improvement loop but not a full evaluation.

- Pick 2-3 realistic prompts.
- Include should-trigger, near-miss, and one prompt that exercises the skill's
  main value.
- Run in child threads when independent execution matters; run serially when
  thread tooling is unavailable or the task is lightweight.
- Revise only for transferable failures.

### Full Evaluation

Route to `skill-evaluator` when the work needs multiple scenarios, baselines,
held-out prompts, variance, scoring, or description optimization.

## Prompt Selection

Prefer prompts a real user would say. Avoid toy prompts such as "use this skill"
or "read this file" unless the skill is actually about that tiny action.

Good trial prompts are:

- substantive enough that a skill should change behavior
- close to the trigger language in the frontmatter
- messy or implicit enough to expose under-triggering
- grounded in available source files, examples, or fixtures
- narrow enough that the child can finish and report a clear result

For source-derived skills, use the example-matching dimensions in
`skill-writer/references/source-distillation.md`: writing/register,
structure/output contract, evidence discipline, domain judgment, and
process/tool fidelity.

## Codex Thread And Worktree Mechanics

Choose the smallest isolation that protects the parent checkout and gives useful
evidence.

| Need | Tool route |
|---|---|
| Child should see draft source edits and may edit while testing | `create_thread` with project `worktree`, starting from the current working tree. |
| Child should inherit completed conversation context | `fork_thread` with a worktree environment. |
| Child only needs the current checkout read-only | `create_thread` with project `local`, or run locally in the parent when no isolation is needed. |
| Trial is intentionally outside a repo | `create_thread` with projectless target. |
| Parent needs child status or final result | `read_thread`. |
| Parent needs to steer a child after creation | `send_message_to_thread`. |

Use worktree isolation by default for skill tests that may edit files. The child
may propose, test, or edit inside its worktree, but it does not promote changes
to the parent checkout.

If `create_thread` returns a pending worktree id, report it using the required
Codex thread directive in the final response and wait for the child thread to
become readable before treating the trial as complete.

## Parent Flow

1. Pick the trial type: quick trial, trial set, or full evaluation.
2. Choose realistic prompts and expected behavior.
3. Decide the isolation route: worktree child, forked worktree child, local child,
   projectless child, or parent-local/manual run.
4. Create or fork the child only after the user has asked for trial work.
5. Prompt the child with the target skill path, trial prompt, expected behavior,
   and result contract below.
6. Read the child result with `read_thread`.
7. Classify the result: keep, revise, reject, or needs full evaluation.
8. Apply source edits in the parent checkout only when the user authorized
   payload changes.
9. Rerun the affected trial when the revision changes the behavior under test.

Keep the parent as the decision-maker. Child output is evidence, not authority.

## Child Prompt Contract

Ask the child to put this block first in its final answer:

```md
META_SKILL_TRIAL_RESULT
status: pass|partial|fail|blocked
target_skill: <path>
prompt_tested: <short label>
trial_type: quick|trial_set_item|source_example|doctor_fix
decision: keep|revise|reject|needs_eval
evidence: <one or two sentences>
recommended_next_action: <smallest useful next step>
END_META_SKILL_TRIAL_RESULT
```

After the block, the child may add concise reasoning, changed files in its
worktree, example-matching notes, or notable caveats.

## Evidence Files

Use durable evidence files only when the parent needs tracking across more than
chat:

```text
.meta-skill/runs/<run-id>/
  run.json
  results.jsonl
```

`run.json` records the parent thread, target skill, trial type, child thread or
pending worktree id, prompt labels, optional candidate, and status.
`results.jsonl` appends parsed `META_SKILL_TRIAL_RESULT` rows.

Do not copy raw transcripts, full diffs, debug folders, private source packs, or
large generated outputs by default. The child thread and worktree remain the
heavy evidence surface.

## Iteration Loop

Use this loop for a small trial set:

1. Draft or patch the skill in the parent.
2. Run the selected prompt or prompt set in isolated children.
3. Read trial results and inspect only the evidence needed to classify failures.
4. Revise the skill only for transferable failures: missing trigger boundary,
   missing input requirement, unclear output contract, missing evidence rule,
   weak style/register guidance, missing process/tool step, or overfit rule.
5. Do not revise for exact wording differences, one-off facts, local paths,
   client names, or source-specific quirks.
6. Rerun only affected prompts unless the change touches triggering or a shared
   output contract.
7. Escalate to `skill-evaluator` if the loop needs baselines, scoring, held-out
   tests, or more than a small set.

## Skill Writer Use

After building and validating a new skill, offer a quick trial when the user asks
for one-off testing or when the skill is fragile enough that one run would catch
likely activation, resource, or runtime-contract failures.

For source-derived skills, pair trial runs with Source Distillation's
example-matching loop. The trial should check reusable behavior, not copy the
exemplar's wording.

The trial is optional by default. It should not block ordinary skill creation
unless the user explicitly asks for mandatory trial testing.

## Skill Doctor Use

Use a worktree child to test a candidate edit without mutating the parent
checkout. The child may apply the candidate edit inside its worktree, run one
trial prompt, and report whether the edit improved the observed failure.

The parent then decides whether to apply the approved edit to the source skill,
refresh review/verify evidence, rerun the affected trial, or escalate to
`skill-evaluator`.

## Skill Evaluator Boundary

Do not rebuild `skill-evaluator` inside trial runs. A trial is useful evidence
for one prompt or a tiny prompt set. `skill-evaluator` owns:

- multi-scenario suites
- with-skill vs without-skill baselines
- repeated runs and variance
- scoring rubrics
- trigger optimization
- publish-readiness claims
