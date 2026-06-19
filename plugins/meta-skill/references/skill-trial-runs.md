# One-Off Skill Checks

Read this when a Meta-Skill lane needs an inspectable one-off check of a skill
draft, source-derived skill, or proposed edit. A one-off check is a bounded test
of realistic behavior. It may use a Codex child thread, a worktree-backed child
thread, or a local/manual run.

This is not the full evaluation process. Escalate to `skill-evaluator` when the
user needs multi-scenario measurement, baseline comparison, variance, or trigger
optimization. Escalate to `skill-benchmarker` when the user asks for recurring
benchmark profiles, history, gates, or publish-readiness scorecards.

Terminology: in full evals, a **candidate** is the thing under test (`current`,
`attempt-1`), and a **trial** is one execution of one case under one candidate.
"Attempt 1" is user-facing display text for a candidate only. Do not use
`attempt_id` internally; use `trial_id` for one execution.

## User Experience

Offer testing in tiers:

| User intent | Use |
|---|---|
| "Just make the skill" | Build, lint, and validate locally. Offer a one-off check only when the skill is fragile or source-derived. |
| "Try it once", "test this prompt", or "run a sanity check" | Run one skill check. |
| "Try these few examples" or "iterate until this feels right" | Run a small check set and revise between iterations. |
| "Make sure this is good" or "optimize triggering" | Route to `skill-evaluator`. |
| "Benchmark it", "track this over time", or "is this release-ready with our existing suite?" | Route to `skill-benchmarker`. |
| "Is this release-ready?" with no suite/profile context | Ask whether an eval suite or benchmark profile already exists; route to `skill-evaluator` when it does not. |

Explain the lightweight path in user-facing language: "I can run a check on one
realistic prompt in a separate worktree, then use the result as evidence before
changing the source skill."

Do not create, fork, or message Codex threads unless the user asked for testing,
iteration, a child thread, or a worktree-backed check.

## Check Types

### Quick Check

Use when one realistic prompt can catch likely activation, resource, or
runtime-contract failures.

- Best for a new skill after validation checks pass.
- Best for `skill-doctor` when a proposed fix should be tried before parent-side
  edits are applied.
- Not release proof.

### Check Set

Use when the user wants a small improvement loop but not a full evaluation.

- Pick 2-3 realistic prompts.
- Include should-trigger, near-miss, and one prompt that exercises the skill's
  main value.
- Run in child threads when independent execution matters; run serially when
  thread tooling is unavailable or the task is lightweight.
- Revise only for transferable failures.

### Full Evaluation

Route to `skill-evaluator` when the work needs multiple scenarios, baselines,
held-out prompts, variance, scoring, or description optimization. Route to
`skill-benchmarker` when those runs need a stable recurring profile or
decision-level history.

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
may propose, test, or edit inside its worktree, but it does not adopt changes
to the parent checkout.

If `create_thread` returns a pending worktree id, report it using the required
Codex thread directive in the final response and wait for the child thread to
become readable before treating the trial as complete.

## Parent Flow

1. Pick the check type: quick check, check set, or full evaluation.
2. Choose realistic prompts and expected behavior.
3. Decide the isolation route: worktree child, forked worktree child, local child,
   projectless child, or parent-local/manual run.
4. Create or fork the child only after the user has asked for check work.
5. Prompt the child with the target skill path, trial prompt, expected behavior,
   and result contract below.
6. Read the child result with `read_thread`.
7. Classify the result in the parent: passes, fails, blocked, or needs full evaluation.
8. Make source edits in the parent checkout only when the user authorized
   payload changes.
9. Rerun the affected check when the revision changes the behavior under test.

Keep the parent as the decision-maker. Child output is evidence, not authority.

## Child Prompt Contract

Ask the child to put this block first in its final answer:

```md
META_SKILL_CHECK_RESULT
check_id: <stable short id for this execution>
status: pass|partial|fail|blocked
target_skill: <path>
candidate_source: <current|child_edit|approved_edit|other>
prompt_tested: <short label>
check_type: quick|check_set_item|source_example|doctor_fix
expected_behavior: <what should happen>
observed_behavior: <what happened>
evidence: <one or two sentences>
limits: <what this one check cannot prove>
possible_follow_up: <smallest useful next evidence step, if any>
END_META_SKILL_CHECK_RESULT
```

Include these fields when they apply:

```md
child_thread_id: <thread id>
worktree_id: <worktree id>
evidence_refs: <paths, command outputs, or line refs>
changed_files_in_child: <paths>
rerun_command_or_route: <command or child route>
```

After the block, the child may add concise reasoning, example-matching notes, or
notable caveats. Keep changed files, evidence refs, and rerun details in the
structured fields when they apply.

## Evidence Files

Use durable evidence files only when the parent needs tracking across more than
chat:

```text
.<skill-name>/checks/<check-id>/
  check.json
  result.md
  evidence.json
```

`check.json` records the parent thread, target skill, check type, child thread
or pending worktree id, prompt labels, expected behavior, optional candidate,
and status. `result.md` stores the parsed `META_SKILL_CHECK_RESULT` block and
short parent summary. `evidence.json` stores evidence refs, child changed files,
and rerun route.

Do not copy raw transcripts, full diffs, debug folders, private source packs, or
large generated outputs by default. The child thread and worktree remain the
durable evidence source.

## Iteration Loop

Use this loop for a small check set:

1. Start from the current approved draft or candidate. If parent-side source
   changes are explicitly authorized, patch only that approved scope; otherwise
   record candidate wording as a proposal and test it in an isolated child or
   worktree.
2. Run the selected prompt or prompt set in isolated children.
3. Read check results and inspect only the evidence needed to classify failures.
4. Change parent source only when authorized; otherwise recommend changes only
   for transferable failures: missing trigger boundary, missing input
   requirement, unclear output contract, missing evidence rule, weak
   style/register guidance, missing process/tool step, or overfit rule.
5. Do not revise for exact wording differences, one-off facts, local paths,
   client names, or source-specific quirks.
6. Rerun only affected prompts unless the change touches triggering or a shared
   output contract.
7. Escalate to `skill-evaluator` if the loop needs baselines, scoring, held-out
   tests, or more than a small set.

## Skill Writer Use

After building and validating a new skill, offer a quick check when the user asks
for one-off testing or when the skill is fragile enough that one run would catch
likely activation, resource, or runtime-contract failures.

For source-derived skills, pair one-off checks with Source Distillation's
example-matching loop. The check should inspect reusable behavior, not copy the
exemplar's wording.

The check is optional by default. It should not block ordinary skill creation
unless the user explicitly asks for mandatory testing.

## Skill Doctor Use

Use a worktree child to test a proposed edit without mutating the parent
checkout. The child may apply the proposed edit inside its worktree, run one
check prompt, and report the observed behavior.

The parent then decides whether to apply the approved edit to the source skill,
refresh review/verify evidence, rerun the affected check, or escalate to
`skill-evaluator`.

## Skill Evaluator Boundary

Do not rebuild `skill-evaluator` inside one-off checks. A check is useful
evidence for one prompt or a tiny prompt set. `skill-evaluator` owns:

- multi-scenario suites
- with-skill vs without-skill baselines
- repeated runs and variance
- scoring rubrics
- trigger optimization
- first-pass release-readiness evidence

`skill-benchmarker` owns recurring release gates, publish-readiness scorecards,
and benchmark history over stable evaluator artifacts.
