"""Repository workbench API tests."""

import hashlib
import http.client
import json
import re
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path
from urllib.parse import urlparse
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.workbench_server.server import APP_PATH, STATIC_ROOT, build_case_packet, build_trial_packet, create_server, discover_skills
from meta_skill.report import build_report


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


def fixture(root):
    skill = root / "skill"
    skill.mkdir()
    (skill / "SKILL.md").write_text('---\nname: demo\ndescription: "Use when testing the workbench; not for production."\n---\n\n# Demo\n')
    workbench = skill / "evals" / "a"
    eval_row = {"id": "a", "type": "capability", "prompt": "Do A", "expectations": ["Good"], "graders": [{"kind": "model", "id": "judge", "metric": "quality", "path": "judge.md", "advisory": True}, {"kind": "human", "id": "taste", "metric": "quality"}]}
    (workbench / "task.md").parent.mkdir(parents=True)
    (workbench / "task.md").write_text("Do A\n")
    write(workbench / "criteria.json", {"context": "Demo behavior", "type": "weighted_checklist", "checklist": [{"name": "good", "description": "Good", "max_score": 1, "category": "INTENT"}]})
    write(workbench / "scenario.json", {"type": "capability"})
    run = skill / ".demo" / "runs" / "run-1"
    write(run / "run.json", {
        "schema_version": 2,
        "run_id": "run-1",
        "runner": {"grading": True},
        "task_executor": {"kind": "native_subagent", "provenance": "inherited"},
        "judge_executor": {"kind": "codex_exec", "provenance": "requested"},
        "candidates": [{"candidate": "current", "source_kind": "current_worktree"}],
        "trials": [{"trial_id": "a.current.t1", "eval_id": "a", "candidate": "current", "repetition": 1}],
    })
    frozen = {**eval_row, "prompt": {"path": "task.md"}, "expected_output": None}
    write(run / "inputs" / "suite.json", {"schema_version": 2, "evals": [frozen]})
    case = run / "inputs" / "scenarios" / "a"
    case.mkdir(parents=True)
    (case / "task.md").write_text("Do A")
    trial = run / "trials" / "a.current.t1"
    trial.mkdir(parents=True)
    write(trial / "state.json", {"trial_id": "a.current.t1", "eval_id": "a", "candidate": "current", "repetition": 1, "status": "completed"})
    (trial / "response.md").write_text("A response")
    (trial / "events.jsonl").write_text('{"method":"item/completed","payload":{"text":"used tool"}}\n')
    (trial / "grades.jsonl").write_text(json.dumps({
        "trial_id": "a.current.t1",
        "metric": "quality",
        "grader": {"kind": "model", "id": "judge"},
        "grade_status": "fail",
        "score": 0,
        "rationale": "model says fail",
        "checks": [{"name": "quality", "label": "fail", "evidence": "model-only evidence"}],
    }) + "\n")
    return skill, run


class WorkbenchServerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.skill, self.run = fixture(self.root)
        self.server = create_server(self.root, 0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.tmp.cleanup()

    def request(self, method, path, body=None, headers=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_address[1])
        payload = json.dumps(body).encode() if body is not None else None
        request_headers = dict(headers or {})
        if payload:
            request_headers.setdefault("Content-Type", "application/json")
        connection.request(method, path, payload, request_headers)
        response = connection.getresponse()
        response_body = response.read()
        data = json.loads(response_body) if response.getheader("Content-Type", "").startswith("application/json") else None
        connection.close()
        return response.status, data

    def test_skill_run_overview_and_queue_discovery(self):
        status, skills = self.request("GET", "/api/skills")
        self.assertEqual(status, 200)
        self.assertEqual(skills["skills"][0]["name"], "demo")
        self.assertEqual(skills["skills"][0]["run_count"], 1)
        status, runs = self.request("GET", "/api/skills/skill/runs")
        self.assertEqual(runs["runs"][0]["run_id"], "run-1")
        self.assertEqual(runs["runs"][0]["totals"]["failed"], 0)
        self.assertEqual(runs["runs"][0]["totals"]["inconclusive"], 1)
        self.assertEqual(build_report(str(self.run))["trials"][0]["verdict"], "failed")
        status, overview = self.request("GET", "/api/runs/run-1?skill=skill")
        self.assertEqual(overview["trials"][0]["verdict"], "inconclusive")
        self.assertEqual(overview["trials"][0]["failed_checks"], [])
        self.assertFalse(any((row.get("grader") or {}).get("kind") == "model" for row in overview["trials"][0]["grades"]))
        status, queue = self.request("GET", "/api/runs/run-1/queue?skill=skill")
        self.assertEqual(queue["queue"][0]["trial_id"], "a.current.t1")
        self.assertEqual(queue["queue"][0]["verdict"], "inconclusive")
        self.assertEqual(queue["queue"][0]["tier"], 2)
        self.assertFalse(any((row.get("grader") or {}).get("kind") == "model" for row in queue["queue"][0]["grades"]))
        status, suite = self.request("GET", "/api/skills/skill/suite")
        self.assertEqual(status, 200)
        self.assertEqual(suite["cases"][0]["id"], "a")
        self.assertEqual(suite["data_boundary"]["surface"], "review_only")
        self.assertFalse(suite["data_boundary"]["external_model_boundary"])
        self.assertIn(".demo", suite["data_boundary"]["storage_root"])

    def test_blind_packet_grade_revision_and_reveal(self):
        path = "/api/trials/a.current.t1?skill=skill&run=run-1"
        status, packet = self.request("GET", path)
        self.assertEqual(packet["human_grader"]["id"], "taste")
        self.assertTrue(packet["review_blind_pending"])
        self.assertEqual(packet["trial"]["verdict"], "hidden")
        self.assertEqual(packet["trial"]["failed_checks"], [])
        self.assertFalse(any((row.get("grader") or {}).get("kind") == "model" for row in packet["grades"]))
        status, error = self.request("GET", "/api/trials/a.current.t1/judge?skill=skill&run=run-1")
        self.assertEqual(status, 400)
        body = {"skill": "skill", "run": "run-1", "trial_id": "a.current.t1", "label": "fail", "rationale": "Human evidence"}
        self.assertEqual(self.request("POST", "/api/grades", body)[0], 200)
        body["label"], body["rationale"] = "pass", "Revised evidence"
        self.assertEqual(self.request("POST", "/api/grades", body)[0], 200)
        status, still_blind = self.request("GET", path)
        self.assertEqual(status, 200)
        self.assertEqual(still_blind["trial"]["verdict"], "passed")
        self.assertEqual(still_blind["trial"]["failed_checks"], [])
        self.assertFalse(
            any(
                (row.get("grader") or {}).get("kind") == "model"
                for row in still_blind["grades"]
            )
        )
        status, reveal = self.request("GET", "/api/trials/a.current.t1/judge?skill=skill&run=run-1")
        self.assertEqual(status, 200)
        self.assertEqual(reveal["grades"][0]["rationale"], "model says fail")
        self.assertEqual(reveal["disagreements"][0]["human"], "pass")
        status, overview = self.request("GET", "/api/runs/run-1?skill=skill")
        self.assertEqual(overview["trials"][0]["verdict"], "failed")
        self.assertEqual(overview["trials"][0]["failed_checks"][0]["evidence"], "model-only evidence")

    def test_annotation_is_trial_local_excluded_by_default_and_execution_is_not_an_api(self):
        body = {"skill": "skill", "run": "run-1", "trial_id": "a.current.t1", "note": "Ambiguous wording", "tag": "routing-failure"}
        self.assertEqual(self.request("POST", "/api/annotations", body)[0], 200)
        review = json.loads((self.run / "trials" / "a.current.t1" / "review.json").read_text())
        self.assertEqual(review["annotations"][0]["note"], "Ambiguous wording")
        self.assertEqual(review["annotations"][0]["artifact"], "response")
        self.assertEqual(review["annotations"][0]["tag"], "routing-failure")
        self.assertEqual(review["annotations"][0]["judge_use"], "exclude")
        self.assertTrue(review["annotations"][0]["annotation_id"].startswith("annotation-"))
        status, result = self.request("POST", "/api/runs", {"skill": "skill"})
        self.assertEqual(status, 404)
        self.assertEqual(result["error"], "not found")

    def test_case_view_groups_versions_with_outputs_criteria_and_feedback(self):
        body = {"skill": "skill", "run": "run-1", "trial_id": "a.current.t1", "note": "Make this clearer"}
        self.assertEqual(self.request("POST", "/api/annotations", body)[0], 200)
        packet = build_case_packet(self.run, "a")
        self.assertEqual(packet["eval_id"], "a")
        self.assertEqual(packet["expectations"], ["Good"])
        self.assertEqual(packet["trials"][0]["response"], "A response")
        self.assertEqual(packet["trials"][0]["annotations"][0]["note"], "Make this clearer")
        status, response = self.request("GET", "/api/runs/run-1/cases/a?skill=skill")
        self.assertEqual(status, 200)
        self.assertEqual(response["trials"][0]["candidate_display"], "current")

    def test_artifacts_are_listed_served_safely_and_eval_promotion_requires_approval(self):
        artifact = self.run / "trials" / "a.current.t1" / "artifacts" / "result.txt"
        artifact.parent.mkdir()
        artifact.write_text("artifact result")
        packet = build_trial_packet(self.run, "a.current.t1")
        self.assertEqual(packet["artifacts"][0]["path"], "result.txt")
        self.assertEqual(packet["artifacts"][0]["preview_kind"], "text")
        self.assertEqual(packet["artifacts"][0]["preview"], "artifact result")
        self.assertNotIn("local_path", packet["artifacts"][0])
        body = {
            "skill": "skill",
            "run": "run-1",
            "trial_id": "a.current.t1",
            "artifact": "artifact",
            "artifact_path": "result.txt",
            "note": "The saved file needs another section",
            "judge_use": "evidence",
        }
        status, result = self.request("POST", "/api/annotations", body)
        self.assertEqual(status, 200)
        self.assertEqual(result["annotation"]["artifact_path"], "result.txt")
        self.assertEqual(result["annotation"]["judge_use"], "evidence")
        body["artifact_path"] = "missing.txt"
        self.assertEqual(self.request("POST", "/api/annotations", body)[0], 400)
        body["artifact_path"] = "result.txt"
        body["judge_use"] = "automatic"
        self.assertEqual(self.request("POST", "/api/annotations", body)[0], 400)
        status, _ = self.request(
            "GET", "/api/artifacts/a.current.t1/result.txt?skill=skill&run=run-1"
        )
        self.assertEqual(status, 200)
        status, error = self.request(
            "GET", "/api/artifacts/a.current.t1/../state.json?skill=skill&run=run-1"
        )
        self.assertIn(status, {400, 404})

        body = {
            "skill": "skill",
            "run": "run-1",
            "trial_id": "a.current.t1",
            "id": "promoted-a",
            "type": "regression",
            "priority": "high",
            "expectations": ["Preserve the accepted behavior"],
        }
        self.assertEqual(self.request("POST", "/api/evals", body)[0], 400)
        body["approved"] = True
        self.assertEqual(self.request("POST", "/api/evals", body)[0], 201)
        self.assertTrue((self.skill / "evals" / "promoted-a" / "criteria.json").is_file())

    def test_large_and_active_artifacts_are_download_only(self):
        root = self.run / "trials" / "a.current.t1" / "artifacts"
        root.mkdir()
        (root / "large.txt").write_text("x" * 60001)
        (root / "active.html").write_text("<script>alert('no')</script>")
        packet = build_trial_packet(self.run, "a.current.t1")
        by_name = {row["path"]: row for row in packet["artifacts"]}
        self.assertIsNone(by_name["large.txt"]["preview_kind"])
        self.assertNotIn("preview", by_name["large.txt"])
        self.assertEqual(by_name["active.html"]["preview_kind"], "text")

        connection = http.client.HTTPConnection(
            "127.0.0.1", self.server.server_address[1]
        )
        connection.request(
            "GET",
            "/api/artifacts/a.current.t1/active.html?skill=skill&run=run-1",
        )
        response = connection.getresponse()
        self.assertEqual(response.status, 200)
        self.assertTrue(response.getheader("Content-Disposition").startswith("attachment;"))
        response.read()
        connection.close()

        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_address[1])
        connection.request(
            "GET",
            "/api/interactive/a.current.t1/active.html?skill=skill&run=run-1",
        )
        response = connection.getresponse()
        self.assertEqual(response.status, 302)
        location = urlparse(response.getheader("Location"))
        response.read()
        connection.close()
        self.assertNotEqual(location.port, self.server.server_address[1])
        interactive = http.client.HTTPConnection(location.hostname, location.port)
        interactive.request("GET", location.path)
        response = interactive.getresponse()
        self.assertEqual(response.status, 200)
        self.assertIn("connect-src 'none'", response.getheader("Content-Security-Policy"))
        self.assertIn(b"alert('no')", response.read())
        interactive.close()

    def test_harness_preview_is_distinct_and_existing_cache_is_discoverable(self):
        trial = self.run / "trials" / "a.current.t1"
        artifacts = trial / "artifacts"
        artifacts.mkdir()
        (artifacts / "active.html").write_text("<script>alert('never execute')</script>")
        previews = trial / "previews"
        previews.mkdir()
        (previews / "preview-001.png").write_bytes(b"\x89PNG\r\n\x1a\n")
        (previews / "preview-002.png").write_bytes(b"\x89PNG\r\n\x1a\n")
        write(previews / "index.json", {
            "schema_version": 3,
            "entries": {"active.html": {
                "generated_by": "harness",
                "frames": [
                    {"file": "preview-001.png", "index": 1, "label": "Opening", "width": 1440, "height": 900},
                    {"file": "preview-002.png", "index": 2, "label": "Detail", "width": 1440, "height": 900},
                ],
                "source_sha256": hashlib.sha256((artifacts / "active.html").read_bytes()).hexdigest(),
                "environment": {"node": "v24.0.0", "browser": "Chrome/140.0.0.0"},
            }},
        })
        status, packet = self.request("GET", "/api/trials/a.current.t1?skill=skill&run=run-1")
        self.assertEqual(status, 200)
        artifact = packet["artifacts"][0]
        self.assertEqual(artifact["preview_kind"], "text")
        self.assertEqual(len(artifact["rendered_previews"]), 2)
        self.assertEqual(artifact["rendered_previews"][0]["generated_by"], "harness")
        self.assertEqual(artifact["rendered_previews"][0]["label"], "Opening")
        preview_url = artifact["rendered_previews"][1]["url"]
        self.assertEqual(self.request("GET", preview_url)[0], 200)

    def test_run_listing_does_not_build_full_reports(self):
        with patch("meta_skill.report.build_report", side_effect=AssertionError("full report")):
            status, runs = self.request("GET", "/api/skills/skill/runs")
        self.assertEqual(status, 200)
        self.assertEqual(runs["runs"][0]["run_id"], "run-1")

    def test_workbench_ui_keeps_the_review_loop_and_compiled_boundary(self):
        html = APP_PATH.read_text()
        source_root = ROOT / "plugins" / "meta-skill" / "workbench-ui" / "src"
        source = (source_root / "App.tsx").read_text() + (source_root / "styles.css").read_text()
        self.assertRegex(html, r'<script type="module" crossorigin src="/assets/[^"/]+\.js"></script>')
        self.assertRegex(html, r'<link rel="stylesheet" crossorigin href="/assets/[^"/]+\.css">')
        for contract in (
            "syncUrl", "routing-failure", "model-variance", "Add regression case",
            "Needs attention", "Feedback about", "artifactUrl", "review note only",
            "reusable guidance", "Task executor", "Judge executor",
            "Blind human grade required", "Reveal model judge", "Looks good",
            "Needs review", "one execution",
            "Runtime:", "duration unknown", "tokens unknown",
            "Promote finding to regression case", "max-height: 320px",
            "View escaped source", "Compare rendered previews", "Could not load this view",
        ):
            self.assertIn(contract, source)
        for removed in ("Run cases", "Start run", "launchRun", "rerunSelected"):
            self.assertNotIn(removed, source)
        self.assertNotIn("<iframe", source)
        self.assertNotIn("file://", source)

        asset = re.search(r'src="(/assets/[^"]+\.js)"', html).group(1)
        status, _ = self.request("GET", asset)
        self.assertEqual(status, 200)
        self.assertTrue(any(path.suffix == ".js" for path in (STATIC_ROOT / "assets").iterdir()))
        self.assertEqual(self.request("GET", "/assets/../server.py")[0], 404)
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_address[1])
        connection.request("GET", "/")
        response = connection.getresponse()
        self.assertIn("object-src 'none'", response.getheader("Content-Security-Policy"))
        response.read()
        connection.close()

    def test_root_skill_uses_a_path_safe_id_and_opens_directly(self):
        server = create_server(self.skill, 0)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            connection = http.client.HTTPConnection("127.0.0.1", server.server_address[1])
            connection.request("GET", "/api/skills")
            response = connection.getresponse()
            skills = json.loads(response.read())
            self.assertEqual(response.status, 200)
            self.assertEqual(skills["skills"][0]["id"], "_root")
            connection.request("GET", "/api/skills/_root/runs")
            response = connection.getresponse()
            runs = json.loads(response.read())
            self.assertEqual(response.status, 200)
            self.assertEqual(runs["runs"][0]["run_id"], "run-1")
            connection.close()
        finally:
            server.shutdown()
            server.server_close()
            thread.join()

    def test_review_decision_is_explicit_and_findings_are_authoritative(self):
        body = {
            "skill": "skill",
            "run": "run-1",
            "trial_id": "a.current.t1",
            "decision": "looks_good",
        }
        status, result = self.request("POST", "/api/reviews", body)
        self.assertEqual(status, 200)
        self.assertEqual(result["review"]["decision"], "looks_good")
        self.assertIn("reviewed_at", result["review"])

        review_path = self.run / "trials" / "a.current.t1" / "review.json"
        review_path.unlink()
        body["decision"] = "finding"
        self.assertEqual(self.request("POST", "/api/reviews", body)[0], 400)
        annotation = {**body, "note": "Evidence-backed defect"}
        annotation.pop("decision")
        self.assertEqual(self.request("POST", "/api/annotations", annotation)[0], 200)
        review = json.loads(review_path.read_text())
        self.assertEqual(review["decision"], "finding")
        body["decision"] = "looks_good"
        self.assertEqual(self.request("POST", "/api/reviews", body)[0], 400)

    def test_concurrent_regression_promotions_do_not_overwrite_each_other(self):
        from meta_skill.workbench_server import server as server_module

        original_load = server_module.load_manifest

        def slow_load(path):
            result = original_load(path)
            if Path(path).name == "evals.json":
                time.sleep(0.03)
            return result

        results = []

        def promote(index):
            results.append(
                self.request(
                    "POST",
                    "/api/evals",
                    {
                        "skill": "skill",
                        "run": "run-1",
                        "trial_id": "a.current.t1",
                        "id": f"concurrent-{index}",
                        "type": "regression",
                        "expectations": [f"Preserve behavior {index}"],
                        "approved": True,
                    },
                )[0]
            )

        with patch("meta_skill.workbench_server.server.load_manifest", side_effect=slow_load):
            workers = [threading.Thread(target=promote, args=(index,)) for index in range(4)]
            for worker in workers:
                worker.start()
            for worker in workers:
                worker.join()

        self.assertEqual(results, [201] * 4)
        ids = {path.name for path in (self.skill / "evals").iterdir() if path.is_dir()}
        self.assertTrue({f"concurrent-{index}" for index in range(4)}.issubset(ids))

    def test_model_grade_is_hidden_until_inspector_review_is_recorded(self):
        suite_path = self.run / "inputs" / "suite.json"
        suite = json.loads(suite_path.read_text())
        suite["evals"][0]["graders"] = [{"kind": "model", "id": "judge", "metric": "quality"}]
        write(suite_path, suite)
        packet = build_trial_packet(self.run, "a.current.t1")
        self.assertIsNone(packet["human_grader"])
        self.assertTrue(packet["review_blind_pending"])
        self.assertEqual(packet["trial"]["verdict"], "hidden")
        self.assertEqual(packet["grades"], [])
        write(
            self.run / "trials" / "a.current.t1" / "review.json",
            {"decision": "looks_good"},
        )
        packet = build_trial_packet(self.run, "a.current.t1")
        self.assertFalse(packet["review_blind_pending"])
        self.assertEqual(packet["grades"][0]["grader"]["kind"], "model")

    def test_multiple_human_graders_keep_model_hidden_until_all_are_recorded(self):
        suite_path = self.run / "inputs" / "suite.json"
        suite = json.loads(suite_path.read_text())
        suite["evals"][0]["graders"].append(
            {"kind": "human", "id": "second", "metric": "second"}
        )
        write(suite_path, suite)
        body = {
            "skill": "skill",
            "run": "run-1",
            "trial_id": "a.current.t1",
            "label": "pass",
            "rationale": "First independent review",
        }
        self.assertEqual(self.request("POST", "/api/grades", body)[0], 200)
        self.assertEqual(
            self.request("GET", "/api/trials/a.current.t1/judge?skill=skill&run=run-1")[0],
            400,
        )
        status, overview = self.request("GET", "/api/runs/run-1?skill=skill")
        self.assertEqual(status, 200)
        self.assertEqual(overview["trials"][0]["failed_checks"], [])
        self.assertFalse(
            any(
                (row.get("grader") or {}).get("kind") == "model"
                for row in overview["trials"][0]["grades"]
            )
        )

        body["rationale"] = "Second independent review"
        self.assertEqual(self.request("POST", "/api/grades", body)[0], 200)
        self.assertEqual(
            self.request("GET", "/api/trials/a.current.t1/judge?skill=skill&run=run-1")[0],
            200,
        )

    def test_execution_endpoints_are_not_exposed(self):
        for path in (
            "/api/runs",
            "/api/runs/run-1/rerun",
            "/api/runs/run-1/regrade",
        ):
            status, error = self.request("POST", path, {"skill": "skill"})
            self.assertEqual(status, 404)
            self.assertEqual(error["error"], "not found")

    def test_rejects_non_local_host_and_origin(self):
        status, error = self.request("GET", "/api/skills", headers={"Host": "attacker.example"})
        self.assertEqual(status, 403)
        self.assertIn("local requests", error["error"])

        status, _error = self.request(
            "POST",
            "/api/annotations",
            {"skill": "skill", "run": "run-1", "trial_id": "a.current.t1", "note": "x"},
            headers={"Origin": "https://attacker.example"},
        )
        self.assertEqual(status, 403)

        port = self.server.server_address[1]
        status, result = self.request(
            "POST",
            "/api/annotations",
            {"skill": "skill", "run": "run-1", "trial_id": "a.current.t1", "note": "local"},
            headers={"Origin": f"http://localhost:{port}"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["annotation"]["note"], "local")

    def test_discovery_includes_agents_tmp_but_skips_metaskill(self):
        private = self.root / ".agents" / "tmp" / "skill"
        private.mkdir(parents=True)
        (private / "SKILL.md").write_text('---\nname: private\ndescription: "Private fixture."\n---\n')
        case = private / "evals" / "private-case"
        case.mkdir(parents=True)
        (case / "task.md").write_text("Do private work\n")
        write(case / "criteria.json", {"context": "Private", "type": "weighted_checklist", "checklist": [{"name": "works", "description": "It works", "max_score": 1, "category": "INTENT"}]})
        write(case / "scenario.json", {"type": "capability"})
        hidden = self.root / ".hidden" / "snapshot"
        hidden.mkdir(parents=True)
        (hidden / "SKILL.md").write_text('---\nname: hidden\ndescription: "Hidden snapshot."\n---\n')
        names = {row["name"] for row in discover_skills(self.root)}
        self.assertIn("private", names)
        self.assertNotIn("hidden", names)

    def test_discovery_lists_adhoc_runs_without_authored_suite(self):
        skill = self.root / "adhoc-only"
        skill.mkdir()
        (skill / "SKILL.md").write_text(
            '---\nname: adhoc-only\ndescription: "Use for ad hoc discovery tests."\n---\n'
        )
        run = skill / ".adhoc-only" / "runs" / "run-adhoc"
        write(
            run / "run.json",
            {
                "schema_version": 2,
                "run_id": "run-adhoc",
                "planning_error": "fixture stopped before execution",
                "task_executor": {"kind": "native_subagent", "provenance": "inherited"},
                "judge_executor": None,
                "candidates": [],
                "trials": [],
            },
        )

        row = next(item for item in discover_skills(self.root) if item["name"] == "adhoc-only")
        self.assertFalse(row["suite_ready"])
        self.assertEqual(row["run_count"], 1)


if __name__ == "__main__":
    unittest.main()
