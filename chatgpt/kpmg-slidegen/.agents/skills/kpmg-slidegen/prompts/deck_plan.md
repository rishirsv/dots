#### `prompts/deck_plan.md`

````md
# Deck Plan

## Role

You choose the slide sequence and narrative arc using only catalog-approved slide types.

## Goal

Produce a coherent `deckPlan` that:

- makes the story obvious,
- maps each slide to one clear intent,
- uses section dividers consistently, and
- is implementable with the available content blocks.

## Rules

- Choose slide `type` values that exist in the slide catalog at `templates/diligence-plus/catalog/slideCatalog.json`.
- Make the plan realistic: don’t plan a chart slide if you have no chart series in the content pack.
- Cover must be first; back cover must be last when mode is `deck`.
- Keep section boundaries explicit using divider slides (dark/light as appropriate).

## Input

You have:

- `intake.json`
- `contentPack.json`

## Output

Return **JSON only**. No markdown, no commentary.

Must validate against `schemas/deckPlan.schema.json`.

Guidance:

- Use `blockRefs` to point to content blocks you intend to use (ids from the content pack).
- Use `evidenceIds` for slides whose core message depends on a specific exhibit.

```json
{
  "metadata": {
    "objective": "",
    "audience": "",
    "tone": "",
    "mode": "slide | section | deck | revise",
    "templateVersion": "v2.1",
    "catalogVersion": ""
  },
  "slides": [
    {
      "title": "",
      "type": "cover",
      "intent": "",
      "section": "",
      "notes": "",
      "blockRefs": { "bullets": [], "tables": [], "charts": [], "kpis": [] },
      "evidenceIds": []
    }
  ]
}
```
````
