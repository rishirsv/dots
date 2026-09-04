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

Delegate when independent work could materially improve speed, breadth,
specialized quality, or adversarial review. When two or more substantive
read-only lanes are independent, run them in parallel unless coordination
overhead would erase the benefit. Keep trivial, tightly coupled, or inherently
serial work in the root.

Give each agent its objective, ownership, constraints, relevant artifacts, and
required verification. Use the smallest sufficient inherited context: `none`
for a self-contained brief, recent turns for focused context, and `all` only
when the conversation materially affects the work. Messaging remains available
regardless of inheritance.

Use Luna only for bounded leaf work and always at `max`. If the task becomes
wider, coordinated, or materially risky, have the leaf complete every unblocked
part inside its ownership and return the exact issue to the root.

Run independent read-only work in parallel. Keep one implementer unless changes
are clearly independent. Before multiple implementation lanes work across a
shared interface, assign that interface to one owner.

Reuse an agent while its context remains useful; use a fresh agent when
independence matters. Integrate at the root and verify material claims. Keep a
destructive, irreversible, or external-write decision with the user only when
existing authorization does not already cover it.
