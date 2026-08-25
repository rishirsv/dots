---
name: handoff
description: "Use only when the user selects `$handoff` to create a continuation brief for the current task, branch, PR, plan, or conversation, inline by default or saved on request; not for PR publication or external-model review."
---

# Handoff

Create a practical continuation brief for the current task, branch, PR,
issue, plan, or conversation.

Default to an inline handoff in chat. Write a file only when the user asks,
the handoff is too large for chat, or a durable artifact is clearly needed,
use the requested path, else a clearly named temporary path, and report it.

Use a handoff at a phase boundary when the next agent should inherit the work,
not the whole discussion: research to decision, decision to implementation,
implementation to verification, one pull request to its dependent, or local
proof to release. Name the phase that ended and the next atomic objective.

## Context

Use the visible conversation and current workspace first: branch, dirty
files, recent commits, active plans, issue/PR links, and validation already
run. Reach for prior-session history only when it materially improves the
handoff, the user asks to continue earlier work, the work spans sessions,
or the current state is unclear, and prefer a reduced context packet over
transcript replay. If a source is unavailable, note it under risks and
continue.

Compress by decision relevance. Keep settled decisions that constrain future
work, current state, reusable proof, live artifacts, unresolved questions, and
the next execution seam. Omit repeated narration, raw tool logs, superseded
plans, rejected alternatives that no longer guard a boundary, and unrelated
project history. Preserve a rejected direction only when repeating it is a
credible risk; label it as an exclusion rather than retelling the debate.

## Destination

Use the smallest route the user asked for: inline (default), saved file, new
session or thread, isolated worktree, or forked conversation. Platform
thread and workspace actions happen only when explicitly requested and the
platform provides the tool.

For a fresh continuation, make the brief self-contained enough to execute
without opening the source transcript. Point to authoritative files instead of
copying them, state what changed since each artifact was written, and identify
which existing verification remains reusable so the next agent does not repeat
valid work.

## Codex

For prior-session context in Codex, prefer available platform thread tools.
Use the packaged helper only when those tools are unavailable; do not scrape
`~/.codex/state_5.sqlite` or rollout files manually:

```sh
python3 <handoff-skill-dir>/scripts/handoff_context.py --latest --cwd "$PWD"
python3 <handoff-skill-dir>/scripts/handoff_context.py --thread <thread-id>
python3 <handoff-skill-dir>/scripts/handoff_context.py --query "<title or prompt text>"
```

For an explicit new-thread handoff, use `create_thread` (environment
`local` for the current checkout, `worktree` for isolation) or
`fork_thread` for a child of this thread's history, then report the created
or pending thread id with the required Codex thread directive.

## Claude

For Claude-style handoffs, keep the brief self-contained and file/path based.
Reference repo instructions such as `CLAUDE.md` or `AGENTS.md` when they exist,
but do not rely on Codex thread ids, rollout files, or Codex-only continuation
tools.

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

## Scope
- In: <work the continuation owns>
- Out: <superseded or explicitly excluded work>

## Artifacts
- `<path or URL>` - <why it matters>

## Next Actions
1. <concrete next step>

## Validation
- Run: <checks already run>
- Reusable evidence: <proof that still applies and under what checkout/configuration>
- Still needed: <checks/manual review still needed>

## Risks And Unknowns
- <risk or assumption>
```

For a platform continuation, prepend one line: "Continue this task from the
handoff below. Start by reading the referenced files and repo instructions,
then proceed with the next actions." Never include secrets, tokens, or
private keys in any handoff.
