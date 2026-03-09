# AGENTS.md

## Purpose

This repo is for rewriting, maintaining, and using the `kpmg-fdd` report-writing skill and its supporting reference system.

The active authoring surface is:

- `skill/kpmg-fdd/SKILL.md`
- `skill/kpmg-fdd/references/INDEX.md`
- the section contracts listed in that index

Treat those files as the live source of truth for report-writing behavior.

## Current reference model

The active section system is request-shaped and section-contract-driven.

Use the rewritten section family, not the old slot-template model. Active section contracts now follow the newer pattern built around concepts such as:

- `Section objective`
- `Core principles`
- `Analytical workflow`
- `Section architecture`
- `Available analytical units` or section-specific component catalogs
- `Assembly patterns`
- `Section-specific writing guidance`
- `Verification and review checks`
- `Full examples`

Do not recreate the deleted slot-era standard or introduce renderer-first headings unless the user explicitly asks for legacy compatibility with an existing draft.

## Canonical files

When working in this repo, use these files first:

- global rules: `skill/kpmg-fdd/references/global-writing-conventions.md`
- section router: `skill/kpmg-fdd/references/INDEX.md`
- rewrite process: `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md`
- active/completed plan records: `docs/exec-plans/active/` and `docs/exec-plans/completed/`

Treat the corpus as primary evidence for how real sections behave:

- `docs/report-mining/section-corpus/sections/`
- `docs/report-mining/section-corpus/adjustments/`

Use adjacent rewritten references for calibration before inventing a new local pattern.

## Repo-specific working rules

### Reference rewrites

- Explore first, ask second.
- Use the corpus to determine the section’s real analytical job before changing structure.
- Separate global writing rules from section-specific logic.
- Keep mandatory blocks minimal and optional blocks trigger-based.
- Prefer one integrated verification section over scattered QC notes unless the section truly benefits from separation.
- Do not add “common mistakes” sections by default. Add them only if repeated failures show up in practice.

### Plans

- If a rewrite or material restructuring is accepted, save the plan to `docs/exec-plans/active/<feature-slug>-plan.md`.
- When the work is complete, move it to `docs/exec-plans/completed/<feature-slug>-plan.md`.
- Keep plan checklists synced to actual work performed.
- If an older plan is superseded, replace it rather than layering addendums on top.

### Skill packaging

- Keep `skill/kpmg-fdd` focused on report writing and reference guidance.
- Do not add checker utilities, packaging clutter, or sidecar docs unless they clearly belong in the writing skill.
- If a capability is better modeled as a separate tool or checker skill, keep it out of `kpmg-fdd`.
- Keep `agents/openai.yaml` aligned with `SKILL.md` when trigger scope changes.

## Learned drafting preferences

- Prefer one adaptive layout per section contract, with scaling rules, instead of multiple named layout variants.
- Merge structural recipe guidance into the section architecture or analytical-units model instead of scattering it across separate template headings.
- Keep render guidance semantic and authoring-focused, not presentation-slot-focused.
- Use inline micro-examples plus one or two full worked examples instead of detached example appendices.
- Keep optional blocks explicit and trigger-based.
- Handle missing information with inline placeholders or local limitation logic, not generic open-item lists.

## Section-specific preferences learned so far

### Net debt

- Use `Other considerations` for potentially debt-like items that are not fully quantifiable.
- Do not include a comments column in net debt schedules.
- Write net debt adjustments as numbered, full-sentence entries with explicit treatment and closing implications.
- Canonical wording source for net debt adjustments is `docs/report-mining/section-corpus/adjustments/net-debt-adjustments-library.md`, excluding extraction artifacts such as `Not present in source report`.

### QoE

- The QoE reference is the 2.0 surface inside `fdd-reports`; do not rely on `ts-copywriter` as an implementation dependency.
- Support three request shapes in the QoE reference system: rewrite, grouped adjustment set, and full section.
- Keep full QoE sections bridge-led, with excluded items and sensitivities handled explicitly.

## Avoid

- Reintroducing deleted `quality of net assets` scope.
- Pointing the reference system back to obsolete contract standards.
- Adding legacy slot-template guidance as canonical behavior.
- Treating corpus extraction artifacts as valid contract content.
- Creating generic `Open items`, `Data requests`, or tracking sections inside live section contracts.

## Default operating posture

- If the task is a light drafting or wording change, edit directly.
- If the task is a material section-reference rewrite, follow the rewrite workflow and save a plan.
- If the task affects trigger scope or packaging of the skill itself, update both `SKILL.md` and `agents/openai.yaml`.
- If a change would be better handled by a separate future skill, keep this repo clean and note the boundary instead of forcing the capability into `kpmg-fdd`.
