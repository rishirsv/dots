---
name: self-improve
description: "Use only when the user selects `$self-improve` to learn from agent work, diagnose workflow or harness friction, evaluate how they work with agents, or find durable improvements across Codex or Claude sessions. Not for static skill review, product fixes, or reconstructing context without improvement."
---

# Self-Improve

Learn from agent work and turn supported findings into the smallest useful
improvement. Treat counts and helper output as leads; base conclusions on the
conversation, tool calls, files, and observed outcome.

## Choose the route

Use the active task unless the user names another task, project, window, or
history. Load only the selected branch:

- **Task reflection, default.** Use current context. Read history only to fill a
  specific gap.
- **Workflow or harness friction.** Read
  [workflow-audit.md](references/workflow-audit.md).
- **Repeated work or a named skill.** Read
  [thread-evidence.md](references/thread-evidence.md). For a named skill also
  read [skill-analytics.md](references/skill-analytics.md).
- **User coaching or rating.** Read
  [user-coaching.md](references/user-coaching.md). This route is report-only.
- **Usage insights.** Read [insights-report.md](references/insights-report.md).
  This route is report-only.

When a route needs earlier tasks, read
[Session history](../../references/session-history.md). Use the current host
unless the user names another. Analyze Codex and Claude evidence separately
before comparing them.

Run helper commands from this skill directory. Relative `scripts/` paths in
the selected references assume that working directory. Pass `--platform` when
the requested host differs from the current one.

## Judge the work

1. Reconstruct the request, intended outcome, actual path, user corrections,
   and observed proof. A confident completion message is not proof by itself.
2. Separate observed causes from plausible explanations. Keep uncertainty when
   the evidence does not establish causation.
3. Require repeated evidence only when generalizing beyond the task. One task
   can support a narrow correction to that task or an exact durable behavior the
   user explicitly requests.

Compare the actual path with the shortest defensible path while preserving
discoveries that affected the result. State what worked, what caused friction,
its effect, and the most useful next move. A valid result may find no reusable
lesson.

For repeated work, freeze a bounded read set before reviewing it. Deduplicate
retries and delegated children under the parent session, inspect successful and
friction examples, preserve contradictions, and use the generalization gate in
[thread-evidence.md](references/thread-evidence.md).

## Propose or apply improvements

For a durable change, name the behavior, closest owner, smallest change, and how
to verify it. Include a counterexample or uncertainty only when it could change
the decision. Read [instructions.md](references/instructions.md) only for
proposals targeting `AGENTS.md`, `CLAUDE.md`, or `.claude/rules/*.md`.

Do not edit until the user approves a concrete proposal unless the original
request already authorized implementation. Approval does not expand ownership:
apply changes through the owning workflow. Report-only routes never edit, and
generated memory stores are never edited directly.

Lead with the conclusion. Include only the evidence and coverage needed to
judge it.
