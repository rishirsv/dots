---
name: prototype
description: "Builds an isolated throwaway prototype to resolve a specific behavioral, technical, interaction, timing, or visual choice through observation; not for production implementation or settled static HTML work."
---

# Prototype

Build the least costly disposable artifact that can settle one decision
through observation. Return the observed answer and its evidence. Keep
prototype code separate from code to merge.

## Name the decision

State the question before building. Name the alternatives and what observation
would distinguish them. If there is no choice that affects the work, return to Feature
Development or `$ui-design`; a demonstration without a decision is not a
prototype.

Use a prototype instead of asking the user for a fact that can be observed by
running or viewing something. The user still owns preferences and product
choices after seeing the result.

If the visual direction is undecided, inspect product references or earlier
designs to identify different approaches. If the user or an accepted design
source already fixes the direction, start building.

## Choose The Smallest Experiment That Tests The Choice

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

For a technical interface, data shape, or module boundary, first identify the affected callers
and the rules the interface must preserve. Write two or three realistic
caller examples before sketching types or signatures, then adjust the interface
to support those examples. Exercise each viable candidate with the type checker or a
minimal runnable caller when available. Compare each complete interface on:

- how much complexity the public interface hides;
- whether one component enforces each required rule and hides external
  formats from its callers;
- whether types prevent invalid states and retries reach a safe result;
- how concurrent actors avoid unnecessary shared writes; and
- how many layers a maintainer must cross to trace the behavior.

Reject a candidate that mainly adds pass-through methods, exposes internal
stages to callers, or splits one domain decision across modules. These checks
apply only when the prototype is choosing a technical interface; do not impose an
architecture exercise on a visual or timing question.

Place the work in the user-specified location or the repository's established
prototype location. If neither exists, use a dedicated directory outside the
repository. Keep it separate from production source. Use the lightest available
stack, in-memory or disposable state, and only enough error handling to make
the experiment reliable. Do not
add production abstractions, compatibility layers, or tests for code meant to
be discarded.

## Observe the decision

Run the prototype on the surface that exposes the choice:

- drive the interaction and capture each visual state;
- print transitions and final state for behavioral questions;
- measure the same fixed input for timing questions; or
- exercise the caller for an interface or data-shape question.

An assertion that the prototype starts is not evidence about the decision.
Record the output, screenshots, timing, or interaction result that distinguishes
the alternatives. If the experiment cannot distinguish them, change the experiment
or report the decision as unresolved.

## Return the answer

Report the question, variants, observations, tradeoffs, recommendation, and
scratch path. Say plainly that the artifact is throwaway. Apply the selected
decision in the calling workflow only when the original request also
authorized that subsequent work; creating a prototype alone does not authorize
production changes.
