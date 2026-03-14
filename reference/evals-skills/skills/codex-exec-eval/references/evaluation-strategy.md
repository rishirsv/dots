# Evaluation Strategy

Use the simplest evaluation method that can reliably answer "did this run succeed?"

## Default Path: Deterministic Checks

Start with rules:

- process exit state
- required text present
- forbidden text absent
- required files created
- required JSON keys present

This is the default because it is easy to understand, cheap to run, and easy to debug.

## When to Stay Deterministic

Stay on deterministic checks when the task mostly cares about:

- whether a file was produced
- whether certain phrases or fields are present
- whether output parses as JSON
- whether Codex completed without crashing

## When to Escalate

Escalate only when the success criteria require interpretation, for example:

- tone
- persuasiveness
- completeness against a subjective rubric
- quality of narrative writing

When that happens, keep the user experience inside this skill:

1. define the criterion in plain language
2. collect or review a small labeled set
3. add a judge prompt or human-review step
4. validate that evaluator before trusting it broadly

## Operator Guidance

- Start with a small set of starter cases.
- Run the harness.
- Review failures.
- Tighten the prompt or deterministic checks.
- Only add deeper review after the simple path stops being enough.
