# Transcribe backends and setup

Read only the section needed to make `scripts/doctor.py` report a viable route
or to honor an explicit language or model choice. Commands below install
software or download model files; show the relevant command and let the user
choose whether to run it.

## YouTube: captions first, audio second

The orchestrator uses `yt-dlp --no-playlist` to inspect one video. It prefers a
manual track in the requested/source language, then an automatic track. Only
when neither exists, or `--force-asr` is set, does it download `bestaudio/b` and
run local ASR.

Use a current yt-dlp build. Current YouTube support also requires external
JavaScript challenge solving. The official executable distributions include
the EJS component; Python installations need `yt-dlp[default]` plus a supported
runtime. Deno is the yt-dlp project's recommended runtime and is enabled by
default. See the current [yt-dlp EJS setup guide](https://github.com/yt-dlp/yt-dlp/wiki/EJS)
instead of copying version floors into the skill.

If yt-dlp reports login, region, bot/IP, PO-token, or unavailable-video errors,
preserve that distinction. Browser cookies expose account credentials and can
put an account at risk; proxies and PO-token providers also change the privacy,
cost, and authorization boundary. The skill diagnoses these states but does not
configure around them.

## Portable CPU and native acceleration: whisper.cpp

`whisper.cpp` is the native, dependency-light route. The adapter uses FFmpeg to
normalize any decodable media to 16 kHz mono PCM WAV, then asks `whisper-cli`
for full JSON output. Install whisper.cpp and FFmpeg with the platform's package
manager, then download a GGML model separately.

The upstream project documents three supported ways to obtain a model in its
[GGML model guide](https://github.com/ggml-org/whisper.cpp/blob/master/models/README.md).
For example, from a whisper.cpp checkout:

```sh
./models/download-ggml-model.sh base.en
python3 scripts/transcribe.py media.mp4 \
  --backend whisper-cpp \
  --model /absolute/path/to/ggml-base.en.bin \
  --output transcript.md
```

Use an `.en` model only for English. Tiny/base models reduce download, memory,
and latency; small/medium/large models trade those resources for accuracy. The
adapter accepts `WHISPER_MODEL=/absolute/path/model.bin` when one maintained
machine-level default is more convenient than passing `--model` each time.

## Output and failure interpretation

Every successful route becomes the same normalized record: title, source,
source kind, provider, language, and ordered `{start, end, text}` segments. The
renderer then emits:

- `md`: readable metadata and timestamped paragraphs;
- `txt`: spoken text only;
- `json`: the normalized reusable record;
- `srt` or `vtt`: segment-level subtitles.

An empty transcript is a failure. For subtitle output, confirm start/end order
and spot-check synchronization. Speaker diarization is intentionally outside
the skinny runtime: WhisperX/pyannote add gated model access, downloads, and
latency. If the user requires speaker labels, state that additional boundary
instead of implying the current skill assigned speakers.
