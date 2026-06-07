# Meta Skill Codex-First Runner V1 Exec Plan

## Objective

Build V1 as a Codex parent-thread batch runner. Do not build a public CLI.

```text
parent loads tasks
-> parent launches child threads/worktrees with bounded concurrency
-> children return structured task results
-> parent appends results
-> parent reports progress
```

## V1 State Shape

Only:

```text
.meta-skill/runs/<run-id>/
  run.json
  results.jsonl
```

No `attempts/`. No per-child evidence folders. No summary file. No user-facing
CLI.

## Slice 1: Runner State Library

Implement internal TypeScript helpers only:

- create run
- record child launch
- update task status
- append child result
- read current status counts
- recover run from `run.json` + `results.jsonl`

Likely files:

- `plugins/meta-skill/src/codex-runner/state.ts`
- `plugins/meta-skill/src/codex-runner/state.test.ts`
- `plugins/meta-skill/src/codex-runner/task-result.ts`
- `plugins/meta-skill/src/codex-runner/task-result.test.ts`

Validation:

- creates `run.json`
- appends `results.jsonl`
- recovers completed/running/blocked/errored counts
- rejects invalid child result JSON

## Slice 2: Codex Thread Adapter

Implement adapter boundary for parent skill/plugin use:

- create child thread with worktree
- send initial task brief
- read child final answer
- append follow-up
- record thread id and worktree path

Likely files:

- `plugins/meta-skill/src/codex-runner/thread-client.ts`
- `plugins/meta-skill/src/codex-runner/thread-client.test.ts`

Validation:

- fake adapter can launch 30 tasks with concurrency 5
- launch records thread id and worktree path
- completed child appends one result line
- blocked child remains readable and follow-up-capable

## Slice 3: Parent Skill Orchestration

Update Meta Skill lane skills to call the internal runner helpers from Codex,
not through a public CLI.

Behavior:

- parent loads eval/improve tasks
- parent creates run state
- parent launches children up to concurrency limit
- parent reads child finals
- parent posts progress updates in the parent thread

Validation:

- parent can run a fixture batch of 30 fake tasks
- parent reports completed/running/blocked/errored counts
- no App Server process starts

## Slice 4: Live Codex Smoke

Run a live smoke in Codex Desktop:

- create a parent run
- launch multiple real child threads/worktrees
- read their final task results
- append `results.jsonl`
- recover after interruption from `run.json`
- report progress in parent thread

## Deletion Gate

Delete App Server only after live smoke proves the Codex parent runner can
replace it.

Search gate after deletion:

```bash
rg -n "App Server|app-server|rpc.jsonl|mounted-skill|--no-skill|trace-buffer|working_payload|no_skill" plugins/meta-skill .plans skills .codex/agents
```
