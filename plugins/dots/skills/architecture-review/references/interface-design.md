# Interface Design

Read this only after the user selects a refactor candidate and wants alternative interface designs.

Generate alternative interface designs when the first plausible interface is
unlikely to be the best one. Use subagents for high-impact or non-obvious seams
when independent designs would improve the decision.

## Process

### 1. Frame The Problem Space

Before spawning subagents, write a user-facing explanation of the selected candidate:

- constraints any new interface must satisfy
- dependencies it relies on, classified with [deepening.md](deepening.md)
- the current seam and what sits behind it
- a rough illustrative code sketch to ground the constraints

This sketch is not the proposal. It helps the user and subagents reason about the same problem.

### 2. Generate Alternative Designs

Produce two to four meaningfully different interfaces for the deepened module.
For high-impact seams, spawn parallel subagents when available; otherwise create
the alternatives yourself.

Each design should work from the same technical brief: file paths, coupling
details, dependency category, what sits behind the seam, repo review guidance,
and relevant domain vocabulary. Give each design a different constraint:

- Minimal: aim for 1-3 entry points and maximum leverage per entry point.
- Flexible: support many use cases and extension points.
- Common path: optimize for the most common caller and make the default case trivial.
- Ports and adapters, when applicable: design around cross-seam dependencies.

Each design outputs:

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
