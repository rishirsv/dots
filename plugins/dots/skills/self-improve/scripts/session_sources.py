"""Isolated session-store adapters for Self Improve.

Each adapter owns discovery and parsing for one host. The mining pipeline only
consumes ``SessionRecord`` and ``SessionEvent`` values from this module; it does
not read another host's state as a fallback.
"""
from __future__ import annotations

import json
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable, Protocol


@dataclass(frozen=True)
class SessionRecord:
    id: str
    title: str
    source: str
    cwd: str
    created_at: int
    updated_at: int
    archived: bool
    model: str
    rollout_path: str
    platform: str = "codex"


@dataclass(frozen=True)
class SessionEvent:
    kind: str
    role: str = ""
    text: str = ""
    payload: dict[str, Any] | None = None


class SessionSource(Protocol):
    platform: str

    def list_sessions(
        self,
        *,
        limit: int,
        archived: str,
        days: int | None = None,
        query: str | None = None,
        cwd: str | None = None,
    ) -> list[SessionRecord]: ...

    def events(self, session: SessionRecord, *, include_subagents: bool = False) -> Iterable[SessionEvent]: ...


def _timestamp(value: Any) -> int | None:
    if isinstance(value, (int, float)):
        raw = float(value)
        if raw > 10_000_000_000:
            raw /= 1000
        return int(raw)
    if not isinstance(value, str) or not value:
        return None
    try:
        return int(datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp())
    except ValueError:
        return None


def _content_text(content: Any) -> str:
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    chunks: list[str] = []
    for block in content:
        if not isinstance(block, dict):
            continue
        if block.get("type") in {"text", "input_text", "output_text"}:
            value = block.get("text")
            if isinstance(value, str):
                chunks.append(value)
    return "\n".join(chunks)


def iter_jsonl(path: Path) -> Iterable[dict[str, Any]]:
    try:
        handle = path.open("r", encoding="utf-8")
    except OSError as exc:
        raise ValueError(f"Cannot read {path}: {exc}") from exc
    with handle:
        for line_no, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Malformed JSONL at {path}:{line_no}: {exc}") from exc
            if isinstance(item, dict):
                yield item


class CodexSource:
    platform = "codex"

    def __init__(self, home: Path, event_reader: Any) -> None:
        self.home = home
        self.state_db = home / "state_5.sqlite"
        self._event_reader = event_reader

    def list_sessions(
        self,
        *,
        limit: int,
        archived: str,
        days: int | None = None,
        query: str | None = None,
        cwd: str | None = None,
    ) -> list[SessionRecord]:
        if not self.state_db.exists():
            raise SystemExit(f"Missing Codex state DB: {self.state_db}")
        where: list[str] = []
        params: list[Any] = []
        if archived == "active":
            where.append("archived = 0")
        elif archived == "archived":
            where.append("archived = 1")
        elif archived != "all":
            raise SystemExit("--archived must be active, archived, or all")
        if days:
            cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())
            where.append("updated_at >= ?")
            params.append(cutoff)
        if query:
            needle = f"%{query.lower()}%"
            where.append("(lower(title) LIKE ? OR lower(first_user_message) LIKE ?)")
            params.extend([needle, needle])
        if cwd:
            where.append("cwd LIKE ?")
            params.append(f"{cwd}%")
        where_sql = "WHERE " + " AND ".join(where) if where else ""
        params.append(limit)
        try:
            conn = sqlite3.connect(f"file:{self.state_db}?mode=ro", uri=True)
        except sqlite3.Error as exc:
            raise SystemExit(f"Cannot open Codex state DB {self.state_db}: {exc}") from exc
        with conn:
            try:
                rows = conn.execute(
                    f"""
                    SELECT id, title, source, cwd, created_at, updated_at, archived,
                           coalesce(model, ''), rollout_path
                    FROM threads {where_sql}
                    ORDER BY updated_at DESC, id DESC LIMIT ?
                    """,
                    params,
                ).fetchall()
            except sqlite3.Error as exc:
                raise SystemExit(f"Cannot query Codex state DB {self.state_db}: {exc}") from exc
        return [
            SessionRecord(
                id=str(row[0]), title=row[1] or "", source=row[2] or "", cwd=row[3] or "",
                created_at=int(row[4]), updated_at=int(row[5]), archived=bool(row[6]),
                model=row[7] or "", rollout_path=row[8] or "", platform="codex",
            )
            for row in rows
        ]

    def events(self, session: SessionRecord, *, include_subagents: bool = False) -> Iterable[SessionEvent]:
        del include_subagents
        path = Path(session.rollout_path)
        if not path.exists():
            return
        for event in self._event_reader(path, strict=True):
            yield SessionEvent(
                kind=event.kind,
                role=event.role or "",
                text=event.text or "",
                payload=event.payload or {},
            )


class ClaudeSource:
    platform = "claude"

    def __init__(self, home: Path) -> None:
        self.home = home
        self.projects = home / "projects"

    def _metadata(self, path: Path) -> SessionRecord:
        session_id = path.stem
        title = ""
        first_prompt = ""
        cwd = ""
        source = "claude-code"
        model = ""
        created: int | None = None
        updated: int | None = None
        for item in iter_jsonl(path):
            session_id = str(item.get("sessionId") or session_id)
            cwd = str(item.get("cwd") or cwd)
            source = str(item.get("entrypoint") or source)
            timestamp = _timestamp(item.get("timestamp"))
            if timestamp is not None:
                created = timestamp if created is None else min(created, timestamp)
                updated = timestamp if updated is None else max(updated, timestamp)
            kind = item.get("type")
            if kind == "ai-title" and item.get("aiTitle"):
                title = str(item["aiTitle"])
            elif kind == "last-prompt" and not title and item.get("lastPrompt"):
                title = str(item["lastPrompt"])
            elif kind == "user" and not item.get("isMeta") and not first_prompt:
                first_prompt = _content_text((item.get("message") or {}).get("content"))
            elif kind == "assistant" and not model:
                model = str((item.get("message") or {}).get("model") or "")
        file_time = int(path.stat().st_mtime)
        return SessionRecord(
            id=session_id,
            title=title or " ".join(first_prompt.split())[:100] or session_id,
            source=source,
            cwd=cwd,
            created_at=created or file_time,
            updated_at=updated or file_time,
            archived=False,
            model=model,
            rollout_path=str(path),
            platform="claude",
        )

    def list_sessions(
        self,
        *,
        limit: int,
        archived: str,
        days: int | None = None,
        query: str | None = None,
        cwd: str | None = None,
    ) -> list[SessionRecord]:
        if archived == "archived":
            return []
        if not self.projects.exists():
            raise SystemExit(f"Missing Claude Code projects directory: {self.projects}")
        cutoff = None
        if days:
            cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())
        paths = sorted(self.projects.glob("*/*.jsonl"), key=lambda path: path.stat().st_mtime, reverse=True)
        rows: list[SessionRecord] = []
        for path in paths:
            if cutoff and int(path.stat().st_mtime) < cutoff:
                continue
            session = self._metadata(path)
            if cutoff and session.updated_at < cutoff:
                continue
            if cwd and not session.cwd.startswith(cwd):
                continue
            if query and query.lower() not in f"{session.title} {session.cwd}".lower():
                continue
            rows.append(session)
            if len(rows) >= limit:
                break
        return rows

    def _paths(self, session: SessionRecord, include_subagents: bool) -> list[Path]:
        transcript = Path(session.rollout_path)
        paths = [transcript]
        if include_subagents:
            directory = transcript.with_suffix("") / "subagents"
            if directory.is_dir():
                paths.extend(sorted(directory.glob("*.jsonl")))
        return paths

    def events(self, session: SessionRecord, *, include_subagents: bool = False) -> Iterable[SessionEvent]:
        for path in self._paths(session, include_subagents):
            for item in iter_jsonl(path):
                kind = item.get("type")
                if kind == "user":
                    if item.get("isMeta"):
                        continue
                    content = (item.get("message") or {}).get("content")
                    text = _content_text(content).strip()
                    if text:
                        yield SessionEvent(kind="message", role="user", text=text, payload=item)
                    if isinstance(content, list):
                        for block in content:
                            if isinstance(block, dict) and block.get("type") == "tool_result":
                                yield SessionEvent(
                                    kind="function_call_output",
                                    payload={"output": _content_text(block.get("content"))},
                                )
                elif kind == "assistant":
                    message = item.get("message") or {}
                    content = message.get("content")
                    text = _content_text(content).strip()
                    if text:
                        yield SessionEvent(kind="message", role="assistant", text=text, payload=item)
                    if not isinstance(content, list):
                        continue
                    for block in content:
                        if not isinstance(block, dict):
                            continue
                        if block.get("type") == "tool_use":
                            yield SessionEvent(
                                kind="function_call",
                                payload={
                                    "name": str(block.get("name") or ""),
                                    "arguments": block.get("input") or {},
                                },
                            )
                        elif block.get("type") == "tool_result":
                            yield SessionEvent(
                                kind="function_call_output",
                                payload={"output": _content_text(block.get("content"))},
                            )
