---
name: recall
description: "Use only when the user selects `$recall` to reconstruct recent working context, catch up, or find where work stopped. Reads the smallest relevant Codex task history, optional computer history, shared records, and live state; not for workflow audits or durable self-improvement."
---

# Recall

**Before you start or resume work, you rebuild the user's recent working context and hand back a tight capsule of where things stand now and what to do next.** Use for "recall my work on X", "catch me up", "what have I been working on", or "where did I leave off".

Keep it tight and on-topic. Read only what the in-scope threads need, then stop. The heavy reading fans out to parallel subagents. The main thread keeps only their findings and the final brief.

Your context can live in three records. Your Codex task history holds what you did and decided. Computer history, when the host exposes a `computer-history` skill, holds relevant activity outside Codex. The shared record holds everything that happened around the same code under other names: the symptoms users keep reporting, the fixes that shipped and got reverted, the errors still firing in prod. That shared record is what the `why` skill searches, across source control, the issue tracker, chat and issue channels, long-form docs, and error tracking. A feature with a long bug tail keeps most of its story there, so don't reconstruct it from your transcripts alone.

1. Classify, then route. One specific named Codex task can be read directly with the task tools, without a multi-thread recall sweep. Turning habits into durable workflow improvements is `self-improve`. A human-readable summary of supplied material is a different task. Recall loads working context across recent tasks before you act. If the user already gave you a full state capsule (paths, branch, the change), use it and skip the mining.
2. Lock the scope before searching. Pin the window ("recent" is a real range, default the last 7 days), the topic if named, and the workspace (default the active one; never read another project's tasks without being asked). State the scope back. Never quietly turn "all" into "recent N".
3. Read [codex-history.md](references/codex-history.md), then fan out across Codex task history. Use the live task tools first to list recent and archived candidates and read only the selected tasks. When the live tools do not expose the required range, tool evidence, or full transcript, use the local Codex index and rollout JSONL through the `self-improve` helper. Spawn parallel subagents on the available fast model, each taking a distinct batch of candidates, since searching transcripts is grunt work. Tell every subagent to order candidates by real updated time and never by task id, search the topic first and then read only the matching tasks and only their relevant regions, and skip the current task plus obvious noise (subagent, eval, and test tasks). Each returns the same schema, one block per task: topic, the user's goal, decisions, open threads, struggles and corrections, and artifacts (PRs, tickets, branches), each citing the task id. For one or two tasks, skip the fan-out and search directly. The raw transcripts stay in the subagents. The main thread gets only their findings.
4. If the host exposes a skill named `computer-history`, invoke it in parallel for the same topic, workspace, and time window. Ask it for only the activity needed to resolve the working timeline, artifacts, or current state. Treat computer history as supporting evidence, not permission to widen scope, and cite the application and timestamp it returns. Skip it silently when the skill is not enabled; do not invent a substitute or claim that the system was searched.
5. Sweep the shared record whenever the topic names a feature, file, subsystem, area, or bug. This is the default, not a judgment call, and "my work on X" does not exempt it. A named target carries history you never see in your own transcripts, and that history is the point of the sweep. Read and use `../why/SKILL.md`, but steer its question from "why was this built this way" to "what's the current state, what's been tried and didn't hold, and what are users still reporting". Reuse its per-source playbooks so you don't reinvent each query vocabulary, run the investigators in parallel with the task-history mining, and inherit its posture: one investigator per source, null results are findings, skip an unavailable source and say so. Fold what comes back into the brief. Skip this step only for pure activity recall with no named target ("what did I do this week"), where your own history and live state are the entire answer.
6. Verify against live state. A transcript, computer-history event, or stale ticket is history, not current truth, so take the PRs, branches, and tickets that the mining and the sweep surfaced and check them with `git`, and with `gh` when it is installed and authenticated. When the answer hinges on what an agent actually did (the tools it ran, files it read, errors it hit), read the full rollout transcript, not just a task summary or trimmed rendering.
7. Write the brief to the contract below. Group by thread. Stay on the named topic.

## Output contract

Lead with the capsule, then the thread status, then the problems, then the next move. Deeper detail goes below or gets cut.

- **Capsule.** At most 5 bullets. What this work is and where it stands overall.
- **Threads.** One line each, prefixed with exactly one status tag: `[merged #N]`, `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted #N]`, or `[planned, not started]`. A thread with no tag is not done yet, so tag it.
- **Problems.** At most 5, the recurring ones. Include the symptoms users keep reporting and any fix that shipped and was reverted, so the next attempt starts where the last one failed.
- **Next move.** The single most useful next action, concrete.

An adjacent feature or ticket stays out unless it blocks this one. When the capsule and thread lines outgrow a screen, cut detail before you cut threads. Write the brief in plain spoken English, cite Codex findings by task id, computer-history findings by application and timestamp, and shared-record findings by their source (PR #, ticket ID, chat permalink, error-tracker issue). Sanitize private context before any public output.

**Reply:** the brief, to the contract above.
