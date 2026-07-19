#!/usr/bin/env python3
"""List and read local Codex threads for Chief-of-Staff recovery."""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


PLUGIN_SCRIPTS = Path(__file__).resolve().parents[3] / "scripts"
sys.path.insert(0, str(PLUGIN_SCRIPTS))

from codex_sessions import iter_session_events, redact_sensitive  # noqa: E402


CODEX_HOME = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()
STATE_DB = CODEX_HOME / "state_5.sqlite"
REQUIRED_COLUMNS = {
    "id",
    "title",
    "source",
    "cwd",
    "created_at",
    "updated_at",
    "archived",
    "rollout_path",
}


@dataclass(frozen=True)
class Thread:
    id: str
    title: str
    source: str
    cwd: str
    created_at: int
    updated_at: int
    archived: bool
    model: str
    rollout_path: str


def utc(timestamp: int) -> str:
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def shorten(value: str, width: int) -> str:
    value = " ".join((value or "").split())
    return value if len(value) <= width else value[: max(1, width - 3)] + "..."


def connect(state_db: Path) -> sqlite3.Connection:
    if not state_db.exists():
        raise SystemExit(f"Missing Codex state DB: {state_db}")
    try:
        connection = sqlite3.connect(state_db.resolve().as_uri() + "?mode=ro", uri=True)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA query_only = ON")
        return connection
    except sqlite3.Error as exc:
        raise SystemExit(f"Cannot read Codex state DB {state_db}: {exc}") from exc


def thread_columns(connection: sqlite3.Connection) -> set[str]:
    try:
        columns = {str(row[1]) for row in connection.execute("PRAGMA table_info(threads)")}
    except sqlite3.Error as exc:
        raise SystemExit(f"Cannot inspect Codex thread schema: {exc}") from exc
    missing = REQUIRED_COLUMNS - columns
    if missing:
        raise SystemExit(f"Codex thread schema is missing: {', '.join(sorted(missing))}")
    return columns


def select_sql(columns: set[str]) -> str:
    model = "coalesce(model, '')" if "model" in columns else "''"
    return (
        "SELECT id, title, source, cwd, created_at, updated_at, archived, "
        f"{model} AS model, rollout_path FROM threads"
    )


def row_to_thread(row: sqlite3.Row) -> Thread:
    return Thread(
        id=str(row["id"]),
        title=str(row["title"] or ""),
        source=str(row["source"] or ""),
        cwd=str(row["cwd"] or ""),
        created_at=int(row["created_at"]),
        updated_at=int(row["updated_at"]),
        archived=bool(row["archived"]),
        model=str(row["model"] or ""),
        rollout_path=str(row["rollout_path"] or ""),
    )


def list_threads(
    *,
    state_db: Path = STATE_DB,
    limit: int = 25,
    archived: str = "active",
    days: int | None = None,
    query: str | None = None,
    cwd: str | None = None,
) -> list[Thread]:
    if limit < 1:
        raise SystemExit("--limit must be positive")
    if days is not None and days < 0:
        raise SystemExit("--days must not be negative")
    if archived not in {"active", "archived", "all"}:
        raise SystemExit("--archived must be active, archived, or all")

    with connect(state_db) as connection:
        columns = thread_columns(connection)
        where: list[str] = []
        params: list[Any] = []
        if archived != "all":
            where.append("archived = ?")
            params.append(0 if archived == "active" else 1)
        if days is not None:
            where.append("updated_at >= ?")
            params.append(int(time.time()) - days * 86400)
        if cwd:
            root = str(Path(cwd).expanduser().resolve())
            where.append("(cwd = ? OR cwd LIKE ?)")
            params.extend([root, root.rstrip(os.sep) + os.sep + "%"])
        if query:
            searchable = ["lower(title) LIKE ?"]
            needle = f"%{query.lower()}%"
            params.append(needle)
            if "first_user_message" in columns:
                searchable.append("lower(first_user_message) LIKE ?")
                params.append(needle)
            where.append("(" + " OR ".join(searchable) + ")")

        sql = select_sql(columns)
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " ORDER BY updated_at DESC, id DESC LIMIT ?"
        params.append(limit)
        try:
            rows = connection.execute(sql, params).fetchall()
        except sqlite3.Error as exc:
            raise SystemExit(f"Cannot query Codex threads: {exc}") from exc
    return [row_to_thread(row) for row in rows]


def find_thread(thread_id: str, *, state_db: Path = STATE_DB) -> Thread:
    if thread_id == "latest":
        rows = list_threads(state_db=state_db, limit=1, archived="all")
        if not rows:
            raise SystemExit("No Codex threads found")
        return rows[0]

    with connect(state_db) as connection:
        columns = thread_columns(connection)
        base = select_sql(columns)
        exact = connection.execute(base + " WHERE id = ?", (thread_id,)).fetchone()
        if exact:
            return row_to_thread(exact)
        matches = connection.execute(
            base + " WHERE id LIKE ? ORDER BY updated_at DESC LIMIT 2",
            (f"{thread_id}%",),
        ).fetchall()
    if not matches:
        raise SystemExit(f"No thread found for {thread_id}")
    if len(matches) > 1:
        raise SystemExit(f"Thread prefix is ambiguous: {thread_id}")
    return row_to_thread(matches[0])


def thread_messages(thread: Thread, *, max_chars: int) -> list[dict[str, str]]:
    if max_chars < 1:
        raise SystemExit("--max-chars must be positive")
    path = Path(thread.rollout_path)
    if not path.exists():
        raise SystemExit(f"Missing rollout for thread {thread.id}: {path}")
    messages: list[dict[str, str]] = []
    remaining = max_chars
    try:
        for event in iter_session_events(path, strict=True):
            if event.kind != "message" or event.role not in {"user", "assistant"}:
                continue
            value = redact_sensitive(event.text.strip())
            if not value:
                continue
            if len(value) > remaining:
                value = value[:remaining] + "\n... truncated ..."
            messages.append({"role": event.role, "text": value})
            remaining -= min(len(value), remaining)
            if remaining <= 0:
                break
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc
    return messages


def public_thread(thread: Thread) -> dict[str, Any]:
    value = asdict(thread)
    value.pop("rollout_path", None)
    value["updated_utc"] = utc(thread.updated_at)
    return value


def print_threads(rows: list[Thread]) -> None:
    print("Updated UTC         St CWD                              Title                            Thread")
    print("------------------- -- -------------------------------- -------------------------------- ------------------------------------")
    for row in rows:
        state = "AR" if row.archived else "AC"
        print(
            f"{utc(row.updated_at):<19} {state:<2} {shorten(row.cwd, 32):<32} "
            f"{shorten(row.title, 32):<32} {row.id}"
        )


def cmd_list(args: argparse.Namespace) -> None:
    rows = list_threads(
        limit=args.limit,
        archived=args.archived,
        days=args.days,
        query=args.query,
        cwd=args.cwd,
    )
    if args.json:
        print(json.dumps([public_thread(row) for row in rows], indent=2))
    else:
        print_threads(rows)


def cmd_show(args: argparse.Namespace) -> None:
    thread = find_thread(args.thread_id)
    messages = thread_messages(thread, max_chars=args.max_chars)
    if args.json:
        print(json.dumps({**public_thread(thread), "messages": messages}, indent=2))
        return
    print(f"# {thread.title or thread.id}\n")
    print(f"- thread_id: `{thread.id}`")
    print(f"- updated_at: `{utc(thread.updated_at)}`")
    print(f"- cwd: `{thread.cwd}`\n")
    for message in messages:
        print(f"## {message['role'].title()}\n")
        print(message["text"])
        print()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Read local Codex threads for Chief-of-Staff recovery.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List threads from state_5.sqlite")
    list_parser.add_argument("--limit", type=int, default=25)
    list_parser.add_argument("--archived", choices=("active", "archived", "all"), default="active")
    list_parser.add_argument("--days", type=int)
    list_parser.add_argument("--query")
    list_parser.add_argument("--cwd")
    list_parser.add_argument("--json", action="store_true")
    list_parser.set_defaults(func=cmd_list)

    show_parser = subparsers.add_parser("show", help="Read one thread transcript")
    show_parser.add_argument("thread_id", help="exact id, unique prefix, or latest")
    show_parser.add_argument("--max-chars", type=int, default=12000)
    show_parser.add_argument("--json", action="store_true")
    show_parser.set_defaults(func=cmd_show)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
