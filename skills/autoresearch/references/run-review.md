# Run Review

Use the shared run-review site when you need a visual audit trail for recent benchmark runs.

## What It Shows

- run list across both autoresearch skills
- scenario status and verifier outcome
- final artifact preview for task runs
- copied `.autoresearch` artifacts such as `session.md`, `verify.md`, and `config.json`
- changed files, event timeline, and raw logs

## Build The Site

From the repo root:

```bash
python skills/autoresearch/scripts/build_run_review.py --combined
```

Or point it at explicit benchmark outputs from another workspace:

```bash
python skills/autoresearch/scripts/build_run_review.py \
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
- when the user wants a visual review surface instead of raw JSON and logs
- before sharing a run summary with someone who needs to inspect prompts, results, or verifier evidence
