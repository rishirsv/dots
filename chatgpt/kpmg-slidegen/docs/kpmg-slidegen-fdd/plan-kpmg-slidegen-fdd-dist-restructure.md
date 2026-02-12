# Plan: Restructure `dist/kpmg-slidegen-fdd` into an Upload-Ready, Model-First Distribution

## Why this restructure
The current dist is implementation-heavy and review-hostile (many scripts, runtime snapshot, tests, and calibration assets). The new design should be:
- upload-ready for ChatGPT Custom GPT,
- model-first (guidance-driven, not hard-gated script logic),
- deck-level only (always generate one PPTX per request),
- minimal and auditable.

## Target outcomes (success criteria)
1. `dist/kpmg-slidegen-fdd` has a minimal structure that can be uploaded directly to ChatGPT.
2. Slide writing/mapping depends primarily on clear guidance in markdown (model intelligence), not deterministic verbosity gates.
3. Generation contract is deck-first: input is a full deck brief, output is one complete deck (`deck.pptx`).
4. Legacy/testing/runtime clutter is removed from dist.
5. The remaining files are easy to review end-to-end.

## Locked constraints from user
- Keep only `exports/` plus at most one additional folder in dist.
- Remove prior tests and non-essential implementation baggage from dist.
- Avoid hard verbosity gates; keep verbosity as guidance, not rigid enforcement.
- Do not design for one-slide-at-a-time generation.

## Proposed final dist structure
```
dist/kpmg-slidegen-fdd/
├── SKILL.md
├── openai.yaml
├── DECK_CONTRACT.md
├── WORKFLOW.md
├── exports/
│   ├── deck.pptx
│   ├── deck-input.json
│   ├── deck-plan.json
│   └── generation-notes.md
└── knowledge/
    ├── layout-catalog.md
    ├── writing-standards.md
    ├── section-playbooks.md
    ├── style-tone-syntax.md
    ├── slide-patterns-agnostic.md
    └── project-north-benchmark.md
```

Notes:
- `exports/` is runtime output only.
- `knowledge/` is the single support folder containing the model’s guidance corpus.
- No `runtime/`, `schemas/`, `scripts/`, `tests/`, `samples/`, or deep policy jsons in dist.

## Design model (model-first, not script-first)
- The Custom GPT decides layout and writes content using `knowledge/*.md`.
- Verbosity is treated as a style target in prose guidance.
- Hard fail gates are replaced by a lightweight self-check rubric embedded in `WORKFLOW.md`.
- Optional tooling can exist outside dist in core repo; dist remains prompt/knowledge-centric and uploadable.

## Deck-level generation contract
- Input: a single deck brief object with all slides and source evidence.
- Internal workflow:
  1. Normalize brief into `deck-plan` (all slides at once).
  2. Map each slide to layout + slots under one deck narrative.
  3. Draft all slide copy in one pass with consistency of tone and terminology.
  4. Generate one final PPTX.
- Output: one `deck.pptx` per run (never per-slide PPTs).

## Phase plan

- [x] 1.0 Freeze and define minimal dist interface
  - [x] 1.1 Finalize allowed dist file/folder list (exact keep/delete map).
  - [x] 1.2 Define deck-first input/output contract in `DECK_CONTRACT.md`.
  - [x] 1.3 Validation: user confirms final shape before destructive cleanup.

What this phase achieves (non-technical):
We agree exactly what the package is and is not, so we can simplify aggressively without losing needed capabilities.

- [x] 2.0 Build model guidance corpus (`knowledge/`)
  - [x] 2.1 Convert current JSON/script rules into concise markdown guidance.
  - [x] 2.2 Separate universal FDD writing/layout rules from Project North benchmark examples.
  - [x] 2.3 Add agnostic slide-pattern playbooks (business overview, QoE, payroll appendix, risks, bridges, etc.).
  - [x] 2.4 Validation: spot-check 3-5 representative prompts produce coherent deck plans without script gates.

What this phase achieves (non-technical):
The GPT learns how to think and write like the team without being overfitted to a single report.

- [x] 3.0 Rewrite `SKILL.md` and workflow to be deck-first
  - [x] 3.1 Replace script-heavy operational instructions with model workflow steps.
  - [x] 3.2 Add explicit “always produce one deck” instruction.
  - [x] 3.3 Add self-review checklist for tone, density, factual fidelity, and layout fit.
  - [x] 3.4 Validation: `SKILL.md` is concise, reviewable, and runnable by Custom GPT as uploaded context.

What this phase achieves (non-technical):
The skill becomes easy to use and behaves consistently, with clear guidance instead of technical ceremony.

- [x] 4.0 Prune dist to essentials only
  - [x] 4.1 Remove from dist: `runtime/`, `scripts/`, `schemas/`, `references/`, `tests/`, `samples/` and stale docs not needed for upload.
  - [x] 4.2 Remove all legacy test artifacts from dist per request.
  - [x] 4.3 Create clean `exports/` skeleton and placeholder output docs.
  - [x] 4.4 Validation: dist contains only approved files and ≤2 folders (`exports/`, `knowledge/`).

What this phase achieves (non-technical):
The package becomes small enough to review and practical to upload directly into ChatGPT.

- [x] 5.0 Calibrate for agnostic quality (not Project North copycat)
  - [x] 5.1 Add synthetic multi-industry briefs in `knowledge/slide-patterns-agnostic.md`.
  - [x] 5.2 Keep Project North as benchmark rubric only (`project-north-benchmark.md`), not generation dependency.
  - [x] 5.3 Document anti-overfitting principles (what must generalize vs what is exemplar only).
  - [x] 5.4 Validation: deck plans and content quality hold on non-Project-North scenarios.

What this phase achieves (non-technical):
The GPT produces strong client-ready slides even when there is no close example report.

- [x] 6.0 Final acceptance + handoff
  - [x] 6.1 Verify all links are relative and upload-safe.
  - [x] 6.2 Confirm deck-only generation instruction appears in `SKILL.md`, `WORKFLOW.md`, and `DECK_CONTRACT.md`.
  - [x] 6.3 Update progress checkpoint and handoff notes.
  - [x] 6.4 Validation: dry-run checklist passes and folder is ready for direct upload.

What this phase achieves (non-technical):
You get a clean, durable distribution that is easy to trust, review, and evolve.

## Keep/Delete map (high-level)
Keep (or rewrite):
- `SKILL.md`
- `openai.yaml`
- new `DECK_CONTRACT.md`
- new `WORKFLOW.md`
- `knowledge/*` (new curated markdown only)
- `exports/*` (output skeleton)

Delete from dist:
- `runtime/**`
- `scripts/**`
- `schemas/**`
- `references/**` (migrate useful content into `knowledge/*.md`)
- `tests/**`
- `samples/**`
- `.DS_Store`
- obsolete AGENTS/README content in dist that duplicates core repo docs

## Risks and mitigations
- Risk: removing scripts lowers deterministic enforcement.
  - Mitigation: strengthen self-review rubric and explicit workflow prompts.
- Risk: agnostic guidance becomes too generic.
  - Mitigation: add concrete section playbooks with specific sentence patterns and evidence expectations.
- Risk: losing useful policy details during migration.
  - Mitigation: migrate all high-value policy content into human-readable markdown before deletion.

## Execution order recommendation
1. Approve target structure + keep/delete map.
2. Rewrite knowledge and skill docs first.
3. Then perform destructive cleanup in one controlled pass.
4. Run final dry-run review and export sample deck.

## Immediate next 3 actions (if approved)
1. Draft `DECK_CONTRACT.md` and `WORKFLOW.md` with deck-first semantics.
2. Create `knowledge/` markdown corpus by consolidating current rules/guides.
3. Execute dist cleanup to final minimal shape and update `progress.md`.
