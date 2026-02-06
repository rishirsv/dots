#!/usr/bin/env python3
"""Apply iterative editing actions to an active co-writing session."""

from __future__ import annotations

import argparse
import re
from typing import Any, Dict, List

from common import load_session, ordered_sections, parse_bullets, save_session, split_left_right, utc_now_iso


def _find_section(sections: List[Dict[str, Any]], section_id: str) -> Dict[str, Any]:
    """Return a section by id or raise a user-facing error."""
    for section in sections:
        if section.get("id") == section_id:
            return section
    raise SystemExit(f"Section not found: {section_id}")


def _simplify_text(content: str, max_bullets: int, max_chars: int) -> str:
    """Reduce text density while preserving core claims and structure."""
    bullets = parse_bullets(content)
    if bullets:
        trimmed: List[str] = []
        for bullet in bullets[:max_bullets]:
            sentence = bullet.strip()
            sentence = re.split(r"(?<=[.!?])\s+", sentence)[0]
            trimmed.append(sentence[:max_chars].rstrip())
        return "\n".join(f"- {item}" for item in trimmed)

    # Fall back to compacting paragraphs when bullet extraction is unavailable.
    paragraphs = [p.strip() for p in content.splitlines() if p.strip()]
    compacted = [p[:max_chars].rstrip() for p in paragraphs[:max_bullets]]
    return "\n".join(compacted)


def cmd_simplify(args: argparse.Namespace) -> Dict[str, Any]:
    """Simplify one section's content density."""
    session = load_session(args.session_id)
    sections = session.get("sections") or []
    if not isinstance(sections, list):
        raise SystemExit("Invalid session schema: sections must be a list.")

    target = _find_section(sections, args.section_id)
    original = str(target.get("content", ""))
    target["content"] = _simplify_text(original, args.max_bullets, args.max_chars)
    target["intent"] = target.get("intent") or "summary"
    target["updated_at"] = utc_now_iso()

    session.setdefault("actions", []).append(
        {
            "timestamp": target["updated_at"],
            "action": "simplify",
            "details": {
                "section_id": args.section_id,
                "max_bullets": args.max_bullets,
                "max_chars": args.max_chars,
            },
        }
    )
    save_session(session)
    return {"section_id": args.section_id}


def cmd_merge(args: argparse.Namespace) -> Dict[str, Any]:
    """Merge two sections into one consolidated section."""
    session = load_session(args.session_id)
    sections = ordered_sections(session)
    first = _find_section(sections, args.first)
    second = _find_section(sections, args.second)

    merged_id = args.new_id or f"{first.get('id')}-{second.get('id')}"
    merged_title = args.new_title or f"{first.get('title')} + {second.get('title')}"
    merged_content = f"{first.get('content', '').strip()}\n\n{second.get('content', '').strip()}".strip()

    merged = {
        "id": merged_id,
        "title": merged_title,
        "intent": args.intent or first.get("intent") or second.get("intent") or "summary",
        "content": merged_content,
        "layout_slug": args.layout_slug or first.get("layout_slug") or second.get("layout_slug"),
        "variant": args.variant or "auto",
        "expected_slides": max(int(first.get("expected_slides", 1)), int(second.get("expected_slides", 1))),
        "status": "draft",
        "sources": [*(first.get("sources") or []), *(second.get("sources") or [])],
        "created_at": utc_now_iso(),
        "updated_at": utc_now_iso(),
        "order": min(int(first.get("order", 10_000)), int(second.get("order", 10_000))),
    }

    new_sections: List[Dict[str, Any]] = []
    for section in sections:
        if section.get("id") in {args.first, args.second}:
            continue
        new_sections.append(section)
    new_sections.append(merged)
    new_sections = sorted(new_sections, key=lambda s: int(s.get("order", 10_000)))

    for idx, section in enumerate(new_sections, start=1):
        section["order"] = idx * 10

    session["sections"] = new_sections
    session.setdefault("actions", []).append(
        {
            "timestamp": utc_now_iso(),
            "action": "merge",
            "details": {"first": args.first, "second": args.second, "merged_id": merged_id},
        }
    )
    save_session(session)
    return {"section_id": merged_id}


def cmd_split(args: argparse.Namespace) -> Dict[str, Any]:
    """Split one section into two sections using bullet or paragraph boundaries."""
    session = load_session(args.session_id)
    sections = ordered_sections(session)
    target = _find_section(sections, args.section_id)
    content = str(target.get("content", ""))

    bullets = parse_bullets(content)
    if bullets and len(bullets) >= 4:
        left, right = split_left_right(bullets)
        first_content = "\n".join(f"- {item}" for item in left)
        second_content = "\n".join(f"- {item}" for item in right)
    else:
        paragraphs = [p for p in content.split("\n\n") if p.strip()]
        pivot = max(1, len(paragraphs) // 2)
        first_content = "\n\n".join(paragraphs[:pivot]).strip()
        second_content = "\n\n".join(paragraphs[pivot:]).strip()

    base_order = int(target.get("order", 10_000))
    new_a = {
        **target,
        "id": f"{args.section_id}-a",
        "title": f"{target.get('title')} (Part 1)",
        "content": first_content,
        "order": base_order,
        "updated_at": utc_now_iso(),
    }
    new_b = {
        **target,
        "id": f"{args.section_id}-b",
        "title": f"{target.get('title')} (Part 2)",
        "content": second_content,
        "order": base_order + 1,
        "updated_at": utc_now_iso(),
    }

    replaced: List[Dict[str, Any]] = []
    for section in sections:
        if section.get("id") == args.section_id:
            replaced.extend([new_a, new_b])
        else:
            replaced.append(section)

    replaced = sorted(replaced, key=lambda s: int(s.get("order", 10_000)))
    for idx, section in enumerate(replaced, start=1):
        section["order"] = idx * 10

    session["sections"] = replaced
    session.setdefault("actions", []).append(
        {
            "timestamp": utc_now_iso(),
            "action": "split",
            "details": {"section_id": args.section_id},
        }
    )
    save_session(session)
    return {"new_sections": [new_a["id"], new_b["id"]]}


def cmd_reorder(args: argparse.Namespace) -> Dict[str, Any]:
    """Reorder all sections by explicit id sequence."""
    session = load_session(args.session_id)
    sections = ordered_sections(session)
    by_id = {str(s.get("id")): s for s in sections}

    requested = [value.strip() for value in args.order.split(",") if value.strip()]
    unknown = [item for item in requested if item not in by_id]
    if unknown:
        raise SystemExit(f"Unknown section ids: {unknown}")

    reordered: List[Dict[str, Any]] = [by_id[item] for item in requested]
    for section in sections:
        sid = str(section.get("id"))
        if sid not in requested:
            reordered.append(section)

    for idx, section in enumerate(reordered, start=1):
        section["order"] = idx * 10
        section["updated_at"] = utc_now_iso()

    session["sections"] = reordered
    session.setdefault("actions", []).append(
        {
            "timestamp": utc_now_iso(),
            "action": "reorder",
            "details": {"order": requested},
        }
    )
    save_session(session)
    return {"count": len(reordered)}


def cmd_visualize(args: argparse.Namespace) -> Dict[str, Any]:
    """Switch a section toward a more visual layout intent."""
    session = load_session(args.session_id)
    sections = session.get("sections") or []
    target = _find_section(sections, args.section_id)

    mode_to_intent = {
        "process": "process",
        "chart": "data-visualization",
        "comparison": "comparison",
    }
    mode_to_layout = {
        "process": "process-flow-horizontal",
        "chart": "2-column-chart",
        "comparison": "two-column-comparison",
    }

    target["intent"] = mode_to_intent[args.mode]
    target["layout_slug"] = mode_to_layout[args.mode]
    target["updated_at"] = utc_now_iso()

    session.setdefault("actions", []).append(
        {
            "timestamp": target["updated_at"],
            "action": "make_visual",
            "details": {"section_id": args.section_id, "mode": args.mode},
        }
    )
    save_session(session)
    return {"section_id": args.section_id, "layout_slug": target["layout_slug"]}


def build_parser() -> argparse.ArgumentParser:
    """Create the action parser and subcommands."""
    parser = argparse.ArgumentParser(description="Apply iterative editing actions to a session.")
    sub = parser.add_subparsers(dest="action", required=True)

    simplify = sub.add_parser("simplify", help="Reduce text density for one section.")
    simplify.add_argument("--session-id", required=True)
    simplify.add_argument("--section-id", required=True)
    simplify.add_argument("--max-bullets", type=int, default=5)
    simplify.add_argument("--max-chars", type=int, default=120)
    simplify.set_defaults(fn=cmd_simplify)

    merge = sub.add_parser("merge", help="Merge two sections into one.")
    merge.add_argument("--session-id", required=True)
    merge.add_argument("--first", required=True)
    merge.add_argument("--second", required=True)
    merge.add_argument("--new-id", default=None)
    merge.add_argument("--new-title", default=None)
    merge.add_argument("--intent", default=None)
    merge.add_argument("--layout-slug", default=None)
    merge.add_argument("--variant", default="auto")
    merge.set_defaults(fn=cmd_merge)

    split = sub.add_parser("split", help="Split one section into two.")
    split.add_argument("--session-id", required=True)
    split.add_argument("--section-id", required=True)
    split.set_defaults(fn=cmd_split)

    reorder = sub.add_parser("reorder", help="Reorder sections by id list.")
    reorder.add_argument("--session-id", required=True)
    reorder.add_argument("--order", required=True, help="Comma-separated section ids.")
    reorder.set_defaults(fn=cmd_reorder)

    visualize = sub.add_parser("visualize", help="Switch a section to a visual-first intent.")
    visualize.add_argument("--session-id", required=True)
    visualize.add_argument("--section-id", required=True)
    visualize.add_argument("--mode", required=True, choices=["process", "chart", "comparison"])
    visualize.set_defaults(fn=cmd_visualize)

    return parser


def main() -> int:
    """Program entrypoint."""
    parser = build_parser()
    args = parser.parse_args()
    result = args.fn(args)
    print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
