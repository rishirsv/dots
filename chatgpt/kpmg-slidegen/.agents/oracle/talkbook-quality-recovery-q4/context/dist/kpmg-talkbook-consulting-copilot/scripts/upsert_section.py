#!/usr/bin/env python3
"""Insert or update a section in a Talkbook co-writing session."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from common import (
    DEPTH_PROFILES,
    load_session,
    ordered_sections,
    parse_bullets,
    save_session,
    slugify,
    utc_now_iso,
)


def _read_content(args: argparse.Namespace) -> str:
    """Read content from inline text or a file path."""
    if args.content_file:
        return Path(args.content_file).read_text(encoding="utf-8")
    return (args.content or "").strip()


def _read_payload(args: argparse.Namespace) -> Dict[str, Any]:
    """Read an optional authoring payload from a JSON file."""
    if not args.payload_file:
        return {}
    payload = json.loads(Path(args.payload_file).read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise SystemExit("payload-file must contain a JSON object.")
    payload.setdefault("headline_claim", "")
    payload.setdefault("claims", [])
    payload.setdefault("evidence_objects", [])
    payload.setdefault("implications", [])
    payload.setdefault("decision_ask", "")
    payload.setdefault("source_anchors", [])
    return payload


def _next_order(sections: List[Dict[str, Any]]) -> int:
    """Return the next monotonically increasing section order value."""
    if not sections:
        return 10
    return max(int(section.get("order", 0)) for section in sections) + 10


def _normalize_sources(values: Optional[List[str]]) -> List[Dict[str, Any]]:
    """Normalize source tokens into structured source records."""
    if not values:
        return []
    out: List[Dict[str, Any]] = []
    for value in values:
        v = value.strip()
        if not v:
            continue
        out.append({"label": v, "url": v if v.startswith("http") else None})
    return out


def _coerce_slide_count(value: Optional[int], content: str) -> int:
    """Infer slide count when not explicitly supplied."""
    if value and value > 0:
        return value
    bullets = parse_bullets(content)
    if len(bullets) >= 9:
        return 2
    return 1


def _payload_to_content(payload: Dict[str, Any]) -> str:
    """Build fallback markdown content lines from payload when inline content is omitted."""
    if not payload:
        return ""

    lines: List[str] = []
    headline = str(payload.get("headline_claim") or "").strip()
    if headline:
        lines.append(headline)

    for claim in payload.get("claims") or []:
        text = str(claim).strip()
        if text:
            lines.append(f"- {text}")

    for implication in payload.get("implications") or []:
        text = str(implication).strip()
        if text:
            lines.append(f"- Strategic implication: {text}")

    decision_ask = str(payload.get("decision_ask") or "").strip()
    if decision_ask:
        lines.append(f"- Decision required: {decision_ask}")

    return "\n".join(lines).strip()


def _payload_source_records(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Normalize payload source anchors into source records."""
    out: List[Dict[str, Any]] = []
    for item in payload.get("source_anchors") or []:
        value = str(item).strip()
        if not value:
            continue
        out.append({"label": value, "url": value if value.startswith("http") else None})
    return out


def _assert_drafting_allowed(session: Dict[str, Any]) -> None:
    """Enforce outline approval gate in outline_confirm workflow."""
    workflow = session.get("workflow") or {}
    mode = str(workflow.get("mode") or "outline_confirm")
    stage = str(workflow.get("stage") or "intake")
    approval = workflow.get("outline_approval") or {}

    if mode != "outline_confirm":
        return

    if stage in {"outline_approved", "drafting", "compiled"}:
        return

    approved = str(approval.get("status") or "") == "approved"
    if approved:
        return

    raise SystemExit(
        "Drafting is blocked in outline_confirm mode until outline approval.\n"
        "Run approve_outline.py after outline review, then upsert sections."
    )


def parse_args() -> argparse.Namespace:
    """Parse CLI args for section updates."""
    parser = argparse.ArgumentParser(description="Create or update a section in a co-writing session.")
    parser.add_argument("--session-id", required=True)
    parser.add_argument("--section-id", default=None, help="Stable section id. Defaults to slug(title).")
    parser.add_argument("--title", required=True)
    parser.add_argument("--intent", required=True, help="Business intent label used for layout mapping.")
    parser.add_argument("--content", default=None, help="Inline markdown/plain section content.")
    parser.add_argument("--content-file", default=None, help="Path to markdown/plain text content.")
    parser.add_argument("--layout-slug", default=None, help="Optional forced layout slug without `layout.` prefix.")
    parser.add_argument("--archetype-id", default=None, help="Archetype id selected for this section.")
    parser.add_argument("--outline-section-id", default=None, help="Outline section id this draft section maps to.")
    parser.add_argument(
        "--depth-profile",
        default=None,
        choices=list(DEPTH_PROFILES),
        help="Section-level depth profile override.",
    )
    parser.add_argument("--payload-file", default=None, help="Path to authoring payload JSON file.")
    parser.add_argument(
        "--variant",
        choices=["auto", "white", "blue"],
        default="auto",
        help="Optional background variant override.",
    )
    parser.add_argument("--slides", type=int, default=None, help="Expected number of slides for this section.")
    parser.add_argument("--position", type=int, default=None, help="1-based insertion position for new sections.")
    parser.add_argument("--status", default="draft", choices=["draft", "approved", "locked"])
    parser.add_argument(
        "--source",
        action="append",
        default=None,
        help="Add one source reference. Repeat as needed.",
    )
    return parser.parse_args()


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    session = load_session(args.session_id)
    _assert_drafting_allowed(session)
    content = _read_content(args)
    payload = _read_payload(args)
    if not content and payload:
        content = _payload_to_content(payload)
    now = utc_now_iso()

    section_id = args.section_id or slugify(args.title)
    sections = session.setdefault("sections", [])
    if not isinstance(sections, list):
        raise SystemExit("Invalid session schema: sections must be a list.")

    existing = None
    for section in sections:
        if section.get("id") == section_id:
            existing = section
            break

    source_records = _normalize_sources(args.source)
    payload_sources = _payload_source_records(payload)
    if payload_sources:
        source_records.extend(payload_sources)
    depth_profile = args.depth_profile or session.get("settings", {}).get("depth_profile") or "detailed"

    if existing is None:
        section = {
            "id": section_id,
            "title": args.title,
            "intent": args.intent,
            "content": content,
            "layout_slug": args.layout_slug,
            "archetype_id": args.archetype_id or "",
            "outline_section_id": args.outline_section_id or "",
            "depth_profile": depth_profile,
            "variant": args.variant,
            "expected_slides": _coerce_slide_count(args.slides, content),
            "status": args.status,
            "sources": source_records,
            "authoring_payload": payload,
            "created_at": now,
            "updated_at": now,
            "order": _next_order(ordered_sections(session)),
        }
        sections.append(section)

        if args.position and args.position > 0:
            ordered = ordered_sections(session)
            ordered = [s for s in ordered if s.get("id") != section_id]
            target_idx = min(args.position - 1, len(ordered))
            ordered.insert(target_idx, section)
            for idx, item in enumerate(ordered, start=1):
                item["order"] = idx * 10
            session["sections"] = ordered
    else:
        existing["title"] = args.title
        existing["intent"] = args.intent
        existing["content"] = content or existing.get("content", "")
        existing["layout_slug"] = args.layout_slug or existing.get("layout_slug")
        if args.archetype_id is not None:
            existing["archetype_id"] = args.archetype_id
        if args.outline_section_id is not None:
            existing["outline_section_id"] = args.outline_section_id
        existing["depth_profile"] = depth_profile
        existing["variant"] = args.variant or existing.get("variant", "auto")
        existing["expected_slides"] = _coerce_slide_count(args.slides, str(existing.get("content", "")))
        existing["status"] = args.status
        if source_records:
            existing["sources"] = source_records
        if payload:
            existing["authoring_payload"] = payload
        existing["updated_at"] = now

    # Maintain a deduplicated global source index for appendix generation.
    global_sources = session.setdefault("sources", [])
    if not isinstance(global_sources, list):
        global_sources = []
        session["sources"] = global_sources

    known = {(s.get("label"), s.get("url")) for s in global_sources if isinstance(s, dict)}
    for item in source_records:
        key = (item.get("label"), item.get("url"))
        if key not in known:
            global_sources.append(item)
            known.add(key)

    actions = session.setdefault("actions", [])
    if isinstance(actions, list):
        actions.append(
            {
                "timestamp": now,
                "action": "section_upsert",
                "details": {
                    "section_id": section_id,
                    "intent": args.intent,
                    "layout_slug": args.layout_slug,
                    "status": args.status,
                    "archetype_id": args.archetype_id,
                    "outline_section_id": args.outline_section_id,
                    "depth_profile": depth_profile,
                },
            }
        )

    workflow = session.get("workflow")
    if isinstance(workflow, dict):
        workflow["stage"] = "drafting"

    paths = save_session(session)
    print(f"session={paths['session']}")
    print(f"working_draft={paths['draft']}")
    print(f"section_id={section_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
