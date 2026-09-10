#!/usr/bin/env python3
"""Run a supported local speech-to-text backend and normalize its output."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import tempfile
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional, Sequence


BACKENDS = ("auto", "whisper-cpp")


class AsrError(RuntimeError):
    pass


def available() -> Dict[str, bool]:
    return {"whisper-cpp": shutil.which("whisper-cli") is not None}


def choose_backend(requested: str) -> str:
    routes = available()
    if requested != "auto":
        if not routes.get(requested, False):
            raise AsrError(f"requested ASR backend is unavailable: {requested}")
        return requested
    if routes["whisper-cpp"]:
        return "whisper-cpp"
    raise AsrError("no local ASR backend is available; run doctor.py for setup guidance")


def _run(args: Sequence[str], timeout: int = 3600) -> None:
    try:
        subprocess.run(list(args), text=True, capture_output=True, check=True, timeout=timeout)
    except subprocess.TimeoutExpired as exc:
        raise AsrError("ASR command timed out") from exc
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or exc.stdout or "ASR command failed").strip().splitlines()
        raise AsrError(detail[-1] if detail else "ASR command failed") from exc


def _clock(value: str) -> float:
    hours, minutes, rest = value.replace(",", ".").split(":")
    return int(hours) * 3600 + int(minutes) * 60 + float(rest)


def _last_detail(stderr: str, fallback: str) -> str:
    lines = [line.strip() for line in stderr.splitlines() if line.strip()]
    return lines[-1] if lines else fallback


def _require_audio_stream(media: Path) -> None:
    command = shutil.which("ffprobe")
    if not command:
        raise AsrError("ffprobe is required to inspect the input audio stream")
    try:
        result = subprocess.run(
            [
                command,
                "-v",
                "error",
                "-select_streams",
                "a:0",
                "-show_entries",
                "stream=index",
                "-of",
                "csv=p=0",
                str(media),
            ],
            text=True,
            capture_output=True,
            timeout=60,
        )
    except subprocess.TimeoutExpired as exc:
        raise AsrError(f"timed out while inspecting input media: {media}") from exc
    if result.returncode != 0:
        detail = _last_detail(result.stderr, "unsupported or corrupt media")
        raise AsrError(f"could not read input media {media}: {detail}")
    if not result.stdout.strip():
        raise AsrError(f"input has no audio stream: {media}")


@contextmanager
def _whisper_cpp_slot() -> Iterator[None]:
    try:
        import fcntl
    except ImportError:
        yield
        return
    lock_path = Path(tempfile.gettempdir()) / f"dots-transcribe-whisper-cpp-{os.getuid()}.lock"
    with lock_path.open("a", encoding="utf-8") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise AsrError("another whisper.cpp transcription is already running; retry after it finishes") from exc
        yield


def _whisper_cpp_segments(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    normalized = []
    for segment in payload.get("transcription", []):
        offsets = segment.get("offsets") or {}
        timestamps = segment.get("timestamps") or {}
        start = offsets.get("from")
        end = offsets.get("to")
        if start is not None:
            start = float(start) / 1000
        elif timestamps.get("from"):
            start = _clock(str(timestamps["from"]))
        else:
            start = 0.0
        if end is not None:
            end = float(end) / 1000
        elif timestamps.get("to"):
            end = _clock(str(timestamps["to"]))
        else:
            end = start
        text = str(segment.get("text") or "").strip()
        if text:
            normalized.append({"start": start, "end": max(start, end), "text": text})
    return normalized


def transcribe_whisper_cpp(media: Path, temp_dir: Path, model: Optional[str], language: str) -> Dict[str, Any]:
    command = shutil.which("whisper-cli")
    ffmpeg = shutil.which("ffmpeg")
    if not command:
        raise AsrError("whisper-cli is not installed")
    if not ffmpeg:
        raise AsrError("ffmpeg is required by the whisper.cpp adapter")
    model_path = model or os.environ.get("WHISPER_MODEL")
    if not model_path:
        raise AsrError("whisper.cpp needs --model or the WHISPER_MODEL environment variable")
    if not Path(model_path).expanduser().exists():
        raise AsrError(f"whisper.cpp model does not exist: {model_path}")
    _require_audio_stream(media)
    wav = temp_dir / "audio.wav"
    _run(
        [
            ffmpeg,
            "-nostdin",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(media),
            "-map",
            "0:a:0",
            "-vn",
            "-ar",
            "16000",
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            str(wav),
        ]
    )
    prefix = temp_dir / "whisper"
    args = [command, "-m", str(Path(model_path).expanduser()), "-f", str(wav), "-ojf", "-of", str(prefix)]
    if language != "auto":
        args.extend(["-l", language])
    with _whisper_cpp_slot():
        _run(args)
    output = prefix.with_suffix(".json")
    if not output.exists():
        raise AsrError("whisper.cpp did not produce JSON output")
    payload = json.loads(output.read_text(encoding="utf-8"))
    transcript_segments = _whisper_cpp_segments(payload)
    if not transcript_segments:
        raise AsrError("whisper.cpp produced an empty transcript")
    detected = payload.get("result", {}).get("language") if isinstance(payload.get("result"), dict) else None
    return {"provider": "whisper.cpp", "language": detected or language, "segments": transcript_segments}


def transcribe(media: Path, temp_dir: Path, backend: str, model: Optional[str], language: str) -> Dict[str, Any]:
    selected = choose_backend(backend)
    if selected == "whisper-cpp":
        return transcribe_whisper_cpp(media, temp_dir, model, language)
    raise AsrError(f"unsupported ASR backend: {selected}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("media", type=Path)
    parser.add_argument("--temp-dir", type=Path, required=True)
    parser.add_argument("--backend", choices=BACKENDS, default="auto")
    parser.add_argument("--model")
    parser.add_argument("--language", default="auto")
    args = parser.parse_args()
    args.temp_dir.mkdir(parents=True, exist_ok=True)
    print(json.dumps(transcribe(args.media, args.temp_dir, args.backend, args.model, args.language), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
