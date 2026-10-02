# Design Audit

Judge the quality of an interface or experience. For comparison against an
accepted implementation target, use [design-qa.md](design-qa.md).

## Inputs

- **Subject:** screen, component, flow, or product area and the user's question.
- **Context:** intended user, task, usage conditions, and governing design
  direction. Use established context; identify assumptions that could change the assessment.
- **Evidence:** supplied screenshots or recordings, a live interface, and source
  or design-system material when relevant. State which routes, states, themes,
  and devices are represented.

Use source to inspect implementation. Inspect the rendered interface before
judging its appearance. Use screenshots to support visible findings. Exercise
interactions before making claims about their behavior. Identify missing
evidence without discarding independently useful work.

For a product-wide audit, inventory the relevant routes and recurring states
before judging readiness. Inspect each available primary view plus
representative loading, empty, error, and populated states; record views or
states that are unavailable. Avoid generalizing from one screen.

## Choose The Review

| Request | Mode | Rubric scope |
|---|---|---|
| Appearance, visual hierarchy, identity, or craft | Design review | D1–D5 |
| Task completion, usability, flow, or accessibility | User experience review | U1–U7 |
| Both, or an unqualified review/audit/readiness request | Combined review | D1–D5 and U1–U7, once each |

Read the selected sections of the [audit rubric](rubrics/design-audit.md). A
combined review covers both scopes once. Choose the mode from the question; even
one modal may need a UX review.

## Inspect And Judge

Use the selected rubric to check your first impression. Assess every applicable
criterion. For user tasks, follow the important steps and recovery paths. Keep
observations tied to the captured state; intentional loading, empty, and error
states are valid evidence. Record blocked steps and unavailable checks as
coverage gaps.

Describe visible details precisely: counts, quoted copy, and relationships
rather than guessed pixels or behavior. Group symptoms with the same cause into
one finding. Assign that finding to one primary rubric category. Distinguish
defects from opportunities and observed effects from hypotheses about users.
Preserve strengths a correction could damage.

For repeated lists, inspect the densest representative viewport and exercise an
item’s collapsed and expanded states. Apply U2 to the whole captured interface.
Count complete visible items and assess the effect of repeated content. Moving
low-value copy into a disclosure does not resolve it unless someone needs that
copy in the current view. Use U3 for disclosure behavior and U4 for warnings,
recovery, and whether feedback already communicates routine workflow state.

## Result

Lead with the overall assessment and highest-impact changes. Each finding gives
its location or journey step, evidence, user impact, proposed correction, and
verification needed. Prioritize by consequence; structural and behavioral
problems often matter more than cosmetic ones.

Include relevant captures with the findings and summarize uncovered scope. For
readiness, identify what blocks acceptance. Keep routine rubric accounting out
of the report unless requested.

When fixes follow the audit, revisit the exact affected route, viewport, and
interaction before claiming the issue resolved or the interface polished. Source
inspection or a different screen can help you assess the implementation. To
verify a correction, inspect the corrected interface and interaction.

The audit reports findings. If fixes are also requested, continue through the
appropriate editing methods; do not add repeated refinement cycles to the audit
itself.
