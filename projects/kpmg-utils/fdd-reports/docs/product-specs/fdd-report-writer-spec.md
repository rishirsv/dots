# Feature: fdd-report-writer

## TL;DR

- **Problem:** The current `kpmg-fdd` skill mixes old workflow assumptions with newer section-contract references and no longer reflects how the skill should actually be used.
- **Solution:** Rewrite the skill as `fdd-report-writer`, a report-writing skill optimized for section-by-section FDD drafting in Markdown.
- **Solution:** Use artifact-based routing (`section`, `exhibit`, `full_report`) with writing operations (`rewrite`, `draft`, `polish`) applied inside each path.
- **Solution:** Keep `SKILL.md` medium-sized with strong operational guidance, while pushing section-specific drafting logic into the live reference set.

## Scope

- **In:** Renaming the skill, rewriting `SKILL.md`, updating agent-facing packaging and instructions to match the new structure, and aligning the skill to the existing 2.0 reference system.
- **Out:** Reference maintenance workflows, corpus-mining workflows, built-in QC/report-checker automation, DOCX generation as a primary responsibility, and changes to external products such as TS Copywriter.

## What We're Building

We are building a cleaner writing-focused FDD skill that defaults to drafting one section or one exhibit at a time. The skill should still support full-report requests, but that should be a secondary path rather than the main operating model.

The routing model should first determine the artifact being produced: a section, an exhibit, or a full report. It should then determine the writing operation: rewrite, draft, or polish. This preserves the useful distinctions from TS Copywriter while giving the FDD skill stronger scope control and better alignment with the section-reference system.

The rewritten skill should use the live reference set as its default drafting backbone, but in a guided rather than rigid way. It should normalize informal section asks to canonical section names internally, proceed with placeholders when missing inputs do not change the logic, and reserve clarification questions for cases where the missing facts materially change what should be written.

## Requirements

- [ ] Rename the skill from `kpmg-fdd` to `fdd-report-writer`.
- [ ] Rewrite `SKILL.md` so it describes a report-writing skill only.
- [ ] Support artifact-based routing for `section`, `exhibit`, and `full_report`.
- [ ] Support writing operations for `rewrite`, `draft`, and `polish` within each artifact path.
- [ ] Remove `qc_only` as a top-level mode.
- [ ] Keep `full_report` as an outline-first path that stops after the outline unless the user asks to continue.
- [ ] Default to section-by-section drafting as the primary operating model.
- [ ] Use the reference files in `references/` as the drafting backbone, but allow adaptation based on the user’s ask and available evidence.
- [ ] Normalize informal section names to canonical section names internally.
- [ ] Proceed with placeholders unless missing information changes the section logic.
- [ ] For normal section and exhibit requests, return the requested prose plus a short `What changed / assumptions` note.
- [ ] Keep `SKILL.md` medium-sized by preserving strong operational guidance while leaving section-specific logic in the references.

## How It Works

The skill starts by identifying the artifact the user wants. If the user wants a section, the skill routes to the section path; if the user wants a narrow analytical block such as adjustments or a bridge narrative, it routes to the exhibit path; if the user explicitly wants a full report, it routes to the full-report path. This artifact decision controls output scope.

Inside that path, the skill determines the writing operation. `Draft` synthesizes from notes or mixed materials. `Rewrite` can improve weak structure when needed, but does not fully re-architect by default. `Polish` preserves structure and substance while tightening clarity, precision, and tone. This second layer controls how aggressively the skill changes the source material.

The skill then uses the relevant section reference as the default contract, applies global writing conventions, and drafts only the requested deliverable. It should avoid forcing full workflows onto narrow asks. If the request is for a full report, the skill should create a concise outline first and stop there unless the user explicitly asks it to proceed into drafting.

## Acceptance Criteria

- Given a request to write one section from notes, when the skill is invoked, then it drafts only that section and does not expand into a full report.
- Given a request to rewrite an existing section, when the skill is invoked, then it improves weak structure where needed without automatically re-architecting the section.
- Given a request to polish an existing section, when the skill is invoked, then it preserves structure and substance while tightening wording and clarity.
- Given an informal section request such as “write the working capital section,” when the skill is invoked, then it maps the request internally to the canonical section and proceeds without asking for terminology confirmation.
- Given a request with missing factual detail that does not change the logic, when the skill is invoked, then it proceeds with placeholders rather than blocking on clarification.
- Given a request for a full report, when the skill is invoked, then it produces an outline first and stops unless the user asks it to continue.

## Context

- Related skill: [SKILL.md](/Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports/skill/kpmg-fdd/SKILL.md)
- Reference index: [INDEX.md](/Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports/skill/kpmg-fdd/references/INDEX.md)
- Global conventions: [global-writing-conventions.md](/Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports/skill/kpmg-fdd/references/global-writing-conventions.md)
- Comparison reference: [meta-skill.md](/Users/rishi/Code/ai-tools/evals-skills-main/meta-skill.md)

## Open Questions

- What exact package/file rename path should be used when moving from `kpmg-fdd` to `fdd-report-writer`?
- Should the final user-facing output contract be identical across `section` and `exhibit`, or should exhibits use a lighter close-out than sections?
