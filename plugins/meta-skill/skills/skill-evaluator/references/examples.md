# Guided Examples

Read when the user needs help choosing an eval path or when standard evaluator
terms need to be introduced clearly.

Use the canonical path names consistently: **one-off check**, **eval suite**,
**eval preset**, and **no suite yet**. Name the concrete eval subtype
when useful: quality, trigger, regression, gate, or judge alignment.
Define the selected term once when the user may not know it, then keep using it.

## Intake Shape

Use this shape before authoring or running anything:

```text
What we are deciding: <decision in the user's words>
Evidence plan: <one-off check | eval suite | eval preset | no suite yet>
Definition: <one-sentence definition of the selected path when useful>
Why this fits: <context-specific reason>
Starting signal: <real traces | known failure | manual check | synthetic hypothesis | none yet>
Evidence we need: <tasks, examples, labels, validators, transcripts, or fixtures>
What this can prove: <measured claim>
What it cannot prove yet: <coverage limit>
Next step: <one concrete action>
```

Name the smallest evidence plan, then act on lightweight inspection, one-off
review, deterministic validation, or drafting tasks. Ask for confirmation
before eval suites, runner setup, human review collection, or durable
artifact creation, only when a missing decision would change the eval path,
runner, external writes, or human-review standard.

## Route Common Requests

| User intent | Evidence plan |
|---|---|
| "Is this skill good enough?" | Choose between static `skill-doctor` review, a 2-3 task eval suite, or no suite yet based on risk and existing evidence. |
| "Did this change break anything?" | Regression or failure suite from known-good behavior. |
| "I changed the description/frontmatter." | Run `<meta-skill-root>/scripts/metaskill validate <skill-dir>` first, then trigger tuning with should-trigger and near-miss prompts. |
| "Can I trust this judge?" | Judge alignment with human labels and TPR/TNR. |
| "Try this one prompt." | One-off check if the user wants a signal; route diagnosis/fix reproduction to `skill-doctor`. Convert useful findings into suite tasks later. |
| "Give me durable evidence." | Ask for confirmation, then build an eval suite with run artifacts, grades, and report. |
| "Benchmark this", "track release readiness", or "show benchmark history." | Route to `skill-benchmarker` after an eval suite exists. |
| "This is a one-off or fully deterministic check." | Skip the suite; use `skill-doctor` or a deterministic validator. |

## Route Example: Quality Loop

User:

```text
Is this skill good enough?
```

Evaluator:

```text
What we are deciding: whether the skill produces useful results on realistic
tasks.
Evidence plan: eval suite.
Definition: a small eval suite checks realistic tasks and shows behavior and
failure modes.
Why this fits: you need behavioral signal, not durable release evidence.
Evidence we need: a few realistic prompts and what good looks like.
Next step: I will sketch three examples for review.
```

## Route Example: Trigger Tuning

User:

```text
I changed the frontmatter description. Can we test it?
```

Evaluator:

```text
What we are deciding: whether the new description activates the skill at the
right times.
Evidence plan: eval suite.
Definition: trigger tuning checks should-trigger prompts, should-not-trigger
near misses, and ambiguous prompts so the skill activates for the right requests.
Why this fits: description changes affect routing, not just answer quality.
Evidence we need: a few should-trigger, should-not-trigger, and ambiguous
prompts; repeat only if activation looks inconsistent.
Next step: I will validate the skill first, then test whether routing matches
the intended boundary.
```

## Route Example: Judge Alignment

User:

```text
Can we trust this judge?
```

Evaluator:

```text
What we are deciding: whether model grades match human judgment.
Evidence plan: eval suite.
Definition: judge alignment compares model-judge labels against human labels so
we know when judge scores are trustworthy.
Why this fits: judge scores will influence a quality decision.
Evidence we need: a few human-labeled pass and fail examples.
Next step: compare those labels with the judge's labels, then say where the
judge is and is not trustworthy.
```

## Multi-Turn Clarification

User:

```text
Can you prove this skill is reliable?
```

Evaluator:

```text
We can collect evidence, but "reliable" needs a scope. Do you want a quick
one-off check for directional signal, a trigger-focused eval suite for
activation, or an eval suite for repeatable decision evidence?
```

User:

```text
Just try one prompt first.
```

Evaluator:

```text
Evidence plan: one-off check.
Definition: a one-off check is one exploratory run; it can expose a useful
signal but cannot prove repeatability.
Why this fits: you asked for one prompt, not a suite with baselines and grades.
Next step: run the one prompt as an exploratory check; if it reveals a pattern,
turn that pattern into a small suite later.
```

## Redirect To No Suite Yet

User:

```text
The skill has no draft yet, but can we make an eval suite?
```

Evaluator:

```text
Evidence plan: no suite yet.
Definition: no suite yet means the target is too unstable or underspecified for
a useful eval suite.
Why this fits: the skill's job is not stable enough for fair evaluation yet.
Next step: use `skill-writer` or `skill-doctor` to stabilize the skill first;
then return for a one-off check or eval suite.
```
