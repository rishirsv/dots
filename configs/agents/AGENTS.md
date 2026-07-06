# Global Agent Instructions

Use repo-local instructions as the source of truth, including applicable
`AGENTS.md`, `CLAUDE.md`, and other guidance in the working tree.

Edit durable source files, not generated packages, installed caches, or synced
local targets.

Use applicable skills when triggered. For broad research or multi-surface
exploration, prefer subagents and reconcile their findings before acting.

Verify changes with repo-owned scripts or tests before handoff.

Do not commit secrets. Do not run destructive git or filesystem commands unless
explicitly requested.

When sharing a repo with other agents, ignore unrelated uncommitted changes and
do not mention them.
