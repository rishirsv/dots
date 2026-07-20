"""End-to-end runner-neutral evaluation lifecycle contracts."""

import json
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.codex_exec import _command
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
        approve_trial_count=None,
        parallel=None, timeout=5, no_baseline=False, no_grade=True, adhoc=False,
        task=None, skill=None, resume_run_id=None,
    )
    defaults.update(values)
    return SimpleNamespace(**defaults)


def write_result(
    packet, *, status="completed", response="done", artifact=True, executor=None, events=None
):
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
    if events is not None:
        events_path = Path(packet["workspace_path"]) / "events.jsonl"
        events_path.write_text("".join(json.dumps(event) + "\n" for event in events))
        result["events_path"] = str(events_path)
    Path(packet["result_path"]).write_text(json.dumps(result))
    return result


class RunnerTests(unittest.TestCase):
    def test_codex_exec_ignores_user_config_and_rules_for_controlled_inventory(self):
        command = _command("codex", Path("/tmp/work"), "model", "medium", Path("/tmp/out"))
        self.assertIn("--ignore-user-config", command)
        self.assertIn("--ignore-rules", command)
        disabled = [command[index + 1] for index, value in enumerate(command[:-1]) if value == "--disable"]
        self.assertEqual(disabled, ["plugins", "apps", "memories"])

    def test_parallelism_defaults_to_four_and_one_is_explicit(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [
                {"id": f"case-{index}", "type": "capability", "prompt": f"Do {index}"}
                for index in range(5)
            ])
            automatic = prepare_eval(
                args(manifest, no_baseline=True), task_executor_kind="codex_exec"
            )
            automatic_run = json.loads(
                (Path(automatic["run_dir"]) / "run.json").read_text()
            )
            self.assertEqual(automatic["dispatch_parallelism"], 4)
            self.assertEqual(automatic_run["runner"]["parallel_mode"], "auto")

            sequential = prepare_eval(
                args(manifest, no_baseline=True, parallel=1),
                task_executor_kind="codex_exec",
            )
            sequential_run = json.loads(
                (Path(sequential["run_dir"]) / "run.json").read_text()
            )
            self.assertEqual(sequential["dispatch_parallelism"], 1)
            self.assertEqual(sequential_run["runner"]["parallel_mode"], "explicit")

    def test_unattended_run_uses_parallel_default(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [
                {"id": f"case-{index}", "type": "capability", "prompt": f"Do {index}"}
                for index in range(5)
            ])
            lock = threading.Lock()
            active = 0
            peak = 0

            def fake_task(packet, **_kwargs):
                nonlocal active, peak
                with lock:
                    active += 1
                    peak = max(peak, active)
                try:
                    time.sleep(0.05)
                    return write_result(packet)
                finally:
                    with lock:
                        active -= 1

            with patch("meta_skill.runner.codex_readiness", return_value=(True, "ready", {})), patch(
                "meta_skill.runner.run_task", side_effect=fake_task
            ):
                result = run_eval(args(manifest, no_baseline=True))

            self.assertTrue(result["ok"])
            self.assertGreater(peak, 1)
            self.assertLessEqual(peak, 4)

    def test_native_candidate_comparison_is_rejected_as_unisolated(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            with self.assertRaisesRegex(CliError, "cannot guarantee isolated"):
                prepare_eval(args(manifest), task_executor_kind="native_subagent")

    def test_benchmark_requires_one_split_and_keeps_source_context_out_of_holdout(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            cases = [
                {
                    "id": f"case-{index}",
                    "prompt": f"Do {index}",
                    "coverage": ["core" if index % 2 == 0 else "boundary"],
                    "split": "development" if index < 20 else "test",
                    "repetitions": 1,
                    "graders": [{"kind": "human", "id": "review", "metric": "correctness"}],
                }
                for index in range(40)
            ]
            manifest.parent.mkdir(parents=True)
            manifest.write_text(json.dumps({
                "schema_version": 2,
                "evaluation_mode": "benchmark",
                "validity_review": {
                    "status": "pass",
                    "notes": "Cases are solvable, graders match the claim, the harness is isolated, and no material shortcuts are known.",
                },
                "coverage_requirements": ["core", "boundary"],
                "benchmark": {
                    "name": "Example",
                    "source": "local",
                    "version": "v1",
                    "held_out_split": "test",
                    "contamination_controls": "Test prompts are hidden until final evaluation.",
                    "freshness": "The local snapshot was reviewed for relevance in July 2026.",
                },
                "evals": cases,
            }))
            with self.assertRaisesRegex(CliError, "select exactly one"):
                prepare_eval(args(manifest), task_executor_kind="codex_exec")
            prepared = prepare_eval(
                args(manifest, split="test"), task_executor_kind="codex_exec"
            )
            run = json.loads((Path(prepared["run_dir"]) / "run.json").read_text())
            self.assertEqual(run["benchmark_split"], "test")
            self.assertTrue(all(count == 1 for count in run["repetitions"].values()))

    def test_repeated_run_requires_exact_user_approved_trial_count(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            with self.assertRaisesRegex(CliError, "expand this evaluation to 4 trials"):
                prepare_eval(args(manifest, repetitions=2), task_executor_kind="codex_exec")
            with self.assertRaisesRegex(CliError, "--approve-trial-count 4"):
                prepare_eval(
                    args(manifest, repetitions=2, approve_trial_count=6),
                    task_executor_kind="codex_exec",
                )
            self.assertFalse((target / ".demo" / "runs").exists())
            prepared = prepare_eval(
                args(manifest, repetitions=2, approve_trial_count=4),
                task_executor_kind="codex_exec",
            )
            run = json.loads((Path(prepared["run_dir"]) / "run.json").read_text())
            self.assertEqual(run["approved_trial_count"], 4)
            self.assertEqual(len(run["trials"]), 4)

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
            lifecycle = json.loads(
                (target / ".demo" / "runs" / "run-plan-error" / "state.json").read_text()
            )
            self.assertEqual(lifecycle["status"], "failed")
            self.assertEqual(lifecycle["phase"], "stopped")
            self.assertEqual(lifecycle["stop_phase"], "planning")

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
            prepared = prepare_eval(args(manifest, no_grade=True), task_executor_kind="codex_exec")
            self.assertEqual(prepared["trials"], 2)
            packets = prepared["packets"]
            lifecycle = json.loads((Path(prepared["run_dir"]) / "state.json").read_text())
            self.assertEqual(lifecycle["status"], "planned")
            self.assertEqual(lifecycle["planned_trials"], 2)
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
                self.assertEqual(state["task_executor"]["provenance"], "requested")
                self.assertTrue(state["task_executor"]["isolation"]["supports_baseline_effect"])
                repeated = submit_trial(
                    prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"]
                )
                self.assertEqual(repeated["result_digest"], state["result_digest"])
            result = finalize_eval(prepared["run_dir"], grade=False)
            self.assertTrue(result["ok"])
            self.assertTrue(result["execution_ok"])
            self.assertFalse(result["evaluation_passed"])
            self.assertFalse(result["regression_gate_enabled"])
            run = Path(result["run_dir"])
            self.assertTrue((run / "demo-evaluation.md").is_file())
            lifecycle = json.loads((run / "state.json").read_text())
            self.assertEqual(lifecycle["status"], "completed")
            self.assertEqual(lifecycle["phase"], "finished")
            self.assertEqual(lifecycle["terminal_trials"], 2)
            self.assertIn('**Status:** `completed`', (run / "demo-evaluation.md").read_text())
            self.assertTrue((run / "trials" / current["trial_id"] / "artifacts" / "made.txt").is_file())
            self.assertFalse((target / ".demo" / "tmp" / result["run_id"]).exists())
            self.assertFalse((worktrees_path(target) / result["run_id"]).exists())
            model = json.loads((run / "run.json").read_text())
            self.assertEqual(model["model"], "gpt-5.6-terra")
            self.assertEqual(model["reasoning_effort"], "medium")
            self.assertEqual(model["task_executor"]["provenance"], "requested")
            self.assertEqual(model["task_executor"]["requested_model"], "gpt-5.6-terra")

    def test_regression_gate_can_fail_without_reclassifying_execution(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            prepared = prepare_eval(
                args(manifest, no_baseline=True, no_grade=True, gate=True),
                task_executor_kind="codex_exec",
            )
            packet = prepared["packets"][0]
            write_result(packet)
            submit_trial(
                prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"]
            )
            result = finalize_eval(prepared["run_dir"], grade=False)
            self.assertFalse(result["ok"])
            self.assertTrue(result["execution_ok"])
            self.assertFalse(result["evaluation_passed"])
            self.assertTrue(result["regression_gate_enabled"])
            self.assertFalse(result["regression_gate_passed"])

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

    def test_interrupt_cancels_unresolved_trials_and_stops_workers(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Wait"}])
            with patch("meta_skill.runner.codex_readiness", return_value=(True, "ready", {})), patch(
                "meta_skill.runner.run_task", side_effect=KeyboardInterrupt
            ), patch("meta_skill.runner.terminate_active_processes") as terminate:
                with self.assertRaises(KeyboardInterrupt):
                    run_eval(args(manifest, no_baseline=True), run_id_value="run-interrupt")
            run = target / ".demo" / "runs" / "run-interrupt"
            lifecycle = json.loads((run / "state.json").read_text())
            trial = json.loads((run / "trials" / "a.current.t1" / "state.json").read_text())
            self.assertEqual(lifecycle["status"], "cancelled")
            self.assertEqual(lifecycle["phase"], "stopped")
            self.assertEqual(lifecycle["stop_phase"], "executing")
            self.assertEqual(trial["status"], "cancelled")
            self.assertFalse((target / ".demo" / "tmp" / "run-interrupt").exists())
            self.assertTrue(terminate.called)

    def test_interrupt_during_grading_records_cancelled_lifecycle(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            prepared = prepare_eval(args(manifest, no_baseline=True, no_grade=True))
            packet = prepared["packets"][0]
            write_result(packet)
            submit_trial(
                prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"]
            )
            with patch("meta_skill.grading.grade_run", side_effect=KeyboardInterrupt), patch(
                "meta_skill.runner.terminate_active_processes"
            ) as terminate:
                with self.assertRaises(KeyboardInterrupt):
                    finalize_eval(prepared["run_dir"], grade=True)
            lifecycle = json.loads((Path(prepared["run_dir"]) / "state.json").read_text())
            self.assertEqual(lifecycle["status"], "cancelled")
            self.assertEqual(lifecycle["phase"], "stopped")
            self.assertEqual(lifecycle["stop_phase"], "grading")
            self.assertTrue(terminate.called)

    def test_submit_derives_duration_when_worker_does_not_report_it(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            prepared = prepare_eval(args(manifest, no_baseline=True, no_grade=True))
            packet = prepared["packets"][0]
            result = write_result(packet)
            result["duration_ms"] = 0
            Path(packet["result_path"]).write_text(json.dumps(result))
            state_path = Path(prepared["run_dir"]) / "trials" / packet["trial_id"] / "state.json"
            state = json.loads(state_path.read_text())
            state["prepared_at"] = "2026-01-01T00:00:00+00:00"
            state_path.write_text(json.dumps(state))
            submitted = submit_trial(
                prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"]
            )
            self.assertGreater(submitted["duration_ms"], 0)
            self.assertEqual(submitted["duration_source"], "prepared_to_submit")

    def test_stateful_trials_capture_hidden_before_and_after_evidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            case_root = manifest.parent / "cases" / "a"
            case_root.mkdir(parents=True)
            (case_root / "capture.py").write_text(
                "import argparse, json\n"
                "p=argparse.ArgumentParser(); p.add_argument('--workspace'); p.add_argument('--output'); p.add_argument('--phase'); p.add_argument('--json', action='store_true')\n"
                "a=p.parse_args(); value=open(a.workspace + '/fixtures/state.txt').read(); open(a.output, 'w').write(json.dumps({'phase':a.phase,'value':value}))\n"
            )
            (case_root / "validate.py").write_text("raise SystemExit(1)\n")
            for name in ("oracle", "negative"):
                fixture = case_root / "grader-tests" / name
                fixture.mkdir(parents=True)
                (fixture / "response.md").write_text(name)
                (fixture / "before-state.json").write_text("{}")
                (fixture / "after-state.json").write_text("{}")
            (case_root / "state.txt").write_text("before")
            suite(manifest, [{
                "id": "a",
                "type": "capability",
                "outcome": "stateful",
                "prompt": "Change the state",
                "fixtures": ["state.txt"],
                "state_capture": "capture.py",
                "graders": [{
                    "kind": "code",
                    "id": "state",
                    "metric": "state",
                    "path": "validate.py",
                    "uses_state": True,
                }],
                "grader_tests": [
                    {"id": "oracle", "grader": "state", "expected": "pass", "path": "grader-tests/oracle"},
                    {"id": "negative", "grader": "state", "expected": "fail", "path": "grader-tests/negative"},
                ],
            }])
            prepared = prepare_eval(args(manifest, no_baseline=True, no_grade=True))
            packet = prepared["packets"][0]
            before = json.loads((Path(prepared["run_dir"]) / "trials" / packet["trial_id"] / "before-state.json").read_text())
            self.assertEqual(before, {"phase": "before", "value": "before"})
            with self.assertRaisesRegex(CliError, "stateful trials"):
                retry_trial(prepared["run_dir"], packet["trial_id"])
            (Path(packet["fixture_root"]) / "state.txt").write_text("after")
            write_result(packet)
            state = submit_trial(
                prepared["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"]
            )
            after = json.loads((Path(prepared["run_dir"]) / "trials" / packet["trial_id"] / "after-state.json").read_text())
            self.assertEqual(after, {"phase": "after", "value": "after"})
            self.assertEqual(set(state["state_evidence"]), {"before", "after"})

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
                write_result(packet, events=[{"type": "turn.completed"}])
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

    def test_resume_rejects_incomplete_artifact_and_event_evidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            target = project / "skill"
            skill(target)
            manifest = target / ".demo" / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "outcome": "artifact", "prompt": "Do A"}])
            first = prepare_eval(args(manifest, no_baseline=True), task_executor_kind="codex_exec")
            packet = first["packets"][0]
            write_result(packet)
            submit_trial(first["run_dir"], packet["trial_id"], packet["attempt_id"], packet["result_path"])

            trial = Path(first["run_dir"]) / "trials" / packet["trial_id"]
            state_path = trial / "state.json"
            state = json.loads(state_path.read_text())
            state["produced_artifacts"] = []
            state_path.write_text(json.dumps(state))
            (trial / "events.jsonl").write_text('{"type":"turn.started"}\n')

            resumed = prepare_eval(
                args(manifest, no_baseline=True, resume_run_id=first["run_id"]),
                task_executor_kind="codex_exec",
            )
            self.assertEqual(resumed["reused_trials"], 0)
            self.assertEqual([item["trial_id"] for item in resumed["packets"]], ["a.current.t1"])


if __name__ == "__main__":
    unittest.main()
