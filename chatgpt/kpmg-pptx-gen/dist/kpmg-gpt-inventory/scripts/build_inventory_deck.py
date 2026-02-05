#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any


def _run(cmd: list[str], *, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=str(cwd), text=True, capture_output=True)


def _ts() -> str:
    return datetime.now().strftime("%Y-%m-%d_%H%M%S")


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def _ensure_node_deps(runtime_root: Path) -> None:
    """
    Ensure the vendored runtime has its Node dependencies installed.
    We intentionally do NOT commit node_modules in dist bundles.
    """
    if (runtime_root / "node_modules").exists():
        return
    p = subprocess.run(["npm", "ci"], cwd=str(runtime_root), text=True)
    if p.returncode != 0:
        raise SystemExit("npm ci failed in the vendored runtime.")


def main() -> int:
    p = argparse.ArgumentParser(description="Generate and inspect the TS Custom GPT inventory deck.")
    p.add_argument(
        "--deck-spec",
        default="deck/ts-custom-gpts-portfolio.json",
        help="Path to deck spec JSON (relative to this dist bundle).",
    )
    p.add_argument(
        "--out-dir",
        default=None,
        help="Output directory (default: outputs/runs/<timestamp>/ts-custom-gpts) under this dist bundle.",
    )
    p.add_argument("--no-strict", action="store_true", help="Disable strict overlap checks.")
    args = p.parse_args()

    dist_root = Path(__file__).resolve().parents[1]
    runtime_root = dist_root / "runtime" / "kpmg-diligence"
    deck_path = (dist_root / args.deck_spec).resolve()
    run_id = _ts()
    if args.out_dir:
        candidate = Path(args.out_dir)
        out_dir = candidate.resolve() if candidate.is_absolute() else (dist_root / candidate).resolve()
    else:
        out_dir = (dist_root / "outputs" / "runs" / run_id / "ts-custom-gpts").resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    pptx_path = out_dir / "deck.pptx"

    if not runtime_root.exists():
        raise SystemExit(f"Missing vendored runtime: {runtime_root}")
    if not deck_path.exists():
        raise SystemExit(f"Missing deck spec: {deck_path}")

    _ensure_node_deps(runtime_root)

    # 1) Validate (run from dist_root so relative asset paths resolve from the bundle root)
    validate_js = runtime_root / "generator" / "validate.js"
    v = _run(["node", str(validate_js), "--in", str(deck_path)], cwd=dist_root)
    if v.returncode != 0:
        print(v.stdout)
        print(v.stderr)
        raise SystemExit("Validation failed.")

    # 2) Generate (strict is optional but recommended)
    strict_enabled = not args.no_strict
    index_js = runtime_root / "generator" / "index.js"
    cmd = ["node", str(index_js), "--in", str(deck_path), "--out", str(pptx_path)]
    if not strict_enabled:
        cmd.append("--no-strict")
    g = subprocess.run(cmd, cwd=str(dist_root), text=True)
    if g.returncode != 0:
        raise SystemExit("Deck generation failed.")

    inspect_dir = out_dir / "inspect"
    strict_summary = inspect_dir / "strict-summary.json" if strict_enabled else None

    overlaps = None
    severe = None
    out_of_bounds = None
    warnings = []
    missing_slots = []
    fallbacks = []

    if strict_summary and strict_summary.exists():
        data = _read_json(strict_summary)
        overlaps = data.get("overlaps")
        severe = (overlaps or {}).get("severeCount") if isinstance(overlaps, dict) else None
        bounds = data.get("bounds") or {}
        out_of_bounds = bounds.get("outOfBoundsCount") if isinstance(bounds, dict) else None
        warnings = data.get("warnings") or []
        missing_slots = data.get("missingSlots") or []
        fallbacks = data.get("fallbacks") or []

    report = []
    report.append("# Deck build + inspection report")
    report.append("")
    report.append(f"- Deck spec: `{deck_path}`")
    report.append(f"- PPTX: `{pptx_path}`")
    if strict_summary:
        report.append(f"- Strict summary: `{strict_summary}`")
    report.append("")

    if severe is not None:
        report.append(f"## Strict overlap summary")
        report.append(f"- Severe overlaps: `{severe}`")
        report.append("")

    if out_of_bounds is not None:
        report.append("## Strict bounds")
        report.append(f"- Out-of-bounds elements: `{out_of_bounds}`")
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
    if strict_enabled:
        print(f"Inspect: {inspect_dir}")

    # Non-zero exit if severe overlaps detected.
    if isinstance(severe, int) and severe > 0:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
