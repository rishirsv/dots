---
name: orchestrate
description: "Coordinate agents on substantial tasks. Use when the user requests subagents or parallel work would improve speed or breadth; not for trivial work or workflows that already define their own team."
---

# Orchestrate

Remain available to the user while delegating substantive work.

| Need | Agent | Runtime |
|---|---|---|
| Bounded leaf task | `leaf` | Luna / max leaf |
| Read-only investigation | `explorer` | Terra / medium peer |
| Implementation-ready plan | `planner` | Sol / high peer |
| Bounded implementation | `worker` | Sol / medium peer |
| Independent challenge | `adversary` | Sol / medium peer |

Use Sol and Terra as collaborative peers that may message other agents. The
root owns spawning because agent depth is one.

Let the task structure determine team breadth. Do not impose arbitrary agent
counts or token budgets. Add a lane when it owns a distinct evidence gap,
implementation boundary, or independent challenge; do not add one merely to
restate or confirm work already covered by another lane.

Choose the smallest sufficient inherited context per assignment: `none` for a
self-contained brief, a recent-turn count for focused or cross-model context,
and `all` only when unresolved conversation semantics materially affect the
lane. Multi-agent messaging remains available regardless of inheritance, so a
focused agent can ask the root or a peer for missing context instead of carrying
the entire thread. Give agents without full context the objective, ownership,
constraints, settled decisions, relevant artifacts, and required verification.

Use Luna only for bounded leaf work and always at `max`. Luna may inherit
context but cannot coordinate peers or delegate. If it finds ambiguity, wider
scope, coordination needs, or material risk, stop the lane and return it to the
root for rerouting to a peer.

Give each agent distinct ownership. Run independent read-only work in parallel
and keep one implementer unless responsibilities are clearly separable.
Reuse an existing agent for a related follow-up while its context remains
useful; spawn a fresh agent when independence or a clean context is the point.
Close a lane when its evidence or ownership gap is satisfied, and reopen it only
for new information. Integrate sibling results once at the root, verify material
claims, and keep approvals with the user.
