# Plugin Eval Benchmarks

Repo-only benchmark assets for skills live here, not inside the shipped skill bundles.

## Run From Repo Root

```bash
./tests/plugin-eval/run-benchmark.sh autoresearch
./tests/plugin-eval/run-benchmark.sh skill-autoresearch
```

The wrapper does 3 things:

1. Runs `plugin-eval benchmark` with the repo-side config for the chosen skill.
2. Writes the latest summary files to `tests/plugin-eval/<skill>/latest/`.
3. Moves the generated scenario run directory out of `skills/<skill>/.plugin-eval/runs/` into `tests/plugin-eval/<skill>/runs/`, then removes the empty skill-root `.plugin-eval` directory when possible.
4. Rebuilds the shared portable run-review site at `tests/plugin-eval/site/` by calling the skill-local `scripts/build_run_review.py --combined` wrapper.

## Re-Analyze With Observed Usage

```bash
node plugins/plugin-eval/scripts/plugin-eval.js analyze skills/autoresearch \
  --observed-usage tests/plugin-eval/autoresearch/latest/observed-usage.jsonl \
  --format markdown

node plugins/plugin-eval/scripts/plugin-eval.js analyze skills/skill-autoresearch \
  --observed-usage tests/plugin-eval/skill-autoresearch/latest/observed-usage.jsonl \
  --format markdown
```

## Layout

- `tests/plugin-eval/<skill>/benchmark.json`: repo-side benchmark config
- `tests/plugin-eval/<skill>/workspace/`: copied fixture workspace used during the run
- `tests/plugin-eval/<skill>/latest/`: latest benchmark summary and observed usage output
- `tests/plugin-eval/<skill>/runs/`: archived scenario logs moved out of the skill bundle after each run
- `tests/plugin-eval/site/`: benchmark-only output location for the portable combined review UI, built from copied local artifacts
