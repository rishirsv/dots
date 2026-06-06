---
name: "transcribe"
description: "Transcribe local audio or video files to raw and clean Markdown transcripts using Parakeet MLX on Apple Silicon. Use when the user asks to transcribe speech from recordings, extract text from audio/video, or create readable transcripts from interviews, meetings, lectures, calls, voice notes, or media files."
---

# Transcribe

Transcribe audio or video locally with Parakeet MLX. Prefer the bundled CLI for deterministic, repeatable runs.

The default output is one named transcript folder containing only:

```text
transcript-raw.md
transcript-clean.md
```

## Workflow

1. Collect inputs: audio/video file path(s), optional title, optional output root, and any chunking preferences.
2. Verify the machine is Apple Silicon and `ffmpeg` is available.
3. Verify `parakeet-mlx` is installed, or install it if the user asked you to set up the workflow.
4. Run `scripts/transcribe_parakeet.py`; it always writes `transcript-raw.md` and an initial deterministic `transcript-clean.md`.
5. Read `references/cleaning-prompts.md`.
6. Run a mandatory model clean-verbatim pass over `transcript-clean.md`, using `transcript-raw.md` as the source of truth, then overwrite `transcript-clean.md`.
7. Validate the output folder contains only `transcript-raw.md` and `transcript-clean.md`, timestamps are plausible, and the clean transcript remains faithful.

## Decision Rules

- Default to `mlx-community/parakeet-tdt-0.6b-v3`.
- Always produce exactly two artifacts: `transcript-raw.md` and `transcript-clean.md`.
- Always clean in two passes: deterministic cleanup in the script, then a mandatory model clean-verbatim pass by Codex.
- Do not expose multiple clean modes.
- Keep chunking enabled for normal files: `--chunk-duration 120 --overlap-duration 15`.
- Use `--decoding beam` only when the user asks to trade speed for quality.
- Name the output folder from media metadata where possible: `<date>-<content-slug>-transcript/`.
- Prefer date metadata from `ffprobe`; otherwise use file creation/modification date.
- Prefer explicit `--title`, then embedded media title, then filename stem, then the first meaningful transcript sentence for generic filenames.
- If the user asks for diarization or known-speaker labels, explain that this local Parakeet skill does not support diarization in v1 and offer transcript-only output.
- If the user needs broad non-European multilingual coverage or translation, say Parakeet v3 is not a Whisper replacement for those cases.

## Dependencies

Prefer `uv` for dependency management.

```bash
brew install ffmpeg
uv tool install parakeet-mlx -U
```

If `uv` is unavailable:

```bash
python3 -m pip install -U parakeet-mlx
```

## Skill Path

Set once when running from an installed skill:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export TRANSCRIBE_CLI="$CODEX_HOME/skills/transcribe/scripts/transcribe_parakeet.py"
```

When reviewing this repo draft, use:

```bash
export TRANSCRIBE_CLI="skills/transcribe/scripts/transcribe_parakeet.py"
```

## CLI Quick Start

Single file, Markdown default:

```bash
python3 "$TRANSCRIBE_CLI" path/to/audio.m4a
```

Title override for better folder and header names:

```bash
python3 "$TRANSCRIBE_CLI" meeting.mp4 --title "Q2 planning call"
```

Multiple files:

```bash
python3 "$TRANSCRIBE_CLI" *.m4a --out-dir output/transcribe
```

Higher-quality decode:

```bash
python3 "$TRANSCRIBE_CLI" lecture.wav --decoding beam
```

## Output Naming

By default, outputs are written next to the source file:

```text
<date>-<content-slug>-transcript/
├── transcript-raw.md
└── transcript-clean.md
```

## Reference Map

- `references/parakeet.md`: model, runtime, options, and limitations.
- `references/cleaning-prompts.md`: mandatory clean-verbatim model pass.
