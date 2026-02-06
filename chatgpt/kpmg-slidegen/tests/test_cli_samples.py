import json
import tempfile
import unittest
from pathlib import Path

from cli import _ensure_native_samples, _pick_benchmark_slots


class TestCliNativeSamples(unittest.TestCase):
    def test_ensure_native_samples_rewrites_incomplete_benchmarks(self):
        with tempfile.TemporaryDirectory() as td:
            template_dir = Path(td)
            template_json_path = template_dir / "template.json"
            template_json_path.write_text(
                json.dumps(
                    {
                        "templateMode": "native",
                        "layouts": {
                            "layout.alpha": {"slots": {"text_title": {"kind": "text"}}},
                            "layout.beta": {"slots": {"chart_chart": {"kind": "chart"}}},
                            "layout.gamma": {"slots": {"image_logo": {"kind": "image"}}},
                        },
                    }
                )
            )

            samples_dir = template_dir / "samples"
            samples_dir.mkdir(parents=True, exist_ok=True)
            (samples_dir / "benchmark-normal.json").write_text(
                json.dumps({"metadata": {"title": "stale"}, "slides": [{"type": "layout.alpha", "slots": {}}]})
            )

            _ensure_native_samples(template_dir, template_json_path)

            normal = json.loads((samples_dir / "benchmark-normal.json").read_text())
            stress = json.loads((samples_dir / "benchmark-stress.json").read_text())

            normal_types = [slide.get("type") for slide in normal.get("slides", [])]
            stress_types = [slide.get("type") for slide in stress.get("slides", [])]
            expected = ["layout.alpha", "layout.beta", "layout.gamma"]

            self.assertEqual(normal_types, expected)
            self.assertEqual(stress_types, expected)

    def test_pick_benchmark_slots_skips_overlapping_optional_text(self):
        layout = {
            "slots": {
                "text_title": {
                    "kind": "text",
                    "required": True,
                    "bbox": {"x": 1, "y": 1, "w": 4, "h": 1},
                },
                "text_body_overlap": {
                    "kind": "text",
                    "required": False,
                    "bbox": {"x": 1, "y": 1, "w": 4, "h": 1},
                },
                "text_left_body": {
                    "kind": "text",
                    "required": False,
                    "bbox": {"x": 1, "y": 2, "w": 4, "h": 2},
                },
                "chart_main": {
                    "kind": "chart",
                    "required": False,
                    "bbox": {"x": 5.5, "y": 2, "w": 3, "h": 3},
                },
            },
            "slotAliases": {
                "title": "text_title",
                "leftBody": "text_left_body",
                "body1": "text_body_overlap",
                "chart": "chart_main",
            },
            "slotOrder": ["text_title", "text_body_overlap", "text_left_body", "chart_main"],
        }

        selected = _pick_benchmark_slots(layout)
        self.assertIn("text_title", selected)
        self.assertIn("text_left_body", selected)
        self.assertIn("chart_main", selected)
        self.assertNotIn("text_body_overlap", selected)


if __name__ == "__main__":
    unittest.main()
