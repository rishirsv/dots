# Talkbook Writing Checklist And Rubric (V2)

Use this checklist after choosing an archetype from `writing-archetypes.md` and before section finalization.
This checklist is advisory and non-blocking.

## Skill Structure Checklist (Skill-Creator)

- [ ] Purpose is explicit and domain-relevant.
- [ ] Trigger conditions are clear.
- [ ] Workflow is explicit and ordered.
- [ ] Examples are concrete and reusable.
- [ ] Constraints and guardrails are stated clearly.
- [ ] Failure modes are documented.
- [ ] Guidance is split appropriately across SKILL and `references/` files.
- [ ] No redundant policy copies; single-source references are used.

## Pre-Draft Mandatory Archetype Selection Checklist

- [ ] I selected one primary archetype from `writing-archetypes.md`.
- [ ] I mapped this section to an `outline_section_id`.
- [ ] I set a depth profile (`minimal|concise|detailed|extensive`).
- [ ] I filled `headline_claim`, `claims`, `evidence_objects`, and `implications` in payload.
- [ ] I confirmed at least one alternative archetype and rejected it explicitly.

## Profile-Aware Depth Minima

Use these minima as drafting targets.

| Profile | Claims | Evidence Objects | Implications | Numeric Anchors |
|---|---:|---:|---:|---:|
| minimal | 2 | 1 | 1 | 1 |
| concise | 3 | 1 | 1 | 2 |
| detailed | 4 | 2 | 2 | 3 |
| extensive | 6 | 3 | 3 | 5 |

## Draft Quality Checklist

### Claim-Evidence-Implication

- [ ] Every major claim is evidence-backed.
- [ ] Evidence is interpreted, not restated.
- [ ] Implications are explicit and decision-relevant.

### Quantification

- [ ] Headline is quantified or bounded where possible.
- [ ] Claims include period labels (FY, TTM, quarter, forecast horizon).
- [ ] Numeric anchors are traceable to source anchors.

### Traceability

- [ ] `source_anchors` are populated for non-trivial claims.
- [ ] Assumptions are explicit (especially one-shot mode).
- [ ] Appendix references are included when evidence is condensed.

### Workflow Discipline

- [ ] In outline_confirm mode, outline is approved before drafting.
- [ ] Section maps to outline (`outline_section_id`) and selected archetype.
- [ ] Payload is complete before `upsert_section.py` finalization.

### Structure And Readability

- [ ] Slide follows archetype structure.
- [ ] Table/chart usage is purposeful, not decorative.
- [ ] Decision ask is explicit when action is required.

## Advisory Self-Score Rubric (Non-Blocking)

Score each dimension from 1 (weak) to 5 (strong).

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| Message Specificity | Generic and vague | Partially specific | Quantified, scoped, decision-focused |
| Quantification Depth | Minimal numbers | Some numbers, uneven depth | Strong numeric support with period context |
| Evidence Quality | Weak/indirect evidence | Adequate but incomplete | Strong and directly relevant evidence objects |
| Interpretation Quality | Data restated only | Some interpretation | Clear implications and business meaning |
| Source Traceability | Sources absent | Partial source coverage | Explicit anchors and assumptions |
| Structural Coherence | Fragmented flow | Mostly coherent | Archetype-aligned and easy to follow |
| Outline Adherence | No outline linkage | Partial linkage | Strong section-to-outline mapping |
| Decision Usefulness | No clear action | Action hinted | Explicit decision ask and next-step implications |

### Scoring Guidance

- 34-40: Strong draft quality, ready for section finalization.
- 26-33: Usable draft; revise weakest dimensions.
- <=25: Rework archetype fit and payload depth before finalization.
