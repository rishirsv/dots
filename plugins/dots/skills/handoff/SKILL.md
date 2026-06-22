---
name: handoff
description: "Creates a concise continuation brief for the current task, branch, PR, plan, or conversation so another agent or future session can pick it up, inline by default or as a file or new Codex thread on request. Explicit-only skill for handing off or continuing work."
---

# Handoff

Create a practical continuation brief for the current task, branch, PR, issue, plan, or conversation.

Default to an inline handoff. Write a file only when the user asks for one, the handoff is too large for chat, or a durable artifact is clearly needed. If saving a file, use the user-requested path; otherwise use a clearly named temporary handoff path and report it.

Thread actions are part of this skill only when the user asks for continuation in a new, forked, or worktree-backed Codex thread.

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
- prior session transcripts only when they are relevant to this handoff.

When running in Codex and prior-session context is needed, use Codex local state
if available:

- `~/.codex/state_5.sqlite` is the session index.
- `~/.codex/sessions` and `~/.codex/archived_sessions` contain rollout JSONL
  transcripts.
- Prefer matching by current repo path, title, first user message, or thread id.
- Read only the relevant transcript portions; summarize and cite paths instead
  of pasting long history.

If a source is unavailable, do not block the handoff. State the missing context
briefly under risks or assumptions and continue from available evidence.

## Codex Thread Handoff

When the user explicitly asks to hand work to a new Codex thread, create the thread after preparing a compact handoff prompt.

Use the smallest matching route:

- **Inline handoff**: user asks for a handoff, recap, or continuation brief.
- **Saved handoff**: user asks to save the handoff or the brief is too large for chat.
- **New thread**: user asks for a new, separate, or fresh Codex thread to continue the work in the same project.
- **New worktree thread**: user asks for a new worktree, isolated workspace, separate branch/worktree, or parallel implementation lane.
- **Forked thread**: user asks to fork this conversation or preserve completed history in the child thread.

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
8. If the user asked for a new thread or worktree continuation, create or fork it using the route above.

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

For a thread-creation prompt, use the same sections plus a short instruction at the top:

```md
Continue this task from the handoff below. Start by reading the referenced files and repo instructions, then proceed with the next actions.
```

## Guardrails

- Do not paste secrets, tokens, private keys, or unnecessary personal data.
- Do not duplicate long content already captured in plans, PRs, commits, docs, or diffs.
- Do not duplicate Work Tracker or Plan content; point the next agent at the
  existing artifact and name what changed since it was written.
- Do not hide uncertainty.
- Keep it useful to a fresh agent who will not replay the conversation.
- Do not create, fork, move, archive, pin, rename, or message Codex threads unless the user explicitly asks for thread management.
- Do not use a worktree thread when the user only asked for a normal handoff.
