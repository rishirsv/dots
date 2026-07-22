#!/usr/bin/env python3
"""Build a compact handoff context packet from local Codex transcripts."""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PLUGIN_SCRIPTS = Path(__file__).resolve().parents[3] / "scripts"
sys.path.insert(0, str(PLUGIN_SCRIPTS))

from codex_sessions import iter_session_events, redact_sensitive  # noqa: E402


@dataclass(frozen=True)
class Thread:
    id: str
    title: str
    cwd: str
    created_at: int
    updated_at: int
    rollout_path: str
    git_branch: str
    preview: str
    first_user_message: str


def codex_home() -> Path:
    return Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()


def state_db(args: argparse.Namespace) -> Path:
    if args.state_db:
        return Path(args.state_db).expanduser()
    return codex_home() / "state_5.sqlite"


def utc(ts: int) -> str:
    if not ts:
        return "unknown"
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def one_line(text: str, limit: int) -> str:
    text = " ".join((text or "").split())
    if len(text) <= limit:
        return text
    return text[: max(1, limit - 1)] + "..."


def connect(db_path: Path) -> sqlite3.Connection:
    if not db_path.exists():
        raise SystemExit(f"Missing Codex state DB: {db_path}")
    return sqlite3.connect(db_path)


def row_to_thread(row: sqlite3.Row | tuple[Any, ...]) -> Thread:
    return Thread(
        id=row[0] or "",
        title=row[1] or "",
        cwd=row[2] or "",
        created_at=int(row[3] or 0),
        updated_at=int(row[4] or 0),
        rollout_path=row[5] or "",
        git_branch=row[6] or "",
        preview=row[7] or "",
        first_user_message=row[8] or "",
    )


def find_threads(args: argparse.Namespace) -> list[Thread]:
    db_path = state_db(args)
    where: list[str] = []
    params: list[Any] = []

    if args.thread:
        where.append("id = ?")
        params.append(args.thread)
    else:
        if args.cwd:
            cwd = str(Path(args.cwd).expanduser().resolve())
            where.append("(cwd = ? OR cwd LIKE ?)")
            params.extend([cwd, f"{cwd}/%"])
        if args.query:
            needle = f"%{args.query.lower()}%"
            where.append(
                "(lower(title) LIKE ? OR lower(first_user_message) LIKE ? OR lower(preview) LIKE ?)"
            )
            params.extend([needle, needle, needle])
        if not args.include_archived:
            where.append("archived = 0")

    where_sql = "WHERE " + " AND ".join(where) if where else ""
    sql = f"""
        SELECT id, title, cwd, created_at, updated_at, rollout_path,
               coalesce(git_branch, ''), preview, first_user_message
        FROM threads
        {where_sql}
        ORDER BY updated_at DESC, id DESC
        LIMIT ?
    """
    params.append(args.limit)

    with connect(db_path) as conn:
        rows = conn.execute(sql, params).fetchall()
    return [row_to_thread(row) for row in rows]


def parse_function_call(payload: dict[str, Any], limit: int) -> str:
    name = payload.get("name") or "tool"
    arguments = payload.get("arguments") or ""
    if isinstance(arguments, str):
        try:
            parsed = json.loads(arguments)
            if isinstance(parsed, dict) and "cmd" in parsed:
                arguments = parsed["cmd"]
            else:
                arguments = json.dumps(parsed, ensure_ascii=False)
        except json.JSONDecodeError:
            pass
    return one_line(redact_sensitive(f"{name}: {arguments}"), limit)


def interesting_tool_output(output: str) -> bool:
    lowered = output.lower()
    needles = (
        "validation",
        "passed",
        "failed",
        "error",
        "exit code",
        "tests",
        "packaged",
        "output:",
    )
    return any(needle in lowered for needle in needles)


def parse_transcript(path: Path, *, max_events: int, char_limit: int) -> list[dict[str, str]]:
    events: list[dict[str, str]] = []
    if not path.exists():
        return [
            {
                "timestamp": "",
                "kind": "missing",
                "text": f"Transcript path not found: {path}",
            }
        ]

    for normalized in iter_session_events(path):
        timestamp = normalized.timestamp
        payload = normalized.payload or {}
        event: dict[str, str] | None = None
        if normalized.kind == "session_meta":
            event = {
                "timestamp": timestamp,
                "kind": "session",
                "text": one_line(
                    f"cwd={payload.get('cwd') or ''} model={payload.get('model') or ''}",
                    char_limit,
                ),
            }
        elif normalized.kind == "message":
            if normalized.role in {"user", "assistant"} and normalized.text:
                event = {
                    "timestamp": timestamp,
                    "kind": normalized.role,
                    "text": one_line(redact_sensitive(normalized.text), char_limit),
                }
        elif normalized.kind == "function_call":
            event = {
                "timestamp": timestamp,
                "kind": "tool-call",
                "text": parse_function_call(payload, char_limit),
            }
        elif normalized.kind == "function_call_output":
            output = str(payload.get("output") or "")
            if interesting_tool_output(output):
                event = {
                    "timestamp": timestamp,
                    "kind": "tool-output",
                    "text": one_line(redact_sensitive(output), char_limit),
                }

        if event:
            events.append(event)

    if len(events) > max_events:
        head_count = max_events // 3
        tail_count = max_events - head_count
        return [
            *events[:head_count],
            {
                "timestamp": "",
                "kind": "omitted",
                "text": f"{len(events) - max_events} middle events omitted",
            },
            *events[-tail_count:],
        ]
    return events


def render_markdown(thread: Thread, events: list[dict[str, str]]) -> str:
    lines = [
        "# Handoff Transcript Context",
        "",
        "## Thread",
        f"- ID: `{thread.id}`",
        f"- Title: {one_line(redact_sensitive(thread.title), 240) or 'untitled'}",
        f"- CWD: `{thread.cwd or 'unknown'}`",
        f"- Branch: `{thread.git_branch or 'unknown'}`",
        f"- Created: {utc(thread.created_at)}",
        f"- Updated: {utc(thread.updated_at)}",
        f"- Transcript: `{thread.rollout_path}`",
    ]
    if thread.first_user_message:
        lines.append(f"- First user message: {one_line(redact_sensitive(thread.first_user_message), 240)}")
    if thread.preview:
        lines.append(f"- Preview: {one_line(redact_sensitive(thread.preview), 240)}")

    lines.extend(["", "## Reduced Events"])
    if not events:
        lines.append("- No transcript events found.")
    for event in events:
        stamp = f"{event['timestamp']} " if event.get("timestamp") else ""
        lines.append(f"- {stamp}`{event['kind']}`: {redact_sensitive(event['text'])}")
    return "\n".join(lines) + "\n"


def render_json(thread: Thread, events: list[dict[str, str]]) -> str:
    payload = {
        "thread": {
            "id": thread.id,
            "title": one_line(redact_sensitive(thread.title), 1000),
            "cwd": thread.cwd,
            "branch": thread.git_branch,
            "created_at": utc(thread.created_at),
            "updated_at": utc(thread.updated_at),
            "rollout_path": thread.rollout_path,
            "first_user_message": one_line(redact_sensitive(thread.first_user_message), 1000),
            "preview": one_line(redact_sensitive(thread.preview), 1000),
        },
        "events": [
            {**event, "text": redact_sensitive(event.get("text", ""))}
            for event in events
        ],
    }
    return json.dumps(payload, indent=2, ensure_ascii=False) + "\n"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Build a compact handoff context packet from local Codex transcripts."
    )
    parser.add_argument("--thread", help="Exact Codex thread/session id to read.")
    parser.add_argument(
        "--cwd",
        default=str(Path.cwd()),
        help="Project directory used to match recent threads. Defaults to the current directory.",
    )
    parser.add_argument("--query", help="Search thread title, first user message, or preview.")
    parser.add_argument(
        "--latest",
        action="store_true",
        help="Use the newest matching thread. This is the default when --thread is omitted.",
    )
    parser.add_argument("--include-archived", action="store_true", help="Include archived threads.")
    parser.add_argument("--state-db", help="Override Codex state DB path.")
    parser.add_argument("--limit", type=int, default=5, help="Candidate thread limit.")
    parser.add_argument("--max-events", type=int, default=80, help="Maximum reduced events to print.")
    parser.add_argument("--char-limit", type=int, default=700, help="Maximum characters per event.")
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    threads = find_threads(args)
    if not threads:
        print("No matching Codex threads found.", file=sys.stderr)
        return 1

    thread = threads[0]
    rollout_path = Path(thread.rollout_path).expanduser()
    events = parse_transcript(rollout_path, max_events=args.max_events, char_limit=args.char_limit)

    if args.format == "json":
        print(render_json(thread, events), end="")
    else:
        print(render_markdown(thread, events), end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
