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
from .workbench_paths import parse_frontmatter


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


def extract_thread_improvement(thread_id: str, *, target: str | None = None, max_chars: int = 12000) -> dict[str, Any]:
    thread = find_thread(thread_id)
    path = Path(thread.rollout_path).expanduser()
    missing_rollout = not path.exists()
    messages: list[dict[str, Any]] = [] if missing_rollout else extract_messages(path)
    target_info = skill_target_info(target)
    user_messages = [message for message in messages if message["role"] == "user"]
    assistant_messages = [message for message in messages if message["role"] == "assistant"]
    excerpt_chars = max(200, min(max_chars, 2000))
    task_seeds = suggested_eval_seeds(user_messages, target_info)
    handoff = extracted_handoff(user_messages, assistant_messages, target_info, task_seeds)
    packet = {
        "decision_to_make": "Whether this thread contains evidence that should change the target skill.",
        "recommended_route": "skill-doctor for a concrete improvement proposal; skill-evaluator if the claim needs current-vs-candidate evidence.",
        "target_skill": target_info,
        "thread_facts": {
            "thread_id": thread.id,
            "title": thread.title,
            "updated_at_utc": utc(thread.updated_at),
            "cwd": thread.cwd,
            "rollout_path": str(path),
            "message_count": len(messages),
            "user_turns": len(user_messages),
            "assistant_turns": len(assistant_messages),
            "missing_rollout": missing_rollout,
        },
        "observed_user_requests": summarize_messages(user_messages, max_chars=excerpt_chars, limit=5),
        "observed_assistant_responses": summarize_messages(assistant_messages, max_chars=excerpt_chars, limit=5),
        "extracted_handoff": handoff,
        "suggested_eval_seeds": task_seeds,
        "approval_boundary": (
            "This packet is read-only evidence. Do not edit skill source until the user approves "
            "a concrete Skill Doctor proposal or directly requests a specific source change."
        ),
        "coverage_limits": coverage_limits(target_info, missing_rollout, messages),
    }
    markdown = render_thread_improvement_handoff(packet)
    return {
        "ok": not missing_rollout,
        "thread": thread.as_dict(),
        "rollout_path": str(path),
        "target": target_info,
        "message_count": len(messages),
        "packet": packet,
        "handoff_markdown": markdown,
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


def render_thread_improvement_handoff(packet: dict[str, Any]) -> str:
    target = packet["target_skill"]
    facts = packet["thread_facts"]
    lines = [
        "# Thread-To-Skill Improvement Handoff",
        "",
        "## Decision",
        packet["decision_to_make"],
        "",
        "## Route",
        packet["recommended_route"],
        "",
        "## Target Skill",
        f"- path: `{target.get('path') or 'not provided'}`",
        f"- skill_md: `{target.get('skill_md') or 'not found'}`",
        f"- name: `{target.get('name') or 'unknown'}`",
        f"- description: {target.get('description') or 'unknown'}",
        "",
        "## Thread Evidence",
        f"- thread_id: `{facts['thread_id']}`",
        f"- title: {facts['title'] or 'untitled'}",
        f"- updated_at: `{facts['updated_at_utc']}`",
        f"- cwd: `{facts['cwd']}`",
        f"- rollout_path: `{facts['rollout_path']}`",
        f"- message_count: {facts['message_count']} ({facts['user_turns']} user / {facts['assistant_turns']} assistant)",
        "",
    ]
    if facts["missing_rollout"]:
        lines.extend(["Rollout file not found. Locate the thread evidence before diagnosing.", ""])
    lines.extend(["## Observed User Requests", ""])
    lines.extend(render_bullets(packet["observed_user_requests"], empty="No user messages found."))
    lines.extend(["", "## Observed Assistant Responses", ""])
    lines.extend(render_bullets(packet["observed_assistant_responses"], empty="No assistant messages found."))
    handoff = packet["extracted_handoff"]
    lines.extend(
        [
            "",
            "## Extracted Handoff",
            f"- Decision: {handoff['decision']}",
            f"- Expected behavior: {handoff['expected_behavior']}",
            f"- Actual behavior: {handoff['actual_behavior']}",
            f"- Suggested route: {handoff['suggested_route']}",
            f"- Likely source: {handoff['likely_source']}",
            f"- Alternate causes to reject: {handoff['alternate_causes_to_reject']}",
            f"- Falsifier: {handoff['falsifier']}",
            "",
            "## Potential Eval Seeds",
            "",
        ]
    )
    lines.extend(render_bullets(packet["suggested_eval_seeds"], empty="No seed prompts available from this thread."))
    lines.extend(
        [
            "",
            "## Approval Boundary",
            packet["approval_boundary"],
            "",
            "## Coverage Limits",
            "",
        ]
    )
    lines.extend(render_bullets(packet["coverage_limits"], empty="No coverage limits recorded."))
    lines.extend(
        [
            "",
            "## Next Step",
            "Use Skill Doctor to propose the smallest source change. Escalate to Skill Evaluator only if the user needs measured evidence across current and candidate skills.",
            "",
        ]
    )
    return "\n".join(lines)


def render_bullets(items: list[str], *, empty: str) -> list[str]:
    if not items:
        return [empty]
    return [f"- {item}" for item in items]


def summarize_messages(messages: list[dict[str, Any]], *, max_chars: int, limit: int) -> list[str]:
    out = []
    for index, message in enumerate(messages[:limit], start=1):
        text = " ".join(message["text"].split())
        if len(text) > max_chars:
            text = text[: max_chars - 15].rstrip() + " ... truncated"
        out.append(f"{index}. {text}")
    if len(messages) > limit:
        out.append(f"{len(messages) - limit} more messages omitted; inspect the transcript before editing.")
    return out


def suggested_eval_seeds(user_messages: list[dict[str, Any]], target_info: dict[str, Any]) -> list[str]:
    seeds = []
    target_name = target_info.get("name") or "the target skill"
    for message in user_messages[:3]:
        text = " ".join(message["text"].split())
        if not text:
            continue
        if len(text) > 280:
            text = text[:265].rstrip() + " ... truncated"
        seeds.append(f"Failure or capability seed for {target_name}: {text}")
    if target_info.get("found"):
        seeds.append(f"Regression seed: ask for the same outcome with `{target_name}` active and check that the improved behavior appears.")
        seeds.append(f"Candidate comparison seed: run the same task under current skill and a candidate skill before claiming improvement.")
    return seeds


def extracted_handoff(
    user_messages: list[dict[str, Any]],
    assistant_messages: list[dict[str, Any]],
    target_info: dict[str, Any],
    task_seeds: list[str],
) -> dict[str, Any]:
    latest_user = compact_message(user_messages[-1]["text"]) if user_messages else ""
    latest_assistant = compact_message(assistant_messages[-1]["text"]) if assistant_messages else ""
    target_name = target_info.get("name") or "the target skill"
    if target_info.get("found"):
        suggested_route = (
            "skill-doctor for a source proposal; skill-evaluator only if this claim needs current-vs-candidate measurement"
        )
    else:
        suggested_route = "identify the target skill, then route to skill-doctor or skill-evaluator"
    return {
        "decision": f"Whether the thread evidence should change {target_name}.",
        "expected_behavior": f"Latest user request: {latest_user}" if latest_user else "No user request was extracted.",
        "actual_behavior": f"Latest assistant response: {latest_assistant}" if latest_assistant else "No assistant response was extracted.",
        "suggested_route": suggested_route,
        "likely_source": "Not inferred by extractor; inspect the target skill description, workflow branch, output contract, references, and validation gaps.",
        "alternate_causes_to_reject": "Task ambiguity, model variance, harness failure, missing target context, or user-scope mismatch.",
        "falsifier": "A transcript or rerun showing the target skill was not invoked, the task was outside scope, or the behavior already matches the skill contract.",
        "task_seeds": task_seeds,
    }


def compact_message(text: str, *, max_chars: int = 360) -> str:
    compact = " ".join(str(text or "").split())
    if len(compact) > max_chars:
        return compact[: max_chars - 15].rstrip() + " ... truncated"
    return compact


def coverage_limits(target_info: dict[str, Any], missing_rollout: bool, messages: list[dict[str, Any]]) -> list[str]:
    limits = []
    if missing_rollout:
        limits.append("The rollout file is missing, so no transcript facts can be inspected.")
    if not messages:
        limits.append("No rendered user or assistant messages were found.")
    if not target_info.get("found"):
        limits.append("No target skill was resolved; identify the skill before proposing edits.")
    limits.append("The extractor does not grade correctness or localize the root cause; a Meta-Skill specialist must inspect the evidence.")
    limits.append("This single thread is directional evidence unless converted into an eval task or checked against a candidate skill.")
    return limits


def skill_target_info(raw_target: str | None) -> dict[str, Any]:
    if not raw_target:
        return {"path": None, "skill_md": None, "found": False, "name": None, "description": None}
    path = Path(raw_target).expanduser().resolve()
    skill_md = path / "SKILL.md" if path.is_dir() else path
    if not skill_md.exists():
        return {"path": str(path), "skill_md": str(skill_md), "found": False, "name": None, "description": None}
    frontmatter = parse_frontmatter(skill_md)
    return {
        "path": str(skill_md.parent),
        "skill_md": str(skill_md),
        "found": True,
        "name": frontmatter.get("name"),
        "description": frontmatter.get("description"),
    }


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
