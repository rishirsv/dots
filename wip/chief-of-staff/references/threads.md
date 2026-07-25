# Thread Access

Read this when live Codex thread tools cannot expose a recorded task, or when
the Chief of Staff must inspect historical or multiple project threads.

Prefer live thread tools for current app tasks. Otherwise resolve this skill's
directory and run the read-only helper from there, passing the project root
explicitly:

```bash
python3 scripts/threads.py list --cwd /absolute/project/path --archived all --json
python3 scripts/threads.py show <thread-id-or-prefix> --json
```

The helper reads `CODEX_HOME/state_5.sqlite`, follows each row's recorded
`rollout_path`, and normalizes current and legacy rollout messages through the
plugin's shared session adapter. It never writes thread state and redacts lines
with credential-like markers.

Use `list` to recover task IDs, titles, update times, and working directories.
Use `show` only for the smallest transcript needed to recover status, ownership,
or an expected return. Summarize the evidence into the work record or board; do
not copy raw transcripts into Chief-of-Staff state.

Respect `CODEX_HOME` when the user runs another Codex profile. If the database,
thread, rollout, or JSONL record is unavailable, stop and report that source;
do not reconstruct a path or claim recovered state.
