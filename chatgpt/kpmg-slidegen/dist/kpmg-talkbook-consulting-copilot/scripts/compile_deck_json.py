#!/usr/bin/env python3
"""Compile a co-writing session into Talkbook-native deck JSON."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

from common import (
    infer_content_shape,
    load_mapping_from_markdown,
    load_session,
    ordered_sections,
    parse_bullets,
    save_session,
    session_paths,
    split_chart_points,
    split_left_right,
    split_table_rows,
    utc_now_iso,
    write_json,
)


def _normalize_text_list(items: List[str], max_items: int, max_chars: int) -> List[str]:
    """Normalize and truncate text items to layout density limits."""
    out: List[str] = []
    for item in items:
        text = str(item).strip()
        if not text:
            continue
        out.append(text[:max_chars].rstrip())
        if len(out) >= max_items:
            break
    return out


def _build_slots(section: Dict[str, Any], layout: Dict[str, Any]) -> Dict[str, Any]:
    """Build slot payloads for a section against a chosen layout definition."""
    content = str(section.get("content", "")).strip()
    bullets = parse_bullets(content)
    table_rows = split_table_rows(content)
    chart_points = split_chart_points(content)
    paragraphs = [line.strip() for line in content.splitlines() if line.strip() and not line.strip().startswith(("-", "*"))]

    density = layout.get("density_limits") or {}
    max_bullets = int(density.get("max_bullets_total", 8))
    max_chars = int(density.get("max_chars_per_bullet", 140))

    bullet_lines = _normalize_text_list(bullets, max_bullets, max_chars)
    para_lines = _normalize_text_list(paragraphs, max_bullets, max_chars)
    left, right = split_left_right(bullet_lines)

    source_lines = [str(s.get("label") or s.get("url") or "").strip() for s in (section.get("sources") or [])]
    source_lines = [s for s in source_lines if s]

    slots: Dict[str, Any] = {}
    required = list(layout.get("required_slots") or [])
    optional = list(layout.get("optional_slots") or [])

    def pick_text() -> str:
        """Pick a representative one-line text snippet."""
        if para_lines:
            return para_lines[0]
        if bullet_lines:
            return bullet_lines[0]
        return section.get("title") or ""

    for slot in [*required, *optional]:
        key = str(slot)

        if key in {"text_title", "title"}:
            slots[key] = str(section.get("title", "")).strip()
        elif key in {"text_left_header"}:
            slots[key] = "Option A"
        elif key in {"text_right_header"}:
            slots[key] = "Option B"
        elif key in {"text_strapline", "strapline", "text_subtitle"}:
            slots[key] = pick_text()
        elif key in {"text_q1", "text_1"}:
            slots[key] = (bullet_lines + para_lines + [pick_text()])[0]
        elif key in {"text_q2", "text_2"}:
            values = bullet_lines + para_lines + [pick_text(), pick_text()]
            slots[key] = values[1]
        elif key in {"text_q3", "text_3"}:
            values = bullet_lines + para_lines + [pick_text(), pick_text(), pick_text()]
            slots[key] = values[2]
        elif key in {"text_q4", "text_4"}:
            values = bullet_lines + para_lines + [pick_text(), pick_text(), pick_text(), pick_text()]
            slots[key] = values[3]
        elif key in {"text_body", "body", "text_main"}:
            slots[key] = bullet_lines or para_lines
        elif key in {"text_left_body", "left_body", "text_left"}:
            slots[key] = left or bullet_lines[: max(1, len(bullet_lines) // 2)]
        elif key in {"text_right_body", "right_body", "text_right"}:
            slots[key] = right or bullet_lines[max(1, len(bullet_lines) // 2) :]
        elif key in {"text_center_body", "text_center", "center_text"}:
            slots[key] = pick_text()
        elif key in {"table_main", "table", "table_primary"}:
            slots[key] = table_rows or [["Category", "Value"], ["Placeholder", "TBD"]]
        elif key in {"chart_main", "chart", "chart_primary"}:
            slots[key] = chart_points or [
                {"label": "Current", "value": 40.0},
                {"label": "Target", "value": 65.0},
                {"label": "Upside", "value": 82.0},
            ]
        elif key in {"text_footer_source", "source", "sources"}:
            slots[key] = source_lines
        elif key in {"icon_main", "icon", "icon_center", "icon_1", "icon_2", "icon_3", "icon_4"}:
            slots[key] = "placeholder://icon"
        elif key.startswith("image"):
            slots[key] = "placeholder://image"
        elif key.startswith("text_"):
            slots[key] = pick_text()
        else:
            slots[key] = pick_text()

    return slots


def _required_missing(layout: Dict[str, Any], slots: Dict[str, Any]) -> List[str]:
    """Return required slots missing materialized values."""
    missing: List[str] = []
    for slot in layout.get("required_slots") or []:
        value = slots.get(slot)
        if value is None:
            missing.append(str(slot))
        elif isinstance(value, str) and not value.strip():
            missing.append(str(slot))
        elif isinstance(value, list) and len(value) == 0:
            missing.append(str(slot))
    return missing


def _choose_layout(
    section: Dict[str, Any],
    layouts: List[Dict[str, Any]],
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Select a layout deterministically using intent/shape/density/variant tie-breaks."""
    forced = section.get("layout_slug")
    if isinstance(forced, str) and forced.strip():
        slug = forced.strip()
        for layout in layouts:
            if layout.get("layout_slug") == slug:
                return layout, {"strategy": "forced", "layout_slug": slug}

    intent = str(section.get("intent", "general")).lower()
    shape = infer_content_shape(str(section.get("content", "")))
    variant = str(section.get("variant", "auto")).lower()
    bullet_count = len(parse_bullets(str(section.get("content", ""))))

    scored: List[Tuple[int, str, Dict[str, Any]]] = []
    for layout in layouts:
        score = 0
        slug = str(layout.get("layout_slug"))
        intents = [str(v).lower() for v in (layout.get("business_intent") or [])]
        shapes = [str(v).lower() for v in (layout.get("best_for_content_shape") or [])]
        variants = [str(v).lower() for v in (layout.get("background_variants") or [])]
        density = layout.get("density_limits") or {}
        max_bullets = int(density.get("max_bullets_total", 12))

        if intent in intents:
            score += 100
        if shape in shapes:
            score += 30
        if variant != "auto":
            if variant in variants:
                score += 15
            elif variants:
                score -= 10
        if bullet_count <= max_bullets:
            score += 10
        else:
            score -= 20

        score += int(layout.get("priority", 0))
        scored.append((score, slug, layout))

    scored.sort(key=lambda item: (-item[0], item[1]))
    selected = scored[0][2]
    decision = {
        "strategy": "scored",
        "intent": intent,
        "shape": shape,
        "variant": variant,
        "score": scored[0][0],
        "layout_slug": selected.get("layout_slug"),
    }
    return selected, decision


def _compile(session: Dict[str, Any], mapping: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Compile session sections into final deck JSON + diagnostics report."""
    layouts = mapping.get("layout_types") or []
    if not isinstance(layouts, list) or not layouts:
        raise ValueError("Mapping must define a non-empty layout_types list.")

    slides: List[Dict[str, Any]] = []
    layout_usage: Dict[str, int] = {}
    diagnostics: List[Dict[str, Any]] = []

    for section in ordered_sections(session):
        expected = int(section.get("expected_slides", 1))
        layout, decision = _choose_layout(section, layouts)
        slots = _build_slots(section, layout)
        missing = _required_missing(layout, slots)

        slide = {
            "type": f"layout.{layout['layout_slug']}",
            "slots": slots,
            "notes": section.get("notes") or "",
            "sectionId": section.get("id"),
            "sectionTitle": section.get("title"),
            "variant": section.get("variant", "auto"),
        }

        for _ in range(max(1, expected)):
            slides.append(slide)

        slug = str(layout["layout_slug"])
        layout_usage[slug] = layout_usage.get(slug, 0) + max(1, expected)
        diagnostics.append(
            {
                "section_id": section.get("id"),
                "section_title": section.get("title"),
                "selected_layout": slug,
                "decision": decision,
                "missing_required_slots": missing,
            }
        )

    appendix_sources = session.get("sources") or []

    deck = {
        "metadata": {
            "title": session.get("deck", {}).get("title", session.get("topic", "Talkbook Deck")),
            "topic": session.get("topic"),
            "audience": session.get("deck", {}).get("audience"),
            "template": "kpmg-talkbook",
            "compiledAt": utc_now_iso(),
            "sessionId": session.get("session_id"),
            "citationMode": session.get("settings", {}).get("citation_mode"),
        },
        "slides": slides,
        "appendixSources": appendix_sources,
    }

    canonical = json.loads(json.dumps(deck))
    if isinstance(canonical.get("metadata"), dict):
        canonical["metadata"]["compiledAt"] = "CANONICAL"
    deterministic_hash = hashlib.sha256(
        json.dumps(canonical, sort_keys=True, ensure_ascii=False).encode("utf-8")
    ).hexdigest()

    report = {
        "session_id": session.get("session_id"),
        "compiled_at": utc_now_iso(),
        "slide_count": len(slides),
        "layout_usage": layout_usage,
        "diagnostics": diagnostics,
        "deterministic_hash": deterministic_hash,
    }
    return deck, report


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments for session compilation."""
    parser = argparse.ArgumentParser(description="Compile a session into Talkbook deck.json")
    parser.add_argument("--session-id", required=True)
    parser.add_argument(
        "--mapping",
        default=str(Path(__file__).resolve().parents[1] / "references" / "layout-mapping.md"),
        help="Path to layout-mapping markdown file.",
    )
    parser.add_argument("--out", default=None, help="Optional output deck path. Defaults to session deck.json")
    parser.add_argument("--report", default=None, help="Optional compile report path.")
    parser.add_argument(
        "--allow-missing-required",
        action="store_true",
        help="Do not fail on missing required slots in diagnostics.",
    )
    return parser.parse_args()


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    session = load_session(args.session_id)
    mapping = load_mapping_from_markdown(Path(args.mapping))
    deck, report = _compile(session, mapping)

    paths = session_paths(args.session_id)
    out_path = Path(args.out) if args.out else paths["deck"]
    report_path = Path(args.report) if args.report else paths["base"] / "compile_report.json"

    write_json(out_path, deck)
    write_json(report_path, report)

    missing_total = 0
    for item in report["diagnostics"]:
        missing_total += len(item.get("missing_required_slots") or [])

    actions = session.setdefault("actions", [])
    if isinstance(actions, list):
        actions.append(
            {
                "timestamp": utc_now_iso(),
                "action": "compile_deck_json",
                "details": {
                    "out": str(out_path),
                    "report": str(report_path),
                    "slide_count": report["slide_count"],
                    "missing_required_total": missing_total,
                    "deterministic_hash": report["deterministic_hash"],
                },
            }
        )
    save_session(session)

    print(f"deck_json={out_path}")
    print(f"compile_report={report_path}")
    print(f"slide_count={report['slide_count']}")
    print(f"deterministic_hash={report['deterministic_hash']}")

    if missing_total > 0 and not args.allow_missing_required:
        print(f"missing_required_slots={missing_total}")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
