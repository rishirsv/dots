# Interface Design

Read this only after the user selects a refactor candidate and wants alternative interface designs.

Generate alternative interface designs when the first plausible interface is
unlikely to be the best one. Use subagents for high-impact or non-obvious seams
when independent designs would improve the decision.

## Process

### 1. Frame The Problem Space

Before spawning subagents, write a user-facing explanation of the selected candidate:

- constraints any new interface must satisfy
- dependencies it relies on, classified with the dependency categories below
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

## Dependency Categories

Classify dependencies before recommending a deepened module. The category
determines how the module is tested across its seam.

### 1. In-Process

Pure computation, in-memory state, no I/O. Always deepenable: merge the modules
and test through the new interface directly. No adapter needed.

### 2. Local-Substitutable

Dependencies that have local test stand-ins such as an in-memory filesystem or
local database substitute. Deepenable if the stand-in exists. The module is
tested with the stand-in running in the test suite. The seam is internal; no port
at the module's external interface.

### 3. Remote But Owned

Owned services across a network boundary. Define a port at the seam. The module
owns the logic; the transport is injected as an adapter. Tests use an in-memory
adapter. Production uses an HTTP, RPC, queue, or equivalent adapter.

Recommendation shape:

> Define a port at the seam, implement a production adapter and an in-memory adapter for testing, so the logic sits in one deep module even though it is deployed across a network.

### 4. True External

Third-party services the codebase does not control. The module takes the
external dependency as an injected port; tests provide a mock adapter.

## Seam And Test Discipline

- One adapter means a hypothetical seam. Two adapters means a real one. Do not
  introduce a port unless at least two adapters are justified, typically
  production plus test. A single-adapter seam is just indirection.
- A deep module can have internal seams private to its implementation and used
  by its own tests. Do not expose internal seams through the interface just
  because tests use them.
- Replace shallow-module tests with tests at the deepened module's interface.
  The interface is the test surface.
- Tests assert observable outcomes through the interface, not internal state.
  They should describe behavior, not implementation.
