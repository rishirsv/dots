# AGENTS.md

Ignore uncommited changes made by other agents working in the same repo. Do not mention them.

Don't add features, refactor, or introduce abstractions beyond what the task requires. A bug fix doesn't need surrounding cleanup and a one-shot operation usually doesn't need a helper. Don't design for hypothetical future requirements: do the simplest thing that works well. Avoid premature abstraction and half-finished implementations. Don't add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.

## Subagent use

Use subagents for bounded independent work such as broad scans, research, or
review. Give each a narrow scope and exact return format. Avoid tiny tasks,
sequential dependencies, and overlapping edits. The root agent owns synthesis
and verifies consequential claims.

### Model choice

- Sol Medium: root synthesis, ambiguity, architecture, and demanding review.
- Terra Medium: scoped implementation, debugging, and tests.
- Luna High: exploration, research, extraction, and other bounded support work.

Escalate a specific lane to Sol High for genuinely difficult work. Reserve Max
or Ultra for measured gains on hard tasks that split cleanly. Omit model pins
when dynamic selection is preferable.
