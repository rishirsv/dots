# Recovery

Read this at the start of a session with active work, after context loss, or
when saved and live state disagree.

## Reconcile Before Dispatch

1. Read project instructions, `STAFF.md`, `BOARD.md`, and every `work/*.md`.
2. Query the recorded native tasks. Follow [thread access](threads.md) when live
   tools cannot expose them.
3. Inspect only the relevant bases, branches, worktrees, pull requests,
   canonical plans, validation receipts, and external systems.
4. Compare saved intent, live task state, and repository evidence.
5. Resolve mismatches and regenerate the board before new dispatch.

Join every active task to its recorded checkout, base, branch or pull request,
and write scope. Treat a missing or conflicting join as an ownership problem
before redispatching or landing work.

| Saved state | Current evidence | Action |
|---|---|---|
| `active` | Task is running under the expected owner | Continue |
| `active` | Task returned or stopped | Move to `verify` |
| `active` | Task is unavailable | Move to `waiting`; inspect its checkout before redispatching |
| `ready` | No task exists | Dispatch if still authorized and ready |
| `waiting` | Its dependency is resolved | Reassess authority, then move to `ready` |
| `verify` | Required evidence is complete | Reconcile, refresh the board, and remove the record |
| `verify` | Evidence remains open | Keep the record and name the gap |
| No record | Related task or worktree exists | Resolve ownership before steering it |

When a task is unavailable, inspect its checkout, branch, commits, files, and
external effects before redispatching. Do not assume its work vanished.

Regenerate `BOARD.md` from canonical plans, reconciled active work, unresolved
owner decisions, and verified evidence. If canonical sources conflict, name
them and ask for the smallest authority decision.

Finish recovery when every active record has one owner and next transition, the
board matches current evidence, and no new dispatch would overlap unresolved
ownership. Brief the user on recovered work, missing tasks, open proof, and the
next action.
