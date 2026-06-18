# Skill Description Guidance - Q03 Doctor Report

## Current Understanding

Task: review the existing Skill Writer source and propose the smallest precise edit to stop overfitting description authoring to `Use when ...; not for ...` when a skill is explicit-only.

Chosen track: Diagnose/Edit guidance-first proposal. I did not use a reproduction/trial track because the reported failure is concrete and localizable from the current guidance.

Edit authorization: not authorized. This report proposes a patch only and does not edit skill payload files.

## Facts

- Source of truth inspected:
  - `plugins/meta-skill/skills/skill-writer/SKILL.md`
  - `plugins/meta-skill/skills/skill-writer/references/design.md`
  - `plugins/meta-skill/skills/skill-doctor/SKILL.md`
  - `plugins/meta-skill/skills/skill-doctor/references/diagnose.md`
  - `plugins/meta-skill/skills/skill-doctor/references/edit.md`
- `SKILL.md` directs Skill Writer to use `references/design.md` as the governing principle guide.
- `SKILL.md` asks every draft outline for `Trigger`, defined as real user language plus the nearest `not for` boundary.
- `design.md` has an explicit-only invocation concept: use explicit-only when the user should be the index, and keep the required `SKILL.md` description concise and human-facing in runtimes that still require it for validation.
- `design.md` also says the frontmatter description is the primary routing surface and gives the pattern `description: Use when <...>; not for <...>.`
- `design.md` later says frontmatter should use only:

```yaml
---
name: lowercase-hyphen-name
description: Use when ...; not for ...
---
```

## Inferences

- The failure is caused by conflicting emphasis, not missing conceptual support. Skill Writer already knows explicit-only skills exist, but the strongest description-writing guidance still treats every description as a model-discoverable activation surface.
- The likely behavior path is: the writer reads Trigger Contract and Frontmatter before applying the later Invocation And Granularity exception, then optimizes the description into a `Use when ...; not for ...` trigger contract even when the user intends explicit invocation.
- The most important stale guidance is the unconditional wording in `Trigger Contract` and `Frontmatter`, because those sections directly tell the writer how to author the field.

## Root Cause

Observed fail state: Skill Writer keeps optimizing `description` as a trigger surface for explicit-only skills.

Likely source: `plugins/meta-skill/skills/skill-writer/references/design.md`, specifically the unconditional trigger-contract and frontmatter examples.

Why this source is likely: the file simultaneously says explicit-only descriptions are human-facing metadata and then presents `Use when ...; not for ...` as the required frontmatter pattern. The explicit-only exception is present, but it is not attached to the description-authoring rules where the writer makes the wording decision.

## Candidate Edits

1. Add an explicit-only carveout inside `design.md` `Trigger Contract` and make the frontmatter example conditional.
   - Pros: fixes the source of the conflict where description wording is decided; preserves model-discoverable guidance unchanged; changes one source file.
   - Cons: touches two nearby places in the same reference because both currently express the unconditional pattern.

2. Change only `SKILL.md`'s interview table from `Trigger` to `Invocation posture / trigger`.
   - Pros: very small top-level edit.
   - Cons: does not remove the unconditional `Use when ...; not for ...` instruction in the governing design reference, so the writer may still overfit during the design pass.

3. Add another sentence to `Invocation And Granularity` saying explicit-only descriptions should not use `Use when ...; not for ...`.
   - Pros: one local insertion in the existing explicit-only section.
   - Cons: weaker than option 1 because the contradictory pattern remains earlier and later in the same file.

## Recommended Edit

Apply option 1: update `design.md` so model-discoverable skills keep the trigger-contract pattern, while explicit-only skills get a separate human-facing metadata rule.

This is a description-guidance change, so it affects routing behavior for future generated skills. It should make explicit-only skill descriptions less trigger-optimized and more like concise human-facing summaries.

Exact patch-style snippet:

````diff
diff --git a/plugins/meta-skill/skills/skill-writer/references/design.md b/plugins/meta-skill/skills/skill-writer/references/design.md
--- a/plugins/meta-skill/skills/skill-writer/references/design.md
+++ b/plugins/meta-skill/skills/skill-writer/references/design.md
@@
-The frontmatter description is the primary routing surface. The body is not loaded until the skill triggers, so the description must answer: “Should the runtime read this skill now?”
+For model-discoverable skills, the frontmatter description is the primary routing surface. The body is not loaded until the skill triggers, so the description must answer: “Should the runtime read this skill now?”
+
+For explicit-only skills, do not optimize the description as an activation surface. Keep it as concise human-facing metadata that names what the skill does and how a user should recognize it; avoid forced `Use when ...; not for ...` phrasing unless it is naturally useful to the human index.
@@
-Pattern:
+Model-discoverable pattern:
@@
 ## Frontmatter
 
-Use only:
+For model-discoverable skills, use:
 
 ```yaml
 ---
 name: lowercase-hyphen-name
 description: Use when ...; not for ...
 ---
 ```
+
+For explicit-only skills, use the same `name` field and a concise human-facing
+`description` without forcing the `Use when ...; not for ...` pattern.
 ````

## Validation To Run

After applying the approved edit:

```sh
plugins/meta-skill/scripts/metaskill validate plugins/meta-skill/skills/skill-writer --json
```

Then review the changed `design.md` directly for these checks:

- Model-discoverable descriptions still have the `Use when ...; not for ...` pattern.
- Explicit-only descriptions are clearly treated as human-facing metadata.
- The change does not weaken the need for a real ownership boundary; it only changes where that boundary lives for explicit-only skills.

## Residual Risk

- `SKILL.md` still asks for a `Trigger (+ not for)` in the draft outline. That may be acceptable because the writer still needs to decide invocation posture and boundaries, but if overfitting persists after the recommended edit, the next smallest follow-up would be to rename that outline field to `Invocation / boundary` and make explicit-only the documented branch.
