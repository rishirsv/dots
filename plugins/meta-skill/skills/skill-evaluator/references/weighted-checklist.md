# Weighted-Checklist Grading

MetaSkill uses weighted-checklist grading by default. Do not extend the
authored shape:

```json
{
  "context": "What the scenario evaluates.",
  "type": "weighted_checklist",
  "checklist": [
    {
      "name": "preserves-published-record",
      "description": "Saving a draft leaves the published record unchanged.",
      "max_score": 3,
      "category": "INTENT"
    }
  ]
}
```

Allowed categories are `INTENT`, `DESIGN`, `MUST_NOT`, `MINIMALITY`, `REUSE`,
`INTEGRATION`, and `EDGE_CASE`.

The grader awards each criterion any value from zero through `max_score`, with
partial credit allowed. The scenario percentage is:

```text
sum(awarded points) / sum(max_score) * 100
```

Every award needs concrete evidence from the response, artifact, or observable
result. Missing evidence earns no points. Do not create implied requirements,
required gates, pass thresholds, binary labels, or calibration fields. Use a
custom eval when a separate exact verdict is necessary.
