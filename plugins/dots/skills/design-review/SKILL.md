---
name: design-review
description: "Review existing product UI, screenshots, prototypes, or flows for visual quality, accessibility, design-system conformance, motion, prototype-to-implementation fidelity, and ship readiness. Returns actionable findings without changing product source; use design to create, implement, redesign, or polish UI."
---

# Design Review

Independently assess existing product UI. Inspect evidence, test claims against
the governing product direction, and report findings without implementing
fixes or modifying product source.

## Establish Authority And Scope

Before choosing a review playbook, inspect the repository guidance governing
the target:

1. Root and applicable nested `AGENTS.md` files and root or applicable
   `DESIGN.md` files.
2. Repository-local product-design skills named by those instructions, loading
   only their task-relevant references.
3. Accepted briefs, decisions, targets, design-system documentation, tokens,
   components, assets, platform conventions, current source, and shipped UI.

Resolve conflicts by scope and authority: the user's explicit review goal, the
most specific repository instruction, product-specific guidance, accepted
decisions and targets, the established system and product evidence, then this
skill's generic standards.

Identify what is being judged and the available evidence. Infer routine scope
from the prompt and repository; ask only when an unresolved decision materially
changes the review. General review may propose consequential improvements, but
keep them separate from defects and from accepted product direction.

## Choose The Review

| Request | Read |
| --- | --- |
| One screen, component, state, or static artifact | [surface-critique.md](references/surface-critique.md) |
| Prototype-to-implementation fidelity or matching an accepted visual target | [fidelity-review.md](references/fidelity-review.md) |
| A journey, workflow, product area, or several states representing one experience | [experience-audit.md](references/experience-audit.md) |
| Token, primitive, variant, component, or design-contract conformance in source | [design-system-audit.md](references/design-system-audit.md) |
| Live or recorded motion, animation changes, or a motion system | [motion-audit.md](references/motion-audit.md) |

Choose general review, fidelity review, or both from the prompt. Use the surface,
experience, system, and motion playbooks as needed for general review; keep
fidelity and product-quality judgments separate when combined. A faithful
implementation can reproduce a design problem.

Coverage follows the user's prompt. “Full review” covers every applicable
dimension within the requested screen, flow, or product area: visual quality,
usability, accessibility, adaptation, states and recovery, data clarity, motion,
and system consistency. Include fidelity when an accepted target exists; do not
expand to the whole app unless requested. Load only the relevant playbooks and
references. General code review belongs elsewhere.

Ordinary critiques return findings. A requested acceptance or readiness gate
also returns a verdict under the shared acceptance rules below. A fidelity gate
judges matching the target; it does not establish production readiness.

## Judge From Current Evidence

Compare the work with the user goal, repository design guidelines, accepted target or brief, and relevant platform standards. Use nearby shipped behavior
only when it governs the same product and context. Distinguish contract
violations from preferences, visible defects from implementation hypotheses,
and missing proof from a failed result.

Use purpose, agency, clarity, accessibility, consistency, and craft as prompts,
not a scorecard. Mention a principle only when it explains a material finding
or strength. Give a numeric score only when the user requests one and explain
its rubric and evidence limits.

Read the shared [visual-proof checklist](../../references/visual-proof.md) when
the review needs rendered evidence.

- Inspect evidence in the current run before citing it.
- Use rendered evidence for appearance and visible states, source for
  implementation and conformance, and dynamic evidence for timing, gesture,
  interruption, haptics, and performance feel.
- Reject the wrong window, state, viewport, crop, or accidental transitional
  capture. Inspect intentional loading, empty, error, and permission states
  when they are the subject of review.
- Do not claim accessibility compliance from screenshots, fidelity without a
  target, or experiential quality from code alone.
- Try available, authorized inspection methods when evidence is missing.
  Continue independently reviewable work and name the exact missing proof.
  Missing evidence blocks acceptance only when necessary for that verdict.
- Source and static checks establish implementation contracts; rendered previews
  establish visible states; exercised runtime behavior establishes navigation,
  gestures, focus, and outcomes. Haptic feel requires representative hardware.
- If source changes during review, invalidate and refresh affected evidence.
  Keep unaffected results. Stop once sufficient evidence supports the scoped
  findings and judgment; repeat checks only for relevant changes or uncertainty.

Use browser or native UI tooling appropriate to the product. Do not cross login,
payment, PII, account mutation, destructive action, consent, send/post, or
other external-write boundaries without authorization or a clear test
environment.

## Report Actionable Findings

Rank findings by consequence:

- `P0`: blocks the core task or creates severe safety, trust, or accessibility
  risk.
- `P1`: major comprehension, wrong-action, responsive, or product-fit failure
  that blocks release or handoff.
- `P2`: meaningful friction, drift, unclear state, inconsistency, or craft gap
  with a safe path.
- `P3`: non-blocking refinement.

Each substantive finding includes severity, exact location, current evidence,
user or fidelity impact, one concrete correction, and an acceptance check. Add
`Verification needed` and confidence when stronger proof is unavailable. Merge
duplicate symptoms under their root cause and remove unsupported candidates.

General review also identifies consequential opportunities, such as removing a
step or simplifying an interaction. Explain the benefit and tradeoff; do not
assign a blocking severity to an optional redesign. Name non-obvious strengths
or deliberate omissions that a correction must preserve. A proven defect can
have several valid repairs: recommend one and identify any unresolved product
decision instead of discarding the defect.

## Decide Acceptance

For each requested gate, identify the mode and scope, then use exactly
`final result: passed` or `final result: blocked`.

- Pass when required evidence is sufficient and no actionable P0/P1/P2 remains
  in that mode and scope. P3 refinements and optional opportunities may remain.
- Block when an actionable P0/P1/P2 remains or necessary evidence is unavailable.
  Distinguish confirmed defects from missing verification in the explanation.
- Record justified adaptations as accepted differences, not unresolved findings.
  A target's usability problem belongs to general review, not fidelity failure.

## Deliver And Re-review

Keep the report in chat, including acceptance and follow-up reviews, unless the
user or repository requests an artifact. Lead with the verdict when applicable,
otherwise the strongest finding or a clear no-substantive-issues result. Follow
with prioritized findings, separate consequential opportunities, the smallest
ordered correction checklist, and material verification gaps. Omit empty
sections and routine inspection inventories. Use stable finding IDs within a
review and its follow-ups; preserve the finding anatomy above.

For re-review, identify earlier findings and inspect the changed implementation.
Mark each resolved, unresolved, regressed, or unverified. Close a finding only
with the appropriate post-fix evidence, matching the original viewport and state
for visual comparisons. Check neighboring behavior when the fix could affect it.
A claimed fix or successful build is not visual proof. If earlier findings or
captures are unavailable, name that limit rather than inventing comparison
history. Reporting and re-review do not authorize implementation.

After a substantial review, briefly offer a visual HTML report when captured
evidence would make it useful. Create it only when requested: read
[html-report.md](references/html-report.md), then load the available `html` skill
with the prepared material and defined prompt. Saving a report or exporting
feedback does not authorize product changes.

Use a second independent reviewer only when requested or when consequential work
was authored in the active context and a close verdict could change the result;
verify that reviewer's evidence before adopting it.
