# Error Analysis

Guide the user through real traces and conversation history to understand how
their system failed. Do not jump from an output to a failure category or judge
prompt. Collect the evidence, review it with the user, record their labels and
observations, then group repeated failures.

## 1. Collect The Traces

Start with traces the user supplies: case documentation, exported
conversations, run artifacts, logs, or named Codex tasks. Preserve the complete
user request, system response, relevant tool calls and results, and final
outcome for each case.

When the user names a Codex task, use the live task-reading tools when
available. Otherwise use `metaskill sessions list` to find the task and
`metaskill sessions show` to render its conversation. Read the named task
rather than relying on a summary; the CLI owns local-history compatibility.

Keep subagent traces attached to their parent task. Do not count them as
independent user cases. Do not expose transcript paths, secrets, or unrelated
private content in the review.

## 2. Review And Label Each Trace

Read each complete trace before writing an observation. Compare what the user
asked for with what the system actually produced. Record one concrete
observation per distinct defect; use `-` when no defect is found.

Present a compact index first:

| Trace ID | User request and outcome | What went wrong | Proposed label |
|---|---|---|---|
| 001 | Property search generated SQL | Missing pet-friendly constraint | Fail |
| 002 | Calendar proposed meeting times | Suggested unavailable times despite conflicts | Fail |
| 003 | Email drafted for luxury buyer | Used casual tone and selected the wrong property type | Fail |
| 004 | Requested task completed as specified | - | Pass |

Then show the full evidence for each row under a matching `### Trace <id>`
heading. Include the conversation and the tool evidence needed to understand
the outcome; omit unrelated tool noise.

Walk the user through the proposed observation and Pass/Fail label. Ask whether
they agree, what they expected instead, and whether anything important is
missing. Treat the label and annotation as provisional until the user confirms
or corrects them. Preserve the user's wording when it defines the expected
behavior more precisely.

## 3. Group Confirmed Failures

Group only user-confirmed Fail traces. Name categories by the shared root cause,
not by similar words in the outputs.

Split failures with different root causes:

- “Made up property features such as solar panels” fabricates external facts.
- “Scheduled a tour the user never requested” fabricates user intent.

Group failures with the same root cause:

- “Missing bedroom count,” “missing pet-friendly filter,” and “missing price
  range” belong to **Missing Query Constraints**.

After the user has reviewed 30–50 traces, an LLM may propose clusters from the
confirmed annotations:

```text
Here are failure annotations from reviewed LLM pipeline traces.
Group similar failures into 5–10 distinct categories.
For each category, provide:
- a clear name;
- a one-sentence definition; and
- the trace IDs and annotations that belong to it.

Keep every trace's confirmed Pass/Fail label. Group by likely root cause, not
surface vocabulary. Do not change labels or invent missing evidence.

Annotations:
<confirmed annotations>
```

Always review the suggested grouping with the user. LLMs often cluster by
surface similarity—for example, grouping “app crashes” with “login is slow”
because both mention login. Apply the user's corrections before calculating
rates or designing evaluators.

## 4. Calculate And Report Failure Rates

After labels and categories are confirmed, report:

- overall failure rate = failed traces / all labeled traces;
- category failure rate = traces failing that category / all labeled traces;
- share of failures = traces failing that category / all failed traces; and
- trace count and date range so the denominator is visible.

Assign one primary category per failed trace when category rates must sum to the
overall failure rate. Record secondary categories separately when one trace has
multiple distinct defects.

Report the trace table, confirmed category definitions, counts, rates, and
representative trace IDs. Mark categories with too little evidence instead of
generalizing from one example.

## 5. Turn A Failure Mode Into An Evaluator

Choose a repeated, clearly defined category whose Pass/Fail boundary the user
has confirmed. Exhaust deterministic checks first. When semantic judgment is
still required and enough labeled examples exist, read [judge.md](judge.md) and
author one binary judge for that failure mode.
