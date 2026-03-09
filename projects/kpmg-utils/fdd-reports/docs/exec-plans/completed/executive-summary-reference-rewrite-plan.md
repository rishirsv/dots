## Executive Summary Reference Rewrite Plan

### Summary

Rewrite `skill/kpmg-fdd/references/executive-summary.md` using `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md`, with the same top-level rewrite family as the other rewritten references, but with an executive-summary-specific authoring model drawn from the corpus: `transaction context and perimeter + headline diligence conclusions + key sensitivities and remaining dependencies`, with reporting-basis detail, workstream-by-workstream takeaway sets, and scope-exclusion or transaction-mechanics notes added only when triggered by evidence.

Once implementation is complete, validate the rewrite, sync this checklist to what was actually done, and move the plan to `docs/exec-plans/completed/executive-summary-reference-rewrite-plan.md`.

### Phase Outcomes

#### Phase 1: Ground the rewrite in the corpus

Outcome: We determine what real executive summaries actually contain, which parts of the current template are overfit, and which summary patterns are genuinely reusable.

#### Phase 2: Rebuild the executive-summary contract

Outcome: The reference becomes a concise decision-oriented synthesis contract rather than a rigid risk-table template.

#### Phase 3: Validate the new contract and note deferred follow-up

Outcome: The rewritten section is structurally clean and any real post-testing follow-up is recorded explicitly.

#### Phase 4: Close out the execution record

Outcome: The repo has a completed plan that reflects the work actually performed.

### Key Changes

#### Contract shape

Replace the current slot-first executive-summary structure (`Writing guidance`, `Layout`, `Available slot shapes`, `Render skeleton`, `Common mistakes`, `Structural preflight rules`, `Split policy rules`) with the same top-level structure used by the rewritten references:

- `Table of contents`
- `Section objective`
- `Core principles`
- `Analytical workflow`
- `Section architecture`
- `Available analytical units`
- `Assembly patterns`
- `Section-specific writing guidance`
- `Verification and review checks`
- `Full examples`

Do not retain renderer-era slot taxonomy, mandatory table assumptions, or rigid render-skeleton sections.

#### Executive-summary-specific authoring model

Define the section around these local units:

- `transaction-context note`: who is evaluating what and on what perimeter basis
- `perimeter note`: what is included, excluded, or carved out when that changes how conclusions should be read
- `headline-conclusion unit`: one decision-relevant conclusion tied to a metric, period, and implication
- `workstream takeaway unit`: a compact line summarizing an in-scope workstream when a one-by-one summary is needed
- `basis note`: the reporting basis or evidence base only when it materially affects how much confidence to place on the conclusions
- `dependency note`: a remaining input, classification issue, or refresh item that could move the current view
- `closing-mechanics note`: cash-free debt-free, purchase-price, or completion-account mechanics when they materially shape the summary
- `watchout note`: a concise statement of the most important unresolved risk or sensitivity, paired with current status where available

#### Required vs optional blocks

Set the `Section architecture` to use these required blocks:

- `Transaction context and perimeter`
- `Headline conclusions`
- `Key sensitivities and remaining dependencies`

Set these as optional, trigger-based blocks only:

- `Reporting basis and evidence perimeter`
- `Workstream takeaway set`
- `Scope exclusions and transaction mechanics`

Use explicit activation rules and the inverse rule: do not include an optional block just because the source mentions it.

#### Corpus-grounded content rules

Base the rewrite on:

- `docs/report-mining/section-corpus/sections/executive-summary.md`
- the current executive-summary reference only as a source of legacy intent, not structure
- adjacent rewritten references for family alignment

Carry forward the strong corpus patterns:

- concise transaction and perimeter framing
- explicit period, unit, and basis anchors for financial conclusions
- direct synthesis of adjusted earnings or other workstream conclusions when supported
- explicit note of exclusions, cash-free debt-free mechanics, intercompany treatment, or standalone dependencies where relevant
- decision-oriented wording without recommendation or sell-side pitch language

Strip corpus artifacts and avoid reproducing:

- `Not present in source report`
- investment-bank or recommendation language
- long source-information lists that belong elsewhere
- generic risk-table formality when no real risk synthesis is provided in the source

### Test Plan

Validate the rewrite against these scenarios:

- Simple buy-side summary with transaction context, one or two headline conclusions, and a small number of dependencies
- Multi-workstream summary where QoE, NWC, and net debt each need one compact takeaway
- Carve-out or asset-deal case with explicit exclusions and cash-free debt-free mechanics
- Mixed-assurance or management-only case where the reporting basis needs to be surfaced as a confidence qualifier
- Standalone or funding-sensitive case where post-close dependency is a key watchout
- Extraction-artifact check to ensure no slot-language, old template headings, or `Not present` artifacts survive
- Structural diff check confirming the old slot/skeleton headings are removed and the new file matches the rewrite family used by adjacent references

### Assumptions and Defaults

- Use the same top-level rewrite family as the recently rewritten section references.
- Scope includes the executive-summary rewrite, the required exec-plan lifecycle, and a `TODOS.md` follow-up only if there is a real deferred post-testing need.
- Use inline micro-examples inside analytical units plus two full examples at the end.
- Use one merged `Verification and review checks` section rather than separate preflight and split-policy sections.
- Do not add a local `Common mistakes` section in v1; defer it until testing reveals recurring executive-summary-specific drafting failures.

### Implementation Checklist

- [x] 1.0 Save the accepted plan
  - [x] 1.1 Create `docs/exec-plans/active/executive-summary-reference-rewrite-plan.md`
  - [x] 1.2 Confirm the plan reflects the executive-summary rewrite scope
  - [x] 1.3 Validation for 1.0: plan exists in the active plans folder

- [x] 2.0 Rewrite the executive-summary reference
  - [x] 2.1 Replace the old slot-first structure in `skill/kpmg-fdd/references/executive-summary.md`
  - [x] 2.2 Rebuild the section around perimeter, headline-conclusion, and dependency-oriented units
  - [x] 2.3 Add inline micro-examples and full examples consistent with the new model
  - [x] 2.4 Validation for 2.0: reread the file for internal consistency and family alignment

- [x] 3.0 Validate deferred follow-up need
  - [x] 3.1 Run targeted text checks for obsolete slot-era headings and extraction artifacts
  - [x] 3.2 Decide whether post-rewrite testing follow-up should be captured in `TODOS.md`
  - [x] 3.3 Validation for 3.0: repo state reflects the rewrite and any warranted follow-up note

- [x] 4.0 Close out the plan
  - [x] 4.1 Sync the checklist to the work actually completed
  - [x] 4.2 Move the plan to `docs/exec-plans/completed/executive-summary-reference-rewrite-plan.md`
  - [x] 4.3 Validation for 4.0: completed plan exists in the completed plans folder
