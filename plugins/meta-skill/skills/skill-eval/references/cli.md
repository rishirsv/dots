Read this for eval command semantics and examples. The full command surface lives in the sibling skill-create [cli-conventions.md](../../skill-create/references/cli-conventions.md); do not invent commands or flags beyond it.

## Run Selection

```bash
meta-skill run .
meta-skill run . --case F1
meta-skill run . --case F1-multiturn
meta-skill run . --type G
meta-skill run . --topic source-faithfulness
meta-skill run . --no-skill
```

`run` freezes the current portable payload and each selected `case.md`, writes per-case `rpc.jsonl`, `turn-evidence.json`, and `final.md`, then prints the run ID, run path, and executed case folders. `rpc.jsonl` remains the durable raw event log when bounded in-memory extraction buffers overflow; in that case `turn-evidence.json` records a warning, and `final.md` explicitly says the current turn's final answer is unavailable if final assistant deltas were not retained. `--no-skill` omits the payload and records control evidence. Exit code is `1` when the run records errors.

## Lint

```bash
meta-skill lint .
```

`lint` validates the portable payload, workbench shape, case definitions, fixture declarations, and unit tests. It does not mutate saved run evidence.

## Current Boundaries

Use the top-level commands from `cli-conventions.md`, manually authored `R`/`F`/`G` cases, one execution source per run, read-only App Server evidence, and direct TypeScript runtime validation.
