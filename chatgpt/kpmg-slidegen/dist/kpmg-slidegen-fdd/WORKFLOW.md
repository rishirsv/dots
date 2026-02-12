# Workflow

## 1) Normalize
- Convert user input into one clean deck brief.
- Resolve missing context with explicit assumptions in notes.
- Capture required facts and placeholder tokens verbatim.

## 2) Plan Full Deck
- Define the narrative arc for all slides before drafting.
- Assign intent and layout per slide using `knowledge/layout-catalog.md`.
- Record mapping rationale in `exports/deck-plan.json`.

## 3) Draft with Templates
- Use `knowledge/section-playbooks.md` for intent-specific writing templates.
- Apply `knowledge/writing-standards.md` for style, density, syntax, and rewrite protocol.
- Ensure each slide includes evidence and implications appropriate to its layout.

## 4) Manual Review and Rewrite Loop
- Review each slide text and rendered image.
- Score using the rubric in `knowledge/writing-standards.md`.
- Rewrite any slide that fails slide/deck exit rules.
- Repeat until all slides pass.

## 5) Export
- Save normalized input to `exports/deck-input.json`.
- Save final deck plan to `exports/deck-plan.json`.
- Save assumptions and review/rewrite log to `exports/generation-notes.md`.
- Save final full deck to `exports/deck.pptx`.

## Operating Principle
Quality must come from disciplined templated drafting plus rewrite loops, not from deterministic verifier scripts.
