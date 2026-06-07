# Meta Skill Architecture

Meta Skill is a Codex skill bundle for creating, evaluating, and improving
portable reusable skills. It uses Codex Desktop as the visible cockpit for
orchestration, with a small typed local utility (`msk`) to keep run evidence small
and repeatable.

## Shape

The plugin ships a support utility (`msk`) alongside the skill payload:

```text
plugins/meta-skill/
  .codex-plugin/plugin.json
  tools/
  assets/
  references/
  skills/
```

The source of truth is the skill guidance under `skills/` plus shared references
under `references/`. Runtime code belongs inside an individual generated skill
only when that skill itself needs a reusable script.

## Lanes

Meta Skill works through three focused lanes:

| Lane | Owns |
|---|---|
| `create-skill` | deciding whether a workflow should become a skill, drafting the portable payload, and choosing portable-only versus project mode |
| `evaluate-skill` | authoring `.meta-skill/evals/`, orchestrating Codex child-thread evidence, and explaining proof limits |
| `improve-skill` | reviewing or editing an existing skill from concrete evidence |

The top-level `meta-skill` skill is only a router. It chooses the lane, keeps
human approval gates visible, and does not perform lane-specific work itself.

## Skill Project Shape

A portable skill payload is rooted at the skill directory:

```text
SKILL.md
agents/
references/      optional
scripts/         optional
assets/          optional
```

Add `.meta-skill/` only for maintained skill projects that need durable
authoring notes, evals, tests, review artifacts, or run evidence:

```text
.meta-skill/
  spec.md
  eval-scenarios.md
  review.md
  evals/
  tests/
  runs/
```

`.meta-skill/` is authoring and evidence state. It is not runtime payload.

## `msk` Support Utility

`msk` is intentionally narrow. It writes and reads `.meta-skill/runs/<run-id>/`
control and evidence files but does not start, control, or export threads.

Supported commands in this worktree:

- `msk init`
- `msk skill new <slug>`
- `msk run new <run-id>`
- `msk run add-thread <run-id> --task <task-id> --thread <thread-id> [--attempt <attempt-id>]`
- `msk run extract <run-id> --thread-export <path>... [--rebuild|--append]`
- `msk run check <run-id>`

## Evidence

Evaluation is Codex Desktop-first. The parent thread starts and supervises
visible child threads, optionally in separate worktrees, then records only the
compact state needed to compare results and resume the batch.

The canonical run files are:

```text
.meta-skill/runs/<run-id>/
  run.json
  results.jsonl
```

`run.json` records expected child attempts. `results.jsonl` records compact
child result rows extracted from `codex_thread_result` blocks. Do not persist
copied raw transcripts by default; cite child thread ids and drill into raw
threads only for degraded rows, surprising results, or user-requested audit.

`msk run extract --thread-export <path>` accepts Codex app `read_thread` JSON
exports directly:

```json
{
  "schemaVersion": 1,
  "thread": { "id": "thread-id" },
  "turns": [
    { "items": [{ "type": "agentMessage", "text": "final text", "phase": "final_answer" }] }
  ]
}
```

Extraction flattens `turns[].items[]`, reads `agentMessage` text, and matches
the export to the expected attempt by thread id. A parsed result block degrades
to a missing-result row when its `run_id`, `task_id`, `attempt_id`, or
`thread_id` does not match the expected attempt.

Completed evidence is not proof by itself. Agents should inspect the compact
rows first, use `msk run check <run-id>` for counts, cite what the evidence
shows, and say what remains unverified.

## Validation

There is no shared Meta Skill validator. Validation is now local to the edited
skill: read the changed payload, check links and referenced files manually, run
any deterministic tests that exist for that skill, and report what was or was
not verified.
