---
name: prototype
description: "Builds an isolated throwaway prototype to resolve a specific behavioral, technical, interaction, timing, or visual choice through observation; not for production implementation or settled static HTML work."
---

# Prototype

Build the cheapest disposable artifact that can settle one decision better than
more discussion. The result is the observed answer and its evidence, not code
to merge.

## Name the decision

State the question before building. Name the alternatives and what observation
would distinguish them. If there is no consequential choice, return to Feature
Development or `$design`; a demonstration without a decision is not a
prototype.

Use a prototype instead of asking the user for a fact that can be observed by
running or viewing something. The user still owns preferences and product
choices after seeing the result.

When a visual design space is open, gather enough product references or prior
art to identify genuinely different directions before building. Skip the
reference pass when the user or an accepted design source already fixes the
direction.

## Choose the cheapest faithful surface

- For state, logic, timing, algorithms, or an API shape, build the smallest
  script or interactive harness that exposes the relevant inputs, transitions,
  outputs, and state.
- For layout, interaction, density, or visual direction, build a small number
  of meaningfully different variants behind one switcher so the user can
  compare them on the same surface. Label every variant so the user can name
  the one they prefer.
- When one candidate tests the decision, build one. When the decision is a
  comparison, prefer two or three structurally different candidates over small
  cosmetic variations. Explore a promising direction the user did not name
  when it would test a materially different idea.

For a technical interface, data shape, or module boundary, ground the prototype
in the affected callers and invariants first. Write two or three realistic
caller examples before sketching types or signatures, then reconcile the shape
to that usage. Exercise each viable candidate with the type checker or a
minimal runnable caller when available. Compare whole shapes on:

- how much complexity the public interface hides;
- whether one owner holds each invariant and external representations stay
  behind the boundary;
- whether types prevent invalid states and retries converge safely;
- how concurrent actors avoid unnecessary shared writes; and
- how many layers a maintainer must cross to trace the behavior.

Reject a candidate that mainly adds pass-through methods, exposes internal
stages to callers, or splits one domain decision across modules. These checks
apply only when the prototype is choosing a technical shape; do not impose an
architecture exercise on a visual or timing question.

Place the work in the repository's private scratch location, or under
`.agents/tmp/prototypes/<topic>/` when none is defined. Keep it separate from
production source. Use the lightest available stack, in-memory or disposable
state, and only enough error handling to make the experiment reliable. Do not
add production abstractions, compatibility layers, or tests for code meant to
be discarded.

## Observe the decision

Run the prototype on the surface that exposes the choice:

- drive the interaction and capture each visual state;
- print transitions and final state for behavioral questions;
- measure the same frozen input for timing questions; or
- exercise the caller for an interface or data-shape question.

An assertion that the prototype starts is not evidence about the decision.
Record the output, screenshots, timing, or interaction result that distinguishes
the alternatives. If the experiment cannot distinguish them, change the probe
or report the decision as unresolved.

## Return the answer

Report the question, variants, observations, tradeoffs, recommendation, and
scratch path. Say plainly that the artifact is throwaway. Carry the selected
decision into the calling workflow only when the original request also
authorized that subsequent work; creating a prototype alone does not authorize
production changes.
