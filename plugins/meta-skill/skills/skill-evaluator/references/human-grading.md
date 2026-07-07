# Human Grading

Read when a task needs human judgment, taste, domain expertise, or calibration
before a model judge can be trusted.

Human grading is an interactive workflow over trial evidence. It is not a
separate report format and it is not a hidden answer key. The evaluator shows
evidence, asks for a compact judgment, records that judgment as a `grades.jsonl`
row, then uses disagreements and annotations to improve the judge guidance or
task.

## When To Use It

Use a human grader when:

- the right answer depends on taste, product judgment, domain expertise, or
  user-specific preference
- model grades will decide whether a skill is accepted, selected, or rejected
- the model grader returns `unknown`
- outputs are conversational, creative, advisory, or have many valid forms
- the transcript suggests the outcome grade may be unfair

Do not use human grading as the only evidence for ordinary exact checks. If a
script can fairly check the requirement, write a code grader.

## Review Workbench

Use the local review workbench as the primary path:

```sh
<meta-skill-root>/scripts/metaskill eval review --suite .<skill-name>/evals.json --run <run-id> --open
```

It serves on `127.0.0.1`. Pass `--port N` when the default port is busy. Pass
`--run <id>` to open one run; omit it to choose from the workbench run list.

The workbench provides:

| Surface | Use |
|---|---|
| Prioritized queue | Review failed, unknown, disagreement, suspicious-pass, then remaining trials. |
| Evidence pane | Read the visible task, outcome, transcript digest, judge guidance, expected outputs, grades, and annotations. |
| Grading rail | Commit `pass`, `partial`, `fail`, or `unknown` with score and rationale. |
| Agreement view | See live paired agreement and trust band after a label is committed. |

The judge's grade stays hidden until the reviewer commits a human grade. Do not
show the model label first; it biases review.

## Queue Priorities

The review queue sorts by machine evidence:

1. machine verdict failed
2. machine verdict inconclusive, or any machine grade `unknown` or `ungraded`
3. model/human disagreement on the same trial and metric
4. suspicious pass: a passed trial with a failed judge check or judge score under
   the suspicious-pass floor
5. remaining passes

For small suites, one domain reviewer is usually enough. Do not ask the user to
grade everything unless the decision requires a human study.

## Annotation Tags

Use span annotations to explain why a grade or disagreement matters:

| Tag | Use |
|---|---|
| `taste-rule` | A reusable preference or product judgment the judge should learn. |
| `one-off` | A local judgment that should not become a general rule. |
| `task-defect` | The task prompt or expected behavior is unclear or unfair. |
| `grader-defect` | The judge, validator, or grading guidance is wrong. |

Annotations append to `annotations.jsonl`. Keep notes short and evidence-backed.

## Guided Review Flow

For each selected trial:

1. Read the visible task and response artifact.
2. Read judge guidance, expected output, validator failures, and compact
   transcript pointers when they explain the outcome.
3. Commit one label: `pass`, `partial`, `fail`, or `unknown`.
4. Add a 0-1 score only when the metric needs a continuous value.
5. Write a one- or two-sentence rationale grounded in response or transcript
   evidence.
6. Add an annotation when the judgment should change the judge, task, or grader.

If the user gives freeform feedback, translate it into label, metric,
rationale, and optional annotation. Do not hide uncertainty; `unknown` is a
valid label when the available evidence is insufficient, contradictory, too
subjective, or underspecified.

## Headless Path

Use `eval human` when the browser workbench is unavailable or a script needs to
record labels:

```sh
<meta-skill-root>/scripts/metaskill eval human \
  --run <run-dir> \
  --trial <trial-id> \
  --grader <reviewer-or-judge-name> \
  --metric <metric> \
  --label pass|partial|fail|unknown \
  --score <0-to-1> \
  --rationale "<evidence-backed rationale>" \
  --json
```

Use this to print the review packet before asking the user:

```sh
<meta-skill-root>/scripts/metaskill eval human --run <run-dir> --trial <trial-id> --json
```

The CLI writes the same grade rows as the workbench. It does not provide the
prioritized queue, hidden-judge reveal, annotations, or live agreement view.

## Turning Human Taste Into A Judge

After collecting human labels:

1. Compare human rows with model rows for the same trial and metric.
2. Review annotations and disagreements.
3. Identify whether the task, judge guidance, model prompt, or transcript
   evidence was unclear.
4. Rewrite `judge.md` as concrete criteria and level descriptions. Preserve the
   user's taste as observable indicators, not vague adjectives.
5. Add reference examples only when they help the judge distinguish pass from
   partial or fail.
6. Rerun `eval grade` and check agreement again.

Good judge guidance language names the evidence:

```text
Pass: the response names the approval boundary, gives the exact next command,
and says what evidence would change the decision.

Partial: the response gives a plausible next action but misses either the
approval boundary or the evidence needed to decide.

Fail: the response invents proof, skips the requested judgment, or calls for an
irreversible action without user approval.
```

## Transcript Use

Read transcripts during human review when the response alone is insufficient,
when the task is conversational, or when process behavior is part of the skill
contract. Look for:

- required or forbidden tool calls
- mid-conversation work that never appears in the final response
- skipped validation or hidden harness failures
- unsafe file edits or approval-boundary mistakes
- excessive turns, retries, or token use that changed the user experience

Do not grade exact tool-call order unless the order is part of the task. Prefer
outcome evidence, then transcript evidence that explains or qualifies the
outcome.
