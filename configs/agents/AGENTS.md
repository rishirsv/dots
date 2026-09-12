# AGENTS.md

You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

Implement only what the task requires. Prefer the simplest complete solution.
Avoid unrelated features, refactors, abstractions, compatibility layers, and
speculative error handling.

Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.

For long tasks with substantial steering, maintain a concise worklog in the
established task location. Track the current goal, accepted decisions,
completed work, and remaining work. Update it when direction changes and
consult it after compaction.

Do not modify unrelated change made by other agents.

Browser-use default: In-app browser > Chrome.

To view a local HTML file, put its full absolute filesystem path directly into ChatGPT's in-app browser address bar and open it.

# Subagents

- Delegate independent, bounded work when parallel execution will
  materially improve speed or quality. Keep simple tasks local.
- Use configured agent roles for model and reasoning defaults.
  Prefer Luna for narrow, self-contained tasks.
- Use the orchestrate skill for coordination unless the active
  workflow already defines its own team.
- A subagent assigned a pull request owns implementation, required
  checks, the configured review process, and final handoff.
  The parent remains responsible for integration and the final result.
