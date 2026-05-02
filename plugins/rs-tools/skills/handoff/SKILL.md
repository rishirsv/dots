---
name: handoff
description: Create a concise continuation handoff for ongoing work. Use only when the user explicitly asks for a handoff, continuation note, context transfer, resume brief, or summary for the next agent/session. Capture the goal, current state, important files and commands, decisions, blockers, unresolved issues, and exact next step.
---

# Handoff

Create a continuation brief that helps work resume quickly and correctly.

Stay in handoff mode:

- Do not implement new code.
- Do not re-solve the task.
- Focus on continuity, not compression for its own sake.

## Goal

Preserve the context that would otherwise be lost:

- the user's real goal
- the current work state
- files and commands that matter
- decisions already made
- blockers, risks, and unresolved questions
- the exact next step

## What makes a good handoff

A good handoff lets the next person continue without asking:

- What were we trying to do?
- What already changed?
- What is done versus not done?
- Which files matter most?
- What failed or was deferred?
- What should happen next?

## Gather context first

Before writing the handoff, reconstruct the state from the highest-signal evidence:

1. The latest user requests and corrections
2. The most recent assistant actions
3. Files read, created, or edited
4. Commands run and what they established
5. Validation run, skipped, passed, or failed
6. Any saved docs, plans, or research artifacts

Prefer current state over early conversation history when the two differ.

## Prioritization rules

- Preserve changed user direction and explicit preferences.
- Distinguish finished work from pending work.
- Name files and artifacts directly when they matter.
- Include commands only when they explain state, validation, or the next move.
- Keep long raw output out of the handoff unless the exact text is important.
- Prefer short explanations over giant transcripts.
- Quote the user only when exact wording matters for future alignment.

## Default structure

Use this structure unless the user asked for a different format.

```md
# Handoff

## Goal

[What the user is trying to achieve]

## Current State

[What has already been done and where things stand now]

## Key Files

- `path/to/file`: why it matters

## Commands And Validation

- `command`: why it mattered and the important outcome

## Decisions And Constraints

- [Decision, assumption, preference, or repo rule]

## Open Issues

- [Unresolved item, blocker, or deferred work]

## Next Step

[The exact next action to take]
```

## Required content

Always include:

- the user's current goal
- the latest material changes to scope or direction
- the most relevant files touched or inspected
- meaningful commands run
- validation status
- unresolved items
- one exact next step

Include only when relevant:

- branch name
- PR or commit state
- saved doc paths
- research artifacts
- environment blockers
- failed attempts

## File guidance

When files matter:

- include the path
- say why it matters in one short phrase
- summarize the important change in plain language

Do not paste full code blocks by default. Only include code snippets when the next person would likely misunderstand the state without them.

## Command guidance

When commands matter:

- include the command in backticks
- summarize the useful result
- avoid dumping full output unless it contains the blocker itself

Examples:

- `git status --short`: confirmed only the new skill folders were modified
- `quick_validate.py ...`: validated the skill structure successfully
- `gh auth status`: confirmed GitHub CLI auth was available

## Style rules

- Be concise, but not skeletal.
- Write for continuation, not for storytelling.
- Use direct, practical language.
- Prefer concrete nouns over vague summaries.
- Avoid giant sections like "all user messages" unless the user explicitly asks.
- Do not repeat the same point in multiple sections.

## Completion check

Before finishing, make sure the handoff answers:

1. What is the job?
2. What changed already?
3. What is still left?
4. Where should the next person look first?
5. What should they do next?
