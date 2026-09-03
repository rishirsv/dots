#!/usr/bin/env python3
"""Report which free YouTube and local transcription routes are available."""

from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path
from typing import Any, Dict

import asr


def report() -> Dict[str, Dict[str, Any]]:
    routes = asr.available()
    whisper_model = os.environ.get("WHISPER_MODEL")
    whisper_model_ready = bool(whisper_model and Path(whisper_model).expanduser().is_file())
    return {
        "yt_dlp": {
            "available": shutil.which("yt-dlp") is not None,
            "setup": "Install the current yt-dlp executable, or install yt-dlp[default] with a supported JavaScript runtime.",
        },
        "ffmpeg": {
            "available": shutil.which("ffmpeg") is not None and shutil.which("ffprobe") is not None,
            "setup": "Install FFmpeg and its ffprobe companion for media inspection and normalization.",
        },
        "whisper_cpp": {
            "available": routes["whisper-cpp"],
            "ready": routes["whisper-cpp"] and whisper_model_ready,
            "model": str(Path(whisper_model).expanduser()) if whisper_model else None,
            "setup": "Install whisper.cpp, then pass --model or set WHISPER_MODEL to a downloaded GGML model.",
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    payload = report()
    if args.json:
        print(json.dumps(payload, indent=2))
        return 0
    for name, details in payload.items():
        ready = details.get("ready", details["available"])
        state = "ready" if ready else ("needs setup" if details["available"] else "missing")
        print(f"{name}: {state}")
        if not ready:
            print(f"  {details['setup']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
