# Architecture Lenses

Use these lenses after reading the repo's own review guidance.

## Vocabulary

- **Module**: anything with an interface and implementation.
- **Interface**: everything a caller must know to use a module correctly, including invariants, ordering, error modes, configuration, and performance expectations.
- **Implementation**: the code hidden behind the interface.
- **Depth**: leverage at the interface. A deep module hides a lot of useful behavior behind a small interface.
- **Seam**: where an interface lives and behavior can be altered without editing callers.
- **Adapter**: a concrete implementation satisfying an interface at a seam.
- **Leverage**: what callers get from a deeper module.
- **Locality**: what maintainers get when change, bugs, and verification concentrate in one place.

## Core Tests

### Deletion Test

Imagine deleting the module.

- If complexity vanishes, the module may be a pass-through.
- If complexity reappears across many callers, the module is earning its keep.

### Interface Test Surface

The interface should be the primary test surface. If tests must reach through the interface to prove behavior, the module shape may be wrong.

### Adapter Test

Treat adapter count as a heuristic, not a rule. One adapter can be valid for a clear future extension point, but two adapters are stronger evidence that the seam is real.

## Common Debt Patterns

### Wrong Ownership

Behavior lives in callers, screens, route handlers, or tests even though a domain module, repository, controller, or platform owner should own it.

Evidence:

- repeated caller-side fixups
- multiple sources of truth
- invariants enforced outside the owner
- tests duplicated across layers

### Scattered Concept

One product or technical concept appears across many files with small variations.

Evidence:

- repeated condition chains
- repeated mapping or formatting policy
- repeated validation
- inconsistent naming for the same idea

### Duplicate Abstraction

Two modules claim the same responsibility.

Evidence:

- parallel helpers, clients, mappers, repositories, formatters, or UI primitives
- incompatible defaults
- callers choosing between similar entrypoints

### Shallow Module

A module adds indirection without hiding meaningful complexity.

Evidence:

- pass-through wrappers
- re-export chains
- interface nearly as complex as implementation
- tests that mostly assert forwarding

### Leaky Interface

Callers compensate for a weak contract.

Evidence:

- repeated null/default/error handling after a call
- manual conversions around every use
- callers knowing ordering, timing, persistence, or cache details

### Verification Debt

The architecture may be acceptable, but confidence is weak.

Evidence:

- important invariants only covered through previews or manual checks
- tests in the wrong layer
- no regression proof for persistence, routing, sync, concurrency, or runtime state

## Refactor Shape

Good debt items should describe the smallest useful fix:

- move behavior to the owner
- consolidate duplicate implementations
- deepen a module by hiding repeated caller logic
- delete pass-through layers
- add boundary-level tests
- create a focused internal helper only when real consumers exist
- do nothing and record why the current shape is acceptable
