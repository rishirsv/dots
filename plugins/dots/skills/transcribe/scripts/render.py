#!/usr/bin/env python3
"""Render normalized transcript JSON as readable text or subtitle formats."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, Iterable, List


FORMATS = ("md", "txt", "json", "srt", "vtt")


def _seconds(value: Any) -> float:
    try:
        return max(0.0, float(value))
    except (TypeError, ValueError):
        return 0.0


def timestamp(value: Any, separator: str = ".") -> str:
    milliseconds = int(round(_seconds(value) * 1000))
    hours, remainder = divmod(milliseconds, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    seconds, milliseconds = divmod(remainder, 1000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}{separator}{milliseconds:03d}"


def segments(transcript: Dict[str, Any]) -> List[Dict[str, Any]]:
    return [segment for segment in transcript.get("segments", []) if str(segment.get("text", "")).strip()]


def render_markdown(transcript: Dict[str, Any]) -> str:
    title = str(transcript.get("title") or "Untitled")
    provider = str(transcript.get("provider") or "unknown")
    language = str(transcript.get("language") or "unknown")
    lines = [
        f"# Transcript: {title}",
        "",
        f"- Method: `{provider}`",
        f"- Language: `{language}`",
    ]
    source = transcript.get("source")
    if source:
        lines.append(f"- Source: `{source}`")
    lines.extend(["", "## Transcript", ""])
    for segment in segments(transcript):
        lines.append(f"**[{timestamp(segment.get('start'))}]** {str(segment['text']).strip()}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def render_text(transcript: Dict[str, Any]) -> str:
    return "\n\n".join(str(segment["text"]).strip() for segment in segments(transcript)).rstrip() + "\n"


def render_srt(transcript: Dict[str, Any]) -> str:
    blocks = []
    for index, segment in enumerate(segments(transcript), start=1):
        blocks.append(
            f"{index}\n"
            f"{timestamp(segment.get('start'), ',')} --> {timestamp(segment.get('end'), ',')}\n"
            f"{str(segment['text']).strip()}"
        )
    return "\n\n".join(blocks).rstrip() + "\n"


def render_vtt(transcript: Dict[str, Any]) -> str:
    blocks = ["WEBVTT"]
    for segment in segments(transcript):
        blocks.append(
            f"{timestamp(segment.get('start'))} --> {timestamp(segment.get('end'))}\n"
            f"{str(segment['text']).strip()}"
        )
    return "\n\n".join(blocks).rstrip() + "\n"


def render(transcript: Dict[str, Any], format_name: str) -> str:
    if format_name == "md":
        return render_markdown(transcript)
    if format_name == "txt":
        return render_text(transcript)
    if format_name == "json":
        return json.dumps(transcript, ensure_ascii=False, indent=2) + "\n"
    if format_name == "srt":
        return render_srt(transcript)
    if format_name == "vtt":
        return render_vtt(transcript)
    raise ValueError(f"unsupported transcript format: {format_name}")


def write(transcript: Dict[str, Any], output: Path, format_name: str) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(render(transcript, format_name), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Normalized transcript JSON")
    parser.add_argument("--format", choices=FORMATS, default="md")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    transcript = json.loads(args.input.read_text(encoding="utf-8"))
    rendered = render(transcript, args.format)
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
        print(args.output)
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
