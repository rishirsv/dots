#!/usr/bin/env python3
"""Compile a co-writing session into Talkbook-native deck JSON."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple

from common import (
    DEPTH_PROFILES,
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

DEPTH_MINIMA = {
    "minimal": {"claims": 2, "evidence_objects": 1, "implications": 1, "numeric_anchors": 1},
    "concise": {"claims": 3, "evidence_objects": 1, "implications": 1, "numeric_anchors": 2},
    "detailed": {"claims": 4, "evidence_objects": 2, "implications": 2, "numeric_anchors": 3},
    "extensive": {"claims": 6, "evidence_objects": 3, "implications": 3, "numeric_anchors": 5},
}


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


def _strip_bullet_prefix(line: str) -> str:
    """Return one line with markdown bullet/numbering prefix removed."""
    stripped = line.strip()
    if stripped.startswith(("- ", "* ")):
        return stripped[2:].strip()
    return re.sub(r"^\d+\.\s+", "", stripped).strip()


def _split_label_and_value(text: str) -> Tuple[str, str]:
    """Split `Label: value` text into left/right parts when possible."""
    raw = text.strip()
    if ":" not in raw:
        return "", raw
    left, right = raw.split(":", 1)
    return left.strip(), right.strip()


def _extract_numeric_value(text: str) -> float | None:
    """Extract the first numeric token from text, preserving sign and decimals."""
    match = re.search(r"(-?\d[\d,]*(?:\.\d+)?)", text)
    if not match:
        return None
    try:
        return float(match.group(1).replace(",", ""))
    except ValueError:
        return None


def _pick_center_implication(bullets: List[str], paragraphs: List[str]) -> str:
    """Pick a center callout sentence for matrix layouts."""
    candidates = bullets + paragraphs
    keywords = ("strategic implication", "implication", "recommendation", "decision required", "decision", "interpretation")
    for line in candidates:
        lowered = line.lower()
        if any(key in lowered for key in keywords):
            return line
    return paragraphs[0] if paragraphs else ""


def _split_swot(bullets: List[str]) -> Dict[str, str]:
    """Map SWOT-style bullets into fixed quadrant keys."""
    out = {"strength": "", "weakness": "", "opportunity": "", "threat": ""}
    remaining: List[str] = []
    for bullet in bullets:
        label, _ = _split_label_and_value(bullet)
        lowered = label.lower()
        if lowered.startswith("strength"):
            out["strength"] = bullet
        elif lowered.startswith("weakness"):
            out["weakness"] = bullet
        elif lowered.startswith("opportunity"):
            out["opportunity"] = bullet
        elif lowered.startswith("threat"):
            out["threat"] = bullet
        else:
            remaining.append(bullet)

    for key in ["strength", "weakness", "opportunity", "threat"]:
        if out[key]:
            continue
        if remaining:
            out[key] = remaining.pop(0)
    return out


def _split_risks_and_mitigations(bullets: List[str]) -> Tuple[List[str], List[str]]:
    """Split risk/mitigation bullets into paired left and right collections."""
    risks: List[str] = []
    mitigations: List[str] = []
    other: List[str] = []

    for bullet in bullets:
        label, value = _split_label_and_value(bullet)
        lowered = label.lower()
        if lowered.startswith("risk"):
            risks.append(value or bullet)
        elif lowered.startswith("mitigation"):
            mitigations.append(value or bullet)
        else:
            other.append(bullet)

    if not risks and not mitigations:
        return split_left_right(bullets)

    for line in other:
        if len(risks) <= len(mitigations):
            risks.append(line)
        else:
            mitigations.append(line)
    return risks, mitigations


def _split_option_comparison(bullets: List[str]) -> Tuple[str, str, List[str], List[str]]:
    """Split option-style bullets into two labeled columns."""
    options: List[Tuple[str, str]] = []
    other: List[str] = []

    for bullet in bullets:
        match = re.match(r"^Option\s+([A-Za-z0-9]+)(?:\s*\(([^)]+)\))?\s*:\s*(.+)$", bullet, flags=re.IGNORECASE)
        if not match:
            other.append(bullet)
            continue
        option_key = match.group(1).upper()
        option_name = (match.group(2) or f"Option {option_key}").strip()
        detail = match.group(3).strip()
        options.append((option_name, detail))

    if len(options) >= 2:
        left_header = options[0][0]
        right_header = options[1][0]
        left_body = [options[0][1]]
        right_body = [options[1][1]]
        for idx, (_, detail) in enumerate(options[2:], start=0):
            if idx % 2 == 0:
                left_body.append(detail)
            else:
                right_body.append(detail)
        for line in other:
            if len(left_body) <= len(right_body):
                left_body.append(line)
            else:
                right_body.append(line)
        return left_header, right_header, left_body, right_body

    left, right = split_left_right(bullets)
    return "Option A", "Option B", left, right


def _table_from_bullets(bullets: List[str]) -> List[List[str]]:
    """Create a compact table from `Label: value` bullets when no markdown table exists."""
    rows: List[List[str]] = []
    for bullet in bullets:
        label, value = _split_label_and_value(bullet)
        if not label or not value:
            continue
        rows.append([label, value])
    if not rows:
        return []
    return [["Metric", "Value"], *rows]


def _chart_points_from_bullets(bullets: List[str], max_points: int = 8) -> List[Dict[str, Any]]:
    """Extract chart points from labeled bullet statements containing numeric values."""
    points: List[Dict[str, Any]] = []
    for bullet in bullets:
        label, value = _split_label_and_value(bullet)
        if not label:
            continue
        number = _extract_numeric_value(value)
        if number is None:
            continue
        points.append({"label": label[:40], "value": number})
        if len(points) >= max_points:
            break
    return points


def _chart_points_from_table(table_rows: List[List[str]], max_points: int = 8) -> List[Dict[str, Any]]:
    """Extract chart points from table rows using first text column and first numeric column."""
    if len(table_rows) < 2:
        return []

    points: List[Dict[str, Any]] = []
    for row in table_rows[1:]:
        if len(row) < 2:
            continue
        label = str(row[0]).strip()
        if not label:
            continue
        number = None
        for cell in row[1:]:
            number = _extract_numeric_value(str(cell))
            if number is not None:
                break
        if number is None:
            continue
        points.append({"label": label[:40], "value": number})
        if len(points) >= max_points:
            break
    return points


def _normalized_payload(section: Dict[str, Any]) -> Dict[str, Any]:
    """Return section authoring payload with guaranteed keys."""
    payload = section.get("authoring_payload")
    if not isinstance(payload, dict):
        payload = {}
    payload.setdefault("headline_claim", "")
    payload.setdefault("claims", [])
    payload.setdefault("evidence_objects", [])
    payload.setdefault("implications", [])
    payload.setdefault("decision_ask", "")
    payload.setdefault("source_anchors", [])
    return payload


def _payload_evidence(payload: Dict[str, Any]) -> Tuple[List[List[str]], List[Dict[str, Any]], List[str]]:
    """Extract table rows, chart points, and evidence bullets from payload evidence objects."""
    table_rows: List[List[str]] = []
    chart_points: List[Dict[str, Any]] = []
    evidence_bullets: List[str] = []

    for item in payload.get("evidence_objects") or []:
        if not isinstance(item, dict):
            continue
        etype = str(item.get("type") or "").strip().lower()

        if etype == "table" and not table_rows:
            rows = item.get("rows") or []
            if isinstance(rows, list) and rows:
                candidate: List[List[str]] = []
                for row in rows:
                    if isinstance(row, list):
                        candidate.append([str(cell).strip() for cell in row])
                if candidate:
                    table_rows = candidate
                    continue

        if etype == "chart" and not chart_points:
            points = item.get("points") or item.get("series") or []
            if isinstance(points, list):
                candidate: List[Dict[str, Any]] = []
                for point in points:
                    if not isinstance(point, dict):
                        continue
                    label = str(point.get("label") or point.get("name") or "").strip()
                    value_raw = point.get("value")
                    if not label or value_raw is None:
                        continue
                    number = _extract_numeric_value(str(value_raw))
                    if number is None:
                        continue
                    candidate.append({"label": label[:40], "value": number})
                if candidate:
                    chart_points = candidate
                    continue

        if etype == "matrix" and not table_rows:
            rows = item.get("rows") or []
            if isinstance(rows, list) and rows:
                candidate = [["Dimension", "Assessment"]]
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    left = str(row.get("dimension") or row.get("label") or "").strip()
                    right = str(row.get("assessment") or row.get("value") or "").strip()
                    if left and right:
                        candidate.append([left, right])
                if len(candidate) > 1:
                    table_rows = candidate
                    continue

        if etype in {"bullet_evidence", "appendix_ref"}:
            label = str(item.get("label") or item.get("text") or item.get("ref") or "").strip()
            detail = str(item.get("detail") or "").strip()
            if label and detail:
                evidence_bullets.append(f"{label}: {detail}")
            elif label:
                evidence_bullets.append(label)

    return table_rows, chart_points, evidence_bullets


def _count_numeric_anchors(lines: List[str]) -> int:
    """Count lines that contain at least one numeric token."""
    count = 0
    for line in lines:
        if _extract_numeric_value(str(line)) is not None:
            count += 1
    return count


def _depth_evaluation(section: Dict[str, Any], payload: Dict[str, Any], bullet_lines: List[str]) -> Dict[str, Any]:
    """Evaluate payload depth completeness using profile-based minima."""
    depth_profile = str(section.get("depth_profile") or "detailed").lower()
    if depth_profile not in DEPTH_PROFILES:
        depth_profile = "detailed"
    minima = DEPTH_MINIMA[depth_profile]

    claims = [str(item).strip() for item in payload.get("claims") or [] if str(item).strip()]
    implications = [str(item).strip() for item in payload.get("implications") or [] if str(item).strip()]
    evidence_objects = [item for item in (payload.get("evidence_objects") or []) if isinstance(item, dict)]
    numeric_anchors = _count_numeric_anchors(bullet_lines + claims + implications)

    warnings: List[str] = []
    if len(claims) < minima["claims"]:
        warnings.append(f"claims below minimum ({len(claims)} < {minima['claims']})")
    if len(evidence_objects) < minima["evidence_objects"]:
        warnings.append(
            f"evidence_objects below minimum ({len(evidence_objects)} < {minima['evidence_objects']})"
        )
    if len(implications) < minima["implications"]:
        warnings.append(f"implications below minimum ({len(implications)} < {minima['implications']})")
    if numeric_anchors < minima["numeric_anchors"]:
        warnings.append(f"numeric_anchors below minimum ({numeric_anchors} < {minima['numeric_anchors']})")

    return {
        "depth_profile": depth_profile,
        "minimums": minima,
        "actual": {
            "claims": len(claims),
            "evidence_objects": len(evidence_objects),
            "implications": len(implications),
            "numeric_anchors": numeric_anchors,
        },
        "warnings": warnings,
    }


def _build_slots(section: Dict[str, Any], layout: Dict[str, Any]) -> Dict[str, Any]:
    """Build slot payloads for a section against a chosen layout definition."""
    content = str(section.get("content", "")).strip()
    payload = _normalized_payload(section)
    payload_table_rows, payload_chart_points, payload_evidence_bullets = _payload_evidence(payload)

    payload_claims = [str(item).strip() for item in payload.get("claims") or [] if str(item).strip()]
    payload_implications = [
        str(item).strip() for item in payload.get("implications") or [] if str(item).strip()
    ]
    decision_ask = str(payload.get("decision_ask") or "").strip()

    bullets = [_strip_bullet_prefix(item) for item in parse_bullets(content)]
    bullets.extend(payload_claims)
    bullets.extend(payload_evidence_bullets)
    for implication in payload_implications:
        bullets.append(f"Strategic implication: {implication}")
    if decision_ask:
        bullets.append(f"Decision required: {decision_ask}")

    table_rows = payload_table_rows or split_table_rows(content)
    chart_points = payload_chart_points or split_chart_points(content)
    paragraphs = [
        line.strip()
        for line in content.splitlines()
        if line.strip() and not line.strip().startswith(("-", "*", "|")) and not re.match(r"^\d+\.\s+", line.strip())
    ]
    headline_claim = str(payload.get("headline_claim") or "").strip()
    if headline_claim:
        paragraphs = [headline_claim, *paragraphs]
    layout_slug = str(layout.get("layout_slug", "")).lower()

    density = layout.get("density_limits") or {}
    max_bullets = int(density.get("max_bullets_total", 8))
    max_chars = int(density.get("max_chars_per_bullet", 140))

    bullet_lines = _normalize_text_list(bullets, max_bullets, max_chars)
    para_lines = _normalize_text_list(paragraphs, max_bullets, max_chars)
    left, right = split_left_right(bullet_lines)
    swot = _split_swot(bullet_lines)
    risk_left, risk_right = _split_risks_and_mitigations(bullet_lines)
    option_left_header, option_right_header, option_left, option_right = _split_option_comparison(bullet_lines)
    center_callout = _pick_center_implication(bullet_lines, para_lines)
    synthesized_table = _table_from_bullets(bullet_lines)
    inferred_chart_points = (
        chart_points
        or _chart_points_from_bullets(bullet_lines)
        or _chart_points_from_table(table_rows)
    )

    source_lines = [str(s.get("label") or s.get("url") or "").strip() for s in (section.get("sources") or [])]
    for source in payload.get("source_anchors") or []:
        source_lines.append(str(source).strip())
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
            if "risk" in layout_slug:
                slots[key] = "Risks"
            else:
                slots[key] = option_left_header
        elif key in {"text_right_header"}:
            if "risk" in layout_slug:
                slots[key] = "Mitigations"
            else:
                slots[key] = option_right_header
        elif key in {"text_strapline", "strapline", "text_subtitle"}:
            slots[key] = pick_text()
        elif key in {"text_q1", "text_1"}:
            slots[key] = swot["strength"] or (bullet_lines + para_lines + [pick_text()])[0]
        elif key in {"text_q2", "text_2"}:
            slots[key] = swot["weakness"] or (bullet_lines + para_lines + [pick_text(), pick_text()])[1]
        elif key in {"text_q3", "text_3"}:
            slots[key] = swot["opportunity"] or (bullet_lines + para_lines + [pick_text(), pick_text(), pick_text()])[2]
        elif key in {"text_q4", "text_4"}:
            slots[key] = swot["threat"] or (bullet_lines + para_lines + [pick_text(), pick_text(), pick_text(), pick_text()])[3]
        elif key in {"text_body", "body", "text_main"}:
            slots[key] = bullet_lines or para_lines
        elif key in {"text_left_body", "left_body", "text_left"}:
            if "risk" in layout_slug:
                slots[key] = risk_left or left
            elif "comparison" in layout_slug:
                slots[key] = option_left or left
            else:
                slots[key] = left or bullet_lines[: max(1, len(bullet_lines) // 2)] or para_lines[:1]
        elif key in {"text_right_body", "right_body", "text_right"}:
            if "risk" in layout_slug:
                slots[key] = risk_right or right
            elif "comparison" in layout_slug:
                slots[key] = option_right or right
            else:
                slots[key] = right or bullet_lines[max(1, len(bullet_lines) // 2) :] or bullet_lines[:1] or para_lines[:1]
        elif key in {"text_center_body", "text_center", "center_text"}:
            slots[key] = center_callout
        elif key in {"table_main", "table", "table_primary"}:
            slots[key] = table_rows or synthesized_table
        elif key in {"chart_main", "chart", "chart_primary"}:
            slots[key] = inferred_chart_points
        elif key in {"text_footer_source", "source", "sources"}:
            slots[key] = source_lines
        elif key in {"icon_main", "icon", "icon_center", "icon_1", "icon_2", "icon_3", "icon_4"}:
            slots[key] = ""
        elif key.startswith("image"):
            slots[key] = ""
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
    payload = _normalized_payload(section)
    payload_table_rows, payload_chart_points, _ = _payload_evidence(payload)
    payload_shape_strict = bool(payload_table_rows or payload_chart_points)
    if payload_table_rows:
        shape = "table"
    elif payload_chart_points:
        shape = "chart"
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
        shape_weight = 120 if payload_shape_strict else 30

        if intent in intents:
            score += 100
        if shape in shapes:
            score += shape_weight
        elif payload_shape_strict:
            score -= 80
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


def _assert_compile_allowed(session: Dict[str, Any]) -> None:
    """Enforce compile gate for outline_confirm workflow before drafting approval."""
    workflow = session.get("workflow") or {}
    workflow_stage = "compiled" if isinstance(workflow, dict) else None
    workflow_stage = "compiled" if isinstance(workflow, dict) else None
    mode = str(workflow.get("mode") or "outline_confirm")
    if mode != "outline_confirm":
        return

    stage = str(workflow.get("stage") or "intake")
    approval = workflow.get("outline_approval") or {}
    approved = str(approval.get("status") or "") == "approved"
    if stage in {"outline_approved", "drafting", "compiled"} or approved:
        return

    raise SystemExit(
        "Compile blocked: outline_confirm workflow requires approved outline before drafting/compile.\n"
        "Run approve_outline.py, then compile again."
    )


def _outline_adherence(session: Dict[str, Any]) -> Dict[str, Any]:
    """Compare drafted sections against outline section coverage."""
    outline = session.get("outline") or {}
    outline_sections = outline.get("sections") or []
    outline_ids = {str(item.get("section_id") or "") for item in outline_sections if isinstance(item, dict)}
    outline_ids = {item for item in outline_ids if item}

    section_ids = {str(item.get("id") or "") for item in ordered_sections(session)}
    section_ids = {item for item in section_ids if item}

    unmatched_outline = sorted(outline_ids - section_ids)
    unmatched_sections = sorted(section_ids - outline_ids)
    ratio = (len(unmatched_sections) / len(section_ids)) if section_ids else 0.0
    warning = ratio > 0.30
    return {
        "outline_section_count": len(outline_ids),
        "draft_section_count": len(section_ids),
        "unmatched_outline_sections": unmatched_outline,
        "unmatched_draft_sections": unmatched_sections,
        "unmatched_ratio": round(ratio, 4),
        "warning": warning,
    }


def _compile(session: Dict[str, Any], mapping: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Compile session sections into final deck JSON + diagnostics report."""
    layouts = mapping.get("layout_types") or []
    if not isinstance(layouts, list) or not layouts:
        raise ValueError("Mapping must define a non-empty layout_types list.")

    _assert_compile_allowed(session)

    slides: List[Dict[str, Any]] = []
    layout_usage: Dict[str, int] = {}
    diagnostics: List[Dict[str, Any]] = []
    section_scores: List[int] = []
    depth_warning_total = 0
    outline_sections = session.get("outline", {}).get("sections") or []
    outline_ids = {
        str(item.get("section_id") or "")
        for item in outline_sections
        if isinstance(item, dict)
    }
    outline_ids = {item for item in outline_ids if item}

    for section in ordered_sections(session):
        expected = int(section.get("expected_slides", 1))
        layout, decision = _choose_layout(section, layouts)
        slots = _build_slots(section, layout)
        missing = _required_missing(layout, slots)
        payload = _normalized_payload(section)
        content_bullets = [_strip_bullet_prefix(item) for item in parse_bullets(str(section.get("content", "")))]
        depth_eval = _depth_evaluation(section, payload, content_bullets)
        depth_warning_total += len(depth_eval["warnings"])
        section_score = max(0, 40 - (len(depth_eval["warnings"]) * 6))
        section_scores.append(section_score)

        outline_section_id = str(section.get("outline_section_id") or "")
        section_id = str(section.get("id") or "")
        outline_match = bool(
            (section_id and section_id in outline_ids)
            or (outline_section_id and outline_section_id in outline_ids)
        )

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
                "archetype_id": section.get("archetype_id") or "",
                "depth_profile": depth_eval["depth_profile"],
                "depth_evaluation": depth_eval,
                "outline_section_id": outline_section_id,
                "outline_match": outline_match,
                "advisory_score": section_score,
            }
        )

    appendix_sources = session.get("sources") or []
    workflow = session.get("workflow") or {}
    workflow_stage = "compiled" if isinstance(workflow, dict) else None
    outline_adherence = _outline_adherence(session)
    report_warnings: List[str] = []
    if outline_adherence.get("warning"):
        report_warnings.append(
            "outline adherence drift exceeds threshold (unmatched draft sections ratio > 30%)."
        )

    deck = {
        "metadata": {
            "title": session.get("deck", {}).get("title", session.get("topic", "Talkbook Deck")),
            "topic": session.get("topic"),
            "audience": session.get("deck", {}).get("audience"),
            "template": "kpmg-talkbook",
            "compiledAt": utc_now_iso(),
            "sessionId": session.get("session_id"),
            "citationMode": session.get("settings", {}).get("citation_mode"),
            "workflowMode": workflow.get("mode"),
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
        "workflow": {
            "mode": workflow.get("mode"),
            "stage": workflow_stage,
            "outline_required": workflow.get("outline_required"),
        },
        "outline_adherence": outline_adherence,
        "quality_summary": {
            "section_count": len(section_scores),
            "average_advisory_score": round(sum(section_scores) / len(section_scores), 2) if section_scores else 0.0,
            "depth_warning_total": depth_warning_total,
        },
        "warnings": report_warnings,
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

    workflow = session.get("workflow")
    if isinstance(workflow, dict):
        workflow["stage"] = "compiled"

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
                    "quality_average_score": report.get("quality_summary", {}).get("average_advisory_score"),
                    "warning_count": len(report.get("warnings") or []),
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
