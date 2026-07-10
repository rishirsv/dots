"""Filesystem-backed local workbench server."""

import argparse
import json
import mimetypes
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from ..errors import CliError
from ..grading import grade_run, is_recorded_human_grade, record_human_grade
from ..ids import require_id, run_id, utc_now
from ..io import read_json, write_json
from ..manifest import DEFAULT_EVALS, load_manifest, project_from_suite, workbench_from_suite
from ..linting import FATAL_SUITE_WARNINGS, lint_suite
from ..manifest import select_candidates, select_cases, split_csv_or_repeat
from ..profiles import apply_profile
from ..report import build_report, build_suite_report, list_runs, write_report
from .queue import (
    build_pairwise_packet,
    build_pairwise_queue,
    build_queue,
    pairwise_artifact_path,
    record_pairwise_review,
)
from ..runner import run_eval
from ..run_inputs import validate_grading_inputs
from ..workbench_paths import evals_path, parse_frontmatter, runs_path, skill_id_for_target, worktrees_path

APP_PATH = Path(__file__).with_name("app.html")
ANNOTATION_TAGS = {
    "taste-rule", "one-off", "task-defect", "grader-defect", "harness-error",
    "environment-failure", "candidate-failure", "expected-change",
}
ANNOTATION_ARTIFACTS = {"response", "transcript", "task", "artifact"}
FILE_LIMIT = 60000
LOCAL_HOSTS = {"127.0.0.1", "localhost", "::1"}


def _local_authority(value, port, *, require_http=False):
    if not value:
        return False
    try:
        parsed = urlparse(value if "://" in value else f"//{value}")
        parsed_port = parsed.port
    except ValueError:
        return False
    if require_http and parsed.scheme != "http":
        return False
    return parsed.hostname in LOCAL_HOSTS and parsed_port == port


def _text(path, limit=FILE_LIMIT):
    path = Path(path)
    return path.read_text(errors="replace")[:limit] if path.is_file() else None


def artifact_entries(path):
    root = Path(path)
    rows = []
    if not root.is_dir():
        return rows
    for item in sorted(root.rglob("*")):
        if not item.is_file():
            continue
        rel = item.relative_to(root).as_posix()
        mime = mimetypes.guess_type(item.name)[0] or "application/octet-stream"
        inline = mime.startswith("text/") or mime in {
            "application/json", "application/pdf", "image/png", "image/jpeg", "image/webp"
        }
        if mime in {"text/html", "image/svg+xml"}:
            inline = False
        rows.append({"path": rel, "mime": mime, "bytes": item.stat().st_size, "inline": inline})
    return rows


def _event_text(payload):
    if isinstance(payload, str):
        return payload
    if not isinstance(payload, dict):
        return ""
    item = payload.get("item")
    if isinstance(item, dict):
        for key in ("text", "command", "output", "name", "type"):
            value = item.get(key)
            if isinstance(value, str) and value.strip():
                return value
    for key in ("text", "message", "delta"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value
    return json.dumps(payload, sort_keys=True)[:400]


def transcript_digest(path):
    items = []
    total = 0
    if Path(path).is_file():
        for line in Path(path).read_text(errors="replace").splitlines():
            if not line.strip():
                continue
            total += 1
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            method = str(row.get("method") or "event")
            if "delta" not in method and len(items) < 120:
                items.append({"method": method, "text": _event_text(row.get("payload"))[:400]})
    return {"total": total, "shown": len(items), "items": items}


def discover_skills(root):
    root = Path(root).resolve()
    skill_files = []
    if (root / "SKILL.md").is_file():
        skill_files.append(root / "SKILL.md")
    for path in root.rglob("SKILL.md"):
        relative = path.relative_to(root)
        if any(part.startswith(".") for part in relative.parts[:-1]) or any(
            part in {"node_modules", "__pycache__", "cache"} for part in relative.parts
        ):
            continue
        if path not in skill_files:
            skill_files.append(path)
    rows = []
    for skill_md in sorted(skill_files):
        skill_dir = skill_md.parent
        relative = skill_dir.relative_to(root).as_posix() or "."
        metadata = parse_frontmatter(skill_md)
        suite = evals_path(skill_dir)
        manifest = None
        suite_error = None
        if suite.is_file():
            try:
                manifest = load_manifest(suite)
            except CliError as exc:
                suite_error = exc.message
        skill_runs_root = runs_path(skill_dir, root=root)
        runs = (
            list_runs(
                str(suite), blind_pending_human=True, runs_root=skill_runs_root
            )["runs"]
            if suite.is_file() and suite_error is None
            else []
        )
        latest = runs[0] if runs else None
        rows.append(
            {
                "id": relative,
                "name": metadata.get("name") or skill_dir.name,
                "description": metadata.get("description") or "",
                "path": str(skill_dir),
                "skill_id": skill_id_for_target(skill_dir, root=root),
                "suite": str(suite),
                "runs_root": str(skill_runs_root),
                "suite_ready": manifest is not None,
                "suite_error": suite_error,
                "eval_count": len((manifest or {}).get("evals") or []),
                "profiles": sorted(((manifest or {}).get("profiles") or {}).keys()),
                "run_count": len(runs),
                "latest_run": latest,
                "attention": (latest or {}).get("totals", {}).get("failed", 0)
                + (latest or {}).get("totals", {}).get("inconclusive", 0),
            }
        )
    return rows


def _human_graders(case):
    rows = []
    for index, grader in enumerate(case.get("graders") or [], 1):
        if grader.get("kind") != "human":
            continue
        grader_id = grader.get("id") or f"human-{index}"
        rows.append({**grader, "kind": "human", "id": grader_id, "metric": grader.get("metric") or grader_id})
    return rows


def build_trial_packet(run_dir, trial_id):
    report = build_report(str(run_dir), blind_pending_human=True)
    trial = next((row for row in report["trials"] if row["trial_id"] == trial_id), None)
    if trial is None:
        raise CliError(f"trial not found in run: {trial_id}", 2)
    suite = read_json(Path(run_dir) / "inputs" / "suite.json")
    case = next((row for row in suite.get("evals", []) if row.get("id") == trial.get("eval_id")), {})
    case_root = Path(run_dir) / "inputs" / "cases" / str(trial.get("eval_id"))
    recorded = [row for row in trial["grades"] if is_recorded_human_grade(row)]
    recorded_keys = {((row.get("grader") or {}).get("id"), row.get("metric")) for row in recorded}
    declared = _human_graders(case)
    grader = next((row for row in declared if (row["id"], row["metric"]) not in recorded_keys), None)
    grader = grader or (declared[0] if declared else None)
    selected_grade = next(
        (row for row in recorded if grader and (row.get("grader") or {}).get("id") == grader["id"] and row.get("metric") == grader["metric"]),
        None,
    )
    visible_grades = (
        [row for row in trial["grades"] if (row.get("grader") or {}).get("kind") != "model"]
        if declared
        else trial["grades"]
    )
    expected = case_root / "expected.md"
    judge_paths = [case_root / grader.get("path") for grader in case.get("graders") or [] if grader.get("kind") == "model" and grader.get("path")]
    return {
        "run_id": report["run_id"],
        "trial": {key: value for key, value in trial.items() if key not in {"grades", "disagreements"}},
        "task": _text(case_root / "task.md"),
        "response": _text(trial["response_path"]),
        "artifacts": artifact_entries(trial["artifacts_path"]),
        "transcript": transcript_digest(trial["events_path"]),
        "expected": _text(expected),
        "judge_guidance": _text(judge_paths[0]) if judge_paths else None,
        "expectations": case.get("expectations") or [],
        "grades": visible_grades,
        "human_grader": grader,
        "human_grade": selected_grade,
        "human_recorded": selected_grade is not None,
        "annotations": (trial.get("review") or {}).get("annotations") or [],
    }


def build_judge_reveal(run_dir, trial_id):
    packet = build_trial_packet(run_dir, trial_id)
    if not packet["human_recorded"]:
        raise CliError("record a human grade before revealing the model judge", 2)
    report = build_report(str(run_dir))
    trial = next(row for row in report["trials"] if row["trial_id"] == trial_id)
    return {
        "run_id": report["run_id"],
        "trial_id": trial_id,
        "grades": [row for row in trial["grades"] if (row.get("grader") or {}).get("kind") == "model"],
        "disagreements": trial["disagreements"],
    }


def _run_args(body):
    def number(name, default=None, minimum=0):
        value = body.get(name)
        if value in (None, ""):
            return default
        try:
            value = int(value)
        except (TypeError, ValueError):
            raise CliError(f"{name} must be an integer", 2)
        if value < minimum:
            raise CliError(f"{name} must be at least {minimum}", 2)
        return value

    candidates = body.get("candidates")
    if isinstance(candidates, list):
        candidates = ",".join(str(value) for value in candidates)
    return argparse.Namespace(
        suite=body.get("suite"), profile=body.get("profile"), candidates=candidates,
        split=body.get("split"), case=body.get("case") or body.get("case_ids"), type=body.get("type"),
        repetitions=number("repetitions", None, 1), repetitions_by_type={}, profile_default_repetitions=None,
        model=body.get("model"), parallel=number("parallel", 1, 1), timeout=number("timeout", None, 1),
        no_baseline=bool(body.get("no_baseline")), no_grade=bool(body.get("no_grade")),
        baseline=body.get("baseline"), objective=body.get("objective"),
        human_review_sample=number("human_review_sample", None, 0), source_run_id=body.get("source_run_id"),
        adhoc=bool(body.get("adhoc")), task=body.get("task"), skill=body.get("skill_path"),
        expected_output=body.get("expected_output"), expectations=body.get("expectations") or [],
        graders=body.get("graders") or [], adhoc_type=body.get("eval_type"), priority=body.get("priority"),
    )


class Handler(BaseHTTPRequestHandler):
    server_version = "metaskill-workbench"

    def log_message(self, *_args):
        pass

    def _json(self, data, status=200):
        body = json.dumps(data, sort_keys=True).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _error(self, message, status=400):
        self._json({"ok": False, "error": message}, status)

    def _send_file(self, path, mime, inline):
        body = Path(path).read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        disposition = "inline" if inline else "attachment"
        self.send_header("Content-Disposition", f'{disposition}; filename="{Path(path).name}"')
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        try:
            value = json.loads(self.rfile.read(int(self.headers.get("Content-Length") or 0)) or b"{}")
        except json.JSONDecodeError:
            raise CliError("request body must be valid JSON", 2)
        if not isinstance(value, dict):
            raise CliError("request body must be a JSON object", 2)
        return value

    def _local_request_allowed(self):
        port = self.server.server_address[1]
        if not _local_authority(self.headers.get("Host"), port):
            return False
        origin = self.headers.get("Origin")
        return not origin or _local_authority(origin, port, require_http=True)

    def _skills(self):
        return discover_skills(self.server.root)

    def _skill(self, skill_id):
        skill = next((row for row in self._skills() if row["id"] == skill_id), None)
        if skill is None:
            raise CliError(f"skill not found: {skill_id}", 2)
        return skill

    def _run_dir(self, skill_id, run_id_value):
        skill = self._skill(skill_id)
        root = runs_path(skill["path"], root=self.server.root).resolve()
        candidate = (root / run_id_value).resolve()
        if candidate.parent != root or not (candidate / "run.json").is_file():
            raise CliError(f"run not found: {run_id_value}", 2)
        return candidate

    def _query(self, query, name):
        return (query.get(name) or [""])[0]

    def do_GET(self):
        if not self._local_request_allowed():
            return self._error("workbench accepts local requests only", 403)
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.split("/") if part]
        query = parse_qs(parsed.query)
        try:
            if not parts:
                body = APP_PATH.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                return self.wfile.write(body)
            if parts == ["api", "skills"]:
                return self._json({"ok": True, "root": str(self.server.root), "skills": self._skills()})
            if len(parts) == 4 and parts[:2] == ["api", "skills"] and parts[3] == "suite":
                skill = self._skill(parts[2])
                suite = build_suite_report(
                    skill["suite"],
                    runs_root=runs_path(skill["path"], root=self.server.root),
                )
                suite["data_boundary"] = {
                    "runner": "codex_app_server",
                    "storage_root": str(Path(self.server.root) / ".metaskill"),
                    "sandbox": "workspace_write",
                    "approval_policy": "deny_all",
                    "tools": "Codex runtime defaults; MetaSkill does not enumerate them",
                    "network": "Codex runtime default; MetaSkill does not constrain it",
                    "external_model_boundary": True,
                }
                return self._json(suite)
            if len(parts) == 4 and parts[:2] == ["api", "skills"] and parts[3] == "runs":
                skill = self._skill(parts[2])
                return self._json(
                    list_runs(
                        skill["suite"],
                        blind_pending_human=True,
                        runs_root=runs_path(skill["path"], root=self.server.root),
                    )
                )
            if len(parts) == 3 and parts[:2] == ["api", "runs"]:
                run_dir = self._run_dir(self._query(query, "skill"), parts[2])
                return self._json(build_report(str(run_dir), blind_pending_human=True))
            if len(parts) == 4 and parts[:2] == ["api", "runs"] and parts[3] == "queue":
                run_dir = self._run_dir(self._query(query, "skill"), parts[2])
                return self._json({"ok": True, "run_id": parts[2], "queue": build_queue(run_dir)})
            if len(parts) == 4 and parts[:2] == ["api", "runs"] and parts[3] == "pairs":
                run_dir = self._run_dir(self._query(query, "skill"), parts[2])
                return self._json(build_pairwise_queue(run_dir))
            if len(parts) == 3 and parts[:2] == ["api", "trials"]:
                run_dir = self._run_dir(self._query(query, "skill"), self._query(query, "run"))
                return self._json(build_trial_packet(run_dir, parts[2]))
            if len(parts) == 4 and parts[:2] == ["api", "trials"] and parts[3] == "judge":
                run_dir = self._run_dir(self._query(query, "skill"), self._query(query, "run"))
                return self._json(build_judge_reveal(run_dir, parts[2]))
            if len(parts) == 3 and parts[:2] == ["api", "comparisons"]:
                run_dir = self._run_dir(self._query(query, "skill"), self._query(query, "run"))
                return self._json(build_pairwise_packet(run_dir, parts[2]))
            if len(parts) >= 4 and parts[:2] == ["api", "artifacts"]:
                run_dir = self._run_dir(self._query(query, "skill"), self._query(query, "run"))
                trial_id_value = parts[2]
                artifact_root = (Path(run_dir) / "trials" / trial_id_value / "artifacts").resolve()
                relative = Path(*parts[3:])
                artifact = (artifact_root / relative).resolve()
                if not artifact.is_relative_to(artifact_root) or not artifact.is_file():
                    raise CliError("artifact not found", 2)
                mime = mimetypes.guess_type(artifact.name)[0] or "application/octet-stream"
                inline = mime.startswith("text/") or mime in {
                    "application/json", "application/pdf", "image/png", "image/jpeg", "image/webp"
                }
                if mime in {"text/html", "image/svg+xml"}:
                    inline = False
                return self._send_file(artifact, mime, inline)
            if len(parts) >= 5 and parts[:2] == ["api", "comparison-artifacts"]:
                run_dir = self._run_dir(self._query(query, "skill"), self._query(query, "run"))
                artifact = pairwise_artifact_path(run_dir, parts[2], parts[3], Path(*parts[4:]))
                mime = mimetypes.guess_type(artifact.name)[0] or "application/octet-stream"
                inline = mime.startswith("text/") or mime in {
                    "application/json", "application/pdf", "image/png", "image/jpeg", "image/webp"
                }
                if mime in {"text/html", "image/svg+xml"}:
                    inline = False
                return self._send_file(artifact, mime, inline)
            return self._error("not found", 404)
        except CliError as exc:
            return self._error(exc.message)

    def do_POST(self):
        if not self._local_request_allowed():
            return self._error("workbench accepts local requests only", 403)
        parts = [unquote(part) for part in urlparse(self.path).path.split("/") if part]
        try:
            body = self._body()
            if parts == ["api", "grades"]:
                return self._post_grade(body)
            if parts == ["api", "annotations"]:
                return self._post_annotation(body)
            if parts == ["api", "pairwise"]:
                return self._post_pairwise(body)
            if parts == ["api", "evals"]:
                return self._post_eval(body)
            if parts == ["api", "runs"]:
                return self._post_run(body)
            if len(parts) == 4 and parts[:2] == ["api", "runs"] and parts[3] == "regrade":
                return self._post_regrade(parts[2], body)
            return self._error("not found", 404)
        except CliError as exc:
            return self._error(exc.message)

    def _post_grade(self, body):
        run_dir = self._run_dir(str(body.get("skill") or ""), str(body.get("run") or ""))
        packet = build_trial_packet(run_dir, str(body.get("trial_id") or ""))
        grader = packet.get("human_grader")
        if grader is None:
            raise CliError("trial has no declared human grader", 2)
        with self.server.write_lock:
            result = record_human_grade(
                str(run_dir), trial_id=packet["trial"]["trial_id"], grader_id=grader["id"],
                metric=grader["metric"], label=str(body.get("label") or ""), score=body.get("score"),
                rationale=str(body.get("rationale") or ""),
            )
        return self._json({"ok": True, "grade": result["grade"]})

    def _post_annotation(self, body):
        run_dir = self._run_dir(str(body.get("skill") or ""), str(body.get("run") or ""))
        trial_id = str(body.get("trial_id") or "")
        packet = build_trial_packet(run_dir, trial_id)
        artifact = body.get("artifact")
        tag = body.get("tag")
        note = str(body.get("note") or "").strip()
        if artifact not in ANNOTATION_ARTIFACTS or tag not in ANNOTATION_TAGS or not note:
            raise CliError("annotation requires a valid artifact, tag, and note", 2)
        row = {"artifact": artifact, "tag": tag, "note": note, "timestamp": utc_now()}
        trial_dir = Path(run_dir) / "trials" / packet["trial"]["trial_id"]
        review_path = trial_dir / "review.json"
        with self.server.write_lock:
            review = read_json(review_path) if review_path.exists() else {"annotations": []}
            review.setdefault("annotations", []).append(row)
            write_json(review_path, review)
            write_report(build_report(str(run_dir)))
        return self._json({"ok": True, "annotation": row})

    def _post_pairwise(self, body):
        run_dir = self._run_dir(str(body.get("skill") or ""), str(body.get("run") or ""))
        with self.server.write_lock:
            result = record_pairwise_review(
                run_dir,
                str(body.get("comparison_id") or ""),
                str(body.get("preferred") or ""),
                str(body.get("reason") or ""),
                str(body.get("rationale") or ""),
            )
        return self._json(result)

    def _post_eval(self, body):
        if body.get("approved") is not True:
            raise CliError("promoting an eval requires approved=true", 2)
        skill = self._skill(str(body.get("skill") or ""))
        suite_path_value = Path(skill["suite"])
        if suite_path_value.is_file():
            manifest = load_manifest(suite_path_value)
        else:
            manifest = json.loads(json.dumps(DEFAULT_EVALS))
            manifest["skill_name"] = skill["name"]
            manifest["target"] = {"type": "skill", "ref": "SKILL.md"}
        case_id = require_id("case id", body.get("id"))
        if any(case.get("id") == case_id for case in manifest.get("evals") or []):
            raise CliError(f"duplicate case id: {case_id}", 2)
        prompt = str(body.get("prompt") or "").strip()
        source_annotations = []
        if not prompt and body.get("run") and body.get("trial_id"):
            run_dir = self._run_dir(skill["id"], str(body.get("run")))
            packet = build_trial_packet(run_dir, str(body.get("trial_id")))
            prompt = str(packet.get("task") or "").strip()
            if body.get("include_annotations"):
                source_annotations = list(packet.get("annotations") or [])
        if not prompt:
            raise CliError("promoted eval requires a prompt or source trial", 2)
        case = {
            "id": case_id,
            "type": body.get("type") or "regression",
            "priority": body.get("priority") or "medium",
            "prompt": prompt,
            "expectations": list(body.get("expectations") or []),
            "graders": list(body.get("graders") or []),
        }
        if body.get("expected_output") is not None:
            case["expected_output"] = str(body.get("expected_output"))
        if source_annotations:
            case["annotations"] = source_annotations
        updated = {**manifest, "evals": [*(manifest.get("evals") or []), case]}
        suite_path_value.parent.mkdir(parents=True, exist_ok=True)
        temp = suite_path_value.with_name(".evals.json.tmp")
        with self.server.write_lock:
            write_json(temp, updated)
            try:
                load_manifest(temp)
                temp.replace(suite_path_value)
            finally:
                if temp.exists():
                    temp.unlink()
        return self._json({"ok": True, "suite": str(suite_path_value), "eval": case}, 201)

    def _post_run(self, body):
        skill = self._skill(str(body.get("skill") or ""))
        if body.get("adhoc"):
            args = _run_args({**body, "skill_path": skill["path"], "adhoc": True})
            if not str(args.task or "").strip():
                raise CliError("ad hoc eval requires a task", 2)
            rid = run_id()
            thread = threading.Thread(target=self.server.run_background, args=(args, None, rid), daemon=True)
            thread.start()
            return self._json({"ok": True, "run_id": rid}, 202)
        if not skill["suite_ready"]:
            raise CliError("skill has no valid eval suite", 2)
        args = _run_args({**body, "suite": skill["suite"]})
        manifest = load_manifest(Path(skill["suite"]))
        apply_profile(args, manifest, args.profile)
        lint = lint_suite(skill["suite"])
        fatal = [row for row in lint["warnings"] if row.get("kind") in FATAL_SUITE_WARNINGS]
        if fatal:
            raise CliError(f"suite lint blocks the run: {fatal[0]['kind']}", 2)
        selected = select_cases(
            manifest, args.split, case_ids=split_csv_or_repeat(args.case), case_types=split_csv_or_repeat(args.type)
        )
        select_candidates(
            manifest,
            args.candidates,
            include_baseline=not args.no_baseline,
            baseline_id=args.baseline,
        )
        validate_grading_inputs(selected, grading_enabled=not args.no_grade)
        context = {
            "manifest": manifest, "suite": Path(skill["suite"]),
            "workbench": workbench_from_suite(Path(skill["suite"])),
            "project": project_from_suite(Path(skill["suite"])),
            "skill_id": skill["id"],
            "runs_root": runs_path(skill["path"], root=self.server.root),
            "worktrees_root": worktrees_path(skill["path"], root=self.server.root),
            "adhoc": False,
        }
        rid = run_id()
        thread = threading.Thread(target=self.server.run_background, args=(args, context, rid), daemon=True)
        thread.start()
        return self._json({"ok": True, "run_id": rid}, 202)

    def _post_regrade(self, run_id_value, body):
        run_dir = self._run_dir(str(body.get("skill") or ""), run_id_value)
        if not build_report(str(run_dir))["terminal"]:
            raise CliError("wait for the run to finish before regrading", 2)
        thread = threading.Thread(
            target=self.server.regrade_background,
            args=(run_dir, int(body.get("parallel") or 1), body.get("model")), daemon=True,
        )
        thread.start()
        return self._json({"ok": True, "run_id": run_id_value}, 202)


def create_server(root, port=7333):
    root = Path(root).resolve()
    if not root.is_dir():
        raise CliError(f"workbench root not found: {root}", 2)
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    server.root = root
    server.write_lock = threading.Lock()

    def run_background(args, context, rid):
        try:
            run_eval(args, context=context, run_id_value=rid)
        except Exception as exc:
            runs_root = (
                Path(context["runs_root"])
                if context is not None
                else runs_path(args.skill, root=server.root)
            )
            run_dir = runs_root / rid
            if not (run_dir / "run.json").exists():
                write_json(
                    run_dir / "run.json",
                    {
                        "schema_version": 2,
                        "run_id": rid,
                        "created_at": utc_now(),
                        "adhoc": bool(getattr(args, "adhoc", False)),
                        "skill_id": skill_id_for_target(
                            context["project"] if context is not None else args.skill,
                            root=server.root,
                        ),
                        "suite": str(context["suite"]) if context is not None else str(evals_path(args.skill)),
                        "planning_error": str(exc),
                        "runner": {"grading": False},
                        "candidates": [],
                        "trials": [],
                    },
                )
            return

    def regrade_background(run_dir, parallel, model):
        try:
            grade_run(str(run_dir), parallel=parallel, model=model)
        except Exception:
            return

    server.run_background = run_background
    server.regrade_background = regrade_background
    return server


def run_workbench_server(root, port=7333, open_browser=True):
    server = create_server(root, port)
    url = f"http://127.0.0.1:{server.server_address[1]}/"
    print(f"MetaSkill workbench listening at {url} (ctrl-c to stop)")
    if open_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
