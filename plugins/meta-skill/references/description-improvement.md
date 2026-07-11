# Description Improvement

Use this method when the decision is whether a skill's `name` and `description`
are discovered for the right user requests. It adapts Anthropic's description
optimization loop to MetaSkill's ownership and evidence model.

Natural discovery is a different claim from attached-skill behavior. A valid
discovery trial exposes only the skill name and candidate description through
the platform's ordinary available-skills surface, sends a natural user request,
and observes whether the platform selects or reads the skill. Do not inject the
skill payload, mention the skill by name in the task, or replace observed
selection with a model's opinion about whether it should have selected it.

The current attached-payload runner cannot produce this evidence. Use this
method only when the active platform exposes a natural-discovery trial surface;
otherwise prepare and review the corpus, then report the missing adapter rather
than running a misleading substitute.

## Build The Corpus

Create about 20 substantive requests, balanced between should-trigger and
should-not-trigger cases. Start from real usage, missed invocations, routing
collisions, and the skill's nearest neighbors. Synthetic cases are coverage
hypotheses until the user reviews them.

Each request should resemble something a person would actually type: include
enough context to make the task real, vary length and register, and allow
ordinary shorthand, typos, file names, or situational detail. Avoid abstract
toy prompts.

Should-trigger cases cover:

- different natural phrasings of the same intent
- implicit need where the skill or artifact type is not named
- less common but genuinely owned branches
- competitive cases where this skill should win over a neighbor

Should-not-trigger cases should be difficult near misses:

- shared vocabulary with different intent
- an adjacent domain or artifact
- ambiguous phrasing whose context points elsewhere
- a request better owned by another skill or ordinary agent behavior

An unrelated negative proves nothing. Ask the user to review, edit, add, remove,
and relabel the corpus before running it; weak labels optimize the wrong
description.

Represent the reviewed corpus as:

```json
[
  {"query": "a realistic user request", "should_trigger": true},
  {"query": "a difficult near miss", "should_trigger": false}
]
```

Keep this discovery corpus separate from task-outcome cases in
`evals/evals.json` until MetaSkill has a platform adapter that can execute it
faithfully.

## Run Fair Discovery Trials

Use the same model and skill-discovery surface users will experience. Split the
reviewed corpus once with a fixed seed, stratified by `should_trigger`: 60% for
rewriting and 40% rewrite-blinded validation, with both labels represented in
each part.

Run every query three times because routing is stochastic. For each query,
record selections, attempts, and trigger rate. A should-trigger query passes at
a trigger rate of at least 0.5; a should-not-trigger query passes below 0.5.
Report false negatives and false positives separately, along with precision,
recall, and accuracy.

Freeze the corpus, labels, split, candidate description, model, and runtime
surface for every iteration. Changing any of them creates a new experiment.

## Improve Without Seeing Validation Failures

Give the rewriter:

- the skill name and body, so the description stays inside its true scope
- the current description
- false negatives and false positives from the rewriting split
- prior candidate descriptions and their rewriting-split results

Do not show validation queries, labels, failures, or scores to the rewriter.
Ask for a structurally different candidate when repeated wording changes stall.

The candidate should:

- generalize failures into user intents instead of appending query phrases
- describe the user's goal rather than implementation mechanics
- distinguish the skill from its closest competitors
- preserve the actual ownership boundary in the body
- follow [description-standard.md](description-standard.md)
- remain comfortably below the platform limit

Run at most five iterations, or stop earlier when every rewriting query passes
or changes stop improving the result. Re-evaluate both splits on every
iteration and select the candidate with the strongest validation result, not
the strongest rewriting result.

Anthropic's method calls this a held-out test set, but it evaluates it every
iteration and uses it for candidate selection. Describe it accurately as
rewrite-blinded validation rather than a pristine final holdout.

## Handoff And Apply

The evaluator owns the corpus, frozen trials, rates, and comparison report. It
returns the best candidate description and the evidence it cannot establish;
it does not edit skill source.

The author checks the candidate against the body, neighboring descriptions,
the description standard, and payload contracts before applying it. Show the
user the before and after text and disclose rewriting and validation results.
A better routing score is evidence for the measured corpus and runtime only,
not proof of universal discovery.
