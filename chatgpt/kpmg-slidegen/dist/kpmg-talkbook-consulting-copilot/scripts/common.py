#!/usr/bin/env python3
"""Shared utilities for the Talkbook consulting copilot skill."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Tuple


def utc_now_iso() -> str:
    """Return a UTC timestamp in ISO-8601 format without microseconds."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def skill_root() -> Path:
    """Return the absolute path to the skill root directory."""
    return Path(__file__).resolve().parents[1]


def sessions_root() -> Path:
    """Return the absolute path to the sessions directory."""
    return skill_root() / "sessions"


def ensure_dir(path: Path) -> Path:
    """Create a directory if it does not exist and return it."""
    path.mkdir(parents=True, exist_ok=True)
    return path


def slugify(value: str) -> str:
    """Normalize free text to a stable slug value."""
    text = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower())
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "section"


def make_session_id(topic: str) -> str:
    """Create a timestamped session identifier from a topic string."""
    return f"{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}-{slugify(topic)[:32]}"


def read_json(path: Path) -> Dict[str, Any]:
    """Read JSON from disk and return a dictionary."""
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Dict[str, Any]) -> None:
    """Write JSON to disk with stable formatting."""
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def session_dir(session_id: str) -> Path:
    """Return an absolute session directory path and validate the identifier."""
    if not re.match(r"^[a-zA-Z0-9_-]+$", session_id):
        raise ValueError("session_id must match ^[a-zA-Z0-9_-]+$")
    return sessions_root() / session_id


def session_paths(session_id: str) -> Dict[str, Path]:
    """Return all canonical file paths used by a session."""
    base = session_dir(session_id)
    return {
        "base": base,
        "session": base / "session.json",
        "draft": base / "working-draft.md",
        "sources": base / "sources.json",
        "deck": base / "deck.json",
        "outputs": base / "outputs",
    }


def load_session(session_id: str) -> Dict[str, Any]:
    """Load a session file from disk and return its dictionary representation."""
    path = session_paths(session_id)["session"]
    if not path.exists():
        raise FileNotFoundError(f"Session not found: {path}")
    return read_json(path)


def save_session(session: Dict[str, Any]) -> Dict[str, Path]:
    """Persist session and companion files to disk and return written paths."""
    sid = str(session["session_id"])
    paths = session_paths(sid)
    ensure_dir(paths["base"])
    ensure_dir(paths["outputs"])

    session["updated_at"] = utc_now_iso()
    write_json(paths["session"], session)

    sources = session.get("sources")
    if isinstance(sources, list):
        write_json(paths["sources"], {"session_id": sid, "sources": sources})

    draft = render_working_draft(session)
    paths["draft"].write_text(draft, encoding="utf-8")
    return paths


def ordered_sections(session: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Return sections sorted by explicit order then insertion order."""
    raw = session.get("sections") or []
    if not isinstance(raw, list):
        return []
    return sorted(raw, key=lambda s: int(s.get("order", 10_000)))


def render_working_draft(session: Dict[str, Any]) -> str:
    """Render a markdown working draft from session sections."""
    lines: List[str] = []
    lines.append(f"# {session.get('deck', {}).get('title', session.get('topic', 'Deck Draft'))}")
    lines.append("")
    lines.append(f"Session ID: `{session.get('session_id', '')}`")
    lines.append(f"Updated: `{session.get('updated_at', '')}`")
    lines.append("")

    for idx, section in enumerate(ordered_sections(session), start=1):
        title = section.get("title") or f"Section {idx}"
        intent = section.get("intent") or "general"
        layout = section.get("layout_slug") or "auto"
        variant = section.get("variant") or "auto"
        status = section.get("status") or "draft"
        content = section.get("content") or ""
        content = str(content).strip() or "(content pending)"

        lines.append(f"## {idx}. {title}")
        lines.append(f"- Section ID: `{section.get('id', '')}`")
        lines.append(f"- Intent: `{intent}`")
        lines.append(f"- Layout: `{layout}`")
        lines.append(f"- Variant: `{variant}`")
        lines.append(f"- Status: `{status}`")
        lines.append("")
        lines.append(content)
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def load_mapping_from_markdown(path: Path) -> Dict[str, Any]:
    """Load the first fenced JSON block from a markdown mapping file."""
    text = path.read_text(encoding="utf-8")
    match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if not match:
        raise ValueError(f"No fenced JSON block found in: {path}")
    try:
        payload = json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON block in {path}: {exc}") from exc
    if not isinstance(payload, dict):
        raise ValueError("Mapping JSON block must be an object")
    return payload


def parse_bullets(content: str) -> List[str]:
    """Extract bullet-like lines from markdown/plain text content."""
    bullets: List[str] = []
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith(("- ", "* ")):
            bullets.append(stripped[2:].strip())
            continue
        if re.match(r"^\d+\.\s+", stripped):
            bullets.append(re.sub(r"^\d+\.\s+", "", stripped))
    return bullets


def split_table_rows(content: str) -> List[List[str]]:
    """Parse markdown table rows into a 2D string array."""
    rows: List[List[str]] = []
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped.startswith("|") or stripped.count("|") < 2:
            continue
        cells = [cell.strip() for cell in stripped.strip("|").split("|")]
        if cells and not all(re.match(r"^-+$", c.replace(":", "").strip()) for c in cells):
            rows.append(cells)
    return rows


def split_chart_points(content: str) -> List[Dict[str, Any]]:
    """Parse simple `label: value` chart lines from content."""
    points: List[Dict[str, Any]] = []
    for line in content.splitlines():
        stripped = line.strip().lstrip("- ").strip()
        match = re.match(r"^([^:]+):\s*(-?\d+(?:\.\d+)?)$", stripped)
        if not match:
            continue
        label = match.group(1).strip()
        value = float(match.group(2))
        points.append({"label": label, "value": value})
    return points


def infer_content_shape(content: str) -> str:
    """Infer a coarse content shape used for layout selection."""
    table = split_table_rows(content)
    chart = split_chart_points(content)
    bullets = parse_bullets(content)
    lowered = content.lower()

    if table:
        return "table"
    if len(chart) >= 3:
        return "chart"
    if any(token in lowered for token in ("process", "step", "workflow", "phase")):
        return "process"
    if any(token in lowered for token in ("vs", "versus", "comparison", "trade-off", "tradeoff")):
        return "comparison"
    if len(bullets) >= 4:
        return "dense-bullets"
    if bullets:
        return "bullets"
    return "narrative"


def split_left_right(items: List[str]) -> Tuple[List[str], List[str]]:
    """Split a list into left/right halves for two-column layouts."""
    if not items:
        return [], []
    pivot = (len(items) + 1) // 2
    return items[:pivot], items[pivot:]
