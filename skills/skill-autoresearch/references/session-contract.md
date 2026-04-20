# Session Contract

Create the session workspace in the resolved target skill root, not in the skill bundle and not at the outer workspace root by default.

If the target skill lives at `fixtures/weak-summary-skill`, the session workspace lives at `fixtures/weak-summary-skill/.autoresearch/`.

## Required layout

```text
.autoresearch/
├── session.md
├── results.jsonl
├── config.json
├── evals/
│   ├── matrix.json
│   ├── scenarios/
│   │   ├── calibration/
│   │   └── holdout/
│   └── judges/
├── reports/
│   ├── baseline.md
│   ├── latest.md
│   └── final.md
├── working/
│   ├── SKILL.original.md
│   ├── SKILL.current.md
│   └── SKILL.best.md
└── ideas.md
```

## File roles

- `session.md`: human-readable memory anchor, invariants, active theory, and current status.
- `results.jsonl`: append-only experiment log. Treat it as the canonical history.
- `config.json`: loop settings, stop conditions, and scope metadata.
- `evals/matrix.json`: failure-mode matrix with scenario routing and check definitions.
- `evals/scenarios/calibration/`: prompts used during iteration.
- `evals/scenarios/holdout/`: prompts reserved for baseline and checkpoint confirmation.
- `evals/judges/`: judge prompts for the few checks code cannot decide.
- `reports/`: derived summaries, never canonical state.
- `working/`: original, current, and best `SKILL.md` snapshots.
- `ideas.md`: deferred promising ideas that are not worth trying yet.

## Logging expectations

Each `results.jsonl` entry should capture:

- iteration id
- hypothesis
- files changed
- calibration outcome
- holdout outcome when run
- keep or discard decision
- short lesson learned

## Change discipline

- Keep the matrix stable after the baseline unless the user explicitly approves a contract change.
- Do not delete losing runs from `results.jsonl`.
- Update `session.md` when the working theory changes, not just when a run succeeds.
