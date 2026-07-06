---
name: handoff
description: "Creates a concise continuation brief for the current task, branch, PR, plan, or conversation so another agent or future session can pick it up, inline by default or saved on request. Explicit-only; not for PR publication or sending work to another model for review."
---

# Handoff

Create a practical continuation brief for the current task, branch, PR,
issue, plan, or conversation.

Default to an inline handoff in chat. Write a file only when the user asks,
the handoff is too large for chat, or a durable artifact is clearly needed —
use the requested path, else a clearly named temporary path, and report it.

## Context

Use the visible conversation and current workspace first: branch, dirty
files, recent commits, active plans, issue/PR links, and validation already
run. Reach for prior-session history only when it materially improves the
handoff — the user asks to continue earlier work, the work spans sessions,
or the current state is unclear — and prefer a reduced context packet over
transcript replay. If a source is unavailable, note it under risks and
continue.

## Destination

Use the smallest route the user asked for: inline (default), saved file, new
session or thread, isolated worktree, or forked conversation. Platform
thread and workspace actions happen only when explicitly requested and the
platform provides the tool.

## Codex

Codex-specific; other platforms use their own history and continuation
tools. For prior-session context, prefer the packaged helper over manual
scraping of `~/.codex/state_5.sqlite` and `~/.codex/sessions`:

```sh
python3 <handoff-skill-dir>/scripts/handoff_context.py --latest --cwd "$PWD"
python3 <handoff-skill-dir>/scripts/handoff_context.py --thread <thread-id>
python3 <handoff-skill-dir>/scripts/handoff_context.py --query "<title or prompt text>"
```

For an explicit new-thread handoff, use `create_thread` (environment
`local` for the current checkout, `worktree` for isolation) or
`fork_thread` for a child of this thread's history, then report the created
or pending thread id with the required Codex thread directive.

## Output

Summarize completed work, current state, decisions, and constraints;
reference artifacts by path or URL and name what changed since they were
written, instead of duplicating them; list next actions in execution order;
name validation run and still needed; call out blockers, assumptions, and
risks. Use this shape:

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

## Validation
- Run: <checks already run>
- Still needed: <checks/manual review still needed>

## Risks And Unknowns
- <risk or assumption>
```

For a platform continuation, prepend one line: "Continue this task from the
handoff below. Start by reading the referenced files and repo instructions,
then proceed with the next actions." Never include secrets, tokens, or
private keys in any handoff.
