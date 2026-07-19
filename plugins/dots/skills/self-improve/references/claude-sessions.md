# Claude Code Sessions

Claude Code does not maintain a Codex-style thread database. It stores session
history as plaintext JSONL under its configuration directory. Use these files
for historical mining, with an explicit schema-drift boundary.

## Sources

The configuration root is `CLAUDE_CONFIG_DIR` when set, otherwise `~/.claude`.

| Source | Role |
|---|---|
| `projects/<project>/<session-id>.jsonl` | main session transcript: messages, tool calls, results, and metadata |
| `projects/<project>/<session-id>/subagents/*.jsonl` | subagent transcripts owned by the parent session |
| `history.jsonl` | prompt history with timestamp, project, and session id; useful for discovery only |
| `projects/<project>/memory/MEMORY.md` and topic files | generated project auto-memory |
| `file-history/<session-id>/` | pre-edit checkpoints; use only when the change history is material |

`<project>` is derived from the working directory. Do not reverse the encoded
directory name when the transcript already provides `cwd`.

The current skill invocation can use `${CLAUDE_SESSION_ID}` to identify the
active session. `claude --continue` resumes the latest session in the current
directory, `claude --resume <id-or-name>` targets a saved session, and `/export`
produces a readable current-session transcript. Prefer `/export` or supported
script interfaces for a named current session when practical.

## Direct JSONL boundary

Anthropic documents the transcript location but treats each JSONL entry's shape
as internal and subject to change. For bulk historical mining:

- tolerate unknown entry and content-block types;
- use top-level session metadata plus `user` and `assistant` message content;
- read structured `tool_use` blocks for file arguments and `tool_result` blocks
  only when outcome evidence is needed;
- identify sessions by the transcript's `sessionId`, not only its filename;
- report malformed lines with their file and line number;
- never rewrite transcript, history, checkpoint, or auto-memory files.

Sessions are removed after the configured `cleanupPeriodDays` window (30 days
by default), while `history.jsonl` persists until deleted. Absence of an older
transcript is therefore not evidence that the work never happened. Sessions
started with persistence disabled will not be available to mine.

## Instructions and memory

Claude Code reads `CLAUDE.md`, `.claude/rules/*.md`, and personal
`~/.claude/CLAUDE.md`. It does not read `AGENTS.md` unless `CLAUDE.md` imports it
with `@AGENTS.md`.

Project auto-memory lives under `projects/<project>/memory/`. Treat it as
supporting context and propose changes for review; do not silently edit it.

## Helper examples

For a plugin install, the Claude invocation is `/dots:self-improve`.

```bash
python3 scripts/self_improve.py --platform claude inventory
python3 scripts/self_improve.py --platform claude triage --days 30
python3 scripts/self_improve.py --platform claude show "${CLAUDE_SESSION_ID}"
python3 scripts/self_improve.py --platform claude files "${CLAUDE_SESSION_ID}"
python3 scripts/self_improve.py --platform claude deep --days 30
```

Transcripts and history are plaintext and may contain file contents, command
output, pasted text, or credentials. Restrict every review to the minimum
projects and sessions needed for the user's request.
