"""Tests for the current eval manifest authoring contract."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.manifest import load_manifest  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


class ManifestTests(unittest.TestCase):
    def test_prompt_manifest_normalizes_eval_rows_to_cases(self):
        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "evals": [
                        {
                            "id": "case-a",
                            "type": "capability",
                            "prompt": "Say done.",
                            "fixtures": ["input.txt"],
                            "expectations": ["The response says done."],
                        }
                    ],
                },
            )

            manifest = load_manifest(suite)

            self.assertEqual(manifest["_manifest_shape"], "prompt")
            self.assertEqual(manifest["cases"][0]["task"], {"prompt": "Say done."})
            self.assertEqual(manifest["cases"][0]["fixtures"], ["input.txt"])


if __name__ == "__main__":
    unittest.main()
