# Interface Design

Read this only after the user selects a refactor candidate and wants alternative interface designs.

Use this parallel subagent pattern when the first plausible interface is unlikely to be the best one.

## Process

### 1. Frame The Problem Space

Before spawning subagents, write a user-facing explanation of the selected candidate:

- constraints any new interface must satisfy
- dependencies it relies on, classified with [deepening.md](deepening.md)
- the current seam and what sits behind it
- a rough illustrative code sketch to ground the constraints

This sketch is not the proposal. It helps the user and subagents reason about the same problem.

### 2. Spawn Subagents

Spawn three or more subagents in parallel when available. Each should produce a radically different interface for the deepened module.

Give each subagent a separate technical brief: file paths, coupling details, dependency category, what sits behind the seam, repo review guidance, and relevant domain vocabulary. Give each agent a different design constraint:

- Agent 1: minimize the interface, aiming for 1-3 entry points and maximum leverage per entry point.
- Agent 2: maximize flexibility, supporting many use cases and extension points.
- Agent 3: optimize for the most common caller, making the default case trivial.
- Agent 4, when applicable: design around ports and adapters for cross-seam dependencies.

Each subagent outputs:

1. Interface: types, methods, params, invariants, ordering, and error modes
2. Usage example showing how callers use it
3. What the implementation hides behind the seam
4. Dependency strategy and adapters
5. Trade-offs: where leverage is high and where it is thin

### 3. Present And Compare

Present designs sequentially, then compare them in prose. Contrast by:

- depth
- locality
- seam placement
- adapter need
- test surface

Finish with a recommendation. If elements from different designs combine well, propose a hybrid. Be opinionated; the user needs a strong read, not a menu.
