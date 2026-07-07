"""Tests for the frozen eval runner contract."""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError  # noqa: E402
from meta_skill.io import read_jsonl  # noqa: E402
from meta_skill.runner import run_eval  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def write_skill(path: Path, name="demo", body="Original skill.") -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "SKILL.md").write_text(
        f"""---
name: {name}
description: "Use for eval runner tests."
---

# {name}

{body}
"""
    )


def args_for(suite, **overrides):
    defaults = {
        "suite": str(suite),
        "candidates": None,
        "split": None,
        "case": None,
        "type": None,
        "repetitions": None,
        "model": None,
        "no_grade": False,
        "repetitions_by_type": {},
        "preset_default_repetitions": None,
        "preset": {},
        "parallel": 1,
        "adhoc": False,
        "task": None,
        "skill": None,
    }
    defaults.update(overrides)
    return SimpleNamespace(**defaults)


class EvalRunnerContractTests(unittest.TestCase):
    def test_prompt_only_case_freezes_task_and_grades_bad_answer_failed(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            write_skill(project, "demo")
            suite = project / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [
                        {
                            "id": "answer-well",
                            "type": "capability",
                            "task": {"prompt": "Answer with the word good."},
                            "expectations": ["The response contains the word good."],
                        }
                    ],
                },
            )

            def fake_app_server(_row, _prompt, _candidate, _event_path, output_path, _model):
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_text("bad\n")
                return {"status": "completed", "events": 1, "usage": {"input_tokens": 1, "output_tokens": 1}}

            def fake_judge(**kwargs):
                self.assertEqual(kwargs["task_text"].strip(), "Answer with the word good.")
                return {
                    "score": 0.0,
                    "label": "fail",
                    "rationale": "The response did not contain good.",
                    "checks": [{"name": "contains-good", "label": "fail", "evidence": kwargs["output_text"]}],
                    "eval_feedback": [],
                }

            with patch("meta_skill.runner.app_server_run", side_effect=fake_app_server), patch("meta_skill.grading.judge_output", side_effect=fake_judge):
                result = run_eval(args_for(suite))

            run_dir = Path(result["run_dir"])
            self.assertFalse((project / ".demo" / "cases" / "answer-well" / "task.md").exists())
            self.assertEqual((run_dir / "inputs" / "cases" / "answer-well" / "task.md").read_text().strip(), "Answer with the word good.")
            self.assertEqual(read_jsonl(run_dir / "results.jsonl")[0]["runtime_status"], "completed")
            self.assertEqual(result["summary"]["final_verdict_totals"], {"failed": 1})
            self.assertFalse(result["ok"])

    def test_missing_expectations_fail_graded_prompt_run_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            write_skill(project, "demo")
            suite = project / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [{"id": "missing", "type": "capability", "task": {"prompt": "Do something."}}],
                },
            )

            with self.assertRaises(CliError) as ctx:
                run_eval(args_for(suite))

            self.assertIn("graded prompt evals require expectations", ctx.exception.message)

    def test_parallel_run_writes_same_result_rows_as_serial_without_corrupt_jsonl(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            write_skill(project, "demo")
            suite = project / ".demo" / "evals.json"
            cases = [
                {"id": "case-a", "type": "capability", "task": {"prompt": "A"}},
                {"id": "case-b", "type": "capability", "task": {"prompt": "B"}},
                {"id": "case-c", "type": "capability", "task": {"prompt": "C"}},
            ]
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": cases,
                },
            )

            def fake_app_server(row, _prompt, _candidate, _event_path, output_path, _model):
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_text(f"{row['trial_id']}\n")
                return {"status": "completed", "events": 1}

            def run_and_project(parallel):
                with patch("meta_skill.runner.app_server_run", side_effect=fake_app_server):
                    result = run_eval(args_for(suite, no_grade=True, parallel=parallel))
                rows = read_jsonl(Path(result["run_dir"]) / "results.jsonl")
                return {
                    (
                        row["trial_id"],
                        row["case_id"],
                        row["candidate"],
                        row["repetition"],
                        row["runtime_status"],
                        row.get("error"),
                    )
                    for row in rows
                }, len(rows)

            serial_rows, serial_count = run_and_project(1)
            parallel_rows, parallel_count = run_and_project(2)

            self.assertEqual(parallel_rows, serial_rows)
            self.assertEqual(parallel_count, serial_count)
            self.assertEqual(parallel_count, 3)

    def test_adhoc_run_freezes_one_case_stages_payload_and_stays_ungraded(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill_dir = Path(tmp) / "skill"
            write_skill(skill_dir, "demo", body="Adhoc payload.")

            def fake_app_server(row, _prompt, candidate, _event_path, output_path, _model):
                self.assertEqual(row["case"]["id"], "adhoc-1")
                self.assertTrue((Path(candidate["payload_path"]) / "SKILL.md").is_file())
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_text("adhoc response\n")
                return {"status": "completed", "events": 1}

            args = args_for(
                None,
                adhoc=True,
                task="Check this exact prompt.",
                skill=str(skill_dir),
                no_grade=False,
            )
            with patch("meta_skill.runner.app_server_run", side_effect=fake_app_server):
                result = run_eval(args)

            run_dir = Path(result["run_dir"])
            run_model = json.loads((run_dir / "run.json").read_text())
            frozen_suite = json.loads((run_dir / "inputs" / "suite.json").read_text())
            trial_workspace = run_dir / "trials" / "adhoc-1.current.t1" / "workspace"

            self.assertTrue(result["adhoc"])
            self.assertTrue(run_model["adhoc"])
            self.assertEqual(run_model["selected_cases"], ["adhoc-1"])
            self.assertEqual(run_model["runner_config"]["grading_mode"], "none")
            self.assertEqual(frozen_suite["cases"][0]["task_text"], "Check this exact prompt.\n")
            self.assertEqual((trial_workspace / "task.md").read_text(), "Check this exact prompt.\n")
            self.assertEqual((trial_workspace / "skill" / "SKILL.md").read_text(), (skill_dir / "SKILL.md").read_text())
            self.assertFalse((skill_dir / ".demo" / "evals.json").exists())
            self.assertEqual(result["summary"]["final_verdict_totals"], {"ungraded": 1})


if __name__ == "__main__":
    unittest.main()
