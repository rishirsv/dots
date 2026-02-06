# Talkbook Authoring Payload Contract

Use this contract to draft dense sections with predictable evidence depth.

## JSON Shape

```json
{
  "headline_claim": "Single message-led statement",
  "claims": [
    "Claim 1 with scope and metric",
    "Claim 2 with causal logic"
  ],
  "evidence_objects": [
    {
      "type": "table",
      "rows": [["Metric", "FY22", "FY23"], ["Revenue", "512", "588"]]
    },
    {
      "type": "chart",
      "points": [{"label": "FY22", "value": 23.0}, {"label": "TTM", "value": 25.8}]
    },
    {
      "type": "bullet_evidence",
      "label": "Benchmark panel",
      "detail": "Time-to-value is 2.2x peer median"
    }
  ],
  "implications": [
    "Implication 1 for decision or risk",
    "Implication 2 for execution"
  ],
  "decision_ask": "Decision required from leadership",
  "source_anchors": [
    "Internal management accounts",
    "https://example.com/source"
  ]
}
```

## Required Fields

- `headline_claim`: optional string, recommended for strapline logic.
- `claims[]`: required for depth scoring.
- `evidence_objects[]`: required for evidence depth scoring.
- `implications[]`: required for interpretation depth scoring.
- `decision_ask`: optional but strongly recommended.
- `source_anchors[]`: required for traceability expectations.

## Evidence Object Types

- `table`: use `rows` as 2D array of cells.
- `chart`: use `points` (`label`, `value`) or `series` payloads.
- `matrix`: use structured rows for dimension-assessment mapping.
- `appendix_ref`: cite evidence references that live in appendix slides.
- `bullet_evidence`: concise fact statements when table/chart is not needed.

## Depth Profiles

- `minimal`: lightweight analytical scaffold.
- `concise`: compact but evidence-backed.
- `detailed`: default for dense consulting writing.
- `extensive`: maximum information density for deep-read audiences.

## Compiler Behavior

- Payload content is preferred over free-form markdown parsing.
- Legacy markdown is still supported when payload is absent.
- Compile report includes profile minima checks and warnings.

## Authoring Guidance

- Keep claims specific and scoped by period.
- Tie each implication to at least one evidence object.
- Use source anchors for every non-trivial numeric claim.
- Avoid narrative-only payloads with no evidence objects.
