# Run Review

Use the shared run-review site when you need a visual audit trail for recent skill-improvement runs.

## What It Shows

- run list across both autoresearch skills
- calibration and holdout scenario outcome
- target `SKILL.md` diff and changed files
- copied `.autoresearch` artifacts such as `session.md`, `matrix.json`, `results.jsonl`, `baseline.md`, and `final.md`
- event timeline and raw logs

## Build The Site

From the repo root:

```bash
python skills/skill-autoresearch/scripts/build_run_review.py --combined
```

Or point it at explicit benchmark outputs from another workspace:

```bash
python skills/skill-autoresearch/scripts/build_run_review.py \
  --benchmark-run /path/to/benchmark-run.json \
  --observed-usage /path/to/observed-usage.jsonl \
  --out /path/to/review-site
```

This rebuilds the portable site at:

```text
tests/plugin-eval/site/index.html
```

The generator and shell ship inside this skill bundle. The site uses copied local artifacts under `tests/plugin-eval/site/artifacts/`. It should not depend on preserved `/tmp` workspaces at runtime.

## When To Refresh

- after a new `plugin-eval` benchmark run
- when the user wants to inspect the winning rewrite, matrix, holdout evidence, or logs
- before deciding whether to adopt the best candidate back into the live skill
