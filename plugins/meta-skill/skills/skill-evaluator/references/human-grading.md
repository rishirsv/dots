# Human Grading

Read when a task needs human judgment, taste, domain expertise, or calibration
before a model judge can be trusted.

Human grading is an interactive workflow over trial evidence. It is not a
separate report format and it is not a hidden answer key. The evaluator shows
the user the evidence, asks for a compact judgment, records that judgment as a
`grades.jsonl` row, then uses disagreements to improve the judge guidance or judge.

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

## Review Queue

For small suites, one domain reviewer is usually enough. Do not ask the user to
grade everything unless the decision requires a human study. The agent
assembles the review queue from `eval report` and trial artifacts,
then pulls individual packets with `eval human --run <run-dir> --trial
<trial-id> --json`. Prioritize:

1. failed trials that would drive a skill-doctor handoff
2. `unknown` model grades or `needs_review` report items
3. model/human disagreements from calibration
4. suspicious passes where the transcript shows skipped work, tool misuse, or
   missing evidence
5. ambiguous tasks that may need clearer success criteria

Show an evidence packet first, then ask for the label. A reviewer should not
need to reopen the whole run unless the compact packet is insufficient.

## Guided Review Flow

For each selected trial:

1. Show the visible task and the response artifact.
2. Show any judge guidance, expected output, validator failures, and compact transcript
   pointers that explain the outcome.
3. Ask for one label: `pass`, `partial`, `fail`, or `unknown`.
4. Ask for a 0-1 score only when the metric needs a continuous value.
5. Ask for a one- or two-sentence rationale grounded in response or transcript
   evidence.
6. Record the grade with:

```sh
plugins/meta-skill/scripts/metaskill eval human \
  --run <run-dir> \
  --trial <trial-id> \
  --grader <reviewer-or-judge-name> \
  --metric <metric> \
  --label pass|partial|fail|unknown \
  --score <0-to-1> \
  --rationale "<evidence-backed rationale>" \
  --json
```

Use `plugins/meta-skill/scripts/metaskill eval human --run <run-dir> --trial <trial-id> --json`
to print the review packet before asking the user.

## Q&A Script

Keep the user interaction short and evidence-first:

```text
Trial: <trial-id>
Task: <one-line task summary>
Response: <path or short excerpt>
Transcript pointers: <events/evidence paths and any notable tool calls>

1. What label should this receive?
a) pass
b) partial
c) fail
d) unknown

2. What evidence drives that judgment?

3. Is this a taste/preference rule the model judge should learn for future
trials, or a one-off judgment?
```

If the user gives freeform feedback, translate it into label, metric, rationale,
and any judge guidance change. Do not hide uncertainty; `unknown` is a valid
label when the available evidence is insufficient, contradictory, too
subjective, or underspecified.

## Turning Human Taste Into A Judge

After collecting human labels:

1. Compare human rows with model rows for the same trial and metric.
2. For every material disagreement, identify whether the task, judge guidance, model
   prompt, or transcript evidence was unclear.
3. Rewrite `judge.md` as concrete criteria and level descriptions. Preserve
   the user's taste as observable indicators, not vague adjectives.
4. Add reference examples only when they help the judge distinguish pass from
   partial or fail.
5. Rerun `eval grade` and check whether the model now matches the human labels.

Good judge guidance language names the evidence:

```text
Pass: the response names the approval boundary, gives the exact next command,
and says what evidence would change the decision.

Partial: the response gives a plausible next action but misses either the
approval boundary or the evidence needed to decide.

Fail: the response invents proof, skips the requested judgment, or recommends
an irreversible action without user approval.
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
