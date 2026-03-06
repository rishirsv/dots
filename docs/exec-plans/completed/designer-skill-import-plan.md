# Designer Skill Import Plan

## Summary
Import selected skills from the Impeccable skill library into this repo as three cleaner public skills: `designer-frontend`, `designer-audit`, and `designer-polish`. The new set should preserve the strongest source guidance while reducing overlap between creation, review, and ship-readiness workflows.

## Phase Outcomes

### Phase 1: Define Clear Skill Boundaries
Create a small designer skill family where each skill has one obvious job, so users do not have to guess which skill to reach for.

### Phase 2: Merge Source Guidance Without Redundancy
Fold overlapping source skills together so the new skills are more useful than the originals and do not repeat the same instructions across multiple entrypoints.

### Phase 3: Package And Validate
Save the merged skills in repo-ready format with normalized metadata, agent metadata, and successful validation.

## Public Skill Map

- `designer-frontend`
  Owns frontend UI creation and redesign. This is the primary build skill for distinctive, production-grade interfaces and keeps the bundled design references from `frontend-design`.
- `designer-audit`
  Owns review and diagnosis. It combines systematic auditing and higher-level design critique into one reporting skill that identifies design problems and prioritizes what to fix.
- `designer-polish`
  Owns final refinement before shipping. It combines detail polish, performance optimization, and resilience hardening into one implementation-focused finishing pass.

## Implementation Checklist
- [x] 1.0 Save the accepted execution plan
  - [x] 1.1 Create `docs/exec-plans/active/designer-skill-import-plan.md`
  - [x] 1.2 Capture the target skill map and non-overlap rules
  - [x] 1.3 Validation for 1.0: confirm the active plan file exists
- [x] 2.0 Create `designer-frontend`
  - [x] 2.1 Initialize the skill folder
  - [x] 2.2 Port and normalize the `frontend-design` guidance
  - [x] 2.3 Copy the source reference files
  - [x] 2.4 Validation for 2.0: confirm the skill folder includes `SKILL.md`, `agents/openai.yaml`, and the expected references
- [x] 3.0 Create `designer-audit`
  - [x] 3.1 Initialize the skill folder
  - [x] 3.2 Merge `audit` and `critique` into one non-redundant review workflow
  - [x] 3.3 Validation for 3.0: confirm review scope is distinct from creation and polish skills
- [x] 4.0 Create `designer-polish`
  - [x] 4.1 Initialize the skill folder
  - [x] 4.2 Merge `polish`, `optimize`, and `harden` into one non-redundant finishing workflow
  - [x] 4.3 Validation for 4.0: confirm ship-readiness scope is distinct from creation and audit skills
- [x] 5.0 Generate metadata and validate all imported skills
  - [x] 5.1 Generate `agents/openai.yaml` for each new skill
  - [x] 5.2 Run skill validation for each folder
  - [x] 5.3 Validation for 5.0: confirm all three skills pass validation

## Non-Overlap Rules
- `designer-frontend` should create and redesign interfaces, not do formal audits or exhaustive final QA passes.
- `designer-audit` should diagnose and prioritize issues, not implement fixes.
- `designer-polish` should refine and harden a nearly complete interface, not act as the primary design ideation skill.

## Assumptions And Defaults
- The new skills should be created under `/Users/rishi/Code/ai-tools/skills`.
- `designer-frontend` will keep the source `frontend-design` references because they are part of that skill’s working value.
- The merged skills should use normalized frontmatter with only `name` and `description`, even if the source skills include extra fields.
