# Designer Polish Iterative Loop Plan

## Summary
Extend `designer-polish` with an iterative evidence-loop mode for requests like `design polish 5x` and other iterative polish wording, while preserving the existing single-pass behavior for ordinary polish requests.

## Phase Outcomes

### Phase 1: Define Iterative Mode
Add a clear iterative submode with explicit trigger rules, iteration counts, and evidence artifacts.

### Phase 2: Add Capture And Evaluation Workflow
Teach the skill to capture before and after evidence, choose project-aware screenshot tooling, and alternate between fuller and quicker evaluation passes.

### Phase 3: Validate And Land
Regenerate metadata, validate the updated skill, and move the completed plan to the completed plans folder.

## Implementation Checklist
- [x] 1.0 Save the accepted execution plan
  - [x] 1.1 Create `docs/exec-plans/active/designer-polish-iterative-loop-plan.md`
  - [x] 1.2 Capture the iterative mode contract and assumptions
  - [x] 1.3 Validation for 1.0: confirm the active plan file exists
- [x] 2.0 Update `designer-polish`
  - [x] 2.1 Expand the frontmatter and body to support iterative mode triggers
  - [x] 2.2 Add the evidence-loop workflow and artifact naming contract
  - [x] 2.3 Add project-aware screenshot routing and fallback rules
  - [x] 2.4 Validation for 2.0: confirm single-pass and iterative mode are both documented
- [x] 3.0 Regenerate metadata and validate the final skill
  - [x] 3.1 Regenerate `agents/openai.yaml`
  - [x] 3.2 Run skill validation
  - [x] 3.3 Move the plan to `docs/exec-plans/completed/`

## Assumptions And Defaults
- The implementation updates `designer-polish` instead of creating a new skill.
- Iterative wording without an explicit count defaults to 3 iterations.
- The iterative-evidence guidance is folded directly into `designer-polish` rather than creating a new reference file.
- The skill should prefer existing screenshot methods and should not introduce a new capture method without user confirmation.
