---
name: design-review
description: "Use when asked to critique or assess existing UI, screens, prototypes, screenshots, user flows, accessibility, design-system consistency, or motion, including UX audits and ship-readiness verdicts. Produces evidence-backed findings and pass/block decisions; not for designing, building, redesigning, routine self-checks, or general code review."
---

# Design Review

Choose one review path, inspect current evidence, and report the strongest
supported findings. This skill evaluates; it does not implement fixes. Route
building, redesign, and implementation polish to
[design](../design/SKILL.md).

## Choose One Path

| Request | Path | Read |
| --- | --- | --- |
| One screen, component, state, static artifact, target comparison, or pre-handoff acceptance gate | Surface critique | [surface-critique.md](references/surface-critique.md) |
| A journey, funnel, workflow, product area, or several supplied states representing one experience | Experience audit | [experience-audit.md](references/experience-audit.md) |
| Source-level token, primitive, variant, component, or design-contract conformance | Design-system audit | [design-system-audit.md](references/design-system-audit.md) |
| Live or recorded motion, animation changes, or a motion system | Motion review | [motion-audit.md](references/motion-audit.md) |

Load only the owning playbook. When the user asks for both a flow audit and a
gate on one screen, run the two paths separately and keep their verdicts
separate.

Animation and interaction code belong here only when motion is the review
subject. Route general code review elsewhere. Routine self-checks stay with the
implementation skill; use this skill for an independent judgment or explicit
acceptance gate.

## Ground The Judgment

Compare the work against the user's goal, binding product and design rules, an
accepted target or brief, and the quality bar for the surface. Use nearby
shipped behavior only after confirming it governs the same product and context.

Do not invent a new direction during review. Distinguish a contract violation
from a preference, and a visible defect from an implementation hypothesis.

Use these principles as judgment prompts:

1. **Purpose:** every element and step earns the user's time and attention.
2. **Agency:** people can act, recover, undo, cancel, or leave without traps.
3. **Responsibility:** privacy, safety, consent, and consequences serve the user.
4. **Familiarity:** established metaphors and platform behavior remain predictable.
5. **Flexibility:** the experience works across relevant contexts and abilities.
6. **Simplicity:** hierarchy and disclosure clarify the task without hiding it.
7. **Craft:** type, color, spacing, assets, states, and motion form one system.
8. **Delight:** the intended feeling emerges from the other principles, not decoration.

Use these principles as judgment prompts, not a scorecard. Mention only
principles that explain a material finding or strength. Give a numeric score
only when the user asks for one, and explain the rubric and evidence limits.

## Use Evidence Precisely

Read the shared [visual-proof checklist](../../references/visual-proof.md) when
the path needs rendered evidence.

- Use evidence opened, captured, or inspected in the current run. User-supplied
  artifacts remain valid evidence when inspected now.
- Rendered evidence supports appearance and visible-state claims. Source
  supports implementation and conformance facts. Dynamic evidence supports
  timing, interruption, gesture, haptic, and performance-feel claims.
- Inspect each screenshot before citing it. Reject the wrong window, state,
  viewport, crop, loading screen, or blank capture.
- Do not claim full accessibility compliance from screenshots, fidelity without
  a source target, or experiential quality from code alone.
- If required evidence is unavailable, return the path's blocked result or
  narrow the claim and name the missing proof.

Use the runtime's browser tooling for web UI, Chrome only when its existing
session is required, and native control tooling for app UI. Stop before login,
payment, PII entry, account mutation, destructive action, consent change,
send/post, or another external write unless the user approved that action or
the target is clearly a test environment.

## Rank Findings

Use severity for user or acceptance consequence:

- `P0`: blocks the core task, creates destructive-mistake or trust risk, causes
  a severe accessibility barrier, or makes the surface unusable.
- `P1`: major mismatch, comprehension failure, wrong-action risk, broken
  responsive path, or product-fit failure that blocks release or handoff.
- `P2`: meaningful friction, drift, unclear state, inconsistency, or craft gap
  that weakens confidence but has a safe path.
- `P3`: non-blocking refinement.

Each substantive finding contains:

- severity and concise title;
- exact location and affected surface;
- current evidence;
- user or fidelity impact;
- one concrete correction;
- an acceptance check;
- `Verification needed` when stronger proof requires interaction, source,
  assistive technology, analytics, or user testing;
- confidence when the judgment is aesthetic or evidence-limited.

Keep the correction with its finding. Delete duplicate findings and unsupported
candidates. Phrase a possibly intentional difference as an assumption or
question rather than a defect.

## Finish The Review

Lead with the path's outcome, then findings in descending consequence and the
smallest coherent repair order. State evidence limits that affect confidence.
When no substantive issue survives, return a positive-null result instead of
padding the report.

Answer in chat by default. Save a report only when the user asks or an
established workflow requires it; follow the repository destination, otherwise
use `.agents/outputs/`. Do not modify product source.

Use a second independent reviewer only when the user asks, the active context
authored consequential work, or a close high-stakes verdict could change the
result. Verify its evidence yourself; the parent review owns the final verdict.
