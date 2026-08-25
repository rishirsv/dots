---
name: recall
description: "Use only when the user selects `$recall` to reconstruct recent working context, catch up, or find where work stopped. Reads the smallest relevant Codex task history, optional computer history, shared records, and live state; not for workflow audits or durable self-improvement."
---

# Recall

**Before you start or resume work, rebuild the user's recent working context and
hand back a tight capsule of where things stand now and what to do next.** Use
Recall for “catch me up,” “what have I been working on?”, or “where did I leave
off?”

Keep it tight and on-topic. Read only what the in-scope threads need, then stop.
Use subagents for heavy transcript reading when they save time or context. Keep
the raw transcripts out of the main thread; bring back their findings.

Working context can live in three records:

- **Codex task history** holds what the user asked, what the agent did, and what
  the two decided.
- **Computer history**, when the host exposes it, can fill in relevant work that
  happened outside Codex.
- **The shared record** holds the history around the same code under other
  names: user reports, fixes that shipped and were reverted, incidents, errors,
  tickets, and design decisions.

Do not search all three by ceremony. Start with task history. Use another record
when the question or a concrete gap makes it useful.

## Workflow

### 1. Classify the request

- Read one named Codex task directly with the task tools. It does not need a
  multi-task sweep.
- Use `self-improve` when the goal is to turn repeated friction into a durable
  workflow change.
- Use a supplied state capsule when it already gives the paths, branch,
  decisions, and next step. Do not mine history to rediscover it.

### 2. Lock the scope

Pin the topic, active workspace, and time window before searching. Treat
“recent” as the last seven days unless context supports another range. Never
quietly turn “all” into a recent subset or read another project's tasks without
being asked.

### 3. Read the smallest useful task history

Read [codex-history.md](references/codex-history.md). Use the live task tools to
list recent and archived candidates, then read only matching tasks and relevant
regions. Use the local Codex index and rollout JSONL only when the live tools do
not expose the range or detail the answer needs.

Search one or two tasks directly. For a larger candidate set, split distinct
batches across subagents when that materially saves time or main-thread
context. Order candidates by their real updated time, not task ID. Skip the
current task and obvious subagent, evaluation, and test noise.

For each relevant task, recover the same facts:

- topic and the user's goal;
- decisions already made;
- open threads and next steps;
- struggles, corrections, or failed approaches; and
- artifacts such as PRs, tickets, branches, plans, and reports.

Keep the task ID with each finding.

### 4. Fill a real gap when another record can answer it

If `computer-history` is enabled, use it when outside-Codex activity could
resolve the timeline, locate an artifact, or explain the current state. Ask for
the same topic, workspace, and window. Treat it as supporting evidence, not
permission to widen the search. Skip it silently when the skill is unavailable.

Use `../why/SKILL.md` for the shared record only when the user asks for that
history or task mining leaves a specific unanswered question about a feature,
bug, decision, regression, or current user report. Also use it when the named
target has recent regressions, incidents, reversions, or work spread across
multiple agents. Keep the Why investigation focused. Do not inherit its
exhaustive mode by default.

### 5. Verify what is true now

A transcript, history event, or stale ticket tells you what happened, not what
is true today. Check the branches, diffs, PRs, tickets, and artifacts the search
surfaced against live repository state and `gh` when available. Read the full
rollout JSONL when the answer depends on the exact tools, files, or errors from
an earlier run.

## Output contract

Lead with the capsule, then the thread status, the problems, and the next move.
Deeper detail goes below or gets cut.

- **Capsule.** At most five bullets. Explain what the work is and where it
  stands overall.
- **Threads.** One line each, prefixed with exactly one status tag:
  `[merged #N]`, `[open PR #N]`, `[in flight <branch>]`,
  `[verified, uncommitted]`, `[reverted #N]`, or `[planned, not started]`.
- **Problems.** At most five recurring or blocking problems. Include relevant
  symptoms and fixes that shipped but did not hold.
- **Next move.** The single most useful concrete action.

Keep adjacent work out unless it blocks the named topic. Cut detail before you
cut active threads. Write in plain spoken English. Cite Codex findings by task
ID, computer history by application and timestamp, and shared-record findings
by their native source. Sanitize private context before public output.
