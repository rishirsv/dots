---
name: transcribe
description: "Transcribes local media and YouTube videos into Markdown, text, JSON, SRT, or VTT, then creates task-shaped YouTube summaries when requested. Uses captions first and free local speech recognition otherwise. Use for recorded-media transcripts, subtitles, or YouTube summaries; not live capture or paid/cloud transcription."
---

# Transcribe

Turn one local media file or one YouTube video into a transcript document. Use
YouTube captions before spending time downloading audio or running a model.

## Produce the transcript

1. Confirm the input is one local file or YouTube video and that the user is
   entitled to transcribe it. Do not bypass DRM, access controls, or platform
   restrictions.
2. Run the orchestrator from this skill directory:

   ```sh
   python3 scripts/transcribe.py "<media-path-or-youtube-url>" --output "<transcript.md>"
   ```

   Omit `--output` only when writing the generated document into the current
   directory is appropriate. The command prints the absolute output path.
3. If the command reports a missing downloader, decoder, ASR runtime, or model,
   run `python3 scripts/doctor.py`. Read [backends.md](references/backends.md)
   only for the missing route, a model choice, or a speed/accuracy override.
4. Open the produced document. Require non-empty spoken text, ordered
   timestamps, and no obvious repeated hallucination loop. Report the output
   path and whether the result used manual captions, automatic captions, or a
   local ASR backend.
5. When the user asks for a summary, notes, takeaways, an explanation, or an
   action plan from a YouTube video, read
   [youtube_summaries.md](references/youtube_summaries.md) after inspecting the
   transcript. Let the task determine the summary's structure and depth.

## Choose a non-default route only when it helps

- Keep the caption-first default for YouTube. Use `--force-asr` when the user
  requests a fresh transcription or the available captions are visibly
  unusable.
- Use `--language <code>` when the language is known. `auto` is the default.
- Use `--backend auto` unless the user explicitly asks for `whisper-cpp`.
  Local ASR requires a GGML model path through `--model` or `WHISPER_MODEL`.
  Run local ASR jobs serially; if another run owns the host lock, wait for it
  to finish instead of starting competing model processes.
- Markdown is the default. Use `--format txt|json|srt|vtt` with a matching
  output extension when the user requests another document or subtitle form.
- The command preserves an existing output by default. Use `--force` only when
  the user asked to replace that exact transcript.
- Use `--keep-temp` only to diagnose a failure. It preserves downloaded audio
  and intermediate backend output and prints their directory to stderr.

Run `python3 scripts/transcribe.py --help` for the complete mechanical
interface. Keep backend installation and rapidly changing YouTube setup out of
the common path; [backends.md](references/backends.md) owns that conditional
guidance.

## Stop with a useful result

If YouTube blocks the request, captions are absent, audio cannot be downloaded,
or whisper.cpp is unavailable, return the exact diagnostic and the
smallest setup or user action that would unblock that route. Do not silently
export browser cookies, configure proxies or PO-token providers, install
software, or switch to a paid service.

Finish only when the requested transcript file exists and its content was
inspected. Caption and ASR text can still contain errors; distinguish successful
conversion from verified word-for-word accuracy.
