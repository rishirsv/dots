# Frontend Skill Interface Writing Plan

## Goal

Add interface-writing guidance to `frontend-skill` so mixed design-and-copy requests are handled well without turning the skill into a general writing skill.

## Phase 1: Define the integration boundary

Outcome: `frontend-skill` knows when interface copy is in scope and when deeper writing guidance should be pulled in.

- [x] 1.1 Keep interface-writing support scoped to product and UI copy inside frontend work
- [x] 1.2 Add an explicit routing section in `skills/frontend-skill/SKILL.md`
- [x] 1.3 Confirm the routing language does not broaden the skill into general marketing or docs writing

## Phase 2: Route to dedicated writing guidance

Outcome: the skill stays lean while still providing full copy guidance when the task needs it.

- [x] 2.1 Add a local reference file under `skills/frontend-skill/references/`
- [x] 2.2 Make the main skill point to that reference for voice, tone, and interface pattern guidance
- [x] 2.3 Keep the detailed writing guidance out of the main skill body

## Phase 3: Update trigger metadata

Outcome: Codex is more likely to activate `frontend-skill` for mixed UI and copy requests.

- [x] 3.1 Expand the `frontend-skill` frontmatter description to mention interface copy in frontend tasks
- [x] 3.2 Update `skills/frontend-skill/agents/openai.yaml` to match the new scope
- [x] 3.3 Keep standalone writing requests from being framed as the main use case

## Phase 4: Validate the integration

Outcome: the updated skill reads cleanly and has a clear workflow for design-plus-copy tasks.

- [x] 4.1 Review the updated files for consistency and routing clarity
- [x] 4.2 Sanity-check example prompts against the new trigger language
- [x] 4.3 Move this plan to `docs/exec-plans/completed/` after the implementation is finished
