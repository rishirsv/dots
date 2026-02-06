#!/usr/bin/env python3
"""Approve a Talkbook v2 outline and unlock drafting flow."""

from __future__ import annotations

import argparse
from typing import Any, Dict

from common import load_session, save_session, utc_now_iso


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments for outline approval."""
    parser = argparse.ArgumentParser(description="Approve outline and advance workflow stage.")
    parser.add_argument("--session-id", required=True)
    parser.add_argument("--rationale", default="", help="Approval rationale captured in session log.")
    parser.add_argument(
        "--approval-source",
        choices=["user_confirmed", "auto_assumed"],
        default="user_confirmed",
        help="Source of the approval decision.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Approve even when no outline sections are present.",
    )
    return parser.parse_args()


def _approve(workflow: Dict[str, Any], now: str, rationale: str, source: str) -> None:
    """Apply normalized approval metadata to a workflow object."""
    workflow["outline_approval"] = {
        "status": "approved",
        "timestamp": now,
        "rationale": rationale,
        "approval_source": source,
    }


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    session = load_session(args.session_id)
    now = utc_now_iso()

    outline = session.get("outline") or {}
    outline_sections = outline.get("sections") or []
    if not args.force and not outline_sections:
        raise SystemExit("Cannot approve outline: no outline.sections found. Use upsert_outline.py first.")

    workflow = session.setdefault("workflow", {})
    mode = str(workflow.get("mode") or "outline_confirm")
    _approve(workflow, now, args.rationale, args.approval_source)

    if mode == "outline_confirm":
        workflow["outline_required"] = True
        workflow["stage"] = "outline_approved"
    else:
        workflow["outline_required"] = False
        workflow["stage"] = "drafting"

    actions = session.setdefault("actions", [])
    if isinstance(actions, list):
        actions.append(
            {
                "timestamp": now,
                "action": "outline_approved",
                "details": {
                    "mode": mode,
                    "approval_source": args.approval_source,
                    "stage": workflow.get("stage"),
                    "section_count": len(outline_sections),
                },
            }
        )

    paths = save_session(session)
    print(f"session={paths['session']}")
    print(f"workflow_stage={workflow.get('stage')}")
    print("approval_status=approved")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
