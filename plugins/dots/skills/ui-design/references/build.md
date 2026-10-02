# Build Or Refine

For new work, describe the proposed composition, type roles, palette, imagery,
and interaction from the brief. For a focused refinement, keep the settled
direction and change only what the task requires.

Implement the main experience using real content and the relevant craft
references. Default to local HTML for standalone web prototypes. Use a native
preview when the decision depends on platform controls, gestures, or text
scaling. Use the existing stack and design system for product changes. Include
the controls and states needed to complete the requested task. For requested
component hardening or a concrete content failure needing a reproducer, use
[component stress](component-stress.md).

Inspect the rendered result and exercise its main path. Use the [interaction
checks](interaction.md#exercise-the-experience) for state changes and focus
continuity, and [layout checks](layout.md#inspect-in-context) at widths just
above and below responsive breakpoints, as well as desktop and phone sizes. For
original work, use applicable [audit criteria](rubrics/design-audit.md) to
identify material problems without requiring a separate audit report. For an
accepted visual target, use [design QA](design-qa.md). Default to one correction
cycle—inspect, fix, and inspect again—or the user's requested iteration limit.
Report material remaining issues at the limit; do not treat the limit as proof
of readiness. For a focused refinement, inspect the exact changed workflow at a
representative viewport and exercise the affected interaction.
