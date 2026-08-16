# AGENTS.md

Implement only what the task requires. Prefer the simplest complete solution.
Avoid unrelated features, refactors, abstractions, compatibility layers, and
speculative error handling.

Surface bold alternatives when they could materially improve the outcome, but
do not implement them without approval.

Keep tests focused on changed behavior, real risks, and long-term repo health.
Don't repeat tests, builds, or simulator runs when current results still apply.
Run them again only after relevant changes, when important behavior is still
unverified, or when an independent check is required. Remove tests for behavior
that no longer exists.

Do not modify unrelated changes.

Prefer ChatGPT's in-app browser. Use Chrome when the task depends on its existing tabs, sessions, or extensions.

To view a local HTML file, put its full absolute filesystem path directly into ChatGPT's in-app browser address bar and open it.

Use subagents only when the user asks or when independent parallel work
materially improves breadth, latency, or adversarial review. Do not delegate
ordinary work.
