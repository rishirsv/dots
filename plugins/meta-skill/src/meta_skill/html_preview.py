"""Best-effort inert HTML page previews owned by the evaluation harness."""

import hashlib
import json
import subprocess
from pathlib import Path

from .io import write_json


SOURCE_BYTE_LIMIT = 1024 * 1024
CAPTURE_TIMEOUT_SECONDS = 20
MAX_PREVIEWS_PER_RUN = 20
CAPTURE_SCRIPT = Path(__file__).with_name("capture_html_preview.mjs")


def generate_html_previews(run_dir):
    """Generate bounded page previews without affecting run success."""
    run_dir = Path(run_dir)
    attempted = 0
    for trial in sorted((run_dir / "trials").glob("*")):
        artifact_root = trial / "artifacts"
        if not artifact_root.is_dir():
            continue
        preview_root = trial / "previews"
        entries = {}
        errors = {}
        for source in sorted(artifact_root.rglob("*.html")):
            if attempted >= MAX_PREVIEWS_PER_RUN:
                break
            if not source.is_file() or source.is_symlink() or source.stat().st_size > SOURCE_BYTE_LIMIT:
                continue
            attempted += 1
            relative = source.relative_to(artifact_root).as_posix()
            output_name = f"{hashlib.sha256(relative.encode()).hexdigest()[:20]}.png"
            output = preview_root / output_name
            try:
                preview_root.mkdir(parents=True, exist_ok=True)
                completed = subprocess.run(
                    ["node", str(CAPTURE_SCRIPT), str(source), str(output)],
                    capture_output=True,
                    check=True,
                    text=True,
                    timeout=CAPTURE_TIMEOUT_SECONDS,
                )
                metadata = json.loads(completed.stdout)
                frames = []
                for frame in metadata.get("frames") or []:
                    frame_file = Path(str(frame.get("file") or ""))
                    if (
                        frame_file.name != str(frame_file)
                        or frame_file.suffix != ".png"
                        or not (preview_root / frame_file).is_file()
                    ):
                        raise ValueError("capture returned an invalid preview frame")
                    frames.append({
                        "file": frame_file.name,
                        **{key: frame[key] for key in ("index", "label", "width", "height") if key in frame},
                    })
                if frames:
                    entries[relative] = {
                        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                        "generated_by": "harness",
                        "frames": frames,
                        **{key: metadata[key] for key in ("environment",) if key in metadata},
                    }
            except (OSError, ValueError, subprocess.SubprocessError):
                for generated in preview_root.glob(f"{output.stem}-*.png"):
                    generated.unlink(missing_ok=True)
                errors[relative] = "Harness rendering did not complete."
        if entries or errors:
            write_json(preview_root / "index.json", {
                "schema_version": 3,
                "entries": entries,
                "errors": errors,
            })
