"""Tests for the calibration review workbench server."""

import http.client
import json
import sys
import threading
from pathlib import Path

import pytest

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


@pytest.fixture()
def workbench(tmp_path):
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


@pytest.fixture()
def server(workbench):
    srv = create_server(workbench, run=RUN_ID, port=0)
    thread = threading.Thread(target=srv.serve_forever, daemon=True)
    thread.start()
    yield srv.server_address[1]
    srv.shutdown()
    srv.server_close()
    thread.join(timeout=5)


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


# -- queue builder ----------------------------------------------------------


def test_queue_tiers_and_order(workbench):
    entries = build_queue(workbench / "runs" / RUN_ID)
    by_case = {entry["case_id"]: entry for entry in entries}
    assert by_case["case-fail"]["tier"] == 1
    assert by_case["case-unknown"]["tier"] == 2
    assert by_case["case-disagree"]["tier"] == 3
    assert by_case["case-suspect"]["tier"] == 4
    assert by_case["case-pass"]["tier"] == 5
    assert [entry["case_id"] for entry in entries] == ["case-fail", "case-unknown", "case-disagree", "case-suspect", "case-pass"]
    assert by_case["case-disagree"]["human_graded"] is True
    assert by_case["case-pass"]["human_graded"] is False
    assert by_case["case-fail"]["verdict"] == "failed"
    assert all({"trial_id", "case_id", "candidate", "verdict", "grades", "tier", "human_graded"} <= set(entry) for entry in entries)


# -- HTTP surface -----------------------------------------------------------


def test_serves_app_shell(server):
    status, raw = _request(server, "GET", "/")
    html = raw.decode("utf-8")
    assert status == 200
    assert 'id="queue"' in html
    assert 'id="evidence"' in html
    assert 'id="grading"' in html
    assert "Calibration review" in html


def test_lists_runs(server):
    status, data = _request_json(server, "GET", "/api/runs")
    assert status == 200
    assert data["default_run"] == RUN_ID
    (run,) = data["runs"]
    assert run["run_id"] == RUN_ID
    assert run["planned_trials"] == 5
    assert run["results"] == 5
    assert run["has_summary"] is True


def test_queue_endpoint_tiers(server):
    status, data = _request_json(server, "GET", f"/api/runs/{RUN_ID}/queue")
    assert status == 200
    assert [entry["tier"] for entry in data["queue"]] == [1, 2, 3, 4, 5]


def test_trial_packet_separates_judge_grade(server):
    tid = _trial_id("case-disagree")
    status, data = _request_json(server, "GET", f"/api/trials/{tid}?run={RUN_ID}")
    assert status == 200
    assert data["task"].startswith("# Task case-disagree")
    assert "Output for case-disagree" in data["response"]
    assert data["transcript"]["total"] == 2
    assert data["judge_guidance"]["hidden_from_agent"] is True
    assert data["judge_guidance"]["expectations"] == ["The response completes case-disagree."]
    # Judge grades live only under the hidden "judge" key.
    assert all((row.get("grader") or {}).get("kind") != "model" for row in data["grades"])
    assert [row["grader"]["kind"] for row in data["judge"]["grades"]] == ["model"]
    assert data["human_recorded"] is True


def test_post_grade_roundtrip(server, workbench):
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
    status, data = _request_json(server, "POST", "/api/grades", body)
    assert status == 200
    assert data["grade"]["grader"] == {"kind": "human", "id": "human-review"}
    assert data["grade"]["grade_status"] == "pass"
    rows = read_jsonl(workbench / "runs" / RUN_ID / "grades.jsonl")
    written = [row for row in rows if row["trial_id"] == tid and row["grader"]["kind"] == "human"]
    assert len(written) == 1
    assert written[0]["rationale"] == "Verified the output manually."
    assert written[0]["reviewer"] == "rishi"


def test_post_grade_rejects_bad_label(server):
    body = {"run": RUN_ID, "trial_id": _trial_id("case-pass"), "grader_id": "human-review", "metric": "expectations", "label": "great", "rationale": "x"}
    status, data = _request_json(server, "POST", "/api/grades", body)
    assert status == 400
    assert "label" in data["error"]


def test_post_annotation_appends_row(server, workbench):
    tid = _trial_id("case-pass")
    body = {
        "run": RUN_ID,
        "trial_id": tid,
        "artifact": "response",
        "span": {"start": 3, "end": 9, "quote": "Output"},
        "note": "Good phrasing to require everywhere.",
        "tag": "taste-rule",
    }
    status, data = _request_json(server, "POST", "/api/annotations", body)
    assert status == 200
    assert data["annotation"]["tag"] == "taste-rule"
    rows = read_jsonl(workbench / "runs" / RUN_ID / "annotations.jsonl")
    assert len(rows) == 1
    assert rows[0]["trial_id"] == tid
    assert rows[0]["span"]["quote"] == "Output"
    assert rows[0]["timestamp"]


def test_post_annotation_rejects_bad_tag(server):
    body = {
        "run": RUN_ID,
        "trial_id": _trial_id("case-pass"),
        "artifact": "response",
        "span": {"start": 0, "end": 1, "quote": "O"},
        "note": "x",
        "tag": "vibes",
    }
    status, data = _request_json(server, "POST", "/api/annotations", body)
    assert status == 400
    assert "tag" in data["error"]


def test_trial_traversal_rejected(server):
    status, data = _request_json(server, "GET", f"/api/trials/..%2F..%2Frun.json?run={RUN_ID}")
    assert status == 400
    status, _ = _request(server, "GET", f"/api/trials/../../run.json?run={RUN_ID}")
    assert status in {400, 404}
    status, data = _request_json(server, "GET", "/api/runs/..%2F..%2Fetc/queue")
    assert status == 400


def test_calibration_endpoint(server):
    status, data = _request_json(server, "GET", f"/api/calibration?run={RUN_ID}&metric=expectations")
    assert status == 200
    assert data["summary"]["paired"] == 1
    assert data["summary"]["trust_band"].startswith("insufficient")
