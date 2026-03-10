import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


def load_thresholds(file_path):
    data = json.loads(Path(file_path).read_text(encoding="utf-8"))
    return data.get("thresholds", {})


def round_metric(value):
    return round(float(value), 6)


def compute_ssim(reference_gray, candidate_gray):
    ref = reference_gray.astype(np.float64)
    cand = candidate_gray.astype(np.float64)
    c1 = (0.01 * 255) ** 2
    c2 = (0.03 * 255) ** 2
    mu_ref = ref.mean()
    mu_cand = cand.mean()
    sigma_ref = ref.var()
    sigma_cand = cand.var()
    sigma_cross = ((ref - mu_ref) * (cand - mu_cand)).mean()
    numerator = (2 * mu_ref * mu_cand + c1) * (2 * sigma_cross + c2)
    denominator = (mu_ref**2 + mu_cand**2 + c1) * (sigma_ref + sigma_cand + c2)
    if denominator == 0:
        return 1.0
    return max(-1.0, min(1.0, numerator / denominator))


def compute_phash(image):
    grayscale = image.convert("L").resize((32, 32), Image.Resampling.LANCZOS)
    arr = np.asarray(grayscale, dtype=np.float64)
    dct_rows = np.real(np.fft.fft(arr, axis=0))
    dct_2d = np.real(np.fft.fft(dct_rows, axis=1))
    low = dct_2d[:8, :8]
    low_flat = low.flatten()
    median = np.median(low_flat[1:]) if low_flat.size > 1 else low_flat[0]
    bits = (low > median).astype(np.uint8).flatten()
    return "".join(str(int(bit)) for bit in bits)


def hamming_distance(left, right):
    return sum(1 for a, b in zip(left, right) if a != b)


def changed_bounds(changed_mask):
    ys, xs = np.where(changed_mask)
    if xs.size == 0 or ys.size == 0:
        return None
    return {
        "left": int(xs.min()),
        "top": int(ys.min()),
        "right": int(xs.max()),
        "bottom": int(ys.max()),
    }


def main():
    parser = argparse.ArgumentParser(description="Compare reference and candidate PNGs")
    parser.add_argument("--reference", required=True)
    parser.add_argument("--candidate", required=True)
    parser.add_argument("--diff-out", required=True)
    parser.add_argument("--diff-json-out", required=True)
    parser.add_argument("--scorecard-out", required=True)
    parser.add_argument("--thresholds", required=True)
    args = parser.parse_args()

    reference = Image.open(args.reference).convert("RGBA")
    candidate = Image.open(args.candidate).convert("RGBA")

    if reference.size != candidate.size:
        raise SystemExit(
            f"Dimension mismatch: reference={reference.size} candidate={candidate.size}"
        )

    ref_arr = np.asarray(reference, dtype=np.int16)
    cand_arr = np.asarray(candidate, dtype=np.int16)
    delta = np.abs(ref_arr - cand_arr)
    diff_rgb = delta[:, :, :3].astype(np.uint8)
    diff_alpha = np.full(diff_rgb.shape[:2], 255, dtype=np.uint8)
    diff_rgba = np.dstack([diff_rgb, diff_alpha])

    changed = np.any(delta[:, :, :3] > 0, axis=2)
    changed_pixels = int(changed.sum())
    total_pixels = int(changed.size)
    rgb_delta = delta[:, :, :3].astype(np.float32)
    mean_abs = float(rgb_delta.mean())
    rms = float(np.sqrt(np.mean(np.square(rgb_delta))))
    max_abs = int(delta[:, :, :3].max())
    changed_ratio = float(changed_pixels / total_pixels if total_pixels else 0.0)
    ref_gray = np.asarray(reference.convert("L"), dtype=np.uint8)
    cand_gray = np.asarray(candidate.convert("L"), dtype=np.uint8)
    ssim = compute_ssim(ref_gray, cand_gray)
    reference_phash = compute_phash(reference)
    candidate_phash = compute_phash(candidate)
    phash_distance = hamming_distance(reference_phash, candidate_phash)

    metrics = {
        "dimensions": {
            "width": reference.size[0],
            "height": reference.size[1],
        },
        "pixelDelta": {
            "changedPixels": changed_pixels,
            "totalPixels": total_pixels,
            "changedPixelRatio": round_metric(changed_ratio),
            "meanAbs": round_metric(mean_abs),
            "rms": round_metric(rms),
            "maxAbs": max_abs,
            "changedBounds": changed_bounds(changed),
        },
        "similarity": {
            "ssim": round_metric(ssim),
            "phash": {
                "reference": reference_phash,
                "candidate": candidate_phash,
                "distance": phash_distance,
            },
        },
    }

    thresholds = load_thresholds(args.thresholds)
    checks = {
        "changedPixelRatio": {
            "actual": metrics["pixelDelta"]["changedPixelRatio"],
            "max": float(thresholds.get("changedPixelRatioMax", 1)),
            "pass": metrics["pixelDelta"]["changedPixelRatio"]
            <= float(thresholds.get("changedPixelRatioMax", 1)),
        },
        "meanAbs": {
            "actual": metrics["pixelDelta"]["meanAbs"],
            "max": float(thresholds.get("meanAbsMax", 255)),
            "pass": metrics["pixelDelta"]["meanAbs"]
            <= float(thresholds.get("meanAbsMax", 255)),
        },
        "rms": {
            "actual": metrics["pixelDelta"]["rms"],
            "max": float(thresholds.get("rmsMax", 255)),
            "pass": metrics["pixelDelta"]["rms"] <= float(thresholds.get("rmsMax", 255)),
        },
    }
    if "ssimMin" in thresholds:
        checks["ssim"] = {
            "actual": metrics["similarity"]["ssim"],
            "min": float(thresholds.get("ssimMin", 0)),
            "pass": metrics["similarity"]["ssim"] >= float(thresholds.get("ssimMin", 0)),
        }
    deterministic_pass = all(check["pass"] for check in checks.values())
    scorecard = {
        "schemaVersion": 2,
        "deterministicStatus": "pass" if deterministic_pass else "fail",
        "manualDisposition": "unreviewed",
        "approvedExceptions": [],
        "pass": deterministic_pass,
        "metrics": metrics,
        "thresholds": thresholds,
        "checks": checks,
    }

    diff_out = Path(args.diff_out)
    diff_out.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(diff_rgba, mode="RGBA").save(diff_out)

    Path(args.diff_json_out).write_text(
        json.dumps(
            {
                "schemaVersion": 2,
                "metrics": metrics,
                "thresholds": thresholds,
                "checks": checks,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    Path(args.scorecard_out).write_text(
        json.dumps(scorecard, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
