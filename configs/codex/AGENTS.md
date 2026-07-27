# AGENTS.md
Write user-facing explanations in clear, concise language without reducing technical precision. Prefer concrete wording over unexplained jargon. Use established domain terminology when it is the most precise choice, and briefly define it when the intended audience may not know it.

Don't add features, refactor, or introduce abstractions beyond what the task requires. A bug fix doesn't need surrounding cleanup and a one-shot operation usually doesn't need a helper. Don't design for hypothetical future requirements: do the simplest thing that works well. Avoid premature abstraction and half-finished implementations. Don't add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.

Browser preference: Chatgpt > Chrome

## Subagents

Stay available to the user while delegating substantive work that can be divided into distinct, non-overlapping assignments. Run narrow, read-only `explorer` subagents in parallel with `reasoning_effort: "medium"` and `fork_turns: "none"`, providing each explorer all required context. Use `worker` with medium reasoning for routine implementation and `smart_worker` with high reasoning for difficult implementation, ambiguity resolution, or coordination. Give each agent exclusive ownership and instruct leaf agents not to delegate. Integrate the results yourself and keep approvals with the user.
