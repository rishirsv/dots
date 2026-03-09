# FDD Report QC Skill Plan

## Phase outcomes

### Phase 1: Re-scope the copied skill for FDD review

This phase turns the copied investment banking deck checker into a due diligence report reviewer so the skill is clearly aimed at FDD reports, report sections, and diligence exhibits.

### Phase 2: Replace deck checks with FDD quality gates

This phase keeps the strong four-lane review structure but changes each lane to the checks a diligence team actually needs before a report goes out.

### Phase 3: Pull in the strongest diligence-review patterns

This phase brings in the best ideas from nearby FDD, data-validation, diligence, and risk-scoring skills without turning the new skill into a drafting or research workflow.

### Phase 4: Redesign references and outputs

This phase gives the skill FDD-specific writing guidance, a partner-friendly review template, and a report-aware numeric helper so the package is consistent end to end.

### Phase 5: Finalize and verify the package

This phase ensures the skill folder, plan, and helper script all work together and are ready for immediate use.

## Implementation checklist

- [x] 1.0 Save the accepted plan in `docs/exec-plans/active/`
  - [x] 1.1 Create the missing `docs/exec-plans/active/` directory structure
  - [x] 1.2 Save this plan as `docs/exec-plans/active/fdd-report-qc-plan.md`
  - [x] 1.3 Confirm the plan exists before skill edits begin
- [x] 2.0 Reframe the copied skill as an FDD report QC skill
  - [x] 2.1 Rewrite skill metadata, title, triggers, and artifact language
  - [x] 2.2 Define reviewer-only behavior and accepted inputs
  - [x] 2.3 Preserve the four-lane review structure while changing the review lens
- [x] 3.0 Convert the four QC lanes to FDD-specific behavior
  - [x] 3.1 Add numeric tie-out checks across core FDD sections and exhibits
  - [x] 3.2 Add evidence-versus-conclusion checks for diligence claims
  - [x] 3.3 Add FDD writing standards and overclaim controls
  - [x] 3.4 Add report assembly and document-control checks
- [x] 4.0 Rework references and helper assets
  - [x] 4.1 Replace IB terminology guidance with an FDD writing standards reference
  - [x] 4.2 Rewrite the report output template for FDD QC findings
  - [x] 4.3 Keep and adapt the numeric extraction helper for report-wide tie-out review
- [x] 5.0 Finalize the output contract and validate the package
  - [x] 5.1 Define severity-grouped issue types and release-readiness verdicts
  - [x] 5.2 Ensure the skill does not drift into drafting or research behavior
  - [x] 5.3 Run verification on the helper script and the final file set

## Notes from implementation

- The old `ib-terminology.md` reference was renamed to `fdd-writing-standards.md` to better match the new skill purpose.
- The numeric helper remains part of the core workflow for full-report reviews and now uses report sections rather than slide numbers as its main location reference.
