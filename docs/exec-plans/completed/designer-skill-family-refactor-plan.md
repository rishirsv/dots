# Designer Skill Family Refactor Plan

## Summary
Refactor the current monolithic `designer` skill into a lean v1 family of five skills, replacing `designer` immediately rather than keeping a wrapper. The new base skill, `designer-frontend`, will absorb both the current frontend creation/redesign workflow and the "polish" and "adapt" responsibilities, so there will be no separate `designer-polish` or `designer-adapt` in v1.

The plan keeps your strongest existing assets and workflows, especially HTML-to-React conversion, Apple-native mobile UI guidance, and `docs/DESIGN.md` context management, while selectively importing the best doctrine and phrasing from Impeccable. Borrowed material will be split between concise skill bodies and stronger reference docs rather than dumped wholesale into one large prompt.

## Phase Outcomes

### Phase 1: Family Architecture
Create a clear, predictable skill family so people can tell which designer skill to use without guessing.

### Phase 2: Content Migration And Doctrine Upgrade
Keep the strongest parts of the current designer skill, add the best design doctrine from Impeccable, and package it into smaller skills that stay readable.

### Phase 3: Validation And Cutover
Replace the old skill with a complete new family that is internally consistent, easy to discover, and ready for day-to-day use.

## Public Interfaces And Skill Map
The implementation will ship these skills as the new v1 public surface:

- `designer-frontend`
- `designer-html-to-react`
- `designer-native-ios`
- `designer-context`
- `designer-audit`

The implementation will remove `designer` as the primary skill entrypoint in the same wave.

Responsibilities by skill:

- `designer-frontend`
  Merges the current broad web/frontend design workflow with final quality-pass guidance and cross-device adaptation guidance. It becomes the default skill for web UI design, redesign, responsive improvement, and final ship-quality refinement.
- `designer-html-to-react`
  Owns deterministic HTML-to-React conversion, templates, data extraction scaffolds, signed-URL fetch handling, and validation.
- `designer-native-ios`
  Owns React Native / Expo Apple-mobile UI guidance. V1 scope includes both iPhone-first design and iPad adaptation, while staying Apple-native rather than broadening to generic React Native mobile design.
- `designer-context`
  Owns creation and refresh of `docs/DESIGN.md`, including design context capture and token/theme summaries.
- `designer-audit`
  Combines systematic audit and higher-level design critique into one review skill. It should diagnose quality, AI-slop tells, accessibility/responsive/theming/performance issues, and point to the appropriate follow-up skill.

Explicit non-goals for v1:

- No separate `designer-polish`
- No separate `designer-adapt`
- No separate `designer-critique`
- No separate `designer-motion`, `designer-copy`, `designer-systemize`, or `designer-onboarding` yet

## Implementation Checklist
- [x] 1.0 Create the v1 family skeleton and finalize skill boundaries
- [x] 1.1 Add `designer-frontend`
- [x] 1.2 Add `designer-html-to-react`
- [x] 1.3 Add `designer-native-ios`
- [x] 1.4 Add `designer-context`
- [x] 1.5 Add `designer-audit`
- [x] 2.0 Migrate existing scripts/templates into the correct new skill folders
- [x] 2.1 Rename `resources/` usage to `assets/` in the new family
- [x] 2.2 Fold existing frontend, polish, and adaptation guidance into `designer-frontend`
- [x] 2.3 Fold selected Impeccable doctrine and wording into bodies and references
- [x] 2.4 Expand Apple-mobile guidance to cover iPad adaptation
- [x] 2.5 Reconcile conflicting or stale guidance in current Apple-mobile references
- [x] 3.0 Validate skill structure, references, and trigger clarity
- [x] 3.1 Update repo references to the new skill names
- [x] 3.2 Remove the old `designer` skill
- [x] 3.3 Save the accepted execution plan under `docs/exec-plans/active/`

## Test Plan
Implementation acceptance should cover these scenarios:

- `designer-frontend` triggers for web UI creation, redesign, responsive cleanup, and final-quality-pass requests without requiring a separate polish or adapt skill.
- `designer-html-to-react` triggers only for deterministic HTML-reference conversion tasks and still exposes the template, extraction, fetch, and validation workflow.
- `designer-native-ios` triggers for Expo/React Native Apple-mobile tasks and clearly covers both iPhone and iPad adaptation.
- `designer-context` triggers only for design-context generation or refresh requests and keeps `docs/DESIGN.md` as the sole context file.
- `designer-audit` handles both systematic audits and higher-level critique without drifting into implementation behavior.
- No new skill body exceeds the intended concise scope, and detailed doctrine lives in references rather than inflating the main body.
- No new skill uses extra frontmatter fields beyond `name` and `description`.
- Reference paths are discoverable from each `SKILL.md`, and deep nesting is reduced where it would otherwise obscure usage.

## Assumptions And Defaults
- Repo `skills/` is the source of truth for this refactor; syncing any installed copy outside the repo is a follow-up unless the implementation explicitly chooses to include it.
- `designer-frontend` is the merged base skill for design, polish, and adaptation in v1.
- Borrowed Impeccable content will be selectively reused, with strong passages allowed in both skill bodies and references, but not aggressively ported wholesale.
- No explicit attribution mechanism is planned for the borrowed wording in this first pass.
- `designer-native-ios` remains Apple-native in orientation rather than becoming a general cross-platform React Native design skill.
- The workspace currently lacks a `docs/` directory, so implementation must create the plan path before saving the accepted plan.
