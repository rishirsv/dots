# Codex Thread Evidence

Use this only when a repo-scoped harness control depends on prior Codex session
evidence, such as "we keep making this repo mistake" or "codify what happened
in that thread." Do not use it for broad personal learning, global preferences,
memory edits, or skill changes; route those to `self-improve`.

## Sources

Prefer concrete thread evidence over memory summaries:

1. Current user request and current conversation.
2. Codex thread index: `~/.codex/state_5.sqlite`.
3. Rollout transcripts from each thread row's `rollout_path`.
4. Memory summaries only as supporting context:
   `~/.codex/memories/MEMORY.md`,
   `~/.codex/memories/rollout_summaries/`, and
   `~/.codex/memories_1.sqlite`.
5. Current repo instructions and source files.

Treat `~/.codex/session_index.jsonl` as a convenience index only. Verify any
repo-control proposal against thread transcripts before patching instructions,
docs, scripts, tests, hooks, or CI.

## Availability

If `self-improve` or `scripts/self_improve.py` is unavailable, do not recreate
broad session mining in this skill. Use the current conversation and repo files
only, mark prior-thread evidence unavailable, and route the user to
`self-improve` when broad session evidence is required.

## Commands

Run from the `self-improve` skill directory when available. In this repo, that
is `plugins/dots/skills/self-improve/`.

```bash
python3 scripts/self_improve.py inventory --memories 10
python3 scripts/self_improve.py triage --limit 100 --days 30 --archived all
python3 scripts/self_improve.py list --limit 25 --archived all
python3 scripts/self_improve.py show <thread-id>
python3 scripts/self_improve.py show latest
python3 scripts/self_improve.py memory-audit --limit 20
```

Use `triage` before deep reading. Use `show` for the thread that actually
supports the proposed repo control. Use `memory-audit` only to understand
supporting memory state; do not edit memories from this skill.

Do not run `dream` or `skill-audit` from this skill. If the user asks for broad
self-improvement, stop and route to `self-improve`; return to
`harness-engineer` only for a selected repo-scoped control.

## Evidence Triage

Prioritize threads with:

- explicit corrections or preferences about this repo;
- repeated validation, setup, generated-file, command, or workflow failures;
- `AGENTS.md`, instruction, docs, script, test, hook, CI, or harness discussion;
- failed validation, repeated retries, or a successful workflow after dead ends;
- `cwd` matching the current repository.

Skip one-off implementation requests unless the failure is likely to recur.

## Extract

For each thread used as evidence, capture:

- trigger: what the user asked for;
- expected behavior: what should have happened;
- actual behavior: what happened instead;
- durable signal: correction, repeated failure, accepted workflow, or validation
  evidence;
- repo-control target: instruction, doc, task state, script, test, hook, CI,
  generated/source boundary, or no durable change;
- confidence: strong, medium, weak, or contradicted;
- evidence: thread id, updated time, cwd, and rollout path.

Do not copy raw private transcript text into durable repo guidance. Summarize
the reusable failure class and cite the thread evidence in chat or temporary
review notes.

## Route Decision

After reading the evidence:

- If the fix is repo-scoped and durable, continue with `control`.
- If the lesson is personal, global, memory-oriented, or skill-oriented, stop and
  route to `self-improve`.
- If the evidence is weak or contradicted, propose a task-state note or no
  durable change instead of adding permanent instructions.

The final repo control should still pass the normal control check: narrowest
scope, one source of truth, mechanical guard when practical, and deterministic
validation when changed.
