# Designer Design MD Priority Plan

## Summary
Update the existing `designer-*` skills so they all prioritize `docs/DESIGN.md` when it exists and preserve existing design conventions unless the user explicitly asks to depart from them.

## Phase Outcomes

### Phase 1: Add Shared Priority Behavior
Make each designer skill start from the repo’s saved design context rather than re-deriving conventions from scratch.

### Phase 2: Tailor The Rule To Each Skill
Adjust the rule so it fits creation, audit, polish, and iOS design work without blurring the boundaries between those skills.

### Phase 3: Validate And Land
Confirm the updated skills remain structurally valid and move the plan to the completed folder.

## Implementation Checklist
- [x] 1.0 Save the accepted execution plan
  - [x] 1.1 Create `docs/exec-plans/active/designer-design-md-priority-plan.md`
  - [x] 1.2 Capture the shared priority rule and assumptions
  - [x] 1.3 Validation for 1.0: confirm the active plan file exists
- [x] 2.0 Update the designer skill bodies
  - [x] 2.1 Add the priority rule to `designer-frontend`
  - [x] 2.2 Add the priority rule to `designer-audit`
  - [x] 2.3 Add the priority rule to `designer-polish`
  - [x] 2.4 Add the priority rule to `designer-ios`
  - [x] 2.5 Validation for 2.0: confirm each skill reads `docs/DESIGN.md` first when present and defaults to existing conventions
- [x] 3.0 Validate the updated skills and close out the plan
  - [x] 3.1 Run skill validation for the updated skills
  - [x] 3.2 Move the plan to `docs/exec-plans/completed/`

## Assumptions And Defaults
- The update applies to the skills already created in this repo: `designer-frontend`, `designer-audit`, `designer-polish`, and `designer-ios`.
- `docs/DESIGN.md` should be treated as the highest-priority repo design context when it exists.
- If `docs/DESIGN.md` does not exist, the skills should not regenerate it silently; `design-init` remains the explicit context-generation skill.
- Existing design conventions should be preserved by default unless the user explicitly asks for a departure or redesign.
