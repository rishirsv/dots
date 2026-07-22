# Evaluation Scenarios

Use this format for every ordinary MetaSkill evaluation:

```text
<skill-name>/evals/
  <scenario-id>/
    task.md
    criteria.json
    scenario.json
    fixtures/                 # optional
```

`task.md` is the only scenario definition shown to the worker. Keep it natural
and self-contained. `criteria.json` is hidden grading material.
`scenario.json` identifies the fixture and optional MetaSkill selection
metadata. For a code fixture, use these commit-oriented fields:

```json
{
  "type": "coding",
  "fixture": {
    "type": "commit",
    "repoUrl": "https://github.com/org/repo.git",
    "ref": "24829180ba1fafb86b",
    "exclude": ["*.md", "tile.json", ".evaluation/"]
  }
}
```

MetaSkill may also read `priority`, `coverage`, `split`, `repetitions`,
`outcome`, and declared fixture paths from `scenario.json`. These affect
selection and execution, not weighted-checklist grading.

Run `metaskill eval run --suite <skill>/evals --check --json` before execution.
The check must reject missing files, empty tasks, malformed fixture metadata,
unknown checklist fields, duplicate criteria, and invalid categories.
