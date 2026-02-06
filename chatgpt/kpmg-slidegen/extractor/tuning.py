from __future__ import annotations

import json
import math
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple

from .codegen import TemplateConfig, write_template_files


@dataclass(frozen=True)
class TuningThresholds:
    chrome_ssim: float = 0.985
    content_ssim: float = 0.960
    mean_slot_drift_in: float = 0.04
    max_slot_drift_in: float = 0.10
    severe_overlaps: int = 0
    out_of_bounds: int = 0


@dataclass(frozen=True)
class RoundMetrics:
    chrome_ssim: float
    content_ssim: float
    mean_slot_drift_in: float
    max_slot_drift_in: float
    severe_overlaps: int
    out_of_bounds: int


def evaluate_thresholds(metrics: RoundMetrics, thresholds: TuningThresholds) -> Tuple[bool, List[str]]:
    failures: List[str] = []
    if metrics.chrome_ssim < thresholds.chrome_ssim:
        failures.append(f"chrome_ssim {metrics.chrome_ssim:.4f} < {thresholds.chrome_ssim:.4f}")
    if metrics.content_ssim < thresholds.content_ssim:
        failures.append(f"content_ssim {metrics.content_ssim:.4f} < {thresholds.content_ssim:.4f}")
    if metrics.mean_slot_drift_in > thresholds.mean_slot_drift_in:
        failures.append(f"mean_slot_drift_in {metrics.mean_slot_drift_in:.4f} > {thresholds.mean_slot_drift_in:.4f}")
    if metrics.max_slot_drift_in > thresholds.max_slot_drift_in:
        failures.append(f"max_slot_drift_in {metrics.max_slot_drift_in:.4f} > {thresholds.max_slot_drift_in:.4f}")
    if metrics.severe_overlaps > thresholds.severe_overlaps:
        failures.append(f"severe_overlaps {metrics.severe_overlaps} > {thresholds.severe_overlaps}")
    if metrics.out_of_bounds > thresholds.out_of_bounds:
        failures.append(f"out_of_bounds {metrics.out_of_bounds} > {thresholds.out_of_bounds}")
    return len(failures) == 0, failures


def _utc_now_stamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")


def _read_json(path: Path, default: Any) -> Any:
    try:
        return json.loads(path.read_text())
    except Exception:
        return default


def _write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def _require_executable(name: str) -> str:
    p = shutil.which(name)
    if not p:
        raise RuntimeError(
            f"Missing required executable: {name}. Install it and retry. "
            f"For macOS, try `brew install {name}` (or LibreOffice for soffice)."
        )
    return p


def _run(cmd: Sequence[str], *, cwd: Optional[Path] = None) -> None:
    p = subprocess.run(list(cmd), cwd=str(cwd) if cwd else None, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(f"Command failed ({p.returncode}): {' '.join(cmd)}\n{p.stdout}\n{p.stderr}")


def _find_source_template(template_dir: Path) -> Path:
    candidates = sorted(
        [p for p in template_dir.glob("*.potx")] + [p for p in template_dir.glob("*.pptx")],
        key=lambda p: p.name.lower(),
    )
    if not candidates:
        raise RuntimeError(f"No .potx/.pptx found in template directory: {template_dir}")
    return candidates[0]


def _find_sample_file(template_dir: Path, sample: Optional[Path]) -> Path:
    if sample is not None:
        if not sample.exists():
            raise RuntimeError(f"Sample JSON not found: {sample}")
        return sample

    defaults = [
        template_dir / "samples" / "benchmark-normal.json",
        template_dir / "samples" / "demo.json",
    ]
    for p in defaults:
        if p.exists():
            return p

    all_json = sorted((template_dir / "samples").glob("*.json"), key=lambda p: p.name.lower())
    if not all_json:
        raise RuntimeError(
            f"No sample JSON found under {template_dir / 'samples'}. "
            "Create a benchmark sample and retry."
        )
    return all_json[0]


def _convert_to_pdf(source_file: Path, out_dir: Path, soffice: str) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    _run([soffice, "--headless", "--convert-to", "pdf", "--outdir", str(out_dir), str(source_file)])
    pdf = out_dir / f"{source_file.stem}.pdf"
    if not pdf.exists():
        candidates = sorted(out_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
        if not candidates:
            raise RuntimeError(f"PDF conversion produced no file for {source_file}")
        return candidates[0]
    return pdf


def _pdf_to_png(pdf_file: Path, out_dir: Path, pdftoppm: str, prefix: str, dpi: int) -> List[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    out_prefix = out_dir / prefix
    _run([pdftoppm, "-png", "-rx", str(dpi), "-ry", str(dpi), str(pdf_file), str(out_prefix)])
    pngs = sorted(out_dir.glob(f"{prefix}-*.png"), key=lambda p: p.name)
    if not pngs:
        raise RuntimeError(f"PNG conversion produced no images for {pdf_file}")
    return pngs


def _load_image(path: Path):
    try:
        from PIL import Image  # type: ignore
        import numpy as np  # type: ignore
    except ModuleNotFoundError as e:
        raise RuntimeError(
            "Missing Python dependencies for tuning image comparison. "
            "Install with `python3 -m pip install pillow numpy` and retry."
        ) from e

    img = Image.open(path).convert("L")
    arr = np.asarray(img, dtype=np.float32)
    return arr


def _ssim(a, b) -> float:
    try:
        import numpy as np  # type: ignore
    except ModuleNotFoundError as e:
        raise RuntimeError(
            "Missing Python dependencies for SSIM. Install with `python3 -m pip install numpy`."
        ) from e

    if a.shape != b.shape:
        h = min(a.shape[0], b.shape[0])
        w = min(a.shape[1], b.shape[1])
        a = a[:h, :w]
        b = b[:h, :w]

    c1 = (0.01 * 255) ** 2
    c2 = (0.03 * 255) ** 2

    mu_a = float(np.mean(a))
    mu_b = float(np.mean(b))
    var_a = float(np.var(a))
    var_b = float(np.var(b))
    cov = float(np.mean((a - mu_a) * (b - mu_b)))

    numerator = (2 * mu_a * mu_b + c1) * (2 * cov + c2)
    denominator = (mu_a**2 + mu_b**2 + c1) * (var_a + var_b + c2)
    if denominator == 0:
        return 1.0
    score = numerator / denominator
    return max(0.0, min(1.0, float(score)))


def _content_crop(a):
    h, w = a.shape
    top = int(h * 0.12)
    bottom = int(h * 0.90)
    left = int(w * 0.08)
    right = int(w * 0.92)
    return a[top:bottom, left:right]


def _foreground_bbox(arr, threshold: float = 245.0) -> Optional[Tuple[int, int, int, int]]:
    try:
        import numpy as np  # type: ignore
    except ModuleNotFoundError as e:
        raise RuntimeError(
            "Missing Python dependencies for geometry comparison. Install with `python3 -m pip install numpy`."
        ) from e

    ys, xs = np.where(arr < threshold)
    if ys.size == 0 or xs.size == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def _bbox_drift_inches(ref_box, cand_box, slide_w: float, slide_h: float, img_w: int, img_h: int) -> float:
    if ref_box is None or cand_box is None:
        return 0.0
    rx0, ry0, rx1, ry1 = ref_box
    cx0, cy0, cx1, cy1 = cand_box

    rx = (rx0 + rx1) / 2.0
    ry = (ry0 + ry1) / 2.0
    cx = (cx0 + cx1) / 2.0
    cy = (cy0 + cy1) / 2.0

    dx_px = abs(cx - rx)
    dy_px = abs(cy - ry)

    dx_in = dx_px * (slide_w / max(1, img_w))
    dy_in = dy_px * (slide_h / max(1, img_h))
    return math.sqrt(dx_in**2 + dy_in**2)


def _diff_image(a, b, out_path: Path) -> None:
    try:
        import numpy as np  # type: ignore
        from PIL import Image  # type: ignore
    except ModuleNotFoundError as e:
        raise RuntimeError(
            "Missing Python dependencies for diff image output. "
            "Install with `python3 -m pip install pillow numpy`."
        ) from e

    h = min(a.shape[0], b.shape[0])
    w = min(a.shape[1], b.shape[1])
    d = np.abs(a[:h, :w] - b[:h, :w]).astype(np.uint8)
    out = Image.fromarray(d, mode="L")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out.save(out_path)


def _strict_counts(inspect_dir: Path) -> Tuple[int, int]:
    overlap = _read_json(inspect_dir / "overlap-report.json", {})
    bounds = _read_json(inspect_dir / "bounds-report.json", {})
    severe = int(((overlap or {}).get("summary") or {}).get("severeCount") or 0)
    oob = int(((bounds or {}).get("summary") or {}).get("outOfBoundsCount") or 0)
    return severe, oob


def _compare_reference_and_candidate(
    *,
    reference_pngs: Sequence[Path],
    candidate_pngs: Sequence[Path],
    diff_dir: Path,
    slide_w: float,
    slide_h: float,
) -> RoundMetrics:
    if not reference_pngs or not candidate_pngs:
        raise RuntimeError("No reference/candidate PNG pairs to compare")

    references = [(p, _load_image(p)) for p in reference_pngs]

    chrome_scores: List[float] = []
    content_scores: List[float] = []
    drifts: List[float] = []

    for i, cand_png in enumerate(candidate_pngs, start=1):
        cand = _load_image(cand_png)
        cand_content = _content_crop(cand)

        best_ref = references[0]
        best_chrome = -1.0
        best_content = -1.0
        best_combined = -1.0
        for ref_path, ref in references:
            chrome = _ssim(ref, cand)
            content = _ssim(_content_crop(ref), cand_content)
            combined = 0.6 * chrome + 0.4 * content
            if combined > best_combined:
                best_combined = combined
                best_chrome = chrome
                best_content = content
                best_ref = (ref_path, ref)

        _, ref = best_ref
        chrome_scores.append(best_chrome)
        content_scores.append(best_content)

        ref_box = _foreground_bbox(ref)
        cand_box = _foreground_bbox(cand)
        drift = _bbox_drift_inches(ref_box, cand_box, slide_w, slide_h, ref.shape[1], ref.shape[0])
        drifts.append(drift)

        _diff_image(ref, cand, diff_dir / f"page-{i:03d}.png")

    return RoundMetrics(
        chrome_ssim=min(chrome_scores),
        content_ssim=min(content_scores),
        mean_slot_drift_in=sum(drifts) / max(1, len(drifts)),
        max_slot_drift_in=max(drifts) if drifts else 0.0,
        severe_overlaps=0,
        out_of_bounds=0,
    )


def _apply_auto_fixes(profile_path: Path, metrics: RoundMetrics, thresholds: TuningThresholds) -> List[Dict[str, Any]]:
    profile = _read_json(profile_path, {})
    if not isinstance(profile, dict):
        profile = {}

    applied: List[Dict[str, Any]] = []

    style_overrides = profile.get("styleOverrides")
    if not isinstance(style_overrides, dict):
        style_overrides = {}
        profile["styleOverrides"] = style_overrides

    current_scale = float(style_overrides.get("textScale", 1.0) or 1.0)

    if metrics.severe_overlaps > thresholds.severe_overlaps or metrics.out_of_bounds > thresholds.out_of_bounds:
        new_scale = max(0.75, round(current_scale - 0.05, 3))
        if new_scale < current_scale:
            style_overrides["textScale"] = new_scale
            applied.append(
                {
                    "change": "styleOverrides.textScale",
                    "from": current_scale,
                    "to": new_scale,
                    "reason": "Reduce text size to mitigate overlap/out-of-bounds issues",
                }
            )
            current_scale = new_scale

    if metrics.content_ssim < thresholds.content_ssim:
        required_overrides = profile.get("requiredSlotOverrides")
        if not isinstance(required_overrides, dict):
            required_overrides = {}
            profile["requiredSlotOverrides"] = required_overrides
        if "__autofix__" not in required_overrides:
            required_overrides["__autofix__"] = {"enabled": True}
            applied.append(
                {
                    "change": "requiredSlotOverrides.__autofix__",
                    "to": {"enabled": True},
                    "reason": "Mark profile touched for content parity tuning pass",
                }
            )

    if metrics.chrome_ssim < thresholds.chrome_ssim:
        token_overrides = profile.get("tokenOverrides")
        if not isinstance(token_overrides, dict):
            token_overrides = {}
            profile["tokenOverrides"] = token_overrides

        colors = token_overrides.get("colors")
        if not isinstance(colors, dict):
            colors = {}
            token_overrides["colors"] = colors

        semantic = colors.get("semantic")
        if not isinstance(semantic, dict):
            semantic = {}
            colors["semantic"] = semantic

        if semantic.get("bgLight") != "FFFFFF":
            semantic["bgLight"] = "FFFFFF"
            applied.append(
                {
                    "change": "tokenOverrides.colors.semantic.bgLight",
                    "to": "FFFFFF",
                    "reason": "Stabilize chrome background color",
                }
            )

    if applied:
        _write_json(profile_path, profile)

    return applied


def _round_summary_text(
    *,
    round_no: int,
    metrics: RoundMetrics,
    thresholds: TuningThresholds,
    passed: bool,
    failures: Sequence[str],
    applied_fixes: Sequence[Dict[str, Any]],
) -> str:
    lines = [
        f"# Tuning Round {round_no}",
        "",
        "## Metrics",
        f"- chrome_ssim: {metrics.chrome_ssim:.4f}",
        f"- content_ssim: {metrics.content_ssim:.4f}",
        f"- mean_slot_drift_in: {metrics.mean_slot_drift_in:.4f}",
        f"- max_slot_drift_in: {metrics.max_slot_drift_in:.4f}",
        f"- severe_overlaps: {metrics.severe_overlaps}",
        f"- out_of_bounds: {metrics.out_of_bounds}",
        "",
        "## Thresholds",
        f"- chrome_ssim >= {thresholds.chrome_ssim:.4f}",
        f"- content_ssim >= {thresholds.content_ssim:.4f}",
        f"- mean_slot_drift_in <= {thresholds.mean_slot_drift_in:.4f}",
        f"- max_slot_drift_in <= {thresholds.max_slot_drift_in:.4f}",
        f"- severe_overlaps <= {thresholds.severe_overlaps}",
        f"- out_of_bounds <= {thresholds.out_of_bounds}",
        "",
        f"## Status: {'PASS' if passed else 'NOT PASS'}",
    ]

    if failures:
        lines.append("")
        lines.append("## Failing checks")
        for item in failures:
            lines.append(f"- {item}")

    if applied_fixes:
        lines.append("")
        lines.append("## Applied fixes")
        for fix in applied_fixes:
            lines.append(f"- {fix.get('change')}: {fix.get('reason')}")

    return "\n".join(lines) + "\n"


def _load_thresholds(loop_cfg: Dict[str, Any]) -> TuningThresholds:
    raw = loop_cfg.get("thresholds") if isinstance(loop_cfg.get("thresholds"), dict) else {}
    return TuningThresholds(
        chrome_ssim=float(raw.get("chromeSsim", 0.985)),
        content_ssim=float(raw.get("contentSsim", 0.960)),
        mean_slot_drift_in=float(raw.get("meanSlotDriftIn", 0.04)),
        max_slot_drift_in=float(raw.get("maxSlotDriftIn", 0.10)),
        severe_overlaps=int(raw.get("severeOverlaps", 0)),
        out_of_bounds=int(raw.get("outOfBounds", 0)),
    )


def run_tuning_loop(
    *,
    template_dir: Path,
    sample_json: Optional[Path],
    source_pptx: Optional[Path],
    max_rounds: Optional[int],
    human_approve: bool,
) -> Dict[str, Any]:
    loop_cfg_path = template_dir / "tuning.loop.json"
    loop_cfg = _read_json(loop_cfg_path, {}) if loop_cfg_path.exists() else {}
    if not isinstance(loop_cfg, dict):
        loop_cfg = {}

    thresholds = _load_thresholds(loop_cfg)
    configured_rounds = int(loop_cfg.get("maxRounds", 8) or 8)
    rounds = max_rounds if max_rounds is not None else configured_rounds
    rounds = max(1, min(32, int(rounds)))

    source = source_pptx if source_pptx is not None else _find_source_template(template_dir)
    sample = _find_sample_file(template_dir, sample_json)

    soffice = _require_executable("soffice")
    pdftoppm = _require_executable("pdftoppm")
    node = _require_executable("node")
    node_dep_check = subprocess.run(
        [node, "-e", "import('pptxgenjs').then(()=>process.exit(0)).catch(()=>process.exit(1))"],
        cwd=str(template_dir),
        capture_output=True,
        text=True,
    )
    if node_dep_check.returncode != 0:
        raise RuntimeError(
            "Template runtime dependencies are missing. "
            f"Run `npm install` in {template_dir} and retry tune-template."
        )

    run_id = _utc_now_stamp()
    run_dir = template_dir / "outputs" / "tuning" / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    reference_pdf = _convert_to_pdf(source, run_dir / "reference_pdf", soffice)
    reference_pngs = _pdf_to_png(
        reference_pdf,
        run_dir / "reference_png",
        pdftoppm,
        prefix="reference",
        dpi=int(((loop_cfg.get("render") or {}).get("dpi") or 300)),
    )

    profile_path = template_dir / "template.profile.json"

    final_pass = False
    final_round = 0
    final_failures: List[str] = []

    for i in range(1, rounds + 1):
        round_dir = run_dir / f"round-{i:02d}"
        round_dir.mkdir(parents=True, exist_ok=True)

        candidate_pptx = round_dir / "candidate.pptx"

        p = subprocess.run(
            [
                node,
                "generator/index.js",
                "--in",
                str(sample.resolve()),
                "--out",
                str(candidate_pptx.resolve()),
            ],
            cwd=str(template_dir),
            capture_output=True,
            text=True,
        )
        if p.returncode not in (0, 1):
            raise RuntimeError(
                f"Generator command failed ({p.returncode}): {node} generator/index.js --in {sample} --out {candidate_pptx}\n"
                f"{p.stdout}\n{p.stderr}"
            )
        if not candidate_pptx.exists():
            raise RuntimeError(
                "Generator did not produce candidate PPTX. "
                f"Exit code: {p.returncode}. Output:\n{p.stdout}\n{p.stderr}"
            )

        candidate_pdf = _convert_to_pdf(candidate_pptx, round_dir / "candidate_pdf", soffice)
        candidate_pngs = _pdf_to_png(candidate_pdf, round_dir / "candidate_png", pdftoppm, prefix="candidate", dpi=300)

        template_json = _read_json(template_dir / "template.json", {})
        dims = (template_json or {}).get("slideDimensions") or {}
        slide_w = float(dims.get("w", 13.333))
        slide_h = float(dims.get("h", 7.5))

        image_metrics = _compare_reference_and_candidate(
            reference_pngs=reference_pngs,
            candidate_pngs=candidate_pngs,
            diff_dir=round_dir / "diff_png",
            slide_w=slide_w,
            slide_h=slide_h,
        )

        severe, out_of_bounds = _strict_counts(round_dir / "inspect")
        metrics = RoundMetrics(
            chrome_ssim=image_metrics.chrome_ssim,
            content_ssim=image_metrics.content_ssim,
            mean_slot_drift_in=image_metrics.mean_slot_drift_in,
            max_slot_drift_in=image_metrics.max_slot_drift_in,
            severe_overlaps=severe,
            out_of_bounds=out_of_bounds,
        )

        passed, failures = evaluate_thresholds(metrics, thresholds)

        applied_fixes: List[Dict[str, Any]] = []
        if not passed and i < rounds:
            applied_fixes = _apply_auto_fixes(profile_path, metrics, thresholds)
            if applied_fixes:
                write_template_files(
                    TemplateConfig(
                        template_dir=template_dir,
                        pptx_path=source,
                        schema_version="4.0",
                        mode="native",
                        all_layout_types=True,
                        refresh_assets=False,
                        profile_path=profile_path,
                    )
                )

        _write_json(
            round_dir / "metrics.json",
            {
                "chrome_ssim": metrics.chrome_ssim,
                "content_ssim": metrics.content_ssim,
                "mean_slot_drift_in": metrics.mean_slot_drift_in,
                "max_slot_drift_in": metrics.max_slot_drift_in,
                "severe_overlaps": metrics.severe_overlaps,
                "out_of_bounds": metrics.out_of_bounds,
                "passed": passed,
                "failures": failures,
            },
        )
        _write_json(round_dir / "applied_fixes.json", {"applied": applied_fixes})
        (round_dir / "round_summary.md").write_text(
            _round_summary_text(
                round_no=i,
                metrics=metrics,
                thresholds=thresholds,
                passed=passed,
                failures=failures,
                applied_fixes=applied_fixes,
            )
        )

        final_round = i
        final_pass = passed
        final_failures = list(failures)
        if passed:
            break

    require_human = bool(loop_cfg.get("requireHumanApproval", True))
    human_gate_passed = (not require_human) or human_approve

    outcome = {
        "run_id": run_id,
        "run_dir": str(run_dir),
        "rounds_executed": final_round,
        "passed_thresholds": final_pass,
        "human_approved": bool(human_approve),
        "require_human_approval": require_human,
        "accepted": final_pass and human_gate_passed,
        "failures": final_failures,
    }

    if final_pass and require_human and not human_approve:
        outcome["message"] = (
            "Thresholds passed but final acceptance requires human visual approval. "
            "Re-run with --human-approve after review."
        )

    if final_pass and human_gate_passed:
        _write_json(
            run_dir / "human_approval.json",
            {
                "approved": True,
                "approvedAt": datetime.now(timezone.utc).isoformat(),
            },
        )

    _write_json(run_dir / "run_result.json", outcome)
    return outcome
