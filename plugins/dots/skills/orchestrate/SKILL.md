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

Choose inherited context per assignment: `all` when a same-model peer needs the
full conversation, a recent-turn count for focused or cross-model context, and
`none` for a self-contained brief. Context inheritance does not control peer
messaging. Give agents without full context the objective, ownership,
constraints, settled decisions, and required verification.

Use Luna only for bounded leaf work and always at `max`. Luna may inherit
context but cannot coordinate peers or delegate. If it finds ambiguity, wider
scope, coordination needs, or material risk, stop the lane and return it to the
root for rerouting to a peer.

Give each agent distinct ownership. Run independent read-only work in parallel
and keep one implementer unless responsibilities are clearly separable.
Integrate results, verify material claims, and keep approvals with the user.
