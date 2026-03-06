# Designer iOS Plan

## Summary
Create a new skill named `designer-ios` in the repo `skills/` directory by combining the provided `expo-ui-swift-ui` and `building-native-ui` source skills. Keep source instructional content verbatim, and limit restructuring work to skill packaging concerns such as normalized frontmatter, `agents/openai.yaml`, and copied resource folders.

## Phase Outcomes

### Phase 1: Merge Design Scope
Create one clear skill entrypoint that covers both broad Expo native UI design guidance and the focused Expo SwiftUI bridge guidance.

### Phase 2: Normalize Skill Packaging
Package the merged skill so it matches repo conventions for skill metadata, folder layout, and UI-facing agent metadata without rewriting the instructional content itself.

### Phase 3: Validate And Land
Check that the new skill is structurally valid and ready to live in the shared `skills/` collection.

## Implementation Checklist
- [x] 1.0 Save the accepted execution plan for the merged skill
  - [x] 1.1 Create `docs/exec-plans/active/designer-ios-plan.md`
  - [x] 1.2 Capture the merge scope, assumptions, and validation approach
  - [x] 1.3 Validation for 1.0: confirm the active plan file exists
- [x] 2.0 Create the new `designer-ios` skill shell
  - [x] 2.1 Initialize `skills/designer-ios` with the standard skill structure
  - [x] 2.2 Copy any bundled resources from the source skills without rewriting them
  - [x] 2.3 Validation for 2.0: confirm the new skill folder contains expected files and directories
- [x] 3.0 Merge the source skill content verbatim
  - [x] 3.1 Create a normalized `SKILL.md` frontmatter using only `name` and `description`
  - [x] 3.2 Preserve the body content from both source skills verbatim in the merged skill
  - [x] 3.3 Validation for 3.0: confirm no source reference files were edited during copy
- [x] 4.0 Add agent metadata and validate the final skill
  - [x] 4.1 Generate `agents/openai.yaml` for `designer-ios`
  - [x] 4.2 Run skill validation
  - [x] 4.3 Validation for 4.0: confirm validator passes cleanly

## Assumptions And Defaults
- The merged skill will live at `/Users/rishi/Code/ai-tools/skills/designer-ios`.
- “Copy verbatim and merge” means preserving the instructional body text from the two provided skills as-is, while allowing new top-level frontmatter and generated `agents/openai.yaml`.
- The `building-native-ui` `references/` folder should be copied into the new skill because it is part of the source skill package.
