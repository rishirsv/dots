#!/usr/bin/env python3
"""Retrieve YouTube captions or an audio-only fallback with yt-dlp."""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


YOUTUBE_DOMAINS = ("youtube.com", "youtube-nocookie.com")
TIMING = re.compile(r"(?P<start>\d{1,2}:\d{2}:\d{2}[.,]\d{3})\s+-->\s+(?P<end>\d{1,2}:\d{2}:\d{2}[.,]\d{3})")
TAG = re.compile(r"<[^>]+>")
WORD_TIMESTAMP = re.compile(r"<\d{1,2}:\d{2}:\d{2}[.,]\d{3}>")


class YouTubeError(RuntimeError):
    pass


def is_youtube_url(value: str) -> bool:
    parsed = urlparse(value)
    host = (parsed.hostname or "").lower()
    is_youtube_host = host == "youtu.be" or any(host == domain or host.endswith(f".{domain}") for domain in YOUTUBE_DOMAINS)
    return parsed.scheme in {"http", "https"} and is_youtube_host


def require_ytdlp() -> str:
    executable = shutil.which("yt-dlp")
    if not executable:
        raise YouTubeError("yt-dlp is required for YouTube URLs; run doctor.py for setup guidance")
    return executable


def run(args: Sequence[str], timeout: int = 180) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(list(args), text=True, capture_output=True, check=True, timeout=timeout)
    except subprocess.TimeoutExpired as exc:
        raise YouTubeError("yt-dlp timed out") from exc
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or exc.stdout or "yt-dlp failed").strip().splitlines()
        raise YouTubeError(detail[-1] if detail else "yt-dlp failed") from exc


def inspect(url: str) -> Dict[str, Any]:
    result = run([require_ytdlp(), "--no-playlist", "--quiet", "--dump-single-json", "--skip-download", url])
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise YouTubeError("yt-dlp returned invalid metadata") from exc


def _language(keys: Sequence[str], requested: str, source_language: str) -> Optional[str]:
    candidates = [key for key in keys if key != "live_chat"]
    if not candidates:
        return None
    preferences = []
    if requested != "auto":
        preferences.append(requested)
    elif source_language:
        preferences.append(source_language)
    preferences.append("en")
    for preference in preferences:
        if preference in candidates:
            return preference
        prefix = preference.split("-", 1)[0]
        for candidate in candidates:
            if candidate.split("-", 1)[0] == prefix:
                return candidate
    return sorted(candidates)[0]


def caption_candidates(metadata: Dict[str, Any], requested: str) -> List[Tuple[str, str]]:
    source_language = str(metadata.get("language") or "")
    candidates = []
    for provider, tracks in (
        ("youtube-manual", metadata.get("subtitles") or {}),
        ("youtube-auto", metadata.get("automatic_captions") or {}),
    ):
        language = _language(list(tracks), requested, source_language)
        if language:
            candidates.append((provider, language))
    return candidates


def _time(value: str) -> float:
    hours, minutes, rest = value.replace(",", ".").split(":")
    return int(hours) * 3600 + int(minutes) * 60 + float(rest)


def parse_vtt(path: Path) -> List[Dict[str, Any]]:
    lines = path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").splitlines()
    parsed: List[Dict[str, Any]] = []
    for index, line in enumerate(lines):
        match = TIMING.search(line)
        if not match:
            continue
        cursor = index + 1
        while cursor < len(lines) and not lines[cursor].strip():
            cursor += 1
        caption_lines = []
        while cursor < len(lines) and lines[cursor].strip() and not TIMING.search(lines[cursor]):
            caption_lines.append(lines[cursor].strip())
            cursor += 1
        timed_lines = [line for line in caption_lines if WORD_TIMESTAMP.search(line)]
        text = " ".join(timed_lines or caption_lines)
        text = html.unescape(TAG.sub("", text))
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            continue
        segment = {"start": _time(match.group("start")), "end": _time(match.group("end")), "text": text}
        if parsed and parsed[-1]["text"] == text:
            parsed[-1]["end"] = max(parsed[-1]["end"], segment["end"])
        else:
            parsed.append(segment)
    return parsed


def _caption_track(metadata: Dict[str, Any], provider: str, language: str) -> Optional[Dict[str, Any]]:
    group = "subtitles" if provider == "youtube-manual" else "automatic_captions"
    tracks = (metadata.get(group) or {}).get(language) or []
    return next((track for track in tracks if track.get("ext") == "vtt" and track.get("url")), None)


def _download_caption_url(metadata: Dict[str, Any], track: Dict[str, Any], output: Path) -> bool:
    headers = {
        str(name): str(value)
        for name, value in (metadata.get("http_headers") or {}).items()
        if value is not None
    }
    try:
        with urlopen(Request(str(track["url"]), headers=headers), timeout=30) as response:
            output.write_bytes(response.read())
        return True
    except (HTTPError, URLError, OSError, ValueError):
        return False


def _download_caption_with_ytdlp(
    url: str,
    provider: str,
    language: str,
    output_template: Path,
) -> None:
    kind_flag = "--write-subs" if provider == "youtube-manual" else "--write-auto-subs"
    run(
        [
            require_ytdlp(),
            "--no-playlist",
            "--quiet",
            "--skip-download",
            kind_flag,
            "--sub-langs",
            language,
            "--sub-format",
            "vtt",
            "--output",
            str(output_template),
            url,
        ]
    )


def _caption_result(
    metadata: Dict[str, Any],
    url: str,
    provider: str,
    language: str,
    segments: List[Dict[str, Any]],
) -> Dict[str, Any]:
    return {
        "title": metadata.get("title") or metadata.get("id") or "YouTube video",
        "source": url,
        "source_kind": "youtube",
        "provider": provider,
        "language": language,
        "generated": provider == "youtube-auto",
        "duration": metadata.get("duration"),
        "segments": segments,
    }


def fetch_captions(url: str, metadata: Dict[str, Any], temp_dir: Path, requested: str) -> Optional[Dict[str, Any]]:
    for provider, language in caption_candidates(metadata, requested):
        stem = "manual" if provider == "youtube-manual" else "automatic"
        direct_output = temp_dir / f"captions.{stem}.{language}.vtt"
        track = _caption_track(metadata, provider, language)
        downloaded = bool(track and _download_caption_url(metadata, track, direct_output))
        if downloaded:
            transcript_segments = parse_vtt(direct_output)
            if transcript_segments:
                return _caption_result(metadata, url, provider, language, transcript_segments)
        template = temp_dir / f"captions.{stem}.%(language)s.%(ext)s"
        try:
            _download_caption_with_ytdlp(url, provider, language, template)
        except YouTubeError:
            continue
        caption_files = sorted(temp_dir.glob(f"captions.{stem}.*.vtt"))
        for caption_file in caption_files:
            transcript_segments = parse_vtt(caption_file)
            if transcript_segments:
                return _caption_result(metadata, url, provider, language, transcript_segments)
    return None


def download_audio(url: str, temp_dir: Path) -> Path:
    template = temp_dir / "source.%(ext)s"
    result = run(
        [
            require_ytdlp(),
            "--no-playlist",
            "--quiet",
            "--no-warnings",
            "--format",
            "bestaudio/b",
            "--output",
            str(template),
            "--print",
            "after_move:filepath",
            url,
        ],
        timeout=900,
    )
    lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    if lines:
        candidate = Path(lines[-1])
        if candidate.exists():
            return candidate
    candidates = sorted(temp_dir.glob("source.*"))
    if not candidates:
        raise YouTubeError("yt-dlp did not produce an audio file")
    return candidates[0]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url")
    parser.add_argument("--language", default="auto")
    parser.add_argument("--temp-dir", type=Path, required=True)
    parser.add_argument("--audio", action="store_true", help="Download audio instead of returning captions")
    args = parser.parse_args()
    args.temp_dir.mkdir(parents=True, exist_ok=True)
    metadata = inspect(args.url)
    if args.audio:
        print(download_audio(args.url, args.temp_dir))
        return 0
    transcript = fetch_captions(args.url, metadata, args.temp_dir, args.language)
    if transcript is None:
        print(json.dumps({"captions": None}))
        return 4
    print(json.dumps(transcript, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
