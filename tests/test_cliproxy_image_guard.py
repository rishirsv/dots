"""Regression checks for Claude's many-image request limit."""

import base64
from io import BytesIO
import importlib.util
import json
from pathlib import Path
import unittest

from PIL import Image


GUARD = Path(__file__).resolve().parents[1] / "scripts" / "cliproxy-image-guard.py"
SPEC = importlib.util.spec_from_file_location("cliproxy_image_guard", GUARD)
guard = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(guard)


class ClaudeImageGuardTests(unittest.TestCase):
    def test_existing_chat_with_21_images_resizes_oversized_image(self):
        def image_url(size):
            output = BytesIO()
            Image.new("RGB", size, "white").save(output, "PNG")
            return "data:image/png;base64," + base64.b64encode(output.getvalue()).decode()

        images = [image_url((32, 32)) for _ in range(20)] + [image_url((2048, 889))]
        payload = {"model": "claude-opus-5-5", "input": [{"content": images}]}
        body = json.dumps(payload).encode()
        resized = json.loads(guard.prepare_body(body, "/v1/responses"))

        self.assertEqual(resized["input"][0]["content"][:20], images[:20])
        encoded = resized["input"][0]["content"][20].split(",", 1)[1]
        with Image.open(BytesIO(base64.b64decode(encoded))) as image:
            self.assertEqual(image.size, (2000, 868))
        self.assertEqual(
            guard.prepare_body(body.replace(b"claude-opus-5-5", b"gpt-6-sol"), "/v1/responses"),
            body.replace(b"claude-opus-5-5", b"gpt-6-sol"),
        )


if __name__ == "__main__":
    unittest.main()
