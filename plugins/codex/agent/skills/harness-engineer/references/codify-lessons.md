# Codify Lessons

Read this when a mistake, review comment, repeated failure, or user correction
should become durable guidance.

The goal is to prevent recurrence without bloating instruction files or turning
one-off accidents into permanent rules.

## Lesson Shape

Before choosing a surface, reduce the lesson to:

- failure: what went wrong
- condition: when this can happen again
- behavior: what a future agent should do differently
- evidence: why this is worth preserving
- enforcement: whether a deterministic check can catch it

If the condition is vague, keep the lesson in the current plan or ask for a
narrower rule before editing durable instructions.

## Surface Decision

| Lesson type | Put it here |
|---|---|
| Repo-wide agent behavior | root instruction entrypoint |
| Subtree-only behavior | nearest subtree instruction file or local docs |
| Human setup or workflow knowledge | README, contributing docs, or runbook |
| Portable recurring agent behavior | skill |
| Deterministic failure | test, linter, hook, script, schema, typecheck, or CI |
| Task-local state or temporary caution | plan or progress ledger |
| Stable cross-repo personal preference | memory, when the user explicitly asks to remember it |
| One-off, obsolete, or already covered issue | no durable change |

## Instruction Entry Points

Use an instruction entrypoint when the lesson changes how agents should behave
throughout the repo. Keep it short and actionable.

Good entrypoint rules:

- name source surfaces and generated surfaces
- identify commands that must run after specific source changes
- define approval gates
- route agents to deeper docs or skills

Poor entrypoint rules:

- duplicate long README sections
- explain general engineering advice
- codify one user's temporary preference without scope
- add a rule that a test or hook could enforce
- conflict with a stronger local instruction file

## Mechanical First

If a future failure can be detected automatically, propose the check before or
alongside prose. Examples:

- stale Markdown link: link checker
- generated file edited directly: pre-commit check or generated-file marker
- missing test for a bug: regression test
- forgotten sync command: hook or script
- invalid schema: schema validation

Prose can explain why the control exists, but the check should carry the load.

## Edit Gate

Before editing durable instructions:

1. Confirm the lesson is not already covered.
2. Check for conflicts with existing instructions.
3. Choose the narrowest location that reaches the future agent.
4. Prefer a one-line directive plus a pointer to deeper docs.
5. Run link or syntax checks that apply to the changed file.

If the user asked only for a recommendation, stop at the proposed text and
surface choice.
