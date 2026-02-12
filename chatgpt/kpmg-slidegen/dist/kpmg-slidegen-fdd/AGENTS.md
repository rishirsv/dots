# AGENTS.md - `kpmg-slidegen-fdd` Distribution

## 1) Purpose and Scope
This folder is the upload-ready distribution for the KPMG FDD slide-generation GPT.

Primary goal:
- Generate one coherent, client-ready FDD deck per request (never one-slide-at-a-time output).
- Keep behavior model-driven (layout selection + writing quality from guidance), not script-gated.
- Stay report-agnostic (no dependency on any named historical report in this dist package).

This document is the maintainer guide for future contributors.

---

## 2) How the System Works (High Level)
The runtime has two layers:
1. Intelligence layer (model-driven)
- Read input and normalize to a single deck brief.
- Plan the full narrative arc and map each slide to an approved layout slug.
- Draft and rewrite content using writing standards and section playbooks.
- Perform manual quality review and rewrite weak slides.

2. Rendering layer (deterministic)
- Convert the planned deck spec into one PPTX via the shared slide renderer.
- Use template geometry and builder functions for layout fidelity.

Dist philosophy:
- Guidance-heavy in markdown for writing quality and decision-making.
- Thin contract and workflow docs for repeatability.
- Minimal file count for upload/review simplicity.

---

## 3) Distribution File Map (Source of Truth)
Top-level files:
- `SKILL.md`: Entry instructions and non-negotiables for the GPT.
- `WORKFLOW.md`: End-to-end execution flow.
- `DECK_CONTRACT.md`: Input/output deck schema contract.
- `openai.yaml`: Skill metadata (display + default prompt).
- `AGENTS.md`: This maintainer playbook.

Knowledge base:
- `knowledge/layout-catalog.md`: Approved layout slugs, intent mapping, slot expectations.
- `knowledge/writing-standards.md`: Style/tone/syntax + density + rewrite rubric.
- `knowledge/section-playbooks.md`: Heavily templated writing guidance by slide type.

Outputs (working artifacts):
- `exports/deck-input.json`
- `exports/deck-plan.json`
- `exports/generation-notes.md`
- `exports/deck.pptx`
- Optional review artifacts in `exports/` (PDF/PNGs/samples).

---

## 4) Boundary Between Dist and Runtime Code
Dist files define GPT behavior and writing guidance.
Renderer code lives outside this folder and is shared runtime infrastructure:
- `generator/`
- `templates/kpmg-diligence/`
- `qa/`

Rule of thumb:
- If you are changing how the model thinks/writes/maps layouts -> edit dist docs.
- If you are changing how shapes/tables/charts physically render -> edit renderer/template code, then update dist docs to match.

---

## 5) Non-Negotiable Design Rules
1. Deck-first workflow only.
- Always plan the full deck before drafting slide prose.

2. One deck artifact.
- Final output is always one PPTX deck file.

3. Fact and token fidelity.
- Preserve provided numbers, entities, and placeholder tokens exactly unless user requests otherwise.

4. No deterministic writing gates in dist.
- Use rubric + rewrite guidance; do not reintroduce hard verbosity scripts as the quality engine.

5. No benchmark anchoring in dist.
- Keep guidance generic enough to generalize across deals and sectors.

---

## 6) Update Playbook: Layout Structures
Use this when adding/changing layout slugs, slot contracts, or intent mappings.

### A. Mapping-only change (no renderer geometry change)
Edit:
1. `knowledge/layout-catalog.md`
2. `DECK_CONTRACT.md` (if contract examples/fields change)
3. `knowledge/section-playbooks.md` (if new slide intent is introduced)
4. `SKILL.md` or `WORKFLOW.md` if flow expectations change

Checklist:
- Layout slug name is consistent everywhere.
- Slot expectations are explicit (left/right/top/bottom and required content role).
- Intent-to-layout guidance includes when to use alternates.

### B. Physical layout/rendering change (geometry or new layout type)
Edit runtime first:
1. Add/update builder in `generator/builders/`
2. Wire builder in `templates/kpmg-diligence/template.js`:
- `LAYOUTS` entry
- builder function
- `BUILDERS` map
3. If template geometry changed materially, regenerate template files:
- `python3 cli.py extract --template templates/kpmg-diligence --pptx "templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx"`

Then update dist:
1. `knowledge/layout-catalog.md`
2. `DECK_CONTRACT.md` examples
3. `knowledge/section-playbooks.md` where that layout is recommended

---

## 7) Update Playbook: Table Rendering
Use this when changing table density, styling, widths, alignment, or pagination behavior.

Primary runtime files:
- `generator/builders/table.js` (core table rendering behavior)
- `generator/runtime/paginate.js` (row chunking and continuation strategy)
- `templates/kpmg-diligence/template.js` (layout geometry constraints)

Guidance for safe edits:
1. Preserve readability at FDD densities (compact but legible).
2. Validate both numeric-heavy and narrative-heavy tables.
3. Check narrow-table and full-width scenarios.
4. Confirm continuation slides remain coherent for long tables.
5. Keep table commentary expectations aligned in `knowledge/section-playbooks.md`.

After runtime table changes, always refresh:
- `knowledge/layout-catalog.md` slot expectations (if behavior changed)
- `knowledge/writing-standards.md` density targets (if practical capacity changed)

---

## 8) Update Playbook: Writing Guidelines
Use this when improving tone, structure, syntax, or section-specific drafting templates.

Primary dist files:
- `knowledge/writing-standards.md` (global standard + rewrite protocol + rubric)
- `knowledge/section-playbooks.md` (per-slide-type templates)

Quality requirements:
1. Guidance must be specific enough to rewrite large messy input into decision-useful slide prose.
2. Templates must be intent-specific (QoE, business overview, NWC, reporting environment, appendix commentary, etc.).
3. Keep language evidence-led and implication-driven.
4. Avoid generic advisory filler that could fit any deal.

When adding a new slide family:
1. Add section playbook (objective, required inputs, title/strapline templates, bullet templates, rewrite checklist).
2. Add/confirm layout mapping in `knowledge/layout-catalog.md`.
3. Ensure rubric expectations in `knowledge/writing-standards.md` still fit.

---

## 9) Incremental Change Workflow (Recommended)
For each incremental update:
1. Define change scope in one sentence.
2. Update minimum required files only.
3. Generate a representative sample deck.
4. Perform manual slide review (text + rendered images).
5. Record what changed and why in `exports/generation-notes.md`.

Manual review focus:
- Layout suitability for slide intent
- Writing density for chosen layout
- Evidence specificity and period anchoring
- Implication quality (transaction relevance)
- Placeholder fidelity

---

## 10) Validation and Run Commands
From repo root `chatgpt/kpmg-slidegen`:

Validate deck spec:
```bash
node generator/validate.js --in dist/kpmg-slidegen-fdd/exports/deck-spec.json
```

Generate deck:
```bash
node generator/index.js --in dist/kpmg-slidegen-fdd/exports/deck-spec.json --out dist/kpmg-slidegen-fdd/exports/deck.pptx
```

Strict mode (optional runtime diagnostics):
```bash
node generator/index.js --in dist/kpmg-slidegen-fdd/exports/deck-spec.json --out dist/kpmg-slidegen-fdd/exports/deck.pptx --strict
```

Render PPTX to PNGs via PDF for qualitative review:
```bash
python3 -c "from pathlib import Path; from qa.render import render_pptx_to_pngs_via_pdf; render_pptx_to_pngs_via_pdf(Path('dist/kpmg-slidegen-fdd/exports/deck.pptx'), Path('dist/kpmg-slidegen-fdd/exports/rendered'), dpi=180, prefix='generated-slide')"
```

---

## 11) What Not to Add to This Dist
Do not bloat this package with full runtime/source snapshots.

Avoid adding:
- Large calibration corpora and one-off benchmark anchors
- Redundant guidance split across too many files
- Script-heavy writing gates that replace model judgment
- Unused historical experiment artifacts

Keep this dist uploadable, reviewable, and maintainable.

---

## 12) Handoff Notes for Future Contributors
Before making changes:
1. Read in this order:
- `SKILL.md`
- `WORKFLOW.md`
- `DECK_CONTRACT.md`
- `knowledge/layout-catalog.md`
- `knowledge/writing-standards.md`
- `knowledge/section-playbooks.md`

Before finishing:
1. Confirm rules in Section 5 still hold.
2. Confirm examples and slugs are consistent across all docs.
3. Regenerate a sample deck and manually review slides.
4. Update `exports/generation-notes.md` with what changed and why.

If you changed runtime rendering behavior, include explicit note in `generation-notes.md` stating:
- file(s) changed
- expected visual impact
- any tradeoffs introduced

