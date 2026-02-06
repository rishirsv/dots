#!/usr/bin/env python3
"""Insert or update structured outline content for a Talkbook v2 session."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

from common import DEPTH_PROFILES, load_session, save_session, utc_now_iso


def _normalize_outline_sections(raw_sections: List[Dict[str, Any]], default_depth: str) -> List[Dict[str, Any]]:
    """Normalize outline sections to the v2 required shape."""
    normalized: List[Dict[str, Any]] = []
    for idx, item in enumerate(raw_sections, start=1):
        if not isinstance(item, dict):
            raise SystemExit(f"outline.sections[{idx}] must be an object")

        section_id = str(item.get("section_id") or item.get("id") or "").strip()
        title = str(item.get("title") or "").strip()
        intent = str(item.get("intent") or "").strip()
        if not section_id or not title or not intent:
            raise SystemExit(
                f"outline.sections[{idx}] must include section_id, title, and intent."
            )

        depth_profile = str(item.get("depth_profile") or default_depth).lower()
        if depth_profile not in DEPTH_PROFILES:
            depth_profile = default_depth

        evidence_plan = item.get("evidence_plan") or []
        if not isinstance(evidence_plan, list):
            raise SystemExit(f"outline.sections[{idx}].evidence_plan must be a list")

        normalized.append(
            {
                "section_id": section_id,
                "title": title,
                "intent": intent,
                "archetype_id": str(item.get("archetype_id") or "").strip(),
                "depth_profile": depth_profile,
                "evidence_plan": [str(entry).strip() for entry in evidence_plan if str(entry).strip()],
                "decision_purpose": str(item.get("decision_purpose") or "").strip(),
            }
        )
    return normalized


def _read_outline_payload(args: argparse.Namespace) -> Dict[str, Any]:
    """Read outline payload from file or inline JSON."""
    if args.outline_file:
        payload = json.loads(Path(args.outline_file).read_text(encoding="utf-8"))
    elif args.outline_json:
        payload = json.loads(args.outline_json)
    else:
        raise SystemExit("Provide --outline-file or --outline-json.")

    if not isinstance(payload, dict):
        raise SystemExit("Outline payload must be a JSON object.")
    return payload


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments for outline updates."""
    parser = argparse.ArgumentParser(description="Insert or update a session outline.")
    parser.add_argument("--session-id", required=True)
    parser.add_argument("--outline-file", default=None, help="Path to JSON payload with outline sections.")
    parser.add_argument("--outline-json", default=None, help="Inline JSON payload with outline sections.")
    parser.add_argument(
        "--stage",
        default="outline_review",
        choices=["outline_draft", "outline_review"],
        help="Workflow stage to set after outline upsert in outline_confirm mode.",
    )
    parser.add_argument(
        "--assumption",
        action="append",
        default=None,
        help="Assumption note(s) to store on outline. Repeat flag for multiple assumptions.",
    )
    return parser.parse_args()


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    session = load_session(args.session_id)
    payload = _read_outline_payload(args)
    now = utc_now_iso()

    settings = session.get("settings") or {}
    default_depth = str(settings.get("depth_profile") or "detailed").lower()
    if default_depth not in DEPTH_PROFILES:
        default_depth = "detailed"

    raw_sections = payload.get("sections") or []
    if not isinstance(raw_sections, list) or not raw_sections:
        raise SystemExit("outline payload must include a non-empty sections list.")
    outline_sections = _normalize_outline_sections(raw_sections, default_depth)

    assumptions = payload.get("assumptions")
    if assumptions is None:
        assumptions = args.assumption or []
    if not isinstance(assumptions, list):
        raise SystemExit("outline assumptions must be a list of strings.")

    outline = session.setdefault("outline", {})
    outline["sections"] = outline_sections
    outline["assumptions"] = [str(item).strip() for item in assumptions if str(item).strip()]
    outline["updated_at"] = now

    workflow = session.setdefault("workflow", {})
    mode = str(workflow.get("mode") or "outline_confirm")
    if mode == "outline_confirm":
        workflow["stage"] = args.stage
        workflow["outline_required"] = True
        workflow["outline_approval"] = {
            "status": "pending",
            "timestamp": None,
            "rationale": "",
            "approval_source": None,
        }
    else:
        workflow["stage"] = "drafting"

    actions = session.setdefault("actions", [])
    if isinstance(actions, list):
        actions.append(
            {
                "timestamp": now,
                "action": "outline_upsert",
                "details": {
                    "section_count": len(outline_sections),
                    "stage": workflow.get("stage"),
                    "mode": mode,
                },
            }
        )

    paths = save_session(session)
    print(f"session={paths['session']}")
    print(f"outline_sections={len(outline_sections)}")
    print(f"workflow_stage={workflow.get('stage')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
