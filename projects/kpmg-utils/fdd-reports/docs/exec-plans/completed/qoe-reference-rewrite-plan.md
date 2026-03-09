## QoE Reference Rewrite Plan

### Summary

Rewrite `skill/kpmg-fdd/references/qoe-and-earnings-adjustments.md` as the `fdd-reports` 2.0 QoE contract. The reference should absorb the useful capabilities of TS Copywriter inside `fdd-reports` itself, while extending them into a broader, more precise section system that supports:

- quick rewrite of existing QoE text
- writing a grouped set of adjustments
- writing a full QoE section

The implementation surface is `fdd-reports` only. `ts-copywriter` remains unchanged.

Once implementation is complete, validate the rewrite, sync this checklist to what was actually done, and move the plan to `docs/exec-plans/completed/qoe-reference-rewrite-plan.md`.

### Phase Outcomes

#### Phase 1: Absorb the useful TS Copywriter capabilities into the reference

Outcome: We identify which TS Copywriter QoE templates are strong enough to preserve directly inside the reference and where the reference needs broader section-level logic.

#### Phase 2: Rebuild the QoE contract as the 2.0 authoring surface

Outcome: The QoE reference becomes the single, higher-scope source of truth for rewrites, grouped adjustment sets, and full QoE sections.

#### Phase 3: Validate the new contract and examples

Outcome: The rewritten reference is structurally clean, corpus-grounded, and covers the user-request shapes the older TS Copywriter model handled only partially.

#### Phase 4: Close out the execution record

Outcome: The repo has a completed plan that matches the `fdd-reports`-only work actually performed.

### Key Changes

#### Public behavior and request handling

The QoE reference should explicitly support three user-request shapes:

- `Rewrite request`
  - Input: existing QoE prose or rough adjustment language
  - Output: tighter Big 4-style rewrite
- `Adjustment-set request`
  - Input: 1-10 adjustments or notes
  - Output: stand-alone adjustment paragraphs or grouped adjustment blocks
- `Section request`
  - Input: sufficient facts to write the full QoE section
  - Output: full section with bridge, grouped rationale, excluded items, and sensitivities

The reference must make clear that the response follows the user ask and does not force full-section composition when the ask is narrower.

#### QoE reference redesign

Replace the current slot-first QoE reference with the same rewrite family used in the newer section references, but make it explicitly two-tiered:

- `Section objective`
- `Core principles`
- `Request handling model`
- `Analytical workflow`
- `Section architecture`
- `Adjustment-family templates`
- `Assembly patterns`
- `Section-specific writing guidance`
- `Verification and review checks`
- `Full examples`

Canonical full-section architecture:

- `Headline bridge`
- `Basis and scope`
- `Reported-to-adjusted bridge`
- `Adjustment groups`
- `Other considerations / not included`
- `Key sensitivities`

#### Capability uplift inside `fdd-reports`

Preserve the strongest TS Copywriter QoE capabilities directly in the reference:

- precise single-adjustment prose
- active voice
- numeric anchoring
- evidence-first phrasing
- consistent recurrence framing

Extend beyond TS Copywriter with corpus-derived section logic that it does not currently handle well:

- grouped adjustment intros and transitions
- sell-side add-back reversals
- out-of-period / cut-off / accrual normalization
- standalone and replacement-cost adjustments
- bridge-first full-section composition
- excluded-item logic
- sensitivity logic

#### Validation rules

The new QoE reference must hard-check for:

- missing reported-to-adjusted bridge in full-section outputs
- bridge logic that does not tie
- adjustments without basis/source
- recurrence labels without rationale
- unquantified items incorrectly included in adjusted EBITDA
- extraction artifacts in live templates
- grouped outputs that collapse into flat chronology without logic

### Test Plan

Validate the rewritten reference against these scenarios:

- Rewrite a weak paragraph for one non-recurring adjustment and confirm the logic stays intact while the writing tightens.
- Write five adjustments only and confirm the output does not force a full section.
- Write a mixed adjustment set and confirm the system groups by logic rather than flat chronology.
- Write a full QoE section with reported-to-adjusted bridge, management adjustments, diligence adjustments, pro forma items, excluded items, and sensitivities.
- Reverse a recurring sell-side add-back and confirm the rationale explains why the cost remains recurring.
- Handle an unquantified item and confirm it lands in `Other considerations / not included`, not in the bridge.
- Handle a dense QoE case with more than 10 items and confirm grouping and transitions remain readable.
- Confirm the preserved TS-style templates remain precise and the new section-level templates increase scope and quality.
- Confirm the live reference contains no extraction artifacts or TS-product dependency in implementation instructions.

### Assumptions and Defaults

- Scope is limited to `fdd-reports`.
- `ts-copywriter` remains unchanged and is treated as legacy inspiration rather than an implementation surface.
- The QoE reference is the 2.0 surface and should be better than TS Copywriter in precision, coverage, and section-level composition.
- The canonical earnings metric remains EBITDA unless the user prompt or engagement basis requires another metric.
- Add a `TODOS.md` follow-up only if validation reveals a real deferred post-testing need.

### Implementation Checklist

- [x] 1.0 Save the corrected plan
  - [x] 1.1 Replace the prior cross-product plan with `docs/exec-plans/active/qoe-reference-rewrite-plan.md`
  - [x] 1.2 Confirm the plan reflects an `fdd-reports`-only scope
  - [x] 1.3 Validation for 1.0: only the corrected active plan remains in the active plans folder

- [x] 2.0 Rewrite the QoE reference
  - [x] 2.1 Replace the old slot-first structure in `skill/kpmg-fdd/references/qoe-and-earnings-adjustments.md`
  - [x] 2.2 Rebuild the section around request handling, section architecture, adjustment-family templates, and assembly patterns
  - [x] 2.3 Preserve the strongest TS-style single-adjustment templates directly in the reference
  - [x] 2.4 Add broader 2.0 section-level logic for grouped adjustments, full sections, exclusions, and sensitivities
  - [x] 2.5 Add inline micro-examples plus full examples covering rewrite, grouped adjustments, and full-section behavior
  - [x] 2.6 Validation for 2.0: reread the file for internal consistency, family alignment, and corpus fit

- [x] 3.0 Validate the rewrite and note deferred follow-up if needed
  - [x] 3.1 Run targeted text checks for obsolete slot-era headings and extraction artifacts
  - [x] 3.2 Confirm the new examples cover rewrite, grouped adjustments, full section, and sell-side reversal behavior
  - [x] 3.3 Decide whether any real deferred post-testing follow-up belongs in `TODOS.md`
  - [x] 3.4 Validation for 3.0: repo state reflects an `fdd-reports`-only QoE rewrite

- [x] 4.0 Close out the plan
  - [x] 4.1 Sync the checklist to the work actually completed
  - [x] 4.2 Move the plan to `docs/exec-plans/completed/qoe-reference-rewrite-plan.md`
  - [x] 4.3 Validation for 4.0: completed plan exists in the completed plans folder
