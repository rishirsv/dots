---
name: advisor
description: "Run a named CLI model for repository advice, review, or implementation. Use when the user explicitly asks to involve that model."
---

# Advisor

Run the named advisor through its command-line provider. This CLI workflow is
separate from the `consultant` subagent. Read and follow
[CLI.md](references/CLI.md) for current models, effort levels, permissions,
commands, and session handling.

## Set ownership and access

Select and state one mode before launching:

- **Implementation:** the user asks the named model to implement, build, fix, or
  change something. The advisor owns the repository edits, required checks,
  corrections, and final handoff.
- **Review:** the user asks the advisor to inspect existing work without making
  changes. The advisor returns findings and does not edit the repository.
- **Consultation:** the user asks for advice, design help, or a decision. The
  calling agent retains implementation ownership.

Use the mode implied by the request. Do not silently downgrade implementation
to consultation or take implementation back because local editing is
convenient. Ask only when the request does not establish an owner and the answer
would change the workflow.

Before launching, state the task, initial read, mode, model, effort, and access.
Honor the user's choices. Implementation normally needs workspace write; review
and consultation default to read-only. State the actual permission boundary
when bypass flags grant broader access.

## Write the prompt

Advisor runs do not inherit this conversation. Write a self-contained prompt
with the task, relevant context and evidence, constraints, mode, ownership, and
completion conditions. Point it at the actual repository so it can inspect the
source directly.

For implementation, include this directive near the start:

> Mode: implementation. You own the repository changes, required checks,
> corrections, and final handoff. Use the repository file and terminal tools.
> Do not return only advice or a proposed patch.

## Complete the mode

Wait for the run to finish and inspect its output. For implementation, inspect
the resulting diff and validation evidence. If requested changes are absent or
checks are omitted without a stated blocker, resume the same session with a
focused correction prompt. The named model continues to own those corrections;
do not silently take over unless the user reassigns ownership.

For review, return prioritized findings supported by repository evidence. For
consultation, return the recommendation, the evidence and tradeoffs behind it,
and any uncertainty that affects the decision. For implementation, return the
changed files, validation performed, and remaining blockers.

Treat advice as input to judgment, not authority. The caller may reject it when
stronger evidence supports another choice, and should say why. Reconsult only
when a new consequential decision arises or an evidence conflict remains
unresolved; use the same session when context from the first run matters.
