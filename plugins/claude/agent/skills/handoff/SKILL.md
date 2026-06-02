---
name: handoff
description: Use when creating a concise continuation handoff for another agent or future session after the user asks for a handoff, session summary, continuation brief, context transfer, or next-agent instructions.
---

# Handoff

Create a practical continuation brief for the current task, branch, PR, issue, plan, or conversation.

Default to an inline handoff. Write a file only when the user asks for one, the handoff is too large for chat, or a durable artifact is clearly needed. If saving a file, use the user-requested path; otherwise use a clearly named temporary handoff path and report it.

## Workflow

1. Identify what the next session is supposed to accomplish.
2. Summarize completed work, current state, important decisions, and active constraints.
3. Reference artifacts by path or URL instead of duplicating them.
4. List the next concrete actions in execution order.
5. Name validation already run and validation still needed.
6. Call out blockers, assumptions, risks, and unknowns.
7. Suggest only the Agent skills that would materially help the next agent.

## Output

Use this shape:

```md
# Handoff: <task>

## Purpose
<what the next agent should accomplish>

## Current State
<what is done, partially done, or unchanged>

## Key Decisions
<decisions already made and why>

## Artifacts
- `<path or URL>` - <why it matters>

## Next Actions
1. <concrete next step>
2. <concrete next step>

## Validation
- Run: <checks already run>
- Still needed: <checks/manual review still needed>

## Risks And Unknowns
- <risk or assumption>

## Suggested Skills
- `$skill` - <why it helps>
```

## Guardrails

- Do not paste secrets, tokens, private keys, or unnecessary personal data.
- Do not duplicate long content already captured in plans, PRs, commits, docs, or diffs.
- Do not hide uncertainty.
- Keep it useful to a fresh agent who will not replay the conversation.
