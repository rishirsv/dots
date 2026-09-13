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

For a product-wide audit, inventory the relevant routes and recurring states
before judging readiness. Inspect each available primary view plus representative
loading, empty, error, and populated states; record anything unavailable rather
than generalizing from one screen.

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

For repeated lists, inspect the densest representative viewport rather than a
single row or component specimen. Count how many complete items fit, identify
every element repeated per item, and judge the multiplied effect on scanning and
scrolling. Exercise at least one item's collapsed and expanded states. Optional
detail should normally open from one accessible, inline disclosure control; a
dedicated closed-state row that says only "Details" consumes attention without
adding information.

Trace visible content to the user's task. Check whether labels only restate the
surrounding context, whether the same output appears in several places, and
whether provenance or internal metadata occupies the primary view without
helping a decision. Also check that progressive disclosure does not hide risk,
coverage, approval status, or another detail needed to act with confidence.
Treat a warning as useful only when its placement, consequence, and next step
fit the condition it describes.

Run the content check across the whole represented surface, including repeated
disclaimers, instructions that paraphrase adjacent controls, and dates, totals,
or metadata already established nearby. Keep task-defining scope and values,
current consequences, and real errors. Moving low-value copy into a disclosure
does not resolve the problem unless someone needs that copy in the current view.

Separate actionable state from workflow narration. A control label, disabled
state, progress value, or contextual confirmation can often communicate what
happens next. Persistent prose that merely repeats that state belongs only when
omitting it would make the action or consequence unclear; errors and unusual
conditions still need direct, recoverable guidance.

## Result

Lead with the overall assessment and highest-impact changes. Each finding gives
its location or journey step, evidence, user impact, proposed correction, and
verification needed. Prioritize by consequence; structural and behavioral
problems often matter more than cosmetic ones.

Include relevant captures with the findings and summarize uncovered scope.
For readiness, identify what blocks acceptance. Keep routine rubric accounting
out of the report unless requested.

When fixes follow the audit, revisit the exact affected route, viewport, and
interaction before claiming the issue resolved or the interface polished.
Source inspection or a different screen can support implementation confidence,
but does not verify the corrected experience.

The audit reports findings. If fixes are also requested, continue through the
appropriate editing methods; the audit itself does not become a polish loop.
