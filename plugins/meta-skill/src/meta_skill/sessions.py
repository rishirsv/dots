"""Thin read-only access to local Codex session evidence."""

from __future__ import annotations

import json
import os
import sqlite3
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

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

    def as_dict(self):
        row = asdict(self)
        row["created_at_utc"] = utc(self.created_at)
        row["updated_at_utc"] = utc(self.updated_at)
        return row


def codex_home():
    return Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()


def state_db():
    return codex_home() / "state_5.sqlite"


def utc(timestamp):
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def require_db():
    path = state_db()
    if not path.exists():
        raise CliError(f"missing Codex state DB: {path}", 2)
    return path


def _thread(row):
    return SessionThread(
        id=row[0] or "", title=row[1] or "", source=row[2] or "", cwd=row[3] or "",
        created_at=int(row[4] or 0), updated_at=int(row[5] or 0), archived=bool(row[6]),
        model=row[7] or "", rollout_path=row[8] or "",
    )


def list_threads(*, limit, archived, days=None, query=None, cwd=None):
    if archived not in {"active", "archived", "all"}:
        raise CliError("--archived must be active, archived, or all", 2)
    where, params = [], []
    if archived != "all":
        where.append("archived = ?")
        params.append(1 if archived == "archived" else 0)
    if days:
        where.append("updated_at >= ?")
        params.append(int((datetime.now(timezone.utc) - timedelta(days=days)).timestamp()))
    if query:
        where.append("(lower(title) LIKE ? OR lower(coalesce(first_user_message, '')) LIKE ?)")
        params.extend([f"%{query.lower()}%", f"%{query.lower()}%"])
    if cwd:
        where.append("cwd LIKE ?")
        params.append(f"{cwd}%")
    clause = "WHERE " + " AND ".join(where) if where else ""
    params.append(limit)
    with sqlite3.connect(require_db()) as connection:
        rows = connection.execute(
            f"""SELECT id,title,source,cwd,created_at,updated_at,archived,
                       coalesce(model,''),rollout_path FROM threads {clause}
                ORDER BY updated_at DESC,id DESC LIMIT ?""",
            params,
        ).fetchall()
    return [_thread(row) for row in rows]


def find_thread(thread_id):
    with sqlite3.connect(require_db()) as connection:
        exact = connection.execute(
            "SELECT id,title,source,cwd,created_at,updated_at,archived,coalesce(model,''),rollout_path FROM threads WHERE id=?",
            (thread_id,),
        ).fetchone()
        if exact:
            return _thread(exact)
        rows = connection.execute(
            "SELECT id,title,source,cwd,created_at,updated_at,archived,coalesce(model,''),rollout_path FROM threads WHERE id LIKE ? ORDER BY updated_at DESC LIMIT 2",
            (f"{thread_id}%",),
        ).fetchall()
    if len(rows) == 1:
        return _thread(rows[0])
    if rows:
        raise CliError(f"ambiguous thread id prefix: {thread_id}", 2)
    raise CliError(f"thread not found: {thread_id}", 2)


def _messages(path):
    event_messages, response_messages = [], []
    for line_no, line in enumerate(path.read_text().splitlines(), 1):
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError as exc:
            raise CliError(f"invalid JSONL in {path}:{line_no}: {exc}", 2)
        payload = event.get("payload") or {}
        if event.get("type") == "event_msg" and payload.get("type") in {"user_message", "agent_message"}:
            role = "user" if payload["type"] == "user_message" else "assistant"
            text = str(payload.get("message") or "").strip()
            if text:
                event_messages.append({"role": role, "text": text})
        elif event.get("type") == "response_item" and payload.get("type") == "message":
            role = payload.get("role")
            text = "\n".join(
                str(item.get("text")) for item in payload.get("content") or []
                if isinstance(item, dict) and isinstance(item.get("text"), str)
            ).strip()
            if role in {"user", "assistant"} and text:
                response_messages.append({"role": role, "text": text})
    return event_messages or response_messages


def show_thread(thread_id, *, max_chars):
    thread = find_thread(thread_id)
    path = Path(thread.rollout_path).expanduser()
    missing = not path.exists()
    messages = [] if missing else _messages(path)
    lines = [
        f"# {thread.title or thread.id}", "", f"- thread_id: `{thread.id}`",
        f"- updated_at: `{utc(thread.updated_at)}`", f"- cwd: `{thread.cwd}`",
        f"- rollout_path: `{thread.rollout_path}`", "",
    ]
    if missing:
        lines.append("Rollout file not found.")
    elif not messages:
        lines.append("No user or assistant messages found in rollout.")
    else:
        for message in messages:
            lines.extend([f"## {message['role'].title()}", "", message["text"][:max_chars], ""])
            if len(message["text"]) > max_chars:
                lines.extend(["... truncated ...", ""])
    return {
        "ok": not missing, "thread": thread.as_dict(), "rollout_path": str(path),
        "message_count": len(messages), "transcript_markdown": "\n".join(lines).rstrip() + "\n",
        "missing_rollout": missing,
    }


def render_thread_list(threads):
    if not threads:
        return "No Codex sessions matched."
    lines = ["| Updated | Thread | Title | CWD |", "|---|---|---|---|"]
    for thread in threads:
        title = " ".join(thread.title.split()).replace("|", "\\|")
        cwd = " ".join(thread.cwd.split()).replace("|", "\\|")
        lines.append(f"| {utc(thread.updated_at)} | `{thread.id}` | {title} | `{cwd}` |")
    return "\n".join(lines)
