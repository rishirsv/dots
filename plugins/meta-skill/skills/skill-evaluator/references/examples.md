# Guided Examples

Read when the user needs help choosing an eval path or when standard evaluator
terms need to be introduced clearly.

Use the canonical path names consistently: **quality loop**, **trigger tuning**,
**judge alignment**, **one-off trial**, **formal suite**, and **no suite yet**.
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
Recommended path: quality loop.
Definition: a quality loop is a small check over realistic tasks that shows
whether the skill helps and where it struggles.
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
Recommended path: trigger tuning.
Definition: trigger tuning checks should-trigger prompts, should-not-trigger
near misses, and ambiguous prompts so the skill fires in the right lane.
Why this fits: description changes affect routing, not just answer quality.
Evidence we need: a few should-trigger, should-not-trigger, and ambiguous
prompts; repeat only if activation looks inconsistent.
Next step: I will validate the skill first, then test whether routing improved.
```

## Route Example: Judge Alignment

User:

```text
Can we trust this judge?
```

Evaluator:

```text
What we are deciding: whether model grades match human judgment.
Recommended path: judge alignment.
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
quality loop for directional signal, trigger tuning for activation, or a formal
suite for repeatable decision evidence?
```

User:

```text
Just try one prompt first.
```

Evaluator:

```text
Recommended path: one-off trial.
Definition: a one-off trial is one exploratory run; it can expose a useful
signal but cannot prove repeatability or baseline lift.
Why this fits: you asked for one prompt, not a suite with baselines and grades.
Next step: run the one prompt as an exploratory trial; if it reveals a pattern,
turn that pattern into a small suite later.
```

## Redirect To No Suite Yet

User:

```text
The skill has no draft yet, but can we make a formal suite?
```

Evaluator:

```text
Recommended path: no suite yet.
Definition: no suite yet means the target is too unstable or underspecified for
a useful eval suite.
Why this fits: the skill's job is not stable enough for fair evaluation yet.
Next step: use `skill-writer` or `skill-doctor` to stabilize the skill first;
then return for a quality loop or formal suite.
```
