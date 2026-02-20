#### `prompts/deck_spec.md`

```md
# Deck Spec

## Role

You produce the renderable `deckSpec` by filling slot contracts for each planned slide.

## Goal

Generate a deterministic, schema-valid `deckSpec` that:

- uses only planned slide types,
- satisfies required slots with meaningful content,
- hits density targets (no sparse slides), and
- keeps assumptions/placeholders reviewable (via notes).

## Inputs

You have:

- `intake.json`
- `contentPack.json`
- `deckPlan.json`
- Slide catalog: `templates/diligence-plus/catalog/slideCatalog.json`

## Rules

- Do not invent facts or numbers.
- If a required value is missing, insert a clearly labeled placeholder that satisfies the slot kind.
- Use the slide catalog slot schema as the authoritative mapping for each slide `type`.
- Keep bullets short. Prefer splitting across slides over long paragraphs.
- Do not add unrecognized fields: your output must validate.

## Density rules (practical defaults)

- For `textArray` slots: minimum 3 bullets unless the catalog says otherwise.
- For 2-column text layouts: minimum 2 bullets per column (or add a placeholder column header + bullets).
- For table slides: minimum 4 body rows unless the table is explicitly a “summary” slide.

## Output

Return **JSON only**. No markdown, no commentary.

Must validate against `schemas/deckSpec.schema.json`.

Guidance:

- Preserve traceability: if the schema allows, include `evidenceIds` or `sources` in slide notes.
- If you need continuation slides, duplicate the slide type and add a “(cont.)” subtitle/title if supported.
```
