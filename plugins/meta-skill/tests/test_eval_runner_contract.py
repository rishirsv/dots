"""End-to-end runner-neutral evaluation lifecycle contracts."""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.runner import finalize_eval, prepare_eval, retry_trial, run_eval, submit_trial, unresolved_trials
from meta_skill.workbench_paths import worktrees_path


def skill(path):
    path.mkdir(parents=True, exist_ok=True)
    (path / "SKILL.md").write_text('---\nname: demo\ndescription: "Use when testing runs; not for production."\n---\n\n# Demo\n')


def suite(path, evals):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"schema_version": 2, "skill_name": "demo", "target": {"type": "skill", "ref": "SKILL.md"}, "evals": evals}))


def args(path, **values):
    defaults = dict(
        suite=str(path), candidates=None, split=None, case=None, type=None,
        repetitions=None, repetitions_by_type={}, model=None, reasoning_effort=None,
        parallel=1, timeout=5, no_baseline=False, no_grade=True, adhoc=False,
        task=None, skill=None, resume_run_id=None,
    )
    defaults.update(values)
    return SimpleNamespace(**defaults)


def write_result(packet, *, status="completed", response="done", artifact=True, executor=None):
    artifact_paths = []
    if artifact:
        target = Path(packet["artifact_root"]) / "made.txt"
        target.write_text(packet["trial_id"])
        artifact_paths.append("made.txt")
    result = {
        "trial_id": packet["trial_id"],
        "attempt_id": packet["attempt_id"],
        "status": status,
        "response": response,
        "artifacts": artifact_paths,
        "duration_ms": 2,
        "error": None if status == "completed" else status,
        "executor": executor or {
            "kind": "native_subagent", "requested_model": None,
            "requested_reasoning": None, "observed_model": None,
            "runtime_version": None, "provenance": "inherited",
        },
    }
    Path(packet["result_path"]).write_text(json.dumps(result))
    return result


class RunnerTests(unittest.TestCase):
    def test_planning_error_records_canonical_executor_provenance(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            with patch("meta_skill.runner.resolve_candidate", side_effect=RuntimeError("cannot snapshot")):
                with self.assertRaisesRegex(RuntimeError, "cannot snapshot"):
                    prepare_eval(
                        args(manifest, no_baseline=True),
                        run_id_value="run-plan-error",
                    )
            run = json.loads(
                (target / ".demo" / "runs" / "run-plan-error" / "run.json").read_text()
            )
            self.assertEqual(run["planning_error"], "cannot snapshot")
            self.assertEqual(run["task_executor"]["kind"], "native_subagent")
            self.assertEqual(run["task_executor"]["provenance"], "inherited")
            self.assertIsNone(run["judge_executor"])

    def test_prepare_hides_judging_data_and_submit_preserves_run_contract(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{
                "id": "a", "type": "capability", "prompt": "Do A",
                "expected_output": "Hidden answer", "expectations": ["Hidden rubric"],
            }])
            prepared = prepare_eval(args(manifest), task_executor_kind="native_subagent")
            self.assertEqual(prepared["trials"], 2)
            packets = prepared["packets"]
            baseline = next(packet for packet in packets if ".no-skill." in packet["trial_id"])
            current = next(packet for packet in packets if ".current." in packet["trial_id"])
            self.assertNotIn("skill_path", baseline)
            self.assertTrue((Path(current["skill_path"]) / "SKILL.md").is_file())
            for packet in packets:
                serialized = json.dumps(packet)
                self.assertNotIn("Hidden answer", serialized)
                self.assertNotIn("Hidden rubric", serialized)
                self.assertNotIn("/runs/", packet["workspace_path"])
                write_result(packet, response="[made](artifacts/made.txt)")
                state = submit_trial(
                    prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"]
                )
                self.assertEqual(state["status"], "completed")
                self.assertNotIn("workspace_path", state)
                self.assertEqual(state["task_executor"]["provenance"], "inherited")
                repeated = submit_trial(
                    prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"]
                )
                self.assertEqual(repeated["result_digest"], state["result_digest"])
            result = finalize_eval(prepared["run_dir"], grade=False)
            run = Path(result["run_dir"])
            self.assertTrue((run / "demo-evaluation.md").is_file())
            self.assertTrue((run / "trials" / current["trial_id"] / "artifacts" / "made.txt").is_file())
            self.assertFalse((target / ".demo" / "tmp" / result["run_id"]).exists())
            self.assertFalse((worktrees_path(target) / result["run_id"]).exists())
            model = json.loads((run / "run.json").read_text())
            self.assertEqual(model["model"], "gpt-5.6-terra")
            self.assertEqual(model["reasoning_effort"], "medium")
            self.assertEqual(model["task_executor"]["provenance"], "inherited")
            self.assertIsNone(model["task_executor"]["requested_model"])

    def test_submit_rejects_stale_attempt_escape_and_changed_terminal_result(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            prepared = prepare_eval(args(manifest, no_baseline=True))
            packet = prepared["packets"][0]
            write_result(packet)
            result_path = Path(packet["result_path"])
            forged = json.loads(result_path.read_text())
            forged["executor"] = {
                "kind": "codex_exec", "requested_model": "forged",
                "requested_reasoning": "xhigh", "observed_model": "forged",
                "runtime_version": "forged", "provenance": "observed",
            }
            result_path.write_text(json.dumps(forged))
            with self.assertRaisesRegex(CliError, "attempt"):
                submit_trial(prepared["run_dir"], packet["trial_id"], "stale", packet["result_path"])
            outside = project / "outside.json"
            outside.write_text("{}")
            with self.assertRaisesRegex(CliError, "workspace"):
                submit_trial(prepared["run_dir"], packet["trial_id"], packet["attempt_id"], outside)
            state = submit_trial(prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"])
            self.assertEqual(state["task_executor"]["kind"], "native_subagent")
            self.assertIsNone(state["task_executor"]["requested_model"])
            write_result(packet, response="changed")
            with self.assertRaisesRegex(CliError, "different terminal"):
                submit_trial(prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"])

    def test_finalize_rejects_unresolved_trials(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            prepared = prepare_eval(args(manifest, no_baseline=True))
            with self.assertRaisesRegex(CliError, "unresolved trials"):
                finalize_eval(prepared["run_dir"], grade=False)
            unresolved = unresolved_trials(prepared["run_dir"])
            self.assertEqual(unresolved["unresolved"][0]["packet"]["trial_id"], "a.current.t1")
            state_path = Path(prepared["run_dir"]) / "trials" / "a.current.t1" / "state.json"
            workspace = Path(prepared["packets"][0]["workspace_path"])
            (workspace / "response.md").write_text("partial")
            (workspace / "events.jsonl").write_text("partial")
            (workspace / "artifacts" / "partial.txt").write_text("partial")
            old_attempt = prepared["packets"][0]["attempt_id"]
            retried = retry_trial(prepared["run_dir"], "a.current.t1")
            self.assertNotEqual(retried["packet"]["attempt_id"], old_attempt)
            self.assertEqual(json.loads(state_path.read_text())["status"], "queued")
            self.assertFalse((workspace / "response.md").exists())
            self.assertFalse((workspace / "events.jsonl").exists())
            self.assertEqual(list((workspace / "artifacts").iterdir()), [])

    def test_unattended_codex_exec_uses_same_submit_lifecycle_and_timeout_state(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Wait"}])

            def fake_task(packet, **_kwargs):
                return write_result(
                    packet,
                    status="timed_out",
                    response="",
                    artifact=False,
                    executor={
                        "kind": "codex_exec", "requested_model": "gpt-5.6-terra",
                        "requested_reasoning": "medium", "observed_model": None,
                        "runtime_version": "codex fake", "provenance": "requested",
                    },
                )

            with patch("meta_skill.runner.codex_readiness", return_value=(True, "ready", {})), patch(
                "meta_skill.runner.run_task", side_effect=fake_task
            ):
                result = run_eval(args(manifest, no_baseline=True))
            state = json.loads((Path(result["run_dir"]) / "trials" / "a.current.t1" / "state.json").read_text())
            self.assertEqual(state["status"], "timed_out")
            self.assertEqual(state["task_executor"]["kind"], "codex_exec")
            self.assertFalse(result["ok"])

    def test_resume_reuses_only_exact_completed_trials(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [
                {"id": "a", "type": "capability", "prompt": "Do A"},
                {"id": "b", "type": "capability", "prompt": "Do B"},
            ])
            first = prepare_eval(args(manifest, no_baseline=True), task_executor_kind="codex_exec")
            for packet in first["packets"]:
                write_result(packet)
                submit_trial(first["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"])
            failed_path = Path(first["run_dir"]) / "trials" / "b.current.t1" / "state.json"
            failed = json.loads(failed_path.read_text())
            failed["status"] = "failed"
            failed_path.write_text(json.dumps(failed))
            resumed = prepare_eval(
                args(manifest, no_baseline=True, resume_run_id=first["run_id"]),
                task_executor_kind="codex_exec",
            )
            self.assertEqual(resumed["reused_trials"], 1)
            self.assertEqual([packet["trial_id"] for packet in resumed["packets"]], ["b.current.t1"])
            reused = json.loads((Path(resumed["run_dir"]) / "trials" / "a.current.t1" / "state.json").read_text())
            self.assertEqual(reused["reused_from"]["run_id"], first["run_id"])

            native = prepare_eval(args(manifest, no_baseline=True))
            for packet in native["packets"]:
                write_result(packet)
                submit_trial(native["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"])
            native_resumed = prepare_eval(args(manifest, no_baseline=True, resume_run_id=native["run_id"]))
            self.assertEqual(native_resumed["reused_trials"], 0)
            self.assertEqual(len(native_resumed["packets"]), 2)


if __name__ == "__main__":
    unittest.main()
