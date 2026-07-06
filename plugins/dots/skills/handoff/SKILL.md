---
name: handoff
description: "Creates a concise continuation brief for the current task, branch, PR, plan, or conversation so another agent or future session can pick it up, inline by default or saved on request. Explicit-only; not for PR publication or sending work to another model for review."
---

# Handoff

Create a practical continuation brief for the current task, branch, PR, issue, plan, or conversation.

Default to an inline handoff. Write a file only when the user asks for one, the handoff is too large for chat, or a durable artifact is clearly needed. If saving a file, use the user-requested path; otherwise use a clearly named temporary handoff path and report it.

Platform thread, session, fork, or workspace actions are part of this skill only
when the user explicitly asks for that destination and the current platform
provides the required tool.

## Context Sources

Use the visible conversation and current workspace first. Add local history only
when it would make the handoff more accurate, when the user asks to continue
from an earlier session, or when the current state is unclear.

Useful context, when available:

- current directory, branch, worktree, dirty files, and relevant recent commits;
- active plans, Work Tracker items, notes, issue/PR links, and handoff files;
- validation commands already run, with pass/fail state;
- memories or project instructions that affect how the next agent should work;
- Chronicle or similar activity logs for recent task history;
- prior session or conversation transcripts only when they are relevant to this
  handoff.

Use platform or transcript history only when it would materially improve the
handoff: the user asks for it, the work spans sessions, the current state is
unclear, or the next continuation needs evidence from an earlier conversation.
Prefer a reduced context packet over raw transcript replay.

If a source is unavailable, do not block the handoff. State the missing context
briefly under risks or assumptions and continue from available evidence.

## Destination

Choose the destination before creating or saving anything, then use the smallest
matching route:

- **Inline handoff**: no destination is requested; answer in chat.
- **Saved handoff**: the user asks for a file, path, durable note, or saved
  brief.
- **New session or thread**: the user asks for a new, separate, or fresh
  continuation in the same project or workspace.
- **Isolated workspace**: the user asks for a new worktree, isolated workspace,
  separate branch/worktree, or parallel implementation lane.
- **Forked conversation**: the user asks to fork this conversation, preserve
  completed history in the child session, or continue from this exact transcript
  state.

Do not upgrade an inline or saved handoff into a new session because it seems
useful. Do not use an isolated-workspace route unless isolation, a worktree, or
a parallel lane is part of the user's request.

For any platform continuation, the prompt should include the handoff content,
intended outcome, relevant paths or URLs, current branch/workspace assumptions,
validation already run, validation still needed, blockers, and next actions. Do
not include secrets or unnecessary personal data.

## Codex Transcript Helper

This subsection is Codex-specific. Agents that are not running in Codex should
ignore it and use their own platform's transcript or history tools, if any.

When running in Codex and prior-session context is needed, use Codex local state
if available:

- `~/.codex/state_5.sqlite` is the session index.
- `~/.codex/sessions` and `~/.codex/archived_sessions` contain rollout JSONL
  transcripts.
- Prefer matching by current repo path, title, first user message, or thread id.
- Read only the relevant transcript portions; summarize and cite paths instead
  of pasting long history.

If the packaged helper is available, offer or use it instead of manual
transcript scraping:

```sh
python3 <handoff-skill-dir>/scripts/handoff_context.py --latest --cwd "$PWD"
python3 <handoff-skill-dir>/scripts/handoff_context.py --thread <thread-id>
python3 <handoff-skill-dir>/scripts/handoff_context.py --query "<title or prompt text>"
```

The helper discovers Codex state through `CODEX_HOME` or `~/.codex`, uses the
current working directory by default for project matching, and emits a reduced
packet rather than raw transcript replay. Use the packet as evidence for the
handoff; do not paste unnecessary transcript content.

## Codex Thread Handoff

This subsection is Codex-specific. Agents that are not running in Codex should
ignore it and use their own platform's continuation tools, if any.

When the user explicitly asks to hand work to a new Codex thread, create the
thread after preparing a compact handoff prompt.

Use `create_thread` for a new standalone continuation. For repo-scoped work, target the saved project and choose:

- `environment: { type: "local" }` when the next thread should use the current project checkout.
- `environment: { type: "worktree" }` when the next thread should run in an isolated worktree.

Use `fork_thread` when the user wants a child thread derived from this thread's completed history. Use a same-directory fork for shared-checkout continuation and a worktree fork for isolated continuation.

The new thread prompt should include the handoff content, the intended outcome, relevant paths or URLs, current branch/worktree assumptions, validation already run, validation still needed, blockers, and next actions. Do not include secrets or unnecessary personal data.

After a successful `create_thread`, report the created thread using the required Codex thread directive in the final response. If worktree setup is queued and returns a pending worktree id, report that pending id instead. After a successful `fork_thread`, report the child thread id or pending worktree id returned by the app.

## Workflow

1. Identify what the next session is supposed to accomplish.
2. Gather only the context needed to make the handoff accurate.
3. Summarize completed work, current state, important decisions, and active constraints.
4. Reference artifacts by path or URL instead of duplicating them. If a Work
   Tracker item or Plan exists, link it and summarize only the delta.
5. List the next concrete actions in execution order.
6. Name validation already run and validation still needed.
7. Call out blockers, assumptions, risks, and unknowns.
8. If the user asked for a platform continuation, use the matching platform tool
   only when it is available and requested.

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
```

For a platform-continuation prompt, use the same sections plus a short
instruction at the top:

```md
Continue this task from the handoff below. Start by reading the referenced files and repo instructions, then proceed with the next actions.
```

## Guardrails

- Do not paste secrets, tokens, private keys, or unnecessary personal data.
- Do not duplicate long content already captured in plans, PRs, commits, docs,
  or diffs — including Work Tracker or Plan items; point the next agent at the
  existing artifact and name what changed since it was written.
- Do not create, fork, move, archive, pin, rename, or message platform threads
  or sessions unless the user explicitly asks for thread/session management.
