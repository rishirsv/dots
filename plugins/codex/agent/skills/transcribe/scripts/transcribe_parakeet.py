#!/usr/bin/env python3
"""Transcribe audio/video locally with Parakeet MLX into raw and clean Markdown."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import platform
from pathlib import Path
import re
import shutil
import subprocess
import sys
from typing import Any, Dict, Iterable, List, Optional

DEFAULT_MODEL = "mlx-community/parakeet-tdt-0.6b-v3"
DEFAULT_CHUNK_DURATION = 120.0
DEFAULT_OVERLAP_DURATION = 15.0
ALLOWED_DECODING = {"greedy", "beam"}
GENERIC_STEMS = {
    "audio",
    "call",
    "meeting",
    "new recording",
    "recording",
    "untitled",
    "voice memo",
}
FILLERS = {
    "ah",
    "er",
    "hm",
    "hmm",
    "mm",
    "uh",
    "um",
}
BACKCHANNELS = {
    "got it",
    "mm hmm",
    "mm-hmm",
    "okay",
    "right",
    "sure",
    "yeah",
    "yep",
    "yes",
}


def _die(message: str, code: int = 1) -> None:
    print(f"Error: {message}", file=sys.stderr)
    raise SystemExit(code)


def _validate_environment(skip_platform_check: bool) -> None:
    if not skip_platform_check and platform.machine() != "arm64":
        _die("Parakeet MLX requires Apple Silicon (arm64).")
    if shutil.which("ffmpeg") is None:
        _die("ffmpeg is required. Install it with `brew install ffmpeg`.")


def _load_parakeet() -> Any:
    try:
        from parakeet_mlx import from_pretrained
    except ImportError:
        _die(
            "parakeet-mlx is not installed. Install with "
            "`uv tool install parakeet-mlx -U` or "
            "`uv run --python 3.12 --with parakeet-mlx python <script> <audio>`."
        )
    return from_pretrained


def _normalize_choice(value: str, allowed: set[str], label: str) -> str:
    normalized = value.strip().lower()
    if normalized not in allowed:
        _die(f"{label} must be one of: " + ", ".join(sorted(allowed)))
    return normalized


def _validate_input(path: Path) -> None:
    if not path.exists():
        _die(f"Input file not found: {path}")
    if not path.is_file():
        _die(f"Input path is not a file: {path}")


def _run_ffprobe(path: Path) -> Dict[str, Any]:
    if shutil.which("ffprobe") is None:
        return {}
    command = [
        "ffprobe",
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        str(path),
    ]
    try:
        completed = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return {}
    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError:
        return {}


def _parse_date(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    raw = value.strip()
    if not raw:
        return None
    try:
        normalized = raw.replace("Z", "+00:00")
        return datetime.fromisoformat(normalized).date().isoformat()
    except ValueError:
        pass
    for fmt in ("%Y-%m-%d", "%Y:%m:%d %H:%M:%S", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _file_date(path: Path) -> str:
    stat = path.stat()
    timestamp = getattr(stat, "st_birthtime", None) or stat.st_mtime
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).date().isoformat()


def _metadata(path: Path) -> Dict[str, Optional[str]]:
    data = _run_ffprobe(path)
    tags = data.get("format", {}).get("tags", {}) if isinstance(data, dict) else {}
    if not isinstance(tags, dict):
        tags = {}
    title = tags.get("title") or tags.get("TITLE")
    creation_time = (
        tags.get("creation_time")
        or tags.get("date")
        or tags.get("DATE")
        or tags.get("com.apple.quicktime.creationdate")
    )
    return {
        "title": title.strip() if isinstance(title, str) and title.strip() else None,
        "date": _parse_date(creation_time) or _file_date(path),
    }


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "transcript"


def _is_generic_stem(stem: str) -> bool:
    normalized = re.sub(r"\s+", " ", stem.strip().lower())
    if normalized in GENERIC_STEMS:
        return True
    return bool(re.fullmatch(r"(audio|recording|voice-memo|meeting|call)[-_ ]?\d*", normalized))


def _first_meaningful_sentence(sentences: List[Dict[str, Any]]) -> Optional[str]:
    for sentence in sentences:
        text = str(sentence.get("text") or "").strip()
        words = re.findall(r"[A-Za-z0-9']+", text)
        if len(words) >= 4:
            return " ".join(words[:8])
    return None


def _resolve_title(
    input_path: Path,
    title_override: Optional[str],
    media_title: Optional[str],
    sentences: List[Dict[str, Any]],
) -> str:
    if title_override and title_override.strip():
        return title_override.strip()
    if media_title:
        return media_title
    if not _is_generic_stem(input_path.stem):
        return input_path.stem
    return _first_meaningful_sentence(sentences) or input_path.stem


def _output_dir(input_path: Path, root: Optional[str], date: str, title: str) -> Path:
    base = Path(root).expanduser() if root else input_path.parent
    folder = f"{date}-{_slugify(title)}-transcript"
    return base / folder


def _format_time(seconds: Optional[float]) -> str:
    if seconds is None:
        return "00:00:00"
    total = max(0, int(round(float(seconds))))
    hours = total // 3600
    minutes = (total % 3600) // 60
    secs = total % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def _sentence_to_dict(sentence: Any) -> Dict[str, Any]:
    return {
        "start": getattr(sentence, "start", None),
        "end": getattr(sentence, "end", None),
        "duration": getattr(sentence, "duration", None),
        "text": getattr(sentence, "text", ""),
    }


def _result_to_sentences(result: Any) -> List[Dict[str, Any]]:
    return [_sentence_to_dict(sentence) for sentence in getattr(result, "sentences", [])]


def _clean_text(text: str) -> str:
    cleaned = text.strip()
    original = cleaned
    if not cleaned:
        return ""

    words = re.findall(r"[A-Za-z']+", cleaned.lower())
    normalized = " ".join(words)
    if normalized in FILLERS or normalized in BACKCHANNELS:
        return ""

    cleaned = re.sub(
        r"\b(um+|uh+|ah+|er+|hmm+|mm-hmm)\b[,\s]*",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(
        r"\b(you know|i mean|sort of|kind of)\b[,\s]*",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(r"\b([A-Za-z]+)-\1\b", r"\1", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\b([A-Za-z']+)(\s+\1\b)+", r"\1", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+([,.;:?!])", r"\1", cleaned)
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    cleaned = re.sub(r"^[,.;:\-\s]+", "", cleaned)
    if cleaned and original[:1].isupper():
        cleaned = cleaned[:1].upper() + cleaned[1:]
    return cleaned


def _clean_sentences(sentences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    cleaned_sentences: List[Dict[str, Any]] = []
    previous_text = ""
    for sentence in sentences:
        cleaned_text = _clean_text(str(sentence.get("text") or ""))
        if not cleaned_text:
            continue
        if cleaned_text.lower() == previous_text.lower():
            continue
        cleaned = dict(sentence)
        cleaned["text"] = cleaned_text
        cleaned_sentences.append(cleaned)
        previous_text = cleaned_text
    return cleaned_sentences


def _format_markdown(
    *,
    title: str,
    source: Path,
    date: str,
    model: str,
    transcript_type: str,
    sentences: List[Dict[str, Any]],
) -> str:
    lines = [
        f"# {title}",
        "",
        f"- Source: `{source}`",
        f"- Date: `{date}`",
        "- Engine: `parakeet-mlx`",
        f"- Model: `{model}`",
        f"- Type: `{transcript_type}`",
        "",
        "## Transcript",
        "",
    ]
    for sentence in sentences:
        text = str(sentence.get("text") or "").strip()
        if not text:
            continue
        start = _format_time(sentence.get("start"))
        end = _format_time(sentence.get("end"))
        lines.extend([f"### {start} - {end}", "", text, ""])
    return "\n".join(lines).rstrip() + "\n"


def _build_decoding_config(args: argparse.Namespace) -> Optional[Any]:
    if (
        args.decoding == "greedy"
        and args.max_words is None
        and args.silence_gap is None
        and args.max_duration is None
    ):
        return None

    try:
        from parakeet_mlx import Beam, DecodingConfig, Greedy, SentenceConfig
    except ImportError:
        return None

    decoding: Any = Greedy()
    if args.decoding == "beam":
        decoding = Beam(
            beam_size=args.beam_size,
            length_penalty=args.length_penalty,
            patience=args.patience,
            duration_reward=args.duration_reward,
        )

    sentence = SentenceConfig(
        max_words=args.max_words,
        silence_gap=args.silence_gap,
        max_duration=args.max_duration,
    )
    return DecodingConfig(decoding=decoding, sentence=sentence)


def _transcribe_one(model: Any, input_path: Path, args: argparse.Namespace) -> Any:
    kwargs: Dict[str, Any] = {}
    if args.chunk_duration is not None and args.chunk_duration > 0:
        kwargs["chunk_duration"] = args.chunk_duration
        kwargs["overlap_duration"] = args.overlap_duration

    decoding_config = _build_decoding_config(args)
    if decoding_config is not None:
        kwargs["decoding_config"] = decoding_config

    return model.transcribe(str(input_path), **kwargs)


def _write_transcripts(
    *,
    input_path: Path,
    title: str,
    date: str,
    model_name: str,
    out_dir: Path,
    raw_sentences: List[Dict[str, Any]],
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    raw_markdown = _format_markdown(
        title=title,
        source=input_path,
        date=date,
        model=model_name,
        transcript_type="raw",
        sentences=raw_sentences,
    )
    (out_dir / "transcript-raw.md").write_text(raw_markdown, encoding="utf-8")

    clean_markdown = _format_markdown(
        title=title,
        source=input_path,
        date=date,
        model=model_name,
        transcript_type="clean-verbatim",
        sentences=_clean_sentences(raw_sentences),
    )
    (out_dir / "transcript-clean.md").write_text(clean_markdown, encoding="utf-8")
    print(f"Wrote {out_dir}")


def _parse_args(argv: Optional[Iterable[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Transcribe audio/video locally with Parakeet MLX into raw and clean Markdown."
    )
    parser.add_argument("inputs", nargs="+", help="Audio/video file(s) to transcribe")
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Hugging Face model to use (default: {DEFAULT_MODEL})",
    )
    parser.add_argument("--title", help="Title override for folder and transcript headings")
    parser.add_argument("--out-dir", help="Root directory for transcript folders")
    parser.add_argument(
        "--chunk-duration",
        type=float,
        default=DEFAULT_CHUNK_DURATION,
        help="Chunk duration in seconds; use 0 to disable chunking",
    )
    parser.add_argument(
        "--overlap-duration",
        type=float,
        default=DEFAULT_OVERLAP_DURATION,
        help="Chunk overlap duration in seconds",
    )
    parser.add_argument("--decoding", default="greedy", help="Decoding method: greedy or beam")
    parser.add_argument("--beam-size", type=int, default=5)
    parser.add_argument("--length-penalty", type=float, default=0.013)
    parser.add_argument("--patience", type=float, default=3.5)
    parser.add_argument("--duration-reward", type=float, default=0.67)
    parser.add_argument("--max-words", type=int)
    parser.add_argument("--silence-gap", type=float)
    parser.add_argument("--max-duration", type=float)
    parser.add_argument(
        "--skip-platform-check",
        action="store_true",
        help="Skip Apple Silicon validation for dry review or testing",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate inputs and print resolved jobs without loading the model",
    )
    return parser.parse_args(argv)


def main() -> None:
    args = _parse_args()
    args.decoding = _normalize_choice(args.decoding, ALLOWED_DECODING, "decoding")

    if args.overlap_duration < 0:
        _die("--overlap-duration cannot be negative")
    if args.chunk_duration is not None and args.chunk_duration < 0:
        _die("--chunk-duration cannot be negative")
    if args.title and len(args.inputs) > 1:
        _die("--title only supports a single input")

    _validate_environment(args.skip_platform_check)

    input_paths = [Path(value).expanduser() for value in args.inputs]
    for input_path in input_paths:
        _validate_input(input_path)

    media_metadata = {path: _metadata(path) for path in input_paths}
    if args.dry_run:
        jobs = []
        for path in input_paths:
            meta = media_metadata[path]
            title = args.title or meta.get("title") or path.stem
            jobs.append(
                {
                    "input": str(path),
                    "output_dir": str(_output_dir(path, args.out_dir, str(meta["date"]), title)),
                    "date": meta["date"],
                    "title": title,
                    "model": args.model,
                }
            )
        print(json.dumps(jobs, indent=2))
        return

    from_pretrained = _load_parakeet()
    model = from_pretrained(args.model)

    for input_path in input_paths:
        result = _transcribe_one(model, input_path, args)
        raw_sentences = _result_to_sentences(result)
        meta = media_metadata[input_path]
        title = _resolve_title(input_path, args.title, meta.get("title"), raw_sentences)
        out_dir = _output_dir(input_path, args.out_dir, str(meta["date"]), title)
        _write_transcripts(
            input_path=input_path,
            title=title,
            date=str(meta["date"]),
            model_name=args.model,
            out_dir=out_dir,
            raw_sentences=raw_sentences,
        )


if __name__ == "__main__":
    main()
