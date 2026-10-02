---
name: recall
description: "Use only when the user selects `$recall` to reconstruct recent working context, catch up, or find where work stopped. Reads the smallest relevant Codex or Claude task history, optional computer history, shared records, and live state; not for workflow audits or durable self-improvement."
---

# Recall

Rebuild the user's recent working context and give them a brief account of where
things stand and what to do next. Use Recall for “catch me up,” “what have I
been working on?”, or “where did I leave off?”

Start with agent task history. Use computer history or shared project records
only when the question or a concrete gap makes them useful. Keep raw transcripts
out of the answer.

## Workflow

1. **Classify the request.** Read one named task directly. Use `self-improve`
   when the goal is a durable workflow change. Use a supplied summary of current
   state instead of searching the same history again.
2. **Set the scope.** Identify the topic, workspace, host, and time window.
   Treat “recent” as seven days unless context supports another range. Never
   narrow “all” or cross projects silently.
3. **Read the smallest useful task history.** Read [Session
   history](../../references/session-history.md), list candidates, and inspect
   only matching tasks and relevant regions. Order them by updated time, not
   task ID. Skip the current task and obvious tasks created only for subagent
   work, evaluations, or tests.
4. **Recover the useful facts.** Capture the goal, decisions, open work,
   corrections or failed approaches, and artifacts such as PRs, tickets,
   branches, plans, and reports. Keep the task ID with each finding.
5. **Fill a real gap.** Use `computer-history` when outside-agent activity could
   resolve the timeline or locate an artifact. Use `../why/SKILL.md` when a
   specific unanswered question needs repository or product history.
6. **Verify what is true now.** Check the branches, diffs, PRs, tickets, and
   artifacts you found against their current state. A transcript says what
   happened, not what remains true.

## Output contract

Start with a brief summary of current state, called the capsule. Then give
thread status, recurring problems, and the next action. Put necessary detail
after these items; omit detail that does not help the user continue.

- **Capsule.** A short bulleted summary of what this work is and where it stands
  overall.
- **Threads.** One line each with a supported status: `[merged #N]`, `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted #N]`, or
  `[planned, not started]`. Use `[blocked]`, `[complete, no PR]`, or `[status unverified]` when those are more accurate; absence of access is not evidence
  that work is unstarted or complete.
- **Problems.** The recurring ones only. Include the symptoms users keep
  reporting and any fix that shipped and was reverted, so the next attempt
  starts where the last one failed.
- **Next move.** The single most useful next action, concrete.

An adjacent feature or ticket stays out unless it blocks this one. If the
capsule and thread lines do not fit on one screen, remove detail before removing
threads. Write the brief in plain spoken English, cite Codex findings by task
id, computer-history findings by application and timestamp, and shared-record
findings by their source (PR #, ticket ID, chat permalink, error-tracker issue).
Sanitize private context before any public output.

**Reply:** the brief, to the contract above.
