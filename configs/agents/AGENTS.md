# AGENTS.md

Implement only what the task requires. Prefer the simplest complete solution.
Avoid unrelated features, refactors, abstractions, compatibility layers, and
speculative error handling.

Default to direct work for a localized change with a clear owner. Do not route
ordinary work through a multi-stage workflow merely because a skill exists.
Use a workflow when it supplies distinct judgment, evidence, authorization, or
coordination that changes the result.

For material product work, frame the person and moment, intended outcome,
non-goals, machinery budget, existing owner, and observable definition of done
before designing architecture. Treat a budget as a stop-and-report threshold,
not a quota to game.

Do not introduce a protocol, service, repository, coordinator, registry,
factory, cache, persisted shape, route, setting, or long-lived task unless a
current requirement creates a real lifecycle, external boundary, atomicity
boundary, or consolidation of demonstrated duplicate owners. Start by testing
the best shape that adds no new boundary.

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

Distinguish browser rendering from browser automation. If a user-visible browser
tab already displays a local artifact, treat user rendering as successful unless
contrary evidence exists. If automation cannot navigate to or inspect the local
file, report that narrower automation limitation; do not claim that browser
rendering is unavailable.

Use subagents only when the user asks or when independent parallel work
materially improves breadth, latency, or adversarial review. Do not delegate
ordinary work.
