---
name: design-review
description: "Review existing product UI, screenshots, prototypes, or flows for visual quality, accessibility, design-system conformance, motion, and ship readiness. Returns actionable findings without changing product source; use design to create, implement, redesign, or polish UI."
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

Identify what is being judged and the available evidence. Do not invent a new
product direction during review.

## Choose The Review

| Request | Read |
| --- | --- |
| One screen, component, state, static artifact, target comparison, or acceptance gate | [surface-critique.md](references/surface-critique.md) |
| A journey, workflow, product area, or several states representing one experience | [experience-audit.md](references/experience-audit.md) |
| Token, primitive, variant, component, or design-contract conformance in source | [design-system-audit.md](references/design-system-audit.md) |
| Live or recorded motion, animation changes, or a motion system | [motion-audit.md](references/motion-audit.md) |

Load only the applicable playbook. Keep separate verdicts when the user asks
for distinct reviews, such as a flow audit and a screen acceptance gate.
Animation source belongs here only when motion is the review subject; route
general code review elsewhere.

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
- Reject captures with the wrong window, state, viewport, crop, loading screen,
  or blank content.
- Do not claim accessibility compliance from screenshots, fidelity without a
  target, or experiential quality from code alone.
- When evidence is unavailable, narrow the claim or return the playbook's
  blocked result and name the missing proof.

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

Lead with the verdict or audit outcome, then findings in descending consequence and the smallest coherent repair order. State evidence limits that affect the
result. Return a positive-null result when no substantive issue survives.

Answer in chat unless the user or repository requires a saved report. Saving a
report does not authorize product-source changes. Use a second independent
reviewer only when requested or when consequential work was authored in the
active context and a close verdict could change the result; verify that
reviewer's evidence before adopting it.
