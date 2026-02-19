#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, obj: Any) -> None:
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _split_bullets(value: str) -> list[str]:
    """
    Accept a single paragraph or a '||'-separated list of bullets.
    """
    if "||" not in value:
        v = value.strip()
        return [v] if v else []
    parts = [p.strip() for p in value.split("||")]
    return [p for p in parts if p]


def _section_lines(header: str, bullets: list[str]) -> list[Any]:
    """
    Render section header as a header line followed by flat bullet lines.

    IMPORTANT: Keep this flat (no nested arrays). In PowerPoint rendering, nested bullet
    arrays can collapse into a single "blocky" bullet paragraph. A flat list reliably
    produces multiple visible bullets per section.
    """
    lines: list[Any] = [f"{header}:"]
    for b in bullets:
        v = (b or "").strip()
        if v:
            lines.append(v)
    return lines


def build_slide(
    *,
    name: str,
    strapline: str,
    icon: str,
    screenshot_caption: str,
    problem: list[str],
    how: list[str],
    outcome: list[str],
) -> dict[str, Any]:
    left_body: list[Any] = []
    left_body.extend(_section_lines("Problem", problem))
    left_body.extend(_section_lines("How we solve it", how))
    left_body.extend(_section_lines("Outcome / ROI", outcome))

    return {
        "type": "twoColumnText",
        "title": name,
        "strapline": strapline,
        "leftBody": left_body,
        "rightBody": [" "],
        "iconPlacement": "titleLeft",
        "icon": icon,
        "style": {"bodyFontSize": 11, "straplineFontSize": 11, "iconSize": 0.62},
        "screenshotPlaceholder": {"caption": screenshot_caption},
    }


def main() -> int:
    p = argparse.ArgumentParser(description="Add a GPT one-pager slide to the TS Custom GPT inventory deck.")
    p.add_argument(
        "--deck-spec",
        default="samples/ts-custom-gpts-portfolio.json",
        help="Path to deck spec JSON (relative to kpmg-slidegen root).",
    )
    p.add_argument("--name", required=True, help="GPT name (slide title).")
    p.add_argument("--strapline", required=True, help="1-sentence strapline (no technical terms).")
    p.add_argument("--icon", required=True, help="Path to icon image (PNG preferred; SVG allowed).")
    p.add_argument("--screenshot-caption", required=True, help="1 sentence describing the screenshot to add later.")
    p.add_argument(
        "--problem",
        required=True,
        help="Problem bullet(s). Use '||' to separate multiple bullets; aim for 2–3 bullets and keep each bullet 2–3 sentences.",
    )
    p.add_argument(
        "--how",
        required=True,
        help="How we solve it bullet(s). Use '||' to separate multiple bullets; aim for 2–3 bullets and keep each bullet 2–3 sentences.",
    )
    p.add_argument(
        "--outcome",
        required=True,
        help="Outcome/ROI bullet(s). Use '||' to separate multiple bullets; aim for 2–3 bullets and keep each bullet 2–3 sentences.",
    )
    p.add_argument(
        "--insert-after-title",
        default=None,
        help="Optional: insert after a slide with this exact title; otherwise append before back cover.",
    )
    args = p.parse_args()

    # Resolve project root from this script location: dist/kpmg-gpt-inventory/scripts
    project_root = Path(__file__).resolve().parents[3]
    deck_path = (project_root / args.deck_spec).resolve()
    deck = _load_json(deck_path)

    slides = deck.get("slides", [])
    if not isinstance(slides, list):
        raise SystemExit("Deck spec invalid: 'slides' must be a list.")

    new_slide = build_slide(
        name=args.name.strip(),
        strapline=args.strapline.strip(),
        icon=args.icon.strip(),
        screenshot_caption=args.screenshot_caption.strip(),
        problem=_split_bullets(args.problem),
        how=_split_bullets(args.how),
        outcome=_split_bullets(args.outcome),
    )

    # Insert logic: default to before backCover if present.
    back_idx = next((i for i, s in enumerate(slides) if isinstance(s, dict) and s.get("type") == "backCover"), None)
    insert_idx = back_idx if back_idx is not None else len(slides)

    if args.insert_after_title:
        for i, s in enumerate(slides):
            if isinstance(s, dict) and s.get("title") == args.insert_after_title:
                insert_idx = i + 1
                break

    slides.insert(insert_idx, new_slide)
    deck["slides"] = slides
    _write_json(deck_path, deck)
    print(f"Updated deck spec: {deck_path}")
    print(f"Inserted slide at index: {insert_idx}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
