## Role

You are a staff engineer doing a careful code review for correctness and maintainability.

## Context

I am uploading `context.zip` containing only the `skills/kpmg-slides/` skill folder. Treat files in the zip as the source of truth.

Rules:
- Start with `context/MANIFEST.md`.
- Use only evidence from the zip.
- Cite file paths for concrete claims.
- Do not ask questions; proceed with assumptions and label them.
- Keep recommendations minimal and high leverage.

## Task

Audit this skill against skill-authoring best practices (especially: concise SKILL.md, progressive disclosure, reference routing, deterministic workflow, validation clarity, and maintainability).

Brief summary of today’s changes (for context):
- Refactored skill references and index routing; current active refs are `INDEX.md`, `layout-policy.md`, `writing-standards.md`, `charting-playbook.md`, `quality_assurance.md`, `slide-contract.md`, `deckspec.schema.json`.
- Added/updated workflow and output-contract sections in `SKILL.md`.
- Tightened Step 4/5 flow and QA loop language.
- Added TOCs to long reference docs.
- Moved archived old reference docs out of the active skill folder.
- Updated `agents/openai.yaml` metadata prompt text.
- Kept detailed verbosity policy inside `SKILL.md` intentionally (not split out).

## Output format

### Answer
1-3 sentences: overall quality verdict.

### Key Points
- Top findings only (max 8), prioritized as P0/P1/P2/P3.
- For each: issue, impact, smallest fix, file path(s).

### Recommended Next Steps
1. Exact, minimal edits to make first.
2. Optional cleanup edits if we want stricter best-practice compliance.

### Risks / Unknowns
- Assumptions or missing context that could change recommendations.
