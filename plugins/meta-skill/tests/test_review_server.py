"""Tests for the calibration review workbench server."""

import http.client
import json
import sys
import tempfile
import threading
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.io import read_jsonl  # noqa: E402
from meta_skill.review.queue import build_queue  # noqa: E402
from meta_skill.review.server import create_server  # noqa: E402
from meta_skill.summary import build_summary  # noqa: E402

RUN_ID = "run-001"
CANDIDATE = "current"


def _write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def _write_jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows))


def _trial_id(case_id):
    return f"{case_id}.{CANDIDATE}.t1"


def _model_grade(case_id, status, score=None, checks=None):
    return {
        "run_id": RUN_ID,
        "case_id": case_id,
        "candidate": CANDIDATE,
        "trial_id": _trial_id(case_id),
        "grade_generation_id": "grade-g1",
        "grader": {"kind": "model", "id": "expectations"},
        "grade_status": status,
        "metric": "expectations",
        "score": score,
        "rationale": f"judge rationale for {case_id}",
        "checks": checks or [],
        "timestamp": "2026-01-01T00:00:00Z",
    }


CASES = ["case-fail", "case-unknown", "case-disagree", "case-suspect", "case-pass"]


def _build_workbench(tmp_path):
    root = tmp_path / ".demo"
    run_dir = root / "runs" / RUN_ID
    trials = []
    results = []
    for case_id in CASES:
        tid = _trial_id(case_id)
        case_dir = run_dir / "inputs" / "cases" / case_id
        case_dir.mkdir(parents=True)
        (case_dir / "task.md").write_text(f"# Task {case_id}\n\nDo the thing.\n")
        _write_json(case_dir / "expectations.json", [f"The response completes {case_id}."])
        trial_dir = run_dir / "trials" / tid
        trial_dir.mkdir(parents=True)
        (trial_dir / "response.md").write_text(f"# Result\n\nOutput for {case_id}.\n\n```\ncode block\n```\n")
        _write_jsonl(
            trial_dir / "events.jsonl",
            [
                {"method": "item/completed", "payload": {"item": {"type": "command", "text": "ls -la"}}},
                {"method": "item/completed", "payload": {"item": {"type": "agent_message", "text": f"Output for {case_id}."}}},
            ],
        )
        trials.append({"trial_id": tid, "case_id": case_id, "candidate": CANDIDATE, "repetition": 1})
        results.append(
            {
                "trial_id": tid,
                "case_id": case_id,
                "candidate": CANDIDATE,
                "repetition": 1,
                "runtime_status": "completed",
                "response_path": str(trial_dir / "response.md"),
                "events_path": str(trial_dir / "events.jsonl"),
            }
        )
    (run_dir / "inputs" / "cases" / "case-fail" / "judge.md").write_text("Grade strictly.\n")
    _write_json(
        run_dir / "run.json",
        {
            "run_id": RUN_ID,
            "created_at": "2026-01-01T00:00:00Z",
            "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
            "model_config": {},
            "trials": trials,
        },
    )
    _write_jsonl(run_dir / "results.jsonl", results)
    grades = [
        _model_grade("case-fail", "fail", score=0.1),
        _model_grade("case-unknown", "unknown"),
        _model_grade("case-disagree", "pass", score=0.9),
        _model_grade("case-suspect", "pass", score=0.5),
        _model_grade("case-pass", "pass", score=0.95),
        {
            "run_id": RUN_ID,
            "case_id": "case-disagree",
            "candidate": CANDIDATE,
            "trial_id": _trial_id("case-disagree"),
            "grade_generation_id": "grade-h1",
            "grader": {"kind": "human", "id": "human-review"},
            "grade_status": "fail",
            "metric": "expectations",
            "score": None,
            "rationale": "Reviewed: the output misses the required step.",
            "checks": [],
            "timestamp": "2026-01-02T00:00:00Z",
        },
    ]
    _write_jsonl(run_dir / "grades.jsonl", grades)
    build_summary(str(run_dir))
    return root


def _request(port, method, path, body=None):
    conn = http.client.HTTPConnection("127.0.0.1", port, timeout=10)
    headers = {}
    payload = None
    if body is not None:
        payload = json.dumps(body)
        headers["Content-Type"] = "application/json"
    conn.request(method, path, body=payload, headers=headers)
    response = conn.getresponse()
    raw = response.read()
    conn.close()
    return response.status, raw


def _request_json(port, method, path, body=None):
    status, raw = _request(port, method, path, body)
    return status, json.loads(raw)


class ReviewServerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.workbench = _build_workbench(Path(self.tmp.name))
        self.server = create_server(self.workbench, run=RUN_ID, port=0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.port = self.server.server_address[1]

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=5)
        self.tmp.cleanup()

    # -- queue builder ------------------------------------------------------

    def test_queue_tiers_and_order(self):
        entries = build_queue(self.workbench / "runs" / RUN_ID)
        by_case = {entry["case_id"]: entry for entry in entries}
        self.assertEqual(by_case["case-fail"]["tier"], 1)
        self.assertEqual(by_case["case-unknown"]["tier"], 2)
        self.assertEqual(by_case["case-disagree"]["tier"], 3)
        self.assertEqual(by_case["case-suspect"]["tier"], 4)
        self.assertEqual(by_case["case-pass"]["tier"], 5)
        self.assertEqual([entry["case_id"] for entry in entries], ["case-fail", "case-unknown", "case-disagree", "case-suspect", "case-pass"])
        self.assertTrue(by_case["case-disagree"]["human_graded"])
        self.assertFalse(by_case["case-pass"]["human_graded"])
        self.assertEqual(by_case["case-fail"]["verdict"], "failed")
        self.assertTrue(all({"trial_id", "case_id", "candidate", "verdict", "grades", "tier", "human_graded"} <= set(entry) for entry in entries))

    # -- HTTP surface -------------------------------------------------------

    def test_serves_app_shell(self):
        status, raw = _request(self.port, "GET", "/")
        html = raw.decode("utf-8")
        self.assertEqual(status, 200)
        self.assertIn('id="queue"', html)
        self.assertIn('id="evidence"', html)
        self.assertIn('id="grading"', html)
        self.assertIn("Calibration review", html)

    def test_lists_runs(self):
        status, data = _request_json(self.port, "GET", "/api/runs")
        self.assertEqual(status, 200)
        self.assertEqual(data["default_run"], RUN_ID)
        (run,) = data["runs"]
        self.assertEqual(run["run_id"], RUN_ID)
        self.assertEqual(run["planned_trials"], 5)
        self.assertEqual(run["results"], 5)
        self.assertTrue(run["has_summary"])

    def test_queue_endpoint_tiers(self):
        status, data = _request_json(self.port, "GET", f"/api/runs/{RUN_ID}/queue")
        self.assertEqual(status, 200)
        self.assertEqual([entry["tier"] for entry in data["queue"]], [1, 2, 3, 4, 5])

    def test_trial_packet_separates_judge_grade(self):
        tid = _trial_id("case-disagree")
        status, data = _request_json(self.port, "GET", f"/api/trials/{tid}?run={RUN_ID}")
        self.assertEqual(status, 200)
        self.assertTrue(data["task"].startswith("# Task case-disagree"))
        self.assertIn("Output for case-disagree", data["response"])
        self.assertEqual(data["transcript"]["total"], 2)
        self.assertTrue(data["judge_guidance"]["hidden_from_agent"])
        self.assertEqual(data["judge_guidance"]["expectations"], ["The response completes case-disagree."])
        # Judge grades live only under the hidden "judge" key.
        self.assertTrue(all((row.get("grader") or {}).get("kind") != "model" for row in data["grades"]))
        self.assertEqual([row["grader"]["kind"] for row in data["judge"]["grades"]], ["model"])
        self.assertTrue(data["human_recorded"])

    def test_post_grade_roundtrip(self):
        tid = _trial_id("case-unknown")
        body = {
            "run": RUN_ID,
            "trial_id": tid,
            "grader_id": "human-review",
            "metric": "expectations",
            "label": "pass",
            "score": 0.8,
            "rationale": "Verified the output manually.",
            "reviewer": "rishi",
        }
        status, data = _request_json(self.port, "POST", "/api/grades", body)
        self.assertEqual(status, 200)
        self.assertEqual(data["grade"]["grader"], {"kind": "human", "id": "human-review"})
        self.assertEqual(data["grade"]["grade_status"], "pass")
        rows = read_jsonl(self.workbench / "runs" / RUN_ID / "grades.jsonl")
        written = [row for row in rows if row["trial_id"] == tid and row["grader"]["kind"] == "human"]
        self.assertEqual(len(written), 1)
        self.assertEqual(written[0]["rationale"], "Verified the output manually.")
        self.assertEqual(written[0]["reviewer"], "rishi")

    def test_post_grade_rejects_bad_label(self):
        body = {"run": RUN_ID, "trial_id": _trial_id("case-pass"), "grader_id": "human-review", "metric": "expectations", "label": "great", "rationale": "x"}
        status, data = _request_json(self.port, "POST", "/api/grades", body)
        self.assertEqual(status, 400)
        self.assertIn("label", data["error"])

    def test_post_annotation_appends_row(self):
        tid = _trial_id("case-pass")
        body = {
            "run": RUN_ID,
            "trial_id": tid,
            "artifact": "response",
            "span": {"start": 3, "end": 9, "quote": "Output"},
            "note": "Good phrasing to require everywhere.",
            "tag": "taste-rule",
        }
        status, data = _request_json(self.port, "POST", "/api/annotations", body)
        self.assertEqual(status, 200)
        self.assertEqual(data["annotation"]["tag"], "taste-rule")
        rows = read_jsonl(self.workbench / "runs" / RUN_ID / "annotations.jsonl")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["trial_id"], tid)
        self.assertEqual(rows[0]["span"]["quote"], "Output")
        self.assertTrue(rows[0]["timestamp"])

    def test_post_annotation_rejects_bad_tag(self):
        body = {
            "run": RUN_ID,
            "trial_id": _trial_id("case-pass"),
            "artifact": "response",
            "span": {"start": 0, "end": 1, "quote": "O"},
            "note": "x",
            "tag": "vibes",
        }
        status, data = _request_json(self.port, "POST", "/api/annotations", body)
        self.assertEqual(status, 400)
        self.assertIn("tag", data["error"])

    def test_trial_traversal_rejected(self):
        status, data = _request_json(self.port, "GET", f"/api/trials/..%2F..%2Frun.json?run={RUN_ID}")
        self.assertEqual(status, 400)
        status, _ = _request(self.port, "GET", f"/api/trials/../../run.json?run={RUN_ID}")
        self.assertIn(status, {400, 404})
        status, data = _request_json(self.port, "GET", "/api/runs/..%2F..%2Fetc/queue")
        self.assertEqual(status, 400)

    def test_calibration_endpoint(self):
        status, data = _request_json(self.port, "GET", f"/api/calibration?run={RUN_ID}&metric=expectations")
        self.assertEqual(status, 200)
        self.assertEqual(data["summary"]["paired"], 1)
        self.assertTrue(data["summary"]["trust_band"].startswith("insufficient"))


if __name__ == "__main__":
    unittest.main()
