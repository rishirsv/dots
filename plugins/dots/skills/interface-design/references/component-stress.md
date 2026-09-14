# Stress Test A Component

Use when asked to stress test or harden a component, or when a concrete content or layout failure needs a reproducer. Keep ordinary build checks in the build workflow.

## Select reachable scenarios

Scope the requested component or bounded set. Read its props, slots, state owners, data constraints, and consuming surfaces before choosing cases.

Stress only what varies. A scenario earns a slot when the component accepts something that can take that shape in production.

Select applicable sections from [scenario axes](recipes/stress-cases.md): variable text length or script, repeated item quantity, container size, reachable state, or supported environment. Keep a compact scenario plan beside the harness, including consequential exclusions; do not multiply every axis into every possible combination.

## Render the real component

For web components, use one throwaway page, holding the real component imported from the project, rendered once per scenario in a single column with a short text label above each instance. For native components, use named native preview fixtures with the same scenario plan.

Use the app’s fonts, tokens, providers, and supported theme controls. Keep fixtures local and deterministic. Respect server/client boundaries instead of making the whole harness client code; use the project’s existing preview, story, or test adapter where available. Check that each instance actually received its intended fixture before calling its output a failure.

Use bounded containers for component-width cases. Resize the viewport separately when media queries, page chrome, or viewport units affect the result. Drive internal states through their real interactions or supported test adapters. Keep fixtures out of production imports and live writes.

## Inspect and report

Render every selected scenario and exercise the relevant input, focus, and state transitions. A predicted failure is still not a finding. Mark each observed break beside its scenario and record unavailable checks separately.

Report the failing scenario, what visibly or behaviorally broke, and the responsible craft reference. “Text escapes the field’s right edge” gives a correction a target; “spacing feels tight” does not. A clean run needs only the tested scope and harness location.

A test-only request reports findings. When fixes are also requested, correct the component and rerun the failing cases and affected neighbors. Use [design QA](design-qa.md) only when an accepted visual target also needs comparison.

Keep the harness reviewable with its fixtures and observed results. State how to open it and which checks remain unverified; do not claim an unrendered harness survived testing.
