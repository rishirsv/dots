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

    def test_init_suite_is_opt_in_and_status_uses_new_shape(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            code, plain = self.json_main(["init", str(target), "--json"])
            self.assertEqual(code, 0)
            self.assertIsNone(plain["evals"])
            self.assertFalse((target / "evals" / "evals.json").exists())
            code, with_evals = self.json_main(["init", str(target), "--evals", "--json"])
            self.assertTrue(Path(with_evals["evals"]).is_file())
            code, status = self.json_main(["status", str(target), "--json"])
            self.assertTrue(status["suite"]["exists"])
            self.assertEqual(status["suite"]["eval_count"], 0)

    def test_eval_check_accepts_schema_v2(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            suite = target / "evals" / "evals.json"
            suite.parent.mkdir()
            suite.write_text(json.dumps({"schema_version": 2, "evals": [{"id": "a", "type": "capability", "prompt": "A", "expected_output": "A"}]}))
            code, result = self.json_main(["eval", "run", "--suite", str(suite), "--check", "--json"])
            self.assertEqual(code, 0)
            self.assertEqual(result["lint"]["shape"], "evals-v2")

    def test_professional_eval_vocabulary_is_exposed_without_branded_aliases(self):
        app = (ROOT / "plugins" / "meta-skill" / "src" / "meta_skill" / "workbench_server" / "app.html").read_text()
        for term in ("Cases", "Runs", "Skill versions", "Rerun selected", "Feedback"):
            self.assertIn(term, app)
        for term in ("Explore", "Substantiate", "Improve", "Benchmark mode"):
            self.assertNotIn(term, app)
        args = build_parser().parse_args([
            "eval", "run", "--objective", "Compare revisions", "--baseline", "current",
            "--human-review-sample", "2", "--source-run-id", "run-1",
        ])
        self.assertEqual(args.baseline, "current")
        self.assertEqual(args.human_review_sample, 2)

    def test_doctor_reports_binary_and_auth_checks(self):
        args = build_parser().parse_args(["doctor", "--json"])
        output = io.StringIO()
        with patch("meta_skill.cli.shutil.which", return_value=None), patch("meta_skill.cli.app_server_readiness", return_value=(True, "ready", {})), contextlib.redirect_stdout(output):
            command_doctor(args)
        names = [row["name"] for row in json.loads(output.getvalue())["checks"]]
        self.assertIn("codex_binary", names)
        self.assertIn("codex_auth", names)
        self.assertIn("codex_default_model", names)


if __name__ == "__main__":
    unittest.main()
