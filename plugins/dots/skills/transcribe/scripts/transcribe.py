#!/usr/bin/env python3
"""Turn a local media file or YouTube URL into a transcript document."""

from __future__ import annotations

import argparse
import re
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, Optional

import asr
import render
import youtube


NON_SPEECH = re.compile(
    r"(?i)(?:[♪♫]+|\[[^\]]*(?:music|applause|laughter|cheering|noise|silence|inaudible)[^\]]*\]|"
    r"\([^)]*(?:music|applause|laughter|cheering|noise|silence|inaudible)[^)]*\))"
)


def safe_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "-", value.strip()).strip("-._")
    return cleaned or "transcript"


def output_path(requested: Optional[Path], transcript: Dict[str, Any], format_name: str) -> Path:
    if requested:
        return requested.expanduser().resolve()
    return (Path.cwd() / f"{safe_name(str(transcript.get('title') or 'transcript'))}.transcript.{format_name}").resolve()


def finish_asr(result: Dict[str, Any], title: str, source: str, source_kind: str) -> Dict[str, Any]:
    return {
        "title": title,
        "source": source,
        "source_kind": source_kind,
        "provider": result["provider"],
        "language": result.get("language") or "unknown",
        "segments": result["segments"],
    }


def clean_transcript(transcript: Dict[str, Any]) -> Dict[str, Any]:
    cleaned_segments = []
    for segment in transcript.get("segments", []):
        text = NON_SPEECH.sub(" ", str(segment.get("text") or ""))
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            cleaned = dict(segment)
            cleaned["text"] = text
            cleaned_segments.append(cleaned)
    if not cleaned_segments:
        raise ValueError("transcript contains no spoken text")
    cleaned_transcript = dict(transcript)
    cleaned_transcript["segments"] = cleaned_segments
    return cleaned_transcript


def preflight_output(requested: Optional[Path], force: bool) -> Optional[Path]:
    if requested is None:
        return None
    destination = requested.expanduser().resolve()
    if destination.exists():
        if destination.is_dir():
            raise ValueError(f"output path is a directory: {destination}")
        if not destination.is_file():
            raise ValueError(f"output path is not a regular file: {destination}")
        if not force:
            raise ValueError(f"output already exists: {destination}")
    ancestor = destination.parent
    while not ancestor.exists():
        ancestor = ancestor.parent
    if not ancestor.is_dir():
        raise ValueError(f"output parent is not a directory: {ancestor}")
    return destination


def execute(args: argparse.Namespace, temp_dir: Path) -> Dict[str, Any]:
    if youtube.is_youtube_url(args.source):
        metadata = youtube.inspect(args.source)
        if not args.force_asr:
            captions = youtube.fetch_captions(args.source, metadata, temp_dir, args.language)
            if captions is not None:
                return captions
        media = youtube.download_audio(args.source, temp_dir)
        result = asr.transcribe(media, temp_dir, args.backend, args.model, args.language)
        return finish_asr(
            result,
            str(metadata.get("title") or metadata.get("id") or "YouTube video"),
            args.source,
            "youtube",
        )
    source = Path(args.source).expanduser()
    if not source.exists():
        raise ValueError(f"input file does not exist: {source}")
    if not source.is_file():
        raise ValueError(f"input is not a file: {source}")
    source = source.resolve()
    result = asr.transcribe(source, temp_dir, args.backend, args.model, args.language)
    return finish_asr(result, source.stem, str(source), "local")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(description=__doc__)
    result.add_argument("source", help="Local media path or YouTube URL")
    result.add_argument("--output", type=Path)
    result.add_argument("--format", choices=render.FORMATS, default="md")
    result.add_argument("--language", default="auto")
    result.add_argument("--backend", choices=asr.BACKENDS, default="auto")
    result.add_argument("--model", help="Backend-specific model name or path")
    result.add_argument("--force-asr", action="store_true", help="Ignore YouTube captions and transcribe downloaded audio")
    result.add_argument("--force", action="store_true", help="Replace an existing transcript output")
    result.add_argument("--keep-temp", action="store_true", help="Keep intermediate audio and backend output for debugging")
    return result


def main() -> int:
    args = parser().parse_args()
    try:
        args.output = preflight_output(args.output, args.force)
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    temp_root = Path(tempfile.mkdtemp(prefix="dots-transcribe-"))
    try:
        transcript = clean_transcript(execute(args, temp_root))
        destination = output_path(args.output, transcript, args.format)
        if destination.exists() and not args.force:
            raise ValueError(f"output already exists: {destination}")
        try:
            render.write(transcript, destination, args.format)
        except OSError as exc:
            raise ValueError(f"could not write output {destination}: {exc}") from exc
        print(destination)
        if args.keep_temp:
            print(f"intermediate files: {temp_root}", file=sys.stderr)
        return 0
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except (youtube.YouTubeError, asr.AsrError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 3
    finally:
        if not args.keep_temp:
            shutil.rmtree(temp_root, ignore_errors=True)


if __name__ == "__main__":
    raise SystemExit(main())
