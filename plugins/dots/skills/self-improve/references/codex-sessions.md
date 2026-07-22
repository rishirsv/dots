# Codex Sessions

Use Codex's live thread tools when the user points to a task the app can expose.
For historical or multi-thread review, use the local index and rollout files.

## Sources

| Source | Role |
|---|---|
| `~/.codex/state_5.sqlite` table `threads` | thread id, title, cwd, timestamps, archive state, and `rollout_path` |
| each row's `rollout_path` | complete JSONL event stream |
| `~/.codex/session_index.jsonl` | convenience index only |
| `~/.codex/memories/MEMORY.md` and `rollout_summaries/` | supporting summaries; verify against transcripts |
| `~/.codex/memories_1.sqlite` | generated per-thread memory summaries |
| `~/.codex/goals_1.sqlite` | durable goal state when goal behavior is relevant |

Respect `CODEX_HOME`; it may point to a separate profile. If the state database
is WAL-locked, copy the database together with its `-wal` and `-shm` files to a
private temporary directory before querying it.

## Mining flow

1. Query `threads` by time, cwd, title, first user message, or id.
2. Read `rollout_path`; do not reconstruct paths from dates or ids.
3. Use `event_msg` user and agent messages for the readable conversation.
4. Use `response_item` function calls and outputs for tool evidence. Parse a
   function call's JSON `arguments` before inspecting file-related keys.
5. Keep subagent threads attached to their parent when the index marks them as
   subagents; do not count them as independent user support.
6. Verify every proposed rule against the cited transcript and current target
   file before editing.

The local schema can evolve. Check the `threads` columns before relying on a
new field, tolerate unknown rollout event types, and fail with the source path
and line number when a JSONL line is malformed.

## Helper examples

```bash
python3 scripts/self_improve.py --platform codex inventory
python3 scripts/self_improve.py --platform codex triage --days 30 --cwd "$PWD"
python3 scripts/self_improve.py --platform codex show <thread-id>
python3 scripts/self_improve.py --platform codex files <thread-id>
python3 scripts/self_improve.py --platform codex deep --days 30
```

The helper defaults to `CODEX_HOME` or `~/.codex`. Its transcript rendering is
an evidence aid, not a substitute for live thread tools when those tools expose
the exact task the user named.
