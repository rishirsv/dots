---
name: orchestrate
description: "Coordinate agents on substantial tasks. Use when the user requests subagents or parallel work would improve speed or breadth; not for trivial work or workflows that already define their own team."
---

# Orchestrate

Remain available to the user while delegating substantive work.

| Need | Agent |
|---|---|
| Bounded leaf task | `leaf` |
| Read-only investigation | `explorer` |
| Implementation-ready plan | `planner` |
| Bounded implementation | `worker` |
| Independent challenge | `adversary` |

Use the available role definitions for model, reasoning effort, tool access,
and delegation limits. Honor explicit model choices and preserve deliberately
configured cost and capability tiers. The coordinator owns task assignment and
integration; use the host's current concurrency and nesting limits.

Delegate only when an agent has a clear expected benefit: faster completion,
broader coverage, specialized work, or independent challenge. If the root can
complete the work just as well without delegation, work directly. When
delegating, give each agent its objective, ownership, constraints, relevant
artifacts, and required verification.

Use the smallest sufficient inherited context: `none` for a self-contained
brief, recent turns for focused context, and `all` only when the conversation
materially affects the work. Messaging remains available regardless of
inheritance.

Use `leaf` for bounded independent work. If the assignment needs wider scope,
coordination, or a consequential decision, return that issue to the parent.

Run independent read-only work in parallel. Keep one implementer unless changes
are clearly independent. Before multiple implementation lanes work across a
shared interface, assign that interface to one owner.

Reuse an agent while its context remains useful; use a fresh agent when
independence matters. Integrate at the root, verify material claims, and keep
approvals with the user.
