# Design Audit

Judge the quality of an interface or experience. For comparison against an
accepted implementation target, use [design-qa.md](design-qa.md).

## Inputs

- **Subject:** screen, component, flow, or product area and the user's question.
- **Context:** intended user, task, usage conditions, and governing design
  direction. Use established context; name consequential assumptions.
- **Evidence:** supplied screenshots or recordings, a live interface, and source
  or design-system material when relevant. State which routes, states, themes,
  and devices are represented.

Source alone supports an implementation inspection, not a rendered visual
verdict. Screenshots support visible findings, not claims about unobserved
behavior. Identify missing evidence without discarding independently useful work.

## Choose The Review

| Request | Mode | Rubric scope |
|---|---|---|
| Appearance, visual hierarchy, identity, or craft | Design review | D1–D5 |
| Task completion, usability, flow, or accessibility | User experience review | U1–U7 |
| Both, or an unqualified review/audit/readiness request | Combined review | D1–D5 and U1–U7, once each |

Read the selected sections of the [audit rubric](../assets/design-audit-rubric.md).
A combined review covers both scopes once. Route by the question, not screen
count; even one modal may need a UX review.

## Inspect And Judge

Use the selected rubric to substantiate the first impression and assess every
applicable criterion. For journeys, follow important steps and recovery paths.
Keep observations tied to the captured state; intentional loading, empty, and
error states are valid evidence. Record blocked steps and unavailable checks
as coverage gaps.

Describe visible details precisely: counts, quoted copy, and relationships
rather than guessed pixels or behavior. Group symptoms by cause into one
primary rubric category. Distinguish defects from opportunities and observed
effects from hypotheses about users. Preserve strengths a correction could damage.

## Result

Lead with the overall assessment and highest-impact changes. Each finding gives
its location or journey step, evidence, user impact, proposed correction, and
verification needed. Prioritize by consequence; structural and behavioral
problems often matter more than cosmetic ones.

Include relevant captures with the findings and summarize uncovered scope.
For readiness, identify what blocks acceptance. Keep routine rubric accounting
out of the report unless requested.

The audit reports findings. If fixes are also requested, continue through the
appropriate editing methods; the audit itself does not become a polish loop.
