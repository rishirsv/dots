# Meta Skill Codex-First Runner V1 Spec

## Purpose

V1 is a Codex-native batch runner, not a CLI and not a comparison UI.

The parent Codex thread launches many child Codex threads, each with its own
worktree. Each child runs one task and returns one structured result. The parent
reads results back and reports progress.

This replaces the App Server runner path with visible Codex execution.

## Product Shape

The user experience is:

```text
User asks parent thread to run an eval/improvement batch
-> parent loads tasks
-> parent launches N child threads/worktrees
-> children run independently
-> children return structured results
-> parent reads results
-> parent reports completed/running/blocked/errored
```

There is no user-facing V1 CLI. The Codex parent skill is the runner. Local
TypeScript code exists only as helper code for the parent skill/plugin.

## What The User Sees

The user sees a parent Codex thread like:

```text
Running 30 tasks

completed  12
running    16
blocked     2
errored     0

Blocked:
- task-007: missing fixture
- task-019: child asked for clarification

Next:
- wait for remaining children
- open task-007 child thread
- stop run
```

The user can open a child thread or worktree when needed, but the default
experience is the parent thread status report.

## V1 Non-Goals

- no public `meta-skill run`
- no public `meta-skill view`
- no candidate comparison
- no result ranking
- no patch export by default
- no transcript archive by default
- no per-child evidence folders
- no enterprise/security/export layer
- no native front-end

## Core Objects

### Parent Run

The batch as a whole.

Fields:

- run id
- lane: `evaluate-skill` or `improve-skill`
- parent thread id
- task count
- concurrency limit
- child task records
- status counts

### Child Task

One task assigned to one child thread/worktree.

Fields:

- task id
- task brief
- child thread id
- worktree path
- status
- structured result when available

### Child Result

The structured result returned by the child final answer.

Fields:

- task id
- status: `completed`, `blocked`, or `errored`
- short summary
- validation/check notes when any
- risks or blocker
- recommended next action

## Minimal Local State

The parent runner needs only enough durable state to recover after interruption:

```text
.meta-skill/runs/<run-id>/
  run.json
  results.jsonl
```

`run.json`

- created when the parent run starts
- stores task list, child thread ids, worktree paths, and current statuses
- updated by the parent runner as children are launched/read

`results.jsonl`

- append-only result stream
- one line per child result or terminal failure
- stores what the parent read from the child final answer

No `attempts/` folder. No nested child folders. No transcript copies.

## Child Result Contract V1

The child final answer begins with JSON:

```json
{
  "meta_skill_task_result": {
    "schema_version": "meta-skill.task_result.v1",
    "run_id": "run-001",
    "task_id": "task-007",
    "status": "completed",
    "summary": "Finished the requested task.",
    "validation": [
      {"command": "npm test", "outcome": "passed", "notes": "focused tests passed"}
    ],
    "risks": [],
    "recommended_next_action": "Read the result and continue the batch."
  }
}
```

The parent treats this as the child report. The parent does not need to copy the
whole child transcript to know whether the task completed.

## Runtime Flow

```text
parent creates run.json
parent creates child threads/worktrees up to concurrency limit
parent records thread ids and worktree paths in run.json
parent periodically reads child finals
parent appends completed results to results.jsonl
parent updates run.json status counts
parent reports status in the parent thread
```

## Launching 30 Worktrees

V1 should support batch launch with bounded concurrency.

Example:

```text
task_count: 30
concurrency: 5
```

The parent starts five child threads. As children finish, the parent launches the
next queued task until all thirty have run.

This avoids trying to create thirty worktrees at the exact same instant while
still supporting large batches.

## Codex Thread Operations Needed

The parent skill/plugin needs:

- create child thread with worktree
- send initial task brief
- read child final answer
- append follow-up to a child thread when needed
- get child thread/worktree identifiers

Everything else is later.

## Failure Handling

If a child does not return valid JSON, parent records:

```json
{"task_id":"task-007","status":"errored","error":"invalid_result"}
```

If a child asks for help, parent records:

```json
{"task_id":"task-019","status":"blocked","summary":"Child needs fixture path."}
```

The user can then open that child thread or send a follow-up.

## App Server Cutover

V1 replaces App Server as the runner only after live proof that the parent
thread can:

- create child threads/worktrees
- launch a batch with bounded concurrency
- read child final answers
- append results to `results.jsonl`
- recover from interruption using `run.json`
- report progress in the parent thread

Delete App Server source after that proof.
