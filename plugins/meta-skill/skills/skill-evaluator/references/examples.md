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
Definition: a quality loop is a small capability eval over realistic tasks that
shows whether the skill helps and where it struggles.
Why this fits: you need behavioral signal, but not durable evidence yet.
Starting signal: common workflows and any review notes we already have.
Evidence we need: realistic prompts, expected qualities, and a judge rubric.
What this can prove: whether the skill helps on the measured examples.
What it cannot prove yet: broad reliability or trigger behavior.
Next step: I will sketch a small prompt set and grading standard for review.
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
Starting signal: changed frontmatter.
Evidence we need: should-trigger prompts, near-miss should-not-trigger prompts,
and repeated trials if activation varies.
What this can prove: whether the candidate description improves activation on
the measured prompt set.
What it cannot prove yet: output quality after the skill activates.
Next step: I will sketch a balanced prompt set, then we can test activation
before judging output quality.
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
Starting signal: model judge grades that need a human standard.
Evidence we need: human-labeled pass and fail examples, model grades on the same
trials, and disagreement analysis.
What this can prove: whether the judge finds failures and recognizes passes on
the checked examples.
What it cannot prove yet: future performance outside the labeled distribution.
Next step: I will collect a small labeled set, compare model and human labels,
and call out false passes, false fails, unknowns, and the judge trust band.
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
Recommended path: one-off trial through the owning specialist.
Definition: a one-off trial is one exploratory run; it can expose a useful
signal but cannot prove repeatability or baseline lift.
Why this fits: you asked for one prompt, not a suite with baselines and grades.
Next step: use the shared trial-run workflow with the skill's current owner;
come back to `skill-evaluator` if the result should become a multi-case suite.
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
Why this fits: a formal suite would chase a moving target before the skill's job
is stable.
Next step: use `skill-writer` or `skill-doctor` to stabilize the skill first;
then return for a quality loop or formal suite.
```
