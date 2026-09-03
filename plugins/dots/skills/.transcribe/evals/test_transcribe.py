from __future__ import annotations

import json
import os
import shutil
import stat
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SKILLS_ROOT = Path(__file__).resolve().parents[2]
SKILL_ROOT = SKILLS_ROOT / "transcribe"
TRANSCRIBE = SKILL_ROOT / "scripts" / "transcribe.py"
DOCTOR = SKILL_ROOT / "scripts" / "doctor.py"
SAMPLE_VIDEO = Path(__file__).resolve().parent / "fixtures" / "clear-speech.mp4"
EXPECTED_PHRASE = "Hello from the Dots transcribe skill"


def executable(path: Path, source: str) -> None:
    path.write_text(source, encoding="utf-8")
    path.chmod(path.stat().st_mode | stat.S_IXUSR)


def fake_whisper_cli(path: Path) -> None:
    executable(
        path,
        f"""#!{sys.executable}
import json
import os
import sys
from pathlib import Path

args = sys.argv[1:]
prefix = Path(args[args.index('-of') + 1])
marker = os.environ.get('FAKE_WHISPER_MARKER')
if marker:
    Path(marker).write_text('called', encoding='utf-8')
mode = os.environ.get('FAKE_WHISPER_MODE')
segments = [
    {{
        'offsets': {{'from': 0, 'to': 2400}},
        'text': ' {EXPECTED_PHRASE}.',
    }}
]
if mode == 'mixed-non-speech':
    segments = [
        {{'offsets': {{'from': 0, 'to': 500}}, 'text': ' [soft music] '}},
        {{'offsets': {{'from': 500, 'to': 1800}}, 'text': ' Hello [Music Playing] there. '}},
        {{'offsets': {{'from': 1800, 'to': 2400}}, 'text': ' (crowd cheering) '}},
    ]
elif mode == 'non-speech':
    segments = [
        {{'offsets': {{'from': 0, 'to': 1000}}, 'text': ' ♪♪ '}},
        {{'offsets': {{'from': 1000, 'to': 2000}}, 'text': ' [soft music playing] '}},
    ]
payload = {{
    'transcription': segments
}}
prefix.with_suffix('.json').write_text(json.dumps(payload), encoding='utf-8')
""",
    )


def fake_ytdlp(path: Path) -> None:
    executable(
        path,
        f"""#!{sys.executable}
import json
import os
import shutil
import sys
from pathlib import Path

args = sys.argv[1:]
url = args[-1]
log = os.environ.get('FAKE_YTDLP_LOG')
if log:
    with Path(log).open('a', encoding='utf-8') as stream:
        stream.write('call\\n')

if '--dump-single-json' in args:
    manual_url = os.environ.get('FAKE_MANUAL_URL')
    if 'brokenmanual' in url:
        manual_url = os.environ.get('FAKE_EMPTY_CAPTION_URL')
    if 'failedmanual' in url:
        manual_url = os.environ.get('FAKE_EMPTY_CAPTION_URL')
    manual = {{'en': [{{'ext': 'vtt', 'url': manual_url}}]}} if 'manual' in url else {{}}
    automatic = {{'en': [{{'ext': 'vtt', 'url': os.environ.get('FAKE_AUTO_URL')}}]}} if 'none' not in url else {{}}
    print(json.dumps({{
        'id': 'sample123',
        'title': 'Sample YouTube video',
        'duration': 4.0,
        'language': 'en',
        'subtitles': manual,
        'automatic_captions': automatic,
    }}))
    raise SystemExit(0)

output = args[args.index('--output') + 1]
output = output.replace('%(language)s', 'en')

if '--write-subs' in args or '--write-auto-subs' in args:
    output = output.replace('%(ext)s', 'vtt')
    if 'brokenmanual' in url and '--write-subs' in args:
        raise SystemExit(0)
    if 'failedmanual' in url and '--write-subs' in args:
        print('caption unavailable', file=sys.stderr)
        raise SystemExit(1)
    if '--write-auto-subs' in args:
        Path(output).write_text(
            'WEBVTT\\n\\n'
            '00:00:00.000 --> 00:00:01.000\\n'
            '{EXPECTED_PHRASE}<00:00:00.500><c> from</c>\\n\\n'
            '00:00:01.000 --> 00:00:02.000\\n'
            '{EXPECTED_PHRASE} from\\n'
            'automatic<00:00:01.500><c> captions.</c>\\n\\n'
            '00:00:02.000 --> 00:00:02.010\\n'
            'automatic captions.\\n',
            encoding='utf-8',
        )
        raise SystemExit(0)
    text = '{EXPECTED_PHRASE} from manual captions.'
    Path(output).write_text(
        'WEBVTT\\n\\n00:00:00.000 --> 00:00:02.400\\n' + text + '\\n',
        encoding='utf-8',
    )
    raise SystemExit(0)

output = output.replace('%(ext)s', 'mp4')
shutil.copyfile(os.environ['FAKE_SAMPLE_VIDEO'], output)
print(output)
""",
    )


class TranscribeUserStories(unittest.TestCase):
    def setUp(self) -> None:
        self.assertTrue(SAMPLE_VIDEO.exists(), f"missing fixture: {SAMPLE_VIDEO}")
        self.temp = tempfile.TemporaryDirectory(prefix="dots-transcribe-test-")
        self.root = Path(self.temp.name)
        self.bin = self.root / "bin"
        self.bin.mkdir()
        fake_whisper_cli(self.bin / "whisper-cli")
        fake_ytdlp(self.bin / "yt-dlp")
        self.manual_caption = self.root / "manual.vtt"
        self.manual_caption.write_text(
            f"WEBVTT\n\n00:00:00.000 --> 00:00:02.400\n{EXPECTED_PHRASE} from manual captions.\n",
            encoding="utf-8",
        )
        self.auto_caption = self.root / "automatic.vtt"
        self.auto_caption.write_text(
            "WEBVTT\n\n"
            "00:00:00.000 --> 00:00:01.000\n"
            " \n"
            f"{EXPECTED_PHRASE}<00:00:00.500><c> from</c>\n\n"
            "00:00:01.000 --> 00:00:02.000\n"
            f"{EXPECTED_PHRASE} from\n"
            "automatic<00:00:01.500><c> captions.</c>\n\n"
            "00:00:02.000 --> 00:00:02.010\n"
            "automatic captions.\n",
            encoding="utf-8",
        )
        self.empty_caption = self.root / "empty.vtt"
        self.empty_caption.write_text("WEBVTT\n", encoding="utf-8")
        self.model = self.root / "ggml-tiny.en.bin"
        self.model.write_bytes(b"test model")
        self.env = os.environ.copy()
        self.env["PATH"] = os.pathsep.join([str(self.bin), self.env.get("PATH", "")])
        self.env["WHISPER_MODEL"] = str(self.model)
        self.env["FAKE_SAMPLE_VIDEO"] = str(SAMPLE_VIDEO)
        self.env["FAKE_MANUAL_URL"] = self.manual_caption.as_uri()
        self.env["FAKE_AUTO_URL"] = self.auto_caption.as_uri()
        self.env["FAKE_EMPTY_CAPTION_URL"] = self.empty_caption.as_uri()

    def tearDown(self) -> None:
        self.temp.cleanup()

    def run_cli(self, *args: str, expected: int = 0) -> subprocess.CompletedProcess[str]:
        result = subprocess.run(
            [sys.executable, str(TRANSCRIBE), *args],
            text=True,
            capture_output=True,
            env=self.env,
            timeout=30,
        )
        self.assertEqual(result.returncode, expected, result.stderr)
        return result

    def test_local_video_becomes_a_markdown_transcript(self) -> None:
        source = self.root / "sample video.mp4"
        source.write_bytes(SAMPLE_VIDEO.read_bytes())
        output = self.root / "local transcript.md"

        result = self.run_cli(str(source), "--output", str(output), "--backend", "whisper-cpp")

        self.assertTrue(output.exists())
        rendered = output.read_text(encoding="utf-8")
        self.assertIn("# Transcript: sample video", rendered)
        self.assertIn(EXPECTED_PHRASE, rendered)
        self.assertIn("whisper.cpp", rendered)
        self.assertIn(str(output), result.stdout)

    def test_youtube_manual_captions_win_without_running_asr(self) -> None:
        output = self.root / "manual.md"
        log = self.root / "yt-dlp.log"
        self.env["FAKE_YTDLP_LOG"] = str(log)

        self.run_cli("https://www.youtube.com/watch?v=manual", "--output", str(output))

        rendered = output.read_text(encoding="utf-8")
        self.assertIn("manual captions", rendered)
        self.assertIn("youtube-manual", rendered)
        self.assertNotIn("automatic captions", rendered)
        self.assertEqual(log.read_text(encoding="utf-8").splitlines(), ["call"])

    def test_youtube_automatic_captions_are_the_second_choice(self) -> None:
        output = self.root / "automatic.md"

        self.run_cli("https://youtu.be/automatic", "--output", str(output))

        rendered = output.read_text(encoding="utf-8")
        self.assertIn("automatic captions", rendered)
        self.assertIn("youtube-auto", rendered)
        self.assertEqual(rendered.count(EXPECTED_PHRASE), 1)
        self.assertIn("**[00:00:00.000]**", rendered)

    def test_empty_manual_caption_falls_through_to_automatic(self) -> None:
        output = self.root / "fallback-auto.md"

        self.run_cli("https://youtube.com/watch?v=brokenmanual", "--output", str(output))

        rendered = output.read_text(encoding="utf-8")
        self.assertIn("automatic captions", rendered)
        self.assertIn("youtube-auto", rendered)

    def test_failed_manual_download_falls_through_to_automatic(self) -> None:
        output = self.root / "failed-manual.md"

        self.run_cli("https://youtube.com/watch?v=failedmanual", "--output", str(output))

        rendered = output.read_text(encoding="utf-8")
        self.assertIn("automatic captions", rendered)
        self.assertIn("youtube-auto", rendered)

    def test_embedded_youtube_url_is_accepted(self) -> None:
        output = self.root / "embedded.md"

        self.run_cli("https://www.youtube-nocookie.com/embed/manual", "--output", str(output))

        self.assertIn("manual captions", output.read_text(encoding="utf-8"))

    def test_youtube_without_captions_downloads_audio_and_runs_local_asr(self) -> None:
        output = self.root / "fallback.md"

        self.run_cli(
            "https://youtube.com/watch?v=none",
            "--output",
            str(output),
            "--backend",
            "whisper-cpp",
        )

        rendered = output.read_text(encoding="utf-8")
        self.assertIn(EXPECTED_PHRASE, rendered)
        self.assertIn("whisper.cpp", rendered)

    def test_force_asr_ignores_available_youtube_captions(self) -> None:
        output = self.root / "forced.md"

        self.run_cli(
            "https://youtube.com/watch?v=manual",
            "--output",
            str(output),
            "--backend",
            "whisper-cpp",
            "--force-asr",
        )

        rendered = output.read_text(encoding="utf-8")
        self.assertIn(EXPECTED_PHRASE, rendered)
        self.assertIn("whisper.cpp", rendered)
        self.assertNotIn("manual captions", rendered)

    def test_one_transcript_renders_all_supported_document_formats(self) -> None:
        expected = {
            "md": EXPECTED_PHRASE,
            "txt": EXPECTED_PHRASE,
            "json": '"segments"',
            "srt": "00:00:00,000 --> 00:00:02,400",
            "vtt": "WEBVTT",
        }
        for format_name, marker in expected.items():
            with self.subTest(format=format_name):
                output = self.root / f"transcript.{format_name}"
                self.run_cli(
                    str(SAMPLE_VIDEO),
                    "--output",
                    str(output),
                    "--format",
                    format_name,
                    "--backend",
                    "whisper-cpp",
                )
                self.assertIn(marker, output.read_text(encoding="utf-8"))

    def test_invalid_input_fails_without_creating_a_document(self) -> None:
        output = self.root / "missing.md"

        result = self.run_cli(
            str(self.root / "missing.mp4"),
            "--output",
            str(output),
            expected=2,
        )

        self.assertIn("input file does not exist", result.stderr)
        self.assertFalse(output.exists())

    def test_existing_output_is_preserved_without_force(self) -> None:
        output = self.root / "existing.md"
        output.write_text("keep me", encoding="utf-8")

        result = self.run_cli(
            str(SAMPLE_VIDEO),
            "--output",
            str(output),
            "--backend",
            "whisper-cpp",
            expected=2,
        )

        self.assertIn("output already exists", result.stderr)
        self.assertEqual(output.read_text(encoding="utf-8"), "keep me")

        self.run_cli(
            str(SAMPLE_VIDEO),
            "--output",
            str(output),
            "--backend",
            "whisper-cpp",
            "--force",
        )
        self.assertIn(EXPECTED_PHRASE, output.read_text(encoding="utf-8"))

    def test_output_directory_is_rejected_before_asr(self) -> None:
        marker = self.root / "whisper-called"
        self.env["FAKE_WHISPER_MARKER"] = str(marker)

        result = self.run_cli(
            str(SAMPLE_VIDEO),
            "--output",
            str(self.root),
            "--force",
            expected=2,
        )

        self.assertIn("output path is a directory", result.stderr)
        self.assertFalse(marker.exists())

    def test_non_speech_annotations_are_removed(self) -> None:
        output = self.root / "spoken.md"
        self.env["FAKE_WHISPER_MODE"] = "mixed-non-speech"

        self.run_cli(str(SAMPLE_VIDEO), "--output", str(output), "--backend", "whisper-cpp")

        rendered = output.read_text(encoding="utf-8")
        self.assertIn("Hello there.", rendered)
        self.assertNotIn("music", rendered.lower())
        self.assertNotIn("applause", rendered.lower())
        self.assertNotIn("♪", rendered)

    def test_non_speech_only_result_is_rejected(self) -> None:
        output = self.root / "non-speech.md"
        self.env["FAKE_WHISPER_MODE"] = "non-speech"

        result = self.run_cli(
            str(SAMPLE_VIDEO),
            "--output",
            str(output),
            "--backend",
            "whisper-cpp",
            expected=2,
        )

        self.assertIn("no spoken text", result.stderr)
        self.assertFalse(output.exists())

    def test_video_without_audio_has_a_specific_diagnostic(self) -> None:
        ffmpeg = shutil.which("ffmpeg")
        self.assertIsNotNone(ffmpeg)
        source = self.root / "no-audio.mp4"
        subprocess.run(
            [ffmpeg, "-nostdin", "-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "color=s=320x240:d=1", "-an", str(source)],
            check=True,
            capture_output=True,
        )

        result = self.run_cli(
            str(source),
            "--output",
            str(self.root / "no-audio.md"),
            "--backend",
            "whisper-cpp",
            expected=3,
        )

        self.assertIn("input has no audio stream", result.stderr)

    def test_concurrent_whisper_cpp_run_fails_fast(self) -> None:
        try:
            import fcntl
        except ImportError:
            self.skipTest("advisory file locks are unavailable")
        lock_path = Path(tempfile.gettempdir()) / f"dots-transcribe-whisper-cpp-{os.getuid()}.lock"
        with lock_path.open("a", encoding="utf-8") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            result = self.run_cli(
                str(SAMPLE_VIDEO),
                "--output",
                str(self.root / "concurrent.md"),
                "--backend",
                "whisper-cpp",
                expected=3,
            )

        self.assertIn("another whisper.cpp transcription is already running", result.stderr)

    def test_doctor_reports_available_routes_as_json(self) -> None:
        result = subprocess.run(
            [sys.executable, str(DOCTOR), "--json"],
            text=True,
            capture_output=True,
            env=self.env,
            timeout=15,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        payload = json.loads(result.stdout)
        self.assertTrue(payload["yt_dlp"]["available"])
        self.assertTrue(payload["ffmpeg"]["available"])
        self.assertTrue(payload["whisper_cpp"]["available"])
        self.assertTrue(payload["whisper_cpp"]["ready"])

    def test_only_the_skinny_local_backend_is_exposed(self) -> None:
        help_result = self.run_cli("--help")
        self.assertIn("--backend {auto,whisper-cpp}", help_result.stdout)
        doctor = subprocess.run(
            [sys.executable, str(DOCTOR), "--json"],
            text=True,
            capture_output=True,
            env=self.env,
            timeout=15,
        )
        self.assertEqual(doctor.returncode, 0, doctor.stderr)
        self.assertEqual(
            set(json.loads(doctor.stdout)),
            {"yt_dlp", "ffmpeg", "whisper_cpp"},
        )


if __name__ == "__main__":
    unittest.main()
