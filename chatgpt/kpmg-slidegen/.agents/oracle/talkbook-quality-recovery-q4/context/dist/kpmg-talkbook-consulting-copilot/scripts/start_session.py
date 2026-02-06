#!/usr/bin/env python3
"""Create a new manual Talkbook co-writing session."""

from __future__ import annotations

import argparse
from typing import Any, Dict

from common import DEPTH_PROFILES, ensure_dir, make_session_id, save_session, session_paths, utc_now_iso


def build_initial_session(args: argparse.Namespace) -> Dict[str, Any]:
    """Build an initial session object from CLI args."""
    session_id = args.session_id or make_session_id(args.topic)
    created = utc_now_iso()
    workflow_mode = "one_shot" if args.skip_outline else args.workflow
    outline_required = workflow_mode == "outline_confirm"
    if workflow_mode == "one_shot":
        assumptions = args.assumption or ["One-shot mode enabled; assumptions inferred from topic and defaults."]
        outline_approval = {
            "status": "approved",
            "timestamp": created,
            "rationale": "Bypass requested via one-shot workflow.",
            "approval_source": "auto_assumed",
        }
        workflow_stage = "drafting"
    else:
        assumptions = []
        outline_approval = {
            "status": "pending",
            "timestamp": None,
            "rationale": "",
            "approval_source": None,
        }
        workflow_stage = "intake"

    return {
        "version": "2.0",
        "session_id": session_id,
        "topic": args.topic,
        "created_at": created,
        "updated_at": created,
        "deck": {
            "title": args.title or args.topic,
            "audience": args.audience,
            "target_slides": args.target_slides,
            "template": "kpmg-talkbook",
            "mode": "manual",
        },
        "settings": {
            "citation_mode": args.citation_mode,
            "strict_mode": True,
            "manual_only": True,
            "depth_profile": args.depth_profile,
        },
        "workflow": {
            "mode": workflow_mode,
            "stage": workflow_stage,
            "outline_required": outline_required,
            "outline_approval": outline_approval,
        },
        "outline": {
            "sections": [],
            "assumptions": assumptions,
            "updated_at": created,
        },
        "sections": [],
        "sources": [],
        "actions": [
            {
                "timestamp": created,
                "action": "session_started",
                "details": {
                    "topic": args.topic,
                    "target_slides": args.target_slides,
                    "citation_mode": args.citation_mode,
                    "workflow": workflow_mode,
                    "depth_profile": args.depth_profile,
                },
            }
        ],
    }


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments for session creation."""
    parser = argparse.ArgumentParser(description="Start a manual Talkbook consulting copilot session.")
    parser.add_argument("--topic", required=True, help="Topic to expand into a consulting-style deck.")
    parser.add_argument("--session-id", default=None, help="Optional explicit session id.")
    parser.add_argument("--title", default=None, help="Optional deck title override.")
    parser.add_argument("--audience", default="Executive leadership", help="Primary deck audience.")
    parser.add_argument("--target-slides", type=int, default=30, help="Target deck length.")
    parser.add_argument(
        "--workflow",
        default="outline_confirm",
        choices=["outline_confirm", "one_shot"],
        help="Drafting workflow mode. outline_confirm requires explicit outline approval before drafting.",
    )
    parser.add_argument(
        "--depth-profile",
        default="detailed",
        choices=list(DEPTH_PROFILES),
        help="Default writing depth profile used when sections do not override it.",
    )
    parser.add_argument(
        "--skip-outline",
        action="store_true",
        help="Alias for one_shot mode; bypasses explicit outline confirmation.",
    )
    parser.add_argument(
        "--assumption",
        action="append",
        default=None,
        help="Assumption note captured in one_shot mode. Repeat flag to add multiple assumptions.",
    )
    parser.add_argument(
        "--citation-mode",
        default="notes_appendix",
        choices=["none", "notes", "appendix", "notes_appendix"],
        help="How citations should be represented in outputs.",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing session folder if it exists.")
    return parser.parse_args()


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    session = build_initial_session(args)
    paths = session_paths(session["session_id"])

    # Prevent accidental session collisions unless explicitly forced.
    if paths["base"].exists() and not args.force:
        raise SystemExit(
            f"Session already exists: {paths['base']}\n"
            "Use --session-id for a new id or pass --force to overwrite."
        )

    ensure_dir(paths["base"])
    ensure_dir(paths["outputs"])
    written = save_session(session)

    print(f"session_id={session['session_id']}")
    print(f"session={written['session']}")
    print(f"working_draft={written['draft']}")
    print(f"sources={written['sources']}")
    print(f"outputs={written['outputs']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
