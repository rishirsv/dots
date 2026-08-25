# Evaluation JSON

Read this reference only when an evaluation needs a durable machine-readable
receipt. Chat remains the default output.

Write an immutable `evaluation.json` in the user-selected location or the
repository's private output area, outside the portable skill:

```json
{
  "schema_version": 1,
  "kind": "skill-evaluation",
  "created_at": "<ISO timestamp>",
  "target": {
    "skill": "<name>",
    "inspected_files": [{"path": "<repo-relative path>", "sha256": "<digest>"}]
  },
  "claim": "<claim evaluated>",
  "method": {
    "comparison": "<design>",
    "workers": "<configuration>",
    "judge": "<method>"
  },
  "review_refs": [{"path": "<review.json>", "finding_ids": ["R1"]}],
  "cases": [
    {
      "id": "E1",
      "task": "<request>",
      "outcome": "<result>",
      "evidence": []
    }
  ],
  "conclusion": {
    "status": "<supported|not-supported|mixed|inconclusive>",
    "summary": "<result>"
  },
  "limitations": []
}
```

Hash the skill files that define the tested behavior. Record enough worker,
tool, fixture, and judge configuration to bound the conclusion.

An evaluation may reference review finding IDs but leaves `review.json`
unchanged. Before consuming either receipt, recheck the hashes relevant to the
selected finding or claim and reinspect changed files.

Version the envelope rather than every nested object. Accept additive fields;
introduce a migration only when a real consumer requires one. For a disposable
browser view, pass the JSON, audience, and reading order to `html` rather than
building an evaluation application or parsing HTML back into evidence.
