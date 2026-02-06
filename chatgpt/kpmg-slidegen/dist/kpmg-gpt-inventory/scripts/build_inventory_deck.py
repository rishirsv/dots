#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any


def _run(cmd: list[str], *, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=str(cwd), text=True, capture_output=True)


def _ts() -> str:
    return datetime.now().strftime("%Y-%m-%d_%H%M%S")


def _latest_dir(path: Path) -> Path | None:
    if not path.exists():
        return None
    dirs = [p for p in path.iterdir() if p.is_dir()]
    if not dirs:
        return None
    return max(dirs, key=lambda d: d.stat().st_mtime)


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def _write_html_index(img_dir: Path) -> None:
    imgs = sorted(img_dir.glob("slide-*.png"))
    items = "\n".join([f'<div class="card"><div class="label">{p.name}</div><img src="{p.name}"></div>' for p in imgs])
    html = f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Deck Inspection</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 16px; }}
    .grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }}
    .card {{ border: 1px solid #ddd; padding: 12px; border-radius: 8px; }}
    .label {{ font-size: 12px; color: #00338D; font-weight: 700; margin-bottom: 8px; }}
    img {{ width: 100%; height: auto; display: block; }}
  </style>
</head>
<body>
  <h2>Deck Inspection</h2>
  <div class="grid">
    {items}
  </div>
</body>
</html>
"""
    _write_text(img_dir / "index.html", html)


def main() -> int:
    p = argparse.ArgumentParser(description="Generate and inspect the TS Custom GPT inventory deck.")
    p.add_argument(
        "--deck-spec",
        default="samples/ts-custom-gpts-portfolio.json",
        help="Path to deck spec JSON (relative to kpmg-slidegen root).",
    )
    p.add_argument(
        "--out-dir",
        default=None,
        help="Output directory (default: outputs/runs/<timestamp>/ts-custom-gpts).",
    )
    p.add_argument("--strict", action="store_true", default=True, help=argparse.SUPPRESS)
    p.add_argument("--no-strict", action="store_true", help="Disable strict overlap checks.")
    p.add_argument("--dpi", type=int, default=200, help="PNG render DPI (default 200).")
    args = p.parse_args()

    project_root = Path(__file__).resolve().parents[3]
    deck_path = (project_root / args.deck_spec).resolve()
    run_id = _ts()
    out_dir = Path(args.out_dir) if args.out_dir else (project_root / "outputs" / "runs" / run_id / "ts-custom-gpts")
    out_dir.mkdir(parents=True, exist_ok=True)
    pptx_path = out_dir / "deck.pptx"

    # 1) Validate
    v = _run(["node", "generator/validate.js", "--in", str(deck_path)], cwd=project_root)
    if v.returncode != 0:
        print(v.stdout)
        print(v.stderr)
        raise SystemExit("Validation failed.")

    # 2) Generate (strict is optional but recommended)
    strict_enabled = not args.no_strict
    cmd = ["node", "generator/index.js", "--in", str(deck_path), "--out", str(pptx_path)]
    if strict_enabled:
        cmd.append("--strict")
    g = subprocess.run(cmd, cwd=str(project_root), text=True)
    if g.returncode != 0:
        raise SystemExit("Deck generation failed.")

    # 3) Render PNGs via PDF
    img_dir = out_dir / "deck_pdf_png"
    img_dir.mkdir(parents=True, exist_ok=True)

    # Import render utilities without requiring packaging.
    import sys

    sys.path.insert(0, str(project_root))
    from qa.render import render_pptx_to_pngs_via_pdf  # type: ignore

    try:
        render_pptx_to_pngs_via_pdf(pptx_path, img_dir, dpi=args.dpi)
    except Exception as e:
        raise SystemExit(f"Render failed. Ensure `soffice` and `pdftoppm` are installed. Error: {e}")

    _write_html_index(img_dir)

    # 4) Collect strict summary (best effort)
    strict_dir = _latest_dir(project_root / "outputs" / "strict") if strict_enabled else None
    strict_summary = (strict_dir / "strict-summary.json") if strict_dir else None

    overlaps = None
    severe = None
    warnings = []
    missing_slots = []
    fallbacks = []
    overflow = None

    if strict_summary and strict_summary.exists():
        data = _read_json(strict_summary)
        overlaps = data.get("overlaps")
        severe = (overlaps or {}).get("severeCount") if isinstance(overlaps, dict) else None
        warnings = data.get("warnings") or []
        missing_slots = data.get("missingSlots") or []
        fallbacks = data.get("fallbacks") or []
        overflow = data.get("overflow")

    report = []
    report.append("# Deck build + inspection report")
    report.append("")
    report.append(f"- Deck spec: `{deck_path}`")
    report.append(f"- PPTX: `{pptx_path}`")
    report.append(f"- PNGs: `{img_dir}` (open `index.html`)")
    if strict_summary:
        report.append(f"- Strict summary: `{strict_summary}`")
    report.append("")

    if severe is not None:
        report.append(f"## Strict overlap summary")
        report.append(f"- Severe overlaps: `{severe}`")
        report.append("")

    if overflow is not None:
        report.append("## Strict overflow")
        report.append(f"- Status: `{overflow}`")
        report.append("")

    if warnings:
        report.append("## Warnings")
        for w in warnings:
            report.append(f"- {w}")
        report.append("")

    if missing_slots:
        report.append("## Missing required fields")
        for m in missing_slots:
            report.append(f"- {m}")
        report.append("")

    if fallbacks:
        report.append("## Layout fallbacks (check visually)")
        for f in fallbacks:
            report.append(f"- {f}")
        report.append("")

    report_path = out_dir / "inspection_report.md"
    _write_text(report_path, "\n".join(report) + "\n")
    print(f"Wrote: {report_path}")
    print(f"PPTX: {pptx_path}")
    print(f"PNGs: {img_dir}")

    # Non-zero exit if severe overlaps detected.
    if isinstance(severe, int) and severe > 0:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
