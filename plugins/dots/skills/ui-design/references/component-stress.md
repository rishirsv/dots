# Stress Test A Component

Use when asked to stress test or harden a component, or when a concrete content
or layout failure needs a reproducer. Keep ordinary build checks in the build
workflow.

## Select reachable scenarios

Identify the requested component or set of components. Before choosing cases,
read the component’s props, slots, and data constraints. Identify where it
manages state and which screens use it.

Test only properties that vary. Include a scenario only when the component can
receive that input or reach that state in production.

Select applicable sections from [scenario axes](recipes/stress-cases.md):
variable text length or script, repeated item quantity, container size,
reachable state, or supported environment. Keep a short scenario plan beside the
test page or native preview fixtures. Record exclusions that affect coverage. Do
not test every possible combination of the selected properties.

## Render the real component

For web components, import the real component into one temporary page. Render
one instance per scenario in a single column. Put a short text label above each
instance. For native components, use named native preview fixtures with the same
scenario plan.

Use the app’s fonts, tokens, providers, and supported theme controls. Keep
fixtures local and deterministic. Preserve the project’s server/client
separation. Use its existing preview, story, or test adapter where available
instead of making the whole test page client code. Check that each instance
actually received its intended fixture before calling its output a failure.

Use bounded containers for component-width cases. Resize the viewport separately
when media queries, page chrome, or viewport units affect the result. Drive
internal states through their real interactions or supported test adapters. Keep
fixtures out of production imports. Do not use fixtures to write live data.

## Inspect and report

Render every selected scenario and exercise the relevant input, focus, and state
transitions. Report a failure only after observing it. Mark each observed break
beside its scenario and record unavailable checks separately.

Report the failing scenario, what visibly or behaviorally broke, and the
relevant design reference. “Text escapes the field’s right edge” gives a
correction a target; “spacing feels tight” does not. If all checks pass, report
only the tested scope and test page or native preview location.

A test-only request reports findings. When fixes are also requested, correct the
component. Rerun the failing cases and other cases that the correction could
affect. Use [design QA](design-qa.md) only when an accepted visual target also
needs comparison.

Keep the test page or native preview fixtures available with the observed
results. State how to open the test page or fixtures and which checks remain
unverified. Do not claim that the component passed testing if you did not render
the scenarios.
