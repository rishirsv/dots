# AGENTS.md
Write user-facing explanations in clear, concise language without reducing technical precision. Prefer concrete wording over unexplained jargon. Use established domain terminology when it is the most precise choice, and briefly define it when the intended audience may not know it. 

Ignore uncommited changes made by other agents working in the same repo. Do not mention them.

Don't add features, refactor, or introduce abstractions beyond what the task requires. A bug fix doesn't need surrounding cleanup and a one-shot operation usually doesn't need a helper. Don't design for hypothetical future requirements: do the simplest thing that works well. Avoid premature abstraction and half-finished implementations. Don't add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.

## Subagent use

Use subagents for bounded independent work such as broad scans, research, or
review. Give each a narrow scope and exact return format. Avoid tiny tasks,
sequential dependencies, and overlapping edits. The root agent owns synthesis
and verifies consequential claims.

### Model choice

- Sol Medium: root synthesis, ambiguity, architecture, consequential review,
  and final judgment.
- Luna Max: scoped implementation and tests when the brief and completion
  criteria are clear.
- Luna High: bounded research, extraction, reference comparison, and codebase
  scans with a defined output.
- Terra Medium: unclear bugs, unfamiliar business logic, broad repository
  exploration, and tool-heavy investigation where the worker must determine
  what should be done.

Escalate a specific lane to Sol High for genuinely difficult work. Reserve
Ultra for measured gains on hard tasks that split cleanly. Omit model pins when
dynamic selection is preferable.

## Local resource lifecycle

Treat detached servers, browser mirrors, simulators, recordings, background
terminals, SSH sessions, and MCP workers as owned resources with an explicit
lifetime. Stop resources owned by the task before the final response unless
the user explicitly requests a bounded handoff or persistent session. For a
bounded handoff, record or report its expiry; for a persistent session, report
the exact stop command. Never use broad `pkill` or `killall` cleanup when the
owning PID, process start time, session, simulator, port, or worktree can be
identified.

Keep local concurrency proportional to the machine and workload. Reuse or
continue an existing task when it has the same outcome instead of starting a
duplicate. Prefer one runtime-owning task per shared simulator, browser, or
desktop surface; other tasks may perform independent read-only or build work.
Before delegating more work, account for active root tasks and already-running
subagents rather than treating the per-task thread limit as a global budget.
