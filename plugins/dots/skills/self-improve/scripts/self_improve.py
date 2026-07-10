#!/usr/bin/env python3
"""Mine Codex or Claude Code sessions for durable improvement proposals.

The helper discovers and ranks sessions, renders conversations, extracts file
references, and surfaces proposal candidates. It never edits sessions, memory,
instructions, skills, or repositories. The agent verifies the evidence and the
user approves any change.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shlex
import sqlite3
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable


DEFAULT_CODEX_HOME = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()
DEFAULT_CLAUDE_HOME = Path(
    os.environ.get("CLAUDE_CONFIG_DIR", Path.home() / ".claude")
).expanduser()
SOURCE_SKILLS_ROOT = Path(__file__).resolve().parents[2]

PREFERENCE_MARKERS = (
    "always",
    "default to",
    "prefer",
    "preserve",
    "should",
    "make sure",
    "i want you to",
    "keep ",
    "from now on",
    "going forward",
)
CORRECTION_MARKERS = (
    "do not",
    "don't",
    "never",
    "instead of",
    "instead,",
    "not what i asked",
    "that's wrong",
    "thats wrong",
    "stop doing",
    "you keep",
)
EXPLICIT_MARKERS = (
    "always",
    "never",
    "do not",
    "don't",
    "must",
    "from now on",
    "going forward",
)
FRICTION_CUES = (
    "come on",
    "can't you just",
    "cant you just",
    "why did you",
    "i already told you",
    "not what i asked",
)
ERROR_MARKERS = (
    "traceback (most recent call last)",
    "fatal:",
    "command not found",
    "permission denied",
    "non-zero exit",
    "segmentation fault",
    "unhandled exception",
)
TRIAGE_MARKERS = {
    "correction": ("not what i asked", "that's wrong", "instead", "do not", "never"),
    "preference": ("prefer", "always", "default to", "i want you to", "make sure"),
    "friction": FRICTION_CUES,
    "skill": ("skill", "skill.md", "plugin"),
    "instructions": ("agents.md", "claude.md", "instruction", "rule"),
    "tooling": ("script", "harness", "cli", "validation", "test", "verify"),
    "memory": ("memory", "remember", "forget"),
    "workflow": ("workflow", "handoff", "commit", "pull request", "review"),
}
NOISY_RE = re.compile(
    r"```|^#+\s|^[-+]{1,3}|^file:\s|^lines:\s|diff hunk|review findings",
    re.IGNORECASE,
)
COMMON_WORDS = {
    "about", "after", "again", "also", "because", "could", "doing", "have",
    "instead", "please", "should", "that", "their", "there", "these", "thing",
    "things", "this", "those", "using", "want", "would", "your",
}
STRICT_SKILL_RE = re.compile(
    r"(?:launching|invoking|loaded)\s+skill[:\s]+[`\"']?([a-z][a-z0-9-]+)",
    re.IGNORECASE,
)
PATH_KEYS = {
    "file", "files", "file_path", "file_paths", "filename", "notebook_path",
    "path", "paths", "source_path", "target_path", "workdir", "cwd",
}
COMMAND_KEYS = {"cmd", "command"}
PATH_TOKEN_RE = re.compile(
    r"(?<![\w])((?:~|/|\./|\.\./)[^\s\"'`<>|;]+|"
    r"(?:[A-Za-z0-9_.@+-]+/)+[A-Za-z0-9_.@+-]+)"
)
EMBEDDED_FIELD_RE = re.compile(
    r'"(?P<key>cmd|command|workdir|cwd|file_path|path)"\s*:\s*'
    r'(?P<value>"(?:\\.|[^"\\])*")'
)
STRENGTH_ORDER = {"weak": 0, "medium": 1, "strong": 2}
PROPOSAL_BUCKETS = (
    "Skills",
    "New Skills",
    "Project Instructions",
    "Personal Instructions",
    "Memory Notes",
    "Repo Docs",
    "Scripts Or Harnesses",
    "Validation Checks",
    "Conflicts Or Deletions",
)


@dataclass(frozen=True)
class Thread:
    id: str
    platform: str
    title: str
    source: str
    cwd: str
    created_at: int
    updated_at: int
    archived: bool
    model: str
    transcript_path: Path


@dataclass(frozen=True)
class Message:
    role: str
    text: str
    transcript_path: Path


@dataclass(frozen=True)
class ToolCall:
    name: str
    arguments: dict[str, Any]
    transcript_path: Path


@dataclass(frozen=True)
class FileReference:
    original: str
    resolved: str
    operation: str
    confidence: str
    source: str
    exists: bool


@dataclass(frozen=True)
class Evidence:
    thread: Thread
    cluster: str
    kind: str
    explicit: bool


def utc(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def now_iso() -> str:
    return datetime.now(tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def shorten(value: str, width: int) -> str:
    value = " ".join((value or "").split())
    return value if len(value) <= width else value[: max(1, width - 1)] + "..."


def parse_timestamp(value: Any) -> int | None:
    if isinstance(value, (int, float)):
        return int(value / 1000) if value > 10_000_000_000 else int(value)
    if not isinstance(value, str) or not value:
        return None
    try:
        return int(datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp())
    except ValueError:
        return None


def iter_jsonl(path: Path) -> Iterable[dict[str, Any]]:
    try:
        handle = path.open("r", encoding="utf-8")
    except OSError as exc:
        raise RuntimeError(f"Cannot read {path}: {exc}") from exc
    with handle:
        for line_no, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError as exc:
                raise RuntimeError(f"Malformed JSONL at {path}:{line_no}: {exc}") from exc
            if isinstance(item, dict):
                yield item


def resolve_platform(requested: str) -> str:
    if requested != "auto":
        return requested
    configured = os.environ.get("SELF_IMPROVE_PLATFORM")
    if configured in {"codex", "claude"}:
        return configured
    if os.environ.get("CLAUDE_SESSION_ID") or os.environ.get("CLAUDECODE"):
        return "claude"
    codex_exists = (DEFAULT_CODEX_HOME / "state_5.sqlite").exists()
    claude_exists = (DEFAULT_CLAUDE_HOME / "projects").exists()
    if codex_exists:
        return "codex"
    if claude_exists:
        return "claude"
    raise RuntimeError("No Codex or Claude Code session store found; pass --platform explicitly")


def _thread_columns(conn: sqlite3.Connection) -> set[str]:
    return {str(row[1]) for row in conn.execute("PRAGMA table_info(threads)")}


def load_codex_threads(
    home: Path,
    *,
    limit: int,
    days: int | None = None,
    query: str | None = None,
    cwd: str | None = None,
    archived: str = "all",
) -> list[Thread]:
    db = home / "state_5.sqlite"
    if not db.exists():
        raise RuntimeError(f"Missing Codex thread index: {db}")
    try:
        conn = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
    except sqlite3.Error as exc:
        raise RuntimeError(f"Cannot open Codex thread index {db}: {exc}") from exc
    with conn:
        columns = _thread_columns(conn)
        required = {"id", "rollout_path", "created_at", "updated_at", "cwd", "title"}
        missing = sorted(required - columns)
        if missing:
            raise RuntimeError(f"Codex thread index is missing required columns: {', '.join(missing)}")

        where: list[str] = []
        params: list[Any] = []
        if archived in {"active", "archived"} and "archived" in columns:
            where.append("archived = ?")
            params.append(0 if archived == "active" else 1)
        if days:
            cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())
            where.append("updated_at >= ?")
            params.append(cutoff)
        if cwd:
            where.append("cwd LIKE ?")
            params.append(f"{cwd}%")
        if query:
            searchable = [name for name in ("title", "first_user_message", "preview") if name in columns]
            where.append("(" + " OR ".join(f"lower({name}) LIKE ?" for name in searchable) + ")")
            params.extend([f"%{query.lower()}%"] * len(searchable))

        select = [
            "id", "title",
            "source" if "source" in columns else "''",
            "cwd", "created_at", "updated_at",
            "archived" if "archived" in columns else "0",
            "coalesce(model, '')" if "model" in columns else "''",
            "rollout_path",
        ]
        sql = f"SELECT {', '.join(select)} FROM threads"
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " ORDER BY updated_at DESC, id DESC LIMIT ?"
        params.append(limit)
        try:
            rows = conn.execute(sql, params).fetchall()
        except sqlite3.Error as exc:
            raise RuntimeError(f"Cannot query Codex thread index {db}: {exc}") from exc

    return [
        Thread(
            id=str(row[0]),
            platform="codex",
            title=row[1] or "",
            source=row[2] or "codex",
            cwd=row[3] or "",
            created_at=int(row[4]),
            updated_at=int(row[5]),
            archived=bool(row[6]),
            model=row[7] or "",
            transcript_path=Path(row[8]).expanduser(),
        )
        for row in rows
    ]


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
            text = block.get("text")
            if isinstance(text, str):
                chunks.append(text)
    return "\n".join(chunks)


def _claude_metadata(path: Path) -> Thread:
    session_id = path.stem
    title = ""
    first_prompt = ""
    cwd = ""
    source = "claude-code"
    model = ""
    created: int | None = None
    updated: int | None = None
    for event in iter_jsonl(path):
        session_id = str(event.get("sessionId") or session_id)
        cwd = str(event.get("cwd") or cwd)
        source = str(event.get("entrypoint") or source)
        timestamp = parse_timestamp(event.get("timestamp"))
        if timestamp is not None:
            created = timestamp if created is None else min(created, timestamp)
            updated = timestamp if updated is None else max(updated, timestamp)
        kind = event.get("type")
        if kind == "ai-title" and event.get("aiTitle"):
            title = str(event["aiTitle"])
        elif kind == "last-prompt" and not title and event.get("lastPrompt"):
            title = str(event["lastPrompt"])
        elif kind == "user" and not first_prompt:
            first_prompt = _content_text((event.get("message") or {}).get("content"))
        elif kind == "assistant" and not model:
            model = str((event.get("message") or {}).get("model") or "")
    stat_time = int(path.stat().st_mtime)
    return Thread(
        id=session_id,
        platform="claude",
        title=title or shorten(first_prompt, 100) or session_id,
        source=source,
        cwd=cwd,
        created_at=created or stat_time,
        updated_at=updated or stat_time,
        archived=False,
        model=model,
        transcript_path=path,
    )


def load_claude_threads(
    home: Path,
    *,
    limit: int,
    days: int | None = None,
    query: str | None = None,
    cwd: str | None = None,
    archived: str = "all",
) -> list[Thread]:
    del archived
    projects = home / "projects"
    if not projects.exists():
        raise RuntimeError(f"Missing Claude Code projects directory: {projects}")
    cutoff = None
    if days:
        cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())
    paths = sorted(
        projects.glob("*/*.jsonl"), key=lambda path: path.stat().st_mtime, reverse=True
    )
    rows: list[Thread] = []
    for path in paths:
        if cutoff and int(path.stat().st_mtime) < cutoff:
            continue
        thread = _claude_metadata(path)
        if cutoff and thread.updated_at < cutoff:
            continue
        if cwd and not thread.cwd.startswith(cwd):
            continue
        if query and query.lower() not in f"{thread.title} {thread.cwd}".lower():
            continue
        rows.append(thread)
        if len(rows) >= limit:
            break
    return rows


def load_threads(
    platform: str,
    *,
    limit: int,
    days: int | None = None,
    query: str | None = None,
    cwd: str | None = None,
    archived: str = "all",
    codex_home: Path = DEFAULT_CODEX_HOME,
    claude_home: Path = DEFAULT_CLAUDE_HOME,
) -> list[Thread]:
    if platform == "codex":
        return load_codex_threads(
            codex_home, limit=limit, days=days, query=query, cwd=cwd, archived=archived
        )
    return load_claude_threads(
        claude_home, limit=limit, days=days, query=query, cwd=cwd, archived=archived
    )


def find_thread(platform: str, thread_id: str) -> Thread | None:
    rows = load_threads(platform, limit=10_000, archived="all")
    if thread_id == "latest":
        return rows[0] if rows else None
    exact = [thread for thread in rows if thread.id == thread_id]
    if exact:
        return exact[0]
    matches = [thread for thread in rows if thread.id.startswith(thread_id)]
    return matches[0] if matches else None


def transcript_paths(thread: Thread, include_subagents: bool) -> list[Path]:
    paths = [thread.transcript_path]
    if include_subagents and thread.platform == "claude":
        subagents = thread.transcript_path.with_suffix("") / "subagents"
        if subagents.is_dir():
            paths.extend(sorted(subagents.glob("*.jsonl")))
    return paths


def thread_messages(thread: Thread, *, include_subagents: bool = False) -> list[Message]:
    out: list[Message] = []
    for path in transcript_paths(thread, include_subagents):
        for event in iter_jsonl(path):
            if thread.platform == "codex":
                if event.get("type") != "event_msg":
                    continue
                payload = event.get("payload") or {}
                kind = payload.get("type")
                if kind not in {"user_message", "agent_message"}:
                    continue
                text = str(payload.get("message") or "").strip()
                role = "user" if kind == "user_message" else "assistant"
            else:
                kind = event.get("type")
                if kind not in {"user", "assistant"} or event.get("isMeta"):
                    continue
                text = _content_text((event.get("message") or {}).get("content")).strip()
                role = kind
            if text:
                out.append(Message(role=role, text=text, transcript_path=path))
    return out


def _json_arguments(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
        except json.JSONDecodeError:
            return {}
        return parsed if isinstance(parsed, dict) else {}
    return {}


def _embedded_arguments(value: Any) -> dict[str, Any]:
    if not isinstance(value, str):
        return {}
    out: dict[str, Any] = {}
    for match in EMBEDDED_FIELD_RE.finditer(value):
        try:
            out[match.group("key")] = json.loads(match.group("value"))
        except json.JSONDecodeError:
            continue
    return out


def thread_tool_calls(thread: Thread, *, include_subagents: bool = False) -> list[ToolCall]:
    out: list[ToolCall] = []
    for path in transcript_paths(thread, include_subagents):
        for event in iter_jsonl(path):
            if thread.platform == "codex":
                payload = event.get("payload") or {}
                kind = payload.get("type")
                if kind not in {"function_call", "custom_tool_call"}:
                    continue
                arguments = _json_arguments(payload.get("arguments"))
                if kind == "custom_tool_call":
                    arguments = _embedded_arguments(payload.get("input"))
                out.append(
                    ToolCall(
                        name=str(payload.get("name") or "unknown"),
                        arguments=arguments,
                        transcript_path=path,
                    )
                )
            elif event.get("type") == "assistant":
                content = (event.get("message") or {}).get("content")
                if not isinstance(content, list):
                    continue
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "tool_use":
                        out.append(
                            ToolCall(
                                name=str(block.get("name") or "unknown"),
                                arguments=_json_arguments(block.get("input")),
                                transcript_path=path,
                            )
                        )
    return out


def tool_operation(name: str) -> str:
    lowered = name.lower()
    if "write" in lowered or "create" in lowered:
        return "write"
    if "edit" in lowered or "patch" in lowered:
        return "edit"
    if "read" in lowered or "open" in lowered:
        return "read"
    if "grep" in lowered or "glob" in lowered or "find" in lowered or "search" in lowered:
        return "search"
    if lowered in {"bash", "exec", "exec_command"}:
        return "command"
    return "reference"


def _walk_arguments(value: Any, key: str = "") -> Iterable[tuple[str, str]]:
    if isinstance(value, dict):
        for child_key, child in value.items():
            yield from _walk_arguments(child, str(child_key))
    elif isinstance(value, list):
        for child in value:
            yield from _walk_arguments(child, key)
    elif isinstance(value, str):
        yield key, value


def _clean_path(value: str) -> str:
    return value.strip().strip("\"'`[]{}(),:;")


def looks_like_path(value: str) -> bool:
    value = _clean_path(value)
    if not value or value.startswith(("http://", "https://", "data:")):
        return False
    if value.startswith(("/", "~/", "./", "../")):
        return True
    return "/" in value or bool(Path(value).suffix)


def resolve_file(value: str, cwd: str) -> tuple[str, str] | None:
    original = _clean_path(value)
    if not looks_like_path(original):
        return None
    path = Path(original).expanduser()
    if not path.is_absolute():
        path = Path(cwd or Path.cwd()) / path
    try:
        resolved = str(path.resolve(strict=False))
    except OSError:
        resolved = str(path)
    return original, resolved


def _path_tokens(text: str) -> Iterable[str]:
    try:
        tokens = shlex.split(text, posix=True)
    except ValueError:
        tokens = text.split()
    for token in tokens:
        candidate = _clean_path(token.lstrip("><"))
        if plausible_command_path(candidate):
            yield candidate


def _mention_path_tokens(text: str) -> Iterable[str]:
    for match in PATH_TOKEN_RE.finditer(text):
        candidate = _clean_path(match.group(1))
        if plausible_command_path(candidate):
            yield candidate


def plausible_command_path(value: str) -> bool:
    if not looks_like_path(value):
        return False
    if value in {"/", "//", "/*", "/dev/null"}:
        return False
    if any(char.isspace() for char in value):
        return False
    if value.startswith("!") or any(char in value for char in "\\[]{}()=$*?><!"):
        return False
    if value.startswith("/"):
        if Path(value).exists() or Path(value).suffix:
            return True
        return value.count("/") >= 2
    return "/" in value


def extract_file_references(
    thread: Thread,
    *,
    include_subagents: bool = False,
    include_mentions: bool = True,
) -> list[FileReference]:
    ranked: dict[str, FileReference] = {}
    confidence_rank = {"mention": 0, "command": 1, "structured": 2}

    def add(value: str, operation: str, confidence: str, source: str) -> None:
        resolved_pair = resolve_file(value, thread.cwd)
        if resolved_pair is None:
            return
        original, resolved = resolved_pair
        item = FileReference(
            original=original,
            resolved=resolved,
            operation=operation,
            confidence=confidence,
            source=source,
            exists=Path(resolved).exists(),
        )
        previous = ranked.get(resolved)
        if previous is None or confidence_rank[confidence] > confidence_rank[previous.confidence]:
            ranked[resolved] = item

    for call in thread_tool_calls(thread, include_subagents=include_subagents):
        operation = tool_operation(call.name)
        for key, value in _walk_arguments(call.arguments):
            lowered = key.lower()
            if lowered in PATH_KEYS or lowered.endswith("_path"):
                add(value, operation, "structured", f"tool:{call.name}")
            elif lowered in COMMAND_KEYS:
                for token in _path_tokens(value):
                    add(token, "command", "command", f"tool:{call.name}")

    for path in transcript_paths(thread, include_subagents):
        if thread.platform != "claude":
            continue
        for event in iter_jsonl(path):
            if event.get("type") != "attachment":
                continue
            for key, value in _walk_arguments(event.get("attachment") or {}):
                if key.lower() in PATH_KEYS or key.lower().endswith("_path"):
                    add(value, "reference", "structured", "attachment")

    if include_mentions:
        for message in thread_messages(thread, include_subagents=include_subagents):
            for token in _mention_path_tokens(message.text):
                add(token, "mention", "mention", f"message:{message.role}")

    return sorted(
        ranked.values(),
        key=lambda item: (-confidence_rank[item.confidence], item.resolved.lower()),
    )


def thread_error_count(thread: Thread) -> int:
    count = 0
    for event in iter_jsonl(thread.transcript_path):
        text = ""
        if thread.platform == "codex":
            payload = event.get("payload") or {}
            if payload.get("type") == "function_call_output":
                text = json.dumps(payload.get("output") or "")[:4000]
        elif event.get("type") == "user":
            content = (event.get("message") or {}).get("content")
            if isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "tool_result":
                        if block.get("is_error"):
                            count += 1
                        text += json.dumps(block.get("content") or "")[:4000]
        lowered = text.lower()
        if any(marker in lowered for marker in ERROR_MARKERS):
            count += 1
    return count


def triage_thread(thread: Thread) -> dict[str, Any]:
    text = "\n".join(message.text for message in thread_messages(thread))[:100_000].lower()
    reasons: list[str] = []
    score = 0
    for reason, markers in TRIAGE_MARKERS.items():
        hits = sum(1 for marker in markers if marker in text)
        if hits:
            reasons.append(reason)
            score += min(3, hits)
    errors = thread_error_count(thread)
    if errors:
        reasons.append("tool-error")
        score += min(3, errors)
    if thread.cwd and str(Path.cwd()) in thread.cwd:
        reasons.append("current-repo")
        score += 2
    return {"thread": thread, "score": score, "reasons": sorted(set(reasons))}


def split_sentences(message: str) -> Iterable[str]:
    normalized = re.sub(r"\s+", " ", message).strip()
    for chunk in re.split(r"(?<=[.!?])\s+|;\s+|\s+\|\s+", normalized):
        chunk = chunk.strip(" \t\r\n\"'`")
        if chunk:
            yield chunk


def sentence_kind(sentence: str) -> str | None:
    lowered = sentence.lower()
    if len(sentence) < 14 or len(sentence) > 600 or NOISY_RE.search(sentence):
        return None
    if sentence.endswith("?") and not any(token in lowered for token in ("prefer", "make sure", "default")):
        return None
    if any(marker in lowered for marker in CORRECTION_MARKERS):
        return "correction"
    if any(marker in lowered for marker in PREFERENCE_MARKERS):
        return "preference"
    return None


def normalize_suggestion(sentence: str) -> str:
    value = sentence.strip()
    value = re.sub(r"^(okay|ok|yeah|and then)[, ]+", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^(can you|could you)\s+(please\s+)?", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^make sure\s+(that\s+)?", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^i want you to\s+", "", value, flags=re.IGNORECASE)
    value = re.sub(r"\s+", " ", value).strip(" .!?")
    if not value:
        return ""
    return value[0].upper() + value[1:] + ("" if value.endswith(".") else ".")


def token_key(value: str) -> str:
    tokens = [
        token for token in re.findall(r"[a-z0-9]+", value.lower())
        if token not in COMMON_WORDS
    ]
    return "-".join(tokens[:12])


def thread_cluster(thread: Thread) -> str:
    return f"{thread.platform}::{token_key(thread.cwd)}::{token_key(thread.title)}"


def project_instruction_target(thread: Thread) -> str:
    start = Path(thread.cwd or Path.cwd()).expanduser()
    candidates = [start, *start.parents]
    for directory in candidates:
        if thread.platform == "codex":
            for name in ("AGENTS.override.md", "AGENTS.md"):
                if (directory / name).exists():
                    return str(directory / name)
        elif (directory / "CLAUDE.md").exists():
            return str(directory / "CLAUDE.md")
        if (directory / ".git").exists():
            return str(directory / ("AGENTS.md" if thread.platform == "codex" else "CLAUDE.md"))
    return str(start / ("AGENTS.md" if thread.platform == "codex" else "CLAUDE.md"))


def classify(sentence: str, thread: Thread) -> tuple[str, str]:
    lowered = sentence.lower()
    if any(token in lowered for token in ("agents.md", "claude.md", "instruction file", "agent rule")):
        return "Project Instructions", project_instruction_target(thread)
    if "new skill" in lowered or "create skill" in lowered:
        return "New Skills", "<new-skill>/SKILL.md"
    if "skill" in lowered or "skill.md" in lowered or "/skills/" in lowered:
        return "Skills", "<owning-skill>/SKILL.md"
    if any(token in lowered for token in ("memory", "remember", "forget")):
        if thread.platform == "codex":
            target = str(DEFAULT_CODEX_HOME / "memories" / "MEMORY.md")
        else:
            target = str(thread.transcript_path.parent / "memory" / "MEMORY.md")
        return "Memory Notes", target
    if any(token in lowered for token in ("script", "harness", "tool", "cli")):
        return "Scripts Or Harnesses", str(Path(thread.cwd or Path.cwd()) / "<script-or-harness>")
    if any(token in lowered for token in ("validation", "test", "verify", "check")):
        return "Validation Checks", str(Path(thread.cwd or Path.cwd()) / "<validation>")
    if any(token in lowered for token in ("readme", "docs", "document", "runbook", "roadmap", ".md")):
        return "Repo Docs", str(Path(thread.cwd or Path.cwd()) / "<doc>")
    if any(token in lowered for token in ("conflict", "contradict", "delete", "remove")):
        return "Conflicts Or Deletions", "<resolve-or-delete-guidance>"
    if any(token in lowered for token in ("globally", "all repos", "across repos", "for any repo")):
        name = "AGENTS.md" if thread.platform == "codex" else "CLAUDE.md"
        home = DEFAULT_CODEX_HOME if thread.platform == "codex" else DEFAULT_CLAUDE_HOME
        return "Personal Instructions", str(home / name)
    return "Project Instructions", project_instruction_target(thread)


def strength_label(evidence: list[Evidence]) -> str:
    support = len({item.cluster for item in evidence})
    explicit = any(item.explicit for item in evidence)
    spread = len({item.thread.cwd for item in evidence if item.thread.cwd}) >= 2
    correction = any(item.kind == "correction" for item in evidence)
    score = (2 if support >= 3 else 1 if support == 2 else 0)
    score += int(explicit) + int(spread) + int(correction)
    if score >= 3:
        return "strong"
    if score == 2:
        return "medium"
    return "weak"


def proposal_key(bucket: str, target: str, suggestion: str) -> str:
    value = f"{bucket}|{target}|{suggestion}".encode("utf-8")
    return hashlib.sha1(value).hexdigest()[:12]


def decision_path(platform: str) -> Path:
    home = DEFAULT_CODEX_HOME if platform == "codex" else DEFAULT_CLAUDE_HOME
    return home / "self_improve_decisions.json"


def load_decisions(platform: str) -> dict[str, dict[str, Any]]:
    path = decision_path(platform)
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    return data.get("decided", {}) if isinstance(data, dict) else {}


def save_decisions(platform: str, decided: dict[str, dict[str, Any]]) -> None:
    path = decision_path(platform)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"decided": decided}, indent=2, sort_keys=True), encoding="utf-8")


def collect_proposals(
    rows: list[Thread],
    *,
    min_support: int,
    min_strength: str,
    target_filter: str,
    decided: dict[str, dict[str, Any]],
    include_decided: bool,
) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str, str], list[Evidence]] = defaultdict(list)
    for thread in rows:
        for message in thread_messages(thread):
            if message.role != "user" or len(message.text) > 5000:
                continue
            for sentence in split_sentences(message.text):
                kind = sentence_kind(sentence)
                if kind is None:
                    continue
                suggestion = normalize_suggestion(sentence)
                if len(suggestion) < 25:
                    continue
                bucket, target = classify(sentence, thread)
                grouped[(bucket, target, suggestion)].append(
                    Evidence(
                        thread=thread,
                        cluster=thread_cluster(thread),
                        kind=kind,
                        explicit=any(marker in sentence.lower() for marker in EXPLICIT_MARKERS),
                    )
                )

    allowed = {
        "all": set(PROPOSAL_BUCKETS),
        "skills": {"Skills", "New Skills"},
        "instructions": {"Project Instructions", "Personal Instructions"},
        "memory": {"Memory Notes"},
    }[target_filter]
    proposals: list[dict[str, Any]] = []
    for (bucket, target, suggestion), evidence in grouped.items():
        if bucket not in allowed:
            continue
        by_thread: dict[str, Evidence] = {}
        for item in evidence:
            previous = by_thread.get(item.thread.id)
            if previous is None or (item.kind == "correction" and previous.kind != "correction"):
                by_thread[item.thread.id] = item
            elif item.explicit and not previous.explicit:
                by_thread[item.thread.id] = Evidence(
                    thread=previous.thread,
                    cluster=previous.cluster,
                    kind=previous.kind,
                    explicit=True,
                )
        evidence = list(by_thread.values())
        support = len({item.cluster for item in evidence})
        strength = strength_label(evidence)
        if support < min_support or STRENGTH_ORDER[strength] < STRENGTH_ORDER[min_strength]:
            continue
        key = proposal_key(bucket, target, suggestion)
        decision = decided.get(key, {}).get("decision")
        if decision in {"rejected", "applied"} and not include_decided:
            continue
        proposals.append(
            {
                "key": key,
                "bucket": bucket,
                "target": target,
                "suggestion": suggestion,
                "support": support,
                "strength": strength,
                "kind": "correction" if any(item.kind == "correction" for item in evidence) else "preference",
                "decision": decision,
                "evidence": evidence,
            }
        )
    return sorted(
        proposals,
        key=lambda item: (-STRENGTH_ORDER[item["strength"]], -item["support"], item["bucket"]),
    )


def strict_skill_signals(rows: list[Thread]) -> Counter[str]:
    counts: Counter[str] = Counter()
    for thread in rows:
        seen: set[str] = set()
        for call in thread_tool_calls(thread):
            if call.name.lower() == "skill" and isinstance(call.arguments.get("skill"), str):
                seen.add(call.arguments["skill"].lower())
        for message in thread_messages(thread):
            for name in STRICT_SKILL_RE.findall(message.text):
                seen.add(name.lower())
        counts.update(seen)
    return counts


def cmd_inventory(args: argparse.Namespace) -> None:
    platform = args.platform
    print(f"## Self-Improve Sources ({platform})\n")
    if platform == "codex":
        home = DEFAULT_CODEX_HOME
        db = home / "state_5.sqlite"
        count = "missing"
        if db.exists():
            try:
                with sqlite3.connect(f"file:{db}?mode=ro", uri=True) as conn:
                    count = str(conn.execute("SELECT count(*) FROM threads").fetchone()[0])
            except sqlite3.Error:
                count = "unreadable"
        print(f"- Thread index: `{db}` ({count} threads)")
        print(f"- Memories: `{home / 'memories'}` ({'present' if (home / 'memories').exists() else 'missing'})")
        print(f"- Personal instructions: `{home / 'AGENTS.md'}`")
    else:
        home = DEFAULT_CLAUDE_HOME
        projects = home / "projects"
        primary = len(list(projects.glob("*/*.jsonl"))) if projects.exists() else 0
        subagents = len(list(projects.glob("*/*/subagents/*.jsonl"))) if projects.exists() else 0
        memories = len(list(projects.glob("*/memory/*.md"))) if projects.exists() else 0
        print(f"- Session transcripts: `{projects}` ({primary} primary, {subagents} subagent)")
        print(f"- Prompt history: `{home / 'history.jsonl'}` ({'present' if (home / 'history.jsonl').exists() else 'missing'})")
        print(f"- Auto-memory: `{projects / '<project>' / 'memory'}` ({memories} files)")
        print(f"- Personal instructions: `{home / 'CLAUDE.md'}`")
    print(f"- Decision log: `{decision_path(platform)}` ({len(load_decisions(platform))} decisions)")
    print(f"- Source skills: `{SOURCE_SKILLS_ROOT}`")


def cmd_triage(args: argparse.Namespace) -> None:
    rows = load_threads(
        args.platform,
        limit=args.limit,
        days=args.days,
        query=args.query,
        cwd=args.cwd,
        archived=args.archived,
    )
    ranked = [item for item in (triage_thread(thread) for thread in rows) if item["score"] >= args.min_score]
    ranked.sort(key=lambda item: (-item["score"], -item["thread"].updated_at))
    print("Score Updated UTC         Reasons                         CWD                              Title                            Thread")
    print("----- ------------------- ------------------------------- -------------------------------- -------------------------------- ------------------------------------")
    for item in ranked[: args.top]:
        thread = item["thread"]
        print(
            f"{item['score']:<5} {utc(thread.updated_at):<19} "
            f"{shorten(','.join(item['reasons']), 31):<31} {shorten(thread.cwd, 32):<32} "
            f"{shorten(thread.title, 32):<32} {thread.id}"
        )


def _print_files(thread: Thread, args: argparse.Namespace) -> None:
    refs = extract_file_references(
        thread,
        include_subagents=args.include_subagents,
        include_mentions=args.include_mentions,
    )
    print("## Referenced Files\n")
    if not refs:
        print("No file references detected.")
        return
    for ref in refs[: args.max_files]:
        state = "exists" if ref.exists else "missing"
        original = f" (from `{ref.original}`)" if ref.original != ref.resolved else ""
        print(
            f"- [{ref.confidence}] {ref.operation}: `{ref.resolved}`{original} — "
            f"{state}; {ref.source}"
        )
    if len(refs) > args.max_files:
        print(f"\n... {len(refs) - args.max_files} more reference(s) omitted ...")


def cmd_show(args: argparse.Namespace) -> None:
    thread = find_thread(args.platform, args.thread_id)
    if thread is None:
        raise RuntimeError(f"No {args.platform} thread found for {args.thread_id}")
    print(f"# {thread.title or thread.id}\n")
    print(f"- platform: `{thread.platform}`")
    print(f"- thread_id: `{thread.id}`")
    print(f"- updated_at: `{utc(thread.updated_at)}`")
    print(f"- cwd: `{thread.cwd}`")
    print(f"- transcript: `{thread.transcript_path}`\n")
    for message in thread_messages(thread, include_subagents=args.include_subagents):
        label = "User" if message.role == "user" else "Assistant"
        suffix = " (subagent)" if message.transcript_path != thread.transcript_path else ""
        text = message.text[: args.max_chars]
        print(f"## {label}{suffix}\n\n{text}")
        if len(message.text) > args.max_chars:
            print("\n... truncated ...")
        print()
    _print_files(thread, args)


def cmd_files(args: argparse.Namespace) -> None:
    thread = find_thread(args.platform, args.thread_id)
    if thread is None:
        raise RuntimeError(f"No {args.platform} thread found for {args.thread_id}")
    print(f"# Files for {thread.title or thread.id}\n")
    _print_files(thread, args)


def cmd_review(args: argparse.Namespace) -> None:
    rows = load_threads(
        args.platform,
        limit=args.limit,
        days=args.days,
        query=args.query,
        cwd=args.cwd,
        archived=args.archived,
    )
    decided = load_decisions(args.platform)
    proposals = collect_proposals(
        rows,
        min_support=args.min_support,
        min_strength=args.min_strength,
        target_filter=args.target,
        decided=decided,
        include_decided=args.include_decided,
    )
    print(f"# Self-Improve Review ({args.platform})\n")
    print(f"- Sessions scanned: {len(rows)}")
    print(f"- Target: {args.target}")
    print(f"- Minimum support: {args.min_support}; strength: {args.min_strength}\n")
    if not proposals:
        print("No proposals met the support and strength thresholds.")
    for item in proposals[: args.max_proposals]:
        decision = f"; decision: {item['decision']}" if item["decision"] else ""
        print(f"## {item['bucket']} (`{item['key']}`)\n")
        print(f"- Target: `{item['target']}`")
        print(f"- Change: {item['suggestion']}")
        print(f"- Kind: {item['kind']}")
        print(f"- Support: {item['support']}; strength: {item['strength']}{decision}")
        print("- Evidence:")
        for evidence in item["evidence"][:5]:
            refs = extract_file_references(evidence.thread, include_mentions=False)[:4]
            files = ", ".join(f"`{ref.resolved}`" for ref in refs)
            file_note = f"; files {files}" if files else ""
            print(
                f"  - `{evidence.thread.id}` updated {utc(evidence.thread.updated_at)} "
                f"in `{evidence.thread.cwd}`{file_note}"
            )
        print("- Approval needed: yes\n")

    signals = strict_skill_signals(rows)
    print("## Structured Skill Signals\n")
    if signals:
        for name, count in signals.most_common():
            print(f"- `{name}`: {count} thread(s)")
    else:
        print("No structured or explicit skill invocation signals detected.")
    print("\nMentions of skill names alone are not counted.")


def cmd_decide(args: argparse.Namespace) -> None:
    decided = load_decisions(args.platform)
    if args.action == "status":
        if not decided:
            print("No recorded proposal decisions.")
            return
        print("## Recorded Proposal Decisions\n")
        for key, record in sorted(decided.items(), key=lambda item: item[1].get("at", "")):
            note = f" — {record['note']}" if record.get("note") else ""
            print(f"- `{key}` {record.get('decision', '?')} at {record.get('at', '?')}{note}")
        return
    if not args.key:
        raise RuntimeError("accept/reject/apply require a proposal key")
    decided[args.key] = {
        "decision": {"accept": "accepted", "reject": "rejected", "apply": "applied"}[args.action],
        "at": now_iso(),
        "note": args.note or "",
    }
    save_decisions(args.platform, decided)
    print(f"Recorded `{args.key}` as {decided[args.key]['decision']}.")


def add_thread_options(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--limit", type=int, default=250)
    parser.add_argument("--days", type=int)
    parser.add_argument("--query")
    parser.add_argument("--cwd")
    parser.add_argument("--archived", choices=("active", "archived", "all"), default="all")


def add_file_options(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--include-subagents", action="store_true")
    parser.add_argument("--include-mentions", action="store_true")
    parser.add_argument("--max-files", type=int, default=100)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Mine Codex or Claude Code sessions for durable improvement proposals."
    )
    parser.add_argument("--platform", choices=("auto", "codex", "claude"), default="auto")
    sub = parser.add_subparsers(dest="cmd", required=True)

    inventory = sub.add_parser("inventory", help="Show available session and memory sources")
    inventory.set_defaults(func=cmd_inventory)

    triage = sub.add_parser("triage", help="Rank sessions likely to contain improvement evidence")
    add_thread_options(triage)
    triage.set_defaults(days=30)
    triage.add_argument("--top", type=int, default=25)
    triage.add_argument("--min-score", type=int, default=2)
    triage.set_defaults(func=cmd_triage)

    show = sub.add_parser("show", help="Render a session and its file references")
    show.add_argument("thread_id", help="exact id, id prefix, or 'latest'")
    show.add_argument("--max-chars", type=int, default=6000)
    add_file_options(show)
    show.set_defaults(func=cmd_show)

    files = sub.add_parser("files", help="Extract structured, command, and mentioned file paths")
    files.add_argument("thread_id", help="exact id, id prefix, or 'latest'")
    add_file_options(files)
    files.set_defaults(func=cmd_files)

    review = sub.add_parser("review", help="Surface evidence-backed improvement proposals")
    add_thread_options(review)
    review.set_defaults(days=365)
    review.add_argument("--target", choices=("all", "skills", "instructions", "memory"), default="all")
    review.add_argument("--min-support", type=int, default=2)
    review.add_argument("--min-strength", choices=("weak", "medium", "strong"), default="medium")
    review.add_argument("--max-proposals", type=int, default=3)
    review.add_argument("--include-decided", action="store_true")
    review.set_defaults(func=cmd_review)

    decide = sub.add_parser("decide", help="Record a proposal decision")
    decide.add_argument("action", choices=("accept", "reject", "apply", "status"))
    decide.add_argument("key", nargs="?")
    decide.add_argument("--note")
    decide.set_defaults(func=cmd_decide)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    try:
        args.platform = resolve_platform(args.platform)
        args.func(args)
    except RuntimeError as exc:
        raise SystemExit(f"Error: {exc}") from exc


if __name__ == "__main__":
    main()
