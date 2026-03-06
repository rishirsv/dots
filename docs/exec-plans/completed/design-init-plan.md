# Design Init Plan

## Summary
Create a new standalone skill `design-init` under the repo skill set. Its job is narrow and explicit: create or refresh `docs/DESIGN.md` for iterative UI work on an existing repo. The skill should only trigger for explicit design-context setup or refresh requests, and it should inline the token-sync guidance from `design-token-sync.md` instead of shipping a separate reference file.

## Phase Outcomes

### Phase 1: Define The Skill Contract
Establish `design-init` as the single skill for creating or refreshing repo UI context in `docs/DESIGN.md`.

### Phase 2: Package The Skill
Create the skill folder, write the normalized `SKILL.md`, and generate UI-facing metadata.

### Phase 3: Validate And Land
Verify the skill structure and move the completed plan into the completed plans folder.

## Implementation Checklist
- [x] 1.0 Save the accepted execution plan
  - [x] 1.1 Create `docs/exec-plans/active/design-init-plan.md`
  - [x] 1.2 Capture the skill contract, output rules, and assumptions
  - [x] 1.3 Validation for 1.0: confirm the active plan file exists
- [x] 2.0 Create the new `design-init` skill
  - [x] 2.1 Initialize `skills/design-init`
  - [x] 2.2 Write normalized frontmatter and the workflow body
  - [x] 2.3 Inline the token-sync guidance into `Theme and Token Context`
  - [x] 2.4 Validation for 2.0: confirm the skill contains `SKILL.md` and `agents/openai.yaml`
- [x] 3.0 Align the skill with the explicit trigger and output contract
  - [x] 3.1 Restrict the skill to explicit create/refresh requests only
  - [x] 3.2 Lock output to `docs/DESIGN.md`
  - [x] 3.3 Validation for 3.0: confirm the required sections and sync contract are present
- [x] 4.0 Generate metadata and validate the final skill
  - [x] 4.1 Generate `agents/openai.yaml`
  - [x] 4.2 Run skill validation
  - [x] 4.3 Move the completed plan to `docs/exec-plans/completed/`

## Public Interfaces And Contracts
- New skill entrypoint: `design-init`
- Output file contract: `docs/DESIGN.md` only
- Required `docs/DESIGN.md` sections:
  - `Component Context`
  - `Layout Context`
  - `Route Context`
  - `Theme and Token Context`
- Required aligned sections when `docs/DESIGN.md` already exists:
  - `Design System Map`
  - `Component Context`
  - `Layout Context`
  - `Route Context`
  - `Theme and Token Context`
  - `Context Refresh Contract`
  - `Validation Notes`
- Excerpt contract:
  - 8-30 lines per snippet
  - 3-8 snippets per high-value entry
  - source path plus line anchors
  - pointer-only entries for low-risk boilerplate

## Assumptions And Defaults
- The new skill will be added as `skills/design-init`.
- `design-init` is a standalone skill name, not part of the `designer-*` family.
- Token-sync behavior is inlined into `SKILL.md` instead of stored as a separate bundled reference.
- The skill is intentionally strict: it always targets `docs/DESIGN.md` and only runs for explicit context-init or context-refresh requests.
