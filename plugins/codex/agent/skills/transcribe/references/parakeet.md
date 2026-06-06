# Parakeet MLX Reference

## Default Runtime

- Runtime: `parakeet-mlx`
- Default model: `mlx-community/parakeet-tdt-0.6b-v3`
- Source model: `nvidia/parakeet-tdt-0.6b-v3`
- Local-first target: Apple Silicon with MLX

## Source Links

- Parakeet MLX: https://github.com/senstella/parakeet-mlx
- NVIDIA model card: https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3
- MLX model: https://huggingface.co/mlx-community/parakeet-tdt-0.6b-v3

## Supported Inputs

Use files that `ffmpeg` can decode, such as `wav`, `mp3`, `m4a`, `mp4`, `mov`, and `webm`.

## Output Artifacts

The default run creates one transcript folder containing:

- `transcript-raw.md`: faithful Parakeet ASR output with timestamps.
- `transcript-clean.md`: clean-verbatim Markdown with the same timestamp structure. The script writes a deterministic pre-clean, then Codex must run the model clean-verbatim pass from `cleaning-prompts.md` and overwrite this file.

## Useful Options

- `--chunk-duration 120`: chunk long audio into 120-second windows.
- `--overlap-duration 15`: overlap chunks to reduce boundary mistakes.
- `--decoding greedy`: fastest default.
- `--decoding beam`: slower decode that may improve difficult audio.
- `--title`: override output folder and transcript heading.
- `--out-dir`: write transcript folders under a specific root.
- `--max-words`, `--silence-gap`, `--max-duration`: sentence splitting controls.

## Limitations

- v1 does not perform diarization or known-speaker labeling.
- Parakeet v3 supports 25 European languages; do not assume broad Whisper-style multilingual coverage.
- This skill is local-only but downloads the model from Hugging Face on first use unless it is already cached.
