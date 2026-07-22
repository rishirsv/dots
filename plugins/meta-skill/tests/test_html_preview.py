"""Contracts for optional harness-owned HTML previews."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.html_preview import SOURCE_BYTE_LIMIT, generate_html_previews


class HtmlPreviewTests(unittest.TestCase):
    def test_generates_cache_for_bounded_html_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = Path(tmp)
            artifacts = run / "trials" / "a.current.t1" / "artifacts"
            artifacts.mkdir(parents=True)
            (artifacts / "page.html").write_text("<h1>Safe</h1><script>throw 1</script>")
            (artifacts / "shape.svg").write_text("<svg/>")
            (artifacts / "large.html").write_bytes(b"x" * (SOURCE_BYTE_LIMIT + 1))

            def capture(command, **kwargs):
                output = Path(command[-1])
                frame = output.with_name(f"{output.stem}-001.png")
                frame.write_bytes(b"\x89PNG\r\n\x1a\n")
                return subprocess.CompletedProcess(
                    command, 0,
                    stdout=json.dumps({
                        "generated_by": "harness",
                        "frames": [{"file": frame.name, "index": 1, "label": "Safe", "width": 1440, "height": 900}],
                        "environment": {"node": "v24.0.0", "browser": "Chrome/140.0.0.0"},
                    }),
                    stderr="",
                )

            with patch("meta_skill.html_preview.subprocess.run", side_effect=capture) as invoked:
                generate_html_previews(run)

            self.assertEqual(invoked.call_count, 1)
            index = json.loads((run / "trials" / "a.current.t1" / "previews" / "index.json").read_text())
            self.assertEqual(index["schema_version"], 3)
            self.assertEqual(list(index["entries"]), ["page.html"])
            self.assertEqual(index["entries"]["page.html"]["generated_by"], "harness")
            self.assertEqual(index["entries"]["page.html"]["frames"][0]["label"], "Safe")
            self.assertEqual(index["entries"]["page.html"]["environment"]["node"], "v24.0.0")

    def test_capture_failure_is_non_blocking(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = Path(tmp)
            artifact = run / "trials" / "a.current.t1" / "artifacts" / "page.html"
            artifact.parent.mkdir(parents=True)
            artifact.write_text("<p>Page</p>")
            with patch("meta_skill.html_preview.subprocess.run", side_effect=subprocess.TimeoutExpired("node", 20)):
                generate_html_previews(run)
            index = json.loads((artifact.parent.parent / "previews" / "index.json").read_text())
            self.assertEqual(index["errors"], {"page.html": "Harness rendering did not complete."})
