# Guided Examples

Read when the user needs help choosing an eval path or when standard evaluator
terms need to be introduced clearly.

Use the canonical path names consistently: **one-off check**, **eval suite**,
**eval preset**, and **no suite yet**. Name the concrete eval subtype
when useful: quality, trigger, regression, gate, or judge alignment.
Define the selected term once when the user may not know it, then keep using it.

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
