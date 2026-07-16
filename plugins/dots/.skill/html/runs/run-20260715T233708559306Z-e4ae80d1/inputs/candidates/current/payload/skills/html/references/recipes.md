# Composition recipes

Use these only for a page whose source material lacks a deliberate reading
order. Preserve an existing strong structure. A recipe arranges supplied
content; it never invents a claim, fills an evidence gap, or makes a decision
the source did not make. A specialized route such as a PR walkthrough or code
change explainer takes precedence.

## Decision brief

**Context → options → evidence → recommendation**

Establish the decision and its constraints, present the viable options, attach
the evidence that distinguishes them, then state the recommendation only when
the source commits to one. `comparison-grid` helps with a small option set;
`data-table` is better when criteria or evidence need exact rows.

## Explainer

**Answer → mental model → mechanism → implications**

Lead with the answer, give the reader a compact model, show how the parts work,
then explain what follows from that mechanism. Use `flow-diagram` only when
relationships replace substantial prose; use `code-panel` for the smallest
example that makes the mechanism concrete.

## Status report

**Current state → movement → blockers → next actions**

Orient the reader before describing change. Use `stat-tiles` only for verified
headline measures and `timeline` only when sequence carries real information.
End with owned next actions rather than a generic summary.

## Incident account

**Impact → chronology → cause → recovery → follow-up**

Start with the experienced impact, reconstruct the relevant sequence, report
the established cause, describe recovery, and close with concrete follow-up.
Never infer a root cause from incomplete evidence; preserve "not yet known"
when that is what the evidence supports.

## Comparison

**Criteria → meaningful differences → trade-offs → decision**

Define what the comparison turns on, surface only differences that affect the
choice, make the trade-offs explicit, then state the decision if one exists.
Preserve "no decision yet" when the source has not chosen. Use
`comparison-grid` for a few parallel options and `data-table` for many criteria.
