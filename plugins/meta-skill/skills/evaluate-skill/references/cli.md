Read this for eval command semantics and examples. The full command surface lives in the sibling create-skill [cli-conventions.md](../../create-skill/references/cli-conventions.md); do not invent commands or flags beyond it.

## Run Selection

```bash
meta-skill run .
meta-skill run . --eval F1
meta-skill run . --eval F1-multiturn
meta-skill run . --type G
meta-skill run . --topic source-faithfulness
meta-skill run . --no-skill
```

`run` freezes the current portable payload and each selected `eval.md`, writes per-eval `rpc.jsonl`, `transcript.json`, and `response.md`, then prints the run ID, run path, and executed eval folders. `rpc.jsonl` remains the durable raw event log when bounded in-memory extraction buffers overflow; in that eval `transcript.json` records a warning, and `response.md` explicitly says the current turn's final answer is unavailable if final assistant deltas were not retained. `--no-skill` omits the payload and records control evidence. Exit code is `1` when the run records errors.

## Lint

```bash
meta-skill lint .
```

`lint` validates the portable payload, workbench shape, eval definitions, fixture declarations, and deterministic tests. It does not mutate saved run evidence.

## Current Boundaries

Use the top-level commands from `cli-conventions.md`, manually authored `R`/`F`/`G` evals, one execution source per run, read-only App Server evidence, and direct TypeScript runtime validation.
