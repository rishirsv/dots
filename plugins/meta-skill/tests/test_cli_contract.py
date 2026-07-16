"""Public CLI contract tests."""

import contextlib
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.cli import build_parser, command_doctor, main


def skill(path):
    path.mkdir(parents=True)
    (path / "SKILL.md").write_text('---\nname: demo\ndescription: "Use when testing CLI behavior; not for production."\n---\n\n# Demo\n')


class CliTests(unittest.TestCase):
    def json_main(self, arguments):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = main(arguments)
        return code, json.loads(output.getvalue())

    def test_command_surface_is_compact_and_removed_commands_are_absent(self):
        parser = build_parser()
        self.assertEqual(parser.parse_args(["workbench", "open", "--no-open"]).open, False)
        self.assertEqual(parser.parse_args(["eval", "record", "--run", "r", "--trial", "t", "--label", "pass", "--rationale", "ok"]).eval_command, "record")
        text = parser.format_help()
        for kept in ("doctor", "init", "status", "sessions", "eval", "workbench", "validate", "package"):
            self.assertIn(kept, text)
        for removed in ("calibrate", "preset", "verify-run", "case", "docs"):
            self.assertNotIn(removed, text)
        for command in ("prepare", "submit", "finalize", "unresolved", "retry"):
            parsed = parser.parse_args(["eval", command, "--run", "r"] if command in {"finalize", "unresolved"} else (
                ["eval", command, "--run", "r", "--trial", "t"] if command == "retry" else
                ["eval", "submit", "--run", "r", "--trial", "t", "--attempt", "a", "--result", "result.json"] if command == "submit" else
                ["eval", "prepare"]
            ))
            self.assertEqual(parsed.eval_command, command)

    def test_init_suite_is_opt_in_and_status_uses_new_shape(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            code, plain = self.json_main(["init", str(target), "--json"])
            self.assertEqual(code, 0)
            self.assertIsNone(plain["evals"])
            self.assertFalse((target / ".demo" / "evals" / "evals.json").exists())
            code, with_evals = self.json_main(["init", str(target), "--evals", "--json"])
            self.assertTrue(Path(with_evals["evals"]).is_file())
            code, status = self.json_main(["status", str(target), "--json"])
            self.assertTrue(status["suite"]["exists"])
            self.assertEqual(status["suite"]["eval_count"], 0)

    def test_eval_check_accepts_schema_v2(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            suite = target / ".demo" / "evals" / "evals.json"
            suite.parent.mkdir(parents=True)
            suite.write_text(json.dumps({
                "schema_version": 2,
                "evals": [{
                    "id": "a",
                    "type": "capability",
                    "prompt": "A",
                    "expected_output": "A",
                    "graders": [{"kind": "human", "id": "human-review", "metric": "correctness"}],
                }],
            }))
            code, result = self.json_main(["eval", "run", "--suite", str(suite), "--check", "--json"])
            self.assertEqual(code, 0)
            self.assertEqual(result["lint"]["shape"], "evals-v2")

    def test_eval_rejects_nonpositive_execution_settings(self):
        parser = build_parser()
        for flag in ("--repetitions", "--parallel", "--timeout"):
            with self.subTest(flag=flag), self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
                parser.parse_args(["eval", "run", flag, "0"])

    def test_eval_check_rejects_expectations_only_as_advisory(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            suite = target / ".demo" / "evals" / "evals.json"
            suite.parent.mkdir(parents=True)
            suite.write_text(json.dumps({
                "schema_version": 2,
                "evals": [{"id": "a", "prompt": "A", "expectations": ["A is correct"]}],
            }))
            code, result = self.json_main(["eval", "run", "--suite", str(suite), "--check", "--json"])
            self.assertEqual(code, 1)
            self.assertIn("implicit_advisory_model", {row["kind"] for row in result["lint"]["warnings"]})

    def test_professional_eval_vocabulary_is_exposed_without_branded_aliases(self):
        app = (ROOT / "plugins" / "meta-skill" / "src" / "meta_skill" / "workbench_server" / "app.html").read_text()
        for term in (
            "Cases", "Runs", "Versions", "Feedback", "Produced files",
            "Open local file", "Feedback about", "Judge results",
        ):
            self.assertIn(term, app)
        for term in ("Explore", "Substantiate", "Improve", "Rerun selected"):
            self.assertNotIn(term, app)
        args = build_parser().parse_args([
            "eval", "run", "--objective", "Compare revisions", "--baseline", "current",
            "--human-review-sample", "2", "--source-run-id", "run-1",
            "--model", "gpt-5.6-terra", "--reasoning-effort", "medium",
        ])
        self.assertEqual(args.baseline, "current")
        self.assertEqual(args.human_review_sample, 2)
        self.assertEqual(args.model, "gpt-5.6-terra")
        self.assertEqual(args.reasoning_effort, "medium")

    def test_doctor_reports_binary_and_auth_checks(self):
        args = build_parser().parse_args(["doctor", "--json"])
        output = io.StringIO()
        with patch("meta_skill.cli.shutil.which", return_value=None), contextlib.redirect_stdout(output):
            command_doctor(args)
        names = [row["name"] for row in json.loads(output.getvalue())["checks"]]
        self.assertIn("codex_binary", names)
        self.assertIn("codex_auth", names)
        self.assertIn("codex_cli", names)


if __name__ == "__main__":
    unittest.main()
