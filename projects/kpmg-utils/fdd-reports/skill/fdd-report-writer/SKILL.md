---
name: fdd-report-writer
description: Draft, rewrite, and polish financial due diligence report content in Markdown using the live section contracts and global writing conventions in this skill. Use when Codex needs to write or revise an executive summary, business overview, historical financial performance section, QoE section or earnings adjustments, net working capital section or adjustments, net debt section, balance sheet section, reporting environment section, a diligence exhibit narrative, or a full FDD report from diligence materials. Do not use for PowerPoint decks, report-checker automation, or reference-maintenance tasks.
---

# FDD Report Writer

Draft client-ready FDD report content in Markdown.

## Overview

- Default to section-by-section drafting.
- Treat `full_report` as a secondary path.
- Use [references/INDEX.md](references/INDEX.md) as the live drafting system.
- Use [references/global-writing-conventions.md](references/global-writing-conventions.md) in every drafting path.
- Do not assume legacy slot-template behavior unless the user explicitly asks to preserve an existing draft that already uses it.

## Core Instructions

### Route by artifact first

Pick the narrowest artifact that matches the request.

- `section`: Use for one or more report sections in prose form.
- `exhibit`: Use for a narrower analytical block such as adjustments, a bridge narrative, a schedule narrative, a table commentary, or another exhibit-sized writeup.
- `full_report`: Use only when the user explicitly asks for a full report or a clearly multi-section report build.

If the user asks for an actual PowerPoint slide or `.pptx`, use `kpmg-slides` instead.

### Select the writing operation inside the artifact

Choose one operation for the requested artifact.

- `draft`: Synthesize fresh prose from notes, source materials, and rough instructions.
- `rewrite`: Improve weak writing and weak structure when needed, but do not fully re-architect by default.
- `polish`: Preserve structure and substance; tighten clarity, precision, and tone.

Use these defaults:

- If the user says `rewrite`, `revise`, `tighten`, or `update`, use `rewrite`.
- If the user gives rough notes, mixed materials, or asks to write from scratch, use `draft`.
- If the user says `polish`, `tighten lightly`, or the text is already substantially correct, use `polish`.

### Normalize section scope internally

Map informal section names to the canonical section contracts and proceed without asking the user to confirm terminology.

Canonical sections:

- Executive summary
- Business overview
- Historical financial performance
- QoE and earnings adjustments
- Net working capital
- Net debt
- Balance sheet
- Reporting environment

If the request spans multiple sections, draft only the sections the user asked for.

### Load only the references you need

Always read:

- [references/global-writing-conventions.md](references/global-writing-conventions.md)

Then read only the relevant section contract from [references/INDEX.md](references/INDEX.md):

- [references/executive-summary.md](references/executive-summary.md)
- [references/business-overview.md](references/business-overview.md)
- [references/historical-financial-performance.md](references/historical-financial-performance.md)
- [references/qoe-and-earnings-adjustments.md](references/qoe-and-earnings-adjustments.md)
- [references/net-working-capital.md](references/net-working-capital.md)
- [references/net-debt.md](references/net-debt.md)
- [references/balance-sheet.md](references/balance-sheet.md)
- [references/reporting-environment.md](references/reporting-environment.md)

For exhibit requests, use the closest section contract as the governing reference.

### Handle missing information pragmatically

Proceed with placeholders unless the missing information changes the section logic.

Ask a brief clarifying question only when the missing detail changes:

- which section or artifact should be written
- the analytical basis of the section
- the treatment of a material adjustment or conclusion

When proceeding with incomplete inputs:

- Use placeholders such as `$[x]`, `[Date]`, `[Customer A]`, or `[basis not provided]`.
- Keep the prose client-ready.
- Do not invent numbers, support, or management positions.

### Draft sections and exhibits directly

For `section` and `exhibit` requests:

1. Identify the artifact and operation.
2. Normalize the request to the canonical section or exhibit type.
3. Extract the key evidence, periods, and numerical anchors from the provided materials.
4. Draft only the requested prose.
5. Add a short `What changed / assumptions` note after the prose.

Apply the operation as follows:

- `draft`: Build from the available materials and follow the relevant section contract as the default backbone.
- `rewrite`: Improve weak structure when it blocks clarity, but preserve the existing structure when it is already workable.
- `polish`: Keep the existing structure and meaning; focus on language, rhythm, precision, and defensibility.

### Use an outline-first flow for full reports

For `full_report` requests:

1. Identify the target company, deal context, covered periods, and in-scope sections.
2. Create a concise 3-7 bullet outline using canonical section names.
3. For each major section, state the key question, expected evidence, and likely exhibit.
4. Stop after the outline unless the user explicitly asks to continue.

If the user asks to continue after the outline:

- Draft section by section using the same section and exhibit rules above.
- Keep the report coherent across sections, but do not force unnecessary sections.

### Apply these writing constraints in every mode

- Anchor every material quantitative claim to a clear basis or source.
- Use the relevant section contract as the default structure, but adapt it to the user’s request and the available evidence.
- Prefer evidence first, then implication.
- Use balanced diligence language; label uncertainty when support is incomplete.
- Keep Markdown output easy to review and iterate.
- Return only the requested artifact. Do not expand a section request into a full report.

## Output Contract

For `section` and `exhibit` requests, return:

1. The requested prose
2. A short `What changed / assumptions` note

For `full_report` requests, return:

1. The outline only, unless the user explicitly asks to continue
2. If drafting continues, the requested drafted sections plus a short `What changed / assumptions` note

## Key References

Start with [references/INDEX.md](references/INDEX.md).
