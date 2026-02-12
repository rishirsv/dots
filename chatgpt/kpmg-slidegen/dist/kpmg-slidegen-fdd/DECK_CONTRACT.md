# Deck Contract

This contract defines a deck-level interface for the skill.

## Input (single deck brief)
Use one JSON object for the entire deck:

```json
{
  "engagement": {
    "name": "Project Example",
    "client": "Client Name",
    "report_date": "2026-02-12"
  },
  "global_constraints": {
    "fact_lock": true,
    "must_preserve_tokens": ["[CHART PLACEHOLDER]", "[TABLE IMAGE PLACEHOLDER]"],
    "verbosity": "standard"
  },
  "slides": [
    {
      "slide_id": "s01",
      "intent": "qoe_adjustment_highlights",
      "objective": "Bridge reported EBITDA to normalized EBITDA",
      "evidence": [
        "TTM reported EBITDA USD 24.2m",
        "ERP transition costs USD 1.4m",
        "Normalized EBITDA USD 25.6m"
      ],
      "preferred_visual": "chart"
    }
  ]
}
```

## Planning Output (`exports/deck-plan.json`)
Create one plan for the full deck:

```json
{
  "deck_title": "Project Example - FDD Report",
  "narrative_arc": ["Context", "Performance", "Adjustments", "Risks", "Appendix support"],
  "slides": [
    {
      "slide_id": "s01",
      "intent": "qoe_adjustment_highlights",
      "layout_slug": "layout.fdd_chart_left_content_right",
      "slot_plan": {
        "left": "bridge visual",
        "right": "adjustment rationale and implications"
      },
      "rationale": "QoE bridge intent requires explicit reported-to-normalized mapping plus implication commentary."
    }
  ]
}
```

## Final Output
- Exactly one deck: `exports/deck.pptx`
- Supporting files: `exports/deck-input.json`, `exports/deck-plan.json`, `exports/generation-notes.md`

## Contract Rules
1. Deck-first only: all slide mappings are planned before writing content.
2. Fact fidelity: numbers and named entities must remain consistent with input evidence.
3. Placeholder fidelity: required placeholder tokens must be preserved exactly.
4. Cohesion: title style, terminology, and narrative flow must be consistent across the deck.
5. Manual review loop is required before final output.
6. Sparse analytical slides are not acceptable unless user explicitly requests concise output.
