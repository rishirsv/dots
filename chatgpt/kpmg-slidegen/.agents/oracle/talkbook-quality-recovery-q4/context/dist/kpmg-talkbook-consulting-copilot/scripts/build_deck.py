#!/usr/bin/env python3
"""Build and inspect a Talkbook deck from compiled native JSON."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from common import read_json, save_session, session_paths, utc_now_iso, write_json


@dataclass
class CommandResult:
    """Captured subprocess execution result."""

    code: int
    stdout: str
    stderr: str


def _run(cmd: List[str], cwd: Path) -> CommandResult:
    """Run a subprocess and capture stdout/stderr."""
    proc = subprocess.run(cmd, cwd=str(cwd), capture_output=True, text=True)
    return CommandResult(proc.returncode, proc.stdout, proc.stderr)


def _iso_stamp() -> str:
    """Return a compact UTC timestamp used in output folder naming."""
    return datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")


def _rect_overlap(a: Dict[str, float], b: Dict[str, float]) -> float:
    """Compute the overlapping area between two rectangles."""
    x1 = max(a["x"], b["x"])
    y1 = max(a["y"], b["y"])
    x2 = min(a["x"] + a["w"], b["x"] + b["w"])
    y2 = min(a["y"] + a["h"], b["y"] + b["h"])
    if x2 <= x1 or y2 <= y1:
        return 0.0
    return (x2 - x1) * (y2 - y1)


def _strict_from_manifest(manifest: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
    """Build overlap/bounds/summary reports from generator manifest data."""
    slides = manifest.get("slides") or []
    dims = manifest.get("dimensions") or {"w": 13.333, "h": 7.5}
    dim_w = float(dims.get("w", 13.333))
    dim_h = float(dims.get("h", 7.5))

    overlap_records: List[Dict[str, Any]] = []
    bounds_records: List[Dict[str, Any]] = []
    warnings: List[Dict[str, Any]] = []

    severe = 0
    warning = 0

    for slide in slides:
        idx = int(slide.get("index", 0))
        shapes = slide.get("shapes") or []

        for item in slide.get("warnings") or []:
            warnings.append({"slideIndex": idx, **item})

        for shape in shapes:
            x = float(shape.get("x", 0))
            y = float(shape.get("y", 0))
            w = float(shape.get("w", 0))
            h = float(shape.get("h", 0))
            if x < 0 or y < 0 or x + w > dim_w or y + h > dim_h:
                bounds_records.append(
                    {
                        "slideIndex": idx,
                        "shapeId": shape.get("id"),
                        "slot": shape.get("slot"),
                        "x": x,
                        "y": y,
                        "w": w,
                        "h": h,
                        "dimensions": {"w": dim_w, "h": dim_h},
                    }
                )

        for i, left in enumerate(shapes):
            for right in shapes[i + 1 :]:
                overlap_area = _rect_overlap(left, right)
                if overlap_area <= 1e-6:
                    continue

                left_area = max(1e-6, float(left.get("w", 0)) * float(left.get("h", 0)))
                right_area = max(1e-6, float(right.get("w", 0)) * float(right.get("h", 0)))
                ratio = overlap_area / min(left_area, right_area)

                label = "warning"
                if ratio >= 0.18:
                    label = "severe"
                    severe += 1
                else:
                    warning += 1

                overlap_records.append(
                    {
                        "slideIndex": idx,
                        "left": {"id": left.get("id"), "slot": left.get("slot")},
                        "right": {"id": right.get("id"), "slot": right.get("slot")},
                        "overlapArea": overlap_area,
                        "ratio": ratio,
                        "severity": label,
                    }
                )

    overlap_report = {
        "slideCount": len(slides),
        "records": overlap_records,
        "summary": {
            "slideCount": len(slides),
            "overlapCount": len(overlap_records),
            "severeCount": severe,
            "warningCount": warning,
            "containmentCount": 0,
        },
    }

    bounds_report = {
        "slideCount": len(slides),
        "dimensions": {"w": dim_w, "h": dim_h},
        "outOfBoundsCount": len(bounds_records),
        "records": bounds_records,
    }

    strict_summary = {
        "valid": True,
        "validationErrors": [],
        "overlaps": overlap_report["summary"],
        "bounds": {
            "slideCount": len(slides),
            "outOfBoundsCount": len(bounds_records),
            "dimensions": {"w": dim_w, "h": dim_h},
        },
        "warnings": warnings,
        "missingSlots": [],
        "fallbacks": [],
    }
    return overlap_report, bounds_report, strict_summary


def _render_pngs_from_pptx(pptx_path: Path, out_dir: Path, dpi: int) -> Optional[str]:
    """Render PPTX pages into PNG files via LibreOffice + pdftoppm if available."""
    soffice = shutil.which("soffice")
    pdftoppm = shutil.which("pdftoppm")
    if not soffice or not pdftoppm:
        return "PNG render skipped: missing `soffice` and/or `pdftoppm`."

    ensure = out_dir
    ensure.mkdir(parents=True, exist_ok=True)
    pdf_dir = out_dir.parent / "candidate_pdf"
    pdf_dir.mkdir(parents=True, exist_ok=True)

    pdf_result = subprocess.run(
        [soffice, "--headless", "--convert-to", "pdf", "--outdir", str(pdf_dir), str(pptx_path)],
        capture_output=True,
        text=True,
    )
    if pdf_result.returncode != 0:
        return f"PNG render skipped: failed PPTX->PDF conversion: {pdf_result.stderr.strip()}"

    candidate_pdf = pdf_dir / f"{pptx_path.stem}.pdf"
    if not candidate_pdf.exists():
        # LibreOffice may generate a generic output name in some environments.
        pdfs = sorted(pdf_dir.glob("*.pdf"))
        if not pdfs:
            return "PNG render skipped: no PDF produced by LibreOffice."
        candidate_pdf = pdfs[-1]

    prefix = out_dir / "candidate"
    png_result = subprocess.run(
        [pdftoppm, "-png", "-r", str(dpi), str(candidate_pdf), str(prefix)],
        capture_output=True,
        text=True,
    )
    if png_result.returncode != 0:
        return f"PNG render skipped: failed PDF->PNG conversion: {png_result.stderr.strip()}"

    generated = sorted(out_dir.glob("candidate-*.png"))
    for idx, file in enumerate(generated, start=1):
        file.rename(out_dir / f"candidate-{idx:02d}.png")
    return None


def _render_reference_pngs(reference_pdf: Path, out_dir: Path, dpi: int) -> Optional[str]:
    """Render reference PDF pages into PNG files."""
    pdftoppm = shutil.which("pdftoppm")
    if not pdftoppm:
        return "Reference render skipped: missing `pdftoppm`."
    out_dir.mkdir(parents=True, exist_ok=True)

    prefix = out_dir / "reference"
    result = subprocess.run(
        [pdftoppm, "-png", "-r", str(dpi), str(reference_pdf), str(prefix)],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return f"Reference render skipped: {result.stderr.strip()}"

    generated = sorted(out_dir.glob("reference-*.png"))
    for idx, file in enumerate(generated, start=1):
        file.rename(out_dir / f"reference-{idx:02d}.png")
    return None


def _apply_auto_fixes(deck: Dict[str, Any], manifest: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Apply conservative slot-level fixes for overflow-risk warnings."""
    slides = deck.get("slides") or []
    fixes: List[Dict[str, Any]] = []

    for slide in manifest.get("slides") or []:
        slide_idx = int(slide.get("index", -1))
        if slide_idx < 0 or slide_idx >= len(slides):
            continue

        warnings = [w for w in (slide.get("warnings") or []) if w.get("kind") == "overflow-risk"]
        if not warnings:
            continue

        slide_spec = slides[slide_idx]
        slots = slide_spec.get("slots") or {}
        if not isinstance(slots, dict):
            continue

        for warn in warnings:
            slot = warn.get("slot")
            if not slot or slot not in slots:
                continue
            value = slots.get(slot)

            if isinstance(value, list):
                if len(value) > 3:
                    removed = len(value) - 3
                    slots[slot] = value[:3]
                    fixes.append(
                        {
                            "slideIndex": slide_idx,
                            "slot": slot,
                            "fix": "truncate_list",
                            "removed_items": removed,
                        }
                    )
                else:
                    flattened = [str(item)[:110] for item in value]
                    slots[slot] = flattened
                    fixes.append(
                        {
                            "slideIndex": slide_idx,
                            "slot": slot,
                            "fix": "trim_list_items",
                            "max_chars": 110,
                        }
                    )
            elif isinstance(value, str):
                trimmed = value[: min(len(value), 160)].rstrip()
                if trimmed != value:
                    slots[slot] = trimmed
                    fixes.append(
                        {
                            "slideIndex": slide_idx,
                            "slot": slot,
                            "fix": "trim_text",
                            "max_chars": 160,
                        }
                    )

        slide_spec["slots"] = slots

    return fixes


def _write_inspection_report(path: Path, strict_summary: Dict[str, Any], manifest_path: Path, pptx_path: Path) -> None:
    """Write a concise markdown inspection summary."""
    overlaps = strict_summary.get("overlaps") or {}
    bounds = strict_summary.get("bounds") or {}
    warnings = strict_summary.get("warnings") or []

    lines = [
        "# Deck Inspection Report",
        "",
        f"- PPTX: `{pptx_path}`",
        f"- Manifest: `{manifest_path}`",
        f"- Severe overlaps: `{overlaps.get('severeCount', 0)}`",
        f"- Warning overlaps: `{overlaps.get('warningCount', 0)}`",
        f"- Out of bounds: `{bounds.get('outOfBoundsCount', 0)}`",
        f"- Overflow warnings: `{len(warnings)}`",
        "",
    ]

    if warnings:
        lines.append("## Warnings")
        for warning in warnings[:40]:
            lines.append(f"- Slide {warning.get('slideIndex')}: {warning.get('message')}")
        lines.append("")

    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def _run_generator(deck_json: Path, out_pptx: Path, manifest_path: Path, skill_root: Path) -> CommandResult:
    """Invoke the Node runtime generator."""
    script = skill_root / "runtime" / "generator" / "index.js"
    cmd = ["node", str(script), "--in", str(deck_json), "--out", str(out_pptx), "--manifest", str(manifest_path)]
    return _run(cmd, cwd=skill_root)


def _round_passed(strict_summary: Dict[str, Any]) -> bool:
    """Return True when strict criteria are satisfied for one candidate round."""
    overlaps = strict_summary.get("overlaps") or {}
    bounds = strict_summary.get("bounds") or {}
    warnings = [w for w in (strict_summary.get("warnings") or []) if w.get("kind") != "render"]
    return (
        int(overlaps.get("severeCount", 0)) == 0
        and int(overlaps.get("warningCount", 0)) == 0
        and int(bounds.get("outOfBoundsCount", 0)) == 0
        and len(warnings) == 0
    )


def _single_build(deck_json: Path, out_dir: Path, out_name: str, strict: bool, dpi: int, skill_root: Path) -> Tuple[int, Dict[str, Any]]:
    """Run one generate + inspect pass and return status and strict summary."""
    out_dir.mkdir(parents=True, exist_ok=True)
    inspect_dir = out_dir / "inspect"
    inspect_dir.mkdir(parents=True, exist_ok=True)

    out_pptx = out_dir / out_name
    manifest_path = out_dir / "manifest.json"

    gen = _run_generator(deck_json, out_pptx, manifest_path, skill_root)
    if gen.code != 0:
        sys.stdout.write(gen.stdout)
        sys.stderr.write(gen.stderr)
        raise SystemExit(f"Deck generation failed for {deck_json}")

    manifest = read_json(manifest_path)
    overlap_report, bounds_report, strict_summary = _strict_from_manifest(manifest)

    write_json(inspect_dir / "overlap-report.json", overlap_report)
    write_json(inspect_dir / "bounds-report.json", bounds_report)
    write_json(inspect_dir / "strict-summary.json", strict_summary)
    _write_inspection_report(inspect_dir / "inspection_report.md", strict_summary, manifest_path, out_pptx)

    render_note = _render_pngs_from_pptx(out_pptx, out_dir / "candidate_png", dpi)
    if render_note:
        strict_summary.setdefault("warnings", []).append({"kind": "render", "message": render_note, "slideIndex": -1})
        write_json(inspect_dir / "strict-summary.json", strict_summary)

    status = 0
    if strict and not _round_passed(strict_summary):
        status = 2
    return status, strict_summary


def _iterative_build(
    deck_json: Path,
    run_dir: Path,
    strict: bool,
    max_rounds: int,
    dpi: int,
    skill_root: Path,
    require_human_approval: bool,
    human_approved: bool,
    reference_pdf: Optional[Path],
) -> int:
    """Run iterative formatting passes until checks pass or max rounds are reached."""
    run_dir.mkdir(parents=True, exist_ok=True)

    if reference_pdf and reference_pdf.exists():
        note = _render_reference_pngs(reference_pdf, run_dir / "reference_png", dpi)
        if note:
            (run_dir / "reference_png" / "README.txt").write_text(note + "\n", encoding="utf-8")

    working_deck_path = run_dir / "deck.working.json"
    shutil.copyfile(deck_json, working_deck_path)

    failures: List[str] = []
    accepted = False
    last_summary: Dict[str, Any] = {}

    for round_idx in range(1, max_rounds + 1):
        round_dir = run_dir / f"round-{round_idx:02d}"
        out_pptx = round_dir / "candidate.pptx"
        manifest_path = round_dir / "manifest.json"
        inspect_dir = round_dir / "inspect"
        inspect_dir.mkdir(parents=True, exist_ok=True)

        gen = _run_generator(working_deck_path, out_pptx, manifest_path, skill_root)
        if gen.code != 0:
            failures.append(f"round {round_idx}: generator failed")
            break

        manifest = read_json(manifest_path)
        overlap_report, bounds_report, strict_summary = _strict_from_manifest(manifest)
        last_summary = strict_summary

        write_json(inspect_dir / "overlap-report.json", overlap_report)
        write_json(inspect_dir / "bounds-report.json", bounds_report)
        write_json(inspect_dir / "strict-summary.json", strict_summary)

        render_note = _render_pngs_from_pptx(out_pptx, round_dir / "candidate_png", dpi)
        if render_note:
            strict_summary.setdefault("warnings", []).append({"kind": "render", "message": render_note, "slideIndex": -1})
            write_json(inspect_dir / "strict-summary.json", strict_summary)

        passed = (not strict) or _round_passed(strict_summary)

        summary_lines = [
            f"# Round {round_idx:02d}",
            "",
            f"- severe_overlaps: {strict_summary.get('overlaps', {}).get('severeCount', 0)}",
            f"- warning_overlaps: {strict_summary.get('overlaps', {}).get('warningCount', 0)}",
            f"- out_of_bounds: {strict_summary.get('bounds', {}).get('outOfBoundsCount', 0)}",
            f"- warnings: {len(strict_summary.get('warnings') or [])}",
            f"- passed: {passed}",
            "",
        ]

        if passed:
            accepted = not require_human_approval or human_approved
            if require_human_approval and not human_approved:
                failures.append("Waiting for human visual approval.")
            (round_dir / "round_summary.md").write_text("\n".join(summary_lines), encoding="utf-8")
            break

        deck = read_json(working_deck_path)
        fixes = _apply_auto_fixes(deck, manifest)
        write_json(round_dir / "applied_fixes.json", {"round": round_idx, "fixes": fixes})
        write_json(working_deck_path, deck)

        if not fixes:
            failures.append(f"round {round_idx}: no automatic fixes available")
            (round_dir / "round_summary.md").write_text("\n".join(summary_lines), encoding="utf-8")
            break

        summary_lines.append(f"- applied_fixes: {len(fixes)}")
        (round_dir / "round_summary.md").write_text("\n".join(summary_lines), encoding="utf-8")

    result = {
        "run_id": run_dir.name,
        "run_dir": str(run_dir),
        "accepted": accepted,
        "passed_thresholds": bool(last_summary and _round_passed(last_summary)),
        "require_human_approval": require_human_approval,
        "human_approved": human_approved,
        "rounds_executed": len(list(run_dir.glob("round-*"))),
        "failures": failures,
    }
    write_json(run_dir / "run_result.json", result)
    return 0 if accepted else 2


def parse_args() -> argparse.Namespace:
    """Parse CLI args for deck generation."""
    parser = argparse.ArgumentParser(description="Build a Talkbook deck from compiled deck JSON.")
    parser.add_argument("--session-id", required=True)
    parser.add_argument("--deck-json", default=None, help="Path to precompiled deck JSON.")
    parser.add_argument("--out-dir", default=None, help="Output directory for build artifacts.")
    parser.add_argument("--out-name", default="deck.pptx")
    parser.add_argument("--no-strict", action="store_true", help="Disable strict failure gating.")
    parser.add_argument("--iterative", action="store_true", help="Run iterative pass loop.")
    parser.add_argument("--max-rounds", type=int, default=8)
    parser.add_argument("--dpi", type=int, default=180)
    parser.add_argument("--require-human-approval", action="store_true")
    parser.add_argument("--human-approved", action="store_true")
    parser.add_argument("--reference-pdf", default=None, help="Optional reference PDF for side-by-side PNG renders.")
    return parser.parse_args()


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    skill_root = Path(__file__).resolve().parents[1]
    session_file = session_paths(args.session_id)["session"]
    session = read_json(session_file)

    deck_json = Path(args.deck_json) if args.deck_json else session_paths(args.session_id)["deck"]
    if not deck_json.exists():
        compile_script = skill_root / "scripts" / "compile_deck_json.py"
        compile_result = _run([sys.executable, str(compile_script), "--session-id", args.session_id], cwd=skill_root)
        if compile_result.code != 0:
            sys.stdout.write(compile_result.stdout)
            sys.stderr.write(compile_result.stderr)
            return compile_result.code

    strict = not args.no_strict
    out_dir = Path(args.out_dir) if args.out_dir else session_paths(args.session_id)["outputs"] / "runs" / _iso_stamp()

    if args.iterative:
        code = _iterative_build(
            deck_json=deck_json,
            run_dir=out_dir,
            strict=strict,
            max_rounds=max(1, args.max_rounds),
            dpi=args.dpi,
            skill_root=skill_root,
            require_human_approval=bool(args.require_human_approval),
            human_approved=bool(args.human_approved),
            reference_pdf=Path(args.reference_pdf) if args.reference_pdf else None,
        )
    else:
        code, strict_summary = _single_build(
            deck_json=deck_json,
            out_dir=out_dir,
            out_name=args.out_name,
            strict=strict,
            dpi=args.dpi,
            skill_root=skill_root,
        )
        write_json(out_dir / "strict-summary.json", strict_summary)

    session.setdefault("actions", []).append(
        {
            "timestamp": utc_now_iso(),
            "action": "build_deck",
            "details": {
                "out_dir": str(out_dir),
                "iterative": bool(args.iterative),
                "strict": strict,
                "status_code": code,
            },
        }
    )
    save_session(session)

    print(f"deck_json={deck_json}")
    print(f"out_dir={out_dir}")
    return code


if __name__ == "__main__":
    raise SystemExit(main())
