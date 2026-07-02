"""End-to-end contract tests for the Meta Skill CLI launcher.

Drives `scripts/metaskill` as a subprocess: help surfaces, JSON output
contracts, package exclusions, and an eval run against a fake openai_codex
SDK injected via PYTHONPATH (the real App Server is never contacted).
Skips cleanly when no Python 3.10+ interpreter is available to the launcher.
"""

import json
import os
import subprocess
import sys
import tempfile
import textwrap
import unittest
import zipfile
from pathlib import Path

PLUGIN_ROOT = Path(__file__).resolve().parents[1]
LAUNCHER = PLUGIN_ROOT / "scripts" / "metaskill"


def base_env(extra=None):
    env = os.environ.copy()
    env["META_SKILL_SKIP_DEP_UPDATE"] = "1"
    if extra:
        env.update(extra)
    return env


def run_cli(*args, cwd=None, env=None, expect=(0,)):
    proc = subprocess.run(
        [str(LAUNCHER), *args],
        capture_output=True,
        text=True,
        cwd=cwd or PLUGIN_ROOT,
        env=env or base_env(),
        timeout=180,
    )
    if expect is not None and proc.returncode not in expect:
        raise AssertionError(
            f"metaskill {' '.join(args)} exited {proc.returncode}\nstdout: {proc.stdout}\nstderr: {proc.stderr}"
        )
    return proc


def run_json(*args, cwd=None, env=None, expect=(0,)):
    proc = run_cli(*args, cwd=cwd, env=env, expect=expect)
    return json.loads(proc.stdout), proc


def write_skill(path: Path, name="demo") -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "SKILL.md").write_text(
        f"""---
name: {name}
description: "Use for CLI contract tests of the Meta Skill launcher."
---

# {name}

Test skill payload.
"""
    )


def write_suite(project: Path, cases) -> Path:
    suite = project / ".demo" / "evals.json"
    suite.parent.mkdir(parents=True, exist_ok=True)
    suite.write_text(
        json.dumps(
            {
                "schema_version": 1,
                "target": {"type": "skill", "ref": "SKILL.md"},
                "candidates": [
                    {"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}
                ],
                "cases": cases,
            },
            indent=2,
        )
        + "\n"
    )
    return suite


def write_fake_sdk(root: Path) -> None:
    """Fake openai_codex package: canned successful turn returning 'final text'."""
    package = root / "openai_codex"
    generated = package / "generated"
    generated.mkdir(parents=True)
    (generated / "__init__.py").write_text("")
    (generated / "v2_all.py").write_text(
        textwrap.dedent(
            """\
            class MessagePhase:
                final_answer = "final_answer"

            class AgentMessageThreadItem:
                def __init__(self, text, phase):
                    self.text = text
                    self.phase = phase

            class ItemCompletedNotification:
                def __init__(self, turn_id, item):
                    self.turn_id = turn_id
                    self.item = item

            class ThreadTokenUsageUpdatedNotification:
                def __init__(self, turn_id, token_usage):
                    self.turn_id = turn_id
                    self.token_usage = token_usage

            class TurnCompletedNotification:
                def __init__(self, turn):
                    self.turn = turn
            """
        )
    )
    (package / "__init__.py").write_text(
        textwrap.dedent(
            """\
            from types import SimpleNamespace
            from .generated.v2_all import (
                AgentMessageThreadItem,
                ItemCompletedNotification,
                MessagePhase,
                ThreadTokenUsageUpdatedNotification,
                TurnCompletedNotification,
            )

            __version__ = "fake-sdk"

            class _Value:
                def __init__(self, value):
                    self.value = value

            class ApprovalMode:
                deny_all = "deny_all"

            class Sandbox:
                workspace_write = "workspace_write"

            class CodexConfig:
                def __init__(self, **kwargs):
                    self.kwargs = kwargs

            class SkillInput:
                def __init__(self, name, path):
                    self.name = name
                    self.path = path

            class TextInput:
                def __init__(self, text):
                    self.text = text

            class Usage:
                def model_dump(self, **kwargs):
                    return {"input_tokens": 7, "output_tokens": 11}

            class Event:
                def __init__(self, method, payload):
                    self.method = method
                    self.payload = payload

            class Turn:
                id = "turn_fake"

                def stream(self):
                    yield Event(
                        "thread.item_completed",
                        ItemCompletedNotification(
                            "turn_fake", AgentMessageThreadItem("final text", MessagePhase.final_answer)
                        ),
                    )
                    yield Event("thread.usage", ThreadTokenUsageUpdatedNotification("turn_fake", Usage()))
                    yield Event(
                        "turn.completed",
                        TurnCompletedNotification(
                            SimpleNamespace(id="turn_fake", status=_Value("completed"), duration_ms=12)
                        ),
                    )

            class Thread:
                id = "thread_fake"

                def turn(self, *args, **kwargs):
                    return Turn()

            class Codex:
                def __init__(self, config):
                    self.config = config

                def __enter__(self):
                    return self

                def __exit__(self, exc_type, exc, tb):
                    return False

                def thread_start(self, **kwargs):
                    return Thread()
            """
        )
    )


class CliContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            probe = subprocess.run(
                [str(LAUNCHER), "--help"], capture_output=True, text=True, env=base_env(), timeout=180
            )
        except OSError as exc:
            raise unittest.SkipTest(f"launcher not runnable: {exc}")
        if probe.returncode != 0:
            raise unittest.SkipTest(f"launcher unavailable: {probe.stderr.strip()}")

    def test_help_surfaces(self):
        run_cli("--help")
        for group in ("doctor", "init", "status", "case", "sessions", "eval", "docs", "validate", "package"):
            run_cli(group, "--help")
        self.assertIn("--check", run_cli("docs", "emit-cli", "--help").stdout)
        self.assertIn("--run", run_cli("eval", "verify-run", "--help").stdout)
        run_cli("benchmark", "--help", expect=(2,))
        run_cli("workbench", "--help", expect=(2,))
        eval_run_help = run_cli("eval", "run", "--help").stdout
        for flag in ("--no-grade", "--case", "--type", "--candidates", "--split", "--preset", "--check"):
            self.assertIn(flag, eval_run_help)
        self.assertNotIn("--runner", eval_run_help)
        self.assertIn("--preset", run_cli("eval", "list", "--help").stdout)
        self.assertIn("--preset", run_cli("eval", "report", "--help").stdout)
        run_cli("eval", "lint", "--help", expect=(2,))
        run_cli("eval", "materialize", "--help", expect=(2,))
        self.assertNotIn("--mode", run_cli("sessions", "extract", "--help").stdout)
        human_help = run_cli("eval", "human", "--help").stdout
        self.assertIn("--reviewer", human_help)

    def test_doctor_json_contract(self):
        data, _ = run_json("doctor", "--json", expect=(0, 1))
        names = [check["name"] for check in data["checks"]]
        self.assertEqual(
            names,
            ["python_version", "cli_source", "validators_canonical", "openai_codex_sdk", "codex_app_server_sdk"],
        )
        self.assertIsInstance(data["ok"], bool)

    def test_init_creates_named_workbench_and_evals(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "proj"
            write_skill(project)
            data, _ = run_json("init", str(project), "--json")
            self.assertTrue(data["ok"])
            self.assertTrue((project / ".demo" / "AGENTS.md").is_file())
            evals_path = project / ".demo" / "evals.json"
            self.assertTrue(evals_path.is_file())
            evals = json.loads(evals_path.read_text())
            self.assertEqual(evals["skill_name"], "demo")
            self.assertEqual(evals["cases"], [])

    def test_status_json_shape_on_scaffolded_project(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "proj"
            write_skill(project)
            run_cli("init", str(project), "--json")
            data, _ = run_json("status", str(project), "--json")
            self.assertTrue(data["ok"])
            self.assertTrue(data["workbench"]["exists"])
            self.assertTrue(data["suite"]["exists"])
            self.assertEqual(data["suite"]["case_count"], 0)
            self.assertEqual(data["runs"]["count"], 0)

    def test_case_new_creates_task_and_snippet(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "proj"
            write_skill(project)
            run_cli("init", str(project), "--json")
            suite = project / ".demo" / "evals.json"
            data, _ = run_json("case", "new", "demo-case", "--suite", str(suite), "--json")
            self.assertTrue(data["ok"])
            self.assertTrue((project / ".demo" / "cases" / "demo-case" / "task.md").is_file())
            self.assertFalse(data["manifest_updated"])
            self.assertEqual(data["manifest_snippet"]["id"], "demo-case")

    def test_validate_json_contract(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            write_skill(skill)
            data, _ = run_json("validate", str(skill), "--json")
            self.assertTrue(data["ok"])
            self.assertEqual([task["task"] for task in data["tasks"]], ["validate_skill", "lint_authoring"])
            self.assertIsInstance(data["validation_percent"], int)
            missing = Path(tmp) / "missing"
            missing.mkdir()
            data, proc = run_json("validate", str(missing), "--json", expect=(2,))
            self.assertFalse(data["ok"])

    def test_package_excludes_workbench_and_caches(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            write_skill(skill)
            (skill / "reference.md").write_text("runtime\n")
            (skill / ".demo" / "cases").mkdir(parents=True)
            (skill / ".demo" / "cases" / "private.txt").write_text("hidden\n")
            (skill / "__pycache__").mkdir()
            (skill / "__pycache__" / "x.pyc").write_text("x")
            data, _ = run_json("package", str(skill), "--json")
            self.assertTrue(data["ok"])
            names = zipfile.ZipFile(data["artifact"]).namelist()
            self.assertIn("SKILL.md", names)
            self.assertIn("reference.md", names)
            self.assertFalse([name for name in names if ".demo" in name or "__pycache__" in name])

    def test_eval_run_check_lints_without_running(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "proj"
            write_skill(project)
            suite = write_suite(
                project,
                [
                    {
                        "id": "answer",
                        "type": "capability",
                        "task": {"prompt": "Say final text."},
                        "expectations": ["Contains final text."],
                    }
                ],
            )
            data, _ = run_json("eval", "run", "--suite", str(suite), "--check", "--json")
            self.assertTrue(data["ok"])
            self.assertEqual(data["lint_warnings"]["suite"]["stats"]["tasks"], 1)

    def test_eval_run_with_fake_sdk_writes_trial_artifacts(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "proj"
            write_skill(project)
            suite = write_suite(
                project,
                [{"id": "answer", "type": "capability", "task": {"prompt": "Say final text."}}],
            )
            fake_root = Path(tmp) / "fake-sdk"
            write_fake_sdk(fake_root)
            env = base_env({"PYTHONPATH": str(fake_root)})
            data, _ = run_json("eval", "run", "--suite", str(suite), "--no-grade", "--json", env=env)
            self.assertTrue(data["ok"])
            run_dir = Path(data["run_dir"])
            trial_dir = run_dir / "trials" / "answer.current.t1"
            self.assertEqual((trial_dir / "response.md").read_text(), "final text")
            self.assertTrue((trial_dir / "events.jsonl").is_file())
            self.assertTrue((trial_dir / "evidence.json").is_file())
            self.assertTrue((run_dir / "run.json").is_file())
            self.assertTrue((run_dir / "summary.json").is_file())
            self.assertTrue((run_dir / "inputs" / "suite.json").is_file())
            self.assertTrue((run_dir / "inputs" / "candidates" / "current" / "SKILL.md").is_file())
            self.assertTrue((run_dir / "report.md").is_file())
            self.assertEqual(data["report_path"], str(run_dir / "report.md"))
            summary = json.loads((run_dir / "summary.json").read_text())
            self.assertEqual(summary["final_verdict_totals"], {"ungraded": 1})
            progress, _ = run_json("eval", "progress", "--run", str(run_dir), "--json", env=env)
            self.assertEqual(progress["trials"], 1)
            listing, _ = run_json("eval", "list", "--suite", str(suite), "--json", env=env)
            self.assertEqual(len(listing["runs"]), 1)

    def test_eval_run_auto_grades_with_code_validator(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "proj"
            write_skill(project)
            suite = write_suite(
                project,
                [
                    {
                        "id": "code-check",
                        "type": "regression",
                        "task": {"prompt": "Say final text."},
                        "graders": [{"kind": "code", "id": "contains", "path": "validate.py"}],
                    }
                ],
            )
            case_dir = project / ".demo" / "cases" / "code-check"
            case_dir.mkdir(parents=True)
            (case_dir / "validate.py").write_text(
                textwrap.dedent(
                    """\
                    import argparse, json

                    parser = argparse.ArgumentParser()
                    parser.add_argument("--output", required=True)
                    parser.add_argument("--events")
                    parser.add_argument("--expected")
                    parser.add_argument("--json", action="store_true")
                    args = parser.parse_args()
                    text = open(args.output).read()
                    passed = 1 if "final text" in text else 0
                    print(json.dumps({
                        "passed": passed,
                        "total": 1,
                        "checks": [{"name": "contains-final-text", "label": "pass" if passed else "fail"}],
                    }))
                    """
                )
            )
            fake_root = Path(tmp) / "fake-sdk"
            write_fake_sdk(fake_root)
            env = base_env({"PYTHONPATH": str(fake_root)})
            data, _ = run_json("eval", "run", "--suite", str(suite), "--json", env=env)
            self.assertTrue(data["ok"])
            run_dir = Path(data["run_dir"])
            grades = [
                json.loads(line)
                for line in (run_dir / "grades.jsonl").read_text().splitlines()
                if line.strip()
            ]
            self.assertEqual(len(grades), 1)
            self.assertEqual(grades[0]["grader"]["kind"], "code")
            self.assertEqual(grades[0]["grade_status"], "pass")
            self.assertEqual(grades[0]["score"], 1.0)
            summary = json.loads((run_dir / "summary.json").read_text())
            self.assertEqual(summary["final_verdict_totals"], {"passed": 1})


if __name__ == "__main__":
    unittest.main()
