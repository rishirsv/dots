---
name: improve-codebase-architecture
description: Use when the user wants high-value architecture improvements, refactoring opportunities, better testability, tighter module boundaries, or a codebase that is easier to navigate.
---

# Improve Codebase Architecture

Explore a codebase for architectural friction and refactoring opportunities. Favor deepening shallow modules so behavior can be tested at a stable boundary instead of across scattered internals.

## Process

### 1. Explore the codebase

Use the `explorer` agent or a focused local search to understand where the codebase feels shallow or tightly coupled.

Look for:

- places where one concept requires bouncing between many files
- modules whose interface is nearly as complex as their implementation
- pure helpers extracted only for testability, while the real bugs live in call sites and seams
- tightly coupled modules that increase integration risk
- areas that are untested or hard to test at the boundary

Treat the friction you encounter as the signal.

### 2. Present candidates

Present a numbered list of deepening opportunities. For each candidate, include:

- Cluster: which modules or concepts are involved
- Why they are coupled: shared types, call patterns, or co-ownership
- Dependency category: see `REFERENCE.md` for the four categories
- Test impact: which shallow tests would be replaced by boundary tests

Do not propose interfaces yet. Ask the user which candidate they want to explore.

### 3. Frame the problem space

Before designing an interface, explain the constraints any new boundary would need to satisfy:

- what the module should own
- what it should hide
- what dependencies it should rely on
- what the current implementation is making hard

Include a small illustrative sketch only if it helps ground the problem.

### 4. Design options

If the user wants to proceed, design multiple interface options with clearly different trade-offs.

For each option, include:

1. Interface signature
2. Usage example
3. What complexity it hides internally
4. Dependency strategy
5. Trade-offs

Be opinionated. Recommend the strongest design and explain why.

### 5. Create the RFC

Create a refactor RFC from the final recommendation using the template in `REFERENCE.md`.

## Guidance

- Prefer boundary tests over shallow internal tests.
- Favor small, durable interfaces that hide complexity.
- Be explicit about dependency handling.
- Avoid overengineering; choose the smallest interface that meaningfully deepens the module.
