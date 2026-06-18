"""Codex local session evidence helpers."""

from __future__ import annotations

import json
import os
import sqlite3
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable

from .errors import CliError


@dataclass(frozen=True)
class SessionThread:
    id: str
    title: str
    source: str
    cwd: str
    created_at: int
    updated_at: int
    archived: bool
    model: str
    rollout_path: str

    def as_dict(self) -> dict[str, Any]:
        row = asdict(self)
        row["created_at_utc"] = utc(self.created_at)
        row["updated_at_utc"] = utc(self.updated_at)
        return row


def codex_home() -> Path:
    return Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()


def state_db() -> Path:
    return codex_home() / "state_5.sqlite"


def utc(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def require_db() -> Path:
    db = state_db()
    if not db.exists():
        raise CliError(f"missing Codex state DB: {db}", 2)
    return db


def list_threads(
    *,
    limit: int,
    archived: str,
    days: int | None = None,
    query: str | None = None,
    cwd: str | None = None,
) -> list[SessionThread]:
    if archived not in {"active", "archived", "all"}:
        raise CliError("--archived must be active, archived, or all", 2)
    where: list[str] = []
    params: list[Any] = []
    if archived == "active":
        where.append("archived = 0")
    elif archived == "archived":
        where.append("archived = 1")
    if days:
        cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())
        where.append("updated_at >= ?")
        params.append(cutoff)
    if query:
        needle = f"%{query.lower()}%"
        where.append("(lower(title) LIKE ? OR lower(coalesce(first_user_message, '')) LIKE ?)")
        params.extend([needle, needle])
    if cwd:
        where.append("cwd LIKE ?")
        params.append(f"{cwd}%")
    where_sql = "WHERE " + " AND ".join(where) if where else ""
    sql = f"""
        SELECT id, title, source, cwd, created_at, updated_at, archived,
               coalesce(model, ''), rollout_path
        FROM threads
        {where_sql}
        ORDER BY updated_at DESC, id DESC
        LIMIT ?
    """
    params.append(limit)
    with sqlite3.connect(require_db()) as conn:
        rows = conn.execute(sql, params).fetchall()
    return [_thread_from_row(row) for row in rows]


def find_thread(thread_id: str) -> SessionThread:
    with sqlite3.connect(require_db()) as conn:
        row = conn.execute(
            """
            SELECT id, title, source, cwd, created_at, updated_at, archived,
                   coalesce(model, ''), rollout_path
            FROM threads
            WHERE id = ?
            """,
            (thread_id,),
        ).fetchone()
        if row:
            return _thread_from_row(row)
        rows = conn.execute(
            """
            SELECT id, title, source, cwd, created_at, updated_at, archived,
                   coalesce(model, ''), rollout_path
            FROM threads
            WHERE id LIKE ?
            ORDER BY updated_at DESC, id DESC
            LIMIT 2
            """,
            (f"{thread_id}%",),
        ).fetchall()
    if len(rows) == 1:
        return _thread_from_row(rows[0])
    if len(rows) > 1:
        raise CliError(f"ambiguous thread id prefix: {thread_id}", 2)
    raise CliError(f"thread not found: {thread_id}", 2)


def show_thread(thread_id: str, *, max_chars: int) -> dict[str, Any]:
    thread = find_thread(thread_id)
    path = Path(thread.rollout_path).expanduser()
    messages: list[dict[str, Any]] = []
    missing_rollout = not path.exists()
    if not missing_rollout:
        messages = extract_messages(path)
    markdown = render_transcript(thread, messages, max_chars=max_chars, missing_rollout=missing_rollout)
    return {
        "ok": not missing_rollout,
        "thread": thread.as_dict(),
        "rollout_path": str(path),
        "message_count": len(messages),
        "transcript_markdown": markdown,
        "missing_rollout": missing_rollout,
    }


def extract_messages(path: Path) -> list[dict[str, Any]]:
    event_messages: list[dict[str, Any]] = []
    response_messages: list[dict[str, Any]] = []
    for event in iter_events(path):
        if event.get("type") == "event_msg":
            payload = event.get("payload") or {}
            kind = payload.get("type")
            if kind == "user_message":
                _append_message(event_messages, "user", payload.get("message"), event.get("timestamp"))
            elif kind == "agent_message":
                _append_message(event_messages, "assistant", payload.get("message"), event.get("timestamp"))
        elif event.get("type") == "response_item":
            payload = event.get("payload") or {}
            if payload.get("type") != "message":
                continue
            role = payload.get("role")
            if role not in {"user", "assistant"}:
                continue
            text = _content_text(payload.get("content") or [])
            _append_message(response_messages, role, text, event.get("timestamp"))
    return event_messages or response_messages


def iter_events(path: Path) -> Iterable[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError as exc:
                raise CliError(f"invalid JSONL in {path}:{line_no}: {exc}", 2)


def render_thread_list(threads: list[SessionThread]) -> str:
    if not threads:
        return "No Codex sessions matched."
    lines = [
        "| Updated | Thread | Title | CWD |",
        "|---|---|---|---|",
    ]
    for thread in threads:
        lines.append(
            f"| {utc(thread.updated_at)} | `{thread.id}` | {_cell(thread.title)} | `{_cell(thread.cwd)}` |"
        )
    return "\n".join(lines)


def render_transcript(
    thread: SessionThread,
    messages: list[dict[str, Any]],
    *,
    max_chars: int,
    missing_rollout: bool = False,
) -> str:
    lines = [
        f"# {thread.title or thread.id}",
        "",
        f"- thread_id: `{thread.id}`",
        f"- updated_at: `{utc(thread.updated_at)}`",
        f"- cwd: `{thread.cwd}`",
        f"- rollout_path: `{thread.rollout_path}`",
        "",
    ]
    if missing_rollout:
        lines.append("Rollout file not found.")
        return "\n".join(lines) + "\n"
    if not messages:
        lines.append("No user or assistant messages found in rollout.")
        return "\n".join(lines) + "\n"
    for message in messages:
        heading = "User" if message["role"] == "user" else "Assistant"
        text = message["text"]
        truncated = text[:max_chars]
        lines.extend([f"## {heading}", "", truncated, ""])
        if len(text) > max_chars:
            lines.extend(["... truncated ...", ""])
    return "\n".join(lines)


def _thread_from_row(row: tuple[Any, ...]) -> SessionThread:
    return SessionThread(
        id=row[0] or "",
        title=row[1] or "",
        source=row[2] or "",
        cwd=row[3] or "",
        created_at=int(row[4] or 0),
        updated_at=int(row[5] or 0),
        archived=bool(row[6]),
        model=row[7] or "",
        rollout_path=row[8] or "",
    )


def _append_message(out: list[dict[str, Any]], role: str, text: Any, timestamp: Any) -> None:
    message = str(text or "").strip()
    if message:
        out.append({"role": role, "text": message, "timestamp": timestamp or ""})


def _content_text(content: list[Any]) -> str:
    parts: list[str] = []
    for item in content:
        if not isinstance(item, dict):
            continue
        text = item.get("text")
        if isinstance(text, str):
            parts.append(text)
    return "\n".join(parts).strip()


def _cell(value: str) -> str:
    return " ".join((value or "").split()).replace("|", "\\|")
