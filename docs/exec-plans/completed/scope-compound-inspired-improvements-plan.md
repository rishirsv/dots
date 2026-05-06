# Scope Compound-Inspired Improvements ExecPlan

## Purpose

Improve the `scope` skill with a small set of useful ideas from Every's Compound Engineering workflows while keeping Rishi's version simpler and less process-heavy. The user-visible outcome is a Scope skill that preserves existing artifact work better, avoids duplicate durable docs, pressure-tests fuzzy product direction only when it actually helps, and presents alternatives without fighting the existing "ask with a default" pattern.

## Phase Outcomes

- Phase 1: Durable artifact behavior becomes more portable and less duplicative.
- Phase 2: Scope gains a tiny depth cue without adding a new mode selector.
- Phase 3: Discuss gets differentiated product probes and scoped option-presentation behavior.
- Phase 4: The updated skill is validated against skill structure, the existing Scope/Clarify boundary, and recent small fixes.

## Implementation Checklist

- [x] 1.0 Improve durable artifact portability and reuse
  - [x] 1.1 Add durable-output guidance in `plugins/rs-tools/skills/scope/SKILL.md`: generated repo docs should use repo-relative paths, not absolute paths.
  - [x] 1.2 Restore the existing-artifact rule that was lost when `references/artifacts.md` was consolidated: if a matching context, product spec, or plan exists, read it and ask whether to continue or start fresh.
  - [x] 1.3 Update templates only if needed to reinforce repo-relative paths without duplicating the same rule everywhere.
  - [x] 1.4 Validation for 1.0: confirm final chat can still use absolute clickable paths, but durable repo artifacts use repo-relative paths.

- [x] 2.0 Add only a tiny depth cue
  - [x] 2.1 Do not add a labeled `Right-Size The Depth` section or three formal levels.
  - [x] 2.2 Add one inline sentence in the Lanes or Common Workflow area: keep quick Scope sessions brief, but use persistent Discuss when the work is broad, fuzzy, or high-consequence.
  - [x] 2.3 Avoid a "lightweight Scope" mode that blurs into Clarify. Scope remains for broad/fuzzy work; Clarify remains for underspecified execution.
  - [x] 2.4 Validation for 2.0: confirm the new wording reads as judgment guidance, not a new mode selector.

- [x] 3.0 Add differentiated product rigor probes to Discuss
  - [x] 3.1 Add optional product probes as a supplement to the existing `What To Discuss` lenses, not a replacement and not a duplicate checklist.
  - [x] 3.2 Gate probes to fuzzy product or workflow direction, especially when the conversation lacks product evidence or the user is attached to a solution shape.
  - [x] 3.3 Use four probes unless durability is clearly defined by the topic: evidence, specificity, counterfactual, and smallest proving version.
  - [x] 3.4 Define durability only when used: "what plausible near-term change would make this idea weaker?"
  - [x] 3.5 Validation for 3.0: confirm the probes preserve the persistent-but-friendly question voice and do not duplicate every existing lens.

- [x] 4.0 Add scoped option-before-recommendation behavior
  - [x] 4.1 Add a Discuss rule: when multiple plausible directions remain after the relevant branch has been explored, present 2-3 options before recommending one.
  - [x] 4.2 Preserve the existing one-question-with-default pattern while exploring a branch; option presentation is for branch synthesis, not every question.
  - [x] 4.3 Keep options at product/mechanism level, not detailed implementation architecture unless the topic itself is technical.
  - [x] 4.4 In `Scoped Direction`, put the selected option in `Chosen Direction` and mention important rejected alternatives only when they materially explain the choice.
  - [x] 4.5 Validation for 4.0: confirm this does not conflict with the settled-branch signal or make Discuss feel like a menu-first workflow.

- [x] 5.0 Validate and review
  - [x] 5.1 Confirm the three prior small fixes remain intact: context template reader stance, precise `What To Discuss` reference, and settled-branch signal.
  - [x] 5.2 Run `python3 /Users/rishi/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/rs-tools/skills/scope`.
  - [x] 5.3 Search for stale references to deleted `references/artifacts.md` only inside runtime skill files: `plugins/rs-tools/skills/scope/`. The historical comparison doc in `docs/skill-reviews/` is out of scope unless separately refreshed.
  - [x] 5.4 Review the final diff for over-engineering, especially new sections that look like mandatory ceremony.
  - [x] 5.5 Update this ExecPlan checklist and completion notes.

## Validation

- `python3 /Users/rishi/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/rs-tools/skills/scope` passes.
- `rg -n 'artifacts\\.md|references/artifacts' plugins/rs-tools/skills/scope` returns no matches.
- The context template still says to write for a reader who was not in the conversation.
- `references/discuss.md` still references "the lenses in What To Discuss below" and keeps the settled-branch signal.
- `SKILL.md` does not add a labeled depth-mode section.
- Discuss still asks one question at a time and does not become a product-management checklist.
- Ideate remains the broad generation lane; Discuss remains the persistent shared-understanding lane.

## Decision Log

- Ship artifact portability and resume-existing-artifact behavior first because it is highest value and lowest risk.
- Do not add mandatory `docs/brainstorms/`, `docs/ideation/`, scratch checkpoints, multi-agent ideation, or strategy-doc creation.
- Avoid three formal depth levels because labeled levels can become de facto modes and blur Clarify/Scope.
- Treat product probes as optional supplements that fire only when the existing lenses are not specific enough for fuzzy product direction.
- Preserve "ask one question with a default" during branch exploration; use 2-3 option presentation only when synthesizing multiple plausible directions.
- Keep artifact templates in `assets/` and routing in `SKILL.md`.
- Keep the historical `docs/skill-reviews/scope-vs-grill-with-docs-comparison.md` out of scope for runtime stale-reference checks.

## Surprises And Discoveries

- The original `references/artifacts.md` had a useful duplicate-prevention rule that should be restored in `SKILL.md`.
- Every's useful overlap with Scope is mostly facilitation discipline, not its workflow infrastructure.
- The prior small fixes are already present in the current working tree and should be preserved rather than replanned.

## Completion Notes

- Shipped: Restored existing-artifact resume behavior, added repo-relative path guidance, added a single inline depth cue, added optional product probes, and scoped option-before-recommendation behavior.
- Remaining: None.
- Follow-up: Historical review docs still mention the deleted `references/artifacts.md`; leave them as historical context unless the review artifact itself is refreshed later.
