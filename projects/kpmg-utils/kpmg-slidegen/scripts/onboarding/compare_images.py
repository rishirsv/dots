import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


def load_thresholds(file_path):
    data = json.loads(Path(file_path).read_text(encoding="utf-8"))
    return data.get("thresholds", {})


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

    metrics = {
        "width": reference.size[0],
        "height": reference.size[1],
        "changedPixels": changed_pixels,
        "totalPixels": total_pixels,
        "changedPixelRatio": round(changed_ratio, 6),
        "meanAbs": round(mean_abs, 6),
        "rms": round(rms, 6),
        "maxAbs": max_abs,
    }

    thresholds = load_thresholds(args.thresholds)
    scorecard = {
        "schemaVersion": 1,
        "pass": (
            metrics["changedPixelRatio"] <= float(thresholds.get("changedPixelRatioMax", 1))
            and metrics["meanAbs"] <= float(thresholds.get("meanAbsMax", 255))
            and metrics["rms"] <= float(thresholds.get("rmsMax", 255))
        ),
        "thresholds": thresholds,
        "checks": {
            "changedPixelRatio": {
                "actual": metrics["changedPixelRatio"],
                "max": float(thresholds.get("changedPixelRatioMax", 1)),
                "pass": metrics["changedPixelRatio"]
                <= float(thresholds.get("changedPixelRatioMax", 1)),
            },
            "meanAbs": {
                "actual": metrics["meanAbs"],
                "max": float(thresholds.get("meanAbsMax", 255)),
                "pass": metrics["meanAbs"]
                <= float(thresholds.get("meanAbsMax", 255)),
            },
            "rms": {
                "actual": metrics["rms"],
                "max": float(thresholds.get("rmsMax", 255)),
                "pass": metrics["rms"] <= float(thresholds.get("rmsMax", 255)),
            },
        },
    }

    diff_out = Path(args.diff_out)
    diff_out.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(diff_rgba, mode="RGBA").save(diff_out)

    Path(args.diff_json_out).write_text(
        json.dumps({"schemaVersion": 1, "metrics": metrics}, indent=2) + "\n",
        encoding="utf-8",
    )
    Path(args.scorecard_out).write_text(
        json.dumps(scorecard, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
