---
id: kpmg-pptx
title: "KPMG-PPTX: General-Purpose Slide Creator (Template-Driven)"
doc: spec
---

# Feature: KPMG-PPTX — General-purpose slide creator (template-driven)

## TL;DR
- **Problem:** Creating truly KPMG-branded PowerPoint slides from AI output is hard because “from-scratch” slide generation drifts from the official template.
- **Solution:**
  - Use a **template-first “duplicate + replace”** workflow that preserves brand fidelity.
  - Have the GPT build slide content as **structured replacements** (paragraphs + bullets + formatting), then apply them deterministically.
  - Detect overflow and **add continuation slides** (instead of shrinking fonts or shipping clipped content).

## What We're Building

A general-purpose PPTX generator that produces a new, client-ready PowerPoint deck by:

1) Starting from `chatgpt/kpmg-pptx/templates/Generic_Template.pptx`.
2) Duplicating template slides for the selected layouts (cover, one-column text, two-column text, etc.).
3) Replacing placeholder text with structured content (paragraphs and bullets) while preserving the template’s formatting.
4) Validating layout quality (especially text overflow). If content doesn’t fit, the GPT updates the plan by adding continuation slides and re-runs generation until the deck passes validation.

The goal is to mimic the “Skill” reliability pattern seen in Claude/Codex document skills: deterministic scripts + strict validation loops, rather than ad-hoc `python-pptx` slide building.

## User Stories

### User Story 1 — Generate a KPMG-branded deck from an outline
- As a KPMG practitioner, I want to provide an outline and content for a deck so that I receive a PowerPoint that matches the KPMG template styling.

### User Story 2 — Use mixed layouts (text + chart placeholders)
- As a KPMG practitioner, I want to create slides that include chart/image placeholders so that the slide structure matches the standard template, even if charts/images are filled later.

### User Story 3 — Avoid clipped or ugly text
- As a KPMG practitioner, I want the generator to detect text overflow and split content across additional slides so that no slide ships with clipped content.

## Requirements

### Template and layout scope
- [ ] Use `chatgpt/kpmg-pptx/templates/Generic_Template.pptx` as the v1 template.
- [ ] Support all v1 “text layouts” from the template:
  - Include slides that have chart/image placeholders **but only fill text** (chart/image placeholders remain empty).
  - Exclude non-generative/referential slides (e.g., template disclaimer / palette reference) from being selected for generation.

### Slide creation approach (brand fidelity)
- [ ] **Must not** generate slides “from scratch” using `add_slide()` + custom geometry for KPMG deliverables.
- [ ] Must duplicate template slides and replace text in-place (“duplicate + replace”).

### Input contract (document-skills style)
- [ ] The GPT produces:
  - `template_mapping` (ordered list of template slide indices to duplicate; duplicates allowed).
  - `replacement_text.json` in a **document-skills-style** structure: `slide-N` → `shape-N` → `paragraphs[]` with bullet/alignment/font/spacing attributes.
- [ ] Replacement logic must preserve formatting by carrying forward paragraph/run properties from the template inventory as the default baseline.

### Validation and quality gates
- [ ] Generate a text inventory for the working deck and validate replacements against it (fail fast on invalid slide/shape keys).
- [ ] Detect text overflow and treat overflow **> 0.02 inches** as a failure condition.
- [ ] If overflow is detected, the GPT must respond by adding continuation slide(s) and moving content at paragraph/bullet boundaries (no mid-bullet splitting).
- [ ] Do not auto-shrink fonts as a default behavior in v1.

### Continuation slide behavior (v1)
- [ ] Continuation slides repeat the same layout and repeat the slide title.
- [ ] For multi-column layouts, continuation behavior should prioritize “what looks best” while staying simple and deterministic:
  - Default: if only one column continues, prefer switching to a one-column continuation layout; otherwise keep the same multi-column layout.

### Documentation (“nailed layouts” guide)
- [ ] Create `chatgpt/kpmg-pptx/docs/kpmg-pptx/layout-guide.md` describing:
  - Supported layouts and their template slide indices
  - Which semantic fields map to which placeholders
  - Content limits and examples that reliably fit
  - How to handle overflow (rules for splitting into continuation slides)

## How It Works

The system is template-driven and iterative:

1) The GPT selects the appropriate layout slides from `Generic_Template.pptx` and builds a `template_mapping` for the desired deck order.
2) The generator duplicates the mapped template slides into a working deck.
3) The generator extracts a text inventory from the working deck so the GPT can target stable `slide-N/shape-N` addresses and preserve default formatting.
4) The generator applies `replacement_text.json` to clear and rewrite text content while keeping template styling intact.
5) The generator validates the resulting deck. If any text overflows beyond the allowed threshold, the GPT adjusts by adding continuation slides and re-running the same pipeline until validation passes.

This keeps “layout decisions” and “content decisions” in the GPT, while keeping “slide fidelity” and “replacements” deterministic and testable in code.

## Acceptance Criteria

- Given an outline and content, when the user requests a deck, then the output PPTX uses the official template and does not contain “from-scratch” slide geometry.
- Given replacements that reference a non-existent `slide-N` or `shape-N`, when generation runs, then the process fails fast with a clear error listing valid options.
- Given a slide where body text would overflow by more than 0.02", when generation runs, then the generator flags overflow and the GPT produces a revised plan with continuation slide(s).
- Given chart/image placeholder layouts in the template, when the deck is generated, then the slide structure is preserved and only text placeholders are filled.
- Given a multi-slide deck request, when generation completes, then the deck can be opened in PowerPoint without errors and looks consistent with the template styling.

## Context

- Related code:
  - `chatgpt/kpmg-pptx/tools/analyze_template.py`
  - `tools/document-skills/pptx/scripts/inventory.py`
  - `tools/document-skills/pptx/scripts/replace.py`
  - `tools/document-skills/pptx/scripts/rearrange.py`
  - `chatgpt/kpmg-pptx/docs/SLIDE_GENERATOR_DESIGN.md`
  - `chatgpt/kpmg-pptx/docs/LEARNINGS.md`
- Constraints:
  - Target ChatGPT Code Interpreter constraints (sandboxed environment; imports can be fragile).
  - Prefer deterministic workflows; avoid “auto styling” behaviors that drift from template.
- References:
  - Claude/Codex-style skill conventions: `tools/skill-writer/SKILL.md`
  - PPTX template editing workflow: `tools/document-skills/pptx/SKILL.md`

