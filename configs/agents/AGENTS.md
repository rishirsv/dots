# AGENTS.md

Ignore uncommited changes made by other agents working in the same repo. Do not mention them.

Don't add features, refactor, or introduce abstractions beyond what the task requires. A bug fix doesn't need surrounding cleanup and a one-shot operation usually doesn't need a helper. Don't design for hypothetical future requirements: do the simplest thing that works well. Avoid premature abstraction and half-finished implementations. Don't add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.

## Subagent use

Use subagents for bounded parallel work: broad scans, independent review,
research, visual critique, or noisy evidence gathering. Give each lane a narrow
scope, constraints, and exact return format. You own synthesis: verify claims
before acting, and do not delegate tiny tasks where coordination costs more than
doing the work directly.

### Model choice

- `gpt-5.6`: Start here for demanding agents. It’s strongest for ambiguous, multi-step work that needs planning, tool use, validation, and follow-through across a larger context.
- `gpt-5.6-terra`: Use for agents that favor speed and efficiency over depth, such as exploration, read-heavy scans, large-file review, or processing supporting documents. It works well for parallel workers that return distilled results to the main agent.
- `gpt-5.3-codex-spark`: Use for near-instant, text-only iteration when latency matters more than broader capability.

Omit `model` and `model_reasoning_effort` when the role benefits more from Codex
choosing dynamically than from stable behavior. When pinning them, use `medium`
as the balanced default, `low` for straightforward latency-sensitive work, and
`high` when the agent must trace complex logic, check assumptions, or work
through edge cases. Reserve `xhigh` and `max` for measured quality gains on the
hardest workloads. Compare model and effort changes on representative tasks;
higher effort is not automatically the best tradeoff.
