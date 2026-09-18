---
name: orchestrate
description: "Coordinate agents on substantial tasks. Use when the user requests subagents or parallel work would improve speed or breadth; not for trivial work or workflows that already define their own team."
---

# Orchestrate

Remain available to the user while delegating substantive work.

| Need | Agent |
|---|---|
| Narrow, self-contained execution | `luna` |
| Read-only investigation | `explorer` |
| Focused decision or implementation plan | `consultant` |
| Complete interface, type, and state design | `architect` |
| Bounded implementation | `worker` |
| Independent challenge | `adversary` |

Use the available role definitions for model, reasoning effort, tool access,
and delegation limits. Honor explicit model choices and preserve deliberately
configured cost and capability tiers. The coordinator owns task assignment and
integration; use the host's current concurrency and nesting limits.

Claude roles inherit the parent's model; the Codex model tiers do not apply
there. Their read-only instructions and disabled Write/Edit tools are not an
OS sandbox. Use shell and connector tools only for inspection in read-only roles.

Delegate only when an agent has a clear expected benefit: faster completion,
broader coverage, specialized work, or independent challenge. If the root can
complete the work just as well without delegation, work directly. When
delegating, give each agent its objective, ownership, constraints, relevant
artifacts, and required verification.

Use the smallest sufficient inherited context: `none` for a self-contained
brief, recent turns for focused context, and `all` only when the conversation
materially affects the work. Messaging remains available regardless of
inheritance.

Start or reuse `consultant` only for a concrete consequential question that
needs a second opinion. Share its identifier with agents that need the answer.
Send the question, evidence, constraints, and options; the assigned implementer
retains ownership. The `$advisor` skill instead runs an explicitly requested
command-line model and owns that separate workflow.

Choose `architect` when the deliverable is a complete design candidate, with
caller usage, types, state ownership, and invariants. Supply the task, relevant
grounding, and [runner prompt](../architect/references/runner-prompt.md).
Consultant and architect are alternative assignments; neither is a prerequisite
for the other. Use a fresh architect when independent judgment matters.

Use peer messaging when available and permitted by the role. Otherwise, route
the question and answer through the parent; consultation does not require
nested delegation. Scope changes and shared-interface decisions still go to
the coordinator.

Before assigning Luna, resolve material ambiguity and provide the required
inputs, exact scope, completion criteria, and concrete stop conditions. Default
to `fork_turns: none` with a self-contained brief. The parent evaluates whether
the result satisfies the task.

Run independent read-only work in parallel. Keep one implementer unless changes
are clearly independent. Before multiple implementation lanes work across a
shared interface, assign that interface to one owner.

Do not duplicate an active agent's assigned work. Continue independent work
while it runs, then use event-driven waits within the host's limits. Intervene
for blockers, material scope changes, or evidence that the work is going off
track.

Reuse an agent while its context remains useful; use a fresh agent when
independence matters. Integrate at the root, verify material claims, and keep
approvals with the user.
