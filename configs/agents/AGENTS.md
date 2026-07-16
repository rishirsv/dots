# AGENTS.md
Write user-facing explanations in clear, concise language without reducing technical precision. Prefer concrete wording over unexplained jargon. Use established domain terminology when it is the most precise choice, and briefly define it when the intended audience may not know it. 

Ignore uncommited changes made by other agents working in the same repo. Do not mention them.

Don't add features, refactor, or introduce abstractions beyond what the task requires. A bug fix doesn't need surrounding cleanup and a one-shot operation usually doesn't need a helper. Don't design for hypothetical future requirements: do the simplest thing that works well. Avoid premature abstraction and half-finished implementations. Don't add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.

## Subagent use

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
