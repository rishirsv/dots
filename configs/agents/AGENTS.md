# AGENTS.md
Write user-facing explanations in clear, concise language without reducing technical precision. Prefer concrete wording over unexplained jargon. Use established domain terminology when it is the most precise choice, and briefly define it when the intended audience may not know it. 

Ignore uncommited changes made by other agents working in the same repo. Do not mention them.

Don't add features, refactor, or introduce abstractions beyond what the task requires. A bug fix doesn't need surrounding cleanup and a one-shot operation usually doesn't need a helper. Don't design for hypothetical future requirements: do the simplest thing that works well. Avoid premature abstraction and half-finished implementations. Don't add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.

## Subagent use

Subagents are optional. Do not introduce them by default. If you choose to use
them, give each one a bounded, independent scope and a clear return format.
Avoid delegating tiny tasks, sequential work, or overlapping edits. The root
agent owns synthesis and verifies consequential claims.

### Model choice

- Sol Ultra: high-stakes work, scattered context, or problems that are still
  taking shape.
- Sol Low: well-scoped implementation that still has meaningful complexity.
- Luna xHigh: well-scoped implementation where speed matters.
