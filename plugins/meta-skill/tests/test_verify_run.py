"""Tests for eval verify-run input-snapshot integrity checks."""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.runner import run_eval  # noqa: E402
from meta_skill.verify_run import verify_run  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def write_skill(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "SKILL.md").write_text(
        """---
name: demo
description: "Use for verify-run tests."
---

# demo

Original skill.
"""
    )


def build_run(project: Path) -> Path:
    write_skill(project)
    suite = project / ".demo" / "evals.json"
    write_json(
        suite,
        {
            "schema_version": 1,
            "target": {"type": "skill", "ref": "SKILL.md"},
            "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
            "cases": [
                {
                    "id": "answer",
                    "type": "capability",
                    "task": {"prompt": "Say good."},
                    "expectations": ["The response contains good."],
                }
            ],
        },
    )
    args = SimpleNamespace(
        suite=str(suite),
        candidates=None,
        split=None,
        case=None,
        type=None,
        repetitions=None,
        model=None,
        no_grade=False,
        repetitions_by_type={},
        preset_default_repetitions=None,
        preset={},
    )

    def fake_app_server(_row, _prompt, _candidate, _event_path, output_path, _model):
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text("good\n")
        return {"status": "completed", "events": 1, "usage": None}

    def fake_judge(**kwargs):
        return {"score": 1.0, "label": "pass", "rationale": "ok", "checks": [], "eval_feedback": []}

    with patch("meta_skill.runner.app_server_run", side_effect=fake_app_server), patch(
        "meta_skill.grading.judge_output", side_effect=fake_judge
    ):
        result = run_eval(args)
    return Path(result["run_dir"])


class VerifyRunTests(unittest.TestCase):
    def test_untouched_run_verifies_clean(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = build_run(Path(tmp))
            result = verify_run(str(run_dir))
            self.assertTrue(result["ok"], result["checks"])
            names = [check["name"] for check in result["checks"]]
            self.assertIn("task:answer", names)
            self.assertIn("candidate:current", names)
            self.assertIn("summary_totals", names)

    def test_tampered_task_and_snapshot_fail(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = build_run(Path(tmp))
            (run_dir / "inputs" / "cases" / "answer" / "task.md").write_text("tampered\n")
            (run_dir / "inputs" / "candidates" / "current" / "SKILL.md").write_text("tampered\n")
            result = verify_run(str(run_dir))
            self.assertFalse(result["ok"])
            failing = {check["name"] for check in result["checks"] if not check["ok"]}
            self.assertIn("task:answer", failing)
            self.assertIn("candidate:current", failing)


if __name__ == "__main__":
    unittest.main()
