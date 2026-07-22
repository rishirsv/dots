"""Shared normalization and redaction for local Codex rollout JSONL files."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterator


SENSITIVE_RE = re.compile(
    r"(api[_-]?key|authorization|bearer\s+[a-z0-9._-]+|password|private[_-]?key|"
    r"secret|access[_-]?token|refresh[_-]?token|id[_-]?token|gh[pousr]_[a-z0-9_]+)",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class SessionEvent:
    timestamp: str
    kind: str
    role: str = ""
    text: str = ""
    payload: dict[str, Any] | None = None


def redact_sensitive(text: str) -> str:
    """Replace any line containing a credential-like marker."""
    lines: list[str] = []
    for line in str(text or "").splitlines():
        lines.append("[redacted sensitive line]" if SENSITIVE_RE.search(line) else line)
    return "\n".join(lines)


def text_from_content(content: Any) -> str:
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    chunks: list[str] = []
    for item in content:
        if not isinstance(item, dict):
            continue
        if item.get("type") in {"input_text", "output_text", "text"}:
            chunks.append(str(item.get("text") or ""))
    return "\n".join(chunk for chunk in chunks if chunk)


def iter_session_events(path: Path, *, strict: bool = False) -> Iterator[SessionEvent]:
    """Yield one normalized stream from current and legacy Codex rollouts."""
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line_no, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                if strict:
                    raise ValueError(f"Bad JSON in {path}:{line_no}: {exc}") from exc
                continue

            timestamp = str(record.get("timestamp") or "")
            record_type = record.get("type")
            payload = record.get("payload") or {}
            if not isinstance(payload, dict):
                continue

            if record_type == "session_meta":
                yield SessionEvent(timestamp, "session_meta", payload=payload)
                continue

            if record_type == "response_item":
                payload_type = payload.get("type")
                if payload_type == "message":
                    role = str(payload.get("role") or "message")
                    text = text_from_content(payload.get("content"))
                    if text:
                        yield SessionEvent(timestamp, "message", role, text, payload)
                elif payload_type in {"function_call", "function_call_output"}:
                    yield SessionEvent(timestamp, str(payload_type), payload=payload)
                continue

            if record_type != "event_msg":
                continue
            payload_type = payload.get("type")
            if payload_type in {"user_message", "agent_message"}:
                role = "user" if payload_type == "user_message" else "assistant"
                text = str(payload.get("message") or "")
                if text:
                    yield SessionEvent(timestamp, "message", role, text, payload)
            elif payload_type in {"function_call", "function_call_output"}:
                yield SessionEvent(timestamp, str(payload_type), payload=payload)
