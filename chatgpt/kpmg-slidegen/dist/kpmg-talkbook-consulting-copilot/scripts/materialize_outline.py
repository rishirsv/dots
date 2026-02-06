#!/usr/bin/env python3
"""Materialize outline entries into section stubs for drafting."""

from __future__ import annotations

import argparse
from typing import Any, Dict, List

from common import load_session, save_session, utc_now_iso


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments for outline materialization."""
    parser = argparse.ArgumentParser(description="Materialize outline sections into draft section stubs.")
    parser.add_argument("--session-id", required=True)
    parser.add_argument(
        "--replace-existing",
        action="store_true",
        help="Replace existing section metadata/content when matching section ids exist.",
    )
    parser.add_argument(
        "--allow-unapproved",
        action="store_true",
        help="Allow materialization in outline_confirm mode before explicit approval.",
    )
    parser.add_argument(
        "--status",
        default="draft",
        choices=["draft", "approved", "locked"],
        help="Status assigned to newly created section stubs.",
    )
    return parser.parse_args()


def _empty_payload() -> Dict[str, Any]:
    """Return an empty authoring payload shell."""
    return {
        "headline_claim": "",
        "claims": [],
        "evidence_objects": [],
        "implications": [],
        "decision_ask": "",
        "source_anchors": [],
    }


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    session = load_session(args.session_id)
    now = utc_now_iso()

    workflow = session.setdefault("workflow", {})
    mode = str(workflow.get("mode") or "outline_confirm")
    stage = str(workflow.get("stage") or "intake")
    approval = workflow.get("outline_approval") or {}
    approved = str(approval.get("status") or "") == "approved"

    if mode == "outline_confirm" and not approved and not args.allow_unapproved:
        raise SystemExit("Cannot materialize outline: outline_confirm mode requires approval first.")

    outline = session.get("outline") or {}
    outline_sections = outline.get("sections") or []
    if not isinstance(outline_sections, list) or not outline_sections:
        raise SystemExit("No outline sections found. Use upsert_outline.py before materialize_outline.py.")

    sections = session.setdefault("sections", [])
    if not isinstance(sections, list):
        raise SystemExit("Invalid session schema: sections must be a list.")

    by_id = {}
    for section in sections:
        if isinstance(section, dict):
            by_id[str(section.get("id"))] = section

    created = 0
    updated = 0
    for idx, outline_section in enumerate(outline_sections, start=1):
        if not isinstance(outline_section, dict):
            continue
        section_id = str(outline_section.get("section_id") or "").strip()
        if not section_id:
            continue

        expected = by_id.get(section_id)
        if expected is not None and not args.replace_existing:
            expected["title"] = str(outline_section.get("title") or expected.get("title") or section_id)
            expected["intent"] = str(outline_section.get("intent") or expected.get("intent") or "general")
            expected["archetype_id"] = str(outline_section.get("archetype_id") or expected.get("archetype_id") or "")
            expected["depth_profile"] = str(outline_section.get("depth_profile") or expected.get("depth_profile") or "detailed")
            expected["outline_section_id"] = section_id
            expected["updated_at"] = now
            updated += 1
            continue

        if expected is None:
            expected = {}
            sections.append(expected)
            created += 1
        else:
            updated += 1

        expected["id"] = section_id
        expected["title"] = str(outline_section.get("title") or section_id)
        expected["intent"] = str(outline_section.get("intent") or "general")
        expected["content"] = ""
        expected["layout_slug"] = expected.get("layout_slug")
        expected["archetype_id"] = str(outline_section.get("archetype_id") or "")
        expected["outline_section_id"] = section_id
        expected["depth_profile"] = str(outline_section.get("depth_profile") or session.get("settings", {}).get("depth_profile") or "detailed")
        expected["variant"] = str(expected.get("variant") or "auto")
        expected["expected_slides"] = int(expected.get("expected_slides") or 1)
        expected["status"] = args.status
        expected["sources"] = list(expected.get("sources") or [])
        expected["authoring_payload"] = _empty_payload()
        expected.setdefault("created_at", now)
        expected["updated_at"] = now
        expected["order"] = idx * 10

    sections[:] = sorted(
        [section for section in sections if isinstance(section, dict)],
        key=lambda item: int(item.get("order", 10_000)),
    )
    for idx, section in enumerate(sections, start=1):
        section["order"] = idx * 10

    if mode == "one_shot" and not approved:
        workflow["outline_approval"] = {
            "status": "approved",
            "timestamp": now,
            "rationale": "Auto-approved while materializing one-shot outline.",
            "approval_source": "auto_assumed",
        }

    if mode == "outline_confirm" and approved:
        workflow["stage"] = "drafting"
    elif mode == "one_shot":
        workflow["stage"] = "drafting"
    elif stage in {"outline_draft", "outline_review"} and args.allow_unapproved:
        workflow["stage"] = "drafting"

    actions = session.setdefault("actions", [])
    if isinstance(actions, list):
        actions.append(
            {
                "timestamp": now,
                "action": "outline_materialized",
                "details": {
                    "created_sections": created,
                    "updated_sections": updated,
                    "mode": mode,
                    "stage": workflow.get("stage"),
                    "replace_existing": bool(args.replace_existing),
                },
            }
        )

    paths = save_session(session)
    print(f"session={paths['session']}")
    print(f"created_sections={created}")
    print(f"updated_sections={updated}")
    print(f"workflow_stage={workflow.get('stage')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
